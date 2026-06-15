"use server";

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
    customBackgroundAssetId:
      String(formData.get("customBackgroundAssetId") ?? "").trim() || null,
  };

  await prisma.userAvatar.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
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
      accessorySlugs: [],
    },
    update: {
      ...selection,
      accessorySlugs: [],
      displayName: null,
      tagline: null,
      bio: null,
      pronouns: null,
      motto: null,
      favoriteSignal: null,
      customBackgroundAssetId: null,
    },
  });
  revalidatePath("/profile");
  revalidatePath("/profile/avatar");
  return { success: true };
}
