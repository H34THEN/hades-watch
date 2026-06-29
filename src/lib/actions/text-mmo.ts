"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { isModerator } from "@/lib/auth/roles";
import { getApprovedUserForAction, getSessionUser, requireAuth } from "@/lib/auth/session";
import {
  canCompleteDropAgain,
  createMmoFieldLog,
  getPlayerLabel,
  grantDropRewards,
  grantRoomActionRewards,
  hasCompletedDrop,
} from "@/lib/mmo/text-mmo-rewards";
import {
  hashMmoCipherAnswer,
  sanitizeMmoText,
  validateMmoUrl,
  MMO_TEXT_MAX_LONG,
  MMO_TEXT_MAX_SHORT,
} from "@/lib/mmo/text-mmo-validation";
import { prisma } from "@/lib/prisma";

export type TextMmoActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

function parseOptionsJson(raw: unknown): { options: Array<{ id: string; label: string }>; correctId: string } | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as { options?: unknown; correctId?: string };
  if (!Array.isArray(data.options) || !data.correctId) return null;
  return {
    options: data.options as Array<{ id: string; label: string }>,
    correctId: data.correctId,
  };
}

export async function performRoomActionAction(
  roomSlug: string,
  actionSlug: string,
): Promise<TextMmoActionResult> {
  const user = await requireAuth();
  const room = await prisma.mmoRoom.findUnique({
    where: { slug: roomSlug },
    include: { actions: true },
  });
  if (!room) return { success: false, error: "Room not found." };

  const action = room.actions.find((a) => a.slug === actionSlug && a.isActive);
  if (!action) return { success: false, error: "Action not available." };

  if (action.targetRoute) {
    return { success: true, message: "Route action — navigate via link." };
  }

  if (action.actionType !== "READ_SIGNAL" && action.actionType !== "OFFER_HELP") {
    return { success: false, error: "Use the dedicated submission flow for this action." };
  }

  const character = await prisma.character.findUnique({
    where: { userId: user.id },
    select: { id: true, callsign: true },
  });
  const player = await getPlayerLabel(user.id);
  const message = `${player} ${action.label.toLowerCase()} in ${room.title}.`;

  await grantRoomActionRewards({
    userId: user.id,
    characterId: character?.id,
    roomId: room.id,
    action,
    fieldLogMessage: message,
  });

  revalidatePath(`/mmo/rooms/${roomSlug}`);
  revalidatePath("/mmo/field-log");
  return { success: true, message: "Signal recorded in Field Log." };
}

export async function submitMmoDeadDropAction(
  dropSlug: string,
  formData: FormData,
): Promise<TextMmoActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) return { success: false, error: auth.error };
  const user = auth;

  const drop = await prisma.mmoDeadDrop.findUnique({ where: { slug: dropSlug } });
  if (!drop || drop.status !== "active") return { success: false, error: "Dead Drop not found." };

  if (!(await canCompleteDropAgain(user.id, drop))) {
    return { success: false, error: "This Dead Drop has already been completed for this period." };
  }

  const character = await prisma.character.findUnique({
    where: { userId: user.id },
    select: { id: true, callsign: true },
  });
  const player = await getPlayerLabel(user.id);

  if (drop.submissionType === "no_submission_read_only") {
    return { success: false, error: "Use Mark Remembered for this drop." };
  }

  let status: "PENDING" | "AUTO_COMPLETED" | "REJECTED" = drop.reviewRequired ? "PENDING" : "AUTO_COMPLETED";
  let body: string | null = null;
  let url: string | null = null;
  let summary: string | null = null;
  let selectedOption: string | null = null;
  let normalizedAnswerHash: string | null = null;

  if (drop.submissionType === "short_text" || drop.submissionType === "long_text") {
    const max = drop.submissionType === "short_text" ? MMO_TEXT_MAX_SHORT : MMO_TEXT_MAX_LONG;
    body = sanitizeMmoText(String(formData.get("body") ?? ""), max);
    if (body.length < 4) return { success: false, error: "Response too short." };
  }

  if (drop.submissionType === "url_plus_summary") {
    const urlRaw = String(formData.get("url") ?? "");
    const validated = validateMmoUrl(urlRaw);
    if (!validated.ok) return { success: false, error: validated.error };
    url = validated.url;
    summary = sanitizeMmoText(String(formData.get("summary") ?? ""), MMO_TEXT_MAX_SHORT);
    if (!summary || summary.length < 10) {
      return { success: false, error: "Summary is required (at least 10 characters)." };
    }
  }

  if (drop.submissionType === "multiple_choice") {
    selectedOption = String(formData.get("selectedOption") ?? "").trim();
    const opts = parseOptionsJson(drop.optionsJson);
    if (!opts || !selectedOption) return { success: false, error: "Select an option." };
    if (selectedOption !== opts.correctId) {
      return { success: false, error: drop.failureText };
    }
    status = "AUTO_COMPLETED";
  }

  if (drop.submissionType === "cipher_answer") {
    const answer = String(formData.get("answer") ?? "");
    normalizedAnswerHash = hashMmoCipherAnswer(answer);
    const hashes = (drop.acceptedAnswerHashes as string[] | null) ?? [];
    if (drop.answerHash && normalizedAnswerHash === drop.answerHash) {
      status = "AUTO_COMPLETED";
    } else if (hashes.includes(normalizedAnswerHash)) {
      status = "AUTO_COMPLETED";
    } else {
      return { success: false, error: drop.failureText };
    }
  }

  const submission = await prisma.mmoDeadDropSubmission.create({
    data: {
      deadDropId: drop.id,
      userId: user.id,
      characterId: character?.id ?? null,
      body,
      url,
      summary,
      selectedOption,
      normalizedAnswerHash,
      status,
      visibility: drop.reviewRequired ? "private" : "approved_users",
    },
  });

  if (status === "AUTO_COMPLETED") {
    await grantDropRewards({
      userId: user.id,
      characterId: character?.id,
      drop,
      submissionStatus: status,
      fieldLogMessage: `${player} completed Dead Drop: ${drop.title}.`,
      roomId: drop.roomSlug
        ? (await prisma.mmoRoom.findUnique({ where: { slug: drop.roomSlug }, select: { id: true } }))?.id
        : null,
    });
  } else if (status === "PENDING") {
    await createMmoFieldLog({
      userId: user.id,
      characterId: character?.id,
      deadDropId: drop.id,
      actionType: "SUBMIT_DEAD_DROP",
      message: `${player} submitted a Dead Drop for review.`,
      visibility: "approved_users",
    });
  }

  await writeAuditLog({
    action: "mmo.dead_drop.submit",
    actorId: user.id,
    targetType: "mmo_dead_drop_submission",
    targetId: submission.id,
  });

  revalidatePath("/mmo/dead-drops");
  revalidatePath(`/mmo/dead-drops/${dropSlug}`);
  revalidatePath("/mmo/field-log");

  if (status === "PENDING") {
    return {
      success: true,
      message: "Your drop has been sealed in black wax and routed to a steward.",
    };
  }
  return { success: true, message: drop.successText };
}

export async function markDeadDropRememberedAction(dropSlug: string): Promise<TextMmoActionResult> {
  const user = await requireAuth();
  const drop = await prisma.mmoDeadDrop.findUnique({ where: { slug: dropSlug } });
  if (!drop) return { success: false, error: "Dead Drop not found." };
  if (drop.submissionType !== "no_submission_read_only") {
    return { success: false, error: "This drop requires a submission." };
  }
  if (await hasCompletedDrop(user.id, drop.id)) {
    return { success: false, error: "Already marked remembered." };
  }

  const character = await prisma.character.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  const player = await getPlayerLabel(user.id);

  await prisma.mmoDeadDropSubmission.create({
    data: {
      deadDropId: drop.id,
      userId: user.id,
      characterId: character?.id ?? null,
      status: "AUTO_COMPLETED",
      visibility: "approved_users",
    },
  });

  await grantDropRewards({
    userId: user.id,
    characterId: character?.id,
    drop,
    submissionStatus: "AUTO_COMPLETED",
    fieldLogMessage: `${player} marked lore remembered: ${drop.title}.`,
  });

  revalidatePath(`/mmo/dead-drops/${dropSlug}`);
  revalidatePath("/mmo/field-log");
  return { success: true, message: drop.successText };
}

export async function reviewMmoDeadDropSubmissionAction(
  submissionId: string,
  decision: "APPROVED" | "REJECTED" | "NEEDS_REVISION",
  reviewNote?: string,
): Promise<TextMmoActionResult> {
  const user = await getSessionUser();
  if (!user || !isModerator(user.roles)) {
    return { success: false, error: "Moderator clearance required." };
  }

  const submission = await prisma.mmoDeadDropSubmission.findUnique({
    where: { id: submissionId },
    include: { deadDrop: true },
  });
  if (!submission) return { success: false, error: "Submission not found." };

  await prisma.mmoDeadDropSubmission.update({
    where: { id: submissionId },
    data: {
      status: decision,
      reviewedById: user.id,
      reviewedAt: new Date(),
      reviewNote: reviewNote?.slice(0, 500) ?? null,
      visibility: decision === "APPROVED" ? "approved_users" : "private",
    },
  });

  if (decision === "APPROVED") {
    const player = await getPlayerLabel(submission.userId);
    await grantDropRewards({
      userId: submission.userId,
      characterId: submission.characterId,
      drop: submission.deadDrop,
      submissionStatus: "APPROVED",
      fieldLogMessage: `${player}'s Dead Drop was approved: ${submission.deadDrop.title}.`,
    });
  }

  revalidatePath("/admin/mmo-submissions");
  revalidatePath("/mmo/dead-drops");
  return { success: true };
}

export async function hideMmoFieldLogAction(logId: string): Promise<TextMmoActionResult> {
  const user = await getSessionUser();
  if (!user || !isModerator(user.roles)) {
    return { success: false, error: "Moderator clearance required." };
  }
  await prisma.mmoFieldLog.update({
    where: { id: logId },
    data: { status: "HIDDEN" },
  });
  revalidatePath("/mmo/field-log");
  return { success: true };
}
