"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { generateRandomChatAlias, validateChatAlias } from "@/lib/chat/aliases";
import {
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_MESSAGE_RETENTION_HOURS,
} from "@/lib/chat/constants";
import {
  getActiveChatMessages,
  getChatRoomBySlug,
  getRecentChatPresence,
  purgeExpiredChatMessages,
} from "@/lib/chat/queries";
import { isModerator } from "@/lib/auth/roles";
import { requireApprovedAuth } from "@/lib/auth/session";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export interface ChatMessageDto {
  id: string;
  alias: string;
  body: string;
  createdAt: string;
  userId: string;
  isOwn: boolean;
}

export async function generateChatAliasAction(): Promise<ActionResult<{ alias: string }>> {
  await requireApprovedAuth();
  return { success: true, data: { alias: generateRandomChatAlias() } };
}

export async function fetchChatRoomStateAction(roomSlug: string): Promise<
  ActionResult<{
    messages: ChatMessageDto[];
    presence: string[];
  }>
> {
  const user = await requireApprovedAuth();
  const room = await getChatRoomBySlug(roomSlug);
  if (!room) return { success: false, error: "Room not found." };

  await purgeExpiredChatMessages();

  const [messages, presence] = await Promise.all([
    getActiveChatMessages(room.id),
    getRecentChatPresence(room.id),
  ]);

  return {
    success: true,
    data: {
      messages: messages.map((m) => ({
        id: m.id,
        alias: m.alias,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
        userId: m.userId,
        isOwn: m.userId === user.id,
      })),
      presence,
    },
  };
}

export async function postChatMessageAction(
  roomSlug: string,
  alias: string,
  body: string,
): Promise<ActionResult> {
  const user = await requireApprovedAuth();

  try {
    await rateLimitOrThrow(
      { key: `chat:${user.id}`, limit: 30, windowSec: 60 },
      "Slow down. Too many messages.",
    );
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Rate limited." };
  }

  const room = await getChatRoomBySlug(roomSlug);
  if (!room) return { success: false, error: "Room not found." };

  const aliasResult = validateChatAlias(alias);
  if (!aliasResult.ok) return { success: false, error: aliasResult.error };

  const trimmed = body.trim();
  if (!trimmed || trimmed.length < 1) {
    return { success: false, error: "Message cannot be empty." };
  }
  if (trimmed.length > CHAT_MESSAGE_MAX_LENGTH) {
    return { success: false, error: `Message exceeds ${CHAT_MESSAGE_MAX_LENGTH} characters.` };
  }

  const expiresAt = new Date(Date.now() + CHAT_MESSAGE_RETENTION_HOURS * 60 * 60 * 1000);

  await prisma.chatMessage.create({
    data: {
      roomId: room.id,
      userId: user.id,
      alias: aliasResult.alias,
      body: trimmed,
      expiresAt,
    },
  });

  await writeAuditLog({
    action: "chat.message.post",
    actorId: user.id,
    metadata: { roomSlug, alias: aliasResult.alias },
  });

  revalidatePath("/chat");
  revalidatePath(`/chat/${roomSlug}`);
  return { success: true };
}

export async function deleteChatMessageAction(messageId: string): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
  if (!message || message.deletedAt) {
    return { success: false, error: "Message not found." };
  }

  const canModerate = isModerator(user.roles);
  if (message.userId !== user.id && !canModerate) {
    return { success: false, error: "Insufficient clearance." };
  }

  await prisma.chatMessage.update({
    where: { id: messageId },
    data: { deletedAt: new Date(), deletedById: user.id },
  });

  await writeAuditLog({
    action: "chat.message.delete",
    actorId: user.id,
    metadata: { messageId },
  });

  revalidatePath("/chat");
  return { success: true };
}

export async function clearChatRoomAction(roomSlug: string): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  if (!isModerator(user.roles)) {
    return { success: false, error: "Moderator clearance required." };
  }

  const room = await getChatRoomBySlug(roomSlug);
  if (!room) return { success: false, error: "Room not found." };

  await prisma.chatMessage.updateMany({
    where: { roomId: room.id, deletedAt: null },
    data: { deletedAt: new Date(), deletedById: user.id },
  });

  await writeAuditLog({
    action: "chat.room.clear",
    actorId: user.id,
    metadata: { roomSlug },
  });

  revalidatePath("/chat");
  revalidatePath(`/chat/${roomSlug}`);
  return { success: true };
}
