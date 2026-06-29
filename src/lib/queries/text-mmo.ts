import { prisma } from "@/lib/prisma";

export async function getMmoRooms() {
  return prisma.mmoRoom.findMany({
    where: { status: "active" },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { deadDrops: true, actions: true } },
    },
  });
}

export async function getMmoRoomBySlug(slug: string) {
  return prisma.mmoRoom.findUnique({
    where: { slug },
    include: {
      actions: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      deadDrops: { where: { status: "active" }, orderBy: { sortOrder: "asc" } },
      fieldLogs: {
        where: { status: "ACTIVE", visibility: { in: ["public", "approved_users"] } },
        orderBy: { createdAt: "desc" },
        take: 12,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              character: { select: { callsign: true } },
            },
          },
        },
      },
    },
  });
}

export async function getMmoDeadDrops(filters?: {
  loopSlug?: string;
  userId?: string;
}) {
  const drops = await prisma.mmoDeadDrop.findMany({
    where: { status: "active" },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  if (!filters?.userId) return drops.map((d) => ({ ...d, userCompleted: false, userPending: false }));

  const subs = await prisma.mmoDeadDropSubmission.findMany({
    where: { userId: filters.userId },
    select: { deadDropId: true, status: true },
  });
  const byDrop = new Map(subs.map((s) => [s.deadDropId, s.status]));

  return drops
    .filter((d) => !filters.loopSlug || d.loopSlug === filters.loopSlug)
    .map((d) => ({
      ...d,
      userCompleted: ["AUTO_COMPLETED", "APPROVED"].includes(byDrop.get(d.id) ?? ""),
      userPending: byDrop.get(d.id) === "PENDING",
    }));
}

export async function getMmoDeadDropBySlug(slug: string, userId?: string) {
  const drop = await prisma.mmoDeadDrop.findUnique({ where: { slug } });
  if (!drop) return null;

  let userSubmission = null;
  if (userId) {
    userSubmission = await prisma.mmoDeadDropSubmission.findFirst({
      where: { userId, deadDropId: drop.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return { drop, userSubmission };
}

export async function getMmoFieldLogs(userId: string, viewerId: string, isModerator: boolean) {
  const isOwner = userId === viewerId;
  const visibilityFilter = isOwner || isModerator
    ? undefined
    : { in: ["public" as const, "approved_users" as const] };

  return prisma.mmoFieldLog.findMany({
    where: {
      userId,
      status: "ACTIVE",
      ...(visibilityFilter ? { visibility: visibilityFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      room: { select: { title: true, slug: true } },
      deadDrop: { select: { title: true, slug: true } },
    },
  });
}

export async function getRecentPublicFieldLogs(limit = 20) {
  return prisma.mmoFieldLog.findMany({
    where: {
      status: "ACTIVE",
      visibility: { in: ["public", "approved_users"] },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          character: { select: { callsign: true } },
        },
      },
      room: { select: { title: true, slug: true } },
    },
  });
}

export async function getPendingMmoSubmissions() {
  return prisma.mmoDeadDropSubmission.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      deadDrop: { select: { title: true, slug: true, dropType: true } },
      user: { select: { name: true, email: true, character: { select: { callsign: true } } } },
    },
  });
}
