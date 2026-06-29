import { getAvailableQuests, getUserActiveMissions, getUserCharacter } from "@/lib/actions/mmo";
import { getUpcomingEvents } from "@/lib/actions/events";
import { isAdmin, isOwner } from "@/lib/auth/roles";
import { isApprovedUser, type SessionUser } from "@/lib/auth/session";
import { getActiveCiphersForUser } from "@/lib/ciphers/queries";
import type { MmoHubContext } from "@/lib/mmo/hub-types";
import { prisma } from "@/lib/prisma";

export async function getMmoHubContext(user: SessionUser): Promise<MmoHubContext> {
  const approved = isApprovedUser(user);

  const [
    character,
    activeMissions,
    missions,
    factions,
    badgeCount,
    avatarRow,
    ciphers,
    upcomingEvents,
    allianceMembership,
  ] = await Promise.all([
    getUserCharacter(user.id),
    getUserActiveMissions(user.id),
    approved ? getAvailableQuests() : Promise.resolve([]),
    prisma.faction.count({ where: { isAlliance: false } }),
    prisma.userBadge.count({ where: { userId: user.id } }),
    prisma.userAvatar.findUnique({
      where: { userId: user.id },
      select: { id: true },
    }),
    approved
      ? getActiveCiphersForUser(user.id)
      : Promise.resolve([]),
    getUpcomingEvents(user.roles, 5),
    prisma.factionMembership.findFirst({
      where: {
        userId: user.id,
        status: "Approved",
        faction: { isAlliance: true },
      },
      include: { faction: { select: { name: true, slug: true } } },
    }),
  ]);

  return {
    character: character
      ? {
          callsign: character.callsign,
          archetype: character.archetype,
          factionName: character.faction?.name ?? null,
          factionSlug: character.faction?.slug ?? null,
          isPublic: character.isPublic,
        }
      : null,
    allianceMark: allianceMembership
      ? {
          name: allianceMembership.faction.name,
          slug: allianceMembership.faction.slug,
        }
      : null,
    badgeCount,
    hasAvatar: !!avatarRow,
    activeMissionCount: activeMissions.length,
    availableMissionCount: missions.length,
    factionCount: factions,
    cipherTotal: ciphers.length,
    cipherSolved: ciphers.filter((c) => c.solved).length,
    upcomingEventCount: upcomingEvents.length,
    isApproved: approved,
    isAdmin: isAdmin(user.roles),
    isOwner: isOwner(user.roles),
  };
}
