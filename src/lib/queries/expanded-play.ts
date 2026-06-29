import type { MmoPlayablePrompt, MmoPlayFunction, MmoPublicWorksTask } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type PromptWithStatus = MmoPlayablePrompt & {
  userCompleted: boolean;
  userPending: boolean;
  userSubmissionId?: string;
};

export type PlayFunctionWithRewards = MmoPlayFunction & {
  rewardPreview: string[];
};

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

async function attachUserStatus(
  prompts: MmoPlayablePrompt[],
  userId?: string,
): Promise<PromptWithStatus[]> {
  if (!userId) {
    return prompts.map((p) => ({ ...p, userCompleted: false, userPending: false }));
  }

  const promptIds = prompts.map((p) => p.id);
  const submissions = await prisma.mmoPlayableSubmission.findMany({
    where: {
      userId,
      promptId: { in: promptIds },
      status: { in: ["APPROVED", "AUTO_COMPLETED", "PENDING"] },
    },
    orderBy: { createdAt: "desc" },
  });

  return prompts.map((prompt) => {
    const relevant = submissions.filter((s) => s.promptId === prompt.id);
    const latest = relevant[0];
    const cooldownStart =
      prompt.repeatability === "weekly" || prompt.cooldown === "weekly"
        ? startOfWeek()
        : startOfDay();

    const inWindow = relevant.filter((s) => s.createdAt >= cooldownStart);
    const completed = inWindow.some((s) => s.status === "APPROVED" || s.status === "AUTO_COMPLETED");
    const pending = inWindow.some((s) => s.status === "PENDING");

    return {
      ...prompt,
      userCompleted: completed,
      userPending: pending && !completed,
      userSubmissionId: latest?.id,
    };
  });
}

export async function getPlayFunctions(): Promise<PlayFunctionWithRewards[]> {
  const functions = await prisma.mmoPlayFunction.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return functions.map((fn) => ({
    ...fn,
    rewardPreview: ["reputation", "badges", "avatar unlocks", "field logs"].slice(0, 3),
  }));
}

export async function getPlayFunctionBySlug(slug: string) {
  return prisma.mmoPlayFunction.findUnique({ where: { slug } });
}

export async function getPromptsByFunction(
  functionSlug: string,
  options?: { userId?: string; factionSlug?: string },
): Promise<PromptWithStatus[]> {
  const prompts = await prisma.mmoPlayablePrompt.findMany({
    where: {
      functionSlug,
      status: "active",
      ...(options?.factionSlug ? { factionSlug: options.factionSlug } : {}),
    },
    orderBy: { sortOrder: "asc" },
  });
  return attachUserStatus(prompts, options?.userId);
}

export async function getPromptBySlug(slug: string, userId?: string) {
  const prompt = await prisma.mmoPlayablePrompt.findUnique({ where: { slug } });
  if (!prompt) return null;
  const [withStatus] = await attachUserStatus([prompt], userId);
  return withStatus ?? null;
}

export async function getTodayHighlightedDailySignal(userId?: string) {
  const prompts = await getPromptsByFunction("daily-signals", { userId });
  const dayIndex = Math.floor(Date.now() / 86400000) % Math.max(prompts.length, 1);
  return prompts[dayIndex] ?? prompts[0] ?? null;
}

export async function getPublicWorksTasks(options?: {
  taskType?: string;
  userId?: string;
}): Promise<(MmoPublicWorksTask & { userPending?: boolean })[]> {
  const tasks = await prisma.mmoPublicWorksTask.findMany({
    where: {
      status: "open",
      ...(options?.taskType ? { taskType: options.taskType as MmoPublicWorksTask["taskType"] } : {}),
    },
    orderBy: { sortOrder: "asc" },
  });

  if (!options?.userId) return tasks;

  const slugs = tasks.map((t) => t.slug);
  const submissions = await prisma.mmoPlayableSubmission.findMany({
    where: {
      userId: options.userId,
      status: "PENDING",
      proofText: { in: slugs },
    },
  });
  const pendingSlugs = new Set(submissions.map((s) => s.proofText).filter(Boolean));

  return tasks.map((t) => ({ ...t, userPending: pendingSlugs.has(t.slug) }));
}

export async function getPublicWorksTaskBySlug(slug: string) {
  return prisma.mmoPublicWorksTask.findUnique({ where: { slug } });
}

export async function getVisitors() {
  return prisma.mmoVisitor.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSeasonalEvents() {
  return prisma.mmoSeasonalEvent.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSeasonalEventBySlug(slug: string) {
  return prisma.mmoSeasonalEvent.findUnique({ where: { slug } });
}

export async function getRelicSets() {
  return prisma.mmoRelicSet.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getRoomStateDefinitions(roomSlug?: string) {
  return prisma.mmoRoomStateDefinition.findMany({
    where: roomSlug ? { roomSlug } : undefined,
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPendingPlaySubmissions(limit = 50) {
  return prisma.mmoPlayableSubmission.findMany({
    where: { status: "PENDING" },
    include: {
      prompt: { select: { title: true, slug: true, functionSlug: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
