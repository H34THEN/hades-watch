"use server";

import { revalidatePath } from "next/cache";
import type {
  PlayerRecognitionCategory,
  PlayerRecognitionType,
} from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { getModeratorUserForAction } from "@/lib/auth/session";
import { tryAwardBadgeBySlug } from "@/lib/community/badges";
import { recordReputationEvent } from "@/lib/community/reputation";
import { stripCommunityText } from "@/lib/community/sanitize";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export type ActionResult =
  | { success: true; id?: string }
  | { success: false; error: string };

const grantSchema = z.object({
  recipientId: z.string().min(1),
  type: z.enum([
    "BADGE",
    "TITLE",
    "FEATURED_PROFILE",
    "FEATURED_GUILD",
    "COMMUNITY_SPOTLIGHT",
    "ARCHIVE_CREDIT",
    "MISSION_CREDIT",
    "FORGE_CREDIT",
    "LORE_CREDIT",
    "MODERATOR_COMMENDATION",
    "ARCHIVIST_MARK",
  ]),
  category: z.enum([
    "COMMUNITY_CARE",
    "LORE_CRAFT",
    "CIPHER_HELP",
    "MISSION_SUPPORT",
    "ARCHIVE_WORK",
    "FORGE_CONTRIBUTIONS",
    "ACCESSIBILITY",
    "MODERATION",
    "GUILD_LEADERSHIP",
    "OLD_WEB_CULTURE",
  ]),
  title: z.string().min(3).max(120),
  body: z.string().max(5000).optional(),
  isPublic: z.boolean().optional(),
  badgeSlug: z.string().max(64).optional(),
});

export async function grantRecognitionAction(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = grantSchema.safeParse({
    recipientId: formData.get("recipientId"),
    type: formData.get("type"),
    category: formData.get("category"),
    title: stripCommunityText(String(formData.get("title") ?? ""), 120),
    body: formData.get("body") || undefined,
    isPublic:
      formData.get("isPublic") === "on" ||
      formData.get("isPublic") === "true" ||
      formData.get("isPublic") !== "false",
    badgeSlug: formData.get("badgeSlug") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid recognition.",
    };
  }

  const recipient = await prisma.user.findUnique({
    where: { id: parsed.data.recipientId },
    select: { id: true },
  });

  if (!recipient) {
    return { success: false, error: "Recipient not found." };
  }

  const recognition = await prisma.playerRecognition.create({
    data: {
      recipientId: parsed.data.recipientId,
      grantedById: auth.id,
      type: parsed.data.type as PlayerRecognitionType,
      category: parsed.data.category as PlayerRecognitionCategory,
      title: parsed.data.title,
      body: parsed.data.body
        ? stripCommunityText(parsed.data.body, 5000)
        : null,
      isPublic: parsed.data.isPublic ?? true,
    },
  });

  await recordReputationEvent({
    userId: parsed.data.recipientId,
    category: "COMMUNITY",
    points: 10,
    reason: "Received community recognition",
    sourceType: "player_recognition",
    sourceId: recognition.id,
  });

  if (parsed.data.type === "BADGE" && parsed.data.badgeSlug) {
    await tryAwardBadgeBySlug(
      parsed.data.recipientId,
      parsed.data.badgeSlug,
      auth.id,
    );
  }

  await writeAuditLog({
    action: "recognition.grant",
    actorId: auth.id,
    targetType: "PlayerRecognition",
    targetId: recognition.id,
    metadata: {
      recipientId: parsed.data.recipientId,
      type: parsed.data.type,
    },
  });

  revalidatePath("/mmo/community");
  revalidatePath("/admin/community");
  revalidatePath(`/profile`);
  return { success: true, id: recognition.id };
}

export async function revokeRecognitionAction(
  recognitionId: string,
  reason?: string,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const recognition = await prisma.playerRecognition.findUnique({
    where: { id: recognitionId },
    select: { id: true, revoked: true },
  });

  if (!recognition) {
    return { success: false, error: "Recognition not found." };
  }

  if (recognition.revoked) {
    return { success: false, error: "Recognition already revoked." };
  }

  await prisma.playerRecognition.update({
    where: { id: recognitionId },
    data: {
      revoked: true,
      revokedAt: new Date(),
      ...(reason
        ? {
            body: stripCommunityText(reason, 5000),
          }
        : {}),
    },
  });

  await writeAuditLog({
    action: "recognition.revoke",
    actorId: auth.id,
    targetType: "PlayerRecognition",
    targetId: recognitionId,
    metadata: reason ? { reason } : undefined,
  });

  revalidatePath("/mmo/community");
  revalidatePath("/admin/community");
  return { success: true };
}
