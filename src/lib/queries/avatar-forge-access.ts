import { prisma } from "@/lib/prisma";

export type AvatarForgeAccessView = {
  status: "none" | "pending" | "approved" | "rejected" | "revoked";
  reviewNote: string | null;
  unlocked: boolean;
  codeExpiresAt: Date | null;
  requestedAt: Date | null;
};

export async function getAvatarForgeAccessForUser(userId: string): Promise<AvatarForgeAccessView> {
  const row = await prisma.avatarForgeAccessRequest.findUnique({ where: { userId } });
  if (!row) {
    return {
      status: "none",
      reviewNote: null,
      unlocked: false,
      codeExpiresAt: null,
      requestedAt: null,
    };
  }

  const statusMap = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    REVOKED: "revoked",
  } as const;

  return {
    status: statusMap[row.status],
    reviewNote: row.reviewNote,
    unlocked: !!row.unlockedAt,
    codeExpiresAt: row.codeExpiresAt,
    requestedAt: row.requestedAt,
  };
}

export async function listAvatarForgeAccessRequests(status?: "PENDING" | "APPROVED" | "REJECTED" | "REVOKED") {
  return prisma.avatarForgeAccessRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { requestedAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          character: { select: { callsign: true } },
        },
      },
      reviewedBy: { select: { email: true, name: true } },
    },
  });
}
