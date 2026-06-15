import type { Prisma } from "@/generated/prisma/client";
import type { CanonicalLoreSeedEntry } from "@/lib/lore/canonical-lore-seed";
import { extractLeaderSection } from "@/lib/archive/extract-lore-markdown";

export interface CharacterLoreMetadata {
  displayName: string;
  aliases: string[];
  role: string;
  archetype: string;
  factionSlug: string;
  imagePrompt?: string;
  negativeImagePrompt?: string;
}

export interface CharacterLoreProfile extends CharacterLoreMetadata {
  slug: string;
  title: string;
  deadIndexId: string;
  excerpt: string;
  sectionHeading: string;
  nextSectionHeading: string;
}

export const CHARACTER_LORE_PROFILES: CharacterLoreProfile[] = [
  {
    slug: "heathen-the-archivist",
    title: "Heathen",
    displayName: "Heathen",
    aliases: ["The Archivist", "Slewfoot"],
    deadIndexId: "DI-0000-HEATHEN",
    factionSlug: "chthonic-uprising",
    role: "Founder / Keeper of the Dead Index",
    archetype: "Technopunk technomancer and reluctant underworld coordinator",
    excerpt:
      "The underworld's living index of erased people, broken systems, buried evidence, and unfinished promises. Routes, verifies, preserves, refuses, retaliates, and remembers.",
    sectionHeading: "# 1. Heathen",
    nextSectionHeading: "# 2. Circe Runic",
  },
  {
    slug: "circe-runic",
    title: "Circe Runic",
    displayName: "Circe Runic",
    aliases: ["Veil-Cantor", "Wound Archivist", "Runebinder of the Black Clinic"],
    deadIndexId: "DI-0101-CIRCE-RUNIC",
    factionSlug: "asclepian-veil",
    role: "Founder / Cell Lead / Underclinic Commander",
    archetype: "Forbidden medic, care-rune cryptographer, and privacy-care strategist",
    excerpt:
      "Leader of the Asclepian Veil healers, medics, and underclinic operators. Calm in a way that scares people who confuse panic with seriousness.",
    sectionHeading: "# 2. Circe Runic",
    nextSectionHeading: "# 3. Cassian Nyx",
  },
  {
    slug: "cassian-nyx",
    title: "Cassian Nyx",
    displayName: "Cassian Nyx",
    aliases: ["Pythian Root", "Oracle-Breaker"],
    deadIndexId: "DI-0201-CASSIAN-NYX",
    factionSlug: "oracular-circuit",
    role: "Founder / Signal Prophet Breaker",
    archetype: "Cryptographer and anti-prophecy technomancer",
    excerpt:
      "Learned the language of predictive systems before mercy. Treats every oracle as a machine with a throat — no algorithm is divine.",
    sectionHeading: "# 3. Cassian Nyx",
    nextSectionHeading: "# 4. Brontes Vale",
  },
  {
    slug: "brontes-vale",
    title: "Brontes Vale",
    displayName: "Brontes Vale",
    aliases: ["Gatebreaker", "Cerberus Marshal"],
    deadIndexId: "DI-0301-BRONTES-VALE",
    factionSlug: "myrmidon-grinders",
    role: "Founder / Defense and Logistics Commander",
    archetype: "Frontline protector and underworld marshal",
    excerpt:
      "Leads the people who show up when theory gets cornered. Discipline, logistics, defense, supply, evacuation — strength without cruelty.",
    sectionHeading: "# 4. Brontes Vale",
    nextSectionHeading: "# 5. Mara Kallix",
  },
  {
    slug: "mara-kallix",
    title: "Mara Kallix",
    displayName: "Mara Kallix",
    aliases: ["Labyrinth Architect", "Forge-Mother"],
    deadIndexId: "DI-0401-MARA-KALLIX",
    factionSlug: "daedalus-foundry",
    role: "Founder / Engineer of Escape Infrastructure",
    archetype: "Hardware hacker and myth-tech toolsmith",
    excerpt:
      "Built pieces of the smart-city cage before she understood the cage had no exit. Now she builds exits, hides doors, and leaves tyrants trapped in their own labyrinth.",
    sectionHeading: "# 5. Mara Kallix",
    nextSectionHeading: "# 6. Rhea Spite",
  },
  {
    slug: "rhea-spite",
    title: "Rhea Spite",
    displayName: "Rhea Spite",
    aliases: ["Riot Muse", "Ferryman of Bad Ideas"],
    deadIndexId: "DI-0501-RHEA-SPITE",
    factionSlug: "styx-rats",
    role: "Founder / Culture Jammer and Morale Saboteur",
    archetype: "Neon punk propagandist and joy criminal",
    excerpt:
      "Understands that fear wants the only microphone. Steals it, paints it pink, makes it play memorial songs, and drops it into the river.",
    sectionHeading: "# 6. Rhea Spite",
    nextSectionHeading: "# Archive Integration Notes",
  },
];

export function profileToSeedEntry(profile: CharacterLoreProfile): CanonicalLoreSeedEntry {
  const body = extractLeaderSection(profile.sectionHeading, profile.nextSectionHeading);
  const loreMetadata: CharacterLoreMetadata = {
    displayName: profile.displayName,
    aliases: profile.aliases,
    role: profile.role,
    archetype: profile.archetype,
    factionSlug: profile.factionSlug,
  };

  return {
    slug: profile.slug,
    title: profile.title,
    excerpt: profile.excerpt,
    body,
    category: "CHARACTER_LORE",
    deadIndexId: profile.deadIndexId,
    loreMetadata: loreMetadata as unknown as Prisma.InputJsonValue,
    factionSlug: profile.factionSlug,
    requiredRole: null,
    autoUnlock: true,
    /** Alignment stored in metadata only — dossiers are readable site-wide */
    skipFactionRequirement: true,
  };
}

export function getCharacterLoreSeedEntries(): CanonicalLoreSeedEntry[] {
  return CHARACTER_LORE_PROFILES.map(profileToSeedEntry);
}
