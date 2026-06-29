"use server";

import { revalidatePath } from "next/cache";
import type { ForumModerationStatus, ForumSignatureAssetType } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { getApprovedUserForAction, getModeratorUserForAction } from "@/lib/auth/session";
import { stripCommunityText } from "@/lib/community/sanitize";
import {
  configToPrimaryText,
  configToSecondaryText,
  normalizeForumSignatureConfig,
  parseForumSignatureConfig,
} from "@/lib/forums/signature-builder";
import {
  saveForumProfileImage,
  saveForumSignatureImage,
  validateForumImageUpload,
} from "@/lib/forums/storage";
import { getOrCreateForumProfile } from "@/lib/queries/forum-identity";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { z } from "zod";

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export type ForumIdentityActionResult =
  | { success: true; assetId?: string }
  | { success: false; error: string };

const profileSchema = z.object({
  displayName: z.string().max(48).optional(),
  statusLine: z.string().max(120).optional(),
  signatureText: z.string().max(500).optional(),
  selectedTitleSlug: z.string().max(64).optional(),
  factionSlug: z.string().max(64).optional(),
  guildSlug: z.string().max(64).optional(),
  showBadges: z.enum(["true", "false"]).optional(),
  showReputation: z.enum(["true", "false"]).optional(),
  showProfileWorldLink: z.enum(["true", "false"]).optional(),
  signatureMode: z.enum(["COMPACT", "FULL", "HIDDEN"]).optional(),
  stylePreset: z.string().max(64).optional(),
  hoverEffect: z.string().max(64).optional(),
  forumImageSource: z.enum(["UPLOADED", "AVATAR", "FACTION_ICON", "GENERATED"]).optional(),
  generatedGlyph: z.string().max(3).optional(),
  generatedTheme: z.string().max(64).optional(),
});

const prefsSchema = z.object({
  hideSignatures: z.enum(["true", "false"]).optional(),
  reduceMotion: z.enum(["true", "false"]).optional(),
  disableHoverEffects: z.enum(["true", "false"]).optional(),
  compactAuthorCards: z.enum(["true", "false"]).optional(),
  notifyWhenQuoted: z.enum(["true", "false"]).optional(),
  notifyOnDirectReply: z.enum(["true", "false"]).optional(),
  notifyOnMention: z.enum(["true", "false"]).optional(),
});

function boolField(value: string | undefined, fallback: boolean): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export async function updateForumProfileAction(
  formData: FormData,
): Promise<ForumIdentityActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName") || undefined,
    statusLine: formData.get("statusLine") || undefined,
    signatureText: formData.get("signatureText") || undefined,
    selectedTitleSlug: formData.get("selectedTitleSlug") || undefined,
    factionSlug: formData.get("factionSlug") || undefined,
    guildSlug: formData.get("guildSlug") || undefined,
    showBadges: formData.get("showBadges") || undefined,
    showReputation: formData.get("showReputation") || undefined,
    showProfileWorldLink: formData.get("showProfileWorldLink") || undefined,
    signatureMode: formData.get("signatureMode") || undefined,
    stylePreset: formData.get("stylePreset") || undefined,
    hoverEffect: formData.get("hoverEffect") || undefined,
    forumImageSource: formData.get("forumImageSource") || undefined,
    generatedGlyph: formData.get("generatedGlyph") || undefined,
    generatedTheme: formData.get("generatedTheme") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid profile." };
  }

  const profile = await getOrCreateForumProfile(auth.id);
  const data = parsed.data;

  const imageFile = formData.get("forumImage") as File | null;
  let forumImagePath = profile.forumImagePath;
  let forumImageSource = data.forumImageSource ?? profile.forumImageSource;
  let forumImageAlt =
    stripCommunityText(String(formData.get("forumImageAlt") ?? ""), 120) ||
    profile.forumImageAlt;

  if (imageFile && imageFile.size > 0) {
    const valid = validateForumImageUpload(imageFile);
    if (!valid.ok) return { success: false, error: valid.error };
    forumImagePath = await saveForumProfileImage(imageFile);
    forumImageSource = "UPLOADED";
    forumImageAlt =
      forumImageAlt ||
      stripCommunityText(String(data.displayName ?? profile.displayName ?? "Forum profile"), 120);
  }

  const generatedImageConfig =
    forumImageSource === "GENERATED"
      ? {
          glyph: stripCommunityText(String(data.generatedGlyph ?? ""), 3).toUpperCase() || undefined,
          theme: data.generatedTheme ?? "dead-index-violet",
        }
      : profile.generatedImageConfig;

  await prisma.forumProfile.update({
    where: { id: profile.id },
    data: {
      displayName: data.displayName
        ? stripCommunityText(data.displayName, 48)
        : profile.displayName,
      statusLine: data.statusLine ? stripCommunityText(data.statusLine, 120) : null,
      signatureText: data.signatureText ? stripCommunityText(data.signatureText, 500) : null,
      selectedTitleSlug: data.selectedTitleSlug || null,
      factionSlug: data.factionSlug || null,
      guildSlug: data.guildSlug || null,
      showBadges: boolField(data.showBadges, profile.showBadges),
      showReputation: boolField(data.showReputation, profile.showReputation),
      showProfileWorldLink: boolField(
        data.showProfileWorldLink,
        profile.showProfileWorldLink,
      ),
      signatureMode: data.signatureMode ?? profile.signatureMode,
      stylePreset: data.stylePreset ?? profile.stylePreset,
      hoverEffect: data.hoverEffect ?? profile.hoverEffect,
      forumImageSource,
      forumImagePath,
      forumImageAlt,
      generatedImageConfig: generatedImageConfig ?? undefined,
    },
  });

  await writeAuditLog({
    action: "forum.profile.update",
    actorId: auth.id,
    targetType: "ForumProfile",
    targetId: profile.id,
  });

  revalidatePath("/profile/forum");
  revalidatePath("/community/forums");
  return { success: true };
}

export async function saveForumSignatureAssetAction(
  formData: FormData,
): Promise<ForumIdentityActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) return { success: false, error: auth.error };

  const assetType = String(formData.get("assetType") ?? "BUTTON") as ForumSignatureAssetType;
  const setActive = formData.get("setActive") === "true";
  const useUpload = formData.get("useUpload") === "true";
  const styleJson = formData.get("signatureConfigJson");

  const profile = await getOrCreateForumProfile(auth.id);
  let safeConfig: ReturnType<typeof normalizeForumSignatureConfig> | null = null;
  let imagePath: string | null = null;
  let sourceType: "GENERATED" | "UPLOADED" = "GENERATED";

  if (useUpload) {
    const file = formData.get("signatureImage") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "Signature image is required for upload mode." };
    }
    const valid = validateForumImageUpload(file);
    if (!valid.ok) return { success: false, error: valid.error };
    imagePath = await saveForumSignatureImage(file);
    sourceType = "UPLOADED";
  } else if (typeof styleJson === "string" && styleJson.trim()) {
    try {
      const raw = JSON.parse(styleJson) as Record<string, unknown>;
      safeConfig = normalizeForumSignatureConfig(raw, assetType);
    } catch {
      return { success: false, error: "Invalid signature configuration." };
    }
  } else {
    return { success: false, error: "Signature configuration is required." };
  }

  const sizePreset =
    safeConfig?.size ??
    String(formData.get("sizePreset") ?? (assetType === "BUTTON" ? "88x31" : "234x60"));

  const asset = await prisma.forumSignatureAsset.create({
    data: {
      userId: auth.id,
      profileId: profile.id,
      assetType,
      sizePreset,
      sourceType,
      imagePath,
      altText: stripCommunityText(
        String(formData.get("altText") ?? safeConfig?.text ?? "Forum signature"),
        120,
      ),
      textPrimary: safeConfig ? configToPrimaryText(safeConfig) : null,
      textSecondary: safeConfig ? configToSecondaryText(safeConfig) : null,
      safeConfig: safeConfig ? toJsonValue(safeConfig) : undefined,
      moderationStatus: "APPROVED",
    },
  });

  if (setActive) {
    await prisma.forumProfile.update({
      where: { id: profile.id },
      data:
        assetType === "BANNER"
          ? { activeBannerId: asset.id }
          : { activeButtonId: asset.id },
    });
  }

  await writeAuditLog({
    action: "forum.signature.create",
    actorId: auth.id,
    targetType: "ForumSignatureAsset",
    targetId: asset.id,
    metadata: { assetType, sourceType },
  });

  revalidatePath("/profile/forum");
  revalidatePath(assetType === "BANNER" ? "/profile/forum/banner-builder" : "/profile/forum/button-builder");
  return { success: true, assetId: asset.id };
}

export async function setActiveForumSignatureAction(
  assetId: string,
  assetType: ForumSignatureAssetType,
): Promise<ForumIdentityActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) return { success: false, error: auth.error };

  const asset = await prisma.forumSignatureAsset.findFirst({
    where: {
      id: assetId,
      userId: auth.id,
      moderationStatus: { in: ["APPROVED", "PENDING"] },
    },
  });
  if (!asset) return { success: false, error: "Signature asset not found." };

  const profile = await getOrCreateForumProfile(auth.id);
  await prisma.forumProfile.update({
    where: { id: profile.id },
    data:
      assetType === "BANNER"
        ? { activeBannerId: asset.id }
        : { activeButtonId: asset.id },
  });

  revalidatePath("/profile/forum");
  return { success: true };
}

export async function updateForumPreferencesAction(
  formData: FormData,
): Promise<ForumIdentityActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = prefsSchema.safeParse({
    hideSignatures: formData.get("hideSignatures") || undefined,
    reduceMotion: formData.get("reduceMotion") || undefined,
    disableHoverEffects: formData.get("disableHoverEffects") || undefined,
    compactAuthorCards: formData.get("compactAuthorCards") || undefined,
    notifyWhenQuoted: formData.get("notifyWhenQuoted") || undefined,
    notifyOnDirectReply: formData.get("notifyOnDirectReply") || undefined,
    notifyOnMention: formData.get("notifyOnMention") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid preferences." };
  }

  const data = parsed.data;
  await prisma.forumUserPreference.upsert({
    where: { userId: auth.id },
    create: {
      userId: auth.id,
      hideSignatures: boolField(data.hideSignatures, false),
      reduceMotion: boolField(data.reduceMotion, false),
      disableHoverEffects: boolField(data.disableHoverEffects, false),
      compactAuthorCards: boolField(data.compactAuthorCards, false),
      notifyWhenQuoted: boolField(data.notifyWhenQuoted, true),
      notifyOnDirectReply: boolField(data.notifyOnDirectReply, true),
      notifyOnMention: boolField(data.notifyOnMention, true),
    },
    update: {
      ...(data.hideSignatures != null
        ? { hideSignatures: data.hideSignatures === "true" }
        : {}),
      ...(data.reduceMotion != null
        ? { reduceMotion: data.reduceMotion === "true" }
        : {}),
      ...(data.disableHoverEffects != null
        ? { disableHoverEffects: data.disableHoverEffects === "true" }
        : {}),
      ...(data.compactAuthorCards != null
        ? { compactAuthorCards: data.compactAuthorCards === "true" }
        : {}),
      ...(data.notifyWhenQuoted != null
        ? { notifyWhenQuoted: data.notifyWhenQuoted === "true" }
        : {}),
      ...(data.notifyOnDirectReply != null
        ? { notifyOnDirectReply: data.notifyOnDirectReply === "true" }
        : {}),
      ...(data.notifyOnMention != null
        ? { notifyOnMention: data.notifyOnMention === "true" }
        : {}),
    },
  });

  revalidatePath("/notifications");
  revalidatePath("/profile/forum/edit");
  return { success: true };
}

export async function moderateForumIdentityAction(
  targetType: "profile" | "asset",
  targetId: string,
  status: ForumModerationStatus,
  note?: string,
): Promise<ForumIdentityActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) return { success: false, error: auth.error };

  if (targetType === "profile") {
    await prisma.forumProfile.update({
      where: { id: targetId },
      data: { moderationStatus: status },
    });
  } else {
    await prisma.forumSignatureAsset.update({
      where: { id: targetId },
      data: {
        moderationStatus: status,
        moderationNote: note ? stripCommunityText(note, 2000) : undefined,
      },
    });
  }

  await writeAuditLog({
    action: "forum.identity.moderate",
    actorId: auth.id,
    targetType: targetType === "profile" ? "ForumProfile" : "ForumSignatureAsset",
    targetId,
    metadata: { status },
  });

  revalidatePath("/admin/forums/identity");
  revalidatePath("/admin/forums/signatures");
  return { success: true };
}

export async function markNotificationsReadAction(
  formData: FormData,
): Promise<ForumIdentityActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) return { success: false, error: auth.error };

  const all = formData.get("markAll") === "true";
  const notificationId = formData.get("notificationId");

  if (all) {
    await prisma.userNotification.updateMany({
      where: { recipientId: auth.id, readAt: null },
      data: { readAt: new Date() },
    });
  } else if (typeof notificationId === "string" && notificationId) {
    await prisma.userNotification.updateMany({
      where: { id: notificationId, recipientId: auth.id },
      data: { readAt: new Date() },
    });
  }

  revalidatePath("/notifications");
  return { success: true };
}

export async function markNotificationsReadFormAction(formData: FormData): Promise<void> {
  await markNotificationsReadAction(formData);
}

export { parseForumSignatureConfig };
