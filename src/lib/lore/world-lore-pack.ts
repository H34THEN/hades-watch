export const WORLD_LORE_PACK_FILE = "docs/lore/WORLD_LORE_PACK_001_SURFACE_BREAKS.md";

export interface WorldLoreMetadata {
  threatClass: string;
  relatedSystems: string[];
  relatedFactions: string[];
  subCategory?: string;
  unlockType?: string;
  pack?: string;
}

export interface WorldLorePackEntry {
  slug: string;
  title: string;
  excerpt: string;
  sectionHeading: string;
  nextSectionHeading: string;
  metadata: WorldLoreMetadata;
}

export const SURFACE_BREAKS_WORLD_LORE: WorldLorePackEntry[] = [
  {
    slug: "the-jackal-ledger",
    title: "The Jackal Ledger",
    excerpt:
      "The Surface Order's efficiency purge hollowed public systems, erased workers, broke services, and transformed government obligations into rentable private infrastructure.",
    sectionHeading: "# Entry 01: The Jackal Ledger",
    nextSectionHeading: "# Entry 02: The Bronze Gate Levies",
    metadata: {
      threatClass: "Civic Necrosis",
      relatedSystems: ["Ledger Purges", "Austerity Machine", "Cabinet of False Olympians", "Dead Index"],
      relatedFactions: ["asclepian-veil", "oracular-circuit", "daedalus-foundry"],
      subCategory: "austerity-collapse",
      unlockType: "Dead Index Evidence Chain",
      pack: "surface-breaks-001",
    },
  },
  {
    slug: "the-bronze-gate-levies",
    title: "The Bronze Gate Levies",
    excerpt:
      "Tariffs transformed into myth-tech tribute gates, producing shortages, price shocks, repair failures, and an underground logistics resistance.",
    sectionHeading: "# Entry 02: The Bronze Gate Levies",
    nextSectionHeading: "# Entry 03: The White Lantern Hunts",
    metadata: {
      threatClass: "Manufactured Hunger",
      relatedSystems: ["Bronze Gate Levies", "Surface Order", "Cloud-Titan Logistics", "Scarcity Markets"],
      relatedFactions: ["myrmidon-grinders", "daedalus-foundry", "styx-rats"],
      subCategory: "trade-scarcity",
      unlockType: "World System Dossier",
      pack: "surface-breaks-001",
    },
  },
  {
    slug: "the-white-lantern-hunts",
    title: "The White Lantern Hunts",
    excerpt:
      "Border enforcement fused with biometric surveillance, producing raids, disappearances, tourism collapse, trade flight, and underground escort networks.",
    sectionHeading: "# Entry 03: The White Lantern Hunts",
    nextSectionHeading: "# Entry 04: The Two New Fires",
    metadata: {
      threatClass: "Civic Exorcism",
      relatedSystems: [
        "All-Seeing Census",
        "Border Warden Ministries",
        "Loyalty Scans",
        "Tourism Collapse",
        "Trade Flight",
      ],
      relatedFactions: ["asclepian-veil", "myrmidon-grinders", "styx-rats", "oracular-circuit"],
      subCategory: "border-terror",
      unlockType: "Underwatch Advisory",
      pack: "surface-breaks-001",
    },
  },
  {
    slug: "the-two-new-fires",
    title: "The Two New Fires",
    excerpt:
      "Two foreign wars ignite under Surface Order rule, feeding energy shocks, propaganda, refugee crises, and Cloud-Titan war profiteering.",
    sectionHeading: "# Entry 04: The Two New Fires",
    nextSectionHeading: "# Entry 05: The Thunder Casket Posts",
    metadata: {
      threatClass: "Foreign Flame",
      relatedSystems: [
        "Cabinet of False Olympians",
        "War-Priest Broadcasts",
        "Cloud-Titan Arms Markets",
        "Refugee Corridors",
      ],
      relatedFactions: ["asclepian-veil", "oracular-circuit", "myrmidon-grinders", "daedalus-foundry"],
      subCategory: "war-escalation",
      unlockType: "Conflict Dossier",
      pack: "surface-breaks-001",
    },
  },
  {
    slug: "the-thunder-casket-posts",
    title: "The Thunder Casket Posts",
    excerpt:
      "Divine-war authority becomes social-feed spectacle as the High Executor uses nuclear terror as content, distraction, and loyalty theater.",
    sectionHeading: "# Entry 05: The Thunder Casket Posts",
    nextSectionHeading: "# Cursor Implementation Prompt",
    metadata: {
      threatClass: "Annihilation Theater",
      relatedSystems: [
        "Thunder Casket",
        "War-Priest Broadcasts",
        "Cabinet of False Olympians",
        "Propaganda Spectacle",
      ],
      relatedFactions: ["styx-rats", "oracular-circuit", "asclepian-veil"],
      subCategory: "nuclear-spectacle",
      unlockType: "Myth-Tech Crisis Record",
      pack: "surface-breaks-001",
    },
  },
];

export const SURFACE_BREAKS_WORLD_LORE_SLUGS = SURFACE_BREAKS_WORLD_LORE.map((e) => e.slug);
