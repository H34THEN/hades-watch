"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { isApprovedUser, requireApprovedAuth } from "@/lib/auth/session";
import {
  type CipherAnswerNormalization,
  isCipherAnswerCorrect,
} from "@/lib/ciphers/normalize";
import { getCipherDetailForUser } from "@/lib/ciphers/queries";
import { prisma } from "@/lib/prisma";

export type CipherActionResult =
  | { success: true; solved: boolean; alreadySolved?: boolean }
  | { success: false; error: string };

function parseAcceptedHashes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

async function awardCipherBadge(userId: string, badgeSlug: string) {
  const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } });
  if (!badge) return false;

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (existing) return false;

  await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
      verificationStatus: "Verified",
    },
  });
  return true;
}

export async function submitCipherAnswerAction(
  slug: string,
  answer: string,
): Promise<CipherActionResult> {
  const user = await requireApprovedAuth();
  if (!isApprovedUser(user)) {
    return { success: false, error: "Approved clearance required." };
  }

  const { rateLimitOrThrow } = await import("@/lib/rate-limit");

  try {
    await rateLimitOrThrow(
      {
        key: `cipher:${user.id}:${slug}`,
        limit: 10,
        windowSec: 600,
      },
      "Too many attempts. Wait before trying again.",
    );
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Rate limited",
    };
  }

  const cipher = await prisma.cipherPuzzle.findUnique({ where: { slug } });
  if (!cipher || cipher.status !== "Active") {
    return { success: false, error: "Cipher not available." };
  }

  const existing = await prisma.cipherSolve.findUnique({
    where: { userId_cipherPuzzleId: { userId: user.id, cipherPuzzleId: cipher.id } },
  });
  if (existing) {
    return { success: true, solved: true, alreadySolved: true };
  }

  const acceptedHashes = parseAcceptedHashes(cipher.acceptedAnswerHashes);
  const normalization =
    (cipher.answerNormalization as CipherAnswerNormalization | null) ?? "default";

  let correct = false;
  if (acceptedHashes.length > 0) {
    correct = isCipherAnswerCorrect(answer, acceptedHashes, normalization);
  } else if (cipher.solutionHash) {
    const { hashCipherAnswer } = await import("@/lib/tokens");
    correct = hashCipherAnswer(answer) === cipher.solutionHash;
  }

  if (!correct) {
    return {
      success: false,
      error: cipher.failureMessage ?? "Incorrect answer. Try again.",
    };
  }

  await prisma.cipherSolve.create({
    data: { userId: user.id, cipherPuzzleId: cipher.id, attemptCount: 1 },
  });

  let badgeAwarded = false;
  if (cipher.rewardBadgeSlug) {
    badgeAwarded = await awardCipherBadge(user.id, cipher.rewardBadgeSlug);
  }

  await writeAuditLog({
    action: "cipher.solved",
    actorId: user.id,
    targetType: "cipher",
    targetId: cipher.id,
    metadata: {
      slug,
      badgeSlug: cipher.rewardBadgeSlug,
      badgeAwarded,
    },
  });

  revalidatePath("/ciphers");
  revalidatePath(`/ciphers/${slug}`);
  revalidatePath("/profile");
  return { success: true, solved: true };
}

export async function getCipherSolveState(slug: string) {
  const user = await requireApprovedAuth();
  return getCipherDetailForUser(slug, user.id);
}
