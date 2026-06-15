import { prisma } from "@/lib/prisma";
import type { NetNeighborStatus } from "@/generated/prisma/client";

export async function getApprovedNetNeighbors() {
  return prisma.netNeighbor.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      url: true,
      description: true,
      bannerPath: true,
      bannerUrl: true,
      tags: true,
    },
  });
}

export async function getPendingNetNeighbors() {
  return prisma.netNeighbor.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      submittedBy: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function countPendingNetNeighbors() {
  return prisma.netNeighbor.count({ where: { status: "PENDING" } });
}

export async function getNetNeighborById(id: string) {
  return prisma.netNeighbor.findUnique({ where: { id } });
}

export async function updateNetNeighborStatus(
  id: string,
  status: NetNeighborStatus,
  reviewedById: string,
  reviewNote?: string,
) {
  return prisma.netNeighbor.update({
    where: { id },
    data: {
      status,
      reviewedById,
      reviewedAt: new Date(),
      reviewNote: reviewNote?.trim() || null,
    },
  });
}
