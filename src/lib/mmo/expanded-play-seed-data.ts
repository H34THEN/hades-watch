import type {
  MmoPlayActionType,
  MmoPublicWorksTaskType,
  ReputationCategory,
} from "@/generated/prisma/client";

export interface PlayFunctionSeed {
  slug: string;
  title: string;
  primaryRoute: string;
  connectedSystems: string[];
  primaryPlayType: string;
  accessLevel: string;
  repeatability: string;
  reviewRequirement: string;
  mvpPriority: string;
  description: string;
  loreFraming: string;
  playerFantasy: string;
  safetyNotes: string;
  sortOrder: number;
}

export interface PlayablePromptSeed {
  functionSlug: string;
  title: string;
  slug: string;
  prompt: string;
  actionType: MmoPlayActionType;
  category?: string;
  factionSlug?: string;
  connectedRoute?: string;
  difficulty?: string;
  repeatability?: string;
  cooldown?: string;
  reviewRequired?: boolean;
  proofStyle?: string;
  rewardSummary?: string;
  badgeHook?: string;
  avatarUnlockHook?: string;
  reputationCategory?: ReputationCategory;
  reputationPoints?: number;
  fieldLogTemplate?: string;
  safetyNote?: string;
  metadata?: Record<string, unknown>;
  sortOrder: number;
}

export interface PublicWorksTaskSeed {
  title: string;
  slug: string;
  taskType: MmoPublicWorksTaskType;
  difficulty: string;
  estimatedTime: string;
  ownerRole: string;
  description: string;
  acceptanceCriteria: string;
  rewardSummary: string;
  badgeHook?: string;
  avatarUnlockHook?: string;
  reviewRequired?: boolean;
  safetyNote: string;
  assetNeedPath?: string;
  sortOrder: number;
}

export interface RelicSetSeed {
  title: string;
  slug: string;
  fragmentsNeeded: string[];
  completedRelicName: string;
  profileDisplayEffect: string;
  avatarUnlockHook?: string;
  badgeHook?: string;
  safetyNote: string;
  sortOrder: number;
}

export interface RoomStateSeed {
  stateName: string;
  roomSlug: string | null;
  trigger: string;
  roomCopy: string;
  visualEffect: string;
  rewardHook?: string;
  safetyNote: string;
  sortOrder: number;
}

export interface VisitorSeed {
  name: string;
  slug: string;
  appearanceText: string;
  roomSlug: string;
  prompt: string;
  rewardSummary: string;
  loreUnlock?: string;
  avatarItem?: string;
  fieldLogText: string;
  safetyNote: string;
  sortOrder: number;
}

export interface SeasonalEventSeed {
  title: string;
  slug: string;
  seasonTiming: string;
  eventRooms: string[];
  eventPrompts: string[];
  eventRewards: string;
  badges: string[];
  profileCosmetics: string[];
  avatarUnlocks: string[];
  guildHooks: string;
  safetyNotes: string;
  sortOrder: number;
}

export interface RewardMappingSeed {
  sourceSlug: string;
  rewardType: "badge" | "avatar_unlock" | "title" | "reputation" | "lore_unlock" | "relic" | "profile_cosmetic" | "guild_banner" | "signal_player_unlock";
  rewardSlug: string;
  reviewRequired?: boolean;
  repeatability?: string;
  notes?: string;
}

export const EXPANDED_PLAY_FUNCTIONS: PlayFunctionSeed[] = [
  {
    slug: "daily-signals",
    title: "Daily Signals",
    primaryRoute: "/mmo/daily-signals",
    connectedSystems: ["Rooms", "Field Logs", "Reputation", "Profile World", "Archive", "Ciphers"],
    primaryPlayType: "tiny check-in prompts",
    accessLevel: "approved-user",
    repeatability: "daily",
    reviewRequirement: "mostly automatic; review for submitted notes",
    mvpPriority: "phase-1",
    description: "Tiny Underwatch prompts for days when you can do a little, read a little, rest a little, or leave one safe trace.",
    loreFraming: "The Underwatch routes controlled signals through terminal rooms — participation is a lantern, not a leash.",
    playerFantasy: "An operative whose small daily actions matter without combat or pressure-grind design.",
    safetyNotes: "Do not log sensitive content. No-guilt rest signals never penalize.",
    sortOrder: 1,
  },
  {
    slug: "weekly-faction-calls",
    title: "Weekly Faction Calls",
    primaryRoute: "/mmo/faction-calls",
    connectedSystems: ["Factions", "Field Logs", "Reputation", "Avatar Unlocks"],
    primaryPlayType: "faction prompts",
    accessLevel: "approved-user",
    repeatability: "weekly",
    reviewRequirement: "review required for submissions",
    mvpPriority: "phase-1",
    description: "Faction-specific prompts for safe contribution, accessibility, lore, repair, puzzles, and community care.",
    loreFraming: "Faction floors raise lanterns when cells need careful hands.",
    playerFantasy: "A faction operative answering their cell's weekly call.",
    safetyNotes: "Chthonic Uprising calls are Owner/Admin controlled for publishing.",
    sortOrder: 2,
  },
  {
    slug: "field-assignments",
    title: "Field Assignments",
    primaryRoute: "/mmo/assignments",
    connectedSystems: ["Dead Drops", "Archive", "Forums", "Profile World", "Guilds"],
    primaryPlayType: "structured non-combat missions",
    accessLevel: "approved-user",
    repeatability: "always-available",
    reviewRequirement: "varies by assignment",
    mvpPriority: "phase-1",
    description: "Structured tasks for reading, writing, archiving, testing, documenting, and strengthening the Underwatch.",
    loreFraming: "Field orders routed through the Dead Index as non-combat objectives.",
    playerFantasy: "An operative completing structured field work without violence.",
    safetyNotes: "No sensitive screenshots or personal data required.",
    sortOrder: 3,
  },
  {
    slug: "guild-projects",
    title: "Guild Projects",
    primaryRoute: "/community/guilds/[guildSlug]/projects",
    connectedSystems: ["Guilds", "Forums", "Archive", "Profile World"],
    primaryPlayType: "cooperative objectives",
    accessLevel: "approved-user",
    repeatability: "rotating",
    reviewRequirement: "review required",
    mvpPriority: "phase-2",
    description: "Cooperative guild objectives for archive shelves, zine walls, accessibility passes, and salon hosting.",
    loreFraming: "Guild cells coordinate safe communal work across the Underwatch.",
    playerFantasy: "A guild member contributing to shared creative infrastructure.",
    safetyNotes: "Reward cooperation, not competition or harassment.",
    sortOrder: 4,
  },
  {
    slug: "forum-quests",
    title: "Forum Quests",
    primaryRoute: "/community/forums/quests",
    connectedSystems: ["Forums", "Reputation", "Badges"],
    primaryPlayType: "forum activity objectives",
    accessLevel: "approved-user",
    repeatability: "weekly",
    reviewRequirement: "varies",
    mvpPriority: "phase-1",
    description: "Forum participation objectives that welcome newcomers and reward constructive discussion.",
    loreFraming: "The Commons threads carry signals worth preserving.",
    playerFantasy: "A forum operative who welcomes, answers, and quotes with care.",
    safetyNotes: "No spam rewards. Echo relay pending where quote system unavailable.",
    sortOrder: 5,
  },
  {
    slug: "profile-world-challenges",
    title: "Profile World Challenges",
    primaryRoute: "/profile/world/challenges",
    connectedSystems: ["Profile World", "Relic Zone", "Badge Case"],
    primaryPlayType: "profile customization objectives",
    accessLevel: "approved-user",
    repeatability: "always-available",
    reviewRequirement: "for public showcase",
    mvpPriority: "phase-2",
    description: "Profile customization challenges for readability, relic display, and safe old-web design.",
    loreFraming: "Your Profile World is a terminal shrine others may visit.",
    playerFantasy: "A curator of a readable, accessible operative display.",
    safetyNotes: "No flashing, raw scripts, or phishing-like layouts.",
    sortOrder: 6,
  },
  {
    slug: "archive-hunts",
    title: "Archive Hunts",
    primaryRoute: "/archive/hunts",
    connectedSystems: ["Archive", "Ghost in Tech", "State of Affairs", "Net Neighbors"],
    primaryPlayType: "curated reading scavenger hunts",
    accessLevel: "approved-user",
    repeatability: "weekly",
    reviewRequirement: "no unless submitting resources",
    mvpPriority: "phase-1",
    description: "Curated reading paths through lore, Ghost in Tech, State of Affairs, and Net Neighbor signals.",
    loreFraming: "The Archive Terminal leaves trace paths for careful readers.",
    playerFantasy: "An archivist following curated internal traces.",
    safetyNotes: "Curated internal links only. No live-target research.",
    sortOrder: 7,
  },
  {
    slug: "signal-player-broadcasts",
    title: "Signal Player Broadcasts",
    primaryRoute: "/signal-player/broadcasts",
    connectedSystems: ["Signal Player", "Profile World", "Rooms"],
    primaryPlayType: "playlist/ambience unlocks",
    accessLevel: "approved-user",
    repeatability: "rotating",
    reviewRequirement: "yes for concepts",
    mvpPriority: "phase-2",
    description: "Themed broadcast moods and skins — metadata-only until media support is ready.",
    loreFraming: "Static-safe channels tuned by operatives who know when to rest the dial.",
    playerFantasy: "A signal tuner curating ambient Underwatch moods.",
    safetyNotes: "No autoplay. User-controlled playback only.",
    sortOrder: 8,
  },
  {
    slug: "traveling-visitors",
    title: "Traveling NPC / System Visitors",
    primaryRoute: "/mmo/visitors",
    connectedSystems: ["Rooms", "Field Logs", "Lore"],
    primaryPlayType: "limited authored prompts",
    accessLevel: "approved-user",
    repeatability: "rotating",
    reviewRequirement: "varies",
    mvpPriority: "phase-3",
    description: "Authored event prompts from Underwatch visitors — not live AI chatbots.",
    loreFraming: "Ghosts and processes drift through rooms with small questions.",
    playerFantasy: "An operative who answers a visitor's safe prompt.",
    safetyNotes: "No AI chatbot behavior in MVP.",
    sortOrder: 9,
  },
  {
    slug: "seasonal-underwatch-events",
    title: "Seasonal Underwatch Events",
    primaryRoute: "/mmo/events",
    connectedSystems: ["Rooms", "Guilds", "Archive", "Events"],
    primaryPlayType: "limited seasonal arcs",
    accessLevel: "approved-user",
    repeatability: "seasonal",
    reviewRequirement: "varies",
    mvpPriority: "phase-3",
    description: "Low-pressure seasonal activities without FOMO or pay-to-win.",
    loreFraming: "Event lights bloom without demanding your hours.",
    playerFantasy: "A participant in seasonal Underwatch gatherings.",
    safetyNotes: "No guilt-based participation or unsafe real-world tasks.",
    sortOrder: 10,
  },
  {
    slug: "player-created-micro-missions",
    title: "Player-Created Micro-Missions",
    primaryRoute: "/mmo/micro-missions",
    connectedSystems: ["Community Builder", "Admin Review"],
    primaryPlayType: "reviewed player prompts",
    accessLevel: "approved-user",
    repeatability: "always-available",
    reviewRequirement: "review required",
    mvpPriority: "phase-2",
    description: "Reviewed micro-mission templates and player submissions for safe community prompts.",
    loreFraming: "Operatives propose small safe objectives for steward review.",
    playerFantasy: "A mission scribe drafting community-safe prompts.",
    safetyNotes: "All player-created missions require review before public availability.",
    sortOrder: 11,
  },
  {
    slug: "relic-crafting",
    title: "Relic Crafting and Collection",
    primaryRoute: "/profile/relics",
    connectedSystems: ["Relic Zone", "Profile World", "Archive Hunts"],
    primaryPlayType: "cosmetic collection sets",
    accessLevel: "approved-user",
    repeatability: "always-available",
    reviewRequirement: "no",
    mvpPriority: "phase-2",
    description: "Cosmetic relic fragment collection — Fictional Props & Tech Gear, not combat crafting.",
    loreFraming: "Fragments recovered from rooms, hunts, and safe community work assemble into display relics.",
    playerFantasy: "A collector assembling identity-forward relic sets.",
    safetyNotes: "No random loot boxes, gambling, or trading in MVP.",
    sortOrder: 12,
  },
  {
    slug: "room-state-progression",
    title: "Room State Progression",
    primaryRoute: "/mmo/rooms",
    connectedSystems: ["Rooms", "Public Works", "Events"],
    primaryPlayType: "community room changes",
    accessLevel: "approved-user",
    repeatability: "ongoing",
    reviewRequirement: "admin override possible",
    mvpPriority: "phase-3",
    description: "Room states reflect real community activity or admin-set conditions — never fake progress.",
    loreFraming: "Rooms breathe differently when enough safe activity accumulates.",
    playerFantasy: "An operative who helps stabilize a room's signal.",
    safetyNotes: "No pressure language for quiet rooms.",
    sortOrder: 13,
  },
  {
    slug: "mentor-guide-system",
    title: "Mentor / Guide System",
    primaryRoute: "/community/guides",
    connectedSystems: ["Forums", "Admin Review", "Recognition"],
    primaryPlayType: "public guide posts",
    accessLevel: "approved-user",
    repeatability: "always-available",
    reviewRequirement: "review required",
    mvpPriority: "phase-2",
    description: "Public guide posts and mentor templates — no private DM pressure.",
    loreFraming: "Lantern-keepers write public guides for newcomers.",
    playerFantasy: "A mentor sharing safe Underwatch knowledge publicly.",
    safetyNotes: "No off-platform pressure or private contact requirements.",
    sortOrder: 14,
  },
  {
    slug: "public-works-board",
    title: "Public Works Board",
    primaryRoute: "/community/public-works",
    connectedSystems: ["Volunteer Board", "Admin Review", "Avatar Assets", "Badges"],
    primaryPlayType: "community task board",
    accessLevel: "approved-user",
    repeatability: "rotating",
    reviewRequirement: "review required",
    mvpPriority: "phase-1",
    description: "Small tasks that help repair, document, decorate, test, and improve Hades Watch.",
    loreFraming: "The Commons maintenance board — build the infrastructure together.",
    playerFantasy: "A builder repairing and documenting the Underwatch itself.",
    safetyNotes: "No private credentials or exploit details in submissions.",
    sortOrder: 15,
  },
];

export const DAILY_SIGNALS: PlayablePromptSeed[] = [
  { functionSlug: "daily-signals", title: "Static Check-In", slug: "daily-static-check-in", prompt: "Name one safe thing your operative notices in the static today.", actionType: "POST_FIELD_NOTE", repeatability: "daily", cooldown: "daily", reviewRequired: false, rewardSummary: "1 Community rep, Daily Signal progress", reputationCategory: "COMMUNITY", reputationPoints: 1, fieldLogTemplate: "[callsign] answered the Static Check-In.", safetyNote: "Fictional or general reflection only.", sortOrder: 1 },
  { functionSlug: "daily-signals", title: "Read the Signal Board", slug: "daily-read-signal-board", prompt: "Read one active Signal Board item and mark it remembered.", actionType: "READ_SIGNAL", connectedRoute: "/mmo", repeatability: "daily", cooldown: "daily", reviewRequired: false, proofStyle: "no proof/read-only", rewardSummary: "1 Community rep", reputationCategory: "COMMUNITY", reputationPoints: 1, fieldLogTemplate: "[callsign] read the Signal Board.", safetyNote: "Read-only; no pressure to respond.", sortOrder: 2 },
  { functionSlug: "daily-signals", title: "One-Sentence Field Note", slug: "daily-one-sentence-field-note", prompt: "Leave one sentence from your room, guild cell, or profile world.", actionType: "POST_FIELD_NOTE", repeatability: "daily", cooldown: "daily", reviewRequired: true, rewardSummary: "2 Lore rep, field-note streak", reputationCategory: "LORE", reputationPoints: 2, fieldLogTemplate: "[callsign] posted a one-sentence Field Note.", safetyNote: "No sensitive real-world data.", sortOrder: 3 },
  { functionSlug: "daily-signals", title: "Archive Candle", slug: "daily-archive-candle", prompt: "Read one Archive item or lore fragment.", actionType: "VISIT_ARCHIVE", connectedRoute: "/archive", repeatability: "daily", cooldown: "daily", reviewRequired: false, proofStyle: "no proof/read-only", rewardSummary: "1 Archive rep", reputationCategory: "ARCHIVE", reputationPoints: 1, fieldLogTemplate: "[callsign] lit an Archive Candle.", safetyNote: "Use curated internal archive links.", sortOrder: 4 },
  { functionSlug: "daily-signals", title: "Cipher Tap", slug: "daily-cipher-tap", prompt: "Attempt one fictional cipher or request a hint.", actionType: "ATTEMPT_CIPHER", connectedRoute: "/ciphers", repeatability: "daily", cooldown: "daily", reviewRequired: false, rewardSummary: "1 Cipher rep", reputationCategory: "CIPHERS", reputationPoints: 1, fieldLogTemplate: "[callsign] tapped the Oracular Relay.", safetyNote: "Game puzzle only; no real targets.", sortOrder: 5 },
  { functionSlug: "daily-signals", title: "Faction Floor Pass", slug: "daily-faction-floor-pass", prompt: "Visit one faction floor and read its active call.", actionType: "VISIT_FACTION_FLOOR", connectedRoute: "/mmo/factions", repeatability: "daily", cooldown: "daily", reviewRequired: false, proofStyle: "no proof/read-only", rewardSummary: "1 Faction rep", reputationCategory: "FACTION", reputationPoints: 1, fieldLogTemplate: "[callsign] passed through a faction floor.", safetyNote: "No submission required.", sortOrder: 6 },
  { functionSlug: "daily-signals", title: "Forum Ember", slug: "daily-forum-ember", prompt: "React constructively to one forum thread or read a featured thread.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/forums", repeatability: "daily", cooldown: "daily", reviewRequired: false, rewardSummary: "1 Community rep", reputationCategory: "COMMUNITY", reputationPoints: 1, fieldLogTemplate: "[callsign] warmed a Forum Ember.", safetyNote: "No spam reactions or pile-ons.", sortOrder: 7 },
  { functionSlug: "daily-signals", title: "Profile World Glance", slug: "daily-profile-world-glance", prompt: "Preview one Profile World challenge or inspect your display.", actionType: "VISIT_PROFILE_WORLD", connectedRoute: "/profile/world/challenges", repeatability: "daily", cooldown: "daily", reviewRequired: false, proofStyle: "no proof/read-only", rewardSummary: "1 Profile rep", reputationCategory: "RECOGNITION", reputationPoints: 1, fieldLogTemplate: "[callsign] inspected a Profile World signal.", safetyNote: "No unsafe embeds or scripts.", sortOrder: 8 },
  { functionSlug: "daily-signals", title: "Net Neighbor Lookout", slug: "daily-net-neighbor-lookout", prompt: "Read one approved Net Neighbor card.", actionType: "READ_NET_NEIGHBOR", connectedRoute: "/net-neighbors", repeatability: "daily", cooldown: "daily", reviewRequired: false, proofStyle: "no proof/read-only", rewardSummary: "1 Community rep", reputationCategory: "COMMUNITY", reputationPoints: 1, fieldLogTemplate: "[callsign] checked the Net Neighbor lanterns.", safetyNote: "No unreviewed external targeting.", sortOrder: 9 },
  { functionSlug: "daily-signals", title: "Dead Drop Knock", slug: "daily-dead-drop-knock", prompt: "Open today's Dead Drop, even without submitting.", actionType: "OPEN_DEAD_DROP", connectedRoute: "/mmo/dead-drops", repeatability: "daily", cooldown: "daily", reviewRequired: false, proofStyle: "no proof/read-only", rewardSummary: "1 Mission rep", reputationCategory: "MISSIONS", reputationPoints: 1, fieldLogTemplate: "[callsign] knocked on the Dead Drop Terminal.", safetyNote: "No pressure to complete every drop.", sortOrder: 10 },
  { functionSlug: "daily-signals", title: "Signal Player Hum", slug: "daily-signal-player-hum", prompt: "Preview a Signal Player broadcast skin or playlist theme.", actionType: "VISIT_SIGNAL_PLAYER", connectedRoute: "/signal-player/broadcasts", repeatability: "daily", cooldown: "daily", reviewRequired: false, proofStyle: "no proof/read-only", rewardSummary: "1 Profile rep", reputationCategory: "RECOGNITION", reputationPoints: 1, fieldLogTemplate: "[callsign] tuned a Signal Player hum.", safetyNote: "No autoplay; user-controlled playback.", sortOrder: 11 },
  { functionSlug: "daily-signals", title: "Commons Question", slug: "daily-commons-question", prompt: "Answer one safe community question in a sentence or less.", actionType: "ANSWER_PROMPT", repeatability: "daily", cooldown: "daily", reviewRequired: false, rewardSummary: "2 Community rep", reputationCategory: "COMMUNITY", reputationPoints: 2, fieldLogTemplate: "[callsign] answered a Commons Question.", safetyNote: "Avoid medical, legal, or crisis advice.", sortOrder: 12 },
  { functionSlug: "daily-signals", title: "Quiet Repair", slug: "daily-quiet-repair", prompt: "Name one small thing that could make the site clearer or kinder.", actionType: "SUBMIT_FEEDBACK", repeatability: "daily", cooldown: "daily cap", reviewRequired: true, rewardSummary: "2 Forge or Accessibility rep", reputationCategory: "FORGE", reputationPoints: 2, fieldLogTemplate: "[callsign] filed a Quiet Repair note.", safetyNote: "No exploit details; report security issues privately.", sortOrder: 13 },
  { functionSlug: "daily-signals", title: "No-Guilt Rest Signal", slug: "daily-rest-signal", prompt: "Mark a rest day. Rest counts. No streak penalty.", actionType: "REST_SIGNAL", repeatability: "daily", cooldown: "daily", reviewRequired: false, rewardSummary: "Daily streak protected, no rep farming", reputationPoints: 0, fieldLogTemplate: "[callsign] logged a Rest Signal.", safetyNote: "Do not gamify burnout.", metadata: { noRepFarm: true, preserveStreak: true }, sortOrder: 14 },
];

function factionCall(
  faction: string,
  factionSlug: string,
  variant: "quiet" | "commons" | "lantern",
  action: string,
  sortOrder: number,
): PlayablePromptSeed {
  const titles = { quiet: "Quiet Call", commons: "Commons Call", lantern: "Lantern Call" };
  const avatarHooks: Record<string, string> = {
    "asclepian-veil": "black-clinic-quiet-patch",
    "oracular-circuit": "oracular-hint-token",
    "myrmidon-grinders": "gatehouse-route-thread",
    "daedalus-foundry": "foundry-task-wrench-charm",
    "styx-rats": "rat-fair-sticker-sheet",
    "chthonic-uprising": "pomegranate-seed-token",
  };
  const badgeHooks: Record<string, string> = {
    "asclepian-veil": "veil-call-scribe",
    "oracular-circuit": "relay-call-listener",
    "myrmidon-grinders": "gate-call-runner",
    "daedalus-foundry": "foundry-call-hand",
    "styx-rats": "rat-call-regular",
    "chthonic-uprising": "chthonic-signal-witness",
  };
  const prompt =
    variant === "quiet"
      ? `Submit one ${action} for the Underwatch.`
      : variant === "commons"
        ? `Offer one ${action} as a community improvement.`
        : `Create one small signal: ${action}.`;
  return {
    functionSlug: "weekly-faction-calls",
    title: `${faction} ${titles[variant]}`,
    slug: `weekly-${factionSlug}-${variant}-call`,
    prompt,
    actionType: "COMPLETE_ASSIGNMENT",
    factionSlug,
    connectedRoute: `/mmo/factions/${factionSlug}/calls`,
    repeatability: "weekly",
    cooldown: "weekly",
    reviewRequired: true,
    proofStyle: "text reflection",
    rewardSummary: `${faction} reputation; +5 faction rep`,
    badgeHook: badgeHooks[factionSlug],
    avatarUnlockHook: avatarHooks[factionSlug],
    reputationCategory: "FACTION",
    reputationPoints: 5,
    fieldLogTemplate: "[callsign] joined a Weekly Faction Call.",
    safetyNote: "Fictional, safe, opt-in, and non-targeting.",
    sortOrder,
  };
}

export const WEEKLY_FACTION_CALLS: PlayablePromptSeed[] = [
  factionCall("Asclepian Veil", "asclepian-veil", "quiet", "accessibility note", 1),
  factionCall("Asclepian Veil", "asclepian-veil", "commons", "care language rewrite", 2),
  factionCall("Asclepian Veil", "asclepian-veil", "lantern", "rest-friendly event idea", 3),
  factionCall("Oracular Circuit", "oracular-circuit", "quiet", "fictional cipher", 4),
  factionCall("Oracular Circuit", "oracular-circuit", "commons", "privacy literacy reflection", 5),
  factionCall("Oracular Circuit", "oracular-circuit", "lantern", "safe tool summary", 6),
  factionCall("Myrmidon Grinders", "myrmidon-grinders", "quiet", "access route note", 7),
  factionCall("Myrmidon Grinders", "myrmidon-grinders", "commons", "event logistics idea", 8),
  factionCall("Myrmidon Grinders", "myrmidon-grinders", "lantern", "nonviolent readiness reflection", 9),
  factionCall("Daedalus Foundry", "daedalus-foundry", "quiet", "repair log", 10),
  factionCall("Daedalus Foundry", "daedalus-foundry", "commons", "self-hosting note", 11),
  factionCall("Daedalus Foundry", "daedalus-foundry", "lantern", "UI bug report", 12),
  factionCall("Styx Rats", "styx-rats", "quiet", "zine line", 13),
  factionCall("Styx Rats", "styx-rats", "commons", "banner idea", 14),
  factionCall("Styx Rats", "styx-rats", "lantern", "Net Neighbor scout", 15),
  factionCall("Chthonic Uprising", "chthonic-uprising", "quiet", "major community milestone", 16),
  factionCall("Chthonic Uprising", "chthonic-uprising", "commons", "Owner spotlight", 17),
  factionCall("Chthonic Uprising", "chthonic-uprising", "lantern", "lore witness", 18),
];

export const FIELD_ASSIGNMENTS: PlayablePromptSeed[] = [
  { functionSlug: "field-assignments", title: "Read the First Dead Index Trace", slug: "assignment-read-first-dead-index", prompt: "Read an introductory lore fragment and mark it remembered.", actionType: "VISIT_ARCHIVE", category: "reading assignment", factionSlug: "chthonic-uprising", connectedRoute: "/archive/lore", proofStyle: "no proof/read-only", reviewRequired: false, rewardSummary: "Archive rep; Dead Index progress", reputationCategory: "ARCHIVE", reputationPoints: 3, fieldLogTemplate: "[callsign] read the First Dead Index Trace.", safetyNote: "Curated internal lore only.", sortOrder: 1 },
  { functionSlug: "field-assignments", title: "Write a Safe Operative Bio", slug: "assignment-safe-operative-bio", prompt: "Draft a character bio that reveals no private information.", actionType: "POST_FIELD_NOTE", category: "profile-world assignment", factionSlug: "chthonic-uprising", connectedRoute: "/profile/dossier", proofStyle: "text reflection", reviewRequired: false, rewardSummary: "Profile rep; Safe Signal title progress", reputationCategory: "RECOGNITION", reputationPoints: 3, fieldLogTemplate: "[callsign] drafted a safe operative bio.", safetyNote: "No real addresses, employers, family details, or contact info.", sortOrder: 2 },
  { functionSlug: "field-assignments", title: "Archive One Public Resource", slug: "assignment-public-resource", prompt: "Submit a public-interest resource with a short summary.", actionType: "SUBMIT_RESOURCE", category: "archive assignment", connectedRoute: "/archive", proofStyle: "URL plus summary", reviewRequired: true, rewardSummary: "Archive rep; Archive Witness progress", badgeHook: "archive-hunter", reputationCategory: "ARCHIVE", reputationPoints: 5, fieldLogTemplate: "[callsign] submitted an archive signal for review.", safetyNote: "No harmful repos, exploit guides, or private data.", sortOrder: 3 },
  { functionSlug: "field-assignments", title: "Forum Welcome Relay", slug: "assignment-forum-welcome", prompt: "Reply constructively to a beginner-friendly thread.", actionType: "JOIN_DISCUSSION", category: "forum assignment", connectedRoute: "/community/forums", proofStyle: "forum thread link", reviewRequired: true, rewardSummary: "Community rep; Thread Tender progress", reputationCategory: "COMMUNITY", reputationPoints: 3, fieldLogTemplate: "[callsign] warmed a beginner forum relay.", safetyNote: "No pile-ons or spam replies.", sortOrder: 4 },
  { functionSlug: "field-assignments", title: "Accessibility Pass: One Page", slug: "assignment-accessibility-pass", prompt: "Review one page for readability, contrast, or motion concerns.", actionType: "SUBMIT_FEEDBACK", category: "accessibility assignment", factionSlug: "asclepian-veil", proofStyle: "checklist", reviewRequired: true, rewardSummary: "Accessibility rep; Accessibility Scribe progress", reputationCategory: "ACCESSIBILITY", reputationPoints: 5, fieldLogTemplate: "[callsign] completed an accessibility pass.", safetyNote: "No mocking or ableist framing.", sortOrder: 5 },
  { functionSlug: "field-assignments", title: "Fictional Cipher Lesson", slug: "assignment-fictional-cipher-lesson", prompt: "Solve or explain one fictional cipher puzzle.", actionType: "ATTEMPT_CIPHER", category: "cipher assignment", factionSlug: "oracular-circuit", connectedRoute: "/ciphers", proofStyle: "cipher-answer or reflection", reviewRequired: false, rewardSummary: "Cipher rep; C1PH3R progress", reputationCategory: "CIPHERS", reputationPoints: 3, fieldLogTemplate: "[callsign] tuned a fictional cipher lesson.", safetyNote: "No real hacking or live systems.", sortOrder: 6 },
  { functionSlug: "field-assignments", title: "Guild Ritual Draft", slug: "assignment-guild-ritual-draft", prompt: "Draft one safe recurring guild ritual.", actionType: "SUBMIT_LORE", category: "guild assignment", proofStyle: "long text", reviewRequired: true, rewardSummary: "Guild rep; guild project progress", reputationCategory: "GUILDS", reputationPoints: 5, fieldLogTemplate: "[callsign] drafted a guild ritual.", safetyNote: "No exclusionary initiations or off-platform pressure.", sortOrder: 7 },
  { functionSlug: "field-assignments", title: "Profile World Readability Check", slug: "assignment-profile-readable", prompt: "Check that your Profile World is readable and low-motion.", actionType: "VISIT_PROFILE_WORLD", category: "profile-world assignment", connectedRoute: "/profile/world", proofStyle: "checklist", reviewRequired: false, rewardSummary: "Profile rep; Low-Motion Lantern progress", badgeHook: "low-motion-lantern", reputationCategory: "ACCESSIBILITY", reputationPoints: 3, fieldLogTemplate: "[callsign] tuned their Profile World for readability.", safetyNote: "No flashing/strobing.", sortOrder: 8 },
  { functionSlug: "field-assignments", title: "Dead Drop Debrief", slug: "assignment-dead-drop-debrief", prompt: "Complete one Dead Drop and write what your operative learned.", actionType: "OPEN_DEAD_DROP", category: "mission assignment", connectedRoute: "/mmo/dead-drops", proofStyle: "text reflection", reviewRequired: true, rewardSummary: "Mission rep; Static Courier progress", reputationCategory: "MISSIONS", reputationPoints: 5, fieldLogTemplate: "[callsign] filed a Dead Drop debrief.", safetyNote: "No real-world operational details.", sortOrder: 9 },
  { functionSlug: "field-assignments", title: "Repair Culture Note", slug: "assignment-repair-culture-note", prompt: "Write a short note about repair, docs, or self-hosting education.", actionType: "SUBMIT_FEEDBACK", category: "volunteer assignment", factionSlug: "daedalus-foundry", proofStyle: "short text", reviewRequired: true, rewardSummary: "Forge rep; Repair Choir progress", reputationCategory: "FORGE", reputationPoints: 5, fieldLogTemplate: "[callsign] left a repair culture note.", safetyNote: "No bypass or exploitation instructions.", sortOrder: 10 },
  { functionSlug: "field-assignments", title: "Zine Line Drop", slug: "assignment-zine-line-drop", prompt: "Write one old-web zine line for the Underwatch.", actionType: "POST_FIELD_NOTE", category: "lore assignment", factionSlug: "styx-rats", proofStyle: "short text", reviewRequired: true, rewardSummary: "Lore rep; Rat Nest progress", reputationCategory: "LORE", reputationPoints: 3, fieldLogTemplate: "[callsign] dropped a zine line into the Rat Nest.", safetyNote: "Fictional, non-targeting satire only.", sortOrder: 11 },
  { functionSlug: "field-assignments", title: "Volunteer Board First Step", slug: "assignment-public-works-first-step", prompt: "Choose one public works task and submit a completion note.", actionType: "SUBMIT_PUBLIC_WORK", category: "volunteer assignment", connectedRoute: "/community/public-works", proofStyle: "admin/manual review", reviewRequired: true, rewardSummary: "Public Works rep; Commons Builder progress", badgeHook: "public-works-badge", reputationCategory: "FORGE", reputationPoints: 5, fieldLogTemplate: "[callsign] completed a Public Works first step.", safetyNote: "Screenshots must avoid private info.", sortOrder: 12 },
];

export const GUILD_PROJECTS: PlayablePromptSeed[] = [
  { functionSlug: "guild-projects", title: "Archive Shelf: First Ten Signals", slug: "guild-project-archive-shelf", prompt: "Collect ten approved archive summaries.", actionType: "SUBMIT_RESOURCE", category: "archive shelf", repeatability: "rotating", reviewRequired: true, proofStyle: "10 summaries", rewardSummary: "archive badges; shelf banner", badgeHook: "shelf-keeper", metadata: { memberCount: "3-8" }, sortOrder: 1 },
  { functionSlug: "guild-projects", title: "Zine Wall: Rat-Safe Edition", slug: "guild-project-zine-wall", prompt: "Build a page of non-targeting slogans and art prompts.", actionType: "POST_FIELD_NOTE", category: "zine wall", repeatability: "rotating", reviewRequired: true, rewardSummary: "zine flair; banner strip", badgeHook: "print-wall-rat", metadata: { memberCount: "3-12" }, sortOrder: 2 },
  { functionSlug: "guild-projects", title: "Accessibility Pass: Commons Sweep", slug: "guild-project-accessibility-pass", prompt: "Inspect a route or feature set for readability.", actionType: "SUBMIT_FEEDBACK", category: "accessibility pass", repeatability: "rotating", reviewRequired: true, rewardSummary: "accessibility badges; ribbon asset", badgeHook: "safety-lantern-crew", metadata: { memberCount: "2-6" }, sortOrder: 3 },
  { functionSlug: "guild-projects", title: "Forum Salon: First Roundtable", slug: "guild-project-forum-salon", prompt: "Host a weekly thread around a safe prompt.", actionType: "JOIN_DISCUSSION", category: "forum salon", repeatability: "rotating", reviewRequired: true, rewardSummary: "forum flair; title unlocks", badgeHook: "salon-steward", metadata: { memberCount: "4-20" }, sortOrder: 4 },
  { functionSlug: "guild-projects", title: "Cipher Circle: Puzzle Garden", slug: "guild-project-cipher-circle", prompt: "Produce safe fictional puzzles and hint text.", actionType: "ATTEMPT_CIPHER", category: "cipher circle", repeatability: "rotating", reviewRequired: true, rewardSummary: "cipher badges; glyph banner", badgeHook: "static-circle", metadata: { memberCount: "2-8" }, sortOrder: 5 },
  { functionSlug: "guild-projects", title: "Profile World Showcase", slug: "guild-project-profile-showcase", prompt: "Showcase readable Profile Worlds with opt-in notes.", actionType: "VISIT_PROFILE_WORLD", category: "profile world showcase", repeatability: "rotating", reviewRequired: true, rewardSummary: "profile frames; gallery module", badgeHook: "world-curator", metadata: { memberCount: "3-10" }, sortOrder: 6 },
  { functionSlug: "guild-projects", title: "Net Neighbor Ring", slug: "guild-project-net-neighbor-ring", prompt: "Submit vetted community-friendly links/buttons.", actionType: "READ_NET_NEIGHBOR", category: "Net Neighbor ring", repeatability: "rotating", reviewRequired: true, rewardSummary: "banner parts; scout badge", badgeHook: "lantern-scout", metadata: { memberCount: "2-6" }, sortOrder: 7 },
  { functionSlug: "guild-projects", title: "Ghost in Tech Shelf", slug: "guild-project-ghost-tech-shelf", prompt: "Compile safe repo/resource summaries.", actionType: "SUBMIT_RESOURCE", category: "Ghost in Tech shelf", repeatability: "rotating", reviewRequired: true, rewardSummary: "repo patch; archive rep", badgeHook: "repo-witness", metadata: { memberCount: "2-8" }, sortOrder: 8 },
  { functionSlug: "guild-projects", title: "Signal Player Broadcast", slug: "guild-project-signal-broadcast", prompt: "Propose a themed playlist mood and room ambience package.", actionType: "VISIT_SIGNAL_PLAYER", category: "Signal Player broadcast", repeatability: "rotating", reviewRequired: true, rewardSummary: "player skin; tone unlock", badgeHook: "broadcast-keeper", metadata: { memberCount: "2-8" }, sortOrder: 9 },
  { functionSlug: "guild-projects", title: "Seasonal Commons Event", slug: "guild-project-seasonal-commons", prompt: "Propose a low-pressure seasonal activity.", actionType: "SUBMIT_LORE", category: "seasonal commons event", repeatability: "rotating", reviewRequired: true, rewardSummary: "event flair; seasonal badge", badgeHook: "commons-host", metadata: { memberCount: "4-15" }, sortOrder: 10 },
];

export const FORUM_QUESTS: PlayablePromptSeed[] = [
  { functionSlug: "forum-quests", title: "Welcome a New Operative", slug: "forum-quest-welcome-operative", prompt: "Start or reply to a welcoming thread with useful orientation.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/forums", reviewRequired: false, rewardSummary: "Thread Tender progress", badgeHook: "thread-tender", safetyNote: "No copy-paste spam.", sortOrder: 1 },
  { functionSlug: "forum-quests", title: "Ask a Clean Lore Question", slug: "forum-quest-clean-lore-question", prompt: "Post a lore question that invites safe worldbuilding.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/forums", reviewRequired: false, rewardSummary: "Lore rep", reputationCategory: "LORE", reputationPoints: 2, safetyNote: "No real names or direct political targets.", sortOrder: 2 },
  { functionSlug: "forum-quests", title: "Answer a Beginner Question", slug: "forum-quest-answer-beginner", prompt: "Answer one beginner question constructively.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/forums", reviewRequired: false, rewardSummary: "Community rep", reputationCategory: "COMMUNITY", reputationPoints: 2, safetyNote: "No condescension.", sortOrder: 3 },
  { functionSlug: "forum-quests", title: "Quote a Signal Constructively", slug: "forum-quest-quote-signal", prompt: "Use quote-reply to respond to one idea with care and clarity.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/forums", reviewRequired: true, rewardSummary: "Echo Quoter badge progress", badgeHook: "echo-quoter", safetyNote: "No dunking or pile-ons.", metadata: { echoRelayPending: true }, sortOrder: 4 },
  { functionSlug: "forum-quests", title: "Receive an Echo", slug: "forum-quest-receive-echo", prompt: "Receive a constructive quote-reply on your thread.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/forums", reviewRequired: true, rewardSummary: "Echo Received progress", safetyNote: "No farming rings.", metadata: { echoRelayPending: true }, sortOrder: 5 },
  { functionSlug: "forum-quests", title: "Faction Floor Discussion", slug: "forum-quest-faction-discussion", prompt: "Create or join a faction discussion thread.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/forums", reviewRequired: false, rewardSummary: "Faction rep", reputationCategory: "FACTION", reputationPoints: 2, safetyNote: "No inter-faction harassment.", sortOrder: 6 },
  { functionSlug: "forum-quests", title: "Repo Relic Summary Thread", slug: "forum-quest-repo-summary", prompt: "Summarize an approved Ghost in Tech resource.", actionType: "SUBMIT_RESOURCE", connectedRoute: "/archive/ghost-in-tech", reviewRequired: true, rewardSummary: "Archive/Forge rep", reputationCategory: "ARCHIVE", reputationPoints: 3, safetyNote: "No exploit instructions.", sortOrder: 7 },
  { functionSlug: "forum-quests", title: "Net Neighbor Recommendation", slug: "forum-quest-net-neighbor", prompt: "Recommend a safe Net Neighbor for review.", actionType: "READ_NET_NEIGHBOR", connectedRoute: "/net-neighbors", reviewRequired: true, rewardSummary: "Net Neighbor Scout progress", safetyNote: "Review required.", sortOrder: 8 },
  { functionSlug: "forum-quests", title: "Profile World Showcase Thread", slug: "forum-quest-profile-showcase", prompt: "Share an opt-in Profile World showcase note.", actionType: "VISIT_PROFILE_WORLD", connectedRoute: "/profile/world", reviewRequired: true, rewardSummary: "Profile rep", reputationCategory: "RECOGNITION", reputationPoints: 2, safetyNote: "No private data or unsafe embeds.", sortOrder: 9 },
  { functionSlug: "forum-quests", title: "Guild Recruitment Thread", slug: "forum-quest-guild-recruit", prompt: "Create a guild recruitment post with clear safety rules.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/guilds", reviewRequired: false, rewardSummary: "Guild rep", reputationCategory: "GUILDS", reputationPoints: 2, safetyNote: "No exclusionary or coercive rules.", sortOrder: 10 },
  { functionSlug: "forum-quests", title: "Useful Resource Thread", slug: "forum-quest-useful-resource", prompt: "Share one public-interest resource with summary.", actionType: "SUBMIT_RESOURCE", connectedRoute: "/community/forums", reviewRequired: true, rewardSummary: "Archive rep", reputationCategory: "ARCHIVE", reputationPoints: 3, safetyNote: "Review required for recognition.", sortOrder: 11 },
  { functionSlug: "forum-quests", title: "Weekly Salon Participant", slug: "forum-quest-weekly-salon", prompt: "Participate in a moderated weekly salon thread.", actionType: "JOIN_DISCUSSION", connectedRoute: "/community/forums", reviewRequired: false, rewardSummary: "Forum flair", safetyNote: "No spam replies.", sortOrder: 12 },
];

export const PROFILE_WORLD_CHALLENGES: PlayablePromptSeed[] = [
  { functionSlug: "profile-world-challenges", title: "Terminal Shrine", slug: "profile-challenge-terminal-shrine", prompt: "Build a profile with terminal-style copy, readable contrast, and one relic display.", actionType: "VISIT_PROFILE_WORLD", connectedRoute: "/profile/world", reviewRequired: false, rewardSummary: "Profile frame: Terminal Shrine", safetyNote: "No flashing or raw scripts.", sortOrder: 1 },
  { functionSlug: "profile-world-challenges", title: "Faction Banner Readable", slug: "profile-challenge-faction-banner-readable", prompt: "Create or equip a readable faction banner.", actionType: "VISIT_PROFILE_WORLD", connectedRoute: "/profile/avatar", reviewRequired: true, rewardSummary: "Faction banner part", safetyNote: "Contrast must pass review for showcase.", sortOrder: 2 },
  { functionSlug: "profile-world-challenges", title: "Three Badges Displayed", slug: "profile-challenge-three-badges", prompt: "Display three earned badges in the Badge Case.", actionType: "MARK_COMPLETE", connectedRoute: "/profile", reviewRequired: false, rewardSummary: "Badge case style", safetyNote: "Do not fake unearned badges.", sortOrder: 3 },
  { functionSlug: "profile-world-challenges", title: "Safe Character Bio", slug: "profile-challenge-safe-bio", prompt: "Write an in-universe bio without private identifying details.", actionType: "POST_FIELD_NOTE", connectedRoute: "/profile/dossier", reviewRequired: false, rewardSummary: "Title: Safe Signal", badgeHook: "safe-signal", safetyNote: "No private data.", sortOrder: 4 },
  { functionSlug: "profile-world-challenges", title: "Relic Trio", slug: "profile-challenge-relic-trio", prompt: "Display three relics with short lore notes.", actionType: "VISIT_PROFILE_WORLD", connectedRoute: "/profile/relic-zone", reviewRequired: false, rewardSummary: "Relic Zone module", safetyNote: "No harmful artifacts.", sortOrder: 5 },
  { functionSlug: "profile-world-challenges", title: "Low-Motion Lantern", slug: "profile-challenge-low-motion", prompt: "Use low-motion or motion-safe profile settings.", actionType: "MARK_COMPLETE", connectedRoute: "/profile/world", reviewRequired: false, rewardSummary: "Badge: Low-Motion Lantern", badgeHook: "low-motion-lantern", reputationCategory: "ACCESSIBILITY", reputationPoints: 3, safetyNote: "Accessibility-first.", sortOrder: 6 },
  { functionSlug: "profile-world-challenges", title: "Old-Web Button", slug: "profile-challenge-old-web-button", prompt: "Create a safe old-web profile button concept.", actionType: "POST_FIELD_NOTE", reviewRequired: true, rewardSummary: "Avatar sticker", avatarUnlockHook: "old-web-button-sticker", safetyNote: "No external tracking pixels.", sortOrder: 7 },
  { functionSlug: "profile-world-challenges", title: "Guild Showcase", slug: "profile-challenge-guild-showcase", prompt: "Showcase one approved guild or project.", actionType: "VISIT_PROFILE_WORLD", connectedRoute: "/community/guilds", reviewRequired: true, rewardSummary: "Guild banner part", safetyNote: "Guild consent required.", sortOrder: 8 },
  { functionSlug: "profile-world-challenges", title: "Signal Player Skin", slug: "profile-challenge-signal-skin", prompt: "Equip or preview a Signal Player skin on profile.", actionType: "VISIT_SIGNAL_PLAYER", connectedRoute: "/signal-player", reviewRequired: false, rewardSummary: "Signal Player skin", safetyNote: "No autoplay.", sortOrder: 9 },
  { functionSlug: "profile-world-challenges", title: "Accessible Profile Design", slug: "profile-challenge-accessible-design", prompt: "Complete readability checklist for Profile World.", actionType: "MARK_COMPLETE", connectedRoute: "/profile/world", reviewRequired: false, rewardSummary: "Accessibility rep", reputationCategory: "ACCESSIBILITY", reputationPoints: 3, safetyNote: "No strobing/low contrast.", sortOrder: 10 },
];

export const ARCHIVE_HUNTS: PlayablePromptSeed[] = [
  { functionSlug: "archive-hunts", title: "First Archive Trace", slug: "archive-hunt-first-trace", prompt: "Read Archive intro → open lore fragment → mark trace remembered", actionType: "VISIT_ARCHIVE", connectedRoute: "/archive", repeatability: "weekly", reviewRequired: false, proofStyle: "curated steps", rewardSummary: "Archive Witness Tab", badgeHook: "archive-terminal-reader", avatarUnlockHook: "archive-hunt-tab", fieldLogTemplate: "[callsign] completed an Archive Hunt.", metadata: { steps: ["/archive", "/archive/lore"], loreUnlock: "memory-has-teeth" }, safetyNote: "Internal curated links only.", sortOrder: 1 },
  { functionSlug: "archive-hunts", title: "Ghost in Tech Starter Shelf", slug: "archive-hunt-ghost-starter", prompt: "Read Ghost in Tech intro → read safe repo summary → answer reflection", actionType: "VISIT_ARCHIVE", connectedRoute: "/archive/ghost-in-tech", repeatability: "weekly", reviewRequired: false, rewardSummary: "Ghost Repo Chip", badgeHook: "ghost-in-tech-runner", avatarUnlockHook: "ghost-in-tech-repo-chip", metadata: { steps: ["/archive/ghost-in-tech"] }, safetyNote: "No harmful repositories.", sortOrder: 2 },
  { functionSlug: "archive-hunts", title: "State of Affairs Lantern Path", slug: "archive-hunt-state-lantern", prompt: "Read State item → identify theme safely → save private note", actionType: "VISIT_ARCHIVE", connectedRoute: "/archive/state-of-affairs", repeatability: "weekly", reviewRequired: false, rewardSummary: "State Scout Title", badgeHook: "state-of-affairs-scout", avatarUnlockHook: "lantern-tab", metadata: { steps: ["/archive/state-of-affairs"] }, safetyNote: "No real-world targeting.", sortOrder: 3 },
  { functionSlug: "archive-hunts", title: "Net Neighbor Trail", slug: "archive-hunt-net-neighbor", prompt: "Open Net Neighbor index → read two approved cards → optional reflection", actionType: "READ_NET_NEIGHBOR", connectedRoute: "/net-neighbors", repeatability: "weekly", reviewRequired: false, rewardSummary: "Neighbor Lantern Pin", badgeHook: "net-neighbor-scout", avatarUnlockHook: "lantern-pin", metadata: { steps: ["/net-neighbors"] }, safetyNote: "No scraping or investigation.", sortOrder: 4 },
  { functionSlug: "archive-hunts", title: "Dead Index Trace", slug: "archive-hunt-dead-index-trace", prompt: "Read Dead Index note → recover lore fragment → file field log", actionType: "VISIT_ARCHIVE", connectedRoute: "/archive/lore", repeatability: "weekly", reviewRequired: false, rewardSummary: "Bone Index Earring", badgeHook: "dead-index-trace", avatarUnlockHook: "bone-index-earring", metadata: { loreUnlock: "dead-index-breathes" }, safetyNote: "Fictional memory only.", sortOrder: 5 },
  { functionSlug: "archive-hunts", title: "Public-Interest Resource Path", slug: "archive-hunt-public-interest", prompt: "Read resource rules → review approved resource → suggest category tag", actionType: "VISIT_ARCHIVE", connectedRoute: "/archive", repeatability: "weekly", reviewRequired: true, rewardSummary: "Archive Tag Patch", badgeHook: "archive-scribe", avatarUnlockHook: "archive-patch", safetyNote: "Educational resources only.", sortOrder: 6 },
  { functionSlug: "archive-hunts", title: "Accessibility Resource Path", slug: "archive-hunt-accessibility", prompt: "Read accessibility note → find accessibility resource → write safe summary", actionType: "VISIT_ARCHIVE", connectedRoute: "/archive", repeatability: "weekly", reviewRequired: true, rewardSummary: "Accessibility Ribbon", badgeHook: "accessibility-scribe", avatarUnlockHook: "accessibility-ribbon", safetyNote: "No medical/legal advice.", sortOrder: 7 },
  { functionSlug: "archive-hunts", title: "Repair and Self-Hosting Path", slug: "archive-hunt-repair-hosting", prompt: "Read repair note → read self-hosting resource → answer safety reflection", actionType: "VISIT_ARCHIVE", connectedRoute: "/archive/ghost-in-tech", repeatability: "weekly", reviewRequired: false, rewardSummary: "Foundry Bench Charm", badgeHook: "repair-witness", avatarUnlockHook: "foundry-task-wrench-charm", safetyNote: "No bypass/exploit instructions.", sortOrder: 8 },
];

export const SIGNAL_BROADCASTS: PlayablePromptSeed[] = [
  { functionSlug: "signal-player-broadcasts", title: "Underwatch Night Broadcast", slug: "signal-broadcast-underwatch-night", prompt: "Quiet neon vigilance — black terminal with pomegranate glow.", actionType: "VISIT_SIGNAL_PLAYER", factionSlug: "chthonic-uprising", repeatability: "rotating", reviewRequired: false, rewardSummary: "Complete 7 Daily Signals to unlock", metadata: { mood: "quiet neon vigilance", noAutoplay: true }, safetyNote: "No autoplay; user controls playback.", sortOrder: 1 },
  { functionSlug: "signal-player-broadcasts", title: "Rat Nest Radio", slug: "signal-broadcast-rat-radio", prompt: "Scrappy zine energy — sticker-bomb player skin.", actionType: "VISIT_SIGNAL_PLAYER", factionSlug: "styx-rats", repeatability: "rotating", reviewRequired: false, rewardSummary: "Join Rat Nest forum quest", safetyNote: "No pirated uploads.", sortOrder: 2 },
  { functionSlug: "signal-player-broadcasts", title: "Black Clinic Soft Signal", slug: "signal-broadcast-black-clinic", prompt: "Rest, care, low light — green diagnostic pulse.", actionType: "VISIT_SIGNAL_PLAYER", factionSlug: "asclepian-veil", repeatability: "rotating", reviewRequired: false, rewardSummary: "Complete care weekly call", safetyNote: "No medical claims.", sortOrder: 3 },
  { functionSlug: "signal-player-broadcasts", title: "Violet Relay Hour", slug: "signal-broadcast-violet-relay", prompt: "Cryptic puzzle ambience — violet static dial.", actionType: "VISIT_SIGNAL_PLAYER", factionSlug: "oracular-circuit", repeatability: "rotating", reviewRequired: false, rewardSummary: "Solve 3 fictional ciphers", safetyNote: "No real hacking.", sortOrder: 4 },
  { functionSlug: "signal-player-broadcasts", title: "Foundry Bench Hum", slug: "signal-broadcast-foundry-hum", prompt: "Warm workshop focus — orange schematic player.", actionType: "VISIT_SIGNAL_PLAYER", factionSlug: "daedalus-foundry", repeatability: "rotating", reviewRequired: false, rewardSummary: "Submit repair note", safetyNote: "No unsafe build instructions.", sortOrder: 5 },
  { functionSlug: "signal-player-broadcasts", title: "Gatewatch Dawn Check", slug: "signal-broadcast-gatewatch-dawn", prompt: "Steady logistics calm — bronze route-map dial.", actionType: "VISIT_SIGNAL_PLAYER", factionSlug: "myrmidon-grinders", repeatability: "rotating", reviewRequired: false, rewardSummary: "Complete readiness reflection", safetyNote: "No unsafe protest tactics.", sortOrder: 6 },
  { functionSlug: "signal-player-broadcasts", title: "Archive Whisper Tone", slug: "signal-broadcast-archive-whisper", prompt: "Dust, memory, old servers — bone-white waveform.", actionType: "VISIT_SIGNAL_PLAYER", repeatability: "rotating", reviewRequired: false, rewardSummary: "Complete Archive Hunt", safetyNote: "Curated links only.", sortOrder: 7 },
  { functionSlug: "signal-player-broadcasts", title: "Dead Drop Receipt Click", slug: "signal-broadcast-receipt-click", prompt: "Mysterious terminal clicks — thermal receipt UI.", actionType: "VISIT_SIGNAL_PLAYER", repeatability: "rotating", reviewRequired: false, rewardSummary: "Complete 3 Dead Drops", safetyNote: "No covert real-world behavior.", sortOrder: 8 },
  { functionSlug: "signal-player-broadcasts", title: "Pomegranate Gate Theme", slug: "signal-broadcast-pomegranate-gate", prompt: "Event procession — red-black gate player.", actionType: "VISIT_SIGNAL_PLAYER", factionSlug: "chthonic-uprising", repeatability: "rotating", reviewRequired: false, rewardSummary: "Seasonal participation", safetyNote: "No pressure streaks.", sortOrder: 9 },
  { functionSlug: "signal-player-broadcasts", title: "Ghost in Tech Boot Tone", slug: "signal-broadcast-ghost-boot", prompt: "Retro boot sequence — repo-chip interface.", actionType: "VISIT_SIGNAL_PLAYER", repeatability: "rotating", reviewRequired: false, rewardSummary: "Read 5 repo relics", safetyNote: "No exploit content.", sortOrder: 10 },
];

export const MICRO_MISSION_TEMPLATES: PlayablePromptSeed[] = [
  { functionSlug: "player-created-micro-missions", title: "One Field Note", slug: "micro-field-note", prompt: "Write a safe one-paragraph field note.", actionType: "POST_FIELD_NOTE", category: "field-note", repeatability: "always-available", reviewRequired: true, proofStyle: "title; prompt; safety note; reward cap", rewardSummary: "small rep + badge progress", metadata: { reviewRole: "moderator/admin" }, sortOrder: 1 },
  { functionSlug: "player-created-micro-missions", title: "Safe Repo Summary", slug: "micro-safe-repo-summary", prompt: "Summarize a safe public-interest repo.", actionType: "SUBMIT_RESOURCE", category: "archive-resource", repeatability: "always-available", reviewRequired: true, proofStyle: "URL; summary; why useful; safety check", rewardSummary: "Archive rep", metadata: { reviewRole: "archive review" }, sortOrder: 2 },
  { functionSlug: "player-created-micro-missions", title: "Profile Prompt", slug: "micro-profile-prompt", prompt: "Create a Profile World prompt.", actionType: "VISIT_PROFILE_WORLD", category: "profile-world", repeatability: "always-available", reviewRequired: true, rewardSummary: "Profile rep", sortOrder: 3 },
  { functionSlug: "player-created-micro-missions", title: "Lore Fragment Seed", slug: "micro-lore-fragment", prompt: "Submit a short lore fragment for a canon tier.", actionType: "SUBMIT_LORE", category: "lore-fragment", repeatability: "always-available", reviewRequired: true, rewardSummary: "Lore rep", sortOrder: 4 },
  { functionSlug: "player-created-micro-missions", title: "Page Description Improvement", slug: "micro-page-description", prompt: "Improve one page description.", actionType: "SUBMIT_FEEDBACK", category: "documentation", repeatability: "always-available", reviewRequired: true, rewardSummary: "Public Works rep", sortOrder: 5 },
  { functionSlug: "player-created-micro-missions", title: "Guild Ritual Suggestion", slug: "micro-guild-ritual", prompt: "Propose a safe opt-in guild ritual.", actionType: "SUBMIT_LORE", category: "guild", repeatability: "always-available", reviewRequired: true, rewardSummary: "Guild rep", sortOrder: 6 },
  { functionSlug: "player-created-micro-missions", title: "Forum Welcome Prompt", slug: "micro-forum-welcome", prompt: "Create a beginner-friendly forum welcome prompt.", actionType: "JOIN_DISCUSSION", category: "forum", repeatability: "always-available", reviewRequired: true, rewardSummary: "Community rep", sortOrder: 7 },
  { functionSlug: "player-created-micro-missions", title: "Net Neighbor Lead", slug: "micro-net-neighbor-lead", prompt: "Suggest a vetted old-web/community link.", actionType: "READ_NET_NEIGHBOR", category: "net-neighbor", repeatability: "always-available", reviewRequired: true, rewardSummary: "Net Neighbor rep", sortOrder: 8 },
  { functionSlug: "player-created-micro-missions", title: "Mobile Page Test", slug: "micro-mobile-page-test", prompt: "Test one route on mobile and submit notes.", actionType: "SUBMIT_FEEDBACK", category: "qa", repeatability: "always-available", reviewRequired: true, rewardSummary: "Forge rep", sortOrder: 9 },
  { functionSlug: "player-created-micro-missions", title: "Badge Concept", slug: "micro-badge-concept", prompt: "Propose a badge name, visual, and unlock condition.", actionType: "SUBMIT_FEEDBACK", category: "badge-idea", repeatability: "always-available", reviewRequired: true, rewardSummary: "Recognition rep", sortOrder: 10 },
];

export const MENTOR_GUIDE_PROMPTS: PlayablePromptSeed[] = [
  { functionSlug: "mentor-guide-system", title: "How to Start with Dead Drops", slug: "guide-start-dead-drops", prompt: "Explain how to open and complete Dead Drops safely.", actionType: "MARK_COMPLETE", category: "Beginner guide post", connectedRoute: "/mmo/dead-drops", repeatability: "always-available", reviewRequired: true, safetyNote: "No real-world covert behavior.", sortOrder: 1 },
  { functionSlug: "mentor-guide-system", title: "How to Write Safe Lore", slug: "guide-safe-lore", prompt: "Teach canon tiers and privacy-safe character writing.", actionType: "MARK_COMPLETE", category: "Lore guide", connectedRoute: "/community/lore", repeatability: "always-available", reviewRequired: true, safetyNote: "No real people as direct targets.", sortOrder: 2 },
  { functionSlug: "mentor-guide-system", title: "How to Submit a Ghost in Tech Repo", slug: "guide-ghost-repo", prompt: "Explain safe repo summary rules.", actionType: "MARK_COMPLETE", category: "Archive guide", connectedRoute: "/archive/ghost-in-tech/submit", repeatability: "always-available", reviewRequired: true, safetyNote: "No harmful repos.", sortOrder: 3 },
  { functionSlug: "mentor-guide-system", title: "How to Build a Readable Profile World", slug: "guide-readable-profile", prompt: "Teach contrast, low-motion, and safe embeds.", actionType: "MARK_COMPLETE", category: "Profile guide", connectedRoute: "/profile/world", repeatability: "always-available", reviewRequired: true, safetyNote: "No scripts.", sortOrder: 4 },
  { functionSlug: "mentor-guide-system", title: "How to Create a Faction Mission Idea", slug: "guide-faction-mission", prompt: "Explain safe faction prompt design.", actionType: "MARK_COMPLETE", category: "Faction guide", connectedRoute: "/mmo/factions", repeatability: "always-available", reviewRequired: true, safetyNote: "No unsafe tactics.", sortOrder: 5 },
  { functionSlug: "mentor-guide-system", title: "How to Use Forum Quote Replies", slug: "guide-quote-replies", prompt: "Show constructive quote-reply norms.", actionType: "MARK_COMPLETE", category: "Forum guide", connectedRoute: "/community/forums", repeatability: "always-available", reviewRequired: true, safetyNote: "No dogpiles.", metadata: { echoRelayPending: true }, sortOrder: 6 },
  { functionSlug: "mentor-guide-system", title: "How to Choose a Guild", slug: "guide-choose-guild", prompt: "Explain guild types and join policies.", actionType: "MARK_COMPLETE", category: "Guild guide", connectedRoute: "/community/guilds", repeatability: "always-available", reviewRequired: true, safetyNote: "No pressure.", sortOrder: 7 },
  { functionSlug: "mentor-guide-system", title: "How to Report a Safety Issue", slug: "guide-report-safety", prompt: "Explain report/block/review options.", actionType: "MARK_COMPLETE", category: "Safety guide", connectedRoute: "/moderation", repeatability: "always-available", reviewRequired: true, safetyNote: "No public callouts.", sortOrder: 8 },
];

export const PUBLIC_WORKS_TASKS: PublicWorksTaskSeed[] = [
  { title: "Fix a Broken Link Note", slug: "pw-broken-link-note", taskType: "bug", difficulty: "beginner", estimatedTime: "10-20 minutes", ownerRole: "admin/steward", description: "Report a broken link found during normal browsing.", acceptanceCriteria: "Route, link text, and suggested fix or destination.", rewardSummary: "Public Works rep", reviewRequired: true, safetyNote: "No scanning; report normal browsing issue.", sortOrder: 1 },
  { title: "Accessibility Contrast Note", slug: "pw-contrast-note", taskType: "accessibility", difficulty: "beginner", estimatedTime: "15 minutes", ownerRole: "moderator/accessibility steward", description: "Note one contrast or readability concern on a page.", acceptanceCriteria: "Specific element, issue, and constructive suggestion.", rewardSummary: "Accessibility rep", badgeHook: "accessibility-scribe", reviewRequired: true, safetyNote: "Constructive language only.", sortOrder: 2 },
  { title: "One Page Docs Cleanup", slug: "pw-docs-cleanup", taskType: "documentation", difficulty: "beginner", estimatedTime: "20 minutes", ownerRole: "admin", description: "Improve clarity of one documentation page.", acceptanceCriteria: "Route and suggested copy improvements.", rewardSummary: "Documentation rep", reviewRequired: true, safetyNote: "No implementation code required.", sortOrder: 3 },
  { title: "Avatar Pin Concept", slug: "pw-avatar-pin-concept", taskType: "avatar_asset_need", difficulty: "beginner", estimatedTime: "20 minutes", ownerRole: "Avatar Forge steward", description: "Propose a safe avatar pin concept (Fictional Props & Tech Gear).", acceptanceCriteria: "Name, category, visual description, safety check.", rewardSummary: "Avatar unlock credit", avatarUnlockHook: "daily-signal-pin", reviewRequired: true, assetNeedPath: "/avatar-assets/accessories/", safetyNote: "No weapon framing.", sortOrder: 4 },
  { title: "Badge Asset Sketch", slug: "pw-badge-sketch", taskType: "badge_asset_need", difficulty: "intermediate", estimatedTime: "30-60 minutes", ownerRole: "admin", description: "Sketch a badge concept for community recognition.", acceptanceCriteria: "Badge name, visual, unlock condition, abuse check.", rewardSummary: "Badge Art credit", reviewRequired: true, safetyNote: "Use safe file formats.", sortOrder: 5 },
  { title: "Lore Prompt Seed", slug: "pw-lore-prompt-seed", taskType: "lore_prompt", difficulty: "beginner", estimatedTime: "15 minutes", ownerRole: "lore steward", description: "Submit a safe lore prompt for community use.", acceptanceCriteria: "Prompt text, canon tier suggestion, safety note.", rewardSummary: "Lore rep", reviewRequired: true, safetyNote: "No real people as direct targets.", sortOrder: 6 },
  { title: "Forum Category Copy", slug: "pw-forum-category-copy", taskType: "forum_category", difficulty: "beginner", estimatedTime: "20 minutes", ownerRole: "moderator", description: "Draft welcoming copy for a forum category.", acceptanceCriteria: "Category, proposed description, tone check.", rewardSummary: "Community rep", reviewRequired: true, safetyNote: "Welcoming tone.", sortOrder: 7 },
  { title: "Ghost in Tech Summary", slug: "pw-ghost-summary", taskType: "ghost_in_tech_summary", difficulty: "intermediate", estimatedTime: "30 minutes", ownerRole: "archive steward", description: "Summarize a safe public-interest repository.", acceptanceCriteria: "URL, summary, why useful, safety check.", rewardSummary: "Archive/Forge rep", reviewRequired: true, safetyNote: "No exploit repos.", sortOrder: 8 },
  { title: "Net Neighbor Button", slug: "pw-neighbor-button", taskType: "net_neighbor_button", difficulty: "intermediate", estimatedTime: "30 minutes", ownerRole: "admin", description: "Propose a Net Neighbor button asset.", acceptanceCriteria: "Link, summary, button concept, no tracking.", rewardSummary: "Net Neighbor credit", reviewRequired: true, safetyNote: "No tracking pixels.", sortOrder: 9 },
  { title: "Profile Theme Concept", slug: "pw-profile-theme", taskType: "profile_theme", difficulty: "intermediate", estimatedTime: "45 minutes", ownerRole: "profile steward", description: "Propose a readable profile theme concept.", acceptanceCriteria: "Theme name, contrast notes, mock description.", rewardSummary: "Profile rep", reviewRequired: true, safetyNote: "Readable contrast.", sortOrder: 10 },
  { title: "Mobile QA: MMO Rooms", slug: "pw-mobile-qa-rooms", taskType: "mobile_qa", difficulty: "beginner", estimatedTime: "20 minutes", ownerRole: "admin", description: "Test MMO room routes on mobile and submit notes.", acceptanceCriteria: "Device class, route, issue summary.", rewardSummary: "Forge rep", reviewRequired: true, safetyNote: "Avoid private info in screenshots.", sortOrder: 11 },
  { title: "Safety Copy Clarity", slug: "pw-safety-copy", taskType: "safety_copy", difficulty: "intermediate", estimatedTime: "30 minutes", ownerRole: "moderator", description: "Improve safety copy on one page.", acceptanceCriteria: "Route, current issue, suggested copy.", rewardSummary: "Safety Lantern progress", badgeHook: "safety-lantern", reviewRequired: true, safetyNote: "No legal/medical advice.", sortOrder: 12 },
  { title: "Seed Data Typo Sweep", slug: "pw-seed-typo-sweep", taskType: "seed_data", difficulty: "beginner", estimatedTime: "20 minutes", ownerRole: "lore/admin steward", description: "Report typos in seeded content.", acceptanceCriteria: "Location, current text, suggested fix.", rewardSummary: "Public Works rep", reviewRequired: true, safetyNote: "Content-only.", sortOrder: 13 },
  { title: "Event Idea: Low Pressure", slug: "pw-event-idea", taskType: "event_idea", difficulty: "beginner", estimatedTime: "20 minutes", ownerRole: "admin", description: "Propose a low-pressure seasonal event idea.", acceptanceCriteria: "Event concept, safety note, no FOMO mechanics.", rewardSummary: "Seasonal progress", reviewRequired: true, safetyNote: "No FOMO mechanics.", sortOrder: 14 },
  { title: "Guild Support Kit", slug: "pw-guild-support-kit", taskType: "guild_support", difficulty: "advanced", estimatedTime: "60 minutes", ownerRole: "guild steward/admin", description: "Draft a guild support resource kit.", acceptanceCriteria: "Guild type, support materials, opt-in note.", rewardSummary: "Guild rep", reviewRequired: true, safetyNote: "Opt-in and moderated.", sortOrder: 15 },
];

export const RELIC_SETS: RelicSetSeed[] = [
  { title: "Dead Drop Cache Set", slug: "relic-set-dead-drop-cache", fragmentsNeeded: ["Cracked Cache Key", "Dead Drop Receipt", "Black Cache Sticker"], completedRelicName: "Recovered Cache Box", profileDisplayEffect: "Adds cache shelf module", avatarUnlockHook: "static-courier-satchel", badgeHook: "cache-keeper", safetyNote: "Fictional prop set only.", sortOrder: 1 },
  { title: "Oracular Static Set", slug: "relic-set-oracular-static", fragmentsNeeded: ["Bent Oracle Key", "Cipher Glyph Ring", "Apology Oracle Token"], completedRelicName: "Violet Static Tripod", profileDisplayEffect: "Adds relay glyph effect", avatarUnlockHook: "oracle-headset", badgeHook: "static-decoder", safetyNote: "Puzzle content only.", sortOrder: 2 },
  { title: "Archive Shelf Set", slug: "relic-set-archive-shelf", fragmentsNeeded: ["Bone Index Tab", "Archive Hunt Tab", "Dead Index Bookmark"], completedRelicName: "Bone Index Shelf", profileDisplayEffect: "Adds archive shelf module", avatarUnlockHook: "bone-index-earring", badgeHook: "archive-witness", safetyNote: "Curated archive only.", sortOrder: 3 },
  { title: "Rat Nest Sticker Set", slug: "relic-set-rat-sticker", fragmentsNeeded: ["Rat Sticker Pack", "Printer Rat Sticker", "Zine Spark Button"], completedRelicName: "Sticker-Bombed Terminal", profileDisplayEffect: "Adds zine wall module", avatarUnlockHook: "rat-fair-sticker-sheet", badgeHook: "zine-wall-rat", safetyNote: "No targeting.", sortOrder: 4 },
  { title: "Black Clinic Care Set", slug: "relic-set-black-clinic-care", fragmentsNeeded: ["Veil Clinic Patch", "Quiet Hours Patch", "Safety Lantern Pin"], completedRelicName: "Soft Green Care Kit", profileDisplayEffect: "Adds low-motion clinic curtain", avatarUnlockHook: "black-clinic-quiet-patch", badgeHook: "quiet-hours-witness", safetyNote: "No medical advice.", sortOrder: 5 },
  { title: "Foundry Bench Set", slug: "relic-set-foundry-bench", fragmentsNeeded: ["Foundry Spark Charm", "Screw-Heart Charm", "Forge Toolkit"], completedRelicName: "Pocket Workbench", profileDisplayEffect: "Adds foundry bench glow", avatarUnlockHook: "foundry-task-wrench-charm", badgeHook: "repair-witness", safetyNote: "No dangerous instructions.", sortOrder: 6 },
  { title: "Gatehouse Path Set", slug: "relic-set-gatehouse-path", fragmentsNeeded: ["Cerberus Gate Stamp", "Route Thread", "Gatewatch Map Tab"], completedRelicName: "Route Map Reliquary", profileDisplayEffect: "Adds route map panel", avatarUnlockHook: "gatehouse-route-thread", badgeHook: "gatewatch-runner", safetyNote: "No unsafe protest tactics.", sortOrder: 7 },
  { title: "Pomegranate Gate Set", slug: "relic-set-pomegranate-gate", fragmentsNeeded: ["Pomegranate Seed Token", "Gate Week Badge", "Underwatch Pass Lanyard"], completedRelicName: "Split Pomegranate Gate", profileDisplayEffect: "Adds pomegranate gate frame", avatarUnlockHook: "seasonal-gate-ribbon", badgeHook: "gate-witness", safetyNote: "No pressure or FOMO.", sortOrder: 8 },
];

const ROOM_SLUGS = ["underwatch-town-square", "dead-drop-terminal", "oracular-relay", "faction-floors", "archive-terminal", "guild-halls"];
const STATE_NAMES = ["quiet", "active", "crowded", "signal-live", "archive-trace-detected", "faction-call-active", "event-lit", "repaired", "haunted", "stabilized"];

export const ROOM_STATE_DEFINITIONS: RoomStateSeed[] = STATE_NAMES.flatMap((stateName, si) =>
  ROOM_SLUGS.map((roomSlug, ri) => ({
    stateName,
    roomSlug,
    trigger: stateName === "quiet" ? "Default or low activity" : `Community ${stateName} threshold`,
    roomCopy: stateName === "quiet" ? "The room waits in a low hum, its terminals breathing blue-black static." : `The room enters ${stateName.replace(/-/g, " ")} state.`,
    visualEffect: stateName === "quiet" ? "Dim terminal glow" : `Low-motion ${stateName} accent`,
    rewardHook: stateName === "stabilized" ? "Room Stabilizer progress" : undefined,
    safetyNote: stateName === "quiet" ? "No pressure language." : "Moderation watch where needed.",
    sortOrder: si * 10 + ri + 1,
  })),
);

export const VISITORS: VisitorSeed[] = [
  { name: "The Lantern Keeper", slug: "visitor-lantern-keeper", appearanceText: "A hooded caretaker carrying a lantern full of bookmarked threads.", roomSlug: "underwatch-town-square", prompt: "Name one signal worth preserving.", rewardSummary: "Safety Lantern Pin", loreUnlock: "The Lantern Keeper's Ledger", avatarItem: "lantern-pin", fieldLogText: "[callsign] answered the Lantern Keeper.", safetyNote: "No private data.", sortOrder: 1 },
  { name: "The Cache Widow", slug: "visitor-cache-widow", appearanceText: "A veiled terminal process counting cracked cache keys.", roomSlug: "dead-drop-terminal", prompt: "Recover a fictional cache memory.", rewardSummary: "Cracked Cache Ribbon", loreUnlock: "The Cache Widow's Count", avatarItem: "cache-ribbon", fieldLogText: "[callsign] met the Cache Widow.", safetyNote: "Fictional drops only.", sortOrder: 2 },
  { name: "The Rat With a Printer", slug: "visitor-rat-printer", appearanceText: "A rat in a torn vest dragging a thermal printer through the static.", roomSlug: "rat-nest", prompt: "Write one zine line.", rewardSummary: "Printer Rat Sticker", loreUnlock: "Printer Static", avatarItem: "rat-sticker", fieldLogText: "[callsign] fed a line to the Rat With a Printer.", safetyNote: "No harassment.", sortOrder: 3 },
  { name: "The Soft-Spoken Gate", slug: "visitor-soft-gate", appearanceText: "A gate-shaped process that whispers routes instead of orders.", roomSlug: "gatehouse", prompt: "Suggest a nonviolent access note.", rewardSummary: "Route Thread", loreUnlock: "The Gate That Asked", avatarItem: "route-thread", fieldLogText: "[callsign] listened to the Soft-Spoken Gate.", safetyNote: "No unsafe tactics.", sortOrder: 4 },
  { name: "The Oracle That Apologized", slug: "visitor-apology-oracle", appearanceText: "A broken oracle that admits when it is wrong.", roomSlug: "oracular-relay", prompt: "Correct a false fictional omen.", rewardSummary: "Apology Oracle Token", loreUnlock: "Oracle Static Mercy", avatarItem: "oracle-token", fieldLogText: "[callsign] corrected a false omen.", safetyNote: "No real targets.", sortOrder: 5 },
  { name: "The Foundry Child", slug: "visitor-foundry-child", appearanceText: "A small automaton carrying spare screws and a paper manual.", roomSlug: "foundry-bench", prompt: "Submit a tiny repair note.", rewardSummary: "Screw-Heart Charm", loreUnlock: "Small Tools Survive", avatarItem: "screw-charm", fieldLogText: "[callsign] helped the Foundry Child.", safetyNote: "No dangerous instructions.", sortOrder: 6 },
  { name: "The Archive Moth", slug: "visitor-archive-moth", appearanceText: "A pale moth made of page dust and terminal glow.", roomSlug: "archive-terminal", prompt: "Read one forgotten trace.", rewardSummary: "Moth Wing Tab", loreUnlock: "The Page Dust Witness", avatarItem: "archive-moth-wings", fieldLogText: "[callsign] followed the Archive Moth.", safetyNote: "Curated archive only.", sortOrder: 7 },
  { name: "The Pomegranate Courier", slug: "visitor-pomegranate-courier", appearanceText: "A courier with five glowing seeds in their palm.", roomSlug: "underwatch-town-square", prompt: "Carry one safe message to another room.", rewardSummary: "Pomegranate Seed Token", loreUnlock: "Five Seeds, No Kings", avatarItem: "pomegranate-seed-token", fieldLogText: "[callsign] carried a pomegranate signal.", safetyNote: "No off-platform pressure.", sortOrder: 8 },
];

export const SEASONAL_EVENTS: SeasonalEventSeed[] = [
  { title: "Pomegranate Gate Week", slug: "event-pomegranate-gate-week", seasonTiming: "late winter / launch anniversary", eventRooms: ["Town Square", "Archive Terminal", "Faction Floors"], eventPrompts: ["daily gate signal", "guild banner parade", "archive trace reading"], eventRewards: "Pomegranate Gate Frame; Gate Week Badge; Seed Token", badges: ["pomegranate-gate-witness"], profileCosmetics: ["profile gate frame"], avatarUnlocks: ["pomegranate-seed-token"], guildHooks: "guild procession prompt", safetyNotes: "No streak punishment or pay-to-win.", sortOrder: 1 },
  { title: "Ghost Bloom Archive", slug: "event-ghost-bloom-archive", seasonTiming: "spring", eventRooms: ["Archive Terminal", "Ghost in Tech"], eventPrompts: ["archive hunts", "repo relic readings", "memory garden posts"], eventRewards: "Ghost Bloom Tab; Archive Bloom Badge", badges: ["ghost-bloom-witness"], profileCosmetics: ["bloom background"], avatarUnlocks: ["archive-bloom-pin"], guildHooks: "archive shelf projects", safetyNotes: "Curated resources only.", sortOrder: 2 },
  { title: "Rat Nest Print Fair", slug: "event-rat-nest-print-fair", seasonTiming: "summer", eventRooms: ["Rat Nest", "Forums"], eventPrompts: ["zine lines", "profile buttons", "safe banner fair"], eventRewards: "Print Fair Sticker Sheet; Rat Fair Badge", badges: ["print-fair-rat"], profileCosmetics: ["zine wall background"], avatarUnlocks: ["rat-fair-sticker-sheet"], guildHooks: "zine wall projects", safetyNotes: "No harassment, no real targets.", sortOrder: 3 },
  { title: "Black Clinic Quiet Hours", slug: "event-black-clinic-quiet-hours", seasonTiming: "late autumn / burnout week", eventRooms: ["Black Clinic", "Profile World"], eventPrompts: ["rest signals", "accessibility notes", "low-motion challenge"], eventRewards: "Quiet Hours Patch; Low-Motion Lantern Badge", badges: ["quiet-hours-witness"], profileCosmetics: ["soft signal frame"], avatarUnlocks: ["black-clinic-quiet-patch"], guildHooks: "care circle projects", safetyNotes: "No guilt-based participation.", sortOrder: 4 },
];

export const EXPANDED_PLAY_REWARD_MAPPINGS: RewardMappingSeed[] = [
  { sourceSlug: "daily-static-check-in", rewardType: "avatar_unlock", rewardSlug: "daily-signal-pin", notes: "Milestone after first completion." },
  { sourceSlug: "daily-rest-signal", rewardType: "title", rewardSlug: "quiet-regular", notes: "No-guilt rest milestone." },
  { sourceSlug: "weekly-asclepian-veil-quiet-call", rewardType: "avatar_unlock", rewardSlug: "black-clinic-quiet-patch", reviewRequired: true },
  { sourceSlug: "weekly-oracular-circuit-quiet-call", rewardType: "avatar_unlock", rewardSlug: "oracular-hint-token", reviewRequired: true },
  { sourceSlug: "assignment-public-resource", rewardType: "badge", rewardSlug: "archive-hunter", reviewRequired: true },
  { sourceSlug: "guild-project-archive-shelf", rewardType: "guild_banner", rewardSlug: "bone-index-shelf-banner", reviewRequired: true },
  { sourceSlug: "forum-quest-quote-signal", rewardType: "badge", rewardSlug: "echo-quoter" },
  { sourceSlug: "profile-challenge-low-motion", rewardType: "badge", rewardSlug: "low-motion-lantern" },
  { sourceSlug: "archive-hunt-dead-index-trace", rewardType: "lore_unlock", rewardSlug: "dead-index-breathes" },
  { sourceSlug: "signal-broadcast-underwatch-night", rewardType: "signal_player_unlock", rewardSlug: "underwatch-night-broadcast" },
  { sourceSlug: "visitor-archive-moth", rewardType: "avatar_unlock", rewardSlug: "archive-moth-wings" },
  { sourceSlug: "event-rat-nest-print-fair", rewardType: "avatar_unlock", rewardSlug: "rat-fair-sticker-sheet" },
  { sourceSlug: "micro-badge-concept", rewardType: "reputation", rewardSlug: "rep-micro-submit", reviewRequired: true },
  { sourceSlug: "relic-set-archive-shelf", rewardType: "relic", rewardSlug: "bone-index-shelf" },
  { sourceSlug: "guide-start-dead-drops", rewardType: "badge", rewardSlug: "mentor-lantern-badge", reviewRequired: true },
  { sourceSlug: "pw-contrast-note", rewardType: "reputation", rewardSlug: "rep-public-works-accessibility", reviewRequired: true },
];

export const ALL_PLAYABLE_PROMPTS: PlayablePromptSeed[] = [
  ...DAILY_SIGNALS,
  ...WEEKLY_FACTION_CALLS,
  ...FIELD_ASSIGNMENTS,
  ...GUILD_PROJECTS,
  ...FORUM_QUESTS,
  ...PROFILE_WORLD_CHALLENGES,
  ...ARCHIVE_HUNTS,
  ...SIGNAL_BROADCASTS,
  ...MICRO_MISSION_TEMPLATES,
  ...MENTOR_GUIDE_PROMPTS,
];
