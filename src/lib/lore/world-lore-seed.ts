import type { Prisma } from "@/generated/prisma/client";
import type { CanonicalLoreSeedEntry } from "@/lib/lore/canonical-lore-seed";
import { extractWorldLoreEntryBody } from "@/lib/archive/extract-lore-markdown";
import {
  SURFACE_BREAKS_WORLD_LORE,
  type WorldLoreMetadata,
} from "@/lib/lore/world-lore-pack";

export function worldLoreToSeedEntry(entry: (typeof SURFACE_BREAKS_WORLD_LORE)[number]): CanonicalLoreSeedEntry {
  const body = extractWorldLoreEntryBody(entry.sectionHeading, entry.nextSectionHeading);
  const loreMetadata = entry.metadata as unknown as Prisma.InputJsonValue;

  return {
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    body,
    category: "WORLD_LORE",
    loreMetadata,
    requiredRole: null,
    autoUnlock: true,
    skipFactionRequirement: true,
  };
}

export function getWorldLorePackSeedEntries(): CanonicalLoreSeedEntry[] {
  return SURFACE_BREAKS_WORLD_LORE.map(worldLoreToSeedEntry);
}

export function parseWorldLoreMetadata(value: unknown): WorldLoreMetadata | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const m = value as Record<string, unknown>;
  if (typeof m.threatClass !== "string") return null;
  return {
    threatClass: m.threatClass,
    relatedSystems: Array.isArray(m.relatedSystems)
      ? m.relatedSystems.filter((s): s is string => typeof s === "string")
      : [],
    relatedFactions: Array.isArray(m.relatedFactions)
      ? m.relatedFactions.filter((s): s is string => typeof s === "string")
      : [],
    subCategory: typeof m.subCategory === "string" ? m.subCategory : undefined,
    unlockType: typeof m.unlockType === "string" ? m.unlockType : undefined,
    pack: typeof m.pack === "string" ? m.pack : undefined,
  };
}

/** Display name for faction slug in world lore cards */
export const FACTION_SLUG_LABELS: Record<string, string> = {
  "chthonic-uprising": "The Chthonic Uprising",
  "asclepian-veil": "The Asclepian Veil",
  "oracular-circuit": "The Oracular Circuit",
  "myrmidon-grinders": "The Myrmidon Grinders",
  "daedalus-foundry": "The Daedalus Foundry",
  "styx-rats": "The Styx Rats",
};

export function formatFactionSlug(slug: string): string {
  return FACTION_SLUG_LABELS[slug] ?? slug.replace(/-/g, " ");
}
