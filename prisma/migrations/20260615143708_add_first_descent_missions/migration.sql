-- CreateEnum
CREATE TYPE "MissionDifficulty" AS ENUM ('INITIATE', 'FIELD');

-- CreateEnum
CREATE TYPE "MissionPackMissionType" AS ENUM ('REAL_WORLD_READINESS', 'PRIVACY_LITERACY', 'PREPAREDNESS', 'REPAIR_AND_OPEN_SOURCE', 'CREATIVE_MORALE');

-- CreateEnum
CREATE TYPE "MissionSubmissionType" AS ENUM ('CERTIFICATION_PROOF', 'CHECKLIST_AND_REFLECTION', 'LINK_AND_CHECKLIST', 'TEXT_LINK_OR_UPLOAD');

-- CreateEnum
CREATE TYPE "MissionReviewMode" AS ENUM ('MANUAL', 'MANUAL_OR_AUTOMATED');

-- CreateEnum
CREATE TYPE "MissionSubmissionStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "BadgeVerificationStatus" AS ENUM ('Pending', 'Verified', 'Rejected');

-- DropIndex
DROP INDEX "Announcement_pinned_idx";

-- DropIndex
DROP INDEX "Announcement_priority_idx";

-- DropIndex
DROP INDEX "Asset_type_idx";

-- DropIndex
DROP INDEX "Event_eventType_idx";

-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "isMissionCompletionBadge" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "missionSlug" TEXT,
ADD COLUMN     "placeholderColor" TEXT,
ADD COLUMN     "placeholderText" TEXT,
ADD COLUMN     "profileDisplayCategory" TEXT,
ADD COLUMN     "proofType" TEXT,
ADD COLUMN     "requiredForMissionCompletion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirement" TEXT;

-- AlterTable
ALTER TABLE "DeadDrop" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "completionBadgeSlug" TEXT,
ADD COLUMN     "difficulty" "MissionDifficulty",
ADD COLUMN     "estimatedTime" TEXT,
ADD COLUMN     "loreUnlockSlug" TEXT,
ADD COLUMN     "missionMetadata" JSONB,
ADD COLUMN     "missionPack" TEXT,
ADD COLUMN     "missionType" "MissionPackMissionType",
ADD COLUMN     "nonviolenceClassification" TEXT,
ADD COLUMN     "openToAllFactions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "proofPrivacyNotes" TEXT,
ADD COLUMN     "repeatable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reputationReward" INTEGER,
ADD COLUMN     "requiredBadgeSlugs" JSONB,
ADD COLUMN     "reviewMode" "MissionReviewMode",
ADD COLUMN     "safetyNotes" TEXT,
ADD COLUMN     "submissionType" "MissionSubmissionType",
ADD COLUMN     "visibility" TEXT DEFAULT 'approved';

-- AlterTable
ALTER TABLE "SecretTransmission" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserBadge" ADD COLUMN     "missionQuestId" TEXT,
ADD COLUMN     "reviewNote" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "verificationStatus" "BadgeVerificationStatus" NOT NULL DEFAULT 'Verified';

-- CreateTable
CREATE TABLE "MissionSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" "MissionSubmissionStatus" NOT NULL DEFAULT 'Pending',
    "proofPacket" JSONB,
    "safetyAffirmation" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "reviewNote" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MissionSubmission_status_idx" ON "MissionSubmission"("status");

-- CreateIndex
CREATE INDEX "MissionSubmission_questId_idx" ON "MissionSubmission"("questId");

-- CreateIndex
CREATE INDEX "MissionSubmission_userId_idx" ON "MissionSubmission"("userId");

-- CreateIndex
CREATE INDEX "Quest_missionPack_idx" ON "Quest"("missionPack");

-- CreateIndex
CREATE INDEX "UserBadge_verificationStatus_idx" ON "UserBadge"("verificationStatus");

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionSubmission" ADD CONSTRAINT "MissionSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionSubmission" ADD CONSTRAINT "MissionSubmission_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionSubmission" ADD CONSTRAINT "MissionSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
