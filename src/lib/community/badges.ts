import { prisma } from "@/lib/prisma";

export async function tryAwardBadgeBySlug(
  userId: string,
  badgeSlug: string,
  awardedById?: string,
): Promise<{ awarded: boolean; badgeId?: string }> {
  const badge = await prisma.badge.findUnique({
    where: { slug: badgeSlug },
    select: { id: true },
  });

  if (!badge) {
    return { awarded: false };
  }

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
    create: {
      userId,
      badgeId: badge.id,
      awardedById: awardedById ?? null,
    },
    update: {},
  });

  return { awarded: true, badgeId: badge.id };
}
