import type { LoreCategory, RoleName } from "@/generated/prisma/client";
import { isAutoUnlockLoreSlug } from "@/lib/lore/auto-unlock";
import { SURFACE_BREAKS_WORLD_LORE_SLUGS } from "@/lib/lore/world-lore-pack";
import { matchesClearance } from "@/lib/clearance";
import { prisma } from "@/lib/prisma";

export async function getLoreForUser(userId: string, roles: RoleName[], category?: LoreCategory) {
  const character = await prisma.character.findUnique({
    where: { userId },
    select: { factionId: true },
  });

  const entries = await prisma.loreEntry.findMany({
    where: {
      status: "Published",
      ...(category
        ? category === "WORLD_LORE"
          ? {
              OR: [
                { category: "WORLD_LORE" },
                {
                  slug: { in: [...SURFACE_BREAKS_WORLD_LORE_SLUGS] },
                  category: null,
                },
              ],
            }
          : { category }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { requiredFaction: { select: { name: true, slug: true } } },
  });

  const unlocks = await prisma.userLoreUnlock.findMany({
    where: { userId },
    select: { loreEntryId: true },
  });
  const unlockedIds = new Set(unlocks.map((u) => u.loreEntryId));

  return entries.map((entry) => {
    const roleOk = matchesClearance(entry.requiredRole, roles);
    const autoUnlock = isAutoUnlockLoreSlug(entry.slug);
    const factionOk =
      autoUnlock ||
      !entry.requiredFactionId ||
      entry.requiredFactionId === character?.factionId;
    const unlocked = unlockedIds.has(entry.id) || autoUnlock;
    const accessible = roleOk && factionOk;
    return { ...entry, accessible, unlocked, canRead: accessible && unlocked };
  });
}

export async function getLoreBySlug(slug: string, userId: string, roles: RoleName[]) {
  const entry = await prisma.loreEntry.findUnique({
    where: { slug },
    include: { requiredFaction: true },
  });
  if (!entry || entry.status !== "Published") return null;

  const character = await prisma.character.findUnique({
    where: { userId },
    select: { factionId: true },
  });

  const roleOk = matchesClearance(entry.requiredRole, roles);
  const autoUnlock = isAutoUnlockLoreSlug(slug);
  const factionOk =
    autoUnlock ||
    !entry.requiredFactionId ||
    entry.requiredFactionId === character?.factionId;

  const unlock = await prisma.userLoreUnlock.findUnique({
    where: { userId_loreEntryId: { userId, loreEntryId: entry.id } },
  });

  const unlocked = !!unlock || autoUnlock;

  return {
    entry,
    accessible: roleOk && factionOk,
    unlocked,
    canRead: roleOk && factionOk && unlocked,
  };
}

export async function getAllLoreAdmin() {
  return prisma.loreEntry.findMany({
    orderBy: { updatedAt: "desc" },
    include: { requiredFaction: { select: { name: true } } },
  });
}
