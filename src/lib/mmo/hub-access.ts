import { isAdmin, isOwner } from "@/lib/auth/roles";
import { isApprovedUser, type SessionUser } from "@/lib/auth/session";
import type {
  HubAccessLevel,
  HubModuleDefinition,
  ResolvedHubModule,
} from "@/lib/mmo/hub-types";

export { statusLabel } from "@/lib/mmo/hub-labels";

const LOCKED_MESSAGES: Record<HubAccessLevel, string> = {
  public: "",
  "logged-in": "Sign in to open this relay.",
  "approved-user": "This relay opens after operative approval.",
  admin: "Admin command channel.",
  owner: "Owner-only command channel.",
};

function meetsAccessLevel(user: SessionUser, level: HubAccessLevel): boolean {
  switch (level) {
    case "public":
      return true;
    case "logged-in":
      return !!user;
    case "approved-user":
      return isApprovedUser(user);
    case "admin":
      return isAdmin(user.roles);
    case "owner":
      return isOwner(user.roles);
    default:
      return false;
  }
}

export function resolveHubModule(
  module: HubModuleDefinition,
  user: SessionUser,
): ResolvedHubModule {
  if (module.comingSoon || !module.routeExists) {
    return {
      ...module,
      resolvedStatus: "coming-soon",
      resolvedRoute: null,
      lockedMessage: "Relay not yet deployed. Keep the receiver warm.",
      isLinkable: false,
    };
  }

  if (module.slug === "signal-player") {
    return {
      ...module,
      resolvedStatus: "live",
      resolvedRoute: null,
      lockedMessage: null,
      isLinkable: false,
    };
  }

  const hasAccess = meetsAccessLevel(user, module.accessLevel);

  if (!hasAccess) {
    return {
      ...module,
      resolvedStatus: "locked",
      resolvedRoute: null,
      lockedMessage: LOCKED_MESSAGES[module.accessLevel],
      isLinkable: false,
    };
  }

  return {
    ...module,
    resolvedStatus: module.status === "live" ? "live" : module.status,
    resolvedRoute: module.route,
    lockedMessage: null,
    isLinkable: !!module.route,
  };
}

export function resolveHubModules(
  modules: HubModuleDefinition[],
  user: SessionUser,
): ResolvedHubModule[] {
  return modules.map((m) => resolveHubModule(m, user));
}
