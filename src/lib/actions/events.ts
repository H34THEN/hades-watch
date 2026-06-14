"use server";

import { revalidatePath } from "next/cache";
import type { RoleName } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { matchesAudience } from "@/lib/audience";
import { requireAdmin } from "@/lib/auth/session";
import { buildJitsiUrl, generateJitsiRoomName } from "@/lib/jitsi";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validations/events";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function getPublishedEvents(userRoles: RoleName[]) {
  const now = new Date();
  const all = await prisma.event.findMany({
    where: {
      status: "Published",
      OR: [{ endsAt: null }, { endsAt: { gte: now } }],
    },
    orderBy: { startsAt: "asc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return all.filter((e) => matchesAudience(e.audienceRole, userRoles));
}

export async function getUpcomingEvents(userRoles: RoleName[], limit = 5) {
  const events = await getPublishedEvents(userRoles);
  const now = new Date();
  return events.filter((e) => e.startsAt >= now).slice(0, limit);
}

export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: [{ startsAt: "desc" }],
    include: { createdBy: { select: { name: true, email: true } } },
  });
}

export async function createEventAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    eventType: formData.get("eventType") || "general",
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    location: formData.get("location") || undefined,
    audienceRole: formData.get("audienceRole") || undefined,
    generateJitsi: formData.get("generateJitsi") === "on",
    jitsiPrefix: formData.get("jitsiPrefix") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid event data",
    };
  }

  let jitsiRoomName: string | null = null;
  let virtualUrl: string | null = null;

  if (parsed.data.generateJitsi) {
    jitsiRoomName = generateJitsiRoomName(parsed.data.jitsiPrefix ?? parsed.data.eventType);
    virtualUrl = buildJitsiUrl(jitsiRoomName);
  }

  const event = await prisma.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      eventType: parsed.data.eventType,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
      location: parsed.data.location ?? null,
      audienceRole: (parsed.data.audienceRole as RoleName) ?? null,
      jitsiRoomName,
      virtualUrl,
      createdById: admin.id,
      status: "Draft",
    },
  });

  await writeAuditLog({
    action: "event.create",
    actorId: admin.id,
    targetType: "event",
    targetId: event.id,
    metadata: { jitsi: !!jitsiRoomName },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function updateEventAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const id = formData.get("id") as string;

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    eventType: formData.get("eventType") || "general",
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    location: formData.get("location") || undefined,
    audienceRole: formData.get("audienceRole") || undefined,
    generateJitsi: false,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid event data",
    };
  }

  await prisma.event.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      eventType: parsed.data.eventType,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
      location: parsed.data.location ?? null,
      audienceRole: (parsed.data.audienceRole as RoleName) ?? null,
    },
  });

  await writeAuditLog({
    action: "event.update",
    actorId: admin.id,
    targetType: "event",
    targetId: id,
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function publishEventAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();

  await prisma.event.update({
    where: { id },
    data: { status: "Published" },
  });

  await writeAuditLog({
    action: "event.publish",
    actorId: admin.id,
    targetType: "event",
    targetId: id,
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function cancelEventAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();

  await prisma.event.update({
    where: { id },
    data: { status: "Cancelled", cancelledAt: new Date() },
  });

  await writeAuditLog({
    action: "event.cancel",
    actorId: admin.id,
    targetType: "event",
    targetId: id,
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function archiveEventAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();

  await prisma.event.update({
    where: { id },
    data: { status: "Archived" },
  });

  await writeAuditLog({
    action: "event.update",
    actorId: admin.id,
    targetType: "event",
    targetId: id,
    metadata: { action: "archive" },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function addJitsiToEventAction(
  id: string,
  prefix?: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const jitsiRoomName = generateJitsiRoomName(prefix ?? "meeting");
  const virtualUrl = buildJitsiUrl(jitsiRoomName);

  await prisma.event.update({
    where: { id },
    data: { jitsiRoomName, virtualUrl },
  });

  await writeAuditLog({
    action: "event.update",
    actorId: admin.id,
    targetType: "event",
    targetId: id,
    metadata: { action: "add_jitsi" },
  });

  revalidatePath("/admin/events");
  return { success: true };
}
