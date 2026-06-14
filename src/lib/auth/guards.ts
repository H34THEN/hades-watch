import type { RoleName } from "@/generated/prisma/client";
import { getHighestRole, isAdmin, isModerator } from "@/lib/auth/roles";
import { getSessionUser, type SessionUser } from "@/lib/auth/session";

export async function requireModeratorUser(): Promise<
  | { ok: true; user: SessionUser }
  | { ok: false; reason: "auth" | "role" }
> {
  const user = await getSessionUser();
  if (!user) return { ok: false, reason: "auth" };
  if (!isModerator(user.roles)) return { ok: false, reason: "role" };
  return { ok: true, user };
}

export async function requireAdminUser(): Promise<
  | { ok: true; user: SessionUser }
  | { ok: false; reason: "auth" | "role" }
> {
  const user = await getSessionUser();
  if (!user) return { ok: false, reason: "auth" };
  if (!isAdmin(user.roles)) return { ok: false, reason: "role" };
  return { ok: true, user };
}

export function userHasRole(roles: RoleName[], required: RoleName): boolean {
  return roles.includes(required);
}

export { getHighestRole, isAdmin, isModerator };
