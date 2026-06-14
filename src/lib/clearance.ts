import type { RoleName } from "@/generated/prisma/client";

export const ROLEPLAY_DISCLAIMER =
  "This is an in-world roleplay/game system. It is not secure private messaging and should not be used for real secrets.";

export function matchesClearance(
  clearanceRole: RoleName | null | undefined,
  userRoles: RoleName[],
): boolean {
  if (!clearanceRole) return true;
  return userRoles.includes(clearanceRole);
}

export function isExpired(expiresAt: Date | null | undefined): boolean {
  if (!expiresAt) return false;
  return expiresAt < new Date();
}
