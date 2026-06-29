import type { ReputationCategory } from "@/generated/prisma/client";
import {
  COMMUNITY_DAILY_REPUTATION_CAP,
  COMMUNITY_THREAD_REPLY_SOURCE_TYPES,
  REPUTATION_LEVELS,
} from "@/lib/community/constants";
import { prisma } from "@/lib/prisma";

export interface RecordReputationEventInput {
  userId: string;
  category: ReputationCategory;
  points: number;
  reason: string;
  sourceType?: string;
  sourceId?: string;
}

export interface UserReputationSummary {
  total: number;
  byCategory: Record<ReputationCategory, number>;
  level: number;
  levelTitle: string;
}

function resolveLevel(total: number): { level: number; levelTitle: string } {
  let level = 0;
  let levelTitle = REPUTATION_LEVELS[0]?.title ?? "Static Trace";

  for (let i = 0; i < REPUTATION_LEVELS.length; i++) {
    const entry = REPUTATION_LEVELS[i];
    if (entry && total >= entry.minPoints) {
      level = i;
      levelTitle = entry.title;
    }
  }

  return { level, levelTitle };
}

async function getCommunityThreadReplyPointsToday(userId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const result = await prisma.reputationEvent.aggregate({
    where: {
      userId,
      category: "COMMUNITY",
      revoked: false,
      createdAt: { gte: startOfDay },
      sourceType: { in: [...COMMUNITY_THREAD_REPLY_SOURCE_TYPES] },
    },
    _sum: { points: true },
  });

  return result._sum.points ?? 0;
}

function isCommunityThreadReplyEvent(
  category: ReputationCategory,
  sourceType?: string,
): boolean {
  return (
    category === "COMMUNITY" &&
    sourceType != null &&
    (COMMUNITY_THREAD_REPLY_SOURCE_TYPES as readonly string[]).includes(sourceType)
  );
}

export async function recordReputationEvent(
  input: RecordReputationEventInput,
): Promise<{ awarded: number }> {
  const { userId, category, points, reason, sourceType, sourceId } = input;

  if (points <= 0) {
    return { awarded: 0 };
  }

  let pointsToAward = points;

  if (isCommunityThreadReplyEvent(category, sourceType)) {
    const earnedToday = await getCommunityThreadReplyPointsToday(userId);
    const remaining = COMMUNITY_DAILY_REPUTATION_CAP - earnedToday;
    if (remaining <= 0) {
      return { awarded: 0 };
    }
    pointsToAward = Math.min(pointsToAward, remaining);
  }

  await prisma.reputationEvent.create({
    data: {
      userId,
      category,
      points: pointsToAward,
      reason,
      sourceType: sourceType ?? null,
      sourceId: sourceId ?? null,
    },
  });

  return { awarded: pointsToAward };
}

export async function getUserReputationSummary(
  userId: string,
): Promise<UserReputationSummary> {
  const events = await prisma.reputationEvent.findMany({
    where: { userId, revoked: false },
    select: { category: true, points: true },
  });

  const byCategory = {
    COMMUNITY: 0,
    LORE: 0,
    MISSIONS: 0,
    CIPHERS: 0,
    ARCHIVE: 0,
    FORGE: 0,
    GUILDS: 0,
    MODERATION: 0,
    ACCESSIBILITY: 0,
  } satisfies Record<ReputationCategory, number>;

  let total = 0;
  for (const event of events) {
    byCategory[event.category] += event.points;
    total += event.points;
  }

  const { level, levelTitle } = resolveLevel(total);

  return { total, byCategory, level, levelTitle };
}

export async function revokeReputationForSource(
  sourceType: string,
  sourceId: string,
): Promise<number> {
  const result = await prisma.reputationEvent.updateMany({
    where: {
      sourceType,
      sourceId,
      revoked: false,
    },
    data: {
      revoked: true,
      revokedAt: new Date(),
    },
  });

  return result.count;
}
