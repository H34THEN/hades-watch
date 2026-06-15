import type { RoleName } from "@/generated/prisma/client";

export const ROLE_HIERARCHY: Record<RoleName, number> = {
  Owner: 100,
  Admin: 80,
  Moderator: 60,
  Expert: 40,
  Operative: 25,
  Gamer: 30,
  Member: 20,
  Recruit: 15,
  Guest: 10,
};

export function hasAnyRole(
  userRoles: RoleName[],
  required: RoleName[],
): boolean {
  return required.some((r) => userRoles.includes(r));
}

export function isAdmin(roles: RoleName[]): boolean {
  return hasAnyRole(roles, ["Owner", "Admin"]);
}

export function isModerator(roles: RoleName[]): boolean {
  return hasAnyRole(roles, ["Owner", "Admin", "Moderator"]);
}

export function getHighestRole(roles: RoleName[]): RoleName {
  if (roles.length === 0) return "Guest";
  return roles.reduce((highest, role) =>
    ROLE_HIERARCHY[role] > ROLE_HIERARCHY[highest] ? role : highest,
  );
}

export function formatRoles(roles: RoleName[]): string {
  return roles.length > 0 ? roles.join(", ") : "Guest";
}
