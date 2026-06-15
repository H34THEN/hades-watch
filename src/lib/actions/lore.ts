"use server";

import { revalidatePath } from "next/cache";
import type { LoreCategory, RoleName } from "@/generated/prisma/client";
import { getArchiveEntryPath } from "@/lib/archive/categories";
import { isAutoUnlockLoreSlug } from "@/lib/lore/auto-unlock";
import { writeAuditLog } from "@/lib/audit";
import { matchesClearance } from "@/lib/clearance";
import { requireAdminUser } from "@/lib/auth/guards";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function getLoreForUser(userId: string, roles: RoleName[], category?: LoreCategory) {
  const character = await prisma.character.findUnique({
    where: { userId },
    select: { factionId: true },
  });

  const entries = await prisma.loreEntry.findMany({
    where: {
      status: "Published",
      ...(category ? { category } : {}),
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

export async function unlockLoreAction(loreEntryId: string): Promise<ActionResult> {
  const user = await requireAuth();

  const entry = await prisma.loreEntry.findUnique({
    where: { id: loreEntryId },
  });
  if (!entry || entry.status !== "Published") {
    return { success: false, error: "Lore entry not found" };
  }

  const lore = await getLoreBySlug(entry.slug, user.id, user.roles);
  if (!lore?.accessible) {
    return { success: false, error: "Clearance insufficient" };
  }

  await prisma.userLoreUnlock.upsert({
    where: { userId_loreEntryId: { userId: user.id, loreEntryId } },
    create: { userId: user.id, loreEntryId },
    update: {},
  });

  await writeAuditLog({
    action: "lore.unlock",
    actorId: user.id,
    targetType: "lore",
    targetId: loreEntryId,
  });

  revalidatePath("/archive");
  revalidatePath("/archive/lore");
  revalidatePath("/archive/characters");
  revalidatePath("/archive/world");
  revalidatePath("/archive/factions");
  revalidatePath("/archive/mythos-and-ethos");
  revalidatePath("/archive/state-of-affairs");
  revalidatePath(`/archive/lore/${entry.slug}`);
  revalidatePath(getArchiveEntryPath(entry.slug, entry.category));
  return { success: true };
}

export async function getAllLoreAdmin() {
  return prisma.loreEntry.findMany({
    orderBy: { updatedAt: "desc" },
    include: { requiredFaction: { select: { name: true } } },
  });
}

export async function createLoreAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const body = formData.get("body") as string;
  const requiredRole = (formData.get("requiredRole") as string) || null;

  if (!title || !body) {
    return { success: false, error: "Title and body required" };
  }

  const entry = await prisma.loreEntry.create({
    data: {
      title,
      slug: slugify(title),
      excerpt: excerpt || null,
      body,
      requiredRole: requiredRole as RoleName | null,
      authorId: admin.user.id,
      status: "Draft",
    },
  });

  await writeAuditLog({
    action: "lore.create",
    actorId: admin.user.id,
    targetType: "lore",
    targetId: entry.id,
  });

  revalidatePath("/admin/lore");
  return { success: true };
}

export async function publishLoreAction(id: string): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  await prisma.loreEntry.update({
    where: { id },
    data: { status: "Published", publishedAt: new Date() },
  });

  await writeAuditLog({
    action: "lore.publish",
    actorId: admin.user.id,
    targetType: "lore",
    targetId: id,
  });

  revalidatePath("/admin/lore");
  revalidatePath("/archive/lore");
  return { success: true };
}
