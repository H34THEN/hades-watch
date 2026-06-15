import type { LoreCategory } from "@/generated/prisma/client";

export interface ArchiveCategory {
  slug: string;
  loreCategory: LoreCategory;
  title: string;
  description: string;
  /** In-world terminal label */
  terminalLabel: string;
}

export const ARCHIVE_CATEGORIES: ArchiveCategory[] = [
  {
    slug: "characters",
    loreCategory: "CHARACTER_LORE",
    title: "Character Lore",
    description:
      "Operative dossiers and Dead Index profiles — leader records, signal histories, field identities, invite lineages, and badge files for notable figures.",
    terminalLabel: "archive.character_lore",
  },
  {
    slug: "world",
    loreCategory: "WORLD_LORE",
    title: "World Lore",
    description:
      "Systems, events, regimes, and collapses — the Surface Order, the underworld, Ledger Purges, the All-Seeing Census, Thunder Casket, and the machinery of erasure.",
    terminalLabel: "archive.world_lore",
  },
  {
    slug: "factions",
    loreCategory: "FACTION_LORE",
    title: "Faction Lore",
    description:
      "Cells, doctrine, leaders, rivalries — origins, ranks, missions, rituals, and standing records for the Chthonic Uprising and its cells.",
    terminalLabel: "archive.faction_lore",
  },
  {
    slug: "mythos-and-ethos",
    loreCategory: "MYTHOS_AND_ETHOS",
    title: "Mythos and Ethos",
    description:
      "Principles, oaths, symbolism, philosophy — memory as resistance, care as infrastructure, sabotage as self-defense, grief as fuel, sunlight as a future worth building.",
    terminalLabel: "archive.mythos_ethos",
  },
  {
    slug: "state-of-affairs",
    loreCategory: "CURRENT_NEWS_AND_STATE_OF_AFFAIRS",
    title: "Current News and State of Affairs",
    description:
      "Underwatch bulletins and live-state lore — surface alerts, civic threat reports, propaganda analysis, faction updates, and in-world dispatches.",
    terminalLabel: "archive.state_of_affairs",
  },
];

const BY_ROUTE_SLUG = new Map(ARCHIVE_CATEGORIES.map((c) => [c.slug, c]));
const BY_LORE_CATEGORY = new Map(ARCHIVE_CATEGORIES.map((c) => [c.loreCategory, c]));

export function getCategoryByRouteSlug(slug: string): ArchiveCategory | undefined {
  return BY_ROUTE_SLUG.get(slug);
}

export function getCategoryByLoreCategory(
  category: LoreCategory | null | undefined,
): ArchiveCategory | undefined {
  if (!category) return undefined;
  return BY_LORE_CATEGORY.get(category);
}

export function getArchiveCategoryPath(category: LoreCategory | null | undefined): string {
  const meta = getCategoryByLoreCategory(category);
  return meta ? `/archive/${meta.slug}` : "/archive/lore";
}

export function getArchiveEntryPath(
  slug: string,
  category: LoreCategory | null | undefined,
): string {
  const meta = getCategoryByLoreCategory(category);
  return meta ? `/archive/${meta.slug}/${slug}` : `/archive/lore/${slug}`;
}

export function isArchiveCategoryRoute(slug: string): boolean {
  return BY_ROUTE_SLUG.has(slug);
}

/** Faction slug → character archive slug for leader dossier links */
export const FACTION_LEADER_ARCHIVE_SLUGS: Record<string, string> = {
  "chthonic-uprising": "heathen-the-archivist",
  "asclepian-veil": "dr-ione-vey",
  "oracular-circuit": "cassian-nyx",
  "myrmidon-grinders": "brontes-vale",
  "daedalus-foundry": "mara-kallix",
  "styx-rats": "rhea-spite",
};

export function getLeaderArchiveSlug(factionSlug: string): string | undefined {
  return FACTION_LEADER_ARCHIVE_SLUGS[factionSlug];
}

export function getLeaderArchivePath(factionSlug: string): string | undefined {
  const slug = getLeaderArchiveSlug(factionSlug);
  return slug ? `/archive/characters/${slug}` : undefined;
}
