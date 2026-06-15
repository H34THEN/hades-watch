"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { requireApprovedAuth } from "@/lib/auth/session";
import { getDefaultAvatarSelection } from "@/lib/avatar/avatar-assets";
import { prisma } from "@/lib/prisma";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

function parseAccessorySlugs(raw: FormDataEntryValue | null): string[] {
  const value = String(raw ?? "").trim();
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function parseCustomPartIds(raw: FormDataEntryValue | null): Record<string, string> | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Record<string, string>;
    if (!parsed || typeof parsed !== "object") return null;
    const cleaned: Record<string, string> = {};
    for (const [key, id] of Object.entries(parsed)) {
      if (typeof id === "string" && id.trim()) cleaned[key] = id.trim();
    }
    return Object.keys(cleaned).length > 0 ? cleaned : null;
  } catch {
    return null;
  }
}

export async function saveAvatarAction(formData: FormData): Promise<ActionResult> {
  const user = await requireApprovedAuth();

  const data = {
    displayName: String(formData.get("displayName") ?? "").trim().slice(0, 64) || null,
    tagline: String(formData.get("tagline") ?? "").trim().slice(0, 160) || null,
    bio: String(formData.get("bio") ?? "").trim().slice(0, 1000) || null,
    pronouns: String(formData.get("pronouns") ?? "").trim().slice(0, 32) || null,
    motto: String(formData.get("motto") ?? "").trim().slice(0, 200) || null,
    favoriteSignal: String(formData.get("favoriteSignal") ?? "").trim().slice(0, 120) || null,
    speciesSlug: String(formData.get("speciesSlug") ?? "tiefling").trim(),
    bodySlug: String(formData.get("bodySlug") ?? "body-base-a").trim(),
    skinColor: String(formData.get("skinColor") ?? "").trim() || null,
    eyeSlug: String(formData.get("eyeSlug") ?? "").trim() || null,
    eyeColor: String(formData.get("eyeColor") ?? "").trim() || null,
    hairSlug: String(formData.get("hairSlug") ?? "").trim() || null,
    hairColor: String(formData.get("hairColor") ?? "").trim() || null,
    outfitSlug: String(formData.get("outfitSlug") ?? "").trim() || null,
    accessorySlugs: parseAccessorySlugs(formData.get("accessorySlugs")),
    backgroundSlug: String(formData.get("backgroundSlug") ?? "bg-underwatch-default").trim(),
    poseSlug: String(formData.get("poseSlug") ?? "pose-neutral").trim(),
    customBackgroundAssetId:
      String(formData.get("customBackgroundAssetId") ?? "").trim() || null,
    customPartIds: parseCustomPartIds(formData.get("customPartIds")),
  };

  await prisma.userAvatar.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      ...data,
      customPartIds: data.customPartIds as Prisma.InputJsonValue,
      accessorySlugs: data.accessorySlugs,
    },
    update: {
      ...data,
      customPartIds: data.customPartIds as Prisma.InputJsonValue,
      accessorySlugs: data.accessorySlugs,
    },
  });

  await writeAuditLog({ action: "avatar.save", actorId: user.id });
  revalidatePath("/profile");
  revalidatePath("/profile/avatar");
  return { success: true };
}

export async function resetAvatarAction(): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  const selection = getDefaultAvatarSelection();
  await prisma.userAvatar.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      ...selection,
      poseSlug: selection.poseSlug ?? "pose-neutral",
      accessorySlugs: [],
    },
    update: {
      ...selection,
      poseSlug: selection.poseSlug ?? "pose-neutral",
      accessorySlugs: [],
      displayName: null,
      tagline: null,
      bio: null,
      pronouns: null,
      motto: null,
      favoriteSignal: null,
      customBackgroundAssetId: null,
      customPartIds: Prisma.JsonNull,
    },
  });
  revalidatePath("/profile");
  revalidatePath("/profile/avatar");
  return { success: true };
}
