"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { requireModeratorUser } from "@/lib/auth/guards";
import { isApprovedUser, requireApprovedAuth } from "@/lib/auth/session";
import { getMissionDefinitionBySlug } from "@/lib/missions/registry";
import { getMissionDetailForUser } from "@/lib/missions/queries";
import { prisma } from "@/lib/prisma";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

const SENSITIVE_FIELD_PATTERN =
  /password|recovery code|private key|ssn|social security|home address|phone number|medical record/i;

function collectProofPacket(formData: FormData, fieldIds: string[]): Record<string, string | boolean> {
  const packet: Record<string, string | boolean> = {};
  for (const id of fieldIds) {
    const value = formData.get(id);
    if (value === "on") {
      packet[id] = true;
      continue;
    }
    if (typeof value === "string" && value.trim()) {
      packet[id] = value.trim();
    }
  }
  return packet;
}

function validateProofPacket(
  packet: Record<string, string | boolean>,
  requiredFieldIds: string[],
): string | null {
  for (const id of requiredFieldIds) {
    if (id.endsWith("_affirmation") || id === "safety_affirmation") {
      if (packet[id] !== true) {
        return "Safety and scope affirmation is required.";
      }
      continue;
    }
    const value = packet[id];
    if (!value || (typeof value === "string" && !value.trim())) {
      return `Missing required field: ${id}`;
    }
    if (typeof value === "string" && SENSITIVE_FIELD_PATTERN.test(value)) {
      return "Proof packet must not include passwords, recovery codes, private keys, addresses, phone numbers, or sensitive IDs.";
    }
  }
  return null;
}

async function awardVerifiedBadge(input: {
  userId: string;
  badgeSlug: string;
  missionQuestId: string;
  reviewerId: string;
}) {
  const badge = await prisma.badge.findUnique({ where: { slug: input.badgeSlug } });
  if (!badge) return false;

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId: input.userId, badgeId: badge.id } },
  });
  if (existing?.verificationStatus === "Verified") return false;

  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId: input.userId, badgeId: badge.id } },
    create: {
      userId: input.userId,
      badgeId: badge.id,
      awardedById: input.reviewerId,
      verificationStatus: "Verified",
      missionQuestId: input.missionQuestId,
      reviewedAt: new Date(),
      reviewedById: input.reviewerId,
    },
    update: {
      verificationStatus: "Verified",
      awardedById: input.reviewerId,
      missionQuestId: input.missionQuestId,
      reviewedAt: new Date(),
      reviewedById: input.reviewerId,
    },
  });
  return true;
}

async function awardFactionSupportReputation(userId: string, factionId: string, amount: number) {
  if (amount <= 0) return;

  await prisma.factionMembership.upsert({
    where: { userId_factionId: { userId, factionId } },
    create: {
      userId,
      factionId,
      status: "Approved",
      isPrimary: false,
      reputation: amount,
    },
    update: {
      reputation: { increment: amount },
    },
  });
}

export async function submitMissionProofAction(
  questSlug: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  if (!isApprovedUser(user)) {
    return { success: false, error: "Approved clearance required." };
  }

  const mission = await getMissionDetailForUser(questSlug, user.id);
  if (!mission) return { success: false, error: "Mission not found." };
  if (!mission.canSubmit) {
    return { success: false, error: "Mission record already filed or under review." };
  }

  const fieldIds = mission.submissionFields.map((f) => f.id);
  const requiredFieldIds = mission.submissionFields
    .filter((f) => f.required)
    .map((f) => f.id);
  const packet = collectProofPacket(formData, fieldIds);
  const validationError = validateProofPacket(packet, requiredFieldIds);
  if (validationError) return { success: false, error: validationError };

  const safetyAffirmation =
    packet.safety_affirmation === true || packet.nonviolence_affirmation === true;

  await prisma.missionSubmission.create({
    data: {
      userId: user.id,
      questId: mission.id,
      status: "Pending",
      proofPacket: packet,
      safetyAffirmation,
    },
  });

  await prisma.missionParticipation.upsert({
    where: { userId_questId: { userId: user.id, questId: mission.id } },
    create: { userId: user.id, questId: mission.id, status: "InProgress" },
    update: { status: "InProgress" },
  });

  await writeAuditLog({
    action: "mission.submit",
    actorId: user.id,
    targetType: "quest",
    targetId: mission.id,
    metadata: { slug: questSlug },
  });

  revalidatePath("/mmo/missions");
  revalidatePath(`/mmo/missions/${questSlug}`);
  revalidatePath("/profile");
  revalidatePath("/admin/missions");
  return { success: true };
}

export async function approveMissionSubmissionAction(
  submissionId: string,
  componentBadgeSlugs: string[],
  reviewNote?: string,
): Promise<ActionResult> {
  const reviewer = await requireModeratorUser();
  if (!reviewer.ok) return { success: false, error: "Unauthorized" };

  const submission = await prisma.missionSubmission.findUnique({
    where: { id: submissionId },
    include: {
      quest: { include: { faction: true } },
    },
  });
  if (!submission || submission.status !== "Pending") {
    return { success: false, error: "Submission not found or already reviewed." };
  }

  const packMission = getMissionDefinitionBySlug(submission.quest.slug);
  const requiredSlugs: string[] = Array.isArray(submission.quest.requiredBadgeSlugs)
    ? submission.quest.requiredBadgeSlugs.filter((s): s is string => typeof s === "string")
    : (packMission?.requiredBadgeSlugs ?? []);

  const awarded: string[] = [];
  for (const slug of componentBadgeSlugs) {
    if (!requiredSlugs.includes(slug)) continue;
    const ok = await awardVerifiedBadge({
      userId: submission.userId,
      badgeSlug: slug,
      missionQuestId: submission.questId,
      reviewerId: reviewer.user.id,
    });
    if (ok) awarded.push(slug);
  }

  const verifiedComponentCount = await prisma.userBadge.count({
    where: {
      userId: submission.userId,
      verificationStatus: "Verified",
      badge: {
        slug: { in: requiredSlugs },
        isMissionCompletionBadge: false,
      },
    },
  });

  const allComponentsVerified = verifiedComponentCount >= requiredSlugs.length;
  let missionCompleted = false;
  let reputationAwarded = 0;

  if (allComponentsVerified && submission.quest.completionBadgeSlug) {
    const completionAwarded = await awardVerifiedBadge({
      userId: submission.userId,
      badgeSlug: submission.quest.completionBadgeSlug,
      missionQuestId: submission.questId,
      reviewerId: reviewer.user.id,
    });

    if (completionAwarded) {
      missionCompleted = true;

      const priorCompletion = await prisma.missionParticipation.findUnique({
        where: {
          userId_questId: {
            userId: submission.userId,
            questId: submission.questId,
          },
        },
      });

      if (
        submission.quest.factionId &&
        submission.quest.reputationReward &&
        priorCompletion?.status !== "Completed"
      ) {
        await awardFactionSupportReputation(
          submission.userId,
          submission.quest.factionId,
          submission.quest.reputationReward,
        );
        reputationAwarded = submission.quest.reputationReward;
      }

      await prisma.missionParticipation.upsert({
        where: {
          userId_questId: { userId: submission.userId, questId: submission.questId },
        },
        create: {
          userId: submission.userId,
          questId: submission.questId,
          status: "Completed",
          completedAt: new Date(),
        },
        update: { status: "Completed", completedAt: new Date() },
      });
    }
  }

  await prisma.missionSubmission.update({
    where: { id: submissionId },
    data: {
      status: "Approved",
      reviewedAt: new Date(),
      reviewedById: reviewer.user.id,
      reviewNote: reviewNote?.trim() || null,
    },
  });

  await writeAuditLog({
    action: "mission.review.approve",
    actorId: reviewer.user.id,
    targetType: "mission_submission",
    targetId: submissionId,
    metadata: {
      questSlug: submission.quest.slug,
      awarded,
      missionCompleted,
      reputationAwarded,
    },
  });

  revalidatePath("/admin/missions");
  revalidatePath("/mmo/missions");
  revalidatePath(`/mmo/missions/${submission.quest.slug}`);
  revalidatePath("/profile");
  return { success: true };
}

export async function rejectMissionSubmissionAction(
  submissionId: string,
  reviewNote: string,
): Promise<ActionResult> {
  const reviewer = await requireModeratorUser();
  if (!reviewer.ok) return { success: false, error: "Unauthorized" };
  if (!reviewNote.trim()) {
    return { success: false, error: "Review note required for rejection." };
  }

  const submission = await prisma.missionSubmission.findUnique({
    where: { id: submissionId },
    include: { quest: true },
  });
  if (!submission || submission.status !== "Pending") {
    return { success: false, error: "Submission not found or already reviewed." };
  }

  await prisma.missionSubmission.update({
    where: { id: submissionId },
    data: {
      status: "Rejected",
      reviewedAt: new Date(),
      reviewedById: reviewer.user.id,
      reviewNote: reviewNote.trim(),
    },
  });

  await writeAuditLog({
    action: "mission.review.reject",
    actorId: reviewer.user.id,
    targetType: "mission_submission",
    targetId: submissionId,
    metadata: { questSlug: submission.quest.slug },
  });

  revalidatePath("/admin/missions");
  revalidatePath(`/mmo/missions/${submission.quest.slug}`);
  return { success: true };
}

export async function approveComponentBadgeAction(
  submissionId: string,
  badgeSlug: string,
): Promise<ActionResult> {
  const reviewer = await requireModeratorUser();
  if (!reviewer.ok) return { success: false, error: "Unauthorized" };

  const submission = await prisma.missionSubmission.findUnique({
    where: { id: submissionId },
    include: { quest: true },
  });
  if (!submission) return { success: false, error: "Submission not found." };

  await awardVerifiedBadge({
    userId: submission.userId,
    badgeSlug,
    missionQuestId: submission.questId,
    reviewerId: reviewer.user.id,
  });

  await writeAuditLog({
    action: "mission.badge.verify",
    actorId: reviewer.user.id,
    targetType: "badge",
    targetId: badgeSlug,
    metadata: { submissionId, userId: submission.userId },
  });

  revalidatePath("/admin/missions");
  revalidatePath("/profile");
  return { success: true };
}
