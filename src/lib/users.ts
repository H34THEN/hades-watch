import type { RoleName } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getUserRoles(userId: string): Promise<RoleName[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return userRoles.map((ur) => ur.role.name);
}

export async function getUserThemeId(userId: string): Promise<string | null> {
  const pref = await prisma.themePreference.findUnique({
    where: { userId },
    select: { themeId: true },
  });
  return pref?.themeId ?? null;
}
