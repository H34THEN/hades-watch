import { prisma } from "@/lib/prisma";

export async function getActiveChatRooms() {
  return prisma.chatRoom.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      sortOrder: true,
    },
  });
}

export async function getChatRoomBySlug(slug: string) {
  return prisma.chatRoom.findFirst({
    where: { slug, isActive: true },
  });
}

export async function getActiveChatMessages(roomId: string, limit = 80) {
  const now = new Date();
  return prisma.chatMessage.findMany({
    where: {
      roomId,
      deletedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: {
      id: true,
      alias: true,
      body: true,
      createdAt: true,
      userId: true,
    },
  });
}

export async function getRecentChatPresence(roomId: string, windowMinutes = 15) {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  const rows = await prisma.chatMessage.findMany({
    where: {
      roomId,
      deletedAt: null,
      expiresAt: { gt: new Date() },
      createdAt: { gte: since },
    },
    distinct: ["alias"],
    select: { alias: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });
  return rows.map((r) => r.alias);
}

export async function purgeExpiredChatMessages(): Promise<number> {
  const result = await prisma.chatMessage.deleteMany({
    where: { expiresAt: { lte: new Date() } },
  });
  return result.count;
}
