import { prisma } from "@/lib/prisma";

export async function getCommunityBuilderPrompts() {
  return prisma.communityBuilderPrompt.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getRecognitionTemplates() {
  return prisma.playerRecognitionTemplate.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getCanonTierDefinitions() {
  return prisma.canonTierDefinition.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCanonLorePrompts() {
  return prisma.canonLorePrompt.findMany({
    where: { isActive: true },
    orderBy: [{ tier: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getStarterVolunteerOpportunities() {
  return prisma.volunteerOpportunity.findMany({
    where: { isStarterSeed: true, status: "OPEN" },
    orderBy: { title: "asc" },
  });
}

export async function getRewardCatalogCounts() {
  const [badges, loot, avatarUnlocks, titles, mappings, pools] = await Promise.all([
    prisma.badge.count(),
    prisma.mmoLoot.count({ where: { isActive: true } }),
    prisma.avatarUnlockAsset.count({ where: { isActive: true } }),
    prisma.playerTitle.count({ where: { isActive: true } }),
    prisma.rewardMapping.count({ where: { isActive: true } }),
    prisma.rewardPool.count({ where: { isActive: true } }),
  ]);
  return { badges, loot, avatarUnlocks, titles, mappings, pools };
}
