import type { SessionUser } from "@/lib/auth/session";

export type HubModuleStatus =
  | "live"
  | "locked"
  | "coming-soon"
  | "pending"
  | "admin-only"
  | "external"
  | "hidden";

export type HubAccessLevel =
  | "public"
  | "logged-in"
  | "approved-user"
  | "admin"
  | "owner";

export type HubModuleCategory =
  | "Character"
  | "Factions"
  | "Missions"
  | "Ciphers"
  | "Community"
  | "Archive"
  | "Forge"
  | "Signals"
  | "Underwatch";

export interface HubModuleDefinition {
  slug: string;
  title: string;
  eyebrow: HubModuleCategory;
  description: string;
  emptyState?: string;
  route: string | null;
  routeExists: boolean;
  status: HubModuleStatus;
  accessLevel: HubAccessLevel;
  factionAssociations: string[];
  badgeHooks: string[];
  loreHooks: string[];
  ctaLabel: string;
  comingSoon?: boolean;
  privacyNote?: string;
  missionNote?: string;
  chatWarning?: string;
}

export interface ResolvedHubModule extends HubModuleDefinition {
  resolvedStatus: HubModuleStatus;
  resolvedRoute: string | null;
  lockedMessage: string | null;
  isLinkable: boolean;
}

export interface MmoHubContext {
  character: {
    callsign: string;
    archetype: string | null;
    factionName: string | null;
    factionSlug: string | null;
    isPublic: boolean;
  } | null;
  allianceMark: { name: string; slug: string } | null;
  badgeCount: number;
  hasAvatar: boolean;
  activeMissionCount: number;
  availableMissionCount: number;
  factionCount: number;
  cipherTotal: number;
  cipherSolved: number;
  upcomingEventCount: number;
  isApproved: boolean;
  isAdmin: boolean;
  isOwner: boolean;
}

export interface HubSectionDefinition {
  id: string;
  title: string;
  subtitle?: string;
  moduleSlugs: string[];
}

export type HubUser = SessionUser;
