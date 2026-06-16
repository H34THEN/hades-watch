-- First Cipher Set: extended cipher puzzles and badge asset paths

ALTER TABLE "Badge" ADD COLUMN IF NOT EXISTS "cipherSlug" TEXT;
ALTER TABLE "Badge" ADD COLUMN IF NOT EXISTS "tier" TEXT;
ALTER TABLE "Badge" ADD COLUMN IF NOT EXISTS "assetPath" TEXT;

ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "playerBrief" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "puzzleText" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "submissionPrompt" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "hint2" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "finalHint" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "cipherType" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "estimatedTime" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "factionSlug" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "secondaryFactionSlug" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "acceptedAnswerHashes" JSONB;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "answerNormalization" TEXT DEFAULT 'default';
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "explanation" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "successMessage" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "failureMessage" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "rewardBadgeSlug" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "loreUnlockSlug" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "loreUnlockText" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "cipherPack" TEXT;
ALTER TABLE "CipherPuzzle" ADD COLUMN IF NOT EXISTS "repeatable" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "CipherPuzzle_cipherPack_idx" ON "CipherPuzzle"("cipherPack");
CREATE INDEX IF NOT EXISTS "CipherPuzzle_sortOrder_idx" ON "CipherPuzzle"("sortOrder");
