import { prisma } from "@/lib/prisma";
import { getDossierForUser } from "@/lib/queries/dossier";
import type { BadgeCaseCategory, BadgeCaseItem } from "@/lib/profile/badge-case-types";

export type { BadgeCaseCategory, BadgeCaseItem } from "@/lib/profile/badge-case-types";
export { BADGE_CASE_CATEGORIES } from "@/lib/profile/badge-case-types";

function mapCategory(badge: {
  missionSlug: string | null;
  cipherSlug: string | null;
  profileDisplayCategory: string | null;
  isMissionCompletionBadge: boolean;
}): BadgeCaseCategory {
  if (badge.cipherSlug || badge.profileDisplayCategory === "Ciphers") return "Ciphers";
  if (badge.missionSlug || badge.profileDisplayCategory === "Missions") return "Missions";
  if (badge.profileDisplayCategory === "Factions") return "Factions";
  if (badge.profileDisplayCategory === "Community") return "Community";
  if (badge.profileDisplayCategory === "Archive") return "Archive";
  if (badge.profileDisplayCategory === "Forge") return "Forge";
  if (badge.profileDisplayCategory === "Events") return "Events";
  if (badge.profileDisplayCategory === "Moderation") return "Moderation";
  if (badge.profileDisplayCategory === "Recognition") return "Recognition";
  if (badge.profileDisplayCategory === "Character") return "Character";
  if (badge.isMissionCompletionBadge) return "Missions";
  return "Character";
}

function computeSource(badge: {
  missionSlug: string | null;
  cipherSlug: string | null;
  profileDisplayCategory: string | null;
}): string | null {
  if (badge.missionSlug) return `Mission · ${badge.missionSlug}`;
  if (badge.cipherSlug) return `Cipher · ${badge.cipherSlug}`;
  if (badge.profileDisplayCategory) return badge.profileDisplayCategory;
  return null;
}

export async function getBadgeCaseForUser(userId: string): Promise<{
  items: BadgeCaseItem[];
  earnedCount: number;
  totalCount: number;
}> {
  const [allBadges, userBadges, dossier] = await Promise.all([
    prisma.badge.findMany({
      include: { faction: { select: { name: true } } },
      orderBy: [{ tier: "desc" }, { name: "asc" }],
    }),
    prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true, awardedAt: true },
    }),
    getDossierForUser(userId),
  ]);

  const earnedMap = new Map(userBadges.map((ub) => [ub.badgeId, ub.awardedAt]));

  const computedItems: BadgeCaseItem[] = (dossier?.badges ?? []).map((b) => ({
    slug: b.id,
    name: b.label,
    description: b.description ?? null,
    category: "Character" as BadgeCaseCategory,
    tier: null,
    color: null,
    assetPath: null,
    placeholderText: b.label.slice(0, 3),
    placeholderColor: "#22c55e",
    factionName: null,
    requirement: null,
    earned: true,
    awardedAt: null,
    source: "Progression",
    isCapstone: false,
  }));

  const dbItems: BadgeCaseItem[] = allBadges.map((badge) => {
    const awardedAt = earnedMap.get(badge.id) ?? null;
    return {
      slug: badge.slug,
      name: badge.name,
      description: badge.description,
      category: mapCategory(badge),
      tier: badge.tier,
      color: badge.color,
      assetPath: badge.assetPath,
      placeholderText: badge.placeholderText,
      placeholderColor: badge.placeholderColor,
      factionName: badge.faction?.name ?? null,
      requirement: badge.requirement,
      earned: !!awardedAt,
      awardedAt,
      source: computeSource(badge),
      isCapstone: badge.isMissionCompletionBadge || badge.tier === "capstone",
    };
  });

  const seen = new Set<string>();
  const items = [...computedItems, ...dbItems].filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });

  return {
    items,
    earnedCount: items.filter((i) => i.earned).length,
    totalCount: items.length,
  };
}
