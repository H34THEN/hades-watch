import "dotenv/config";
import { existsSync } from "fs";
import { join } from "path";
import type { Prisma } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import {
  FIRST_CIPHER_BADGES,
  FIRST_CIPHER_PUZZLES,
  FIRST_CIPHER_SET_PACK_ID,
} from "../../src/lib/ciphers/first-cipher-set";
import { hashCipherAnswerVariants } from "../../src/lib/ciphers/normalize";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const publicRoot = join(process.cwd(), "public");

function resolveAssetPath(relativePath: string | undefined): string | null {
  if (!relativePath) return null;
  const diskPath = join(publicRoot, relativePath.replace(/^\//, ""));
  return existsSync(diskPath) ? relativePath : null;
}

async function main() {
  console.log("Seeding First Cipher Set...\n");

  const oracular = await prisma.faction.findUnique({
    where: { slug: "oracular-circuit" },
    select: { id: true },
  });
  if (!oracular) {
    throw new Error("Missing oracular-circuit faction. Run: npm run db:seed:factions");
  }

  for (const badge of FIRST_CIPHER_BADGES) {
    const assetPath = resolveAssetPath(badge.assetPath);
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        description: badge.description,
        factionId: oracular.id,
        tier: badge.tier,
        cipherSlug: badge.cipherSlug,
        assetPath,
        placeholderText: badge.placeholderText,
        placeholderColor: badge.placeholderColor,
        profileDisplayCategory: "Ciphers",
        requirement: badge.flavorText,
        proofType: "Automatic on cipher solve",
      },
      create: {
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        factionId: oracular.id,
        tier: badge.tier,
        cipherSlug: badge.cipherSlug,
        assetPath,
        placeholderText: badge.placeholderText,
        placeholderColor: badge.placeholderColor,
        profileDisplayCategory: "Ciphers",
        requirement: badge.flavorText,
        proofType: "Automatic on cipher solve",
      },
    });
    console.log(`  ✓ badge: ${badge.slug}`);
  }

  for (const cipher of FIRST_CIPHER_PUZZLES) {
    const acceptedAnswerHashes = hashCipherAnswerVariants(
      cipher.acceptedAnswerVariants,
      cipher.answerNormalization,
    );
    const solutionHash = acceptedAnswerHashes[0] ?? null;

    await prisma.cipherPuzzle.upsert({
      where: { slug: cipher.slug },
      update: {
        title: cipher.title,
        prompt: cipher.playerBrief,
        playerBrief: cipher.playerBrief,
        puzzleText: cipher.puzzleText,
        submissionPrompt: cipher.submissionPrompt,
        hint: cipher.hint1,
        hint2: cipher.hint2,
        finalHint: cipher.finalHint,
        difficulty: cipher.difficulty,
        cipherType: cipher.cipherType,
        estimatedTime: cipher.estimatedTime,
        factionSlug: cipher.factionSlug,
        secondaryFactionSlug: cipher.secondaryFactionSlug,
        solutionHash,
        acceptedAnswerHashes: acceptedAnswerHashes as unknown as Prisma.InputJsonValue,
        answerNormalization: cipher.answerNormalization,
        explanation: cipher.explanation,
        successMessage: cipher.successMessage,
        failureMessage: cipher.failureMessage,
        rewardBadgeSlug: cipher.rewardBadgeSlug,
        loreUnlockSlug: cipher.loreUnlockSlug,
        loreUnlockText: cipher.loreUnlockText,
        sortOrder: cipher.sortOrder,
        cipherPack: FIRST_CIPHER_SET_PACK_ID,
        repeatable: false,
        status: "Active",
      },
      create: {
        slug: cipher.slug,
        title: cipher.title,
        prompt: cipher.playerBrief,
        playerBrief: cipher.playerBrief,
        puzzleText: cipher.puzzleText,
        submissionPrompt: cipher.submissionPrompt,
        hint: cipher.hint1,
        hint2: cipher.hint2,
        finalHint: cipher.finalHint,
        difficulty: cipher.difficulty,
        cipherType: cipher.cipherType,
        estimatedTime: cipher.estimatedTime,
        factionSlug: cipher.factionSlug,
        secondaryFactionSlug: cipher.secondaryFactionSlug,
        solutionHash,
        acceptedAnswerHashes: acceptedAnswerHashes as unknown as Prisma.InputJsonValue,
        answerNormalization: cipher.answerNormalization,
        explanation: cipher.explanation,
        successMessage: cipher.successMessage,
        failureMessage: cipher.failureMessage,
        rewardBadgeSlug: cipher.rewardBadgeSlug,
        loreUnlockSlug: cipher.loreUnlockSlug,
        loreUnlockText: cipher.loreUnlockText,
        sortOrder: cipher.sortOrder,
        cipherPack: FIRST_CIPHER_SET_PACK_ID,
        repeatable: false,
        status: "Active",
      },
    });
    console.log(`  ✓ cipher: ${cipher.slug}`);
  }

  console.log("\nFirst Cipher Set seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
