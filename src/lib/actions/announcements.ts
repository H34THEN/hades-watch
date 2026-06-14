"use server";

import { revalidatePath } from "next/cache";
import type { RoleName } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { matchesAudience } from "@/lib/audience";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/lib/validations/announcements";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function getPublishedTransmissions(userRoles: RoleName[]) {
  const all = await prisma.announcement.findMany({
    where: { status: "Published" },
    orderBy: [
      { pinned: "desc" },
      { priority: "desc" },
      { publishedAt: "desc" },
    ],
    include: { author: { select: { name: true, email: true } } },
  });

  return all.filter((a) => matchesAudience(a.audienceRole, userRoles));
}

export async function getAllAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: { author: { select: { name: true, email: true } } },
  });
}

export async function createAnnouncementAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    priority: formData.get("priority") || "Normal",
    pinned: formData.get("pinned") === "on",
    audienceRole: formData.get("audienceRole") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid announcement data",
    };
  }

  const announcement = await prisma.announcement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      priority: parsed.data.priority,
      pinned: parsed.data.pinned,
      audienceRole: (parsed.data.audienceRole as RoleName) ?? null,
      authorId: admin.id,
      status: "Draft",
    },
  });

  await writeAuditLog({
    action: "announcement.create",
    actorId: admin.id,
    targetType: "announcement",
    targetId: announcement.id,
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/dashboard/transmissions");
  return { success: true };
}

export async function updateAnnouncementAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const id = formData.get("id") as string;

  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    priority: formData.get("priority") || "Normal",
    pinned: formData.get("pinned") === "on",
    audienceRole: formData.get("audienceRole") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid announcement data",
    };
  }

  await prisma.announcement.update({
    where: { id },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      priority: parsed.data.priority,
      pinned: parsed.data.pinned,
      audienceRole: (parsed.data.audienceRole as RoleName) ?? null,
    },
  });

  await writeAuditLog({
    action: "announcement.update",
    actorId: admin.id,
    targetType: "announcement",
    targetId: id,
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/dashboard/transmissions");
  return { success: true };
}

export async function publishAnnouncementAction(
  id: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  await prisma.announcement.update({
    where: { id },
    data: { status: "Published", publishedAt: new Date() },
  });

  await writeAuditLog({
    action: "announcement.publish",
    actorId: admin.id,
    targetType: "announcement",
    targetId: id,
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/dashboard/transmissions");
  return { success: true };
}

export async function archiveAnnouncementAction(
  id: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  await prisma.announcement.update({
    where: { id },
    data: { status: "Archived" },
  });

  await writeAuditLog({
    action: "announcement.archive",
    actorId: admin.id,
    targetType: "announcement",
    targetId: id,
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/dashboard/transmissions");
  return { success: true };
}

export async function unpublishAnnouncementAction(
  id: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  await prisma.announcement.update({
    where: { id },
    data: { status: "Draft", publishedAt: null },
  });

  await writeAuditLog({
    action: "announcement.update",
    actorId: admin.id,
    targetType: "announcement",
    targetId: id,
    metadata: { action: "unpublish" },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/dashboard/transmissions");
  return { success: true };
}
