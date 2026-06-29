import type {
  CanonTier,
  CommunitySubmissionType,
  ForumReactionType,
  VolunteerLane,
} from "@/generated/prisma/client";

export interface DefaultForumCategory {
  slug: string;
  name: string;
  description: string;
  factionSlug?: string;
  sortOrder: number;
  iconGlyph: string;
}

export const DEFAULT_FORUM_CATEGORIES: DefaultForumCategory[] = [
  {
    slug: "underwatch-lobby",
    name: "Underwatch Lobby",
    description: "General signal traffic for approved operatives. Introductions, chatter, and hub coordination.",
    sortOrder: 1,
    iconGlyph: "◈",
  },
  {
    slug: "faction-floors",
    name: "Faction Floors",
    description: "Faction-aligned discussion without turning the board into a war room.",
    sortOrder: 2,
    iconGlyph: "⬡",
  },
  {
    slug: "mission-debriefs",
    name: "Mission Debriefs",
    description: "Field order reflections, proof-light debriefs, and mission support threads.",
    sortOrder: 3,
    iconGlyph: "▣",
  },
  {
    slug: "cipher-help",
    name: "Cipher Help",
    description: "Oracular Circuit training talk. Hints and pattern reads — no real-world hacking instructions.",
    sortOrder: 4,
    iconGlyph: "⌗",
  },
  {
    slug: "avatar-forge",
    name: "Avatar Forge",
    description: "Mirror chamber talk, layer guidance, and forge contribution threads.",
    sortOrder: 5,
    iconGlyph: "◎",
  },
  {
    slug: "net-neighbors",
    name: "Net Neighbors",
    description: "Small doors in the Underwatch wall. Link curation and old-web neighbor discussion.",
    sortOrder: 6,
    iconGlyph: "▢",
  },
  {
    slug: "ghost-in-tech",
    name: "Ghost in Tech",
    description: "Repo relics, privacy tools, and useful code recovered from the surface web.",
    sortOrder: 7,
    iconGlyph: "⎔",
  },
  {
    slug: "state-of-affairs",
    name: "State of Affairs",
    description: "Public-interest signals and digital-rights dispatches. No doxxing or unverified panic posts.",
    sortOrder: 8,
    iconGlyph: "◉",
  },
  {
    slug: "mutual-aid-signals",
    name: "Mutual Aid Signals",
    description: "Care networks, resource sharing, and community support coordination.",
    sortOrder: 9,
    iconGlyph: "✦",
  },
  {
    slug: "lore-relics",
    name: "Lore & Relics",
    description: "Character lore, guild stories, relic notes, and canon-tier discussion.",
    sortOrder: 10,
    iconGlyph: "❖",
  },
  {
    slug: "site-feedback",
    name: "Site Feedback",
    description: "Bug reports, feature ideas, and Underwatch infrastructure feedback.",
    sortOrder: 11,
    iconGlyph: "⚙",
  },
  {
    slug: "accessibility-desk",
    name: "Accessibility Desk",
    description: "Accessibility improvements, scribe work, and inclusive design signals.",
    sortOrder: 12,
    iconGlyph: "♿",
  },
];

const VOLUNTEER_LANE_LABELS: Record<VolunteerLane, string> = {
  CODE: "Code & Infrastructure",
  DESIGN: "Design & UX",
  AVATAR_ASSETS: "Avatar Assets",
  BADGE_ART: "Badge Art",
  LORE_WRITING: "Lore Writing",
  MISSION_WRITING: "Mission Writing",
  CIPHER_WRITING: "Cipher Writing",
  MODERATION: "Moderation Support",
  ACCESSIBILITY: "Accessibility",
  DOCUMENTATION: "Documentation",
  RESEARCH_ARCHIVE: "Research & Archive",
  QA_TESTING: "QA & Testing",
  COMMUNITY_EVENTS: "Community Events",
  MUSIC_SIGNAL: "Music & Signal Player",
  NET_NEIGHBOR_SCOUTING: "Net Neighbor Scouting",
};

export const VOLUNTEER_LANES = VOLUNTEER_LANE_LABELS;

export const COMMUNITY_SUBMISSION_TYPE_LABELS: Record<CommunitySubmissionType, string> = {
  FORUM_CATEGORY: "Forum Category",
  MISSION: "Mission Idea",
  CIPHER: "Cipher Idea",
  LORE_FRAGMENT: "Lore Fragment",
  AVATAR_ASSET: "Avatar Asset",
  BADGE_IDEA: "Badge Idea",
  ACCESSIBILITY: "Accessibility Improvement",
  NET_NEIGHBOR: "Net Neighbor",
  COMMUNITY_EVENT: "Community Event",
  ARCHIVE_RESOURCE: "Archive Resource",
  FIELD_NOTE: "Field Note",
  COMMUNITY_QUESTION: "Community Question",
  OTHER: "Other",
};

export const COMMUNITY_SUBMISSION_TYPES = COMMUNITY_SUBMISSION_TYPE_LABELS;

export interface ReputationLevel {
  minPoints: number;
  title: string;
}

export const REPUTATION_LEVELS: ReputationLevel[] = [
  { minPoints: 0, title: "Static Trace" },
  { minPoints: 15, title: "Signal Ping" },
  { minPoints: 40, title: "Thread Voice" },
  { minPoints: 80, title: "Forum Echo" },
  { minPoints: 150, title: "Lore Bearer" },
  { minPoints: 250, title: "Community Steward" },
  { minPoints: 400, title: "Underwatch Recognized" },
  { minPoints: 600, title: "Chthonic Recognized" },
];

export const CANON_TIER_LABELS: Record<CanonTier, string> = {
  PRIVATE_DRAFT: "Private Draft",
  CHARACTER: "Character Canon",
  GUILD: "Guild Canon",
  LOCAL_COMMUNITY: "Local Community",
  FACTION_ECHO: "Faction Echo",
  WORLD: "World Canon",
};

export const COMMUNITY_SAFETY_NOTICE =
  "Community Signals are for collaboration, creativity, mutual support, lore, resources, and safe nonviolent play. Do not post secrets, private data, doxxing, harassment, threats, real-world targeting, illegal instructions, or anything that could harm people.";

export const POSITIVE_REACTION_SCORE: Partial<Record<ForumReactionType, number>> = {
  SIGNAL_BOOST: 2,
  USEFUL: 3,
  LOREFUL: 2,
  THANKS: 1,
};

export const COMMUNITY_DAILY_REPUTATION_CAP = 50;

export const COMMUNITY_THREAD_REPLY_SOURCE_TYPES = [
  "forum_thread",
  "forum_comment",
] as const;
