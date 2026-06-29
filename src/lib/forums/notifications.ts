import type { UserNotificationType, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export interface CreateNotificationInput {
  recipientId: string;
  actorId?: string | null;
  type: UserNotificationType;
  title: string;
  body?: string | null;
  targetUrl?: string | null;
  metadata?: Record<string, unknown>;
}

export async function createUserNotification(input: CreateNotificationInput) {
  if (input.actorId && input.actorId === input.recipientId) {
    return null;
  }

  const prefs = await prisma.forumUserPreference.findUnique({
    where: { userId: input.recipientId },
  });

  if (input.type === "FORUM_QUOTE" && prefs?.notifyWhenQuoted === false) {
    return null;
  }
  if (input.type === "FORUM_REPLY" && prefs?.notifyOnDirectReply === false) {
    return null;
  }
  if (input.type === "FORUM_MENTION" && prefs?.notifyOnMention === false) {
    return null;
  }

  return prisma.userNotification.create({
    data: {
      recipientId: input.recipientId,
      actorId: input.actorId ?? null,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      targetUrl: input.targetUrl ?? null,
      metadata: input.metadata ? toJsonValue(input.metadata) : undefined,
    },
  });
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.userNotification.count({
    where: { recipientId: userId, readAt: null },
  });
}

export async function markNotificationRead(notificationId: string, userId: string) {
  return prisma.userNotification.updateMany({
    where: { id: notificationId, recipientId: userId, readAt: null },
    data: { readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.userNotification.updateMany({
    where: { recipientId: userId, readAt: null },
    data: { readAt: new Date() },
  });
}
