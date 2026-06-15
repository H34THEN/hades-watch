"use server";

import { revalidatePath } from "next/cache";
import type { AvatarPartVisibility } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { requireApprovedAuth } from "@/lib/auth/session";
import {
  saveAvatarPartUpload,
  validateAvatarPartUpload,
} from "@/lib/avatar/avatar-parts-storage";
import { prisma } from "@/lib/prisma";

export type ActionResult =
  | { success: true; partId?: string }
  | { success: false; error: string };

const VALID_CATEGORIES = new Set([
  "body",
  "species",
  "eyes",
  "ears",
  "hair",
  "emotion",
  "hands",
  "horns",
  "wings",
  "tails",
  "markings",
  "accessories",
  "tops",
  "pants",
  "skirts",
  "shoes",
  "socks",
  "outerwear",
  "back-items",
  "backgrounds",
  "fictional-props",
  "tech-gear",
  "faction-flair",
  "effects",
]);

export async function uploadAvatarPartAction(formData: FormData): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  const category = String(formData.get("category") ?? "").trim().toLowerCase();
  const label = String(formData.get("label") ?? "").trim().slice(0, 64);
  const visibilityRaw = String(formData.get("visibility") ?? "PRIVATE") as AvatarPartVisibility;
  const file = formData.get("file");

  if (!VALID_CATEGORIES.has(category)) {
    return { success: false, error: "Invalid part category." };
  }
  if (!file || typeof file === "string" || file.size === 0) {
    return { success: false, error: "File is required." };
  }

  const validation = validateAvatarPartUpload(file, category);
  if (!validation.ok) return { success: false, error: validation.error };

  const visibility: AvatarPartVisibility =
    visibilityRaw === "SHARED_PENDING" || visibilityRaw === "SHARED_APPROVED"
      ? "SHARED_PENDING"
      : "PRIVATE";

  const slugBase = label
    ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "custom";
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  const saved = await saveAvatarPartUpload(user.id, file, category, visibility);
  const part = await prisma.avatarUserPart.create({
    data: {
      userId: user.id,
      category,
      slug,
      label: label || `Custom ${category}`,
      path: saved.path,
      visibility,
      mimeType: saved.mimeType,
      sizeBytes: file.size,
    },
  });

  await writeAuditLog({
    action: "avatar.part.upload",
    actorId: user.id,
    metadata: { partId: part.id, visibility },
  });
  revalidatePath("/profile/avatar");
  return { success: true, partId: part.id };
}

export async function deleteAvatarPartAction(partId: string): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  const part = await prisma.avatarUserPart.findUnique({ where: { id: partId } });
  if (!part || part.userId !== user.id) {
    return { success: false, error: "Part not found." };
  }
  await prisma.avatarUserPart.delete({ where: { id: partId } });
  revalidatePath("/profile/avatar");
  return { success: true };
}
