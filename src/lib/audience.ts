import type { RoleName } from "@/generated/prisma/client";

/** Returns true if content with optional audience role is visible to user roles. */
export function matchesAudience(
  audienceRole: RoleName | null | undefined,
  userRoles: RoleName[],
): boolean {
  if (!audienceRole) return true;
  return userRoles.includes(audienceRole);
}
