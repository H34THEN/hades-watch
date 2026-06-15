import { prisma } from "@/lib/prisma";
import type { NetNeighborStatus } from "@/generated/prisma/client";
import { parseBannerStyleJson } from "@/lib/net-neighbors/banner-builder";

export interface NetNeighborPublicCard {
  id: string;
  title: string;
  slug: string;
  url: string;
  description: string | null;
  bannerPath: string | null;
  bannerUrl: string | null;
  bannerText: string | null;
  bannerStyle: ReturnType<typeof parseBannerStyleJson>;
  tags: string[];
  sortOrder: number;
  createdAt: Date;
}

function toPublicCard(
  row: {
    id: string;
    title: string;
    slug: string;
    url: string;
    description: string | null;
    bannerPath: string | null;
    bannerUrl: string | null;
    bannerText: string | null;
    bannerStyle: unknown;
    tags: string[];
    sortOrder: number;
    createdAt: Date;
  },
): NetNeighborPublicCard {
  return {
    ...row,
    bannerStyle: parseBannerStyleJson(row.bannerStyle),
  };
}

export async function getApprovedNetNeighbors(): Promise<NetNeighborPublicCard[]> {
  const rows = await prisma.netNeighbor.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      url: true,
      description: true,
      bannerPath: true,
      bannerUrl: true,
      bannerText: true,
      bannerStyle: true,
      tags: true,
      sortOrder: true,
      createdAt: true,
    },
  });
  return rows.map(toPublicCard);
}

export async function getRecentApprovedNetNeighbors(limit = 6) {
  const rows = await prisma.netNeighbor.findMany({
    where: { status: "APPROVED" },
    orderBy: { reviewedAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      url: true,
      description: true,
      bannerPath: true,
      bannerUrl: true,
      bannerText: true,
      bannerStyle: true,
      tags: true,
      sortOrder: true,
      createdAt: true,
    },
  });
  return rows.map(toPublicCard);
}

export async function getUserPendingNetNeighbors(userId: string) {
  return prisma.netNeighbor.findMany({
    where: { submittedById: userId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      url: true,
      status: true,
      createdAt: true,
      bannerPath: true,
      bannerStyle: true,
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

export async function getApprovedNetNeighborsForAdmin() {
  const rows = await prisma.netNeighbor.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      submittedBy: { select: { id: true, name: true, email: true } },
    },
  });
  return rows.map((row) => ({
    ...row,
    bannerStyle: parseBannerStyleJson(row.bannerStyle),
  }));
}

export async function getHiddenNetNeighborsForAdmin() {
  return prisma.netNeighbor.findMany({
    where: { status: "HIDDEN" },
    orderBy: { updatedAt: "desc" },
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
  const data: {
    status: NetNeighborStatus;
    reviewedById: string;
    reviewedAt: Date;
    reviewNote: string | null;
    sortOrder?: number;
  } = {
    status,
    reviewedById,
    reviewedAt: new Date(),
    reviewNote: reviewNote?.trim() || null,
  };

  if (status === "APPROVED") {
    const max = await prisma.netNeighbor.aggregate({
      where: { status: "APPROVED" },
      _max: { sortOrder: true },
    });
    data.sortOrder = (max._max.sortOrder ?? 0) + 1;
  }

  return prisma.netNeighbor.update({
    where: { id },
    data,
  });
}

export async function updateNetNeighborOrder(
  items: { id: string; sortOrder: number }[],
) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.netNeighbor.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    ),
  );
}
