-- CreateEnum
CREATE TYPE "ForumImageSource" AS ENUM ('UPLOADED', 'AVATAR', 'FACTION_ICON', 'GENERATED');

-- CreateEnum
CREATE TYPE "ForumSignatureAssetType" AS ENUM ('BUTTON', 'BANNER');

-- CreateEnum
CREATE TYPE "ForumSignatureSourceType" AS ENUM ('GENERATED', 'UPLOADED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ForumModerationStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "ForumSignatureDisplayMode" AS ENUM ('COMPACT', 'FULL', 'HIDDEN');

-- CreateEnum
CREATE TYPE "UserNotificationType" AS ENUM ('FORUM_QUOTE', 'FORUM_REPLY', 'FORUM_MENTION', 'FORUM_REACTION', 'BADGE_GRANTED', 'RECOGNITION_GRANTED');

-- AlterTable
ALTER TABLE "ForumThread" ADD COLUMN "flair" TEXT;
ALTER TABLE "ForumThread" ADD COLUMN "solved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ForumComment" ADD COLUMN "quotedCommentId" TEXT;
ALTER TABLE "ForumComment" ADD COLUMN "quotedAuthorId" TEXT;
ALTER TABLE "ForumComment" ADD COLUMN "quoteExcerpt" VARCHAR(320);

-- CreateTable
CREATE TABLE "ForumProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "forumImageSource" "ForumImageSource" NOT NULL DEFAULT 'GENERATED',
    "forumImagePath" TEXT,
    "forumImageAlt" TEXT,
    "generatedImageConfig" JSONB,
    "selectedTitleSlug" TEXT,
    "statusLine" VARCHAR(120),
    "factionSlug" TEXT,
    "guildSlug" TEXT,
    "showBadges" BOOLEAN NOT NULL DEFAULT true,
    "showReputation" BOOLEAN NOT NULL DEFAULT true,
    "showProfileWorldLink" BOOLEAN NOT NULL DEFAULT true,
    "signatureText" VARCHAR(500),
    "signatureMode" "ForumSignatureDisplayMode" NOT NULL DEFAULT 'COMPACT',
    "activeButtonId" TEXT,
    "activeBannerId" TEXT,
    "stylePreset" TEXT,
    "hoverEffect" TEXT,
    "moderationStatus" "ForumModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumSignatureAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "assetType" "ForumSignatureAssetType" NOT NULL,
    "sizePreset" TEXT NOT NULL,
    "sourceType" "ForumSignatureSourceType" NOT NULL,
    "imagePath" TEXT,
    "altText" TEXT,
    "textPrimary" TEXT,
    "textSecondary" TEXT,
    "safeConfig" JSONB,
    "moderationStatus" "ForumModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "moderationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumSignatureAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumUserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hideSignatures" BOOLEAN NOT NULL DEFAULT false,
    "reduceMotion" BOOLEAN NOT NULL DEFAULT false,
    "disableHoverEffects" BOOLEAN NOT NULL DEFAULT false,
    "compactAuthorCards" BOOLEAN NOT NULL DEFAULT false,
    "notifyWhenQuoted" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnDirectReply" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnMention" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumUserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" "UserNotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "targetUrl" TEXT,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumProfile_userId_key" ON "ForumProfile"("userId");
CREATE INDEX "ForumProfile_moderationStatus_idx" ON "ForumProfile"("moderationStatus");

-- CreateIndex
CREATE INDEX "ForumSignatureAsset_userId_idx" ON "ForumSignatureAsset"("userId");
CREATE INDEX "ForumSignatureAsset_moderationStatus_idx" ON "ForumSignatureAsset"("moderationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ForumUserPreference_userId_key" ON "ForumUserPreference"("userId");

-- CreateIndex
CREATE INDEX "UserNotification_recipientId_readAt_idx" ON "UserNotification"("recipientId", "readAt");
CREATE INDEX "UserNotification_recipientId_createdAt_idx" ON "UserNotification"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "ForumComment_quotedCommentId_idx" ON "ForumComment"("quotedCommentId");

-- AddForeignKey
ALTER TABLE "ForumComment" ADD CONSTRAINT "ForumComment_quotedCommentId_fkey" FOREIGN KEY ("quotedCommentId") REFERENCES "ForumComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ForumComment" ADD CONSTRAINT "ForumComment_quotedAuthorId_fkey" FOREIGN KEY ("quotedAuthorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumProfile" ADD CONSTRAINT "ForumProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumProfile" ADD CONSTRAINT "ForumProfile_activeButtonId_fkey" FOREIGN KEY ("activeButtonId") REFERENCES "ForumSignatureAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ForumProfile" ADD CONSTRAINT "ForumProfile_activeBannerId_fkey" FOREIGN KEY ("activeBannerId") REFERENCES "ForumSignatureAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumSignatureAsset" ADD CONSTRAINT "ForumSignatureAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumSignatureAsset" ADD CONSTRAINT "ForumSignatureAsset_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ForumProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumUserPreference" ADD CONSTRAINT "ForumUserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
