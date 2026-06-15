"use server";

import { revalidatePath } from "next/cache";
import type { UserProfileAssetKind } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { requireApprovedAuth } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import { validateOutboundUrl } from "@/lib/net-neighbors/validation";
import {
  parseProfileButtonsInput,
  parseProfileLinksInput,
  PROFILE_CSS_MAX,
  PROFILE_HTML_MAX,
  sanitizeProfileHtml,
} from "@/lib/profile-customization/sanitize";
import {
  saveProfileAssetUpload,
  validateProfileImageUpload,
} from "@/lib/profile-world/storage";
import { prisma } from "@/lib/prisma";

export type ActionResult =
  | { success: true; assetId?: string }
  | { success: false; error: string };

function parseRssFromForm(formData: FormData) {
  const feeds: { url: string; title?: string }[] = [];
  for (let i = 0; i < 5; i++) {
    const url = String(formData.get(`rssUrl${i}`) ?? "").trim();
    const title = String(formData.get(`rssTitle${i}`) ?? "").trim();
    if (!url) continue;
    const validated = validateOutboundUrl(url);
    if (!validated.ok) continue;
    feeds.push({ url: validated.url, title: title || undefined });
  }
  return feeds.slice(0, 5);
}

function parseLinksFromForm(formData: FormData) {
  const raw = String(formData.get("linksJson") ?? "").trim();
  if (!raw) return [];
  try {
    return parseProfileLinksInput(JSON.parse(raw));
  } catch {
    return [];
  }
}

function parseButtonsFromForm(formData: FormData) {
  const raw = String(formData.get("buttonsJson") ?? "").trim();
  if (!raw) return [];
  try {
    return parseProfileButtonsInput(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function updateProfileWorldAction(formData: FormData): Promise<ActionResult> {
  const user = await requireApprovedAuth();

  const html = String(formData.get("html") ?? "").slice(0, PROFILE_HTML_MAX);
  const css = String(formData.get("css") ?? "").slice(0, PROFILE_CSS_MAX);
  const isEnabled = formData.get("isEnabled") === "on" || formData.get("isEnabled") === "true";
  const showRelicZone = formData.get("showRelicZone") !== "false";
  const showRssZone = formData.get("showRssZone") !== "false";
  const tagline = String(formData.get("tagline") ?? "").trim().slice(0, 160) || null;
  const motto = String(formData.get("motto") ?? "").trim().slice(0, 200) || null;
  const favoriteSignal = String(formData.get("favoriteSignal") ?? "").trim().slice(0, 120) || null;
  const backgroundColor = String(formData.get("backgroundColor") ?? "").trim().slice(0, 32) || null;

  const sanitizedHtml = sanitizeProfileHtml(html);
  const rssFeeds = parseRssFromForm(formData);
  const links = parseLinksFromForm(formData);
  const profileButtons = parseButtonsFromForm(formData);

  await prisma.userProfileCustomization.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      html,
      css,
      sanitizedHtml,
      rssFeeds: rssFeeds as unknown as Prisma.InputJsonValue,
      links: links as unknown as Prisma.InputJsonValue,
      profileButtons: profileButtons as unknown as Prisma.InputJsonValue,
      isEnabled,
      showRelicZone,
      showRssZone,
      tagline,
      motto,
      favoriteSignal,
      backgroundColor,
    },
    update: {
      html,
      css,
      sanitizedHtml,
      rssFeeds: rssFeeds as unknown as Prisma.InputJsonValue,
      links: links as unknown as Prisma.InputJsonValue,
      profileButtons: profileButtons as unknown as Prisma.InputJsonValue,
      isEnabled,
      showRelicZone,
      showRssZone,
      tagline,
      motto,
      favoriteSignal,
      backgroundColor,
    },
  });

  await writeAuditLog({ action: "profile.world.update", actorId: user.id });
  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  return { success: true };
}

export async function uploadProfileAssetAction(
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  const kind = String(formData.get("kind") ?? "") as UserProfileAssetKind;
  const file = formData.get("file");
  const validKinds: UserProfileAssetKind[] = [
    "PORTRAIT",
    "BANNER",
    "BACKGROUND",
    "RELIC_IMAGE",
    "AVATAR_BACKGROUND",
  ];
  if (!validKinds.includes(kind)) {
    return { success: false, error: "Invalid asset kind." };
  }
  if (!file || typeof file === "string" || file.size === 0) {
    return { success: false, error: "File is required." };
  }

  const validation = validateProfileImageUpload(file, kind);
  if (!validation.ok) return { success: false, error: validation.error };

  const saved = await saveProfileAssetUpload(file, kind);
  const asset = await prisma.userProfileAsset.create({
    data: {
      userId: user.id,
      kind,
      path: saved.path,
      mimeType: saved.mimeType,
      sizeBytes: file.size,
      originalName: file.name.slice(0, 200),
    },
  });

  const fieldMap: Partial<Record<UserProfileAssetKind, string>> = {
    PORTRAIT: "portraitAssetId",
    BANNER: "bannerAssetId",
    BACKGROUND: "backgroundAssetId",
  };
  const field = fieldMap[kind];
  if (field) {
    await prisma.userProfileCustomization.upsert({
      where: { userId: user.id },
      create: { userId: user.id, [field]: asset.id },
      update: { [field]: asset.id },
    });
  }

  await writeAuditLog({
    action: "profile.asset.upload",
    actorId: user.id,
    metadata: { kind, assetId: asset.id },
  });

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  return { success: true, assetId: asset.id };
}

export async function removeProfileAssetAction(
  kind: "PORTRAIT" | "BANNER" | "BACKGROUND",
): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  const fieldMap = {
    PORTRAIT: "portraitAssetId",
    BANNER: "bannerAssetId",
    BACKGROUND: "backgroundAssetId",
  } as const;
  const field = fieldMap[kind];
  await prisma.userProfileCustomization.updateMany({
    where: { userId: user.id },
    data: { [field]: null },
  });
  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  return { success: true };
}

export async function resetProfileWorldAction(): Promise<ActionResult> {
  const actor = await requireApprovedAuth();
  if (!isModerator(actor.roles)) {
    return { success: false, error: "Moderator clearance required." };
  }
  return { success: false, error: "Provide userId via admin panel." };
}
