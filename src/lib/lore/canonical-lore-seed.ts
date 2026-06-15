import { readFileSync } from "fs";
import { join } from "path";
import type { LoreCategory, Prisma, PrismaClient, RoleName } from "@/generated/prisma/client";
import { ORIGIN_LORE_SLUG } from "@/lib/factions/origin-dossier";

export interface CanonicalLoreSeedEntry {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  bodyFromFile?: string;
  category?: LoreCategory;
  deadIndexId?: string;
  loreMetadata?: Prisma.InputJsonValue;
  requiredRole: RoleName | null;
  factionSlug?: string;
  /** When true, seed does not set requiredFactionId (alignment stays in metadata) */
  skipFactionRequirement?: boolean;
  /** Readable without explicit unlock step when clearance is met */
  autoUnlock?: boolean;
}

export const CANONICAL_LORE_ENTRIES: CanonicalLoreSeedEntry[] = [
  {
    slug: ORIGIN_LORE_SLUG,
    title: "The Chthonic Uprising",
    excerpt:
      "A recovered Dead Index testimony from Heathen on how the underworld resistance formed after the Ledger Purges, All-Seeing Census, Burning of the Civic Tablets, and Thunder Casket Crisis.",
    bodyFromFile: "docs/lore/CHTHONIC_UPRISING_ORIGIN.md",
    category: "FACTION_LORE",
    requiredRole: null,
    factionSlug: "chthonic-uprising",
    skipFactionRequirement: true,
    autoUnlock: true,
  },
  {
    slug: "the-first-watch",
    title: "The First Watch",
    excerpt: "Before the network had a name, someone stayed awake on purpose.",
    body: "The First Watch was not a ceremony. It was a refusal — a decision to keep the line open when everyone else logged off.\n\nOperatives who inherit that watch inherit its cost: you see the signal before it becomes news, and you answer before anyone asks.",
    category: "MYTHOS_AND_ETHOS",
    requiredRole: null,
  },
];

export const DEV_LORE_ENTRIES: CanonicalLoreSeedEntry[] = [
  {
    slug: "terminal-hymns",
    title: "Terminal Hymns",
    excerpt: "Null Choir doctrine encoded in maintenance logs.",
    body: "They sang in comment blocks and checksum failures. Each hymn was a test pattern for the faithful and a trap for the careless.\n\nIf you hear rhythm in static, you are already in their liturgy.",
    category: "MYTHOS_AND_ETHOS",
    requiredRole: "Member",
  },
  {
    slug: "the-archive-watches-back",
    title: "The Archive Watches Back",
    excerpt: "Every index has an observer.",
    body: "Archive Wraiths insist the stacks are alive. Not sentient — attentive. Delete a file and something remembers the shape of the absence.\n\nRead carefully. The archive logs readers as faithfully as it logs writers.",
    category: "WORLD_LORE",
    requiredRole: "Gamer",
    factionSlug: "oracular-circuit",
  },
];

function resolveBody(entry: CanonicalLoreSeedEntry): string {
  if (entry.body) return entry.body;
  if (entry.bodyFromFile) {
    return readFileSync(join(process.cwd(), entry.bodyFromFile), "utf8");
  }
  return "";
}

export async function seedLoreEntries(
  prisma: PrismaClient,
  entries: CanonicalLoreSeedEntry[],
  factionRecords: Record<string, string> = {},
) {
  for (const l of entries) {
    const body = resolveBody(l);
    await prisma.loreEntry.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        excerpt: l.excerpt,
        body,
        status: "Published",
        publishedAt: new Date(),
        category: l.category ?? null,
        deadIndexId: l.deadIndexId ?? null,
        loreMetadata: l.loreMetadata ?? undefined,
        requiredRole: l.requiredRole,
        requiredFactionId:
          l.factionSlug && !l.skipFactionRequirement
            ? factionRecords[l.factionSlug] ?? null
            : null,
      },
      create: {
        slug: l.slug,
        title: l.title,
        excerpt: l.excerpt,
        body,
        status: "Published",
        publishedAt: new Date(),
        category: l.category ?? null,
        deadIndexId: l.deadIndexId ?? null,
        loreMetadata: l.loreMetadata ?? undefined,
        requiredRole: l.requiredRole,
        requiredFactionId:
          l.factionSlug && !l.skipFactionRequirement
            ? factionRecords[l.factionSlug] ?? null
            : null,
      },
    });
  }
}
