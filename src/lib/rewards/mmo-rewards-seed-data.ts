/**
 * Canonical seed data for MMO rewards, guilds, volunteer loops, and recognition.
 * Source: docs/MMO_SEED_DATA_AND_REWARD_SYSTEM.md
 * Pure data — no Prisma imports.
 */

// --- Enum string literals (match prisma/schema.prisma) ---

export type VolunteerLane =
  | "CODE"
  | "DESIGN"
  | "AVATAR_ASSETS"
  | "BADGE_ART"
  | "LORE_WRITING"
  | "MISSION_WRITING"
  | "CIPHER_WRITING"
  | "MODERATION"
  | "ACCESSIBILITY"
  | "DOCUMENTATION"
  | "RESEARCH_ARCHIVE"
  | "QA_TESTING"
  | "COMMUNITY_EVENTS"
  | "MUSIC_SIGNAL"
  | "NET_NEIGHBOR_SCOUTING";

export type AvatarUnlockCategory =
  | "accessories"
  | "fictional_props"
  | "tech_gear"
  | "faction_flair"
  | "outerwear"
  | "back_items"
  | "effects"
  | "backgrounds";

export type CommunityBuilderPromptCategory =
  | "forum_topic"
  | "mission_idea"
  | "cipher_idea"
  | "lore_fragment"
  | "avatar_asset_idea"
  | "badge_idea"
  | "accessibility_note"
  | "archive_resource"
  | "net_neighbor"
  | "event_idea"
  | "profile_world_theme"
  | "signal_player_idea";

export type RewardSourceType =
  | "mission"
  | "dead_drop"
  | "cipher"
  | "faction_mission"
  | "guild"
  | "archive"
  | "ghost_in_tech"
  | "relic_zone"
  | "profile_world"
  | "signal_player"
  | "manual_recognition"
  | "admin_grant"
  | "volunteer"
  | "community_builder";

export type RewardMappingRewardType =
  | "badge"
  | "loot"
  | "avatar_unlock"
  | "title"
  | "profile_cosmetic"
  | "reputation"
  | "lore_unlock"
  | "relic"
  | "signal_player_unlock"
  | "guild_banner"
  | "forum_flair";

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
  | "Missions"
  | "Events"
  | "Moderation";

export type MmoBadgeTier = "initiate" | "regular" | "adept" | "steward" | "relic" | "mythic";

export type RewardPoolType = "faction_mission" | "guild_milestone" | "admin_manual";

// --- Seed record types ---

export interface StarterGuildSeed {
  slug: string;
  name: string;
  description: string;
  purpose: string;
  conductAgreement: string;
  safetyNotes: string;
  visibility: "PUBLIC" | "APPROVED_USERS";
  guildType: string;
  publicMotto: string;
  primaryFactionSlug: string;
  secondaryAffinities: string[];
  joinPolicy: string;
  foundingHook: string;
  suggestedActivities: string;
  starterRoles: string[];
  badgeHooks: string[];
  imageAssetPath: string;
  bannerAssetPath: string;
}

export interface VolunteerOpportunitySeed {
  slug: string;
  title: string;
  lane: VolunteerLane;
  difficulty: string;
  estimatedTime: string;
  accessLevel: string;
  factionAffinity: string;
  purpose: string;
  taskDescription: string;
  acceptanceCriteria: string;
  whatNotToSubmit: string;
  rewardSuggestions: string;
  reputationRewardPoints: number;
  reputationCategory: ReputationCategory;
  badgeHookSlug: string;
  avatarUnlockHookSlug: string;
  imageAssetPath: string;
  reviewRequired: boolean;
}

export interface CommunityBuilderPromptSeed {
  slug: string;
  title: string;
  category: CommunityBuilderPromptCategory;
  suggestedRoute: string;
  playerPrompt: string;
  reviewRequired: boolean;
  safetyNote: string;
  rewardSuggestions: string;
  badgeHooks: string[];
  sortOrder: number;
}

export interface RecognitionTemplateSeed {
  slug: string;
  title: string;
  recognitionType: string;
  category: string;
  grantedByRole: string;
  visibility: string;
  description: string;
  flavorText: string;
  unlockCondition: string;
  revocable: boolean;
  optOut: boolean;
  badgeHookSlug?: string;
  titleHookSlug?: string;
  lootHookSlug?: string;
  imageAssetPath: string;
  sortOrder: number;
}

export interface ReputationEventDefinitionSeed {
  slug: string;
  eventName: string;
  category: ReputationCategory;
  points: number;
  trigger: string;
  cooldownKey?: string;
  dailyCap?: number;
  reviewRequired: boolean;
  abuseNotes: string;
}

export interface CanonTierDefinitionSeed {
  tier: number;
  tierLabel: string;
  slug: string;
  whatUsersCanCreate: string;
  examplePrompt: string;
  reviewRequirement: string;
  ownershipRules: string;
  safetyRules: string;
  rewardHooks?: string;
  badgeHooks?: string;
  loreUnlockHooks?: string;
  sortOrder: number;
}

export interface CanonLorePromptSeed {
  slug: string;
  title: string;
  tier: number;
  playerPrompt: string;
  rewardHook: string;
  sortOrder: number;
}

export interface PlayerTitleSeed {
  slug: string;
  title: string;
  category: string;
  unlockCondition: string;
  factionAffinity?: string;
  displayLocation?: string;
  flavorText: string;
}

export interface RewardBadgeSeed {
  slug: string;
  name: string;
  category: MmoBadgeCategory;
  tier: MmoBadgeTier;
  factionSlug?: string;
  unlockCondition: string;
  visualConcept?: string;
  assetPath: string;
  flavorText: string;
}

export interface RewardLootSeed {
  slug: string;
  name: string;
  type: MmoLootType;
  rarity: MmoLootRarity;
  category: string;
  unlockCondition: string;
  displayLocation: string;
  assetPath: string;
  flavorText: string;
  sourceLoopSlug?: string;
}

export interface AvatarUnlockAssetSeed {
  slug: string;
  name: string;
  category: AvatarUnlockCategory;
  rarity: MmoLootRarity;
  factionAffinity?: string;
  unlockSource: string;
  assetPath: string;
  layerOrder: number;
  visualDescription: string;
}

export interface RewardMappingSeed {
  sourceType: RewardSourceType;
  sourceSlug: string;
  rewardType: RewardMappingRewardType;
  rewardSlug: string;
  quantity?: number;
  repeatability?: string;
  reviewRequired?: boolean;
  adminNotes?: string;
  factionLeaderNotes?: string;
}

export interface RewardPoolItemSeed {
  rewardType: RewardMappingRewardType;
  rewardSlug: string;
  quantity?: number;
  notes?: string;
}

export interface RewardPoolSeed {
  slug: string;
  name: string;
  factionSlug: string;
  poolType: RewardPoolType;
  description: string;
  adminNotes?: string;
  items: RewardPoolItemSeed[];
}

const GUILD_CONDUCT_BASE =
  "Members agree to contribute safely, respectfully, and without combat-first framing. No private data, harassment, unsafe tactics, medical or legal advice, exploit content, or real-world targeting.";

const GUILD_SAFETY_NOTES =
  "No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.";

// --- STARTER_GUILDS ---

export const STARTER_GUILDS: StarterGuildSeed[] = [
  {
    slug: "the-lantern-thread",
    name: "The Lantern Thread",
    description:
      "The Lantern Thread is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.",
    purpose: "Welcome, orientation, and first-field-note support",
    conductAgreement: `${GUILD_CONDUCT_BASE} Thread Tender members leave a light where the lost can find it — welcoming notes, not commands.`,
    safetyNotes: GUILD_SAFETY_NOTES,
    visibility: "PUBLIC",
    guildType: "forum salon",
    publicMotto: "Leave a light where the lost can find it.",
    primaryFactionSlug: "chthonic-uprising",
    secondaryAffinities: ["asclepian-veil", "community"],
    joinPolicy: "open-request",
    foundingHook:
      "A forgotten terminal room lit itself when the first member left a helpful note instead of a command.",
    suggestedActivities:
      "field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas",
    starterRoles: ["Thread Tender", "Signal Greeter", "Welcome Scribe", "Commons Host"],
    badgeHooks: ["guild-founder", "guild-steward", "underwatch-host"],
    imageAssetPath: "/guild-assets/icons/the-lantern-thread.png",
    bannerAssetPath: "/guild-assets/banners/the-lantern-thread.png",
  },
  {
    slug: "static-gardeners",
    name: "Static Gardeners",
    description:
      "Static Gardeners is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.",
    purpose: "Safe self-hosting, repair, open-web, and public-interest resource gardening",
    conductAgreement: `${GUILD_CONDUCT_BASE} Gardeners grow the commons under the noise — repair culture, open-web resources, and mesh dreaming only.`,
    safetyNotes: GUILD_SAFETY_NOTES,
    visibility: "APPROVED_USERS",
    guildType: "maker crew",
    publicMotto: "Grow the commons under the noise.",
    primaryFactionSlug: "daedalus-foundry",
    secondaryAffinities: ["oracular-circuit", "archive"],
    joinPolicy: "application",
    foundingHook:
      "A forgotten terminal room lit itself when the first member left a helpful note instead of a command.",
    suggestedActivities:
      "field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas",
    starterRoles: ["Signal Planter", "Repo Tiller", "Mesh Dreamer", "Tool Note Keeper"],
    badgeHooks: ["guild-founder", "guild-steward", "underwatch-host"],
    imageAssetPath: "/guild-assets/icons/static-gardeners.png",
    bannerAssetPath: "/guild-assets/banners/static-gardeners.png",
  },
  {
    slug: "bone-index-society",
    name: "The Bone Index Society",
    description:
      "The Bone Index Society is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.",
    purpose: "Lore indexing, archive traces, and civic memory preservation",
    conductAgreement: `${GUILD_CONDUCT_BASE} Index scribes preserve memory without exposing private data or real-world targets.`,
    safetyNotes: GUILD_SAFETY_NOTES,
    visibility: "PUBLIC",
    guildType: "archive circle",
    publicMotto: "Memory has teeth.",
    primaryFactionSlug: "archive",
    secondaryAffinities: ["chthonic-uprising", "oracular-circuit"],
    joinPolicy: "open-request",
    foundingHook:
      "A forgotten terminal room lit itself when the first member left a helpful note instead of a command.",
    suggestedActivities:
      "field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas",
    starterRoles: ["Index Scribe", "Archive Witness", "Lore Tender", "Trace Keeper"],
    badgeHooks: ["guild-founder", "guild-steward", "underwatch-host"],
    imageAssetPath: "/guild-assets/icons/bone-index-society.png",
    bannerAssetPath: "/guild-assets/banners/bone-index-society.png",
  },
  {
    slug: "rat-nest-print-club",
    name: "Rat Nest Print Club",
    description:
      "Rat Nest Print Club is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.",
    purpose: "Safe zine lines, banners, forum flair, and old-web graphics",
    conductAgreement: `${GUILD_CONDUCT_BASE} Print club members make the dark laugh first — satire and morale, never harassment or hate.`,
    safetyNotes: GUILD_SAFETY_NOTES,
    visibility: "PUBLIC",
    guildType: "zine cell",
    publicMotto: "Make the dark laugh first.",
    primaryFactionSlug: "styx-rats",
    secondaryAffinities: ["community-builder", "signal-player"],
    joinPolicy: "open-request",
    foundingHook:
      "A forgotten terminal room lit itself when the first member left a helpful note instead of a command.",
    suggestedActivities:
      "field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas",
    starterRoles: ["Zine Rat", "Sticker Ghost", "Banner Gremlin", "Morale Printer"],
    badgeHooks: ["guild-founder", "guild-steward", "underwatch-host"],
    imageAssetPath: "/guild-assets/icons/rat-nest-print-club.png",
    bannerAssetPath: "/guild-assets/banners/rat-nest-print-club.png",
  },
  {
    slug: "the-repair-choir",
    name: "The Repair Choir",
    description:
      "The Repair Choir is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.",
    purpose: "Bug reports, accessibility improvements, and documentation rituals",
    conductAgreement: `${GUILD_CONDUCT_BASE} Repair Choir members fix gently and document fiercely — no exploit testing or private data in bug reports.`,
    safetyNotes: GUILD_SAFETY_NOTES,
    visibility: "APPROVED_USERS",
    guildType: "maker crew",
    publicMotto: "Fix gently. Document fiercely.",
    primaryFactionSlug: "daedalus-foundry",
    secondaryAffinities: ["asclepian-veil", "accessibility"],
    joinPolicy: "application",
    foundingHook:
      "A forgotten terminal room lit itself when the first member left a helpful note instead of a command.",
    suggestedActivities:
      "field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas",
    starterRoles: ["Patch Singer", "Bench Hand", "Access Harmonist", "Doc Keeper"],
    badgeHooks: ["guild-founder", "guild-steward", "underwatch-host"],
    imageAssetPath: "/guild-assets/icons/the-repair-choir.png",
    bannerAssetPath: "/guild-assets/banners/the-repair-choir.png",
  },
  {
    slug: "veil-commons-crew",
    name: "Veil Commons Crew",
    description:
      "Veil Commons Crew is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.",
    purpose: "Safe care prompts, disclaimers, accessibility notes, and support rituals",
    conductAgreement: `${GUILD_CONDUCT_BASE} Veil Commons Crew treats care as infrastructure — no medical or legal advice, only supportive rituals and access notes.`,
    safetyNotes: GUILD_SAFETY_NOTES,
    visibility: "APPROVED_USERS",
    guildType: "care circle",
    publicMotto: "Care is infrastructure.",
    primaryFactionSlug: "asclepian-veil",
    secondaryAffinities: ["myrmidon-grinders", "community"],
    joinPolicy: "application",
    foundingHook:
      "A forgotten terminal room lit itself when the first member left a helpful note instead of a command.",
    suggestedActivities:
      "field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas",
    starterRoles: ["Care Scribe", "Commons Medic", "Signal Steward", "Rest Witness"],
    badgeHooks: ["guild-founder", "guild-steward", "underwatch-host"],
    imageAssetPath: "/guild-assets/icons/veil-commons-crew.png",
    bannerAssetPath: "/guild-assets/banners/veil-commons-crew.png",
  },
  {
    slug: "delphi-after-dark",
    name: "Delphi After Dark",
    description:
      "Delphi After Dark is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.",
    purpose: "Safe fictional cipher practice, puzzle prompts, and hint-writing",
    conductAgreement: `${GUILD_CONDUCT_BASE} Cipher circle members solve fictional puzzles only — no real hacking, targets, or exploit clues.`,
    safetyNotes: GUILD_SAFETY_NOTES,
    visibility: "APPROVED_USERS",
    guildType: "cipher circle",
    publicMotto: "No oracle is divine after midnight.",
    primaryFactionSlug: "oracular-circuit",
    secondaryAffinities: ["ciphers", "signal-player"],
    joinPolicy: "application",
    foundingHook:
      "A forgotten terminal room lit itself when the first member left a helpful note instead of a command.",
    suggestedActivities:
      "field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas",
    starterRoles: ["Hint Keeper", "Static Listener", "Puzzle Scribe", "Relay Caller"],
    badgeHooks: ["guild-founder", "guild-steward", "underwatch-host"],
    imageAssetPath: "/guild-assets/icons/delphi-after-dark.png",
    bannerAssetPath: "/guild-assets/banners/delphi-after-dark.png",
  },
  {
    slug: "gatewatch-mapmakers",
    name: "The Gatewatch Mapmakers",
    description:
      "The Gatewatch Mapmakers is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.",
    purpose: "Safe accessibility-route, room-flow, and event-readiness map concepts",
    conductAgreement: `${GUILD_CONDUCT_BASE} Mapmakers mark paths without owning them — accessibility routes only, no sensitive locations or tactical claims.`,
    safetyNotes: GUILD_SAFETY_NOTES,
    visibility: "APPROVED_USERS",
    guildType: "accessibility crew",
    publicMotto: "A gate is only good if everyone can pass.",
    primaryFactionSlug: "myrmidon-grinders",
    secondaryAffinities: ["accessibility", "archive"],
    joinPolicy: "open-request",
    foundingHook:
      "A forgotten terminal room lit itself when the first member left a helpful note instead of a command.",
    suggestedActivities:
      "field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas",
    starterRoles: ["Gate Scribe", "Route Witness", "Map Steward", "Commons Scout"],
    badgeHooks: ["guild-founder", "guild-steward", "underwatch-host"],
    imageAssetPath: "/guild-assets/icons/gatewatch-mapmakers.png",
    bannerAssetPath: "/guild-assets/banners/gatewatch-mapmakers.png",
  },
];

// --- VOLUNTEER_OPPORTUNITIES ---

export const VOLUNTEER_OPPORTUNITIES: VolunteerOpportunitySeed[] = [
  {
    slug: "write-accessibility-note-one-page",
    title: "Write an Accessibility Note for One Page",
    lane: "ACCESSIBILITY",
    difficulty: "beginner",
    estimatedTime: "15-30 minutes",
    accessLevel: "approved-user",
    factionAffinity: "asclepian-veil",
    purpose: "Improve usability and inclusion across the Underwatch.",
    taskDescription: "Pick one page and submit a respectful access note with a practical suggestion.",
    acceptanceCriteria: "Specific page, clear issue, practical suggestion, no private data.",
    whatNotToSubmit: "Harsh callouts, vague complaints, private screenshots, medical claims.",
    rewardSuggestions: "Accessibility Scribe progress, Commons Builder reputation",
    reputationRewardPoints: 10,
    reputationCategory: "ACCESSIBILITY",
    badgeHookSlug: "accessibility-scribe",
    avatarUnlockHookSlug: "accessibility-scribe-ribbon",
    imageAssetPath: "/community-assets/volunteer-lanes/write-accessibility-note-one-page.png",
    reviewRequired: true,
  },
  {
    slug: "test-avatar-builder-mobile",
    title: "Test the Avatar Builder on Mobile",
    lane: "QA_TESTING",
    difficulty: "beginner",
    estimatedTime: "20-40 minutes",
    accessLevel: "approved-user",
    factionAffinity: "daedalus-foundry",
    purpose: "Find mobile layout issues in the Avatar Forge.",
    taskDescription: "Use the Avatar Builder on mobile and report layout/touch/loading clarity.",
    acceptanceCriteria: "Device/browser, steps tried, issues described.",
    whatNotToSubmit: "Private screenshots, unrelated bug dumps, duplicate spam.",
    rewardSuggestions: "Forge Hand progress, Foundry Spark Charm",
    reputationRewardPoints: 8,
    reputationCategory: "FORGE",
    badgeHookSlug: "avatar-forge-spark",
    avatarUnlockHookSlug: "foundry-spark-charm",
    imageAssetPath: "/community-assets/volunteer-lanes/test-avatar-builder-mobile.png",
    reviewRequired: true,
  },
  {
    slug: "submit-safe-ghost-in-tech-repo-summary",
    title: "Submit One Safe Ghost in Tech Repo Summary",
    lane: "RESEARCH_ARCHIVE",
    difficulty: "intermediate",
    estimatedTime: "20-45 minutes",
    accessLevel: "approved-user",
    factionAffinity: "daedalus-foundry",
    purpose: "Build Ghost in Tech with public-interest learning resources.",
    taskDescription: "Submit a public repo link with safe educational summary.",
    acceptanceCriteria: "Public link, non-harmful purpose, safety note.",
    whatNotToSubmit: "Malware, exploit tooling, credential tools, evasion tools.",
    rewardSuggestions: "Ghost in Tech Runner progress, Repo Relic Patch",
    reputationRewardPoints: 15,
    reputationCategory: "ARCHIVE",
    badgeHookSlug: "ghost-in-tech-runner",
    avatarUnlockHookSlug: "ghost-in-tech-repo-chip",
    imageAssetPath: "/community-assets/volunteer-lanes/submit-safe-ghost-in-tech-repo-summary.png",
    reviewRequired: true,
  },
  {
    slug: "create-faction-badge-concept",
    title: "Create a Faction Badge Concept",
    lane: "BADGE_ART",
    difficulty: "beginner",
    estimatedTime: "15-30 minutes",
    accessLevel: "approved-user",
    factionAffinity: "chthonic-uprising",
    purpose: "Expand faction progression visuals.",
    taskDescription: "Submit badge name, faction, visual concept, flavor text.",
    acceptanceCriteria: "Hades Watch tone, safe symbolism, no copied art.",
    whatNotToSubmit: "Hate symbols, copied logos, weapon focus.",
    rewardSuggestions: "Badge Smith progress, Forge Credit",
    reputationRewardPoints: 8,
    reputationCategory: "FORGE",
    badgeHookSlug: "badge-smith",
    avatarUnlockHookSlug: "black-cache-sticker",
    imageAssetPath: "/community-assets/volunteer-lanes/create-faction-badge-concept.png",
    reviewRequired: true,
  },
  {
    slug: "draft-character-canon-lore-fragment",
    title: "Draft a Lore Fragment for Character Canon",
    lane: "LORE_WRITING",
    difficulty: "beginner",
    estimatedTime: "15-40 minutes",
    accessLevel: "approved-user",
    factionAffinity: "archive",
    purpose: "Help players define operative identity safely.",
    taskDescription: "Write Tier 1 character canon fragment.",
    acceptanceCriteria: "100-400 words, fictional, no real private data.",
    whatNotToSubmit: "Real allegations, threats, harassment, direct real-person portrayals.",
    rewardSuggestions: "Lore Keeper progress, Bone Index Tab",
    reputationRewardPoints: 10,
    reputationCategory: "LORE",
    badgeHookSlug: "character-canon-scribe",
    avatarUnlockHookSlug: "bone-index-earring",
    imageAssetPath: "/community-assets/volunteer-lanes/draft-character-canon-lore-fragment.png",
    reviewRequired: true,
  },
  {
    slug: "suggest-community-builder-prompt",
    title: "Suggest a Community Builder Prompt",
    lane: "COMMUNITY_EVENTS",
    difficulty: "beginner",
    estimatedTime: "10-20 minutes",
    accessLevel: "approved-user",
    factionAffinity: "community",
    purpose: "Seed safer player creativity.",
    taskDescription: "Submit prompt title, category, prompt, safety note.",
    acceptanceCriteria: "Clear, inclusive, safe, actionable.",
    whatNotToSubmit: "Harassment prompts, unsafe tactics, advice prompts.",
    rewardSuggestions: "Commons Builder progress, Forum Flair",
    reputationRewardPoints: 6,
    reputationCategory: "COMMUNITY",
    badgeHookSlug: "community-builder",
    avatarUnlockHookSlug: "commons-builder-patch",
    imageAssetPath: "/community-assets/volunteer-lanes/suggest-community-builder-prompt.png",
    reviewRequired: true,
  },
  {
    slug: "submit-net-neighbor-banner-idea",
    title: "Submit a Net Neighbor Banner Idea",
    lane: "NET_NEIGHBOR_SCOUTING",
    difficulty: "beginner",
    estimatedTime: "10-25 minutes",
    accessLevel: "approved-user",
    factionAffinity: "styx-rats",
    purpose: "Build Net Neighbor visual identity.",
    taskDescription: "Propose a safe old-web banner concept.",
    acceptanceCriteria: "Banner title, visual description, consent-aware note.",
    whatNotToSubmit: "Doxxing, private URLs, impersonation, copied art.",
    rewardSuggestions: "Net Neighbor Scout progress",
    reputationRewardPoints: 8,
    reputationCategory: "COMMUNITY",
    badgeHookSlug: "net-neighbor-scout",
    avatarUnlockHookSlug: "net-neighbor-lantern-pin",
    imageAssetPath: "/community-assets/volunteer-lanes/submit-net-neighbor-banner-idea.png",
    reviewRequired: true,
  },
  {
    slug: "qa-dead-drop-flow",
    title: "QA the Dead Drop Flow",
    lane: "QA_TESTING",
    difficulty: "beginner",
    estimatedTime: "20-35 minutes",
    accessLevel: "approved-user",
    factionAffinity: "chthonic-uprising",
    purpose: "Ensure Dead Drops are clear and rewarding.",
    taskDescription: "Complete or preview a Dead Drop and report issues.",
    acceptanceCriteria: "Drop slug, steps, expected/actual behavior.",
    whatNotToSubmit: "Spam, private data, technical attack testing.",
    rewardSuggestions: "Static Courier progress, Dead Drop Receipt",
    reputationRewardPoints: 8,
    reputationCategory: "MISSIONS",
    badgeHookSlug: "dead-drop-qa-runner",
    avatarUnlockHookSlug: "dead-drop-receipt",
    imageAssetPath: "/community-assets/volunteer-lanes/qa-dead-drop-flow.png",
    reviewRequired: true,
  },
  {
    slug: "write-beginner-cipher-idea",
    title: "Write a Beginner Cipher Idea",
    lane: "CIPHER_WRITING",
    difficulty: "beginner",
    estimatedTime: "15-30 minutes",
    accessLevel: "approved-user",
    factionAffinity: "oracular-circuit",
    purpose: "Expand Oracular Relay puzzle content safely.",
    taskDescription: "Submit fictional cipher with answer, hint, solution.",
    acceptanceCriteria: "Puzzle-only, solvable, no real targets.",
    whatNotToSubmit: "Real hacking, exploit clues, live systems.",
    rewardSuggestions: "Cipher Lantern progress",
    reputationRewardPoints: 10,
    reputationCategory: "CIPHERS",
    badgeHookSlug: "cipher-lantern",
    avatarUnlockHookSlug: "cipher-glyph-ring",
    imageAssetPath: "/community-assets/volunteer-lanes/write-beginner-cipher-idea.png",
    reviewRequired: true,
  },
  {
    slug: "create-profile-world-theme-concept",
    title: "Create a Profile World Theme Concept",
    lane: "DESIGN",
    difficulty: "intermediate",
    estimatedTime: "30-60 minutes",
    accessLevel: "approved-user",
    factionAffinity: "chthonic-uprising",
    purpose: "Expand old-web profile customization.",
    taskDescription: "Propose background, frame, prompt, access considerations.",
    acceptanceCriteria: "Readable contrast, no stolen art, safety note.",
    whatNotToSubmit: "Flashing effects, low contrast, copyrighted assets.",
    rewardSuggestions: "Profile World Dreamer progress",
    reputationRewardPoints: 12,
    reputationCategory: "FORGE",
    badgeHookSlug: "profile-world-dreamer",
    avatarUnlockHookSlug: "town-square-terminal-frame-avatar",
    imageAssetPath: "/community-assets/volunteer-lanes/create-profile-world-theme-concept.png",
    reviewRequired: true,
  },
  {
    slug: "document-bug-with-screenshots",
    title: "Document a Bug with Screenshots",
    lane: "QA_TESTING",
    difficulty: "beginner",
    estimatedTime: "10-25 minutes",
    accessLevel: "approved-user",
    factionAffinity: "daedalus-foundry",
    purpose: "Repair the Underwatch without code access.",
    taskDescription: "Submit safe screenshots, repro steps, expected and actual behavior.",
    acceptanceCriteria: "Clear steps, redacted screenshots.",
    whatNotToSubmit: "Sensitive account data, other users private content.",
    rewardSuggestions: "Documentation Lantern progress",
    reputationRewardPoints: 8,
    reputationCategory: "FORGE",
    badgeHookSlug: "documentation-lantern",
    avatarUnlockHookSlug: "forge-toolkit",
    imageAssetPath: "/community-assets/volunteer-lanes/document-bug-with-screenshots.png",
    reviewRequired: true,
  },
  {
    slug: "suggest-signal-player-playlist-theme",
    title: "Suggest a Signal Player Playlist Theme",
    lane: "MUSIC_SIGNAL",
    difficulty: "beginner",
    estimatedTime: "10-20 minutes",
    accessLevel: "approved-user",
    factionAffinity: "community",
    purpose: "Build room and faction atmosphere.",
    taskDescription: "Suggest playlist mood/theme and destination.",
    acceptanceCriteria: "No uploads required, no autoplay request.",
    whatNotToSubmit: "Pirated audio, autoplay demands, hateful content.",
    rewardSuggestions: "Signal Player unlock progress",
    reputationRewardPoints: 6,
    reputationCategory: "COMMUNITY",
    badgeHookSlug: "signal-player-curator",
    avatarUnlockHookSlug: "signal-board-patch",
    imageAssetPath: "/community-assets/volunteer-lanes/suggest-signal-player-playlist-theme.png",
    reviewRequired: true,
  },
  {
    slug: "draft-forum-category-description",
    title: "Draft a Forum Category Description",
    lane: "DOCUMENTATION",
    difficulty: "beginner",
    estimatedTime: "10-25 minutes",
    accessLevel: "approved-user",
    factionAffinity: "community",
    purpose: "Make forum spaces clear and safe.",
    taskDescription: "Write category description, allowed topics, safety note.",
    acceptanceCriteria: "Clear scope, welcoming tone, rules.",
    whatNotToSubmit: "Callout spaces, doxxing, unsafe advice.",
    rewardSuggestions: "Thread Tender progress",
    reputationRewardPoints: 6,
    reputationCategory: "COMMUNITY",
    badgeHookSlug: "thread-tender-badge",
    avatarUnlockHookSlug: "lantern-thread-pin",
    imageAssetPath: "/community-assets/volunteer-lanes/draft-forum-category-description.png",
    reviewRequired: true,
  },
  {
    slug: "help-write-mission-flavor-copy",
    title: "Help Write Mission Flavor Copy",
    lane: "MISSION_WRITING",
    difficulty: "intermediate",
    estimatedTime: "20-45 minutes",
    accessLevel: "approved-user",
    factionAffinity: "chthonic-uprising",
    purpose: "Add safe atmosphere to missions.",
    taskDescription: "Draft entry, success, and field log text.",
    acceptanceCriteria: "Nonviolent action, clear completion, safety note.",
    whatNotToSubmit: "Combat framing, real targets, sabotage instructions.",
    rewardSuggestions: "Mission Scribe progress",
    reputationRewardPoints: 10,
    reputationCategory: "MISSIONS",
    badgeHookSlug: "mission-scribe",
    avatarUnlockHookSlug: "field-log-tab",
    imageAssetPath: "/community-assets/volunteer-lanes/help-write-mission-flavor-copy.png",
    reviewRequired: true,
  },
  {
    slug: "review-public-safety-copy",
    title: "Review Public Safety Copy for Clarity",
    lane: "MODERATION",
    difficulty: "intermediate",
    estimatedTime: "20-45 minutes",
    accessLevel: "approved-user",
    factionAffinity: "asclepian-veil",
    purpose: "Make safety language easier to understand.",
    taskDescription: "Review one safety note or moderation copy block.",
    acceptanceCriteria: "Plain-language clarity preserving safety meaning.",
    whatNotToSubmit: "Weakening policy, hostile edits, legal claims.",
    rewardSuggestions: "Safety Lantern progress",
    reputationRewardPoints: 10,
    reputationCategory: "COMMUNITY",
    badgeHookSlug: "safety-lantern",
    avatarUnlockHookSlug: "veil-clinic-patch",
    imageAssetPath: "/community-assets/volunteer-lanes/review-public-safety-copy-clarity.png",
    reviewRequired: true,
  },
];

// --- COMMUNITY_BUILDER_PROMPTS ---

export const COMMUNITY_BUILDER_PROMPTS: CommunityBuilderPromptSeed[] = [
  { slug: "first-lantern-thread", title: "First Lantern Thread", category: "forum_topic", suggestedRoute: "Forums", playerPrompt: "Write a welcoming thread prompt for new operatives entering the Underwatch.", reviewRequired: true, safetyNote: "No pressure for personal disclosure.", rewardSuggestions: "Thread Tender reputation, forum flair", badgeHooks: ["thread-tender-badge"], sortOrder: 1 },
  { slug: "mission-without-teeth", title: "Mission Without Teeth", category: "mission_idea", suggestedRoute: "Missions", playerPrompt: "Design a nonviolent field task that still feels tense and useful.", reviewRequired: true, safetyNote: "No combat, sabotage, targeting, or unsafe tactics.", rewardSuggestions: "Mission Scribe progress", badgeHooks: ["mission-scribe"], sortOrder: 2 },
  { slug: "beginner-oracle-puzzle", title: "Beginner Oracle Puzzle", category: "cipher_idea", suggestedRoute: "Ciphers", playerPrompt: "Propose a beginner cipher based on fictional static or archive fragments.", reviewRequired: true, safetyNote: "Puzzle only; no hacking.", rewardSuggestions: "Cipher Lantern progress", badgeHooks: ["cipher-lantern"], sortOrder: 3 },
  { slug: "carried-relic", title: "Carried Relic", category: "lore_fragment", suggestedRoute: "Profile Dossier", playerPrompt: "Describe a small relic your operative carries and what memory it protects.", reviewRequired: true, safetyNote: "No real private data.", rewardSuggestions: "Lore reputation, relic unlock", badgeHooks: ["character-canon-scribe"], sortOrder: 4 },
  { slug: "avatar-pin-idea", title: "Avatar Pin Idea", category: "avatar_asset_idea", suggestedRoute: "Avatar Builder", playerPrompt: "Invent a small non-combat pin, patch, charm, or sticker.", reviewRequired: true, safetyNote: "No weapons, hate symbols, copied logos.", rewardSuggestions: "Avatar Forge Spark progress", badgeHooks: ["avatar-forge-spark"], sortOrder: 5 },
  { slug: "badge-for-kindness", title: "Badge for Kindness", category: "badge_idea", suggestedRoute: "Badge Case", playerPrompt: "Design a badge for someone who makes the community easier to enter.", reviewRequired: true, safetyNote: "Recognition must not become popularity pressure.", rewardSuggestions: "Badge Smith progress", badgeHooks: ["badge-smith"], sortOrder: 6 },
  { slug: "one-button-easier", title: "One Button Easier", category: "accessibility_note", suggestedRoute: "Accessibility Review", playerPrompt: "Pick one interface action and explain how it could be easier.", reviewRequired: true, safetyNote: "Respectful specific feedback only.", rewardSuggestions: "Accessibility reputation", badgeHooks: ["accessibility-scribe"], sortOrder: 7 },
  { slug: "repo-relic-lantern", title: "Repo Relic Lantern", category: "archive_resource", suggestedRoute: "Ghost in Tech", playerPrompt: "Submit a safe public-interest repo and explain why it belongs.", reviewRequired: true, safetyNote: "No harmful repos.", rewardSuggestions: "Repo Relic Patch", badgeHooks: ["ghost-in-tech-runner"], sortOrder: 8 },
  { slug: "neighbor-signal", title: "Neighbor Signal", category: "net_neighbor", suggestedRoute: "Net Neighbors", playerPrompt: "Suggest a safe Net Neighbor concept, banner, or profile blurb.", reviewRequired: true, safetyNote: "No private sites without consent.", rewardSuggestions: "Net Neighbor reputation", badgeHooks: ["net-neighbor-scout"], sortOrder: 9 },
  { slug: "quiet-event", title: "Quiet Event", category: "event_idea", suggestedRoute: "Events", playerPrompt: "Design a low-pressure community event for exhausted operatives.", reviewRequired: true, safetyNote: "No mandatory attendance or disclosure.", rewardSuggestions: "Commons Builder reputation", badgeHooks: ["community-builder"], sortOrder: 10 },
  { slug: "profile-world-window", title: "Profile World Window", category: "profile_world_theme", suggestedRoute: "Profile World", playerPrompt: "Describe a Profile World background that feels like a room in the Underwatch.", reviewRequired: true, safetyNote: "Avoid flashing effects and low contrast.", rewardSuggestions: "Profile World unlock progress", badgeHooks: ["profile-world-dreamer"], sortOrder: 11 },
  { slug: "signal-player-mood", title: "Signal Player Mood", category: "signal_player_idea", suggestedRoute: "Signal Player", playerPrompt: "Suggest a Signal Player skin, tone, or playlist mood for one faction floor.", reviewRequired: true, safetyNote: "No autoplay.", rewardSuggestions: "Signal Player unlock", badgeHooks: ["signal-player-curator"], sortOrder: 12 },
  { slug: "field-log-flavor", title: "Field Log Flavor", category: "mission_idea", suggestedRoute: "Field Logs", playerPrompt: "Write a safe field log sentence for a completed community action.", reviewRequired: true, safetyNote: "Do not expose submission content.", rewardSuggestions: "Field Debrief Scribe progress", badgeHooks: ["field-debrief-scribe"], sortOrder: 13 },
  { slug: "guild-ritual", title: "Guild Ritual", category: "event_idea", suggestedRoute: "Guilds", playerPrompt: "Propose a weekly guild ritual that is creative, safe, and easy to join.", reviewRequired: true, safetyNote: "No dares, pressure, or unsafe tasks.", rewardSuggestions: "Guild Steward progress", badgeHooks: ["guild-steward"], sortOrder: 14 },
  { slug: "archive-question", title: "Archive Question", category: "archive_resource", suggestedRoute: "Archive", playerPrompt: "Write one discussion question for a public-interest archive item.", reviewRequired: true, safetyNote: "Source-aware, no harassment.", rewardSuggestions: "Archive Witness progress", badgeHooks: ["archive-terminal-reader"], sortOrder: 15 },
  { slug: "dead-drop-revision", title: "Dead Drop Revision", category: "mission_idea", suggestedRoute: "Dead Drops", playerPrompt: "Rewrite a Dead Drop prompt to make it clearer and safer.", reviewRequired: true, safetyNote: "Preserve safety limits.", rewardSuggestions: "Static Courier progress", badgeHooks: ["drop-runner"], sortOrder: 16 },
  { slug: "faction-floor-memory", title: "Faction Floor Memory", category: "lore_fragment", suggestedRoute: "Faction Floors", playerPrompt: "Write a short memory from a faction floor your operative visited.", reviewRequired: true, safetyNote: "No canon-breaking claims without review.", rewardSuggestions: "Faction Echo progress", badgeHooks: ["faction-floor-witness"], sortOrder: 17 },
  { slug: "net-neighbor-button", title: "Net Neighbor Button", category: "avatar_asset_idea", suggestedRoute: "Net Neighbors", playerPrompt: "Propose an 88x31 old-web button concept for a safe neighbor node.", reviewRequired: true, safetyNote: "No impersonation.", rewardSuggestions: "Net Neighbor banner part", badgeHooks: ["net-neighbor-scout"], sortOrder: 18 },
  { slug: "moderator-lantern", title: "Moderator Lantern", category: "accessibility_note", suggestedRoute: "Moderation Support", playerPrompt: "Suggest a clearer way to explain a community safety rule.", reviewRequired: true, safetyNote: "Do not weaken policy.", rewardSuggestions: "Safety Lantern progress", badgeHooks: ["safety-lantern"], sortOrder: 19 },
  { slug: "sunlight-after-collapse", title: "Sunlight After Collapse", category: "lore_fragment", suggestedRoute: "Archive / Profile World", playerPrompt: "Write a hopeful solarpunk micro-fragment about what the Underwatch builds toward.", reviewRequired: true, safetyNote: "Hopeful, nonviolent, practical.", rewardSuggestions: "Lore reputation", badgeHooks: ["commons-spark"], sortOrder: 20 },
];

// --- RECOGNITION_TEMPLATES ---

export const RECOGNITION_TEMPLATES: RecognitionTemplateSeed[] = [
  { slug: "thread-tender", title: "Thread Tender", recognitionType: "Title", category: "Community", grantedByRole: "moderator", visibility: "public", description: "Recognizes welcoming, clarifying, de-escalating forum participation.", flavorText: "They kept a chair open beside the static.", unlockCondition: "Moderator-approved pattern of healthy forum support.", revocable: true, optOut: true, titleHookSlug: "thread-tender", imageAssetPath: "/community-assets/recognition/thread-tender.png", sortOrder: 1 },
  { slug: "cipher-lantern", title: "Cipher Lantern", recognitionType: "Badge", category: "Ciphers", grantedByRole: "automatic", visibility: "public", description: "Recognizes safe cipher solving or approved puzzle contribution.", flavorText: "A small light for those who read the dark carefully.", unlockCondition: "Solve three approved puzzles or contribute one approved beginner cipher.", revocable: true, optOut: true, badgeHookSlug: "cipher-lantern", imageAssetPath: "/community-assets/recognition/cipher-lantern.png", sortOrder: 2 },
  { slug: "forge-hand", title: "Forge Hand", recognitionType: "Title", category: "Forge", grantedByRole: "admin", visibility: "public", description: "Recognizes documentation, design, QA, or asset work.", flavorText: "The hand that fixes the hinge owns part of the door.", unlockCondition: "Approved Forge-lane contribution.", revocable: true, optOut: true, titleHookSlug: "forge-hand", imageAssetPath: "/community-assets/recognition/forge-hand.png", sortOrder: 3 },
  { slug: "archive-witness", title: "Archive Witness", recognitionType: "Badge", category: "Archive", grantedByRole: "automatic", visibility: "public", description: "Recognizes archive reading or safe archive contribution.", flavorText: "The archive blinked. Someone was still reading.", unlockCondition: "Read five archive items or submit approved archive resource.", revocable: true, optOut: true, badgeHookSlug: "archive-witness", imageAssetPath: "/community-assets/recognition/archive-witness.png", sortOrder: 4 },
  { slug: "commons-builder", title: "Commons Builder", recognitionType: "Title", category: "Community", grantedByRole: "admin", visibility: "public", description: "Recognizes contributions that make Hades Watch more usable and resilient.", flavorText: "They built a bench in the underworld and called it infrastructure.", unlockCondition: "Approved prompt, safety copy, guild template, or access contribution.", revocable: true, optOut: true, titleHookSlug: "commons-builder", imageAssetPath: "/community-assets/recognition/commons-builder.png", sortOrder: 5 },
  { slug: "net-neighbor-scout", title: "Net Neighbor Scout", recognitionType: "Badge", category: "Net Neighbors", grantedByRole: "moderator", visibility: "public", description: "Recognizes safe contributions to the Net Neighbors ring.", flavorText: "They found a door that did not demand obedience.", unlockCondition: "Approved Net Neighbor lead, banner, or profile suggestion.", revocable: true, optOut: true, badgeHookSlug: "net-neighbor-scout", imageAssetPath: "/community-assets/recognition/net-neighbor-scout.png", sortOrder: 6 },
  { slug: "accessibility-scribe", title: "Accessibility Scribe", recognitionType: "Badge", category: "Accessibility", grantedByRole: "admin", visibility: "public", description: "Recognizes clear accessibility feedback and inclusive design suggestions.", flavorText: "A gate is only good if everyone can pass.", unlockCondition: "Approved accessibility note or review.", revocable: true, optOut: true, badgeHookSlug: "accessibility-scribe", imageAssetPath: "/community-assets/recognition/accessibility-scribe.png", sortOrder: 7 },
  { slug: "lore-keeper", title: "Lore Keeper", recognitionType: "Title", category: "Lore", grantedByRole: "admin", visibility: "public", description: "Recognizes safe lore contributions across canon layers.", flavorText: "They kept the ghost from becoming trivia.", unlockCondition: "Approved Tier 1-3 lore contribution.", revocable: true, optOut: true, titleHookSlug: "lore-keeper", imageAssetPath: "/community-assets/recognition/lore-keeper.png", sortOrder: 8 },
  { slug: "field-debrief-scribe", title: "Field Debrief Scribe", recognitionType: "Badge", category: "Missions", grantedByRole: "automatic", visibility: "profile-only", description: "Recognizes useful logs or mission flavor summaries.", flavorText: "No action is complete until the commons can learn from it.", unlockCondition: "Three approved field logs or one approved mission flavor contribution.", revocable: true, optOut: true, badgeHookSlug: "field-debrief-scribe", imageAssetPath: "/community-assets/recognition/field-debrief-scribe.png", sortOrder: 9 },
  { slug: "chthonic-signal", title: "Chthonic Signal", recognitionType: "Community Spotlight", category: "Recognition", grantedByRole: "owner", visibility: "public", description: "Owner-granted spotlight for work that strengthens the Underwatch.", flavorText: "The signal crossed five floors and came back carrying sunlight.", unlockCondition: "Manual Owner recognition.", revocable: true, optOut: true, badgeHookSlug: "chthonic-signal", imageAssetPath: "/community-assets/recognition/chthonic-signal.png", sortOrder: 10 },
  { slug: "dead-index-witness", title: "Dead Index Witness", recognitionType: "Owner / Archivist Mark", category: "Recognition", grantedByRole: "owner", visibility: "public", description: "Rare Archivist mark for lasting lore/archive/community work.", flavorText: "The Dead Index opened one eye and wrote the name down.", unlockCondition: "Owner-only manual grant.", revocable: true, optOut: true, badgeHookSlug: "dead-index-witness", lootHookSlug: "dead-index-badge-chain", imageAssetPath: "/community-assets/recognition/dead-index-witness.png", sortOrder: 11 },
  { slug: "underwatch-host", title: "Underwatch Host", recognitionType: "Featured Guild", category: "Guilds", grantedByRole: "admin", visibility: "public", description: "Recognizes a guild or steward hosting safe recurring community activity.", flavorText: "They kept the room warm without locking the door.", unlockCondition: "Approved recurring guild activity with good standing.", revocable: true, optOut: true, badgeHookSlug: "underwatch-host-badge", titleHookSlug: "underwatch-host", imageAssetPath: "/community-assets/recognition/underwatch-host.png", sortOrder: 12 },
];

// --- REPUTATION_EVENT_DEFINITIONS ---

export const REPUTATION_EVENT_DEFINITIONS: ReputationEventDefinitionSeed[] = [
  { slug: "first-field-log", eventName: "First Field Log", category: "COMMUNITY", points: 10, trigger: "Player creates first safe field log", cooldownKey: "once_per_account", reviewRequired: false, abuseNotes: "No grant for deleted account activity." },
  { slug: "daily-field-note", eventName: "Daily Field Note", category: "COMMUNITY", points: 3, trigger: "Approved field note posted", cooldownKey: "1/day", dailyCap: 15, reviewRequired: false, abuseNotes: "No deleted notes, duplicates, or spam." },
  { slug: "helpful-forum-reply", eventName: "Helpful Forum Reply", category: "COMMUNITY", points: 4, trigger: "Reply marked useful", cooldownKey: "3/day", dailyCap: 20, reviewRequired: true, abuseNotes: "Prevent reciprocal farming; moderator reversal allowed." },
  { slug: "community-builder-prompt-approved", eventName: "Community Builder Prompt Approved", category: "COMMUNITY", points: 8, trigger: "Prompt accepted", cooldownKey: "3/week", reviewRequired: true, abuseNotes: "No duplicate prompts." },
  { slug: "guild-joined", eventName: "Guild Joined", category: "GUILDS", points: 5, trigger: "User joins approved guild", cooldownKey: "5_total", reviewRequired: false, abuseNotes: "No leave/rejoin farming." },
  { slug: "guild-activity-completed", eventName: "Guild Activity Completed", category: "GUILDS", points: 8, trigger: "Approved guild activity logged", cooldownKey: "2/week", reviewRequired: true, abuseNotes: "Guild steward review; admin reversal allowed." },
  { slug: "volunteer-task-approved", eventName: "Volunteer Task Approved", category: "FORGE", points: 12, trigger: "Submission approved", cooldownKey: "3/week", reviewRequired: true, abuseNotes: "No rejected, unsafe, or plagiarized work." },
  { slug: "bug-report-approved", eventName: "Bug Report Approved", category: "FORGE", points: 8, trigger: "Useful bug report accepted", cooldownKey: "3/week", reviewRequired: true, abuseNotes: "Screenshots must be redacted." },
  { slug: "accessibility-note-approved", eventName: "Accessibility Note Approved", category: "ACCESSIBILITY", points: 10, trigger: "Accessibility note accepted", cooldownKey: "2/week", reviewRequired: true, abuseNotes: "No vague or duplicate notes." },
  { slug: "mission-completed", eventName: "Mission Completed", category: "MISSIONS", points: 12, trigger: "Mission marked complete", cooldownKey: "per_mission", reviewRequired: false, abuseNotes: "No duplicate unless repeatable." },
  { slug: "dead-drop-completed", eventName: "Dead Drop Completed", category: "MISSIONS", points: 8, trigger: "Dead Drop completion logged", cooldownKey: "per_drop", reviewRequired: false, abuseNotes: "Drop-specific cap; review submissions." },
  { slug: "mini-cipher-solved", eventName: "Mini Cipher Solved", category: "CIPHERS", points: 6, trigger: "Cipher answer accepted", cooldownKey: "per_cipher", reviewRequired: false, abuseNotes: "Rate limit attempts; no brute-force reward." },
  { slug: "cipher-idea-approved", eventName: "Cipher Idea Approved", category: "CIPHERS", points: 10, trigger: "Player cipher approved", cooldownKey: "2/month", reviewRequired: true, abuseNotes: "Puzzle safety review required." },
  { slug: "archive-item-read", eventName: "Archive Item Read", category: "ARCHIVE", points: 2, trigger: "Archive item read", cooldownKey: "5/day", reviewRequired: false, abuseNotes: "Anti-refresh tracking." },
  { slug: "ghost-in-tech-repo-approved", eventName: "Ghost in Tech Repo Approved", category: "ARCHIVE", points: 15, trigger: "Safe repo summary approved", cooldownKey: "2/month", reviewRequired: true, abuseNotes: "Repo safety review." },
  { slug: "lore-fragment-approved", eventName: "Lore Fragment Approved", category: "LORE", points: 12, trigger: "Lore approved for canon tier", cooldownKey: "2/month", reviewRequired: true, abuseNotes: "Review for canon and originality." },
  { slug: "faction-floor-visit", eventName: "Faction Floor Visit", category: "FACTION", points: 3, trigger: "First faction floor visit", cooldownKey: "once_per_floor", reviewRequired: false, abuseNotes: "No refresh farming." },
  { slug: "recognition-granted", eventName: "Recognition Granted", category: "RECOGNITION", points: 15, trigger: "Manual recognition granted", cooldownKey: "manual_only", reviewRequired: true, abuseNotes: "Audit required." },
  { slug: "net-neighbor-approved", eventName: "Net Neighbor Approved", category: "COMMUNITY", points: 12, trigger: "Net Neighbor approved", cooldownKey: "2/month", reviewRequired: true, abuseNotes: "Consent and listing review required." },
  { slug: "signal-player-idea-approved", eventName: "Signal Player Idea Approved", category: "COMMUNITY", points: 6, trigger: "Playlist/theme suggestion accepted", cooldownKey: "2/month", reviewRequired: true, abuseNotes: "No autoplay; no pirated content." },
];

// --- CANON_TIER_DEFINITIONS ---

export const CANON_TIER_DEFINITIONS: CanonTierDefinitionSeed[] = [
  { tier: 0, tierLabel: "Private Draft", slug: "tier-0-private-draft", whatUsersCanCreate: "Personal drafts and unfinished character fragments", examplePrompt: "What did your operative almost say into the relay?", reviewRequirement: "No review unless shared", ownershipRules: "User owns draft; not canon", safetyRules: "No private data, harassment, or unsafe claims", rewardHooks: "Draft-only field log", badgeHooks: "private-draft-keeper", loreUnlockHooks: "None by default", sortOrder: 0 },
  { tier: 1, tierLabel: "Character Canon", slug: "tier-1-character-canon", whatUsersCanCreate: "Operative memories, carried relics, profile flavor", examplePrompt: "Describe your operative's first signal.", reviewRequirement: "Required for public display", ownershipRules: "User owns character canon", safetyRules: "Fictional, non-defamatory, no real targeting", rewardHooks: "Lore reputation, title progress", badgeHooks: "character-canon-scribe", loreUnlockHooks: "Character dossier fragments", sortOrder: 1 },
  { tier: 2, tierLabel: "Guild Canon", slug: "tier-2-guild-canon", whatUsersCanCreate: "Guild founding rumors, rituals, room memories", examplePrompt: "What rumor explains your guild's founding?", reviewRequirement: "Guild steward + moderator review", ownershipRules: "Guild owns shared canon; contributor credited", safetyRules: "No exclusionary or unsafe rituals", rewardHooks: "Guild reputation, banner progress", badgeHooks: "guild-lore-keeper", loreUnlockHooks: "Guild page lore snippets", sortOrder: 2 },
  { tier: 3, tierLabel: "Local / Community Canon", slug: "tier-3-local-community-canon", whatUsersCanCreate: "Underwatch places, old-web rooms, community legends", examplePrompt: "Name a place in the Underwatch and what it protects.", reviewRequirement: "Moderator/Admin review", ownershipRules: "Contributor credited; Hades Watch may display", safetyRules: "No direct real-world claims or private locations", rewardHooks: "Community lore reputation", badgeHooks: "underwatch-cartographer", loreUnlockHooks: "Room descriptions, local lore cards", sortOrder: 3 },
  { tier: 4, tierLabel: "Faction Echo", slug: "tier-4-faction-echo", whatUsersCanCreate: "Faction floor memories, leader-adjacent myths, internal sayings", examplePrompt: "What did your faction floor teach your operative?", reviewRequirement: "Faction steward + Admin review", ownershipRules: "Contributor credited; faction canon controlled", safetyRules: "Must fit faction lore and safety rules", rewardHooks: "Faction reputation, faction flair", badgeHooks: "faction-echo-scribe", loreUnlockHooks: "Faction lore echoes", sortOrder: 4 },
  { tier: 5, tierLabel: "World Canon", slug: "tier-5-world-canon", whatUsersCanCreate: "Major lore, Dead Index entries, canonical events, alliance myths", examplePrompt: "What truth did the Surface Order fail to erase?", reviewRequirement: "Owner / Archivist review only", ownershipRules: "Canon belongs to Hades Watch; contributor credited", safetyRules: "Highest safety and continuity review", rewardHooks: "Rare recognition, relic rewards", badgeHooks: "dead-index-witness", loreUnlockHooks: "World Canon unlocks", sortOrder: 5 },
];

// --- CANON_LORE_PROMPTS ---

export const CANON_LORE_PROMPTS: CanonLorePromptSeed[] = [
  { slug: "your-operatives-first-signal", title: "Your Operative's First Signal", tier: 1, playerPrompt: "Write the first strange signal your operative answered.", rewardHook: "Character Canon Scribe progress", sortOrder: 1 },
  { slug: "a-relic-your-character-carries", title: "A Relic Your Character Carries", tier: 1, playerPrompt: "Describe a harmless relic, charm, or keepsake your operative carries.", rewardHook: "Relic Zone starter module", sortOrder: 2 },
  { slug: "your-guilds-founding-rumor", title: "Your Guild's Founding Rumor", tier: 2, playerPrompt: "Write the rumor that explains how your guild cell began.", rewardHook: "Guild Lore Keeper progress", sortOrder: 3 },
  { slug: "a-faction-floor-memory", title: "A Faction Floor Memory", tier: 4, playerPrompt: "Describe a small memory from a faction floor.", rewardHook: "Faction Echo Scribe progress", sortOrder: 4 },
  { slug: "a-dead-drop-you-almost-missed", title: "A Dead Drop You Almost Missed", tier: 1, playerPrompt: "Write about a fictional Dead Drop your operative nearly ignored.", rewardHook: "Static Courier progress", sortOrder: 5 },
  { slug: "a-place-in-the-underwatch", title: "A Place in the Underwatch", tier: 3, playerPrompt: "Invent a safe room, corridor, or old-web node beneath the surface.", rewardHook: "Underwatch Cartographer progress", sortOrder: 6 },
  { slug: "a-rumor-about-the-surface-order", title: "A Rumor About the Surface Order", tier: 3, playerPrompt: "Write a fictional rumor about the Surface Order without real-world names or claims.", rewardHook: "Lore reputation", sortOrder: 7 },
  { slug: "a-net-neighbor-you-trust", title: "A Net Neighbor You Trust", tier: 2, playerPrompt: "Invent or describe a safe community node your guild respects.", rewardHook: "Net Neighbor Scout progress", sortOrder: 8 },
  { slug: "a-tool-that-saved-a-signal", title: "A Tool That Saved a Signal", tier: 1, playerPrompt: "Describe a non-combat tool, repair, or tech charm that helped your operative.", rewardHook: "Forge Hand progress", sortOrder: 9 },
  { slug: "a-song-from-the-signal-player", title: "A Song From the Signal Player", tier: 1, playerPrompt: "Describe the mood of a song or broadcast your operative keeps returning to.", rewardHook: "Signal Player Curator progress", sortOrder: 10 },
];

// --- PLAYER_TITLES ---

export const PLAYER_TITLES: PlayerTitleSeed[] = [
  { slug: "static-courier", title: "Static Courier", category: "Dead Drops", unlockCondition: "Complete first reviewed Dead Drop", factionAffinity: "chthonic-uprising", displayLocation: "Character Dossier", flavorText: "They carried a message through dead air." },
  { slug: "signal-reader", title: "Signal Reader", category: "Ciphers", unlockCondition: "Solve first Oracular Relay cipher", factionAffinity: "oracular-circuit", displayLocation: "Character Dossier", flavorText: "They learned the machine could stutter." },
  { slug: "archive-witness-title", title: "Archive Witness", category: "Archive", unlockCondition: "Read five archive entries", factionAffinity: "archive", displayLocation: "Character Dossier", flavorText: "They saw what the surface buried." },
  { slug: "commons-builder", title: "Commons Builder", category: "Community", unlockCondition: "Approved Community Builder contribution", factionAffinity: "chthonic-uprising", displayLocation: "Character Dossier", flavorText: "A bench in the dark is still infrastructure." },
  { slug: "thread-tender", title: "Thread Tender", category: "Community", unlockCondition: "Moderator recognition for welcoming posts", factionAffinity: "community", displayLocation: "Forums / Dossier", flavorText: "They kept the thread warm." },
  { slug: "forge-hand", title: "Forge Hand", category: "Forge", unlockCondition: "Approved Forge or QA contribution", factionAffinity: "daedalus-foundry", displayLocation: "Character Dossier", flavorText: "The hinge remembers the hand." },
  { slug: "gatehouse-runner", title: "Gatehouse Runner", category: "Factions", unlockCondition: "Complete Gatehouse action", factionAffinity: "myrmidon-grinders", displayLocation: "Character Dossier", flavorText: "They knew which gate would hold." },
  { slug: "black-clinic-visitor", title: "Black Clinic Visitor", category: "Factions", unlockCondition: "Visit Black Clinic and submit safe note", factionAffinity: "asclepian-veil", displayLocation: "Character Dossier", flavorText: "They learned care has doors." },
  { slug: "rat-nest-regular", title: "Rat Nest Regular", category: "Factions", unlockCondition: "Complete Rat Nest morale prompt", factionAffinity: "styx-rats", displayLocation: "Character Dossier", flavorText: "The wall saved them a seat." },
  { slug: "dead-index-carrier", title: "Dead Index Carrier", category: "Dead Drops", unlockCondition: "Complete five Dead Drops", factionAffinity: "chthonic-uprising", displayLocation: "Character Dossier", flavorText: "A dead ledger page folded into their pocket." },
  { slug: "cipher-lantern-title", title: "Cipher Lantern", category: "Ciphers", unlockCondition: "Solve three beginner ciphers", factionAffinity: "oracular-circuit", displayLocation: "Character Dossier", flavorText: "They lit the clue without burning the room." },
  { slug: "net-neighbor-scout-title", title: "Net Neighbor Scout", category: "Community", unlockCondition: "Approved Net Neighbor submission", factionAffinity: "community", displayLocation: "Character Dossier", flavorText: "They found a signal worth visiting." },
  { slug: "repo-relic-reader", title: "Repo Relic Reader", category: "Archive", unlockCondition: "Read or submit Ghost in Tech repo summary", factionAffinity: "daedalus-foundry", displayLocation: "Character Dossier", flavorText: "They read code as civic memory." },
  { slug: "field-debrief-scribe-title", title: "Field Debrief Scribe", category: "Missions", unlockCondition: "Submit three approved field logs", factionAffinity: "chthonic-uprising", displayLocation: "Field Log / Dossier", flavorText: "They made action legible." },
  { slug: "lore-keeper", title: "Lore Keeper", category: "Lore", unlockCondition: "Approved Tier 1-3 lore", factionAffinity: "archive", displayLocation: "Profile World", flavorText: "They kept a ghost from becoming trivia." },
  { slug: "guild-steward", title: "Guild Steward", category: "Guilds", unlockCondition: "Host approved guild activity", factionAffinity: "guilds", displayLocation: "Guild Page / Dossier", flavorText: "They kept the room open." },
  { slug: "signal-player-curator", title: "Signal Player Curator", category: "Community", unlockCondition: "Approved Signal Player theme", factionAffinity: "community", displayLocation: "Signal Player / Dossier", flavorText: "They tuned the static toward home." },
  { slug: "avatar-forge-spark-title", title: "Avatar Forge Spark", category: "Forge", unlockCondition: "Approved avatar concept", factionAffinity: "daedalus-foundry", displayLocation: "Avatar Builder", flavorText: "They gave the ghost something to wear." },
  { slug: "safety-lantern", title: "Safety Lantern", category: "Moderation", unlockCondition: "Approved safety copy improvement", factionAffinity: "asclepian-veil", displayLocation: "Dossier", flavorText: "Their warning did not become a wall." },
  { slug: "documentation-lantern", title: "Documentation Lantern", category: "Forge", unlockCondition: "Approved documentation or bug report", factionAffinity: "daedalus-foundry", displayLocation: "Dossier", flavorText: "They wrote the map after finding the hole." },
  { slug: "underwatch-host", title: "Underwatch Host", category: "Guilds", unlockCondition: "Recognized safe community host", factionAffinity: "guilds", displayLocation: "Guild Page / Dossier", flavorText: "They kept the room warm." },
  { slug: "static-gardener", title: "Static Gardener", category: "Guilds", unlockCondition: "Join Static Gardeners and complete first activity", factionAffinity: "daedalus-foundry", displayLocation: "Dossier", flavorText: "They grew a signal under the noise." },
  { slug: "bone-index-scribe", title: "Bone Index Scribe", category: "Archive", unlockCondition: "Approved lore or archive index contribution", factionAffinity: "archive", displayLocation: "Dossier", flavorText: "The bone card accepted their handwriting." },
  { slug: "zine-rat", title: "Zine Rat", category: "Community", unlockCondition: "Approved zine line or banner", factionAffinity: "styx-rats", displayLocation: "Forums / Dossier", flavorText: "Ink under the nails, sunlight in the margins." },
  { slug: "care-signal", title: "Care Signal", category: "Factions", unlockCondition: "Complete Veil care prompt", factionAffinity: "asclepian-veil", displayLocation: "Dossier", flavorText: "They checked the pulse of a room." },
  { slug: "relay-caller", title: "Relay Caller", category: "Ciphers", unlockCondition: "Submit approved cipher idea", factionAffinity: "oracular-circuit", displayLocation: "Dossier", flavorText: "They taught static a new question." },
  { slug: "map-steward", title: "Map Steward", category: "Accessibility", unlockCondition: "Approved route or navigation note", factionAffinity: "myrmidon-grinders", displayLocation: "Dossier", flavorText: "They marked the path without owning it." },
  { slug: "pomegranate-witness", title: "Pomegranate Witness", category: "Rooms", unlockCondition: "Visit five core MMO rooms", factionAffinity: "chthonic-uprising", displayLocation: "Dossier", flavorText: "Five seeds. Five doors. One dark root." },
  { slug: "ghost-in-tech-runner-title", title: "Ghost in Tech Runner", category: "Archive", unlockCondition: "Submit approved repo relic", factionAffinity: "daedalus-foundry", displayLocation: "Dossier", flavorText: "They found a machine with a conscience-shaped dent." },
  { slug: "dead-index-witness-title", title: "Dead Index Witness", category: "Recognition", unlockCondition: "Owner grant", factionAffinity: "chthonic-uprising", displayLocation: "Public Recognition / Dossier", flavorText: "The Dead Index opened one eye." },
  { slug: "chthonic-signal-title", title: "Chthonic Signal", category: "Recognition", unlockCondition: "Owner spotlight", factionAffinity: "chthonic-uprising", displayLocation: "Public Recognition / Dossier", flavorText: "The signal returned carrying sunlight." },
  { slug: "veilbearer-title", title: "Veilbearer", category: "Factions", unlockCondition: "Asclepian Veil faction progress", factionAffinity: "asclepian-veil", displayLocation: "Dossier", flavorText: "They carried privacy like medicine." },
  { slug: "foundry-apprentice-title", title: "Foundry Apprentice", category: "Factions", unlockCondition: "Daedalus Foundry faction progress", factionAffinity: "daedalus-foundry", displayLocation: "Dossier", flavorText: "They learned which doors wanted hinges." },
  { slug: "styx-stray-title", title: "Styx Stray", category: "Factions", unlockCondition: "Styx Rats faction progress", factionAffinity: "styx-rats", displayLocation: "Dossier", flavorText: "The river let them sleep under the bridge." },
  { slug: "line-holder-title", title: "Line Holder", category: "Factions", unlockCondition: "Myrmidon Grinders faction progress", factionAffinity: "myrmidon-grinders", displayLocation: "Dossier", flavorText: "They held the gate without becoming it." },
];

// --- REWARD_BADGES ---

export const REWARD_BADGES: RewardBadgeSeed[] = [
  { slug: "first-descent", name: "First Descent", category: "Missions", tier: "initiate", factionSlug: "chthonic-uprising", unlockCondition: "Complete any First Descent Protocol", visualConcept: "Pomegranate gate opening", assetPath: "/badge-assets/missions/first-descent.png", flavorText: "The first door remembered your name." },
  { slug: "black-clinic-readiness", name: "Black Clinic Readiness", category: "Missions", tier: "initiate", factionSlug: "asclepian-veil", unlockCondition: "Complete Black Clinic Readiness", visualConcept: "Green pulse behind veil", assetPath: "/badge-assets/missions/black-clinic-readiness.png", flavorText: "Care became operational." },
  { slug: "oracle-hygiene-check", name: "Oracle Hygiene Check", category: "Missions", tier: "initiate", factionSlug: "oracular-circuit", unlockCondition: "Complete Oracle Hygiene Check", visualConcept: "Violet eye with shielded cursor", assetPath: "/badge-assets/missions/oracle-hygiene-check.png", flavorText: "The prophecy lost a little metadata." },
  { slug: "gatewatch-readiness-map", name: "Gatewatch Readiness Map", category: "Missions", tier: "initiate", factionSlug: "myrmidon-grinders", unlockCondition: "Complete Gatewatch Readiness Map", visualConcept: "Bronze gate map pin", assetPath: "/badge-assets/missions/gatewatch-readiness-map.png", flavorText: "A route is a promise." },
  { slug: "labyrinth-repair-log", name: "Labyrinth Repair Log", category: "Missions", tier: "initiate", factionSlug: "daedalus-foundry", unlockCondition: "Complete Labyrinth Repair Log", visualConcept: "Orange wrench over labyrinth", assetPath: "/badge-assets/missions/labyrinth-repair-log.png", flavorText: "The broken thing became a teacher." },
  { slug: "morale-signal-drop", name: "Morale Signal Drop", category: "Missions", tier: "initiate", factionSlug: "styx-rats", unlockCondition: "Complete Morale Signal Drop", visualConcept: "Pink sticker burst", assetPath: "/badge-assets/missions/morale-signal-drop.png", flavorText: "Joy left a mark." },
  { slug: "c1ph3r-cr4k3r-initiate", name: "C1PH3R CR4K3R Initiate", category: "Ciphers", tier: "initiate", factionSlug: "oracular-circuit", unlockCondition: "Solve first cipher", visualConcept: "Glitch key, one notch lit", assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-initiate.png", flavorText: "The first lock was mostly theater." },
  { slug: "c1ph3r-cr4k3r-signal-reader", name: "C1PH3R CR4K3R Signal Reader", category: "Ciphers", tier: "regular", factionSlug: "oracular-circuit", unlockCondition: "Solve three ciphers", visualConcept: "Static scroll and eye", assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-signal-reader.png", flavorText: "They read what the relay tried to bury." },
  { slug: "c1ph3r-cr4k3r-index-scribe", name: "C1PH3R CR4K3R Index Scribe", category: "Ciphers", tier: "adept", factionSlug: "oracular-circuit", unlockCondition: "Solve seven ciphers", visualConcept: "Cipher glyph on index card", assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-index-scribe.png", flavorText: "The answer entered the ledger." },
  { slug: "c1ph3r-cr4k3r-oracle-key", name: "C1PH3R CR4K3R Oracle Key", category: "Ciphers", tier: "steward", factionSlug: "oracular-circuit", unlockCondition: "Solve twelve ciphers", visualConcept: "Bent oracle key", assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-oracle-key.png", flavorText: "The oracle learned humility." },
  { slug: "c1ph3r-cr4k3r-dead-index-adept", name: "C1PH3R CR4K3R Dead Index Adept", category: "Ciphers", tier: "relic", factionSlug: "oracular-circuit", unlockCondition: "Complete C1PH3R chain", visualConcept: "Dead Index lock halo", assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-dead-index-adept.png", flavorText: "The static signed back." },
  { slug: "dead-drop-initiate", name: "Dead Drop Initiate", category: "Dead Drops", tier: "initiate", factionSlug: "chthonic-uprising", unlockCondition: "Complete first Dead Drop", visualConcept: "Black cache icon", assetPath: "/badge-assets/dead-drops/dead-drop-initiate.png", flavorText: "They found the cache under the ordinary world." },
  { slug: "signal-cache-recovered", name: "Signal Cache Recovered", category: "Dead Drops", tier: "regular", factionSlug: "chthonic-uprising", unlockCondition: "Complete three Dead Drops", visualConcept: "Cache with signal sparks", assetPath: "/badge-assets/dead-drops/signal-cache-recovered.png", flavorText: "Static became supplies." },
  { slug: "drop-runner", name: "Drop Runner", category: "Dead Drops", tier: "regular", factionSlug: "chthonic-uprising", unlockCondition: "Complete five Dead Drops", visualConcept: "Courier satchel", assetPath: "/badge-assets/dead-drops/drop-runner.png", flavorText: "They never ran alone." },
  { slug: "town-square-arrival", name: "Town Square Arrival", category: "Rooms", tier: "initiate", factionSlug: "chthonic-uprising", unlockCondition: "Enter Town Square", visualConcept: "Terminal plaza cursor", assetPath: "/badge-assets/rooms/town-square-arrival.png", flavorText: "The plaza was never a place." },
  { slug: "first-field-note", name: "First Field Note", category: "Rooms", tier: "initiate", factionSlug: "chthonic-uprising", unlockCondition: "Post first safe field note", visualConcept: "Note pinned to old BBS", assetPath: "/badge-assets/rooms/first-field-note.png", flavorText: "The field heard you." },
  { slug: "archive-terminal-reader", name: "Archive Terminal Reader", category: "Archive", tier: "initiate", factionSlug: "archive", unlockCondition: "Read first archive item", visualConcept: "Green terminal page", assetPath: "/badge-assets/archive/archive-terminal-reader.png", flavorText: "Memory booted." },
  { slug: "ghost-in-tech-runner", name: "Ghost in Tech Runner", category: "Archive", tier: "adept", factionSlug: "daedalus-foundry", unlockCondition: "Submit approved safe repo summary", visualConcept: "Ghost in circuit shell", assetPath: "/badge-assets/archive/ghost-in-tech-runner.png", flavorText: "Some machines still wanted to help." },
  { slug: "black-clinic-visitor", name: "Black Clinic Visitor", category: "Factions", tier: "initiate", factionSlug: "asclepian-veil", unlockCondition: "Visit Black Clinic floor", visualConcept: "Veil curtain and pulse", assetPath: "/badge-assets/factions/black-clinic-visitor.png", flavorText: "Care had a door." },
  { slug: "community-builder", name: "Community Builder", category: "Community", tier: "regular", factionSlug: "community", unlockCondition: "Approved prompt contribution", visualConcept: "Hammer and speech bubble", assetPath: "/badge-assets/community/community-builder.png", flavorText: "They gave the commons a question." },
  { slug: "thread-tender-badge", name: "Thread Tender", category: "Community", tier: "regular", factionSlug: "community", unlockCondition: "Moderator recognition", visualConcept: "Lantern over thread line", assetPath: "/badge-assets/community/thread-tender-badge.png", flavorText: "They tended the little lights." },
  { slug: "net-neighbor-scout", name: "Net Neighbor Scout", category: "Community", tier: "regular", factionSlug: "community", unlockCondition: "Approved Net Neighbor submission", visualConcept: "Lantern pin on web ring", assetPath: "/badge-assets/community/net-neighbor-scout.png", flavorText: "A neighbor signal found the ring." },
  { slug: "accessibility-scribe", name: "Accessibility Scribe", category: "Community", tier: "steward", factionSlug: "asclepian-veil", unlockCondition: "Approved accessibility note", visualConcept: "Ramp-shaped quill and gate", assetPath: "/badge-assets/community/accessibility-scribe.png", flavorText: "They widened the passage." },
  { slug: "documentation-lantern", name: "Documentation Lantern", category: "Forge", tier: "regular", factionSlug: "daedalus-foundry", unlockCondition: "Approved documentation or bug report", visualConcept: "Manual page with lantern", assetPath: "/badge-assets/forge/documentation-lantern.png", flavorText: "The map survived the hole." },
  { slug: "badge-smith", name: "Badge Smith", category: "Forge", tier: "regular", factionSlug: "daedalus-foundry", unlockCondition: "Approved badge concept", visualConcept: "Badge mold and sparks", assetPath: "/badge-assets/forge/badge-smith.png", flavorText: "They forged recognition without vanity." },
  { slug: "avatar-forge-spark", name: "Avatar Forge Spark", category: "Forge", tier: "regular", factionSlug: "daedalus-foundry", unlockCondition: "Approved avatar concept", visualConcept: "Avatar silhouette with spark", assetPath: "/badge-assets/forge/avatar-forge-spark.png", flavorText: "A ghost got dressed for rebellion." },
  { slug: "mission-scribe", name: "Mission Scribe", category: "Missions", tier: "regular", factionSlug: "chthonic-uprising", unlockCondition: "Approved mission flavor copy", visualConcept: "Field log card and pomegranate", assetPath: "/badge-assets/missions/mission-scribe.png", flavorText: "They wrote the work into memory." },
  { slug: "field-debrief-scribe", name: "Field Debrief Scribe", category: "Missions", tier: "regular", factionSlug: "chthonic-uprising", unlockCondition: "Approved field log set", visualConcept: "Debrief paperclip", assetPath: "/badge-assets/missions/field-debrief-scribe.png", flavorText: "No lesson died in the field." },
  { slug: "guild-founder", name: "Guild Founder", category: "Guilds", tier: "initiate", factionSlug: "guilds", unlockCondition: "Found approved guild", visualConcept: "Guild banner seed", assetPath: "/badge-assets/guilds/guild-founder.png", flavorText: "A room became a cell." },
  { slug: "guild-steward", name: "Guild Steward", category: "Guilds", tier: "steward", factionSlug: "guilds", unlockCondition: "Host approved guild activity", visualConcept: "Steward key and banner", assetPath: "/badge-assets/guilds/guild-steward.png", flavorText: "They held the room open." },
  { slug: "dead-index-witness", name: "Dead Index Witness", category: "Recognition", tier: "relic", factionSlug: "chthonic-uprising", unlockCondition: "Owner grant", visualConcept: "Dead Index eye in pomegranate", assetPath: "/badge-assets/recognition/dead-index-witness.png", flavorText: "The ledger opened one eye." },
  { slug: "chthonic-signal", name: "Chthonic Signal", category: "Recognition", tier: "mythic", factionSlug: "chthonic-uprising", unlockCondition: "Owner spotlight", visualConcept: "Five-cell signal flare", assetPath: "/badge-assets/recognition/chthonic-signal.png", flavorText: "The underworld heard it together." },
];

// --- REWARD_LOOT ---

export const REWARD_LOOT: RewardLootSeed[] = [
  { slug: "static-courier-title-loot", name: "Static Courier", type: "title", rarity: "common", category: "Dead Drops", unlockCondition: "Complete first Dead Drop", displayLocation: "Character Dossier", assetPath: "/relic-assets/dead-drops/static-courier-title-loot.png", flavorText: "A name for those who cross the static.", sourceLoopSlug: "dead-drop-terminal" },
  { slug: "cracked-cache-key", name: "Cracked Cache Key", type: "relic", rarity: "uncommon", category: "Dead Drops", unlockCondition: "Complete three Dead Drops", displayLocation: "Relic Zone", assetPath: "/relic-assets/dead-drops/cracked-cache-key.png", flavorText: "It opens nothing. That is why it works.", sourceLoopSlug: "dead-drop-terminal" },
  { slug: "dead-drop-terminal-frame", name: "Dead Drop Terminal Frame", type: "profile_cosmetic", rarity: "uncommon", category: "Dead Drops", unlockCondition: "Complete Dead Drop intro", displayLocation: "Profile World", assetPath: "/relic-assets/dead-drops/dead-drop-terminal-frame.png", flavorText: "A frame of black cache glass.", sourceLoopSlug: "dead-drop-terminal" },
  { slug: "cache-mark", name: "Cache Mark", type: "badge", rarity: "common", category: "Dead Drops", unlockCondition: "Read recovered drop", displayLocation: "Badge Case", assetPath: "/relic-assets/dead-drops/cache-mark.png", flavorText: "A scratch only couriers notice.", sourceLoopSlug: "dead-drop-terminal" },
  { slug: "the-first-dead-index", name: "The First Dead Index", type: "lore_fragment", rarity: "rare", category: "Lore", unlockCondition: "Complete Dead Index starter drop", displayLocation: "Archive", assetPath: "/relic-assets/lore/the-first-dead-index.png", flavorText: "The first page was a missing person.", sourceLoopSlug: "archive-terminal" },
  { slug: "bent-oracle-key", name: "Bent Oracle Key", type: "relic", rarity: "uncommon", category: "Ciphers", unlockCondition: "Solve first relay cipher", displayLocation: "Relic Zone", assetPath: "/relic-assets/ciphers/bent-oracle-key.png", flavorText: "The oracle bent before the lock did.", sourceLoopSlug: "oracular-relay" },
  { slug: "violet-relay-border", name: "Violet Relay Border", type: "profile_cosmetic", rarity: "uncommon", category: "Ciphers", unlockCondition: "Solve three relay ciphers", displayLocation: "Profile World", assetPath: "/relic-assets/ciphers/violet-relay-border.png", flavorText: "A little static around the edges.", sourceLoopSlug: "oracular-relay" },
  { slug: "signal-reader-title-loot", name: "Signal Reader", type: "title", rarity: "common", category: "Ciphers", unlockCondition: "Solve first cipher", displayLocation: "Character Dossier", assetPath: "/relic-assets/ciphers/signal-reader-title-loot.png", flavorText: "They did not mistake noise for fate.", sourceLoopSlug: "oracular-relay" },
  { slug: "cipher-glyph-ring", name: "Cipher Glyph Ring", type: "avatar_item", rarity: "uncommon", category: "Ciphers", unlockCondition: "Earn Cipher Lantern", displayLocation: "Avatar Builder", assetPath: "/relic-assets/ciphers/cipher-glyph-ring.png", flavorText: "A tiny ring of harmless impossible letters.", sourceLoopSlug: "oracular-relay" },
  { slug: "archive-witness-tab", name: "Archive Witness Tab", type: "avatar_item", rarity: "common", category: "Archive", unlockCondition: "Read first archive item", displayLocation: "Avatar Builder", assetPath: "/relic-assets/archive/archive-witness-tab.png", flavorText: "A tab for the page that would not stay buried.", sourceLoopSlug: "archive-terminal" },
  { slug: "bone-index-tab", name: "Bone Index Tab", type: "relic", rarity: "uncommon", category: "Archive", unlockCondition: "Approved lore or archive contribution", displayLocation: "Relic Zone", assetPath: "/relic-assets/archive/bone-index-tab.png", flavorText: "The index card feels warmer than bone should.", sourceLoopSlug: "archive-terminal" },
  { slug: "archive-terminal-background", name: "Archive Terminal Background", type: "profile_cosmetic", rarity: "uncommon", category: "Archive", unlockCondition: "Read five archive items", displayLocation: "Profile World", assetPath: "/relic-assets/archive/archive-terminal-background.png", flavorText: "Shelves, cursor glow, and a memory that bites.", sourceLoopSlug: "archive-terminal" },
  { slug: "repo-relic-mark", name: "Repo Relic Mark", type: "badge", rarity: "common", category: "Ghost in Tech", unlockCondition: "Read Ghost in Tech item", displayLocation: "Badge Case", assetPath: "/relic-assets/ghost-in-tech/repo-relic-mark.png", flavorText: "Some code is a public lantern.", sourceLoopSlug: "archive-terminal" },
  { slug: "ghost-in-tech-repo-chip", name: "Ghost in Tech Repo Chip", type: "avatar_item", rarity: "uncommon", category: "Ghost in Tech", unlockCondition: "Submit approved repo summary", displayLocation: "Avatar Builder", assetPath: "/relic-assets/ghost-in-tech/ghost-in-tech-repo-chip.png", flavorText: "A chip with a ghost-shaped checksum.", sourceLoopSlug: "archive-terminal" },
  { slug: "town-square-terminal-frame", name: "Town Square Terminal Frame", type: "profile_cosmetic", rarity: "common", category: "Rooms", unlockCondition: "Visit Town Square", displayLocation: "Profile World", assetPath: "/relic-assets/rooms/town-square-terminal-frame.png", flavorText: "The square was never square, but it had corners for you.", sourceLoopSlug: "underwatch-town-square" },
  { slug: "signal-board-patch", name: "Signal Board Patch", type: "avatar_item", rarity: "common", category: "Rooms", unlockCondition: "Read Signal Board", displayLocation: "Avatar Builder", assetPath: "/relic-assets/rooms/signal-board-patch.png", flavorText: "A patch for those who checked the board.", sourceLoopSlug: "underwatch-town-square" },
  { slug: "commons-spark-loot", name: "Commons Spark", type: "relic", rarity: "uncommon", category: "Community", unlockCondition: "Complete first community contribution", displayLocation: "Relic Zone", assetPath: "/relic-assets/community/commons-spark-loot.png", flavorText: "A small fire under the floorboards.", sourceLoopSlug: "underwatch-town-square" },
  { slug: "pomegranate-gate-pass", name: "Pomegranate Gate Pass", type: "room_access", rarity: "common", category: "Rooms", unlockCondition: "Complete first field log", displayLocation: "Field Log", assetPath: "/relic-assets/rooms/pomegranate-gate-pass.png", flavorText: "The gate printed your name in disappearing ink.", sourceLoopSlug: "underwatch-town-square" },
  { slug: "black-clinic-curtain", name: "Black Clinic Curtain", type: "profile_cosmetic", rarity: "uncommon", category: "Factions", unlockCondition: "Complete Veil intro", displayLocation: "Profile World", assetPath: "/relic-assets/factions/black-clinic-curtain.png", flavorText: "Privacy hangs softer than armor.", sourceLoopSlug: "faction-floors" },
  { slug: "veil-clinic-patch", name: "Veil Clinic Patch", type: "avatar_item", rarity: "common", category: "Factions", unlockCondition: "Complete Asclepian mission", displayLocation: "Avatar Builder", assetPath: "/relic-assets/factions/veil-clinic-patch.png", flavorText: "Care, stitched in green.", sourceLoopSlug: "faction-floors" },
  { slug: "care-signal-card", name: "Care Signal Card", type: "relic", rarity: "uncommon", category: "Factions", unlockCondition: "Approved care prompt", displayLocation: "Relic Zone", assetPath: "/relic-assets/factions/care-signal-card.png", flavorText: "Not advice. A reminder that nobody heals alone.", sourceLoopSlug: "faction-floors" },
  { slug: "oracle-headset", name: "Oracle Headset", type: "avatar_item", rarity: "uncommon", category: "Factions", unlockCondition: "Complete Oracle Hygiene Check", displayLocation: "Avatar Builder", assetPath: "/relic-assets/factions/oracle-headset.png", flavorText: "It only hears fictional prophecy. Mostly.", sourceLoopSlug: "faction-floors" },
  { slug: "cerberus-gate-stamp", name: "Cerberus Gate Stamp", type: "avatar_item", rarity: "common", category: "Factions", unlockCondition: "Complete Gatewatch mission", displayLocation: "Avatar Builder", assetPath: "/relic-assets/factions/cerberus-gate-stamp.png", flavorText: "Three heads. One accessible entrance.", sourceLoopSlug: "faction-floors" },
  { slug: "route-witness-map", name: "Route Witness Map", type: "relic", rarity: "uncommon", category: "Accessibility", unlockCondition: "Approved route note", displayLocation: "Relic Zone", assetPath: "/relic-assets/accessibility/route-witness-map.png", flavorText: "The path became real when someone named the barrier.", sourceLoopSlug: "faction-floors" },
  { slug: "foundry-spark-charm", name: "Foundry Spark Charm", type: "avatar_item", rarity: "common", category: "Forge", unlockCondition: "Complete Foundry mission or QA task", displayLocation: "Avatar Builder", assetPath: "/relic-assets/forge/foundry-spark-charm.png", flavorText: "A small orange spark that refuses to become a cage.", sourceLoopSlug: "faction-floors" },
  { slug: "forge-toolkit", name: "Forge Toolkit", type: "avatar_item", rarity: "uncommon", category: "Forge", unlockCondition: "Approved bug or docs report", displayLocation: "Avatar Builder", assetPath: "/relic-assets/forge/forge-toolkit.png", flavorText: "Fictional props and tech gear for repair rituals.", sourceLoopSlug: "faction-floors" },
  { slug: "rat-sticker-pack", name: "Rat Sticker Pack", type: "avatar_item", rarity: "common", category: "Styx Rats", unlockCondition: "Complete Rat Nest prompt", displayLocation: "Avatar Builder", assetPath: "/relic-assets/styx-rats/rat-sticker-pack.png", flavorText: "Small insults to large gods.", sourceLoopSlug: "faction-floors" },
  { slug: "zine-packet", name: "Zine Packet", type: "avatar_item", rarity: "uncommon", category: "Styx Rats", unlockCondition: "Approved zine line", displayLocation: "Avatar Builder", assetPath: "/relic-assets/styx-rats/zine-packet.png", flavorText: "Folded paper. Unfolded morale.", sourceLoopSlug: "faction-floors" },
  { slug: "rat-nest-wall", name: "Rat Nest Wall", type: "profile_cosmetic", rarity: "uncommon", category: "Styx Rats", unlockCondition: "Complete Morale Signal Drop", displayLocation: "Profile World", assetPath: "/relic-assets/styx-rats/rat-nest-wall.png", flavorText: "A wall that never learned obedience.", sourceLoopSlug: "faction-floors" },
  { slug: "dead-index-badge-chain", name: "Dead Index Badge Chain", type: "avatar_item", rarity: "relic", category: "Recognition", unlockCondition: "Owner grant", displayLocation: "Avatar Builder", assetPath: "/relic-assets/recognition/dead-index-badge-chain.png", flavorText: "A chain of names that refused deletion.", sourceLoopSlug: "archive-terminal" },
  { slug: "black-cache-sticker", name: "Black Cache Sticker", type: "avatar_item", rarity: "common", category: "Dead Drops", unlockCondition: "Complete beginner Dead Drop", displayLocation: "Avatar Builder", assetPath: "/relic-assets/dead-drops/black-cache-sticker.png", flavorText: "Stick it somewhere the algorithm hates looking.", sourceLoopSlug: "dead-drop-terminal" },
  { slug: "net-neighbor-lantern-pin", name: "Net Neighbor Lantern Pin", type: "avatar_item", rarity: "uncommon", category: "Net Neighbors", unlockCondition: "Approved Net Neighbor", displayLocation: "Avatar Builder", assetPath: "/relic-assets/net-neighbors/net-neighbor-lantern-pin.png", flavorText: "A porch light for the old web.", sourceLoopSlug: "underwatch-town-square" },
  { slug: "accessibility-scribe-ribbon", name: "Accessibility Scribe Ribbon", type: "avatar_item", rarity: "uncommon", category: "Accessibility", unlockCondition: "Approved accessibility note", displayLocation: "Avatar Builder", assetPath: "/relic-assets/accessibility/accessibility-scribe-ribbon.png", flavorText: "A ribbon for widening the door.", sourceLoopSlug: "underwatch-town-square" },
  { slug: "forum-lantern-flair", name: "Forum Lantern Flair", type: "forum_flair", rarity: "common", category: "Community", unlockCondition: "Helpful forum participation", displayLocation: "Forum Flair", assetPath: "/relic-assets/community/forum-lantern-flair.png", flavorText: "A little light beside the username.", sourceLoopSlug: "underwatch-town-square" },
  { slug: "static-player-skin", name: "Static Player Skin", type: "signal_player_unlock", rarity: "uncommon", category: "Signal Player", unlockCondition: "Approved Signal Player theme", displayLocation: "Signal Player", assetPath: "/relic-assets/signal-player/static-player-skin.png", flavorText: "Music from behind the wall.", sourceLoopSlug: "underwatch-town-square" },
  { slug: "relic-shelf-starter", name: "Relic Shelf Starter", type: "relic_zone_module", rarity: "common", category: "Relic Zone", unlockCondition: "Earn first relic", displayLocation: "Relic Zone", assetPath: "/relic-assets/relic-zone/relic-shelf-starter.png", flavorText: "One shelf. One proof you were here.", sourceLoopSlug: "underwatch-town-square" },
];

// --- AVATAR_UNLOCK_ASSETS ---

export const AVATAR_UNLOCK_ASSETS: AvatarUnlockAssetSeed[] = [
  { slug: "pomegranate-terminal-pin", name: "Pomegranate Terminal Pin", category: "accessories", rarity: "common", factionAffinity: "chthonic-uprising", unlockSource: "Town Square arrival", assetPath: "public/avatar-assets/accessories/pomegranate-terminal-pin.png", layerOrder: 60, visualDescription: "Small pomegranate seed pin with terminal cursor glow." },
  { slug: "black-cache-sticker", name: "Black Cache Sticker", category: "accessories", rarity: "common", factionAffinity: "chthonic-uprising", unlockSource: "Beginner Dead Drop", assetPath: "public/avatar-assets/accessories/black-cache-sticker.png", layerOrder: 62, visualDescription: "Matte black sticker with cache slash mark." },
  { slug: "oracle-headset", name: "Oracle Headset", category: "tech_gear", rarity: "uncommon", factionAffinity: "oracular-circuit", unlockSource: "Oracle Hygiene Check", assetPath: "public/avatar-assets/tech-gear/oracle-headset.png", layerOrder: 70, visualDescription: "Violet/cyan headset with harmless relay glyphs." },
  { slug: "broken-delphi-sticker", name: "Broken Delphi Sticker", category: "accessories", rarity: "common", factionAffinity: "oracular-circuit", unlockSource: "Oracular Static read", assetPath: "public/avatar-assets/accessories/broken-delphi-sticker.png", layerOrder: 61, visualDescription: "Cracked tripod sticker with static halo." },
  { slug: "rat-sticker-pack", name: "Rat Sticker Pack", category: "accessories", rarity: "common", factionAffinity: "styx-rats", unlockSource: "Rat Nest prompt", assetPath: "public/avatar-assets/accessories/rat-sticker-pack.png", layerOrder: 63, visualDescription: "Layered punk stickers and tiny rat skulls." },
  { slug: "veil-clinic-patch", name: "Veil Clinic Patch", category: "faction_flair", rarity: "common", factionAffinity: "asclepian-veil", unlockSource: "Black Clinic Readiness", assetPath: "public/avatar-assets/faction-flair/veil-clinic-patch.png", layerOrder: 64, visualDescription: "Green clinic patch with privacy veil." },
  { slug: "cerberus-gate-stamp", name: "Cerberus Gate Stamp", category: "faction_flair", rarity: "common", factionAffinity: "myrmidon-grinders", unlockSource: "Gatewatch Readiness Map", assetPath: "public/avatar-assets/faction-flair/cerberus-gate-stamp.png", layerOrder: 64, visualDescription: "Bronze stamp with three-headed gate icon." },
  { slug: "foundry-spark-charm", name: "Foundry Spark Charm", category: "accessories", rarity: "common", factionAffinity: "daedalus-foundry", unlockSource: "Labyrinth Repair Log", assetPath: "public/avatar-assets/accessories/foundry-spark-charm.png", layerOrder: 65, visualDescription: "Tiny orange spark charm on brass loop." },
  { slug: "archive-witness-tab", name: "Archive Witness Tab", category: "accessories", rarity: "common", factionAffinity: "archive", unlockSource: "Read Archive Terminal", assetPath: "public/avatar-assets/accessories/archive-witness-tab.png", layerOrder: 60, visualDescription: "Paper index tab clipped to avatar layer." },
  { slug: "ghost-in-tech-repo-chip", name: "Ghost in Tech Repo Chip", category: "tech_gear", rarity: "uncommon", factionAffinity: "daedalus-foundry", unlockSource: "Approved repo relic", assetPath: "public/avatar-assets/tech-gear/ghost-in-tech-repo-chip.png", layerOrder: 66, visualDescription: "Circuit chip with ghost-shaped trace." },
  { slug: "net-neighbor-lantern-pin", name: "Net Neighbor Lantern Pin", category: "accessories", rarity: "uncommon", factionAffinity: "community", unlockSource: "Approved Net Neighbor", assetPath: "public/avatar-assets/accessories/net-neighbor-lantern-pin.png", layerOrder: 62, visualDescription: "Little porch lantern icon in old-web colors." },
  { slug: "accessibility-scribe-ribbon", name: "Accessibility Scribe Ribbon", category: "accessories", rarity: "uncommon", factionAffinity: "asclepian-veil", unlockSource: "Approved accessibility note", assetPath: "public/avatar-assets/accessories/accessibility-scribe-ribbon.png", layerOrder: 61, visualDescription: "Soft ribbon with gate and quill motif." },
  { slug: "cipher-glyph-ring", name: "Cipher Glyph Ring", category: "accessories", rarity: "uncommon", factionAffinity: "oracular-circuit", unlockSource: "Cipher Lantern", assetPath: "public/avatar-assets/accessories/cipher-glyph-ring.png", layerOrder: 58, visualDescription: "Ring of fictional glyphs, small and non-harmful." },
  { slug: "static-courier-satchel", name: "Static Courier Satchel", category: "back_items", rarity: "rare", factionAffinity: "chthonic-uprising", unlockSource: "Complete five Dead Drops", assetPath: "public/avatar-assets/back-items/static-courier-satchel.png", layerOrder: 40, visualDescription: "Crossbody satchel with dead-drop receipts." },
  { slug: "dead-index-badge-chain", name: "Dead Index Badge Chain", category: "accessories", rarity: "relic", factionAffinity: "chthonic-uprising", unlockSource: "Owner grant", assetPath: "public/avatar-assets/accessories/dead-index-badge-chain.png", layerOrder: 67, visualDescription: "Chain of small index tags and pomegranate seed." },
  { slug: "signal-board-patch", name: "Signal Board Patch", category: "faction_flair", rarity: "common", factionAffinity: "chthonic-uprising", unlockSource: "Read Signal Board", assetPath: "public/avatar-assets/faction-flair/signal-board-patch.png", layerOrder: 64, visualDescription: "Patch showing blinking signal board." },
  { slug: "bone-index-earring", name: "Bone Index Earring", category: "accessories", rarity: "uncommon", factionAffinity: "archive", unlockSource: "Character Canon contribution", assetPath: "public/avatar-assets/accessories/bone-index-earring.png", layerOrder: 59, visualDescription: "Tiny bone-white index card earring." },
  { slug: "underwatch-pass-lanyard", name: "Underwatch Pass Lanyard", category: "accessories", rarity: "common", factionAffinity: "chthonic-uprising", unlockSource: "Room intro chain", assetPath: "public/avatar-assets/accessories/underwatch-pass-lanyard.png", layerOrder: 68, visualDescription: "Lanyard with disappearing underworld pass." },
  { slug: "zine-spark-button", name: "Zine Spark Button", category: "accessories", rarity: "common", factionAffinity: "styx-rats", unlockSource: "Approved zine line", assetPath: "public/avatar-assets/accessories/zine-spark-button.png", layerOrder: 62, visualDescription: "Punk button with spark burst text." },
  { slug: "commons-builder-patch", name: "Commons Builder Patch", category: "faction_flair", rarity: "uncommon", factionAffinity: "community", unlockSource: "Community Builder approved", assetPath: "public/avatar-assets/faction-flair/commons-builder-patch.png", layerOrder: 64, visualDescription: "Patch of bench, spark, and terminal cursor." },
  { slug: "cracked-cache-key", name: "Cracked Cache Key", category: "fictional_props", rarity: "uncommon", factionAffinity: "chthonic-uprising", unlockSource: "Signal Cache Recovered", assetPath: "public/avatar-assets/fictional-props/cracked-cache-key.png", layerOrder: 80, visualDescription: "Decorative cracked key, not functional." },
  { slug: "bent-oracle-key", name: "Bent Oracle Key", category: "fictional_props", rarity: "uncommon", factionAffinity: "oracular-circuit", unlockSource: "Solve relay cipher", assetPath: "public/avatar-assets/fictional-props/bent-oracle-key.png", layerOrder: 80, visualDescription: "Bent key with violet signal thread." },
  { slug: "mini-archive-shelf", name: "Mini Archive Shelf", category: "fictional_props", rarity: "uncommon", factionAffinity: "archive", unlockSource: "Archive Witness", assetPath: "public/avatar-assets/fictional-props/mini-archive-shelf.png", layerOrder: 82, visualDescription: "Tiny floating shelf with safe relic tabs." },
  { slug: "signal-scanner-charm", name: "Signal Scanner Charm", category: "tech_gear", rarity: "uncommon", factionAffinity: "oracular-circuit", unlockSource: "Solve five ciphers", assetPath: "public/avatar-assets/tech-gear/signal-scanner-charm.png", layerOrder: 72, visualDescription: "Decorative scanner charm for fictional signals." },
  { slug: "relic-tablet", name: "Relic Tablet", category: "fictional_props", rarity: "rare", factionAffinity: "archive", unlockSource: "Tier 3 lore approved", assetPath: "public/avatar-assets/fictional-props/relic-tablet.png", layerOrder: 81, visualDescription: "Small tablet etched with harmless lore glyphs." },
  { slug: "dead-drop-receipt", name: "Dead Drop Receipt", category: "fictional_props", rarity: "common", factionAffinity: "chthonic-uprising", unlockSource: "Dead Drop QA or completion", assetPath: "public/avatar-assets/fictional-props/dead-drop-receipt.png", layerOrder: 83, visualDescription: "Long receipt reading paid in attention." },
  { slug: "forge-toolkit", name: "Forge Toolkit", category: "fictional_props", rarity: "uncommon", factionAffinity: "daedalus-foundry", unlockSource: "Approved bug/documentation report", assetPath: "public/avatar-assets/fictional-props/forge-toolkit.png", layerOrder: 84, visualDescription: "Soft-sided fictional toolkit with orange tags." },
  { slug: "zine-packet", name: "Zine Packet", category: "fictional_props", rarity: "uncommon", factionAffinity: "styx-rats", unlockSource: "Approved zine contribution", assetPath: "public/avatar-assets/fictional-props/zine-packet.png", layerOrder: 83, visualDescription: "Folded zine packet with neon staples." },
  { slug: "privacy-relay-token", name: "Privacy Relay Token", category: "tech_gear", rarity: "uncommon", factionAffinity: "oracular-circuit", unlockSource: "Privacy literacy prompt", assetPath: "public/avatar-assets/tech-gear/privacy-relay-token.png", layerOrder: 72, visualDescription: "Small token with shielded signal mark." },
  { slug: "archive-terminal-card", name: "Archive Terminal Card", category: "tech_gear", rarity: "common", factionAffinity: "archive", unlockSource: "Archive Terminal intro", assetPath: "public/avatar-assets/tech-gear/archive-terminal-card.png", layerOrder: 71, visualDescription: "Plastic terminal card with bone-white stripe." },
  { slug: "archive-terminal-background", name: "Archive Terminal Background", category: "backgrounds", rarity: "uncommon", factionAffinity: "archive", unlockSource: "Read five archive items", assetPath: "public/avatar-assets/backgrounds/archive-terminal-background.png", layerOrder: 10, visualDescription: "Archive shelves and green terminal glow." },
  { slug: "dead-drop-terminal-frame-avatar", name: "Dead Drop Terminal Frame", category: "backgrounds", rarity: "uncommon", factionAffinity: "chthonic-uprising", unlockSource: "Complete Dead Drop intro", assetPath: "public/avatar-assets/backgrounds/dead-drop-terminal-frame.png", layerOrder: 12, visualDescription: "Terminal border with black cache corners." },
  { slug: "violet-relay-border-avatar", name: "Violet Relay Border", category: "effects", rarity: "uncommon", factionAffinity: "oracular-circuit", unlockSource: "Solve three ciphers", assetPath: "public/avatar-assets/effects/violet-relay-border.png", layerOrder: 95, visualDescription: "Subtle violet static border." },
  { slug: "faction-floor-backdrop-avatar", name: "Faction Floor Backdrop", category: "backgrounds", rarity: "uncommon", factionAffinity: "chthonic-uprising", unlockSource: "Visit all faction floors", assetPath: "public/avatar-assets/backgrounds/faction-floor-backdrop.png", layerOrder: 10, visualDescription: "Five faction doors in an underworld hall." },
  { slug: "rat-nest-wall-avatar", name: "Rat Nest Wall", category: "backgrounds", rarity: "uncommon", factionAffinity: "styx-rats", unlockSource: "Complete Morale Signal Drop", assetPath: "public/avatar-assets/backgrounds/rat-nest-wall.png", layerOrder: 10, visualDescription: "Sticker-bombed wall with safe graffiti." },
  { slug: "black-clinic-curtain-avatar", name: "Black Clinic Curtain", category: "backgrounds", rarity: "uncommon", factionAffinity: "asclepian-veil", unlockSource: "Complete Veil care prompt", assetPath: "public/avatar-assets/backgrounds/black-clinic-curtain.png", layerOrder: 10, visualDescription: "Soft black clinic curtain with green glow." },
  { slug: "foundry-bench-glow-avatar", name: "Foundry Bench Glow", category: "backgrounds", rarity: "uncommon", factionAffinity: "daedalus-foundry", unlockSource: "Complete repair log", assetPath: "public/avatar-assets/backgrounds/foundry-bench-glow.png", layerOrder: 10, visualDescription: "Warm workbench glow and schematic shadows." },
  { slug: "town-square-terminal-frame-avatar", name: "Town Square Terminal Frame", category: "backgrounds", rarity: "common", factionAffinity: "chthonic-uprising", unlockSource: "Enter Town Square", assetPath: "public/avatar-assets/backgrounds/town-square-terminal-frame.png", layerOrder: 11, visualDescription: "Old BBS plaza frame." },
  { slug: "lantern-thread-pin", name: "Lantern Thread Pin", category: "accessories", rarity: "common", factionAffinity: "community", unlockSource: "Welcome thread contribution", assetPath: "public/avatar-assets/accessories/lantern-thread-pin.png", layerOrder: 62, visualDescription: "Small lantern with thread line." },
  { slug: "guild-thread-charm", name: "Guild Thread Charm", category: "accessories", rarity: "uncommon", factionAffinity: "guilds", unlockSource: "Guild activity template approved", assetPath: "public/avatar-assets/accessories/guild-thread-charm.png", layerOrder: 63, visualDescription: "Charm made of tiny banner thread." },
  { slug: "field-log-tab", name: "Field Log Tab", category: "accessories", rarity: "common", factionAffinity: "missions", unlockSource: "Approved field log", assetPath: "public/avatar-assets/accessories/field-log-tab.png", layerOrder: 60, visualDescription: "Filed tab labeled LOG in pomegranate ink." },
  { slug: "route-witness-compass", name: "Route Witness Compass", category: "tech_gear", rarity: "uncommon", factionAffinity: "myrmidon-grinders", unlockSource: "Approved route/accessibility note", assetPath: "public/avatar-assets/tech-gear/route-witness-compass.png", layerOrder: 72, visualDescription: "Nonfunctional compass showing accessible paths." },
  { slug: "signal-player-earbud", name: "Signal Player Earbud", category: "tech_gear", rarity: "uncommon", factionAffinity: "signal-player", unlockSource: "Approved playlist theme", assetPath: "public/avatar-assets/tech-gear/signal-player-earbud.png", layerOrder: 70, visualDescription: "Single decorative earbud with static seed." },
];

// --- REWARD_MAPPINGS ---

export const REWARD_MAPPINGS: RewardMappingSeed[] = [
  // Mission: black-clinic-readiness
  { sourceType: "mission", sourceSlug: "black-clinic-readiness", rewardType: "badge", rewardSlug: "black-clinic-readiness", adminNotes: "Manual grant allowed if verified outside normal flow.", factionLeaderNotes: "Veil leaders may recommend care-prompt rewards; no medical authority grants." },
  { sourceType: "mission", sourceSlug: "black-clinic-readiness", rewardType: "title", rewardSlug: "black-clinic-visitor" },
  { sourceType: "mission", sourceSlug: "black-clinic-readiness", rewardType: "relic", rewardSlug: "care-signal-card" },
  { sourceType: "mission", sourceSlug: "black-clinic-readiness", rewardType: "avatar_unlock", rewardSlug: "veil-clinic-patch" },
  { sourceType: "mission", sourceSlug: "black-clinic-readiness", rewardType: "avatar_unlock", rewardSlug: "black-clinic-curtain-avatar" },
  { sourceType: "mission", sourceSlug: "black-clinic-readiness", rewardType: "avatar_unlock", rewardSlug: "accessibility-scribe-ribbon" },
  { sourceType: "mission", sourceSlug: "black-clinic-readiness", rewardType: "profile_cosmetic", rewardSlug: "black-clinic-curtain" },
  { sourceType: "mission", sourceSlug: "black-clinic-readiness", rewardType: "lore_unlock", rewardSlug: "privacy-is-medicine" },
  // Mission: oracle-hygiene-check
  { sourceType: "mission", sourceSlug: "oracle-hygiene-check", rewardType: "badge", rewardSlug: "oracle-hygiene-check", adminNotes: "Ensure privacy literacy, not real hacking.", factionLeaderNotes: "Circuit leaders may submit safe cipher missions for approval." },
  { sourceType: "mission", sourceSlug: "oracle-hygiene-check", rewardType: "title", rewardSlug: "signal-reader" },
  { sourceType: "mission", sourceSlug: "oracle-hygiene-check", rewardType: "avatar_unlock", rewardSlug: "oracle-headset" },
  { sourceType: "mission", sourceSlug: "oracle-hygiene-check", rewardType: "avatar_unlock", rewardSlug: "privacy-relay-token" },
  { sourceType: "mission", sourceSlug: "oracle-hygiene-check", rewardType: "avatar_unlock", rewardSlug: "broken-delphi-sticker" },
  { sourceType: "mission", sourceSlug: "oracle-hygiene-check", rewardType: "relic", rewardSlug: "bent-oracle-key" },
  { sourceType: "mission", sourceSlug: "oracle-hygiene-check", rewardType: "profile_cosmetic", rewardSlug: "violet-relay-border" },
  { sourceType: "mission", sourceSlug: "oracle-hygiene-check", rewardType: "lore_unlock", rewardSlug: "oracular-static" },
  // Mission: gatewatch-readiness-map
  { sourceType: "mission", sourceSlug: "gatewatch-readiness-map", rewardType: "badge", rewardSlug: "gatewatch-readiness-map", adminNotes: "Reject sensitive locations or unsafe tactical claims.", factionLeaderNotes: "Grinder leaders may recommend logistics/readiness rewards only." },
  { sourceType: "mission", sourceSlug: "gatewatch-readiness-map", rewardType: "title", rewardSlug: "gatehouse-runner" },
  { sourceType: "mission", sourceSlug: "gatewatch-readiness-map", rewardType: "relic", rewardSlug: "route-witness-map" },
  { sourceType: "mission", sourceSlug: "gatewatch-readiness-map", rewardType: "avatar_unlock", rewardSlug: "cerberus-gate-stamp" },
  { sourceType: "mission", sourceSlug: "gatewatch-readiness-map", rewardType: "avatar_unlock", rewardSlug: "route-witness-compass" },
  { sourceType: "mission", sourceSlug: "gatewatch-readiness-map", rewardType: "avatar_unlock", rewardSlug: "underwatch-pass-lanyard" },
  { sourceType: "mission", sourceSlug: "gatewatch-readiness-map", rewardType: "lore_unlock", rewardSlug: "a-gate-is-only-good-if-everyone-can-pass" },
  // Mission: labyrinth-repair-log
  { sourceType: "mission", sourceSlug: "labyrinth-repair-log", rewardType: "badge", rewardSlug: "labyrinth-repair-log", adminNotes: "Useful bug reports may receive Forge Credit.", factionLeaderNotes: "Foundry leaders may select repair/docs rewards from approved pool." },
  { sourceType: "mission", sourceSlug: "labyrinth-repair-log", rewardType: "title", rewardSlug: "forge-hand" },
  { sourceType: "mission", sourceSlug: "labyrinth-repair-log", rewardType: "avatar_unlock", rewardSlug: "foundry-spark-charm" },
  { sourceType: "mission", sourceSlug: "labyrinth-repair-log", rewardType: "avatar_unlock", rewardSlug: "forge-toolkit" },
  { sourceType: "mission", sourceSlug: "labyrinth-repair-log", rewardType: "avatar_unlock", rewardSlug: "foundry-bench-glow-avatar" },
  { sourceType: "mission", sourceSlug: "labyrinth-repair-log", rewardType: "lore_unlock", rewardSlug: "every-labyrinth-needs-maintenance" },
  // Mission: morale-signal-drop
  { sourceType: "mission", sourceSlug: "morale-signal-drop", rewardType: "badge", rewardSlug: "morale-signal-drop", adminNotes: "Review public zine/graffiti lines before display.", factionLeaderNotes: "Rat leaders may recommend art/morale rewards but not harassment." },
  { sourceType: "mission", sourceSlug: "morale-signal-drop", rewardType: "title", rewardSlug: "rat-nest-regular" },
  { sourceType: "mission", sourceSlug: "morale-signal-drop", rewardType: "avatar_unlock", rewardSlug: "rat-sticker-pack" },
  { sourceType: "mission", sourceSlug: "morale-signal-drop", rewardType: "avatar_unlock", rewardSlug: "zine-packet" },
  { sourceType: "mission", sourceSlug: "morale-signal-drop", rewardType: "avatar_unlock", rewardSlug: "rat-nest-wall-avatar" },
  { sourceType: "mission", sourceSlug: "morale-signal-drop", rewardType: "profile_cosmetic", rewardSlug: "rat-nest-wall" },
  { sourceType: "mission", sourceSlug: "morale-signal-drop", rewardType: "lore_unlock", rewardSlug: "joy-is-sabotage-but-care-is-the-wire" },
  // Dead drops (10+)
  { sourceType: "dead_drop", sourceSlug: "first-signal-board", rewardType: "badge", rewardSlug: "signal-board-reader" },
  { sourceType: "dead_drop", sourceSlug: "first-signal-board", rewardType: "avatar_unlock", rewardSlug: "signal-board-patch" },
  { sourceType: "dead_drop", sourceSlug: "first-signal-board", rewardType: "lore_unlock", rewardSlug: "the-board-blinks-back" },
  { sourceType: "dead_drop", sourceSlug: "leave-safe-field-note", rewardType: "badge", rewardSlug: "first-field-note", reviewRequired: true },
  { sourceType: "dead_drop", sourceSlug: "leave-safe-field-note", rewardType: "loot", rewardSlug: "pomegranate-gate-pass" },
  { sourceType: "dead_drop", sourceSlug: "leave-safe-field-note", rewardType: "avatar_unlock", rewardSlug: "pomegranate-terminal-pin" },
  { sourceType: "dead_drop", sourceSlug: "static-cache-001", rewardType: "badge", rewardSlug: "dead-drop-initiate" },
  { sourceType: "dead_drop", sourceSlug: "static-cache-001", rewardType: "avatar_unlock", rewardSlug: "black-cache-sticker" },
  { sourceType: "dead_drop", sourceSlug: "cracked-cache-key-drop", rewardType: "badge", rewardSlug: "signal-cache-recovered", reviewRequired: true },
  { sourceType: "dead_drop", sourceSlug: "cracked-cache-key-drop", rewardType: "relic", rewardSlug: "cracked-cache-key" },
  { sourceType: "dead_drop", sourceSlug: "cracked-cache-key-drop", rewardType: "avatar_unlock", rewardSlug: "cracked-cache-key" },
  { sourceType: "dead_drop", sourceSlug: "mini-cipher-static-seed", rewardType: "badge", rewardSlug: "c1ph3r-cr4k3r-initiate" },
  { sourceType: "dead_drop", sourceSlug: "mini-cipher-static-seed", rewardType: "avatar_unlock", rewardSlug: "cipher-glyph-ring" },
  { sourceType: "dead_drop", sourceSlug: "archive-artifact-bone-tab", rewardType: "badge", rewardSlug: "archive-terminal-reader" },
  { sourceType: "dead_drop", sourceSlug: "archive-artifact-bone-tab", rewardType: "avatar_unlock", rewardSlug: "bone-index-earring" },
  { sourceType: "dead_drop", sourceSlug: "relay-whisper-one", rewardType: "badge", rewardSlug: "oracular-relay-initiate" },
  { sourceType: "dead_drop", sourceSlug: "relay-whisper-one", rewardType: "avatar_unlock", rewardSlug: "oracle-headset" },
  { sourceType: "dead_drop", sourceSlug: "ghost-in-tech-repo-relic", rewardType: "badge", rewardSlug: "ghost-in-tech-runner", reviewRequired: true },
  { sourceType: "dead_drop", sourceSlug: "ghost-in-tech-repo-relic", rewardType: "avatar_unlock", rewardSlug: "ghost-in-tech-repo-chip" },
  { sourceType: "dead_drop", sourceSlug: "dead-index-trace-drop", rewardType: "badge", rewardSlug: "dead-index-trace", reviewRequired: true },
  { sourceType: "dead_drop", sourceSlug: "dead-index-trace-drop", rewardType: "avatar_unlock", rewardSlug: "dead-index-badge-chain" },
  // C1PH3R chain (5 stages)
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-initiate", rewardType: "badge", rewardSlug: "c1ph3r-cr4k3r-initiate", adminNotes: "Puzzle only." },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-initiate", rewardType: "avatar_unlock", rewardSlug: "cipher-glyph-ring" },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-initiate", rewardType: "lore_unlock", rewardSlug: "first-static-key" },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-signal-reader", rewardType: "badge", rewardSlug: "c1ph3r-cr4k3r-signal-reader", adminNotes: "Rate-limit attempts." },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-signal-reader", rewardType: "avatar_unlock", rewardSlug: "signal-scanner-charm" },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-signal-reader", rewardType: "profile_cosmetic", rewardSlug: "violet-relay-border" },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-index-scribe", rewardType: "badge", rewardSlug: "c1ph3r-cr4k3r-index-scribe" },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-index-scribe", rewardType: "avatar_unlock", rewardSlug: "archive-terminal-card" },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-oracle-key", rewardType: "badge", rewardSlug: "c1ph3r-cr4k3r-oracle-key", adminNotes: "Higher tier puzzle, still safe." },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-oracle-key", rewardType: "avatar_unlock", rewardSlug: "bent-oracle-key" },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-dead-index-adept", rewardType: "badge", rewardSlug: "c1ph3r-cr4k3r-dead-index-adept", adminNotes: "Relic-tier, no real hacking." },
  { sourceType: "cipher", sourceSlug: "c1ph3r-cr4k3r-dead-index-adept", rewardType: "avatar_unlock", rewardSlug: "dead-index-badge-chain" },
  // Guild mappings (5+)
  { sourceType: "guild", sourceSlug: "guild-founded-and-approved", rewardType: "badge", rewardSlug: "guild-founder", adminNotes: "Not for spam guilds." },
  { sourceType: "guild", sourceSlug: "guild-founded-and-approved", rewardType: "avatar_unlock", rewardSlug: "guild-thread-charm" },
  { sourceType: "guild", sourceSlug: "guild-hosts-approved-activity", rewardType: "badge", rewardSlug: "underwatch-host-badge", reviewRequired: true },
  { sourceType: "guild", sourceSlug: "guild-hosts-approved-activity", rewardType: "title", rewardSlug: "underwatch-host" },
  { sourceType: "guild", sourceSlug: "guild-completes-archive-project", rewardType: "badge", rewardSlug: "archive-credit", reviewRequired: true },
  { sourceType: "guild", sourceSlug: "guild-completes-archive-project", rewardType: "avatar_unlock", rewardSlug: "mini-archive-shelf" },
  { sourceType: "guild", sourceSlug: "guild-lore-approved-tier-2", rewardType: "badge", rewardSlug: "guild-lore-keeper", reviewRequired: true },
  { sourceType: "guild", sourceSlug: "guild-lore-approved-tier-2", rewardType: "avatar_unlock", rewardSlug: "bone-index-earring" },
  // Archive / Ghost in Tech (5+)
  { sourceType: "archive", sourceSlug: "read-first-archive-item", rewardType: "badge", rewardSlug: "archive-terminal-reader", adminNotes: "Anti-refresh cap." },
  { sourceType: "archive", sourceSlug: "read-first-archive-item", rewardType: "avatar_unlock", rewardSlug: "archive-witness-tab" },
  { sourceType: "archive", sourceSlug: "read-five-archive-items", rewardType: "badge", rewardSlug: "archive-witness" },
  { sourceType: "archive", sourceSlug: "read-five-archive-items", rewardType: "avatar_unlock", rewardSlug: "mini-archive-shelf" },
  { sourceType: "archive", sourceSlug: "read-five-archive-items", rewardType: "profile_cosmetic", rewardSlug: "archive-terminal-background" },
  { sourceType: "ghost_in_tech", sourceSlug: "browse-ghost-in-tech", rewardType: "badge", rewardSlug: "repo-relic-reader", adminNotes: "No harmful repos." },
  { sourceType: "ghost_in_tech", sourceSlug: "submit-approved-ghost-in-tech-repo", rewardType: "badge", rewardSlug: "ghost-in-tech-runner", reviewRequired: true, adminNotes: "Repo safety review required." },
  { sourceType: "ghost_in_tech", sourceSlug: "submit-approved-ghost-in-tech-repo", rewardType: "avatar_unlock", rewardSlug: "ghost-in-tech-repo-chip" },
  { sourceType: "archive", sourceSlug: "recover-dead-index-trace", rewardType: "badge", rewardSlug: "dead-index-trace", reviewRequired: true, adminNotes: "Owner/Admin review for canon." },
  { sourceType: "archive", sourceSlug: "recover-dead-index-trace", rewardType: "avatar_unlock", rewardSlug: "dead-index-badge-chain" },
];

// --- REWARD_POOLS ---

export const REWARD_POOLS: RewardPoolSeed[] = [
  {
    slug: "asclepian-veil",
    name: "Asclepian Veil Approved Pool",
    factionSlug: "asclepian-veil",
    poolType: "faction_mission",
    description: "Faction badges, care titles, Veil avatar assets, Veil cosmetics, and Veil lore.",
    adminNotes: "Requires Admin approval. Owner-only marks excluded.",
    items: [
      { rewardType: "badge", rewardSlug: "black-clinic-readiness" },
      { rewardType: "badge", rewardSlug: "accessibility-scribe" },
      { rewardType: "title", rewardSlug: "black-clinic-visitor" },
      { rewardType: "avatar_unlock", rewardSlug: "veil-clinic-patch" },
      { rewardType: "lore_unlock", rewardSlug: "privacy-is-medicine" },
    ],
  },
  {
    slug: "oracular-circuit",
    name: "Oracular Circuit Approved Pool",
    factionSlug: "oracular-circuit",
    poolType: "faction_mission",
    description: "Cipher badges, relay titles, Oracular avatar assets, relay cosmetics, and safe puzzle lore.",
    adminNotes: "Requires Admin approval. Owner-only marks excluded.",
    items: [
      { rewardType: "badge", rewardSlug: "oracle-hygiene-check" },
      { rewardType: "badge", rewardSlug: "c1ph3r-cr4k3r-initiate" },
      { rewardType: "title", rewardSlug: "signal-reader" },
      { rewardType: "avatar_unlock", rewardSlug: "oracle-headset" },
      { rewardType: "lore_unlock", rewardSlug: "oracular-static" },
    ],
  },
  {
    slug: "myrmidon-grinders",
    name: "Myrmidon Grinders Approved Pool",
    factionSlug: "myrmidon-grinders",
    poolType: "faction_mission",
    description: "Readiness badges, accessibility/logistics titles, Grinder avatar assets, and gatehouse cosmetics.",
    adminNotes: "Requires Admin approval. Owner-only marks excluded.",
    items: [
      { rewardType: "badge", rewardSlug: "gatewatch-readiness-map" },
      { rewardType: "badge", rewardSlug: "accessibility-scribe" },
      { rewardType: "title", rewardSlug: "gatehouse-runner" },
      { rewardType: "avatar_unlock", rewardSlug: "cerberus-gate-stamp" },
      { rewardType: "relic", rewardSlug: "route-witness-map" },
    ],
  },
  {
    slug: "daedalus-foundry",
    name: "Daedalus Foundry Approved Pool",
    factionSlug: "daedalus-foundry",
    poolType: "faction_mission",
    description: "Forge badges, repo relics, avatar assets, Foundry cosmetics, and documentation titles.",
    adminNotes: "Requires Admin approval. Owner-only marks excluded.",
    items: [
      { rewardType: "badge", rewardSlug: "labyrinth-repair-log" },
      { rewardType: "badge", rewardSlug: "ghost-in-tech-runner" },
      { rewardType: "title", rewardSlug: "forge-hand" },
      { rewardType: "avatar_unlock", rewardSlug: "foundry-spark-charm" },
      { rewardType: "avatar_unlock", rewardSlug: "forge-toolkit" },
    ],
  },
  {
    slug: "styx-rats",
    name: "Styx Rats Approved Pool",
    factionSlug: "styx-rats",
    poolType: "faction_mission",
    description: "Morale badges, zine titles, Rat avatar assets, banner cosmetics, and safe satire lore.",
    adminNotes: "Requires Admin approval. Owner-only marks excluded.",
    items: [
      { rewardType: "badge", rewardSlug: "morale-signal-drop" },
      { rewardType: "badge", rewardSlug: "rat-nest-regular" },
      { rewardType: "title", rewardSlug: "rat-nest-regular" },
      { rewardType: "avatar_unlock", rewardSlug: "rat-sticker-pack" },
      { rewardType: "profile_cosmetic", rewardSlug: "rat-nest-wall" },
    ],
  },
  {
    slug: "chthonic-uprising",
    name: "Chthonic Uprising Owner Pool",
    factionSlug: "chthonic-uprising",
    poolType: "faction_mission",
    description: "Alliance marks, Owner recognitions, World Canon, and mythic cosmetics.",
    adminNotes: "Owner only. Faction leaders cannot assign from this pool.",
    items: [
      { rewardType: "badge", rewardSlug: "chthonic-signal" },
      { rewardType: "badge", rewardSlug: "dead-index-witness" },
      { rewardType: "badge", rewardSlug: "chthonic-mark-witness" },
      { rewardType: "avatar_unlock", rewardSlug: "dead-index-badge-chain" },
      { rewardType: "title", rewardSlug: "chthonic-signal-title" },
    ],
  },
];
