import type { FactionPosition, RoleName } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  canViewFullInviteLineage,
  computeBadges,
  computeEarnedTitles,
  getClearanceForRoles,
  getHighestRole,
  redactInviteCode,
  resolveActiveTitle,
} from "@/lib/dossier";
import { getThemeById } from "@/lib/themes/registry";
import { getEntryVerificationDisplay } from "@/lib/verification";
import { isAdmin } from "@/lib/auth/roles";

export interface DossierMissionEntry {
  id: string;
  slug: string;
  title: string;
  status: string;
  joinedAt: Date;
  completedAt: Date | null;
}

export interface DossierCipherEntry {
  id: string;
  slug: string;
  title: string;
  solvedAt: Date;
  attemptCount: number;
}

export interface DossierInviteCreated {
  id: string;
  code: string;
  codeDisplay: string;
  roleGranted: RoleName | null;
  usesCount: number;
  maxUses: number;
  revoked: boolean;
  createdAt: Date;
}

export interface DossierData {
  codename: string;
  email: string;
  roles: RoleName[];
  joinDate: Date;
  themeName: string | null;
  emailVerified: Date | null;
  activeTitle: string;
  earnedTitles: ReturnType<typeof computeEarnedTitles>;
  badges: ReturnType<typeof computeBadges>;
  clearance: ReturnType<typeof getClearanceForRoles>;
  faction: {
    name: string;
    slug: string;
    status: string;
    position: FactionPosition | null;
    displayTitle: string | null;
    reputation: number;
  } | null;
  dbBadges: { name: string; slug: string; color: string | null }[];
  accountStatus: string;
  pendingFactionRequest: { name: string; slug: string } | null;
  spotify: {
    embedUrl: string;
    canonicalUrl: string;
  } | null;
  entryVerification: string;
  lineage: {
    hasData: boolean;
    entryCode: string | null;
    entryRole: RoleName | null;
    entryDate: Date | null;
    invitedBy: string | null;
    invitesCreated: number;
    invitesCreatedList: DossierInviteCreated[];
  };
  history: {
    missionsCompleted: number;
    activeMissions: number;
    ciphersSolved: number;
    loreUnlocks: number;
    recentMissions: DossierMissionEntry[];
    recentCiphers: DossierCipherEntry[];
  };
  isAdminViewer: boolean;
}

export async function getDossierForUser(userId: string): Promise<DossierData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: { include: { role: true } },
      themePreference: true,
      character: { include: { faction: true } },
      factionMemberships: {
        include: { faction: true },
        orderBy: { updatedAt: "desc" },
      },
      verificationClaim: {
        select: { status: true },
      },
      inviteRedemption: {
        include: {
          invite: { include: { createdBy: { select: { name: true, email: true } } } },
        },
      },
      createdInvites: { orderBy: { createdAt: "desc" }, take: 10 },
      missionParticipations: {
        include: { quest: true },
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
      cipherSolves: {
        include: { cipher: true },
        orderBy: { solvedAt: "desc" },
        take: 10,
      },
      loreUnlocks: true,
      userBadges: {
        include: { badge: true },
        orderBy: { awardedAt: "desc" },
      },
    },
  });

  if (!user) return null;

  const roles = user.userRoles.map((ur) => ur.role.name);
  const sortedRoles = [
    getHighestRole(roles),
    ...roles.filter((r) => r !== getHighestRole(roles)),
  ];
  const clearance = getClearanceForRoles(roles);
  const showFullInvites = canViewFullInviteLineage(roles);

  const approvedMembership = user.factionMemberships.find(
    (m) => m.status === "Approved" && m.isPrimary,
  ) ?? user.factionMemberships.find((m) => m.status === "Approved");
  const pendingMembership = user.factionMemberships.find((m) => m.status === "Pending");

  const faction =
    approvedMembership?.faction ??
    user.character?.faction ??
    null;

  const factionStatus = approvedMembership?.status ?? null;

  const missionsCompleted = user.missionParticipations.filter(
    (m) => m.status === "Completed",
  ).length;
  const activeMissions = user.missionParticipations.filter((m) =>
    ["Joined", "InProgress", "Interested"].includes(m.status),
  ).length;
  const cipherSolveCount = user.cipherSolves.length;
  const loreUnlockCount = user.loreUnlocks.length;

  const earnedTitles = computeEarnedTitles({
    roles,
    cipherSolveCount,
    missionsCompleted,
    factionApproved: factionStatus === "Approved",
    loreUnlockCount,
  });

  const badges = computeBadges({
    roles,
    clearance,
    factionName: faction?.name ?? null,
    factionStatus,
    cipherSolveCount,
    missionsCompleted,
    activeMissions,
    loreUnlockCount,
  });

  for (const ub of user.userBadges) {
    badges.push({
      id: `db-${ub.badge.slug}`,
      label: ub.badge.name,
      description: ub.badge.slug,
    });
  }

  const redemption = user.inviteRedemption;
  const entryInvite = redemption?.invite;

  const lineage = {
    hasData: !!redemption || user.createdInvites.length > 0,
    entryCode: redemption
      ? redactInviteCode(entryInvite?.code ?? "", showFullInvites)
      : null,
    entryRole: redemption?.roleGranted ?? null,
    entryDate: redemption?.redeemedAt ?? null,
    invitedBy: entryInvite?.createdBy
      ? (entryInvite.createdBy.name ?? entryInvite.createdBy.email)
      : null,
    invitesCreated: await prisma.inviteCode.count({
      where: { createdById: userId },
    }),
    invitesCreatedList: user.createdInvites.map((inv) => ({
      id: inv.id,
      code: inv.code,
      codeDisplay: redactInviteCode(inv.code, showFullInvites && !inv.revoked),
      roleGranted: inv.roleGranted,
      usesCount: inv.usesCount,
      maxUses: inv.maxUses,
      revoked: inv.revoked,
      createdAt: inv.createdAt,
    })),
  };

  if (isAdmin(roles) && redemption && entryInvite) {
    lineage.entryCode = showFullInvites ? entryInvite.code : redactInviteCode(entryInvite.code);
  }

  const theme = user.themePreference?.themeId
    ? getThemeById(user.themePreference.themeId)
    : null;

  return {
    codename: user.character?.callsign ?? user.name ?? user.email.split("@")[0],
    email: user.email,
    roles: sortedRoles,
    joinDate: user.createdAt,
    themeName: theme?.name ?? null,
    emailVerified: user.emailVerified,
    activeTitle: resolveActiveTitle(user.activeTitle, earnedTitles),
    earnedTitles,
    badges,
    clearance,
    accountStatus: user.accountStatus,
    entryVerification: getEntryVerificationDisplay(
      user.verificationClaim?.status ?? "NOT_REQUIRED",
    ),
    faction: faction
      ? {
          name: faction.name,
          slug: faction.slug,
          status: factionStatus ?? (user.character?.factionId ? "Linked" : "Active"),
          position: approvedMembership?.position ?? null,
          displayTitle: approvedMembership?.displayTitle ?? null,
          reputation: approvedMembership?.reputation ?? 0,
        }
      : null,
    dbBadges: user.userBadges.map((ub) => ({
      name: ub.badge.name,
      slug: ub.badge.slug,
      color: ub.badge.color,
    })),
    pendingFactionRequest: pendingMembership
      ? { name: pendingMembership.faction.name, slug: pendingMembership.faction.slug }
      : null,
    spotify:
      user.spotifyEmbedUrl && user.spotifyPlaylistUrl
        ? {
            embedUrl: user.spotifyEmbedUrl,
            canonicalUrl: user.spotifyPlaylistUrl,
          }
        : null,
    lineage,
    history: {
      missionsCompleted,
      activeMissions,
      ciphersSolved: cipherSolveCount,
      loreUnlocks: loreUnlockCount,
      recentMissions: user.missionParticipations.slice(0, 5).map((m) => ({
        id: m.id,
        slug: m.quest.slug,
        title: m.quest.title,
        status: m.status,
        joinedAt: m.joinedAt,
        completedAt: m.completedAt,
      })),
      recentCiphers: user.cipherSolves.slice(0, 5).map((s) => ({
        id: s.id,
        slug: s.cipher.slug,
        title: s.cipher.title,
        solvedAt: s.solvedAt,
        attemptCount: s.attemptCount,
      })),
    },
    isAdminViewer: isAdmin(roles),
  };
}
