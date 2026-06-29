import type {
  MmoActionType,
  MmoDropSubmissionStatus,
  MmoFieldLogVisibility,
  ReputationCategory,
} from "@/generated/prisma/client";
import { recordReputationEvent } from "@/lib/community/reputation";
import { playerDisplayName } from "@/lib/mmo/text-mmo-validation";
import { prisma } from "@/lib/prisma";

export interface GrantDropRewardsInput {
  userId: string;
  characterId?: string | null;
  drop: {
    id: string;
    slug: string;
    title: string;
    rewardBadgeSlug: string | null;
    rewardReputationCategory: ReputationCategory | null;
    rewardReputationPoints: number;
    rewardLootSlug: string | null;
    loreUnlockSlug: string | null;
    loopSlug: string;
  };
  submissionStatus: MmoDropSubmissionStatus;
  fieldLogMessage: string;
  visibility?: MmoFieldLogVisibility;
  roomId?: string | null;
}

export async function createMmoFieldLog(input: {
  userId: string;
  characterId?: string | null;
  roomId?: string | null;
  deadDropId?: string | null;
  actionType?: MmoActionType | null;
  message: string;
  visibility?: MmoFieldLogVisibility;
}) {
  return prisma.mmoFieldLog.create({
    data: {
      userId: input.userId,
      characterId: input.characterId ?? null,
      roomId: input.roomId ?? null,
      deadDropId: input.deadDropId ?? null,
      actionType: input.actionType ?? null,
      message: input.message,
      visibility: input.visibility ?? "approved_users",
      status: "ACTIVE",
    },
  });
}

export async function grantBadgeBySlug(userId: string, badgeSlug: string, _sourceSlug: string) {
  const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } });
  if (!badge) return false;
  const existing = await prisma.userBadge.findFirst({
    where: { userId, badgeId: badge.id },
  });
  if (existing) return false;
  await prisma.userBadge.create({
    data: { userId, badgeId: badge.id, verificationStatus: "Verified" },
  });
  return true;
}

export async function grantLootBySlug(
  userId: string,
  lootSlug: string,
  sourceType: string,
  sourceSlug: string,
  characterId?: string | null,
) {
  const loot = await prisma.mmoLoot.findUnique({ where: { slug: lootSlug } });
  if (!loot) return false;
  await prisma.mmoLootGrant.upsert({
    where: { userId_lootId: { userId, lootId: loot.id } },
    create: {
      userId,
      lootId: loot.id,
      characterId: characterId ?? null,
      sourceType,
      sourceSlug,
    },
    update: {},
  });
  return true;
}

export async function grantLoreUnlockBySlug(
  userId: string,
  loreSlug: string,
  sourceType: string,
  sourceSlug: string,
) {
  const lore = await prisma.mmoLoreUnlock.findUnique({ where: { slug: loreSlug } });
  if (!lore) return false;
  await prisma.mmoLoreUnlockGrant.upsert({
    where: { userId_loreUnlockId: { userId, loreUnlockId: lore.id } },
    create: { userId, loreUnlockId: lore.id, sourceType, sourceSlug },
    update: {},
  });
  return true;
}

export async function grantDropRewards(input: GrantDropRewardsInput) {
  const { userId, drop, submissionStatus } = input;
  if (submissionStatus !== "AUTO_COMPLETED" && submissionStatus !== "APPROVED") {
    return;
  }

  if (drop.rewardReputationCategory && drop.rewardReputationPoints > 0) {
    await recordReputationEvent({
      userId,
      category: drop.rewardReputationCategory,
      points: drop.rewardReputationPoints,
      reason: `Dead Drop: ${drop.title}`,
      sourceType: "mmo_dead_drop",
      sourceId: drop.id,
    });
  }

  if (drop.rewardBadgeSlug) {
    await grantBadgeBySlug(userId, drop.rewardBadgeSlug, drop.slug);
  }
  if (drop.rewardLootSlug) {
    await grantLootBySlug(userId, drop.rewardLootSlug, "mmo_dead_drop", drop.slug, input.characterId);
  }
  if (drop.loreUnlockSlug) {
    await grantLoreUnlockBySlug(userId, drop.loreUnlockSlug, "mmo_dead_drop", drop.slug);
  }

  await createMmoFieldLog({
    userId,
    characterId: input.characterId,
    roomId: input.roomId ?? null,
    deadDropId: drop.id,
    actionType: "SUBMIT_DEAD_DROP",
    message: input.fieldLogMessage,
    visibility: input.visibility ?? "approved_users",
  });
}

export async function grantRoomActionRewards(input: {
  userId: string;
  characterId?: string | null;
  roomId: string;
  action: {
    actionType: MmoActionType;
    label: string;
    rewardReputationCategory: ReputationCategory | null;
    rewardReputationPoints: number;
    reputationEventSlug: string | null;
    rewardBadgeSlug: string | null;
  };
  fieldLogMessage: string;
}) {
  const { userId, action } = input;

  if (action.rewardReputationCategory && action.rewardReputationPoints > 0) {
    const cooldownKey = action.reputationEventSlug ?? action.actionType;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const recent = await prisma.reputationEvent.count({
      where: {
        userId,
        sourceType: "mmo_room_action",
        sourceId: cooldownKey,
        createdAt: { gte: startOfDay },
        revoked: false,
      },
    });
    if (recent === 0) {
      await recordReputationEvent({
        userId,
        category: action.rewardReputationCategory,
        points: action.rewardReputationPoints,
        reason: action.label,
        sourceType: "mmo_room_action",
        sourceId: cooldownKey,
      });
    }
  }

  if (action.rewardBadgeSlug) {
    await grantBadgeBySlug(userId, action.rewardBadgeSlug, action.reputationEventSlug ?? action.actionType);
  }

  await createMmoFieldLog({
    userId,
    characterId: input.characterId,
    roomId: input.roomId,
    actionType: action.actionType,
    message: input.fieldLogMessage,
  });
}

export async function getPlayerLabel(userId: string): Promise<string> {
  const [user, character] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
    prisma.character.findUnique({ where: { userId }, select: { callsign: true } }),
  ]);
  if (!user) return "operative";
  return playerDisplayName(character, user);
}

export async function hasCompletedDrop(userId: string, dropId: string): Promise<boolean> {
  const sub = await prisma.mmoDeadDropSubmission.findFirst({
    where: {
      userId,
      deadDropId: dropId,
      status: { in: ["AUTO_COMPLETED", "APPROVED"] },
    },
  });
  return !!sub;
}

export async function canCompleteDropAgain(
  userId: string,
  drop: { id: string; repeatability: string },
): Promise<boolean> {
  if (drop.repeatability === "one_time") {
    return !(await hasCompletedDrop(userId, drop.id));
  }
  if (drop.repeatability === "daily") {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const today = await prisma.mmoDeadDropSubmission.findFirst({
      where: {
        userId,
        deadDropId: drop.id,
        status: { in: ["AUTO_COMPLETED", "APPROVED", "PENDING"] },
        createdAt: { gte: startOfDay },
      },
    });
    return !today;
  }
  return true;
}
