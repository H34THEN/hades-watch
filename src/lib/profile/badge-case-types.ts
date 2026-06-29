export const BADGE_CASE_CATEGORIES = [
  "All",
  "Character",
  "Factions",
  "Missions",
  "Ciphers",
  "Community",
  "Archive",
  "Forge",
  "Events",
  "Moderation",
  "Recognition",
] as const;

export type BadgeCaseCategory = (typeof BADGE_CASE_CATEGORIES)[number];

export interface BadgeCaseItem {
  slug: string;
  name: string;
  description: string | null;
  category: BadgeCaseCategory;
  tier: string | null;
  color: string | null;
  assetPath: string | null;
  placeholderText: string | null;
  placeholderColor: string | null;
  factionName: string | null;
  requirement: string | null;
  earned: boolean;
  awardedAt: Date | null;
  source: string | null;
  isCapstone: boolean;
}
