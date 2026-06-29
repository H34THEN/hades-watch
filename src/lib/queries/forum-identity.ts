import { prisma } from "@/lib/prisma";
import type { ForumModerationStatus } from "@/generated/prisma/client";

const forumAuthorSelect = {
  id: true,
  name: true,
  email: true,
  activeTitle: true,
  character: {
    select: {
      callsign: true,
      archetype: true,
      avatarUrl: true,
      faction: { select: { slug: true, name: true, symbol: true } },
    },
  },
  forumProfile: {
    include: {
      activeButton: true,
      activeBanner: true,
    },
  },
  userBadges: {
    where: { verificationStatus: "Verified" },
    take: 6,
    include: { badge: { select: { slug: true, name: true, color: true } } },
  },
  guildMemberships: {
    where: { status: "APPROVED" },
    take: 1,
    include: { guild: { select: { slug: true, name: true } } },
  },
  playerTitleGrants: {
    where: { revokedAt: null },
    take: 3,
    include: { title: { select: { slug: true, title: true } } },
  },
  _count: {
    select: { reputationEvents: true },
  },
} as const;

export type ForumAuthorPayload = Awaited<
  ReturnType<typeof getForumAuthorsByIds>
>[string];

export async function getForumAuthorsByIds(userIds: string[]) {
  if (userIds.length === 0) return {};

  const users = await prisma.user.findMany({
    where: { id: { in: [...new Set(userIds)] } },
    select: forumAuthorSelect,
  });

  const map: Record<string, (typeof users)[number]> = {};
  for (const user of users) {
    map[user.id] = user;
  }
  return map;
}

export async function getForumProfileForUser(userId: string) {
  return prisma.forumProfile.findUnique({
    where: { userId },
    include: {
      activeButton: true,
      activeBanner: true,
      assets: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
}

export async function getOrCreateForumProfile(userId: string) {
  const existing = await getForumProfileForUser(userId);
  if (existing) return existing;

  const character = await prisma.character.findUnique({
    where: { userId },
    select: {
      callsign: true,
      faction: { select: { slug: true } },
    },
  });

  return prisma.forumProfile.create({
    data: {
      userId,
      displayName: character?.callsign ?? null,
      factionSlug: character?.faction?.slug ?? null,
      forumImageSource: "GENERATED",
      generatedImageConfig: {
        glyph: character?.callsign?.slice(0, 2).toUpperCase() ?? "OP",
        theme: "dead-index-violet",
      },
    },
    include: {
      activeButton: true,
      activeBanner: true,
      assets: true,
    },
  });
}

export async function getForumUserPreference(userId: string) {
  return prisma.forumUserPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getUserNotifications(userId: string, limit = 50) {
  return prisma.userNotification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          character: { select: { callsign: true } },
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getForumIdentityModerationQueue(status?: ForumModerationStatus) {
  const where = status ? { moderationStatus: status } : {};

  const [profiles, assets] = await Promise.all([
    prisma.forumProfile.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            character: { select: { callsign: true } },
          },
        },
        activeButton: true,
        activeBanner: true,
      },
    }),
    prisma.forumSignatureAsset.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            character: { select: { callsign: true } },
          },
        },
      },
    }),
  ]);

  return { profiles, assets };
}

export async function getPlayerTitlesForForum(userId: string) {
  return prisma.playerTitleGrant.findMany({
    where: { userId, revokedAt: null },
    include: { title: true },
    orderBy: { grantedAt: "desc" },
  });
}
