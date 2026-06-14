"use server";

import { revalidatePath } from "next/cache";
import type { ModerationReportStatus } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { requireModeratorUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

const reportSchema = z.object({
  targetType: z.string().min(1).max(64),
  targetId: z.string().min(1).max(128),
  reason: z.string().min(10).max(5000),
});

const noteSchema = z.object({
  userId: z.string().min(1),
  body: z.string().min(3).max(5000),
});

export async function getModerationStats() {
  const [open, reviewing, resolved, dismissed, totalReports, notes] =
    await Promise.all([
      prisma.moderationReport.count({ where: { status: "Open" } }),
      prisma.moderationReport.count({ where: { status: "Reviewing" } }),
      prisma.moderationReport.count({ where: { status: "Resolved" } }),
      prisma.moderationReport.count({ where: { status: "Dismissed" } }),
      prisma.moderationReport.count(),
      prisma.moderationNote.count(),
    ]);
  return { open, reviewing, resolved, dismissed, totalReports, notes };
}

export async function getReports(status?: ModerationReportStatus) {
  return prisma.moderationReport.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { id: true, email: true, name: true } },
      assignedTo: { select: { id: true, email: true, name: true } },
      reviewedBy: { select: { id: true, email: true, name: true } },
    },
  });
}

export async function getReportById(id: string) {
  return prisma.moderationReport.findUnique({
    where: { id },
    include: {
      reporter: { select: { id: true, email: true, name: true } },
      assignedTo: { select: { id: true, email: true, name: true } },
      reviewedBy: { select: { id: true, email: true, name: true } },
    },
  });
}

export async function getRecentNotes(limit = 20) {
  return prisma.moderationNote.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      subject: { select: { id: true, email: true, name: true } },
      author: { select: { id: true, email: true, name: true } },
    },
  });
}

export async function getModerationActions(limit = 30) {
  return prisma.auditLog.findMany({
    where: {
      action: {
        startsWith: "moderation.",
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { actor: { select: { email: true, name: true } } },
  });
}

export async function createReportAction(
  formData: FormData,
): Promise<ActionResult> {
  const mod = await requireModeratorUser();
  if (!mod.ok) return { success: false, error: "Unauthorized" };

  const parsed = reportSchema.safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const report = await prisma.moderationReport.create({
    data: {
      ...parsed.data,
      reporterId: mod.user.id,
      status: "Open",
    },
  });

  await writeAuditLog({
    action: "moderation.report.create",
    actorId: mod.user.id,
    targetType: "report",
    targetId: report.id,
  });

  revalidatePath("/moderation");
  revalidatePath("/moderation/reports");
  return { success: true };
}

export async function updateReportStatusAction(
  reportId: string,
  status: ModerationReportStatus,
  resolutionNote?: string,
): Promise<ActionResult> {
  const mod = await requireModeratorUser();
  if (!mod.ok) return { success: false, error: "Unauthorized" };

  await prisma.moderationReport.update({
    where: { id: reportId },
    data: {
      status,
      resolutionNote: resolutionNote ?? undefined,
      reviewedById: mod.user.id,
      reviewedAt: new Date(),
    },
  });

  await writeAuditLog({
    action: "moderation.report.status",
    actorId: mod.user.id,
    targetType: "report",
    targetId: reportId,
    metadata: { status, resolutionNote },
  });

  revalidatePath("/moderation");
  revalidatePath("/moderation/reports");
  revalidatePath(`/moderation/reports/${reportId}`);
  return { success: true };
}

export async function assignReportAction(
  reportId: string,
  assignedToId: string,
): Promise<ActionResult> {
  const mod = await requireModeratorUser();
  if (!mod.ok) return { success: false, error: "Unauthorized" };

  await prisma.moderationReport.update({
    where: { id: reportId },
    data: { assignedToId, status: "Reviewing" },
  });

  await writeAuditLog({
    action: "moderation.report.assign",
    actorId: mod.user.id,
    targetType: "report",
    targetId: reportId,
    metadata: { assignedToId },
  });

  revalidatePath(`/moderation/reports/${reportId}`);
  return { success: true };
}

export async function createModerationNoteAction(
  formData: FormData,
): Promise<ActionResult> {
  const mod = await requireModeratorUser();
  if (!mod.ok) return { success: false, error: "Unauthorized" };

  const parsed = noteSchema.safeParse({
    userId: formData.get("userId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  await prisma.moderationNote.create({
    data: {
      userId: parsed.data.userId,
      body: parsed.data.body,
      authorId: mod.user.id,
    },
  });

  await writeAuditLog({
    action: "moderation.note.create",
    actorId: mod.user.id,
    targetType: "user",
    targetId: parsed.data.userId,
  });

  revalidatePath("/moderation/notes");
  return { success: true };
}

export async function getModerators() {
  const roles = await prisma.role.findMany({
    where: { name: { in: ["Owner", "Admin", "Moderator"] } },
    include: {
      userRoles: {
        include: { user: { select: { id: true, email: true, name: true } } },
      },
    },
  });
  return roles.flatMap((r) => r.userRoles.map((ur) => ur.user));
}

export async function getMmoCounts() {
  const [factions, characters, quests, deadDrops, lore] = await Promise.all([
    prisma.faction.count(),
    prisma.character.count(),
    prisma.quest.count({ where: { status: "Available" } }),
    prisma.deadDrop.count({ where: { status: "Active" } }),
    prisma.loreEntry.count({ where: { status: "Published" } }),
  ]);
  return { factions, characters, quests, deadDrops, lore };
}
