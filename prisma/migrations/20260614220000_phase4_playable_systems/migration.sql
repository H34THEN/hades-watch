-- Phase 4: Playable Systems + Moderation Workflow

-- CreateEnum
CREATE TYPE "FactionMembershipStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Left');
CREATE TYPE "LoreStatus" AS ENUM ('Draft', 'Published', 'Archived');
CREATE TYPE "DeadDropStatus" AS ENUM ('Draft', 'Active', 'Expired', 'Archived');
CREATE TYPE "CipherStatus" AS ENUM ('Draft', 'Active', 'Archived');

-- QuestStatus: add Available
ALTER TYPE "QuestStatus" ADD VALUE IF NOT EXISTS 'Available';

-- ModerationReportStatus: migrate Reviewed->Reviewing, Actioned->Resolved
CREATE TYPE "ModerationReportStatus_new" AS ENUM ('Open', 'Reviewing', 'Resolved', 'Dismissed');

ALTER TABLE "ModerationReport" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ModerationReport" ALTER COLUMN "status" TYPE "ModerationReportStatus_new" USING (
  CASE "status"::text
    WHEN 'Reviewed' THEN 'Reviewing'::"ModerationReportStatus_new"
    WHEN 'Actioned' THEN 'Resolved'::"ModerationReportStatus_new"
    ELSE "status"::text::"ModerationReportStatus_new"
  END
);

DROP TYPE "ModerationReportStatus";
ALTER TYPE "ModerationReportStatus_new" RENAME TO "ModerationReportStatus";
ALTER TABLE "ModerationReport" ALTER COLUMN "status" SET DEFAULT 'Open';

-- ModerationReport: assignment + resolution
ALTER TABLE "ModerationReport" ADD COLUMN "assignedToId" TEXT;
ALTER TABLE "ModerationReport" ADD COLUMN "resolutionNote" TEXT;

CREATE INDEX "ModerationReport_assignedToId_idx" ON "ModerationReport"("assignedToId");

ALTER TABLE "ModerationReport" ADD CONSTRAINT "ModerationReport_assignedToId_fkey"
  FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Character: expand fields + one character per user
ALTER TABLE "Character" ADD COLUMN "pronouns" TEXT;
ALTER TABLE "Character" ADD COLUMN "bio" TEXT;
ALTER TABLE "Character" ADD COLUMN "archetype" TEXT;
ALTER TABLE "Character" ADD COLUMN "avatarUrl" TEXT;
ALTER TABLE "Character" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT true;

DROP INDEX IF EXISTS "Character_userId_callsign_key";
CREATE UNIQUE INDEX "Character_userId_key" ON "Character"("userId");

-- Faction: slug
ALTER TABLE "Faction" ADD COLUMN "slug" TEXT;

UPDATE "Faction" SET "slug" = lower(regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g'))
WHERE "slug" IS NULL;

ALTER TABLE "Faction" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Faction_slug_key" ON "Faction"("slug");

-- Quest: slug
ALTER TABLE "Quest" ADD COLUMN "slug" TEXT;

UPDATE "Quest" SET "slug" = lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g'))
WHERE "slug" IS NULL;

ALTER TABLE "Quest" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Quest_slug_key" ON "Quest"("slug");

-- DeadDrop: expand fields
ALTER TABLE "DeadDrop" ADD COLUMN "slug" TEXT;
ALTER TABLE "DeadDrop" ADD COLUMN "title" TEXT;
ALTER TABLE "DeadDrop" ADD COLUMN "status" "DeadDropStatus" NOT NULL DEFAULT 'Active';
ALTER TABLE "DeadDrop" ADD COLUMN "expiresAt" TIMESTAMP(3);
ALTER TABLE "DeadDrop" ADD COLUMN "createdById" TEXT;
ALTER TABLE "DeadDrop" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "DeadDrop" SET
  "slug" = lower(regexp_replace("codename", '[^a-zA-Z0-9]+', '-', 'g')),
  "title" = "codename"
WHERE "slug" IS NULL;

ALTER TABLE "DeadDrop" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "DeadDrop" ALTER COLUMN "title" SET NOT NULL;

CREATE UNIQUE INDEX "DeadDrop_slug_key" ON "DeadDrop"("slug");
CREATE INDEX "DeadDrop_status_idx" ON "DeadDrop"("status");

ALTER TABLE "DeadDrop" ADD CONSTRAINT "DeadDrop_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeadDrop" DROP COLUMN IF EXISTS "claimedAt";
DROP INDEX IF EXISTS "DeadDrop_codename_idx";

-- SecretTransmission: expand fields
ALTER TABLE "SecretTransmission" ADD COLUMN "slug" TEXT;
ALTER TABLE "SecretTransmission" ADD COLUMN "status" "DeadDropStatus" NOT NULL DEFAULT 'Active';
ALTER TABLE "SecretTransmission" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "SecretTransmission" SET
  "slug" = lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g'))
WHERE "slug" IS NULL;

ALTER TABLE "SecretTransmission" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "SecretTransmission_slug_key" ON "SecretTransmission"("slug");
CREATE INDEX "SecretTransmission_status_idx" ON "SecretTransmission"("status");

ALTER TABLE "SecretTransmission" DROP COLUMN IF EXISTS "claimedAt";
DROP INDEX IF EXISTS "SecretTransmission_expiresAt_idx";

-- FactionMembership
CREATE TABLE "FactionMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "factionId" TEXT NOT NULL,
    "status" "FactionMembershipStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactionMembership_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FactionMembership_userId_factionId_key" ON "FactionMembership"("userId", "factionId");
CREATE INDEX "FactionMembership_status_idx" ON "FactionMembership"("status");

ALTER TABLE "FactionMembership" ADD CONSTRAINT "FactionMembership_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FactionMembership" ADD CONSTRAINT "FactionMembership_factionId_fkey"
  FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- LoreEntry
CREATE TABLE "LoreEntry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "status" "LoreStatus" NOT NULL DEFAULT 'Draft',
    "requiredRole" "RoleName",
    "requiredFactionId" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "LoreEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LoreEntry_slug_key" ON "LoreEntry"("slug");
CREATE INDEX "LoreEntry_status_idx" ON "LoreEntry"("status");
CREATE INDEX "LoreEntry_slug_idx" ON "LoreEntry"("slug");

ALTER TABLE "LoreEntry" ADD CONSTRAINT "LoreEntry_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LoreEntry" ADD CONSTRAINT "LoreEntry_requiredFactionId_fkey"
  FOREIGN KEY ("requiredFactionId") REFERENCES "Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- UserLoreUnlock
CREATE TABLE "UserLoreUnlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loreEntryId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLoreUnlock_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserLoreUnlock_userId_loreEntryId_key" ON "UserLoreUnlock"("userId", "loreEntryId");

ALTER TABLE "UserLoreUnlock" ADD CONSTRAINT "UserLoreUnlock_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserLoreUnlock" ADD CONSTRAINT "UserLoreUnlock_loreEntryId_fkey"
  FOREIGN KEY ("loreEntryId") REFERENCES "LoreEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CipherPuzzle
CREATE TABLE "CipherPuzzle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "hint" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "solutionHash" TEXT,
    "status" "CipherStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CipherPuzzle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CipherPuzzle_slug_key" ON "CipherPuzzle"("slug");
CREATE INDEX "CipherPuzzle_status_idx" ON "CipherPuzzle"("status");

-- Drop legacy composite index on ModerationReport if present
DROP INDEX IF EXISTS "ModerationReport_targetType_targetId_idx";
