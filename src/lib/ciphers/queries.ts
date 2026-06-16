import { FIRST_CIPHER_SET_PACK_ID } from "@/lib/ciphers/first-cipher-set";
import { prisma } from "@/lib/prisma";

export async function getActiveCiphersForUser(userId: string) {
  const ciphers = await prisma.cipherPuzzle.findMany({
    where: { status: "Active", cipherPack: FIRST_CIPHER_SET_PACK_ID },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      playerBrief: true,
      puzzleText: true,
      prompt: true,
      difficulty: true,
      cipherType: true,
      estimatedTime: true,
      factionSlug: true,
      secondaryFactionSlug: true,
      rewardBadgeSlug: true,
      sortOrder: true,
    },
  });

  const solves = await prisma.cipherSolve.findMany({
    where: {
      userId,
      cipherPuzzleId: { in: ciphers.map((c) => c.id) },
    },
    select: { cipherPuzzleId: true },
  });
  const solvedIds = new Set(solves.map((s) => s.cipherPuzzleId));

  return ciphers.map((cipher) => ({
    ...cipher,
    solved: solvedIds.has(cipher.id),
  }));
}

export async function getAllActiveCiphers() {
  return prisma.cipherPuzzle.findMany({
    where: { status: "Active" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getCipherDetailForUser(slug: string, userId: string) {
  const cipher = await prisma.cipherPuzzle.findUnique({
    where: { slug },
  });
  if (!cipher || cipher.status !== "Active") return null;

  const [solve, badge] = await Promise.all([
    prisma.cipherSolve.findUnique({
      where: { userId_cipherPuzzleId: { userId, cipherPuzzleId: cipher.id } },
    }),
    cipher.rewardBadgeSlug
      ? prisma.badge.findUnique({
          where: { slug: cipher.rewardBadgeSlug },
          select: {
            slug: true,
            name: true,
            tier: true,
            assetPath: true,
            placeholderText: true,
            placeholderColor: true,
            description: true,
          },
        })
      : null,
  ]);

  const solved = !!solve;
  const displayPuzzleText = cipher.puzzleText ?? cipher.prompt;

  return {
    id: cipher.id,
    slug: cipher.slug,
    title: cipher.title,
    playerBrief: cipher.playerBrief,
    puzzleText: displayPuzzleText,
    submissionPrompt: cipher.submissionPrompt,
    hint1: cipher.hint,
    hint2: cipher.hint2,
    finalHint: cipher.finalHint,
    difficulty: cipher.difficulty,
    cipherType: cipher.cipherType,
    estimatedTime: cipher.estimatedTime,
    factionSlug: cipher.factionSlug,
    secondaryFactionSlug: cipher.secondaryFactionSlug,
    rewardBadgeSlug: cipher.rewardBadgeSlug,
    loreUnlockSlug: cipher.loreUnlockSlug,
    loreUnlockText: cipher.loreUnlockText,
    successMessage: cipher.successMessage,
    failureMessage: cipher.failureMessage,
    explanation: solved ? cipher.explanation : null,
    solved,
    solvedAt: solve?.solvedAt ?? null,
    badge,
  };
}

export async function getUserCipherBadges(userId: string) {
  return prisma.userBadge.findMany({
    where: {
      userId,
      badge: { profileDisplayCategory: "Ciphers" },
    },
    include: {
      badge: {
        include: { faction: { select: { name: true, slug: true } } },
      },
    },
    orderBy: { awardedAt: "asc" },
  });
}
