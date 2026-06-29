import type {
  AdminGrantType,
  ReputationCategory,
} from "@/generated/prisma/client";
import { recordReputationEvent } from "@/lib/community/reputation";
import { grantLootBySlug, grantLoreUnlockBySlug } from "@/lib/mmo/text-mmo-rewards";
import type { GrantReason } from "@/lib/rewards/grant-constants";
import { prisma } from "@/lib/prisma";

export type { GrantReason } from "@/lib/rewards/grant-constants";
export { GRANT_REASONS } from "@/lib/rewards/grant-constants";

export interface AdminGrantInput {
  actorId: string;
  recipientId: string;
  grantType: AdminGrantType;
  grantSlug: string;
  reason: GrantReason | string;
  adminNote?: string;
  sourceType?: string;
  sourceSlug?: string;
  reputationCategory?: ReputationCategory;
  reputationPoints?: number;
}

async function auditGrant(input: AdminGrantInput, action: "grant" | "revoke") {
  await prisma.adminRewardGrantAudit.create({
    data: {
      actorId: input.actorId,
      recipientId: input.recipientId,
      grantType: input.grantType,
      grantSlug: input.grantSlug,
      action,
      reason: input.reason,
      adminNote: input.adminNote?.slice(0, 500) ?? null,
      sourceType: input.sourceType ?? null,
      sourceSlug: input.sourceSlug ?? null,
    },
  });
}

export async function adminGrantReward(input: AdminGrantInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const { actorId, recipientId, grantType, grantSlug } = input;

  const user = await prisma.user.findUnique({ where: { id: recipientId }, select: { id: true } });
  if (!user) return { ok: false, error: "User not found." };

  switch (grantType) {
    case "badge": {
      const badge = await prisma.badge.findUnique({ where: { slug: grantSlug } });
      if (!badge) return { ok: false, error: "Badge not found." };
      const existing = await prisma.userBadge.findFirst({ where: { userId: recipientId, badgeId: badge.id } });
      if (existing) return { ok: false, error: "Badge already granted." };
      await prisma.userBadge.create({
        data: { userId: recipientId, badgeId: badge.id, verificationStatus: "Verified" },
      });
      break;
    }
    case "loot": {
      const ok = await grantLootBySlug(recipientId, grantSlug, "admin_grant", input.sourceSlug ?? grantSlug);
      if (!ok) return { ok: false, error: "Loot not found." };
      break;
    }
    case "avatar_unlock": {
      const asset = await prisma.avatarUnlockAsset.findUnique({ where: { slug: grantSlug } });
      if (!asset) return { ok: false, error: "Avatar unlock not found." };
      await prisma.userAvatarUnlock.upsert({
        where: { userId_assetId: { userId: recipientId, assetId: asset.id } },
        create: {
          userId: recipientId,
          assetId: asset.id,
          sourceType: input.sourceType ?? "admin_grant",
          sourceSlug: input.sourceSlug ?? grantSlug,
          grantedById: actorId,
          revoked: false,
        },
        update: { revoked: false, revokedAt: null, grantedById: actorId },
      });
      break;
    }
    case "title": {
      const title = await prisma.playerTitle.findUnique({ where: { slug: grantSlug } });
      if (!title) return { ok: false, error: "Title not found." };
      await prisma.playerTitleGrant.upsert({
        where: { userId_titleId: { userId: recipientId, titleId: title.id } },
        create: {
          userId: recipientId,
          titleId: title.id,
          sourceType: input.sourceType ?? "admin_grant",
          sourceSlug: input.sourceSlug ?? grantSlug,
          grantedById: actorId,
          adminNote: input.adminNote ?? null,
          revoked: false,
        },
        update: { revoked: false, revokedAt: null, grantedById: actorId },
      });
      break;
    }
    case "lore_unlock": {
      const ok = await grantLoreUnlockBySlug(recipientId, grantSlug, "admin_grant", grantSlug);
      if (!ok) return { ok: false, error: "Lore unlock not found." };
      break;
    }
    case "reputation": {
      if (!input.reputationCategory || !input.reputationPoints) {
        return { ok: false, error: "Reputation category and points required." };
      }
      await recordReputationEvent({
        userId: recipientId,
        category: input.reputationCategory,
        points: input.reputationPoints,
        reason: input.reason,
        sourceType: "admin_grant",
        sourceId: grantSlug,
      });
      break;
    }
    case "profile_cosmetic":
    case "recognition": {
      const lootOk = await grantLootBySlug(recipientId, grantSlug, "admin_grant", grantSlug);
      if (!lootOk) return { ok: false, error: "Cosmetic/recognition reward not found as loot slug." };
      break;
    }
    default:
      return { ok: false, error: "Unsupported grant type." };
  }

  await auditGrant(input, "grant");
  return { ok: true };
}

export async function adminRevokeReward(input: AdminGrantInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const { recipientId, grantType, grantSlug } = input;

  switch (grantType) {
    case "badge": {
      const badge = await prisma.badge.findUnique({ where: { slug: grantSlug } });
      if (!badge) return { ok: false, error: "Badge not found." };
      await prisma.userBadge.deleteMany({ where: { userId: recipientId, badgeId: badge.id } });
      break;
    }
    case "loot": {
      const loot = await prisma.mmoLoot.findUnique({ where: { slug: grantSlug } });
      if (!loot) return { ok: false, error: "Loot not found." };
      await prisma.mmoLootGrant.deleteMany({ where: { userId: recipientId, lootId: loot.id } });
      break;
    }
    case "avatar_unlock": {
      const asset = await prisma.avatarUnlockAsset.findUnique({ where: { slug: grantSlug } });
      if (!asset) return { ok: false, error: "Avatar unlock not found." };
      await prisma.userAvatarUnlock.updateMany({
        where: { userId: recipientId, assetId: asset.id },
        data: { revoked: true, revokedAt: new Date() },
      });
      break;
    }
    case "title": {
      const title = await prisma.playerTitle.findUnique({ where: { slug: grantSlug } });
      if (!title) return { ok: false, error: "Title not found." };
      await prisma.playerTitleGrant.updateMany({
        where: { userId: recipientId, titleId: title.id },
        data: { revoked: true, revokedAt: new Date() },
      });
      break;
    }
    case "lore_unlock": {
      const lore = await prisma.mmoLoreUnlock.findUnique({ where: { slug: grantSlug } });
      if (!lore) return { ok: false, error: "Lore unlock not found." };
      await prisma.mmoLoreUnlockGrant.deleteMany({ where: { userId: recipientId, loreUnlockId: lore.id } });
      break;
    }
    case "reputation": {
      await prisma.reputationEvent.updateMany({
        where: { userId: recipientId, sourceType: "admin_grant", sourceId: grantSlug, revoked: false },
        data: { revoked: true, revokedAt: new Date() },
      });
      break;
    }
    default:
      return { ok: false, error: "Revoke not supported for this grant type." };
  }

  await auditGrant(input, "revoke");
  return { ok: true };
}

export async function getUserRewardSummary(userId: string) {
  const [badges, loot, avatarUnlocks, titles, lore, reputation, audits] = await Promise.all([
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: { select: { slug: true, name: true } } },
    }),
    prisma.mmoLootGrant.findMany({
      where: { userId },
      include: { loot: { select: { slug: true, name: true, type: true } } },
    }),
    prisma.userAvatarUnlock.findMany({
      where: { userId, revoked: false },
      include: { asset: { select: { slug: true, name: true, category: true } } },
    }),
    prisma.playerTitleGrant.findMany({
      where: { userId, revoked: false },
      include: { title: { select: { slug: true, title: true } } },
    }),
    prisma.mmoLoreUnlockGrant.findMany({
      where: { userId },
      include: { loreUnlock: { select: { slug: true, title: true } } },
    }),
    prisma.reputationEvent.findMany({
      where: { userId, revoked: false },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.adminRewardGrantAudit.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      take: 25,
      include: {
        actor: { select: { name: true, email: true } },
      },
    }),
  ]);

  return { badges, loot, avatarUnlocks, titles, lore, reputation, audits };
}
