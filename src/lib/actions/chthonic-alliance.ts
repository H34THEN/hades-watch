"use server";

import { revalidatePath } from "next/cache";
import type { FactionPosition } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { requireAuth } from "@/lib/auth/session";
import { isAdmin, isOwner } from "@/lib/auth/roles";
import { ALLIANCE_SLUG } from "@/lib/factions/chthonic-data";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export type ActionResult = { success: true } | { success: false; error: string };

const ARCHIVIST_TITLE = "The Archivist";
const OWNER_ALLIANCE_REPUTATION = 9999;

async function requireOwnerAlliance() {
  const user = await requireAuth();
  if (!isOwner(user.roles)) {
    return { ok: false as const, error: "Only the Archivist may confer Chthonic Uprising membership." };
  }
  return { ok: true as const, user };
}

async function getAllianceFaction() {
  return prisma.faction.findUnique({ where: { slug: ALLIANCE_SLUG } });
}

const positionSchema = z.enum([
  "INITIATE",
  "MEMBER",
  "SPECIALIST",
  "CELL_LEAD",
  "LIEUTENANT",
  "LEADER",
]);

export async function getChthonicAllianceMembers() {
  const user = await requireAuth();
  if (!isAdmin(user.roles)) return null;

  const alliance = await getAllianceFaction();
  if (!alliance) return { members: [], allianceId: null, isOwner: isOwner(user.roles), assignableUsers: [] };

  const memberships = await prisma.factionMembership.findMany({
    where: { factionId: alliance.id, status: "Approved" },
    orderBy: [{ position: "desc" }, { reputation: "desc" }, { createdAt: "asc" }],
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          accountStatus: true,
          userRoles: { include: { role: true } },
          factionMemberships: {
            where: { status: "Approved", faction: { isAlliance: false } },
            include: { faction: { select: { name: true, slug: true } } },
          },
        },
      },
    },
  });

  return {
    allianceId: alliance.id,
    isOwner: isOwner(user.roles),
    assignableUsers: await prisma.user.findMany({
      where: {
        accountStatus: "Approved",
        NOT: {
          factionMemberships: {
            some: { factionId: alliance.id, status: "Approved" },
          },
        },
      },
      select: { id: true, email: true, name: true },
      orderBy: { email: "asc" },
      take: 100,
    }),
    members: memberships.map((m) => {
      const primaryCell =
        m.user.factionMemberships.find((fm) => fm.isPrimary) ??
        m.user.factionMemberships[0] ??
        null;
      return {
        id: m.id,
        userId: m.user.id,
        userName: m.user.name ?? m.user.email,
        email: m.user.email,
        accountStatus: m.user.accountStatus,
        siteRole: m.user.userRoles[0]?.role.name ?? "Guest",
        position: m.position,
        displayTitle: m.displayTitle,
        reputation: m.reputation,
        isPrimary: m.isPrimary,
        joinedAt: m.createdAt,
        primaryCell: primaryCell
          ? { name: primaryCell.faction.name, slug: primaryCell.faction.slug }
          : null,
      };
    }),
  };
}

export async function assignChthonicAllianceAction(
  userId: string,
  position: FactionPosition,
  displayTitle?: string,
  reputation?: number,
): Promise<ActionResult> {
  const gate = await requireOwnerAlliance();
  if (!gate.ok) return { success: false, error: gate.error };

  const alliance = await getAllianceFaction();
  if (!alliance) return { success: false, error: "Chthonic Uprising alliance not seeded." };

  const parsedPosition = positionSchema.safeParse(position);
  if (!parsedPosition.success) return { success: false, error: "Invalid position." };

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      factionMemberships: {
        where: { status: "Approved" },
        include: { faction: true },
      },
    },
  });
  if (!targetUser) return { success: false, error: "User not found." };

  const hasPrimaryCell = targetUser.factionMemberships.some(
    (m) => m.isPrimary && !m.faction.isAlliance,
  );

  await prisma.factionMembership.upsert({
    where: { userId_factionId: { userId, factionId: alliance.id } },
    create: {
      userId,
      factionId: alliance.id,
      status: "Approved",
      position: parsedPosition.data,
      displayTitle: displayTitle?.trim() || null,
      reputation: reputation ?? 0,
      isPrimary: !hasPrimaryCell,
    },
    update: {
      status: "Approved",
      position: parsedPosition.data,
      displayTitle: displayTitle?.trim() || null,
      reputation: reputation ?? undefined,
      isPrimary: !hasPrimaryCell ? true : undefined,
    },
  });

  await writeAuditLog({
    action: "alliance.membership.assign",
    actorId: gate.user.id,
    targetType: "user",
    targetId: userId,
    metadata: { factionSlug: ALLIANCE_SLUG, position: parsedPosition.data },
  });

  revalidatePath("/admin/factions/command");
  revalidatePath("/profile");
  revalidatePath("/mmo/factions/chthonic-uprising");
  return { success: true };
}

export async function removeChthonicAllianceAction(userId: string): Promise<ActionResult> {
  const gate = await requireOwnerAlliance();
  if (!gate.ok) return { success: false, error: gate.error };

  const alliance = await getAllianceFaction();
  if (!alliance) return { success: false, error: "Chthonic Uprising alliance not seeded." };

  await prisma.factionMembership.updateMany({
    where: { userId, factionId: alliance.id },
    data: { status: "Left", isPrimary: false },
  });

  await writeAuditLog({
    action: "alliance.membership.remove",
    actorId: gate.user.id,
    targetType: "user",
    targetId: userId,
    metadata: { factionSlug: ALLIANCE_SLUG },
  });

  revalidatePath("/admin/factions/command");
  revalidatePath("/profile");
  return { success: true };
}

export async function updateChthonicAllianceMembershipAction(
  membershipId: string,
  data: {
    position?: FactionPosition;
    displayTitle?: string;
    reputation?: number;
    isPrimary?: boolean;
  },
): Promise<ActionResult> {
  const gate = await requireOwnerAlliance();
  if (!gate.ok) return { success: false, error: gate.error };

  const membership = await prisma.factionMembership.findUnique({
    where: { id: membershipId },
    include: { faction: true },
  });
  if (!membership || membership.faction.slug !== ALLIANCE_SLUG) {
    return { success: false, error: "Alliance membership not found." };
  }

  if (data.position) {
    const parsed = positionSchema.safeParse(data.position);
    if (!parsed.success) return { success: false, error: "Invalid position." };
  }

  if (data.isPrimary) {
    await prisma.factionMembership.updateMany({
      where: { userId: membership.userId },
      data: { isPrimary: false },
    });
  }

  await prisma.factionMembership.update({
    where: { id: membershipId },
    data: {
      position: data.position,
      displayTitle: data.displayTitle?.trim() || undefined,
      reputation: data.reputation,
      isPrimary: data.isPrimary,
    },
  });

  revalidatePath("/admin/factions/command");
  revalidatePath("/profile");
  return { success: true };
}

export async function seedOwnerAllianceMemberships() {
  const alliance = await getAllianceFaction();
  if (!alliance) return;

  const owners = await prisma.user.findMany({
    where: { userRoles: { some: { role: { name: "Owner" } } } },
    include: {
      factionMemberships: {
        where: { status: "Approved", faction: { isAlliance: false } },
      },
    },
  });

  for (const owner of owners) {
    const hasPrimaryCell = owner.factionMemberships.some((m) => m.isPrimary);
    await prisma.factionMembership.upsert({
      where: { userId_factionId: { userId: owner.id, factionId: alliance.id } },
      create: {
        userId: owner.id,
        factionId: alliance.id,
        status: "Approved",
        position: "LEADER",
        displayTitle: ARCHIVIST_TITLE,
        reputation: OWNER_ALLIANCE_REPUTATION,
        isPrimary: !hasPrimaryCell,
      },
      update: {
        status: "Approved",
        position: "LEADER",
        displayTitle: ARCHIVIST_TITLE,
        reputation: OWNER_ALLIANCE_REPUTATION,
      },
    });
  }
}
