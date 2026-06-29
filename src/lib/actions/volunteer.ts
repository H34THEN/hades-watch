"use server";

import { revalidatePath } from "next/cache";
import type {
  VolunteerLane,
  VolunteerOpportunityStatus,
  VolunteerResponseStatus,
} from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { getApprovedUserForAction, getModeratorUserForAction } from "@/lib/auth/session";
import { stripCommunityText } from "@/lib/community/sanitize";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { z } from "zod";

export type ActionResult =
  | { success: true; slug?: string }
  | { success: false; error: string };

const responseSchema = z.object({
  opportunityId: z.string().min(1),
  message: z.string().min(20).max(5000),
  skills: z.string().max(1000).optional(),
  availability: z.string().max(500).optional(),
});

const opportunitySchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20).max(10000),
  lane: z.enum([
    "CODE",
    "DESIGN",
    "AVATAR_ASSETS",
    "BADGE_ART",
    "LORE_WRITING",
    "MISSION_WRITING",
    "CIPHER_WRITING",
    "MODERATION",
    "ACCESSIBILITY",
    "DOCUMENTATION",
    "RESEARCH_ARCHIVE",
    "QA_TESTING",
    "COMMUNITY_EVENTS",
    "MUSIC_SIGNAL",
    "NET_NEIGHBOR_SCOUTING",
  ]),
  requiredSkills: z.string().max(1000).optional(),
  difficulty: z.string().max(64).optional(),
  estimatedTime: z.string().max(64).optional(),
});

export async function submitVolunteerResponseAction(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = responseSchema.safeParse({
    opportunityId: formData.get("opportunityId"),
    message: stripCommunityText(String(formData.get("message") ?? ""), 5000),
    skills: formData.get("skills") || undefined,
    availability: formData.get("availability") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid response.",
    };
  }

  const opportunity = await prisma.volunteerOpportunity.findFirst({
    where: {
      id: parsed.data.opportunityId,
      status: { in: ["OPEN", "CLAIMED", "IN_PROGRESS"] },
    },
    select: { id: true, slug: true },
  });

  if (!opportunity) {
    return { success: false, error: "Opportunity not found or closed." };
  }

  const response = await prisma.volunteerResponse.upsert({
    where: {
      opportunityId_userId: {
        opportunityId: opportunity.id,
        userId: auth.id,
      },
    },
    create: {
      opportunityId: opportunity.id,
      userId: auth.id,
      message: parsed.data.message,
      skills: parsed.data.skills?.trim() || null,
      availability: parsed.data.availability?.trim() || null,
      status: "PENDING",
    },
    update: {
      message: parsed.data.message,
      skills: parsed.data.skills?.trim() || null,
      availability: parsed.data.availability?.trim() || null,
      status: "PENDING",
    },
  });

  await writeAuditLog({
    action: "volunteer.response.submit",
    actorId: auth.id,
    targetType: "VolunteerResponse",
    targetId: response.id,
    metadata: { opportunityId: opportunity.id },
  });

  revalidatePath("/volunteer");
  revalidatePath(`/volunteer/${opportunity.slug}`);
  revalidatePath("/mmo/community");
  return { success: true };
}

export async function reviewVolunteerResponseAction(
  responseId: string,
  status: VolunteerResponseStatus,
  reviewNote?: string,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const response = await prisma.volunteerResponse.findUnique({
    where: { id: responseId },
    include: {
      opportunity: { select: { slug: true } },
    },
  });

  if (!response) {
    return { success: false, error: "Response not found." };
  }

  await prisma.volunteerResponse.update({
    where: { id: responseId },
    data: {
      status,
      reviewNote: reviewNote?.trim() || null,
      reviewedById: auth.id,
      reviewedAt: new Date(),
    },
  });

  await writeAuditLog({
    action: "volunteer.response.review",
    actorId: auth.id,
    targetType: "VolunteerResponse",
    targetId: responseId,
    metadata: { status },
  });

  revalidatePath("/volunteer");
  revalidatePath(`/volunteer/${response.opportunity.slug}`);
  revalidatePath("/admin/community");
  return { success: true };
}

export async function createVolunteerOpportunityAction(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = opportunitySchema.safeParse({
    title: stripCommunityText(String(formData.get("title") ?? ""), 120),
    description: stripCommunityText(String(formData.get("description") ?? ""), 10000),
    lane: formData.get("lane"),
    requiredSkills: formData.get("requiredSkills") || undefined,
    difficulty: formData.get("difficulty") || undefined,
    estimatedTime: formData.get("estimatedTime") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid opportunity.",
    };
  }

  const baseSlug = slugify(parsed.data.title) || "volunteer";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const opportunity = await prisma.volunteerOpportunity.create({
    data: {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      lane: parsed.data.lane as VolunteerLane,
      requiredSkills: parsed.data.requiredSkills?.trim() || null,
      difficulty: parsed.data.difficulty?.trim() || null,
      estimatedTime: parsed.data.estimatedTime?.trim() || null,
      status: "OPEN" satisfies VolunteerOpportunityStatus,
      createdById: auth.id,
    },
  });

  await writeAuditLog({
    action: "volunteer.opportunity.create",
    actorId: auth.id,
    targetType: "VolunteerOpportunity",
    targetId: opportunity.id,
    metadata: { slug, lane: parsed.data.lane },
  });

  revalidatePath("/volunteer");
  revalidatePath("/admin/community");
  return { success: true, slug };
}
