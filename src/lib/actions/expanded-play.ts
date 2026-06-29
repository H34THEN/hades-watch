"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import { recordReputationEvent } from "@/lib/community/reputation";
import { prisma } from "@/lib/prisma";

export interface ExpandedPlayActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

async function getPlayerLabel(userId: string): Promise<string> {
  const character = await prisma.character.findUnique({
    where: { userId },
    select: { callsign: true },
  });
  if (character?.callsign) return character.callsign;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
  return user?.name ?? "An operative";
}

function startOfDay(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function hasRecentCompletion(userId: string, promptId: string, repeatability: string, cooldown?: string | null) {
  const since =
    repeatability === "weekly" || cooldown === "weekly" ? startOfWeek() : startOfDay();
  const existing = await prisma.mmoPlayableSubmission.findFirst({
    where: {
      userId,
      promptId,
      createdAt: { gte: since },
      status: { in: ["APPROVED", "AUTO_COMPLETED", "PENDING"] },
    },
  });
  return !!existing;
}

async function createFieldLog(userId: string, characterId: string | null, template: string) {
  const player = await getPlayerLabel(userId);
  const message = template.replace("[callsign]", player);
  await prisma.mmoFieldLog.create({
    data: {
      userId,
      characterId,
      message,
      visibility: "approved_users",
      status: "ACTIVE",
    },
  });
}

async function grantPromptReputation(
  userId: string,
  prompt: { reputationCategory: string | null; reputationPoints: number; slug: string; metadata: unknown },
) {
  const meta = prompt.metadata as { noRepFarm?: boolean } | null;
  if (meta?.noRepFarm || !prompt.reputationCategory || prompt.reputationPoints <= 0) return;

  await recordReputationEvent({
    userId,
    category: prompt.reputationCategory as Parameters<typeof recordReputationEvent>[0]["category"],
    points: prompt.reputationPoints,
    reason: `Expanded play: ${prompt.slug}`,
    sourceType: "play_prompt",
    sourceId: prompt.slug,
  });
}

export async function completePlayablePromptAction(
  promptSlug: string,
  input?: { body?: string; url?: string; proofText?: string },
): Promise<ExpandedPlayActionResult> {
  const user = await requireAuth();
  const prompt = await prisma.mmoPlayablePrompt.findUnique({ where: { slug: promptSlug } });
  if (!prompt) return { success: false, error: "Prompt not found." };

  if (await hasRecentCompletion(user.id, prompt.id, prompt.repeatability, prompt.cooldown)) {
    return { success: false, error: "Cooldown active for this prompt." };
  }

  const character = await prisma.character.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  const readOnlyActions = new Set([
    "READ_SIGNAL",
    "VISIT_ARCHIVE",
    "VISIT_FACTION_FLOOR",
    "JOIN_DISCUSSION",
    "VISIT_PROFILE_WORLD",
    "READ_NET_NEIGHBOR",
    "OPEN_DEAD_DROP",
    "VISIT_SIGNAL_PLAYER",
    "REST_SIGNAL",
    "MARK_COMPLETE",
    "ATTEMPT_CIPHER",
  ]);

  const needsBody = !readOnlyActions.has(prompt.actionType) && prompt.actionType !== "REST_SIGNAL";
  if (needsBody && !input?.body?.trim() && !input?.url?.trim() && !input?.proofText?.trim()) {
    return { success: false, error: "A response is required for this prompt." };
  }

  const autoComplete = !prompt.reviewRequired && (readOnlyActions.has(prompt.actionType) || prompt.actionType === "REST_SIGNAL");
  const status = autoComplete ? "AUTO_COMPLETED" : "PENDING";
  const visibility = prompt.reviewRequired ? "private" : "approved_users";

  await prisma.mmoPlayableSubmission.create({
    data: {
      promptId: prompt.id,
      userId: user.id,
      characterId: character?.id ?? null,
      body: input?.body?.slice(0, 2000) ?? null,
      url: input?.url?.slice(0, 500) ?? null,
      proofText: input?.proofText?.slice(0, 2000) ?? null,
      status,
      visibility,
    },
  });

  if (autoComplete && prompt.fieldLogTemplate) {
    await createFieldLog(user.id, character?.id ?? null, prompt.fieldLogTemplate);
    await grantPromptReputation(user.id, prompt);
  } else if (status === "PENDING" && prompt.fieldLogTemplate) {
    const player = await getPlayerLabel(user.id);
    await prisma.mmoFieldLog.create({
      data: {
        userId: user.id,
        characterId: character?.id ?? null,
        message: `${player} submitted a response for review.`,
        visibility: "private",
        status: "ACTIVE",
      },
    });
  }

  revalidatePath("/mmo/daily-signals");
  revalidatePath("/mmo/faction-calls");
  revalidatePath("/mmo/assignments");
  revalidatePath("/community/forums/quests");
  revalidatePath("/archive/hunts");
  revalidatePath("/community/public-works");
  revalidatePath("/mmo/field-log");

  if (status === "PENDING") {
    return { success: true, message: "Submission sealed and routed for steward review." };
  }
  if (prompt.actionType === "REST_SIGNAL") {
    return { success: true, message: "Rest logged. Rest counts. No penalty." };
  }
  return { success: true, message: "Signal acknowledged. Field Log updated." };
}

export async function submitPublicWorksTaskAction(
  taskSlug: string,
  input: { body: string; url?: string },
): Promise<ExpandedPlayActionResult> {
  const user = await requireAuth();
  if (!isApprovedUser(user)) {
    return { success: false, error: "Operative approval required." };
  }

  const task = await prisma.mmoPublicWorksTask.findUnique({ where: { slug: taskSlug } });
  if (!task) return { success: false, error: "Task not found." };
  if (!input.body?.trim()) return { success: false, error: "Completion note required." };

  const pwPrompt = await prisma.mmoPlayablePrompt.findFirst({
    where: { slug: "assignment-public-works-first-step" },
  });

  const character = await prisma.character.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (pwPrompt) {
    await prisma.mmoPlayableSubmission.create({
      data: {
        promptId: pwPrompt.id,
        userId: user.id,
        characterId: character?.id ?? null,
        body: input.body.slice(0, 2000),
        url: input.url?.slice(0, 500) ?? null,
        proofText: taskSlug,
        status: "PENDING",
        visibility: "private",
      },
    });
  }

  const player = await getPlayerLabel(user.id);
  await prisma.mmoFieldLog.create({
    data: {
      userId: user.id,
      characterId: character?.id ?? null,
      message: `${player} submitted a Public Works completion for review: ${task.title}.`,
      visibility: "private",
      status: "ACTIVE",
    },
  });

  revalidatePath("/community/public-works");
  revalidatePath("/admin/archivist");
  return { success: true, message: "Public Works submission routed for review." };
}

export async function reviewPlayableSubmissionAction(
  submissionId: string,
  decision: "APPROVED" | "REJECTED" | "NEEDS_REVISION",
  reviewNote?: string,
): Promise<ExpandedPlayActionResult> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Authentication required." };

  const roles = user.roles ?? [];
  if (!isModerator(roles)) {
    return { success: false, error: "Steward clearance required." };
  }

  const submission = await prisma.mmoPlayableSubmission.findUnique({
    where: { id: submissionId },
    include: { prompt: true },
  });
  if (!submission) return { success: false, error: "Submission not found." };

  await prisma.mmoPlayableSubmission.update({
    where: { id: submissionId },
    data: {
      status: decision,
      reviewedById: user.id,
      reviewedAt: new Date(),
      reviewNote: reviewNote?.slice(0, 500) ?? null,
      visibility: decision === "APPROVED" ? "approved_users" : "private",
    },
  });

  if (decision === "APPROVED" && submission.prompt.fieldLogTemplate) {
    await createFieldLog(
      submission.userId,
      submission.characterId,
      submission.prompt.fieldLogTemplate,
    );
    await grantPromptReputation(submission.userId, submission.prompt);
  }

  revalidatePath("/admin/archivist");
  revalidatePath("/mmo/play");
  return { success: true, message: `Submission ${decision.toLowerCase().replace("_", " ")}.` };
}
