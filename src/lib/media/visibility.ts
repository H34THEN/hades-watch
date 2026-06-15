import type { MediaVisibility } from "@/generated/prisma/client";
import { isAdmin } from "@/lib/auth/roles";
import type { SessionUser } from "@/lib/auth/session";

export const VISIBILITY_LABELS: Record<MediaVisibility, string> = {
  PRIVATE: "Private",
  APPROVED_USERS: "Approved Users",
  PUBLIC: "Public",
  HIDDEN: "Hidden",
};

export function isApprovedSiteUser(user: SessionUser | null): boolean {
  if (!user) return false;
  if (user.disabled || user.banned) return false;
  return user.accountStatus === "Approved";
}

export function canAccessMediaVisibility(
  visibility: MediaVisibility,
  user: SessionUser | null,
): boolean {
  switch (visibility) {
    case "PUBLIC":
      return true;
    case "APPROVED_USERS":
      return isApprovedSiteUser(user);
    case "PRIVATE":
    case "HIDDEN":
      return !!user && isAdmin(user.roles);
    default:
      return false;
  }
}

export function canListMediaVisibility(
  visibility: MediaVisibility,
  user: SessionUser | null,
): boolean {
  if (visibility === "HIDDEN") {
    return !!user && isAdmin(user.roles);
  }
  return canAccessMediaVisibility(visibility, user);
}
