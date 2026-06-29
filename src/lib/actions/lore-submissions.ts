"use server";

import { revalidatePath } from "next/cache";
import type { CanonTier, LoreSubmissionStatus } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { getApprovedUserForAction, getModeratorUserForAction } from "@/lib/auth/session";
import { recordReputationEvent } from "@/lib/community/reputation";
import { stripCommunityText } from "@/lib/community/sanitize";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { z } from "zod";

export type ActionResult =
  | { success: true; slug?: string }
  | { success: false; error: string };

const submitSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(50).max(50000),
  tierRequested: z.enum([
    "PRIVATE_DRAFT",
    "CHARACTER",
    "GUILD",
    "LOCAL_COMMUNITY",
    "FACTION_ECHO",
    "WORLD",
  ]),
  characterCallsign: z.string().max(32).optional(),
  guildId: z.string().optional(),
  factionSlug: z.string().max(64).optional(),
  contentWarnings: z.string().max(500).optional(),
  submit: z.boolean().optional(),
});

const reviewSchema = z.object({
  submissionId: z.string().min(1),
  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "APPROVED",
    "NEEDS_REVISION",
    "REJECTED",
    "ARCHIVED",
  ]),
  tierApproved: z
    .enum([
      "PRIVATE_DRAFT",
      "CHARACTER",
      "GUILD",
      "LOCAL_COMMUNITY",
      "FACTION_ECHO",
      "WORLD",
    ])
    .optional(),
  reviewNote: z.string().max(5000).optional(),
});

export async function submitLoreSubmissionAction(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = submitSchema.safeParse({
    title: stripCommunityText(String(formData.get("title") ?? ""), 200),
    body: stripCommunityText(String(formData.get("body") ?? ""), 50000),
    tierRequested: formData.get("tierRequested") || "CHARACTER",
    characterCallsign: formData.get("characterCallsign") || undefined,
    guildId: formData.get("guildId") || undefined,
    factionSlug: formData.get("factionSlug") || undefined,
    contentWarnings: formData.get("contentWarnings") || undefined,
    submit:
      formData.get("submit") === "on" ||
      formData.get("submit") === "true" ||
      formData.get("action") === "submit",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid lore submission.",
    };
  }

  if (parsed.data.guildId) {
    const membership = await prisma.guildMembership.findFirst({
      where: {
        guildId: parsed.data.guildId,
        userId: auth.id,
        status: "APPROVED",
      },
      select: { id: true },
    });
    if (!membership) {
      return { success: false, error: "You are not a member of that guild." };
    }
  }

  const baseSlug = slugify(parsed.data.title) || "lore";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const status: LoreSubmissionStatus = parsed.data.submit ? "SUBMITTED" : "DRAFT";

  const submission = await prisma.loreSubmission.create({
    data: {
      authorId: auth.id,
      title: parsed.data.title,
      slug,
      body: parsed.data.body,
      tierRequested: parsed.data.tierRequested as CanonTier,
      characterCallsign: parsed.data.characterCallsign?.trim() || null,
      guildId: parsed.data.guildId || null,
      factionSlug: parsed.data.factionSlug?.trim() || null,
      contentWarnings: parsed.data.contentWarnings?.trim() || null,
      status,
    },
  });

  if (status === "SUBMITTED") {
    await recordReputationEvent({
      userId: auth.id,
      category: "LORE",
      points: 5,
      reason: "Submitted lore for review",
      sourceType: "lore_submission",
      sourceId: submission.id,
    });
  }

  await writeAuditLog({
    action: "lore.submit",
    actorId: auth.id,
    targetType: "LoreSubmission",
    targetId: submission.id,
    metadata: { slug, status },
  });

  revalidatePath("/lore/submit");
  revalidatePath("/mmo/community");
  return { success: true, slug };
}

export async function reviewLoreSubmissionAction(
  submissionId: string,
  status: LoreSubmissionStatus,
  tierApproved?: CanonTier,
  reviewNote?: string,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = reviewSchema.safeParse({
    submissionId,
    status,
    tierApproved,
    reviewNote,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid review.",
    };
  }

  const existing = await prisma.loreSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, authorId: true, slug: true },
  });

  if (!existing) {
    return { success: false, error: "Submission not found." };
  }

  await prisma.loreSubmission.update({
    where: { id: submissionId },
    data: {
      status: parsed.data.status,
      tierApproved:
        parsed.data.status === "APPROVED"
          ? ((parsed.data.tierApproved as CanonTier | undefined) ?? undefined)
          : undefined,
      reviewNote: parsed.data.reviewNote?.trim() || null,
      reviewedById: auth.id,
      reviewedAt: new Date(),
    },
  });

  if (parsed.data.status === "APPROVED") {
    await recordReputationEvent({
      userId: existing.authorId,
      category: "LORE",
      points: 15,
      reason: "Lore submission approved",
      sourceType: "lore_submission",
      sourceId: existing.id,
    });
  }

  await writeAuditLog({
    action: "lore.review",
    actorId: auth.id,
    targetType: "LoreSubmission",
    targetId: submissionId,
    metadata: { status, tierApproved: parsed.data.tierApproved },
  });

  revalidatePath("/lore/submit");
  revalidatePath("/admin/community");
  revalidatePath(`/lore/submissions/${existing.slug}`);
  return { success: true };
}
