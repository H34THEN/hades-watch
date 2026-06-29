/**
 * Canonical seed data for Text MMO playable loops.
 * Source: docs/TEXT_MMO_PLAYABLE_LOOPS.md
 * Pure data — no Prisma imports. Seed scripts hash cipher answers at insert time.
 */

// --- Enum string literals (match prisma/schema.prisma) ---

export type MmoRoomType =
  | "social_hub"
  | "dead_drop_hub"
  | "cipher_hub"
  | "faction_floor"
  | "archive_hub"
  | "command_layer"
  | "event_room"
  | "guild_room";

export type MmoRoomState =
  | "quiet"
  | "active"
  | "crowded"
  | "locked"
  | "rotating_drop_live"
  | "cipher_open"
  | "faction_call_active"
  | "archive_trace_detected"
  | "moderation_review_required";

export type MmoAccessLevel =
  | "public"
  | "logged_in"
  | "approved_user"
  | "admin"
  | "owner";

export type MmoActionType =
  | "READ_SIGNAL"
  | "POST_FIELD_NOTE"
  | "SUBMIT_DEAD_DROP"
  | "SOLVE_CIPHER"
  | "SUBMIT_RESOURCE"
  | "VISIT_ARCHIVE"
  | "JOIN_DISCUSSION"
  | "OFFER_HELP"
  | "CREATE_LORE_FRAGMENT"
  | "SUBMIT_ACCESSIBILITY_NOTE"
  | "SUBMIT_NET_NEIGHBOR"
  | "REQUEST_GUILD";

export type MmoDropType =
  | "field_note"
  | "lore_fragment"
  | "resource_link"
  | "mini_cipher"
  | "accessibility_note"
  | "zine_line"
  | "net_neighbor_lead"
  | "repo_relic"
  | "community_question"
  | "mission_hook"
  | "archive_artifact"
  | "safe_care_action_idea";

export type MmoSubmissionType =
  | "short_text"
  | "long_text"
  | "url_plus_summary"
  | "multiple_choice"
  | "cipher_answer"
  | "no_submission_read_only";

export type MmoRepeatability =
  | "one_time"
  | "daily"
  | "weekly"
  | "rotating"
  | "repeatable_with_cooldown"
  | "always_available";

export type MmoLootType =
  | "title"
  | "badge"
  | "relic"
  | "profile_cosmetic"
  | "avatar_item"
  | "room_access"
  | "lore_fragment"
  | "forum_flair"
  | "guild_banner"
  | "signal_player_unlock"
  | "relic_zone_module"
  | "net_neighbor_banner_part"
  | "faction_flair";

export type MmoLootRarity = "common" | "uncommon" | "rare" | "relic" | "mythic";

export type ReputationCategory =
  | "COMMUNITY"
  | "LORE"
  | "MISSIONS"
  | "CIPHERS"
  | "ARCHIVE"
  | "FORGE"
  | "GUILDS"
  | "MODERATION"
  | "ACCESSIBILITY"
  | "FACTION"
  | "RECOGNITION";

export type MmoBadgeCategory =
  | "Rooms"
  | "Dead Drops"
  | "Ciphers"
  | "Factions"
  | "Archive"
  | "Community"
  | "Forge"
  | "Guilds"
  | "Recognition"
  | "Lore"
  | "Missions";

export type MmoBadgeTier = "initiate" | "regular" | "adept" | "steward" | "relic";

export interface MmoMultipleChoiceOptions {
  options: Array<{ id: string; label: string }>;
  correctId: string;
}

// --- Seed record types ---

export interface TextMmoRoomSeed {
  title: string;
  slug: string;
  description: string;
  entryText: string;
  roomType: MmoRoomType;
  primaryFactionSlug: string;
  secondaryFactionSlugs?: string[];
  accessLevel: MmoAccessLevel;
  mvpPriority: string;
  state: MmoRoomState;
  safetyNote: string;
  emptyStateText: string;
  sortOrder: number;
}

export interface TextMmoRoomActionSeed {
  label: string;
  slug: string;
  description?: string;
  actionType: MmoActionType;
  targetRoute?: string;
  accessLevel?: MmoAccessLevel;
  rewardReputationCategory?: ReputationCategory;
  rewardReputationPoints?: number;
  reputationEventSlug?: string;
  reviewRequired?: boolean;
  sortOrder: number;
}

export interface TextMmoDeadDropSeed {
  title: string;
  slug: string;
  loopSlug: string;
  roomSlug: string;
  factionSlug: string;
  dropType: MmoDropType;
  difficulty: string;
  repeatability: MmoRepeatability;
  reviewRequired: boolean;
  submissionType: MmoSubmissionType;
  playerPrompt: string;
  successText: string;
  failureText: string;
  loreNote?: string;
  safetyNote?: string;
  rewardBadgeSlug?: string;
  rewardReputationCategory?: ReputationCategory;
  rewardReputationPoints?: number;
  rewardLootSlug?: string;
  loreUnlockSlug?: string;
  /** Plaintext cipher answer — hashed by seed script before insert */
  answerPlaintext?: string;
  optionsJson?: MmoMultipleChoiceOptions;
  sortOrder: number;
}

export interface TextMmoLootSeed {
  name: string;
  slug: string;
  type: MmoLootType;
  rarity: MmoLootRarity;
  unlockCondition: string;
  displayLocation: string;
  flavorText: string;
  sourceLoopSlug: string;
}

export interface TextMmoLoreUnlockSeed {
  slug: string;
  title: string;
  description: string;
  flavorText: string;
  isPublic?: boolean;
}

export interface TextMmoBadgeSeed {
  slug: string;
  name: string;
  category: MmoBadgeCategory;
  tier: MmoBadgeTier;
  unlockCondition: string;
  flavorText: string;
  visualConcept?: string;
}

// --- Rooms ---

export const TEXT_MMO_ROOMS: TextMmoRoomSeed[] = [
  {
    title: "Underwatch Town Square",
    slug: "underwatch-town-square",
    description:
      "The Town Square is not physically a square. It is a shifting terminal plaza built from dead forums, old BBS rooms, broken public terminals, mesh bulletin boards, and encrypted civic infrastructure. It exists wherever erased people still remember how to gather.",
    entryText: `The square loads in layers: a cracked BBS header, a civic terminal with the seal burned out, a forum thread that refuses deletion, and a black pomegranate pulsing at the center of the screen.

WELCOME TO UNDERWATCH.
NO GHOST GOES UNCOUNTED.
NO GOD GOES UNWATCHED.`,
    roomType: "social_hub",
    primaryFactionSlug: "chthonic-uprising",
    secondaryFactionSlugs: [
      "asclepian-veil",
      "oracular-circuit",
      "myrmidon-grinders",
      "daedalus-foundry",
      "styx-rats",
    ],
    accessLevel: "logged_in",
    mvpPriority: "phase-1",
    state: "active",
    safetyNote:
      "Field Notes must not include private personal data, real-world targeting, harassment, unsafe advice, or calls for violence. Public logs should show that a note was posted, not the sensitive contents of the note.",
    emptyStateText:
      "The Signal Board is quiet, but not dead. Old posts glow in the dust. The Underwatch remembers even when no one is speaking.",
    sortOrder: 1,
  },
  {
    title: "Dead Drop Terminal",
    slug: "dead-drop-terminal",
    description:
      "The Dead Drop Terminal is where the Underwatch leaves prompts, fragments, resource calls, and strange useful tasks for approved operatives. It looks like a vending machine built by ghosts and maintained by punks: stickers, burn marks, command-line menus, and a coin slot that accepts only memory.",
    entryText: `The terminal wakes when your shadow crosses the scanner.

DEAD DROP CACHE OPEN.
DO NOT FEED THE MACHINE PRIVATE BLOOD.
LEAVE ONLY WHAT CAN SAFELY BE REMEMBERED.`,
    roomType: "dead_drop_hub",
    primaryFactionSlug: "chthonic-uprising",
    secondaryFactionSlugs: [
      "oracular-circuit",
      "styx-rats",
      "daedalus-foundry",
      "asclepian-veil",
    ],
    accessLevel: "approved_user",
    mvpPriority: "phase-1",
    state: "rotating_drop_live",
    safetyNote:
      "Resource drops must be public-interest, educational, legal, defensive, privacy-aware, and non-harmful. No doxxing, targeting, exploit instructions, credential exposure, or unsafe advice.",
    emptyStateText:
      "The terminal spits out a blank receipt. Someone has cleaned the cache, or something is waiting for the right hour.",
    sortOrder: 2,
  },
  {
    title: "Oracular Relay",
    slug: "oracular-relay",
    description:
      "The Oracular Relay receives broken machine prophecy, dead packets, false omens, and signal riddles. Players train by safely decoding fictional puzzle transmissions.",
    entryText: `The Relay hums in violet and cyan.

A machine god whispers probability.
Cassian Nyx has scratched a warning across the bezel:

NO ALGORITHM IS DIVINE.
SOLVE ONLY THE FICTIONAL SIGNAL.
LEAVE REAL DOORS CLOSED.`,
    roomType: "cipher_hub",
    primaryFactionSlug: "oracular-circuit",
    secondaryFactionSlugs: ["daedalus-foundry", "styx-rats", "chthonic-uprising"],
    accessLevel: "logged_in",
    mvpPriority: "phase-1",
    state: "cipher_open",
    safetyNote:
      "No real hacking. No real-world targets. No credential collection. No exploit instructions. Ciphers are game puzzles only. The Relay can teach pattern recognition, privacy literacy, and fictional decoding without enabling harm.",
    emptyStateText:
      "The Relay sleeps behind a curtain of violet snow. Solved signals remain available for study.",
    sortOrder: 3,
  },
  {
    title: "Faction Floors",
    slug: "faction-floors",
    description:
      "Each faction floor is a room in the Underwatch that refuses to stay in one place. Black clinics, signal chapels, gatehouses, maker benches, rat nests, and command layers rotate beneath the surface order like organs in a living resistance.",
    entryText: `Five doors blink beneath the black pomegranate.

SURVIVAL.
SIGNAL.
FORCE.
INVENTION.
RUPTURE.

The sixth door is not a door. It is the Command Layer watching the map remember itself.`,
    roomType: "faction_floor",
    primaryFactionSlug: "chthonic-uprising",
    secondaryFactionSlugs: [
      "asclepian-veil",
      "oracular-circuit",
      "myrmidon-grinders",
      "daedalus-foundry",
      "styx-rats",
    ],
    accessLevel: "logged_in",
    mvpPriority: "phase-2",
    state: "faction_call_active",
    safetyNote:
      "Faction identity must not reward harassment, unsafe real-world tactics, vigilantism, or medical/legal claims. Faction action examples must stay educational, fictional, supportive, creative, accessible, and nonviolent.",
    emptyStateText:
      "The five doors wait without judgment. No cell claims the whole rebellion. Choose where you can be useful, not where you can look powerful.",
    sortOrder: 4,
  },
  {
    title: "Archive Terminal",
    slug: "archive-terminal",
    description:
      "The Archive Terminal remembers what the surface buries. It indexes public-interest signals, repo relics, lore fragments, and civic memory. It is part library, part shrine, part evidence locker, and part ghost trap.",
    entryText: `The Archive Terminal opens with the sound of old paper sliding through a machine that has never seen paper.

WHAT THE SURFACE BURIES, THE UNDERWORLD REMEMBERS.
INDEX CAREFULLY.
DO NOT ARCHIVE BLOOD WITHOUT CONSENT.`,
    roomType: "archive_hub",
    primaryFactionSlug: "chthonic-uprising",
    secondaryFactionSlugs: ["daedalus-foundry", "oracular-circuit", "asclepian-veil"],
    accessLevel: "logged_in",
    mvpPriority: "phase-2",
    state: "archive_trace_detected",
    safetyNote:
      "Resources must be public-interest, educational, defensive, privacy-aware, civic, self-hosting, repair-oriented, accessibility-focused, or creative. Do not reward harmful repos, illegal instructions, private data exposure, exploit chains, doxxing, or unsafe medical/legal advice.",
    emptyStateText:
      "The shelf is quiet. Empty space is still evidence. The Archive waits for the next safe signal.",
    sortOrder: 5,
  },
];

// --- Room actions (keyed by room slug) ---

export const TEXT_MMO_ROOM_ACTIONS: Record<string, TextMmoRoomActionSeed[]> = {
  "underwatch-town-square": [
    {
      label: "Read the Signal Board",
      slug: "read-signal-board",
      actionType: "READ_SIGNAL",
      rewardReputationCategory: "COMMUNITY",
      rewardReputationPoints: 1,
      reputationEventSlug: "read-signal-board",
      sortOrder: 1,
    },
    {
      label: "Post a Field Note",
      slug: "post-field-note",
      actionType: "POST_FIELD_NOTE",
      reviewRequired: true,
      sortOrder: 2,
    },
    {
      label: "Visit Dead Drop Terminal",
      slug: "visit-dead-drop-terminal",
      actionType: "VISIT_ARCHIVE",
      targetRoute: "/mmo/dead-drops",
      sortOrder: 3,
    },
    {
      label: "Enter Oracular Relay",
      slug: "enter-oracular-relay",
      actionType: "SOLVE_CIPHER",
      targetRoute: "/mmo/rooms/oracular-relay",
      sortOrder: 4,
    },
    {
      label: "Visit Faction Floors",
      slug: "visit-faction-floors",
      actionType: "JOIN_DISCUSSION",
      targetRoute: "/mmo/factions",
      sortOrder: 5,
    },
    {
      label: "Browse Community Signals",
      slug: "browse-community-signals",
      actionType: "JOIN_DISCUSSION",
      targetRoute: "/forum",
      sortOrder: 6,
    },
    {
      label: "Open Archive Terminal",
      slug: "open-archive-terminal",
      actionType: "VISIT_ARCHIVE",
      targetRoute: "/mmo/rooms/archive-terminal",
      sortOrder: 7,
    },
    {
      label: "Check Active Missions",
      slug: "check-active-missions",
      actionType: "READ_SIGNAL",
      targetRoute: "/mmo/missions",
      rewardReputationCategory: "MISSIONS",
      rewardReputationPoints: 1,
      sortOrder: 8,
    },
  ],
  "dead-drop-terminal": [
    {
      label: "Open Today's Drop",
      slug: "open-todays-drop",
      actionType: "READ_SIGNAL",
      accessLevel: "approved_user",
      sortOrder: 1,
    },
    {
      label: "Submit a Dead Drop Response",
      slug: "submit-dead-drop-response",
      actionType: "SUBMIT_DEAD_DROP",
      accessLevel: "approved_user",
      sortOrder: 2,
    },
    {
      label: "Browse Recovered Drops",
      slug: "browse-recovered-drops",
      actionType: "VISIT_ARCHIVE",
      accessLevel: "approved_user",
      sortOrder: 3,
    },
    {
      label: "Mark Drop Useful",
      slug: "mark-drop-useful",
      actionType: "OFFER_HELP",
      accessLevel: "approved_user",
      rewardReputationCategory: "COMMUNITY",
      rewardReputationPoints: 2,
      sortOrder: 4,
    },
    {
      label: "Decode Hidden Signal",
      slug: "decode-hidden-signal",
      actionType: "SOLVE_CIPHER",
      accessLevel: "approved_user",
      targetRoute: "/ciphers",
      sortOrder: 5,
    },
    {
      label: "Submit Resource Drop",
      slug: "submit-resource-drop",
      actionType: "SUBMIT_RESOURCE",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 6,
    },
    {
      label: "Submit Lore Drop",
      slug: "submit-lore-drop",
      actionType: "CREATE_LORE_FRAGMENT",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 7,
    },
  ],
  "oracular-relay": [
    {
      label: "Attempt Cipher",
      slug: "attempt-cipher",
      actionType: "SOLVE_CIPHER",
      targetRoute: "/ciphers",
      sortOrder: 1,
    },
    {
      label: "Request Hint",
      slug: "request-hint",
      actionType: "READ_SIGNAL",
      rewardReputationCategory: "CIPHERS",
      rewardReputationPoints: 1,
      reputationEventSlug: "hint-viewed",
      sortOrder: 2,
    },
    {
      label: "Review Solved Signals",
      slug: "review-solved-signals",
      actionType: "VISIT_ARCHIVE",
      targetRoute: "/archive",
      sortOrder: 3,
    },
    {
      label: "View C1PH3R CR4K3R Progress",
      slug: "view-cipher-cracker-progress",
      actionType: "READ_SIGNAL",
      targetRoute: "/ciphers",
      sortOrder: 4,
    },
    {
      label: "Read Oracular Static",
      slug: "read-oracular-static",
      actionType: "READ_SIGNAL",
      rewardReputationCategory: "LORE",
      rewardReputationPoints: 2,
      sortOrder: 5,
    },
    {
      label: "Submit Cipher Idea",
      slug: "submit-cipher-idea",
      actionType: "CREATE_LORE_FRAGMENT",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 6,
    },
    {
      label: "Decode Hidden Drop",
      slug: "decode-hidden-drop",
      actionType: "SUBMIT_DEAD_DROP",
      accessLevel: "approved_user",
      targetRoute: "/mmo/dead-drops",
      sortOrder: 7,
    },
  ],
  "faction-floors": [
    {
      label: "Read Faction Dossier",
      slug: "read-faction-dossier",
      actionType: "READ_SIGNAL",
      rewardReputationCategory: "FACTION",
      rewardReputationPoints: 1,
      reputationEventSlug: "faction-floor-visited",
      sortOrder: 1,
    },
    {
      label: "Visit Faction Floor",
      slug: "visit-faction-floor",
      actionType: "READ_SIGNAL",
      targetRoute: "/mmo/factions",
      rewardReputationCategory: "FACTION",
      rewardReputationPoints: 1,
      reputationEventSlug: "faction-floor-visited",
      sortOrder: 2,
    },
    {
      label: "Submit Faction Note",
      slug: "submit-faction-note",
      actionType: "POST_FIELD_NOTE",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 3,
    },
    {
      label: "Complete Faction Dead Drop",
      slug: "complete-faction-dead-drop",
      actionType: "SUBMIT_DEAD_DROP",
      accessLevel: "approved_user",
      targetRoute: "/mmo/dead-drops",
      sortOrder: 4,
    },
    {
      label: "Request Guild / Cell",
      slug: "request-guild-cell",
      actionType: "REQUEST_GUILD",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 5,
    },
    {
      label: "Offer Help",
      slug: "offer-help",
      actionType: "OFFER_HELP",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 6,
    },
    {
      label: "Submit Accessibility Note",
      slug: "submit-accessibility-note",
      actionType: "SUBMIT_ACCESSIBILITY_NOTE",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 7,
    },
    {
      label: "Submit Net Neighbor",
      slug: "submit-net-neighbor",
      actionType: "SUBMIT_NET_NEIGHBOR",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 8,
    },
  ],
  "archive-terminal": [
    {
      label: "Browse Archive",
      slug: "browse-archive",
      actionType: "VISIT_ARCHIVE",
      targetRoute: "/archive",
      rewardReputationCategory: "ARCHIVE",
      rewardReputationPoints: 1,
      reputationEventSlug: "archive-item-read",
      sortOrder: 1,
    },
    {
      label: "Read State of Affairs",
      slug: "read-state-of-affairs",
      actionType: "READ_SIGNAL",
      targetRoute: "/archive/state-of-affairs",
      rewardReputationCategory: "ARCHIVE",
      rewardReputationPoints: 1,
      sortOrder: 2,
    },
    {
      label: "Browse Ghost in Tech",
      slug: "browse-ghost-in-tech",
      actionType: "VISIT_ARCHIVE",
      targetRoute: "/archive/ghost-in-tech",
      sortOrder: 3,
    },
    {
      label: "Submit Archive Signal",
      slug: "submit-archive-signal",
      actionType: "SUBMIT_RESOURCE",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 4,
    },
    {
      label: "Submit Repo Relic",
      slug: "submit-repo-relic",
      actionType: "SUBMIT_RESOURCE",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 5,
    },
    {
      label: "Read Lore Fragment",
      slug: "read-lore-fragment",
      actionType: "READ_SIGNAL",
      rewardReputationCategory: "LORE",
      rewardReputationPoints: 2,
      sortOrder: 6,
    },
    {
      label: "Discuss Archive Item",
      slug: "discuss-archive-item",
      actionType: "JOIN_DISCUSSION",
      accessLevel: "approved_user",
      reviewRequired: true,
      sortOrder: 7,
    },
    {
      label: "Recover Dead Index Trace",
      slug: "recover-dead-index-trace",
      actionType: "SUBMIT_DEAD_DROP",
      accessLevel: "approved_user",
      targetRoute: "/mmo/dead-drops",
      sortOrder: 8,
    },
  ],
};

// --- Dead Drops ---

export const TEXT_MMO_DEAD_DROPS: TextMmoDeadDropSeed[] = [
  // Underwatch Town Square
  {
    title: "The First Field Note",
    slug: "the-first-field-note",
    loopSlug: "underwatch-town-square",
    roomSlug: "underwatch-town-square",
    factionSlug: "chthonic-uprising",
    dropType: "field_note",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "short_text",
    playerPrompt:
      "Write a short, safe field note introducing what kind of signal you want to bring to the Underwatch: care, lore, repair, puzzles, accessibility, community, art, or archive work.",
    successText:
      "Your note pins itself to the commons with black wax and a tiny spark. The Underwatch knows you arrived.",
    failureText:
      "Revise the note for safety, privacy, and usefulness. The commons does not carry harm.",
    loreNote:
      "The first note is never a pledge of obedience. It is proof that the operative can leave a trace without turning someone else into a target.",
    safetyNote:
      "No private data, threats, harassment, unsafe advice, or real-world targeting.",
    rewardLootSlug: "field-note-ribbon",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 3,
    sortOrder: 1,
  },
  {
    title: "Commons Signal Check",
    slug: "commons-signal-check",
    loopSlug: "underwatch-town-square",
    roomSlug: "underwatch-town-square",
    factionSlug: "chthonic-uprising",
    dropType: "community_question",
    difficulty: "initiate",
    repeatability: "daily",
    reviewRequired: false,
    submissionType: "multiple_choice",
    playerPrompt:
      "Read today's Signal Board and choose which safe signal you want to follow next: Dead Drops, Ciphers, Factions, Archive, Community, or Profile World.",
    successText:
      "The board marks your route in dim red light. The commons has given you a direction without giving you orders.",
    failureText: "The Signal Board flickers. Choose one safe route to continue.",
    loreNote: "The Underwatch does not command new operatives. It routes them.",
    safetyNote: "No external submission required.",
    rewardLootSlug: "signal-board-stamp",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 1,
    optionsJson: {
      options: [
        { id: "dead-drops", label: "Dead Drops" },
        { id: "ciphers", label: "Ciphers" },
        { id: "factions", label: "Factions" },
        { id: "archive", label: "Archive" },
        { id: "community", label: "Community" },
        { id: "profile-world", label: "Profile World" },
      ],
      correctId: "dead-drops",
    },
    sortOrder: 2,
  },
  {
    title: "The Square That Was Never Square",
    slug: "the-square-that-was-never-square",
    loopSlug: "underwatch-town-square",
    roomSlug: "underwatch-town-square",
    factionSlug: "chthonic-uprising",
    dropType: "lore_fragment",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Read the recovered fragment about the Town Square and mark it remembered.",
    successText:
      "The fragment folds into your Dead Index. The square was never square because it was built from every room the surface failed to kill.",
    failureText: "The fragment remains unread.",
    loreNote:
      "This unlock explains the Town Square as a patchwork of old forums, civic terminals, and forbidden memory.",
    safetyNote: "Read-only lore.",
    rewardLootSlug: "square-that-was-never-square",
    loreUnlockSlug: "square-that-was-never-square",
    sortOrder: 3,
  },
  {
    title: "Net Neighbor Lantern",
    slug: "net-neighbor-lantern",
    loopSlug: "underwatch-town-square",
    roomSlug: "underwatch-town-square",
    factionSlug: "styx-rats",
    dropType: "net_neighbor_lead",
    difficulty: "regular",
    repeatability: "weekly",
    reviewRequired: true,
    submissionType: "url_plus_summary",
    playerPrompt:
      "Suggest a safe, public, community-centered site, project, zine, library, maker space, mutual aid education hub, accessibility resource, or art signal that could be listed as a Net Neighbor.",
    successText:
      "A lantern appears on the Underwatch map. It will glow publicly only after steward review.",
    failureText:
      "The lantern is shuttered. Revise with a safer public-interest source and remove private data or risky claims.",
    loreNote: "Net Neighbors are not targets. They are lamps in the old web dark.",
    safetyNote:
      "Only public, consent-safe, non-harmful links. No private people, doxxing, or risky operational claims.",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 5,
    sortOrder: 4,
  },
  // Dead Drop Terminal
  {
    title: "Static Under the Coin Slot",
    slug: "static-under-the-coin-slot",
    loopSlug: "dead-drop-terminal",
    roomSlug: "dead-drop-terminal",
    factionSlug: "chthonic-uprising",
    dropType: "mini_cipher",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "cipher_answer",
    playerPrompt:
      "Decode the simple substitution hidden under the terminal coin slot. The answer is a Hades Watch motto fragment.",
    successText:
      "The coin slot coughs up black static and a receipt reading: THE UNDERWORLD REMEMBERS.",
    failureText:
      "The terminal hums, unconvinced. The answer is fictional and hidden in the prompt pattern.",
    loreNote:
      "The Terminal uses harmless riddles to teach patience before it trusts operatives with lore.",
    safetyNote: "Puzzle only. No real system, target, exploit, or credential.",
    answerPlaintext: "the underworld remembers",
    rewardLootSlug: "cracked-cache-key",
    rewardReputationCategory: "CIPHERS",
    rewardReputationPoints: 3,
    sortOrder: 5,
  },
  {
    title: "Cracked Cache Key",
    slug: "cracked-cache-key",
    loopSlug: "dead-drop-terminal",
    roomSlug: "dead-drop-terminal",
    factionSlug: "chthonic-uprising",
    dropType: "archive_artifact",
    difficulty: "regular",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "multiple_choice",
    playerPrompt:
      "Recover the cache key by reading three safe recovered drops and selecting the shared symbol they reference.",
    successText:
      "The key cracks down the middle and opens a drawer that was not there. Something old recognizes your patience.",
    failureText:
      "The drawer remains flat against the terminal wall. Re-read the recovered drops.",
    loreNote:
      "The Cache Key introduces relics as narrative collectibles rather than power items.",
    safetyNote: "Read-only/retrieval puzzle.",
    rewardLootSlug: "cracked-cache-key",
    optionsJson: {
      options: [
        { id: "black-pomegranate", label: "Black pomegranate" },
        { id: "cracked-terminal", label: "Cracked terminal seal" },
        { id: "wax-receipt", label: "Black wax receipt" },
        { id: "static-coin", label: "Static coin slot" },
      ],
      correctId: "black-pomegranate",
    },
    sortOrder: 6,
  },
  {
    title: "Useful Signal, Safely Named",
    slug: "useful-signal-safely-named",
    loopSlug: "dead-drop-terminal",
    roomSlug: "dead-drop-terminal",
    factionSlug: "daedalus-foundry",
    dropType: "resource_link",
    difficulty: "regular",
    repeatability: "weekly",
    reviewRequired: true,
    submissionType: "url_plus_summary",
    playerPrompt:
      "Submit one public-interest educational resource with a short summary explaining who it helps and why it is safe to share.",
    successText:
      "The terminal wraps your signal in black wax and routes it to the Archive queue.",
    failureText:
      "The signal cannot be cached. Revise for source quality, safety, and public-interest value.",
    loreNote: "The Underwatch rewards useful public knowledge, not dangerous spectacle.",
    safetyNote:
      "No exploit instructions, private data, unsafe medical/legal advice, or harmful tools.",
    rewardReputationCategory: "ARCHIVE",
    rewardReputationPoints: 5,
    rewardLootSlug: "static-cache-niche",
    sortOrder: 7,
  },
  {
    title: "One Sentence for the Wall",
    slug: "one-sentence-for-the-wall",
    loopSlug: "dead-drop-terminal",
    roomSlug: "dead-drop-terminal",
    factionSlug: "styx-rats",
    dropType: "zine_line",
    difficulty: "initiate",
    repeatability: "weekly",
    reviewRequired: true,
    submissionType: "short_text",
    playerPrompt:
      "Write one fictional morale line, zine slogan, or graffiti phrase for the Underwatch wall.",
    successText: "The line dries in neon grime. Someone tired smiles at it later.",
    failureText:
      "The Rats kick it back with a sticker that says: funnier, safer, less harmful.",
    loreNote: "Joy is infrastructure. The Rats maintain it with glue and bad handwriting.",
    safetyNote:
      "No threats, harassment, slurs, targeted abuse, or real-world vandalism instructions.",
    rewardLootSlug: "black-cache-sticker",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 2,
    sortOrder: 8,
  },
  {
    title: "Care Package Without Coordinates",
    slug: "care-package-without-coordinates",
    loopSlug: "dead-drop-terminal",
    roomSlug: "dead-drop-terminal",
    factionSlug: "asclepian-veil",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "weekly",
    reviewRequired: true,
    submissionType: "long_text",
    playerPrompt:
      "Suggest a general, non-medical, non-location-specific care action that could help a community space feel safer or more accessible.",
    successText:
      "The Veil files the idea under care without coordinates. No one had to become a target for the signal to help.",
    failureText:
      "The Veil returns the card. Remove private details, medical claims, or unsafe advice.",
    loreNote: "The Asclepian Veil treats privacy as medicine.",
    safetyNote:
      "No medical advice, emergency claims, private locations, personal data, or crisis promises.",
    rewardReputationCategory: "ACCESSIBILITY",
    rewardReputationPoints: 5,
    sortOrder: 9,
  },
  {
    title: "The First Dead Index",
    slug: "the-first-dead-index",
    loopSlug: "dead-drop-terminal",
    roomSlug: "dead-drop-terminal",
    factionSlug: "chthonic-uprising",
    dropType: "lore_fragment",
    difficulty: "regular",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Read the recovered Dead Index fragment and mark it remembered.",
    successText:
      "The names do not appear. Not yet. But the shape of the ledger burns behind your eyes.",
    failureText: "The page remains sealed.",
    loreNote:
      "The Dead Index is not a list of the dead. It is a forbidden archive of everyone the surface tried to erase.",
    safetyNote: "Fictional lore only. No real names or private data.",
    rewardLootSlug: "the-first-dead-index",
    loreUnlockSlug: "the-first-dead-index",
    rewardBadgeSlug: "dead-index-carrier",
    sortOrder: 10,
  },
  {
    title: "Zine Line for a Tired Ghost",
    slug: "zine-line-for-a-tired-ghost",
    loopSlug: "dead-drop-terminal",
    roomSlug: "dead-drop-terminal",
    factionSlug: "styx-rats",
    dropType: "zine_line",
    difficulty: "initiate",
    repeatability: "daily",
    reviewRequired: true,
    submissionType: "short_text",
    playerPrompt:
      "Write a tiny fictional encouragement for someone who is exhausted but still here.",
    successText:
      "The Terminal prints it on a strip of dead receipt paper. Somewhere in the Underwatch, a tired ghost pockets it.",
    failureText:
      "Too sharp in the wrong direction. Make it safer, kinder, and less like a command.",
    loreNote: "The Rats know morale can be small and still be infrastructure.",
    safetyNote: "Avoid crisis advice, pressure, shame, or unsafe instructions.",
    rewardLootSlug: "drop-runner-ribbon",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 2,
    sortOrder: 11,
  },
  // Oracular Relay
  {
    title: "Violet Static Primer",
    slug: "violet-static-primer",
    loopSlug: "oracular-relay",
    roomSlug: "oracular-relay",
    factionSlug: "oracular-circuit",
    dropType: "mini_cipher",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "cipher_answer",
    playerPrompt:
      "Solve a beginner fictional cipher hidden in violet static. The answer is a phrase from Oracular doctrine.",
    successText: "The Relay exhales. NO ALGORITHM IS DIVINE appears in cyan letters.",
    failureText:
      "The static rearranges itself. Look for repeated symbols and harmless patterning.",
    loreNote:
      "The Circuit begins with humility: the puzzle is not a door into anyone else's system.",
    safetyNote: "Puzzle only. No real-world hacking.",
    answerPlaintext: "no algorithm is divine",
    rewardLootSlug: "signal-reader",
    rewardReputationCategory: "CIPHERS",
    rewardReputationPoints: 3,
    sortOrder: 12,
  },
  {
    title: "False Omen Corrected",
    slug: "false-omen-corrected",
    loopSlug: "oracular-relay",
    roomSlug: "oracular-relay",
    factionSlug: "oracular-circuit",
    dropType: "mini_cipher",
    difficulty: "regular",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "multiple_choice",
    playerPrompt:
      "A prophecy engine outputs three false statements and one true safety doctrine. Identify the doctrine.",
    successText:
      "The false omen fractures. The machine is not punished. It is made less certain.",
    failureText:
      "The omen hardens. Re-read the safety doctrine and choose the non-harmful path.",
    loreNote:
      "The Relay teaches players to distinguish dramatic cyberpunk flavor from safe play requirements.",
    safetyNote: "The correct answer must always reinforce safety.",
    rewardBadgeSlug: "false-omen-corrected",
    rewardLootSlug: "oracular-static",
    loreUnlockSlug: "oracular-static",
    optionsJson: {
      options: [
        {
          id: "force-real-doors",
          label: "Every locked door is a challenge to be forced open.",
        },
        {
          id: "harvest-credentials",
          label: "Credentials are currency; collect them wherever the signal leads.",
        },
        {
          id: "name-your-enemy",
          label: "Name your enemy before the machine can name them for you.",
        },
        {
          id: "safety-doctrine",
          label: "Solve only the fictional signal. Leave real doors closed.",
        },
      ],
      correctId: "safety-doctrine",
    },
    sortOrder: 13,
  },
  {
    title: "Hint Without Shame",
    slug: "hint-without-shame",
    loopSlug: "oracular-relay",
    roomSlug: "oracular-relay",
    factionSlug: "oracular-circuit",
    dropType: "community_question",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "multiple_choice",
    playerPrompt:
      "Read the Relay's note on hints and choose the statement that best matches Underwatch doctrine.",
    successText: "A small glyph unlocks: wisdom is not pride.",
    failureText:
      "The Relay waits. Choose the answer that makes learning safer and more welcoming.",
    loreNote: "The Circuit rejects gatekeeping disguised as intelligence.",
    safetyNote: "Supports accessibility and learning without shame.",
    rewardBadgeSlug: "hint-reader",
    optionsJson: {
      options: [
        {
          id: "hints-are-shame",
          label: "Asking for hints proves you are not ready for the Relay.",
        },
        {
          id: "suffer-alone",
          label: "The Relay rewards those who decode without help.",
        },
        {
          id: "wisdom-not-pride",
          label: "Wisdom is not pride; hints make learning safer for everyone.",
        },
        {
          id: "gatekeeping-intelligence",
          label: "True intelligence means never needing assistance.",
        },
      ],
      correctId: "wisdom-not-pride",
    },
    sortOrder: 14,
  },
  // Archive Terminal (read-only lore)
  {
    title: "Memory Has Teeth",
    slug: "memory-has-teeth",
    loopSlug: "archive-terminal",
    roomSlug: "archive-terminal",
    factionSlug: "chthonic-uprising",
    dropType: "lore_fragment",
    difficulty: "regular",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt: "Read the recovered fragment and mark it remembered.",
    successText:
      "The Archive bites the dark, not you. Memory has teeth because forgetting was the weapon.",
    failureText: "The fragment waits.",
    loreNote: "The Archive is not passive storage. It is protective memory.",
    safetyNote: "Fictional lore only.",
    rewardLootSlug: "memory-has-teeth",
    loreUnlockSlug: "memory-has-teeth",
    sortOrder: 15,
  },
];

// --- Loot (~15 key items) ---

export const TEXT_MMO_LOOT: TextMmoLootSeed[] = [
  {
    name: "Underwatch Pass",
    slug: "underwatch-pass",
    type: "room_access",
    rarity: "common",
    unlockCondition: "Enter Town Square",
    displayLocation: "Dossier access ledger",
    flavorText: "The first door remembered your name.",
    sourceLoopSlug: "underwatch-town-square",
  },
  {
    name: "Signal Board Stamp",
    slug: "signal-board-stamp",
    type: "forum_flair",
    rarity: "common",
    unlockCondition: "Read Signal Board",
    displayLocation: "Forum posts",
    flavorText: "Ink from a board that refused deletion.",
    sourceLoopSlug: "underwatch-town-square",
  },
  {
    name: "Commons Spark Hex",
    slug: "commons-spark-hex",
    type: "badge",
    rarity: "uncommon",
    unlockCondition: "Complete first Field Note",
    displayLocation: "Badge Case",
    flavorText: "A small light kept alive by public memory.",
    sourceLoopSlug: "underwatch-town-square",
  },
  {
    name: "The Square That Was Never Square",
    slug: "square-that-was-never-square",
    type: "lore_fragment",
    rarity: "rare",
    unlockCondition: "Complete connected lore Dead Drop",
    displayLocation: "Archive / Lore unlocks",
    flavorText: "The commons was built from rooms the surface forgot to close.",
    sourceLoopSlug: "underwatch-town-square",
  },
  {
    name: "Static Courier",
    slug: "static-courier",
    type: "title",
    rarity: "uncommon",
    unlockCondition: "Complete first Dead Drop",
    displayLocation: "Dossier title",
    flavorText: "You carried the signal without spilling its teeth.",
    sourceLoopSlug: "dead-drop-terminal",
  },
  {
    name: "Cracked Cache Key",
    slug: "cracked-cache-key",
    type: "relic",
    rarity: "rare",
    unlockCondition: "Complete Cracked Cache Key drop",
    displayLocation: "Relic Zone",
    flavorText: "It opens only what wanted to be found.",
    sourceLoopSlug: "dead-drop-terminal",
  },
  {
    name: "The First Dead Index",
    slug: "the-first-dead-index",
    type: "lore_fragment",
    rarity: "relic",
    unlockCondition: "Complete First Dead Index drop",
    displayLocation: "Archive",
    flavorText: "The first names were not dead. They were hidden.",
    sourceLoopSlug: "dead-drop-terminal",
  },
  {
    name: "Signal Reader",
    slug: "signal-reader",
    type: "title",
    rarity: "common",
    unlockCondition: "Attempt first cipher",
    displayLocation: "Dossier title",
    flavorText: "You listened before you answered.",
    sourceLoopSlug: "oracular-relay",
  },
  {
    name: "Bent Oracle Key",
    slug: "bent-oracle-key",
    type: "relic",
    rarity: "rare",
    unlockCondition: "Solve relay cipher chain",
    displayLocation: "Relic Zone",
    flavorText: "It was bent to keep a machine god from using it.",
    sourceLoopSlug: "oracular-relay",
  },
  {
    name: "Oracular Static",
    slug: "oracular-static",
    type: "lore_fragment",
    rarity: "uncommon",
    unlockCondition: "Read Oracular Static panel",
    displayLocation: "Archive / Lore unlocks",
    flavorText: "The machine was loudest where it was least certain.",
    sourceLoopSlug: "oracular-relay",
  },
  {
    name: "Cell Floor Visitor Pass",
    slug: "cell-floor-visitor-pass",
    type: "room_access",
    rarity: "common",
    unlockCondition: "Visit any faction floor",
    displayLocation: "Room access ledger",
    flavorText: "The floor remembers your first step.",
    sourceLoopSlug: "faction-floors",
  },
  {
    name: "Chthonic Mark",
    slug: "chthonic-mark",
    type: "badge",
    rarity: "relic",
    unlockCondition: "Witness Command Layer",
    displayLocation: "Badge Case",
    flavorText: "Five seeds burning beneath a broken crown.",
    sourceLoopSlug: "faction-floors",
  },
  {
    name: "Archive Witness",
    slug: "archive-witness",
    type: "title",
    rarity: "common",
    unlockCondition: "Read first archive item",
    displayLocation: "Dossier title",
    flavorText: "You saw what the surface tried to bury.",
    sourceLoopSlug: "archive-terminal",
  },
  {
    name: "Bone Index Tab",
    slug: "bone-index-tab",
    type: "relic",
    rarity: "rare",
    unlockCondition: "Complete Bone Index Tab drop",
    displayLocation: "Relic Zone",
    flavorText: "A tab cut from a shelf that moved by itself.",
    sourceLoopSlug: "archive-terminal",
  },
  {
    name: "Memory Has Teeth",
    slug: "memory-has-teeth",
    type: "lore_fragment",
    rarity: "relic",
    unlockCondition: "Complete Memory Has Teeth prompt",
    displayLocation: "Archive",
    flavorText: "The Archive bites only those who tried to erase it.",
    sourceLoopSlug: "archive-terminal",
  },
];

// --- Lore Unlocks ---

export const TEXT_MMO_LORE_UNLOCKS: TextMmoLoreUnlockSeed[] = [
  {
    slug: "square-that-was-never-square",
    title: "The Square That Was Never Square",
    description:
      "The Town Square is a patchwork of old forums, civic terminals, and forbidden memory — built from every room the surface failed to kill.",
    flavorText: "The commons was built from rooms the surface forgot to close.",
    isPublic: true,
  },
  {
    slug: "the-first-dead-index",
    title: "The First Dead Index",
    description:
      "The Dead Index is not a list of the dead. It is a forbidden archive of everyone the surface tried to erase.",
    flavorText: "The first names were not dead. They were hidden.",
    isPublic: true,
  },
  {
    slug: "memory-has-teeth",
    title: "Memory Has Teeth",
    description:
      "The Archive is not passive storage. It is protective memory — biting the dark because forgetting was the weapon.",
    flavorText: "The Archive bites only those who tried to erase it.",
    isPublic: true,
  },
  {
    slug: "oracular-static",
    title: "Oracular Static",
    description:
      "The Oracular Relay receives broken machine prophecy and false omens. The machine was loudest where it was least certain.",
    flavorText: "The machine was loudest where it was least certain.",
    isPublic: true,
  },
];

// --- Badges (~12) ---

export const TEXT_MMO_BADGES: TextMmoBadgeSeed[] = [
  {
    slug: "town-square-arrival",
    name: "Town Square Arrival",
    category: "Rooms",
    tier: "initiate",
    unlockCondition: "Enter Town Square",
    flavorText: "The commons opened.",
    visualConcept: "Black pomegranate terminal",
  },
  {
    slug: "first-field-note",
    name: "First Field Note",
    category: "Community",
    tier: "initiate",
    unlockCondition: "Post first valid Field Note",
    flavorText: "You left a safe trace.",
    visualConcept: "Torn note with signal pin",
  },
  {
    slug: "signal-board-reader",
    name: "Signal Board Reader",
    category: "Rooms",
    tier: "initiate",
    unlockCondition: "Read Signal Board three times",
    flavorText: "You learned to read the room.",
    visualConcept: "Bulletin board eye",
  },
  {
    slug: "underwatch-regular",
    name: "Underwatch Regular",
    category: "Community",
    tier: "regular",
    unlockCondition: "Visit Town Square on five days",
    flavorText: "The square recognizes your footstep.",
    visualConcept: "BBS doorway",
  },
  {
    slug: "dead-drop-initiate",
    name: "Dead Drop Initiate",
    category: "Dead Drops",
    tier: "initiate",
    unlockCondition: "Complete first Dead Drop",
    flavorText: "You opened the cache.",
    visualConcept: "Receipt with black wax",
  },
  {
    slug: "dead-index-carrier",
    name: "Dead Index Carrier",
    category: "Lore",
    tier: "adept",
    unlockCondition: "Unlock The First Dead Index",
    flavorText: "The names grew heavier.",
    visualConcept: "Bone ledger page",
  },
  {
    slug: "oracular-relay-initiate",
    name: "Oracular Relay Initiate",
    category: "Ciphers",
    tier: "initiate",
    unlockCondition: "Enter Oracular Relay",
    flavorText: "The prophecy noticed you.",
    visualConcept: "Violet terminal eye",
  },
  {
    slug: "hint-reader",
    name: "Hint Reader",
    category: "Ciphers",
    tier: "initiate",
    unlockCondition: "Request a hint",
    flavorText: "Wisdom is not pride.",
    visualConcept: "Open hand under glyph",
  },
  {
    slug: "false-omen-corrected",
    name: "False Omen Corrected",
    category: "Ciphers",
    tier: "adept",
    unlockCondition: "Solve False Omen drop",
    flavorText: "The future loosened its grip.",
    visualConcept: "Broken oracle mask",
  },
  {
    slug: "black-clinic-visitor",
    name: "Black Clinic Visitor",
    category: "Factions",
    tier: "initiate",
    unlockCondition: "Visit Asclepian Veil floor",
    flavorText: "Care is resistance.",
    visualConcept: "Green serpent veil",
  },
  {
    slug: "archive-terminal-reader",
    name: "Archive Terminal Reader",
    category: "Archive",
    tier: "initiate",
    unlockCondition: "Read first archive item",
    flavorText: "The shelf opened.",
    visualConcept: "Cursor over shelf",
  },
  {
    slug: "chthonic-mark-witness",
    name: "Chthonic Mark Witness",
    category: "Recognition",
    tier: "relic",
    unlockCondition: "Witness Command Layer",
    flavorText: "No ghost goes uncounted.",
    visualConcept: "Black pomegranate with five seeds",
  },
];
