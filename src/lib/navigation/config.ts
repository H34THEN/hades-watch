import type { RoleName, UserAccountStatus } from "@/generated/prisma/client";
import { isAdmin, isModerator } from "@/lib/auth/roles";

export type NavSectionId = "command" | "mmo" | "archive" | "social" | "account" | "public";

export type NavLinkAccess =
  | "public"
  | "open"
  | "authenticated"
  | "approved"
  | "admin"
  | "moderator";

export interface NavLinkItem {
  href: string;
  label: string;
  access: NavLinkAccess;
  description?: string;
}

export interface NavGroupConfig {
  id: NavSectionId;
  label: string;
  terminalLabel: string;
  links: NavLinkItem[];
}

export const NAV_GROUPS: NavGroupConfig[] = [
  {
    id: "command",
    label: "Command",
    terminalLabel: "COMMAND",
    links: [
      { href: "/dashboard", label: "Dashboard", access: "approved" },
      { href: "/dashboard/transmissions", label: "Transmissions", access: "approved" },
      { href: "/events", label: "Events", access: "approved" },
      { href: "/admin", label: "Admin Console", access: "admin" },
      { href: "/admin/users", label: "User Management", access: "admin" },
      { href: "/admin/factions/command", label: "Chthonic Command", access: "admin" },
      { href: "/admin/media", label: "Signal Deck", access: "admin" },
      { href: "/admin/archive", label: "Archive Admin", access: "admin" },
      { href: "/moderation", label: "Moderation", access: "moderator" },
      { href: "/admin/net-neighbors", label: "Net Neighbors", access: "moderator" },
    ],
  },
  {
    id: "mmo",
    label: "MMO",
    terminalLabel: "MMO",
    links: [
      { href: "/mmo", label: "MMO Hub", access: "approved" },
      { href: "/mmo/factions", label: "Factions", access: "approved" },
      { href: "/mmo/missions", label: "Missions", access: "approved" },
      { href: "/mmo/character", label: "Character", access: "approved" },
      { href: "/ciphers", label: "Ciphers", access: "approved" },
      { href: "/dead-drops", label: "Dead Drops", access: "approved" },
    ],
  },
  {
    id: "social",
    label: "Social",
    terminalLabel: "SOCIAL",
    links: [
      { href: "/chat", label: "Chat Rooms", access: "approved", description: "HTTPS-protected temporary chat" },
      { href: "/net-neighbors", label: "Net Neighbors", access: "open", description: "Old-web banner wall" },
      { href: "/profile", label: "Profile Worlds", access: "approved", description: "Full-page operative shrines" },
    ],
  },
  {
    id: "archive",
    label: "Archive",
    terminalLabel: "ARCHIVE",
    links: [
      { href: "/archive", label: "Archive Hub", access: "approved" },
      { href: "/archive/state-of-affairs", label: "State of Affairs", access: "approved" },
      { href: "/archive/ghost-in-tech", label: "Ghost in Tech", access: "approved" },
      { href: "/archive/lore", label: "Lore Index", access: "approved" },
    ],
  },
  {
    id: "account",
    label: "Account",
    terminalLabel: "ACCOUNT",
    links: [
      { href: "/profile", label: "Profile World", access: "authenticated" },
      { href: "/profile/edit", label: "Edit Profile", access: "approved" },
      { href: "/profile/avatar", label: "Avatar Builder", access: "approved" },
      { href: "/pending-approval", label: "Pending Approval", access: "authenticated" },
    ],
  },
  {
    id: "public",
    label: "Public",
    terminalLabel: "SURFACE",
    links: [
      { href: "/", label: "Home", access: "public" },
      { href: "/about", label: "About", access: "public" },
      { href: "/themes", label: "Themes", access: "public" },
      { href: "/invite", label: "Invite", access: "public" },
      { href: "/login", label: "Login", access: "public" },
      { href: "/register", label: "Register", access: "public" },
    ],
  },
];

export interface NavContext {
  isAuthenticated: boolean;
  accountStatus: UserAccountStatus;
  roles: RoleName[];
}

export function canAccessNavLink(link: NavLinkItem, ctx: NavContext): boolean {
  const { isAuthenticated, accountStatus, roles } = ctx;
  const approved = accountStatus === "Approved";

  switch (link.access) {
    case "public":
      return !isAuthenticated;
    case "open":
      return true;
    case "authenticated":
      return isAuthenticated;
    case "approved":
      return isAuthenticated && approved;
    case "admin":
      return isAuthenticated && approved && isAdmin(roles);
    case "moderator":
      return isAuthenticated && approved && isModerator(roles);
    default:
      return false;
  }
}

export function filterNavGroup(group: NavGroupConfig, ctx: NavContext): NavLinkItem[] {
  return group.links.filter((link) => {
    if (link.href === "/pending-approval" && ctx.accountStatus !== "Pending") {
      return false;
    }
    if (link.access === "public" && ctx.isAuthenticated) {
      return false;
    }
    return canAccessNavLink(link, ctx);
  });
}

export function getVisibleNavGroups(ctx: NavContext): NavGroupConfig[] {
  if (!ctx.isAuthenticated) {
    return NAV_GROUPS.filter((g) => g.id === "public" || g.id === "social");
  }

  if (ctx.accountStatus === "Pending") {
    return NAV_GROUPS.filter((g) => g.id === "account" || g.id === "social");
  }

  return NAV_GROUPS.filter((g) => g.id !== "public");
}

export function getActiveNavSection(pathname: string): NavSectionId | null {
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/moderation") ||
    pathname.startsWith("/events")
  ) {
    return "command";
  }
  if (
    pathname.startsWith("/mmo") ||
    pathname.startsWith("/ciphers") ||
    pathname.startsWith("/dead-drops")
  ) {
    return "mmo";
  }
  if (
    pathname.startsWith("/chat") ||
    pathname.startsWith("/net-neighbors")
  ) {
    return "social";
  }
  if (pathname.startsWith("/archive")) {
    return "archive";
  }
  if (pathname === "/profile" || pathname.startsWith("/profile/") || pathname.startsWith("/pending-approval")) {
    return "account";
  }
  return null;
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
