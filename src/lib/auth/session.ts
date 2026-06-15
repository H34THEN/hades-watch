import { redirect } from "next/navigation";
import type { RoleName, UserAccountStatus } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { isAdmin, isModerator } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  roles: RoleName[];
  themeId: string | null;
  disabled: boolean;
  banned: boolean;
  accountStatus: UserAccountStatus;
  emailVerified: Date | null;
  createdAt: Date;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      userRoles: { include: { role: true } },
      themePreference: true,
    },
  });

  if (!user || user.disabled || user.banned) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.userRoles.map((ur) => ur.role.name),
    themeId: user.themePreference?.themeId ?? null,
    disabled: user.disabled,
    banned: user.banned,
    accountStatus: user.accountStatus,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login?error=auth_required");
  return user;
}

export function isApprovedUser(user: SessionUser): boolean {
  return user.accountStatus === "Approved" && !user.disabled && !user.banned;
}

export async function requireApprovedAuth(): Promise<SessionUser> {
  const user = await requireAuth();
  if (!isApprovedUser(user)) redirect("/pending-approval");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (!isAdmin(user.roles)) redirect("/dashboard?error=access_denied");
  return user;
}

export async function requireModerator(): Promise<SessionUser> {
  const user = await requireAuth();
  if (!isModerator(user.roles)) redirect("/dashboard?error=access_denied");
  return user;
}

/** Server actions must return errors — never redirect. */
export type ActionAuthError = { error: string };

export async function getApprovedUserForAction(): Promise<
  SessionUser | ActionAuthError
> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Sign in to continue." };
  }
  if (!isApprovedUser(user)) {
    return {
      error: "Net Neighbor submissions open after operative approval.",
    };
  }
  return user;
}

export async function getModeratorUserForAction(): Promise<
  SessionUser | ActionAuthError
> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Sign in to continue." };
  }
  if (!isApprovedUser(user)) {
    return { error: "Moderator clearance required." };
  }
  if (!isModerator(user.roles)) {
    return { error: "Moderator clearance required." };
  }
  return user;
}
