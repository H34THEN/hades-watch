"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { requireAuth } from "@/lib/auth/session";
import { requireAdminUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { z } from "zod";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

const characterSchema = z.object({
  callsign: z.string().min(2).max(32).regex(/^[A-Za-z0-9_-]+$/),
  pronouns: z.string().max(32).optional(),
  bio: z.string().max(2000).optional(),
  archetype: z.string().max(64).optional(),
  factionId: z.string().optional().or(z.literal("")),
  isPublic: z.coerce.boolean().optional(),
});

export async function getUserCharacter(userId: string) {
  return prisma.character.findUnique({
    where: { userId },
    include: { faction: true },
  });
}

export async function upsertCharacterAction(
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireAuth();
  const parsed = characterSchema.safeParse({
    callsign: formData.get("callsign"),
    pronouns: formData.get("pronouns") || undefined,
    bio: formData.get("bio") || undefined,
    archetype: formData.get("archetype") || undefined,
    factionId: formData.get("factionId") || undefined,
    isPublic: formData.get("isPublic") === "on",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const existing = await prisma.character.findUnique({
    where: { userId: user.id },
  });

  const data = {
    callsign: parsed.data.callsign,
    pronouns: parsed.data.pronouns ?? null,
    bio: parsed.data.bio ?? null,
    archetype: parsed.data.archetype ?? null,
    factionId: parsed.data.factionId?.trim() || null,
    isPublic: parsed.data.isPublic ?? true,
  };

  if (existing) {
    await prisma.character.update({ where: { userId: user.id }, data });
    await writeAuditLog({
      action: "character.update",
      actorId: user.id,
      targetType: "character",
      targetId: existing.id,
    });
  } else {
    const char = await prisma.character.create({
      data: { userId: user.id, ...data },
    });
    await writeAuditLog({
      action: "character.create",
      actorId: user.id,
      targetType: "character",
      targetId: char.id,
    });
  }

  revalidatePath("/mmo");
  revalidatePath("/mmo/character");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getFactions() {
  return prisma.faction.findMany({
    where: { isAlliance: false },
    orderBy: { name: "asc" },
    include: { _count: { select: { characters: true, memberships: true } } },
  });
}

export async function getAlliance() {
  return prisma.faction.findFirst({
    where: { isAlliance: true },
    include: {
      cells: {
        where: { isAlliance: false },
        orderBy: { name: "asc" },
        select: { id: true, slug: true, name: true, tagline: true },
      },
    },
  });
}

export async function getFactionsForAdmin() {
  return prisma.faction.findMany({
    where: { isAlliance: false },
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true },
  });
}

export async function getFactionBySlug(slug: string) {
  const faction = await prisma.faction.findUnique({
    where: { slug },
    include: {
      alliance: { select: { name: true, slug: true, motto: true } },
      badgeRecords: { orderBy: { name: "asc" } },
      quests: { where: { status: "Available" } },
      characters: {
        where: { isPublic: true },
        take: 10,
        select: { callsign: true, archetype: true },
      },
      _count: { select: { memberships: true, characters: true } },
    },
  });
  if (!faction || faction.isAlliance) return null;

  const rivalry = faction.rivalrySlug
    ? await prisma.faction.findUnique({
        where: { slug: faction.rivalrySlug },
        select: { name: true, slug: true },
      })
    : null;
  const synergy = faction.synergySlug
    ? await prisma.faction.findUnique({
        where: { slug: faction.synergySlug },
        select: { name: true, slug: true },
      })
    : null;

  return {
    ...faction,
    coreValues: Array.isArray(faction.coreValues)
      ? (faction.coreValues as string[])
      : null,
    palette:
      faction.palette && typeof faction.palette === "object" && !Array.isArray(faction.palette)
        ? (faction.palette as Record<string, string>)
        : null,
    typicalMissions: Array.isArray(faction.typicalMissions)
      ? (faction.typicalMissions as string[])
      : null,
    badges: Array.isArray(faction.badges) ? (faction.badges as string[]) : null,
    titles:
      faction.titles &&
      typeof faction.titles === "object" &&
      !Array.isArray(faction.titles)
        ? (faction.titles as { starting: string; advanced: string[] })
        : null,
    rivalry,
    synergy,
  };
}

export async function requestFactionJoinAction(
  factionId: string,
): Promise<ActionResult> {
  const user = await requireAuth();

  const existing = await prisma.factionMembership.findUnique({
    where: { userId_factionId: { userId: user.id, factionId } },
  });
  if (existing && existing.status !== "Left" && existing.status !== "Rejected") {
    return { success: false, error: "Membership request already exists." };
  }

  await prisma.factionMembership.upsert({
    where: { userId_factionId: { userId: user.id, factionId } },
    create: { userId: user.id, factionId, status: "Pending" },
    update: { status: "Pending" },
  });

  await writeAuditLog({
    action: "faction.join.request",
    actorId: user.id,
    targetType: "faction",
    targetId: factionId,
  });

  revalidatePath("/mmo/factions");
  return { success: true };
}

export async function approveFactionJoinAction(
  membershipId: string,
): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  const membership = await prisma.factionMembership.update({
    where: { id: membershipId },
    data: { status: "Approved" },
    include: { faction: true },
  });

  await prisma.character.updateMany({
    where: { userId: membership.userId },
    data: { factionId: membership.factionId },
  });

  await writeAuditLog({
    action: "faction.join.approve",
    actorId: admin.user.id,
    targetType: "faction",
    targetId: membership.factionId,
    metadata: { userId: membership.userId },
  });

  revalidatePath("/admin/factions");
  revalidatePath("/admin/faction-requests");
  return { success: true };
}

export async function createFactionAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  if (!name || name.length < 2) {
    return { success: false, error: "Name required" };
  }

  await prisma.faction.create({
    data: { name, slug: slugify(name), description: description || null },
  });

  await writeAuditLog({
    action: "faction.create",
    actorId: admin.user.id,
    targetType: "faction",
    targetId: name,
  });

  revalidatePath("/admin/factions");
  revalidatePath("/mmo/factions");
  return { success: true };
}

export async function getAvailableQuests(factionId?: string) {
  return prisma.quest.findMany({
    where: {
      status: "Available",
      ...(factionId ? { factionId } : {}),
    },
    orderBy: { title: "asc" },
    include: { faction: { select: { name: true, slug: true } } },
  });
}

export async function getQuestBySlug(slug: string) {
  return prisma.quest.findUnique({
    where: { slug },
    include: { faction: true },
  });
}

export async function createQuestAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const factionId = (formData.get("factionId") as string) || null;
  const status = (formData.get("status") as string) || "Draft";

  if (!title || !description) {
    return { success: false, error: "Title and description required" };
  }

  const quest = await prisma.quest.create({
    data: {
      title,
      slug: slugify(title),
      description,
      factionId,
      status: status as "Draft" | "Available",
    },
  });

  await writeAuditLog({
    action: "mission.create",
    actorId: admin.user.id,
    targetType: "quest",
    targetId: quest.id,
  });

  revalidatePath("/admin/missions");
  revalidatePath("/mmo/missions");
  return { success: true };
}

export async function getPendingFactionRequests() {
  return prisma.factionMembership.findMany({
    where: { status: "Pending" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true, name: true, character: { select: { callsign: true } } } },
      faction: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function rejectFactionJoinAction(membershipId: string): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  const membership = await prisma.factionMembership.update({
    where: { id: membershipId },
    data: { status: "Rejected" },
  });

  await writeAuditLog({
    action: "faction.join.reject",
    actorId: admin.user.id,
    targetType: "faction",
    targetId: membership.factionId,
    metadata: { userId: membership.userId },
  });

  revalidatePath("/admin/faction-requests");
  revalidatePath("/admin/factions");
  return { success: true };
}

export async function getUserFactionMembership(userId: string, factionId: string) {
  return prisma.factionMembership.findUnique({
    where: { userId_factionId: { userId, factionId } },
  });
}

export async function getUserFactionMemberships(userId: string) {
  return prisma.factionMembership.findMany({
    where: { userId },
    include: { faction: { select: { name: true, slug: true } } },
  });
}

export async function getMissionParticipation(userId: string, questId: string) {
  return prisma.missionParticipation.findUnique({
    where: { userId_questId: { userId, questId } },
  });
}

export async function getUserActiveMissions(userId: string) {
  return prisma.missionParticipation.findMany({
    where: {
      userId,
      status: { in: ["Joined", "InProgress", "Interested"] },
    },
    include: {
      quest: {
        include: { faction: { select: { name: true, slug: true } } },
      },
    },
    orderBy: { joinedAt: "desc" },
  });
}

export async function joinMissionAction(questId: string): Promise<ActionResult> {
  const user = await requireAuth();

  const quest = await prisma.quest.findUnique({ where: { id: questId } });
  if (!quest || quest.status !== "Available") {
    return { success: false, error: "Mission not available." };
  }

  const existing = await prisma.missionParticipation.findUnique({
    where: { userId_questId: { userId: user.id, questId } },
  });

  if (existing && !["Dropped", "Completed"].includes(existing.status)) {
    return { success: false, error: "Already participating in this mission." };
  }

  await prisma.missionParticipation.upsert({
    where: { userId_questId: { userId: user.id, questId } },
    create: { userId: user.id, questId, status: "Joined" },
    update: { status: "Joined", joinedAt: new Date(), completedAt: null },
  });

  await writeAuditLog({
    action: "mission.join",
    actorId: user.id,
    targetType: "quest",
    targetId: questId,
  });

  revalidatePath("/mmo");
  revalidatePath("/mmo/missions");
  return { success: true };
}

export async function leaveMissionAction(questId: string): Promise<ActionResult> {
  const user = await requireAuth();

  const existing = await prisma.missionParticipation.findUnique({
    where: { userId_questId: { userId: user.id, questId } },
  });
  if (!existing || existing.status === "Dropped") {
    return { success: false, error: "Not participating in this mission." };
  }

  await prisma.missionParticipation.update({
    where: { userId_questId: { userId: user.id, questId } },
    data: { status: "Dropped" },
  });

  await writeAuditLog({
    action: "mission.leave",
    actorId: user.id,
    targetType: "quest",
    targetId: questId,
  });

  revalidatePath("/mmo");
  revalidatePath("/mmo/missions");
  return { success: true };
}

export async function completeMissionAction(questId: string): Promise<ActionResult> {
  const user = await requireAuth();

  const existing = await prisma.missionParticipation.findUnique({
    where: { userId_questId: { userId: user.id, questId } },
  });
  if (!existing || !["Joined", "InProgress"].includes(existing.status)) {
    return { success: false, error: "Cannot complete this mission." };
  }

  await prisma.missionParticipation.update({
    where: { userId_questId: { userId: user.id, questId } },
    data: { status: "Completed", completedAt: new Date() },
  });

  await writeAuditLog({
    action: "mission.complete",
    actorId: user.id,
    targetType: "quest",
    targetId: questId,
  });

  revalidatePath("/mmo");
  revalidatePath("/mmo/missions");
  return { success: true };
}

export async function getQuestParticipationCount(questId: string) {
  return prisma.missionParticipation.count({
    where: { questId, status: { in: ["Joined", "InProgress", "Completed"] } },
  });
}

export async function publishQuestAction(id: string): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  await prisma.quest.update({
    where: { id },
    data: { status: "Available" },
  });

  await writeAuditLog({
    action: "mission.update",
    actorId: admin.user.id,
    targetType: "quest",
    targetId: id,
    metadata: { action: "publish" },
  });

  revalidatePath("/admin/missions");
  revalidatePath("/mmo/missions");
  return { success: true };
}
