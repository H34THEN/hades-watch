import { prisma } from "@/lib/prisma";
import {
  ALLIANCE_DATA,
  ALLIANCE_SLUG,
  ARCHIVIST_LORE,
  CHTHONIC_FACTIONS,
  type FactionSeedData,
} from "@/lib/factions/chthonic-data";

export type FactionDataSource = "database" | "canonical";

export interface FactionCounts {
  characters: number;
  memberships: number;
}

export interface ResolvedFactionListItem {
  id: string | null;
  slug: string;
  name: string;
  description: string;
  tagline: string | null;
  archetype: string | null;
  leaderName: string | null;
  leaderTitle: string | null;
  palette: Record<string, string> | null;
  symbol: string | null;
  dataSource: FactionDataSource;
  _count: FactionCounts;
}

export interface ResolvedFactionDetail extends ResolvedFactionListItem {
  leaderLore: string | null;
  coreValues: string[] | null;
  rivalrySlug: string | null;
  synergySlug: string | null;
  themeUnlock: string | null;
  typicalMissions: string[] | null;
  reputationFlavor: string | null;
  badges: string[] | null;
  titles: { starting: string; advanced: string[] } | null;
  alliance: { name: string; slug: string; motto: string | null } | null;
  rivalry: { name: string; slug: string } | null;
  synergy: { name: string; slug: string } | null;
  badgeRecords: { id: string; name: string; slug: string; color: string | null }[];
  quests: { id: string; slug: string; title: string }[];
  characters: { callsign: string; archetype: string | null }[];
}

export interface ResolvedAlliance {
  id: string | null;
  slug: string;
  name: string;
  description: string;
  tagline: string | null;
  leaderName: string | null;
  leaderTitle: string | null;
  leaderLore: string | null;
  motto: string | null;
  symbol: string | null;
  archivistLore: typeof ARCHIVIST_LORE;
  dataSource: FactionDataSource;
  cells: ResolvedFactionListItem[];
}

const CANONICAL_BY_SLUG = Object.fromEntries(
  CHTHONIC_FACTIONS.map((f) => [f.slug, f]),
) as Record<string, FactionSeedData>;

function slugToName(slug: string): string {
  return CANONICAL_BY_SLUG[slug]?.name ?? slug;
}

function canonicalToListItem(f: FactionSeedData): ResolvedFactionListItem {
  return {
    id: null,
    slug: f.slug,
    name: f.name,
    description: f.description,
    tagline: f.tagline,
    archetype: f.archetype,
    leaderName: f.leaderName,
    leaderTitle: f.leaderTitle,
    palette: f.palette,
    symbol: f.symbol,
    dataSource: "canonical",
    _count: { characters: 0, memberships: 0 },
  };
}

function parseJsonArray(value: unknown): string[] | null {
  return Array.isArray(value) ? (value as string[]) : null;
}

function parsePalette(value: unknown): Record<string, string> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, string>;
  }
  return null;
}

function parseTitles(
  value: unknown,
): { starting: string; advanced: string[] } | null {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "starting" in value
  ) {
    const t = value as { starting: string; advanced: string[] };
    return { starting: t.starting, advanced: t.advanced ?? [] };
  }
  return null;
}

function dbFactionToListItem(
  f: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    tagline: string | null;
    archetype: string | null;
    leaderName: string | null;
    leaderTitle: string | null;
    palette: unknown;
    symbol: string | null;
    _count: FactionCounts;
  },
  dataSource: FactionDataSource = "database",
): ResolvedFactionListItem {
  return {
    id: f.id,
    slug: f.slug,
    name: f.name,
    description: f.description ?? "",
    tagline: f.tagline,
    archetype: f.archetype,
    leaderName: f.leaderName,
    leaderTitle: f.leaderTitle,
    palette: parsePalette(f.palette),
    symbol: f.symbol,
    dataSource,
    _count: f._count,
  };
}

export function isCanonicalFactionSlug(slug: string): boolean {
  return slug === ALLIANCE_SLUG || slug in CANONICAL_BY_SLUG;
}

export async function resolveFactionsList(): Promise<ResolvedFactionListItem[]> {
  const dbFactions = await prisma.faction.findMany({
    where: { isAlliance: false },
    orderBy: { name: "asc" },
    include: { _count: { select: { characters: true, memberships: true } } },
  });

  const dbBySlug = new Map(dbFactions.map((f) => [f.slug, f]));
  const resolved: ResolvedFactionListItem[] = [];

  for (const canonical of CHTHONIC_FACTIONS) {
    const db = dbBySlug.get(canonical.slug);
    if (db) {
      resolved.push(dbFactionToListItem(db));
      dbBySlug.delete(canonical.slug);
    } else {
      resolved.push(canonicalToListItem(canonical));
    }
  }

  for (const extra of dbBySlug.values()) {
    resolved.push(dbFactionToListItem(extra));
  }

  return resolved;
}

export async function resolveAlliance(): Promise<ResolvedAlliance | null> {
  const dbAlliance = await prisma.faction.findFirst({
    where: { isAlliance: true },
    include: {
      cells: {
        where: { isAlliance: false },
        orderBy: { name: "asc" },
        include: { _count: { select: { characters: true, memberships: true } } },
      },
    },
  });

  const cells = await resolveFactionsList();

  if (dbAlliance) {
    return {
      id: dbAlliance.id,
      slug: dbAlliance.slug,
      name: dbAlliance.name,
      description: dbAlliance.description ?? ALLIANCE_DATA.description,
      tagline: dbAlliance.tagline ?? ALLIANCE_DATA.tagline,
      leaderName: dbAlliance.leaderName ?? ALLIANCE_DATA.leaderName,
      leaderTitle: dbAlliance.leaderTitle ?? ALLIANCE_DATA.leaderTitle,
      leaderLore: dbAlliance.leaderLore ?? ALLIANCE_DATA.leaderLore,
      motto: dbAlliance.motto ?? ALLIANCE_DATA.motto ?? null,
      symbol: dbAlliance.symbol ?? ALLIANCE_DATA.symbol,
      archivistLore: ARCHIVIST_LORE,
      dataSource: "database",
      cells,
    };
  }

  return {
    id: null,
    slug: ALLIANCE_DATA.slug,
    name: ALLIANCE_DATA.name,
    description: ALLIANCE_DATA.description,
    tagline: ALLIANCE_DATA.tagline,
    leaderName: ALLIANCE_DATA.leaderName,
    leaderTitle: ALLIANCE_DATA.leaderTitle,
    leaderLore: ALLIANCE_DATA.leaderLore,
    motto: ALLIANCE_DATA.motto ?? null,
    symbol: ALLIANCE_DATA.symbol,
    archivistLore: ARCHIVIST_LORE,
    dataSource: "canonical",
    cells,
  };
}

export async function resolveFactionBySlug(
  slug: string,
): Promise<ResolvedFactionDetail | null> {
  if (slug === ALLIANCE_SLUG) return null;

  const canonical = CANONICAL_BY_SLUG[slug];
  if (!canonical && !(await prisma.faction.findUnique({ where: { slug } }))) {
    return null;
  }

  const dbFaction = await prisma.faction.findUnique({
    where: { slug },
    include: {
      alliance: { select: { name: true, slug: true, motto: true } },
      badgeRecords: { orderBy: { name: "asc" } },
      quests: { where: { status: "Available" } },
      characters: {
        where: { isPublic: true },
        take: 10,
        select: { callsign: true, archetype: true },
      },
      _count: { select: { memberships: true, characters: true } },
    },
  });

  if (dbFaction && !dbFaction.isAlliance) {
    const rivalry = dbFaction.rivalrySlug
      ? { name: slugToName(dbFaction.rivalrySlug), slug: dbFaction.rivalrySlug }
      : null;
    const synergy = dbFaction.synergySlug
      ? { name: slugToName(dbFaction.synergySlug), slug: dbFaction.synergySlug }
      : null;

    return {
      ...dbFactionToListItem(dbFaction),
      description: dbFaction.description ?? canonical?.description ?? "",
      tagline: dbFaction.tagline ?? canonical?.tagline ?? null,
      archetype: dbFaction.archetype ?? canonical?.archetype ?? null,
      leaderName: dbFaction.leaderName ?? canonical?.leaderName ?? null,
      leaderTitle: dbFaction.leaderTitle ?? canonical?.leaderTitle ?? null,
      leaderLore: dbFaction.leaderLore ?? canonical?.leaderLore ?? null,
      coreValues:
        parseJsonArray(dbFaction.coreValues) ?? canonical?.coreValues ?? null,
      palette: parsePalette(dbFaction.palette) ?? canonical?.palette ?? null,
      symbol: dbFaction.symbol ?? canonical?.symbol ?? null,
      rivalrySlug: dbFaction.rivalrySlug ?? canonical?.rivalrySlug ?? null,
      synergySlug: dbFaction.synergySlug ?? canonical?.synergySlug ?? null,
      themeUnlock: dbFaction.themeUnlock ?? canonical?.themeUnlock ?? null,
      typicalMissions:
        parseJsonArray(dbFaction.typicalMissions) ??
        canonical?.typicalMissions ??
        null,
      reputationFlavor:
        dbFaction.reputationFlavor ?? canonical?.reputationFlavor ?? null,
      badges: parseJsonArray(dbFaction.badges) ?? canonical?.badges ?? null,
      titles: parseTitles(dbFaction.titles) ?? canonical?.titles ?? null,
      alliance: dbFaction.alliance,
      rivalry,
      synergy,
      badgeRecords: dbFaction.badgeRecords,
      quests: dbFaction.quests,
      characters: dbFaction.characters,
      dataSource: "database",
    };
  }

  if (!canonical) return null;

  return {
    ...canonicalToListItem(canonical),
    leaderLore: canonical.leaderLore,
    coreValues: canonical.coreValues,
    rivalrySlug: canonical.rivalrySlug,
    synergySlug: canonical.synergySlug,
    themeUnlock: canonical.themeUnlock,
    typicalMissions: canonical.typicalMissions,
    reputationFlavor: canonical.reputationFlavor,
    badges: canonical.badges,
    titles: canonical.titles,
    alliance: {
      name: ALLIANCE_DATA.name,
      slug: ALLIANCE_DATA.slug,
      motto: ALLIANCE_DATA.motto ?? null,
    },
    rivalry: {
      name: slugToName(canonical.rivalrySlug),
      slug: canonical.rivalrySlug,
    },
    synergy: {
      name: slugToName(canonical.synergySlug),
      slug: canonical.synergySlug,
    },
    badgeRecords: canonical.badges.map((name, i) => ({
      id: `canonical-${canonical.slug}-${i}`,
      name,
      slug: `${canonical.slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      color: Object.values(canonical.palette)[0] ?? null,
    })),
    quests: [],
    characters: [],
  };
}

export function usesCanonicalFallback(
  items: { dataSource: FactionDataSource }[],
): boolean {
  return items.some((i) => i.dataSource === "canonical");
}
