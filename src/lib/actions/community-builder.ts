"use server";

import { revalidatePath } from "next/cache";
import type { CommunitySubmissionStatus } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { getApprovedUserForAction, getModeratorUserForAction } from "@/lib/auth/session";
import { stripCommunityText, validateOptionalUrl } from "@/lib/community/sanitize";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

const submitSchema = z.object({
  type: z.enum([
    "FORUM_CATEGORY",
    "MISSION",
    "CIPHER",
    "LORE_FRAGMENT",
    "AVATAR_ASSET",
    "BADGE_IDEA",
    "ACCESSIBILITY",
    "NET_NEIGHBOR",
    "COMMUNITY_EVENT",
    "ARCHIVE_RESOURCE",
    "FIELD_NOTE",
    "COMMUNITY_QUESTION",
    "OTHER",
  ]),
  title: z.string().min(3).max(120),
  summary: z.string().min(10).max(500),
  description: z.string().min(20).max(10000),
  factionSlug: z.string().max(64).optional(),
  relatedSystem: z.string().max(64).optional(),
  relatedUrl: z.string().max(2048).optional(),
  consentNoSecrets: z.literal(true),
});

const reviewSchema = z.object({
  submissionId: z.string().min(1),
  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "NEEDS_REVISION",
    "REJECTED",
    "ARCHIVED",
    "IMPLEMENTED",
  ]),
  reviewNote: z.string().max(5000).optional(),
});

export async function submitCommunityBuilderAction(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = submitSchema.safeParse({
    type: formData.get("type"),
    title: stripCommunityText(String(formData.get("title") ?? ""), 120),
    summary: stripCommunityText(String(formData.get("summary") ?? ""), 500),
    description: stripCommunityText(String(formData.get("description") ?? ""), 10000),
    factionSlug: formData.get("factionSlug") || undefined,
    relatedSystem: formData.get("relatedSystem") || undefined,
    relatedUrl: formData.get("relatedUrl") || undefined,
    consentNoSecrets: formData.get("consentNoSecrets") === "on" ||
      formData.get("consentNoSecrets") === "true",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid submission.",
    };
  }

  const urlResult = validateOptionalUrl(parsed.data.relatedUrl);
  if (!urlResult.ok) {
    return { success: false, error: urlResult.error };
  }

  const submission = await prisma.communitySubmission.create({
    data: {
      authorId: auth.id,
      type: parsed.data.type,
      title: parsed.data.title,
      summary: parsed.data.summary,
      description: parsed.data.description,
      factionSlug: parsed.data.factionSlug?.trim() || null,
      relatedSystem: parsed.data.relatedSystem?.trim() || null,
      relatedUrl: urlResult.url,
      consentNoSecrets: true,
      status: "PENDING",
    },
  });

  await writeAuditLog({
    action: "community.submission.submit",
    actorId: auth.id,
    targetType: "CommunitySubmission",
    targetId: submission.id,
    metadata: { type: parsed.data.type, title: parsed.data.title },
  });

  revalidatePath("/community");
  revalidatePath("/community/builder");
  revalidatePath("/admin/community");
  return { success: true };
}

export async function reviewCommunitySubmissionAction(
  submissionId: string,
  status: CommunitySubmissionStatus,
  reviewNote?: string,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = reviewSchema.safeParse({ submissionId, status, reviewNote });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid review.",
    };
  }

  const existing = await prisma.communitySubmission.findUnique({
    where: { id: submissionId },
    select: { id: true },
  });
  if (!existing) {
    return { success: false, error: "Submission not found." };
  }

  await prisma.communitySubmission.update({
    where: { id: submissionId },
    data: {
      status: parsed.data.status,
      reviewNote: parsed.data.reviewNote?.trim() || null,
      reviewedById: auth.id,
      reviewedAt: new Date(),
    },
  });

  await writeAuditLog({
    action: "community.submission.review",
    actorId: auth.id,
    targetType: "CommunitySubmission",
    targetId: submissionId,
    metadata: { status: parsed.data.status },
  });

  revalidatePath("/community");
  revalidatePath("/community/builder");
  revalidatePath("/admin/community");
  return { success: true };
}
