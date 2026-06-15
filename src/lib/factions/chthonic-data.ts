import type { FactionPosition } from "@/generated/prisma/client";

export const ALLIANCE_SLUG = "chthonic-uprising";

export const ARCHIVIST_LORE = {
  operationalName: "Heathen",
  aliases: ["The Archivist", "Slewfoot"],
  titles: [
    "The Archivist",
    "Keeper of the Dead Index",
    "Warden of the Five Cells",
    "Sovereign of the Underwatch",
    "Chthonic Overlord",
    "Hades-Blood Regent",
  ],
  summary:
    "Heathen, also known as The Archivist and Slewfoot, is the Keeper of the Dead Index and mythic equivalent of the Owner role. A witness, organizer, technomancer, and reluctant coordinator — not a flawless chosen-one ruler.",
  doctrine:
    "The Uprising was built collectively. Heathen holds custodianship over the Dead Index: memory with obligations, access with accountability. Every faction answers because the archive preserves the truth that makes resistance possible. Underworld power is a tool. Sunlight is the promise.",
};

export const ALLIANCE_DATA = {
  slug: ALLIANCE_SLUG,
  name: "The Chthonic Uprising",
  description:
    "A distributed underworld resistance formed beneath the technocratic surface regime. The Archivist gathered the first cells after discovering fragments of the Dead Index.",
  tagline: "What the surface buries, the underworld remembers.",
  archetype: "Parent Alliance",
  leaderName: "Heathen",
  leaderTitle: "The Archivist / Slewfoot / Keeper of the Dead Index",
  leaderLore:
    "The Archivist does not command like a king. The Archivist remembers, routes, verifies, preserves, and retaliates.",
  motto: "No ghost goes uncounted. No god goes unwatched.",
  symbol:
    "A black pomegranate split open over a circuit labyrinth, with five seeds glowing like warning lights.",
  isAlliance: true,
  coreValues: [
    "survival",
    "signal",
    "force",
    "invention",
    "rupture",
  ],
};

export interface FactionSeedData {
  slug: string;
  name: string;
  description: string;
  tagline: string;
  archetype: string;
  leaderName: string;
  leaderTitle: string;
  leaderLore: string;
  coreValues: string[];
  palette: Record<string, string>;
  symbol: string;
  motto?: string;
  rivalrySlug: string;
  synergySlug: string;
  themeUnlock: string;
  typicalMissions: string[];
  reputationFlavor: string;
  badges: string[];
  titles: { starting: string; advanced: string[] };
  positionTitles: Record<FactionPosition, string>;
}

export const CHTHONIC_FACTIONS: FactionSeedData[] = [
  {
    slug: "asclepian-veil",
    name: "The Asclepian Veil",
    description:
      "Healers, medics, caretakers, harm-reduction workers, field stabilizers, and trauma responders operating underground clinics beneath the surveillance regime.",
    tagline: "We keep the living from becoming data ghosts.",
    archetype: "Healers & Care Network",
    leaderName: "Circe Runic",
    leaderTitle: "Veil-Cantor / Wound Archivist",
    leaderLore:
      "Circe Runic was once a corporate biomedical compliance cryptographer assigned to audit nonviable populations for predictive triage contracts. After discovering that the city's health algorithms were intentionally denying care to dissent clusters, she leaked the mortality models to the Archivist and vanished into the underworld.",
    coreValues: [
      "Care is resistance",
      "No body is disposable",
      "Privacy is medicine",
      "Recovery is operational readiness",
      "Harm reduction over purity",
    ],
    palette: {
      veilGreen: "#38F8A8",
      boneWhite: "#E8F4EF",
      surgicalSilver: "#AAB8B2",
      emergencyPomegranate: "#B1123A",
      underclinicBlack: "#07110D",
    },
    symbol:
      "A serpent wrapped around a fiber-optic staff, half medical rod and half encrypted antenna. Behind it: a translucent veil shaped like a shield.",
    rivalrySlug: "myrmidon-grinders",
    synergySlug: "daedalus-foundry",
    themeUnlock: "Veil Clinic",
    typicalMissions: [
      "Wellness check-ins",
      "Crisis resource routing",
      "Harm-reduction guides",
      "Mutual aid coordination",
      "Emergency preparation",
      "Psychological first-aid training",
      "Medical privacy education",
      "Recovery/rest accountability",
    ],
    reputationFlavor:
      "Gaining standing with the Veil means proving that you can protect life without spectacle. Their trust grows through consistency, discretion, and care.",
    badges: [
      "Field Stabilizer",
      "Veilbearer",
      "Harm-Reduction Saint",
      "Ghost Triage",
      "Panacea Node",
      "Wound Archivist",
    ],
    titles: {
      starting: "Veil Initiate",
      advanced: [
        "Field Medic",
        "Signal Clinician",
        "Black Clinic Keeper",
        "Panacea Handler",
        "Wound Archivist",
      ],
    },
    positionTitles: {
      INITIATE: "Veil Initiate",
      MEMBER: "Field Medic",
      SPECIALIST: "Signal Clinician",
      CELL_LEAD: "Black Clinic Keeper",
      LIEUTENANT: "Panacea Handler",
      LEADER: "Wound Archivist",
    },
  },
  {
    slug: "oracular-circuit",
    name: "The Oracular Circuit",
    description:
      "Technomancers, hackers, signal analysts, cryptographers, AI whisperers, and systems mystics who read and break machine prophecy.",
    tagline: "We read the machine's prophecy and teach it to lie.",
    archetype: "Signal & Cipher Cell",
    leaderName: "Cassian Nyx",
    leaderTitle: "Pythian Root / Oracle-Breaker",
    leaderLore:
      "Cassian Nyx was raised inside a predictive policing lab where machine-learning models were treated like gods and citizens like weather patterns. When the system predicted the death of someone Cassian loved, Cassian broke the model, stole its training data, and followed the corrupted output to the Archivist.",
    coreValues: [
      "No algorithm is divine",
      "Prediction is a prison",
      "Obfuscation is prayer",
      "Encryption is sanctuary",
      "Every oracle can be blinded",
    ],
    palette: {
      oracleViolet: "#9D4EDD",
      signalCyan: "#00F5FF",
      blackGlass: "#05030A",
      staticWhite: "#F1F7FF",
      prophecyBlue: "#3A86FF",
    },
    symbol:
      "A cracked Delphi tripod with fiber-optic smoke rising into an eye made of circuit traces.",
    rivalrySlug: "styx-rats",
    synergySlug: "daedalus-foundry",
    themeUnlock: "Oracle Static",
    typicalMissions: [
      "Cipher solving",
      "OPSEC education",
      "Metadata minimization",
      "Threat modeling",
      "Surveillance research",
      "Secure comms guides",
      "Pattern analysis",
      "Digital dead-drop decoding",
    ],
    reputationFlavor:
      "The Circuit respects precision, patience, and paranoia. Their standing rises when users solve puzzles, protect communications, and document hostile systems.",
    badges: [
      "Signal Listener",
      "Cipher Adept",
      "Oracle-Breaker",
      "Dataset Heretic",
      "Hecate Keyholder",
      "Static Prophet",
    ],
    titles: {
      starting: "Circuit Acolyte",
      advanced: [
        "Signal Seer",
        "Cipher Adept",
        "Oracle-Breaker",
        "Fate Spoofer",
        "Pythian Root",
      ],
    },
    positionTitles: {
      INITIATE: "Circuit Acolyte",
      MEMBER: "Signal Seer",
      SPECIALIST: "Cipher Adept",
      CELL_LEAD: "Oracle-Breaker",
      LIEUTENANT: "Fate Spoofer",
      LEADER: "Pythian Root",
    },
  },
  {
    slug: "myrmidon-grinders",
    name: "The Myrmidon Grinders",
    description:
      "Grunts, defenders, frontline workers, logistics crews, physical security, and direct support for the underworld resistance.",
    tagline: "When the gates break, we become the gate.",
    archetype: "Defense & Logistics Cell",
    leaderName: "Brontes Vale",
    leaderTitle: "Gatebreaker / Cerberus Marshal",
    leaderLore:
      "Brontes Vale came from the labor warrens beneath the automated ports, where exosuits replaced unions and workplace injuries were billed as equipment misuse. After leading a dockside strike that was erased from every newsfeed, Brontes joined the Chthonic Uprising as its first shield.",
    coreValues: [
      "Hold the line",
      "Carry your people",
      "Strength without cruelty",
      "Discipline over ego",
      "Defense is sacred",
    ],
    palette: {
      furnaceBronze: "#B87333",
      hazardGold: "#F5B700",
      carbonBlack: "#080808",
      bloodSignal: "#D62828",
      concreteAsh: "#8D99AE",
    },
    symbol:
      "A three-headed Cerberus helm over crossed crowbars and a broken corporate badge.",
    rivalrySlug: "asclepian-veil",
    synergySlug: "styx-rats",
    themeUnlock: "Cerberus Gate",
    typicalMissions: [
      "Event safety",
      "Logistics planning",
      "Physical preparedness",
      "Protest marshal training",
      "Emergency evacuation plans",
      "Community defense checklists",
      "Supply runs",
      "Mutual aid distribution",
    ],
    reputationFlavor:
      "The Grinders respect reliability. Show up. Carry weight. Do not posture. Protect the vulnerable.",
    badges: [
      "Line Holder",
      "Gatewatch",
      "Cerberus Mark",
      "Shield Runner",
      "Riot Saint",
      "Underworld Marshal",
    ],
    titles: {
      starting: "Grinder Recruit",
      advanced: [
        "Line Holder",
        "Shield Runner",
        "Gatebreaker",
        "Cerberus Marshal",
        "Myrmidon Prime",
      ],
    },
    positionTitles: {
      INITIATE: "Grinder Recruit",
      MEMBER: "Line Holder",
      SPECIALIST: "Shield Runner",
      CELL_LEAD: "Gatebreaker",
      LIEUTENANT: "Cerberus Marshal",
      LEADER: "Myrmidon Prime",
    },
  },
  {
    slug: "daedalus-foundry",
    name: "The Daedalus Foundry",
    description:
      "Inventors, engineers, makers, builders, hardware hackers, toolsmiths, and system designers forging escape infrastructure.",
    tagline: "Build the exit. Hide the door. Leave the tyrant trapped inside.",
    archetype: "Maker & Engineering Cell",
    leaderName: "Mara Kallix",
    leaderTitle: "Labyrinth Architect / Forge-Mother",
    leaderLore:
      "Mara Kallix designed compliance hardware for smart cities until she realized every sensor she built became another brick in the labyrinth. The Archivist offered her a different commission: build tools for escape.",
    coreValues: [
      "Tools should liberate",
      "Repair is rebellion",
      "Complexity should protect the vulnerable, not confuse them",
      "Build exits, not cages",
      "Every labyrinth needs a hidden maintenance tunnel",
    ],
    palette: {
      forgeOrange: "#FF7A1A",
      blueprintBlue: "#2EC4FF",
      blackIron: "#111111",
      brassLine: "#C99A49",
      labyrinthGray: "#6C757D",
    },
    symbol:
      "A mechanical wing folded into the shape of a labyrinth, with a small key hidden at the center.",
    rivalrySlug: "oracular-circuit",
    synergySlug: "asclepian-veil",
    themeUnlock: "Labyrinth Forge",
    typicalMissions: [
      "Hardware builds",
      "Repair guides",
      "Self-hosting projects",
      "Privacy tool kits",
      "Mesh network experiments",
      "3D-printable tools",
      "Accessibility devices",
      "Infrastructure hardening",
    ],
    reputationFlavor:
      "The Foundry values useful things that survive contact with reality. Prototypes are sacred, but documentation is divine.",
    badges: [
      "Toolsmith",
      "Labyrinth Runner",
      "Forge Spark",
      "Blackbox Breaker",
      "Escape Architect",
      "Daedalus Mark",
    ],
    titles: {
      starting: "Foundry Apprentice",
      advanced: [
        "Toolsmith",
        "Circuit Smith",
        "Labyrinth Engineer",
        "Forge Architect",
        "Daedalus Prime",
      ],
    },
    positionTitles: {
      INITIATE: "Foundry Apprentice",
      MEMBER: "Toolsmith",
      SPECIALIST: "Circuit Smith",
      CELL_LEAD: "Labyrinth Engineer",
      LIEUTENANT: "Forge Architect",
      LEADER: "Daedalus Prime",
    },
  },
  {
    slug: "styx-rats",
    name: "The Styx Rats",
    description:
      "Punks, artists, saboteurs, scouts, culture jammers, graffiti cells, and social disruptors weaponizing morale and humiliation.",
    tagline: "We make the empire look stupid enough to bleed.",
    archetype: "Culture Jam & Sabotage Cell",
    leaderName: "Rhea Spite",
    leaderTitle: "Riot Muse / Ferryman of Bad Ideas",
    leaderLore:
      "Rhea Spite grew up in the ad-choked entertainment districts where every feeling had a sponsor. She became infamous for hijacking corporate billboards and replacing luxury ads with names of the dead and strike songs.",
    coreValues: [
      "Mock the gods",
      "Joy is sabotage",
      "Beauty can be a blade",
      "Never let fear have the only microphone",
      "If the city is a prison, paint the bars",
    ],
    palette: {
      spitePink: "#FF2A6D",
      acidGreen: "#B6FF00",
      sewerBlack: "#050505",
      chromeScratch: "#C0C0C0",
      bruisePurple: "#6A00F4",
    },
    symbol:
      "A rat skull with a ferryman coin in its teeth, crowned with a broken neon halo.",
    rivalrySlug: "oracular-circuit",
    synergySlug: "myrmidon-grinders",
    themeUnlock: "Styx Riot",
    typicalMissions: [
      "Propaganda drops",
      "Art challenges",
      "Morale posts",
      "Signal boosting",
      "Culture-jamming ops",
      "Public narrative disruption",
      "Street-level scouting",
      "Meme warfare",
    ],
    reputationFlavor:
      "The Rats reward audacity, humor, and loyalty. They distrust anyone too polished to laugh at a god.",
    badges: [
      "Graffiti Ghost",
      "Meme Smuggler",
      "Oathbreaker",
      "Riot Muse",
      "Ferryman's Rat",
      "Spite Saint",
    ],
    titles: {
      starting: "Styx Stray",
      advanced: [
        "Graffiti Ghost",
        "Signal Vandal",
        "Riot Muse",
        "Oathbreaker",
        "Ferryman of Static",
      ],
    },
    positionTitles: {
      INITIATE: "Styx Stray",
      MEMBER: "Graffiti Ghost",
      SPECIALIST: "Signal Vandal",
      CELL_LEAD: "Riot Muse",
      LIEUTENANT: "Oathbreaker",
      LEADER: "Ferryman of Static",
    },
  },
];

export const FACTION_SHORT_NAMES: Record<string, string> = {
  "asclepian-veil": "Asclepian Veil",
  "oracular-circuit": "Oracular Circuit",
  "myrmidon-grinders": "Myrmidon Grinders",
  "daedalus-foundry": "Daedalus Foundry",
  "styx-rats": "Styx Rats",
};

export const POSITION_SLUGS: Record<FactionPosition, string> = {
  INITIATE: "initiate",
  MEMBER: "member",
  SPECIALIST: "specialist",
  CELL_LEAD: "cell-lead",
  LIEUTENANT: "lieutenant",
  LEADER: "leader",
};

export const POSITION_LABELS: Record<FactionPosition, string> = {
  INITIATE: "Initiate",
  MEMBER: "Member",
  SPECIALIST: "Specialist",
  CELL_LEAD: "Cell Lead",
  LIEUTENANT: "Faction Lieutenant",
  LEADER: "Faction Leader",
};

export function getDisplayTitleForPosition(
  factionSlug: string,
  position: FactionPosition,
): string {
  const faction = CHTHONIC_FACTIONS.find((f) => f.slug === factionSlug);
  return faction?.positionTitles[position] ?? POSITION_LABELS[position];
}
