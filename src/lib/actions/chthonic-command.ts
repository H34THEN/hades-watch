"use server";

import { revalidatePath } from "next/cache";
import type { FactionPosition, RoleName } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import {
  assignUserFactionAction,
  removeUserFactionAction,
  type ActionResult,
} from "@/lib/actions/admin";
import { requireAuth } from "@/lib/auth/session";
import { isAdmin, isOwner } from "@/lib/auth/roles";
import { ALLIANCE_SLUG, CHTHONIC_FACTIONS } from "@/lib/factions/chthonic-data";
import {
  resolveAlliance,
  resolveFactionsList,
  usesCanonicalFallback,
} from "@/lib/factions/resolve";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireChthonicCommandAccess() {
  const user = await requireAuth();
  if (!isAdmin(user.roles)) {
    return { ok: false as const, error: "Unauthorized" };
  }
  return { ok: true as const, user, isOwner: isOwner(user.roles) };
}

async function requireOwnerCommand() {
  const user = await requireAuth();
  if (!isOwner(user.roles)) {
    return { ok: false as const, error: "Owner clearance required." };
  }
  return { ok: true as const, user };
}

export async function getChthonicCommandData() {
  const [factions, alliance, memberships, pendingRequests, unaffiliated, badges] =
    await Promise.all([
      resolveFactionsList(),
      resolveAlliance(),
      prisma.factionMembership.findMany({
        where: { status: "Approved", faction: { isAlliance: false } },
        orderBy: [{ faction: { name: "asc" } }, { createdAt: "asc" }],
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              accountStatus: true,
              isTestAccount: true,
              userRoles: { include: { role: true } },
            },
          },
          faction: { select: { id: true, slug: true, name: true } },
        },
      }),
      prisma.factionMembership.findMany({
        where: { status: "Pending" },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              accountStatus: true,
              isTestAccount: true,
            },
          },
          faction: { select: { id: true, slug: true, name: true } },
        },
      }),
      prisma.user.findMany({
        where: {
          accountStatus: "Approved",
          factionMemberships: {
            none: { status: "Approved" },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          accountStatus: true,
          isTestAccount: true,
          userRoles: { include: { role: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.badge.findMany({
        include: { faction: { select: { slug: true, name: true } } },
        orderBy: { name: "asc" },
      }),
    ]);

  const dbFactions = await prisma.faction.findMany({
    where: { slug: { in: CHTHONIC_FACTIONS.map((f) => f.slug) } },
    include: {
      _count: {
        select: {
          memberships: true,
          badgeRecords: true,
          quests: true,
        },
      },
      badgeRecords: true,
      quests: { where: { status: "Available" } },
    },
  });

  const dbBySlug = Object.fromEntries(dbFactions.map((f) => [f.slug, f]));

  const factionHealth = factions.map((f) => {
    const db = dbBySlug[f.slug];
    const factionMemberships = memberships.filter((m) => m.faction.slug === f.slug);
    const lieutenants = factionMemberships.filter((m) =>
      ["LIEUTENANT", "LEADER", "CELL_LEAD"].includes(m.position),
    ).length;
    const totalReputation = factionMemberships.reduce((s, m) => s + m.reputation, 0);
    const pending = pendingRequests.filter((p) => p.faction.slug === f.slug).length;

    const warnings: string[] = [];
    if (f.dataSource === "canonical") warnings.push("Not seeded in database");
    if (!f.leaderName) warnings.push("Leader not assigned");
    if (factionMemberships.length === 0) warnings.push("No approved members");

    return {
      ...f,
      dbId: db?.id ?? null,
      memberCount: db?._count.memberships ?? f._count.memberships,
      pendingCount: pending,
      lieutenantCount: lieutenants,
      totalReputation,
      badgeCount:
        db?._count.badgeRecords ??
        (CHTHONIC_FACTIONS.find((c) => c.slug === f.slug)?.badges.length ?? 0),
      missionCount: db?._count.quests ?? 0,
      seeded: !!db,
      warnings,
    };
  });

  return {
    alliance,
    factions: factionHealth,
    memberships: memberships.map((m) => ({
      id: m.id,
      userId: m.user.id,
      userName: m.user.name ?? m.user.email,
      email: m.user.email,
      accountStatus: m.user.accountStatus,
      isTestAccount: m.user.isTestAccount,
      siteRole: (m.user.userRoles[0]?.role.name ?? "Guest") as RoleName,
      factionId: m.faction.id,
      factionName: m.faction.name,
      factionSlug: m.faction.slug,
      position: m.position,
      displayTitle: m.displayTitle,
      reputation: m.reputation,
      isPrimary: m.isPrimary,
      joinedAt: m.createdAt,
    })),
    pendingRequests,
    unaffiliated,
    badges,
    seedWarning: usesCanonicalFallback(factions),
    canonicalSlugs: CHTHONIC_FACTIONS.map((f) => f.slug),
    allianceSlug: ALLIANCE_SLUG,
  };
}

const reputationSchema = z.coerce.number().int().min(0).max(100000);

export async function adjustFactionReputationAction(
  membershipId: string,
  reputation: number,
): Promise<ActionResult> {
  const gate = await requireOwnerCommand();
  if (!gate.ok) return { success: false, error: gate.error };

  const parsed = reputationSchema.safeParse(reputation);
  if (!parsed.success) return { success: false, error: "Invalid reputation value." };

  const membership = await prisma.factionMembership.update({
    where: { id: membershipId },
    data: { reputation: parsed.data },
  });

  await writeAuditLog({
    action: "user.faction.reputation",
    actorId: gate.user.id,
    targetType: "user",
    targetId: membership.userId,
    metadata: { reputation: parsed.data, factionId: membership.factionId },
  });

  revalidatePath("/admin/factions/command");
  revalidatePath("/profile");
  return { success: true };
}

export async function setPrimaryFactionAction(
  userId: string,
  membershipId: string,
): Promise<ActionResult> {
  const gate = await requireOwnerCommand();
  if (!gate.ok) return { success: false, error: gate.error };

  const membership = await prisma.factionMembership.findUnique({
    where: { id: membershipId },
  });
  if (!membership || membership.userId !== userId) {
    return { success: false, error: "Membership not found." };
  }

  await prisma.$transaction([
    prisma.factionMembership.updateMany({
      where: { userId },
      data: { isPrimary: false },
    }),
    prisma.factionMembership.update({
      where: { id: membershipId },
      data: { isPrimary: true },
    }),
    prisma.character.updateMany({
      where: { userId },
      data: { factionId: membership.factionId },
    }),
  ]);

  await writeAuditLog({
    action: "user.faction.primary",
    actorId: gate.user.id,
    targetType: "user",
    targetId: userId,
    metadata: { membershipId, factionId: membership.factionId },
  });

  revalidatePath("/admin/factions/command");
  revalidatePath("/profile");
  return { success: true };
}

export async function awardBadgeAction(
  userId: string,
  badgeId: string,
): Promise<ActionResult> {
  const gate = await requireOwnerCommand();
  if (!gate.ok) return { success: false, error: gate.error };

  const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
  if (!badge) return { success: false, error: "Badge not found." };

  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId } },
    create: { userId, badgeId, awardedById: gate.user.id },
    update: {},
  });

  await writeAuditLog({
    action: "user.badge.award",
    actorId: gate.user.id,
    targetType: "user",
    targetId: userId,
    metadata: { badgeId, badgeSlug: badge.slug },
  });

  revalidatePath("/admin/factions/command");
  revalidatePath("/admin/users");
  revalidatePath("/profile");
  return { success: true };
}

export async function chthonicAssignFactionAction(
  userId: string,
  factionId: string,
  position: FactionPosition,
): Promise<ActionResult> {
  const gate = await requireChthonicCommandAccess();
  if (!gate.ok) return { success: false, error: gate.error };
  if (!gate.isOwner) {
    return { success: false, error: "Owner clearance required for assignment." };
  }
  return assignUserFactionAction(userId, factionId, position);
}

export async function chthonicRemoveFactionAction(userId: string): Promise<ActionResult> {
  const gate = await requireChthonicCommandAccess();
  if (!gate.ok) return { success: false, error: gate.error };
  if (!gate.isOwner) {
    return { success: false, error: "Owner clearance required." };
  }
  return removeUserFactionAction(userId);
}

export { type ActionResult };
