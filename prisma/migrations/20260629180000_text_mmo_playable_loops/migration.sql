-- CreateEnum
CREATE TYPE "MmoRoomType" AS ENUM ('social_hub', 'dead_drop_hub', 'cipher_hub', 'faction_floor', 'archive_hub', 'command_layer', 'event_room', 'guild_room');
CREATE TYPE "MmoRoomState" AS ENUM ('quiet', 'active', 'crowded', 'locked', 'rotating_drop_live', 'cipher_open', 'faction_call_active', 'archive_trace_detected', 'moderation_review_required');
CREATE TYPE "MmoAccessLevel" AS ENUM ('public', 'logged_in', 'approved_user', 'admin', 'owner');
CREATE TYPE "MmoActionType" AS ENUM ('READ_SIGNAL', 'POST_FIELD_NOTE', 'SUBMIT_DEAD_DROP', 'SOLVE_CIPHER', 'SUBMIT_RESOURCE', 'VISIT_ARCHIVE', 'JOIN_DISCUSSION', 'OFFER_HELP', 'CREATE_LORE_FRAGMENT', 'SUBMIT_ACCESSIBILITY_NOTE', 'SUBMIT_NET_NEIGHBOR', 'REQUEST_GUILD');
CREATE TYPE "MmoDropType" AS ENUM ('field_note', 'lore_fragment', 'resource_link', 'mini_cipher', 'accessibility_note', 'zine_line', 'net_neighbor_lead', 'repo_relic', 'community_question', 'mission_hook', 'archive_artifact', 'safe_care_action_idea');
CREATE TYPE "MmoSubmissionType" AS ENUM ('short_text', 'long_text', 'url_plus_summary', 'multiple_choice', 'cipher_answer', 'no_submission_read_only');
CREATE TYPE "MmoRepeatability" AS ENUM ('one_time', 'daily', 'weekly', 'rotating', 'repeatable_with_cooldown', 'always_available');
CREATE TYPE "MmoDropSubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'NEEDS_REVISION', 'REJECTED', 'AUTO_COMPLETED', 'ARCHIVED');
CREATE TYPE "MmoFieldLogVisibility" AS ENUM ('public', 'approved_users', 'guild_only', 'private');
CREATE TYPE "MmoFieldLogStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'REMOVED', 'PRIVATE');
CREATE TYPE "MmoLootType" AS ENUM ('title', 'badge', 'relic', 'profile_cosmetic', 'avatar_item', 'room_access', 'lore_fragment', 'forum_flair', 'guild_banner', 'signal_player_unlock', 'relic_zone_module', 'net_neighbor_banner_part', 'faction_flair');
CREATE TYPE "MmoLootRarity" AS ENUM ('common', 'uncommon', 'rare', 'relic', 'mythic');

ALTER TYPE "ReputationCategory" ADD VALUE IF NOT EXISTS 'FACTION';
ALTER TYPE "ReputationCategory" ADD VALUE IF NOT EXISTS 'RECOGNITION';

-- CreateTable
CREATE TABLE "MmoRoom" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "entryText" TEXT NOT NULL,
    "roomType" "MmoRoomType" NOT NULL,
    "primaryFactionSlug" TEXT,
    "secondaryFactionSlugs" JSONB,
    "accessLevel" "MmoAccessLevel" NOT NULL DEFAULT 'logged_in',
    "status" TEXT NOT NULL DEFAULT 'active',
    "state" "MmoRoomState" NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "mvpPriority" TEXT NOT NULL DEFAULT 'phase-1',
    "safetyNote" TEXT,
    "emptyStateText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoRoom_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoRoomAction" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "actionType" "MmoActionType" NOT NULL,
    "targetRoute" TEXT,
    "accessLevel" "MmoAccessLevel" NOT NULL DEFAULT 'logged_in',
    "rewardBadgeSlug" TEXT,
    "rewardReputationCategory" "ReputationCategory",
    "rewardReputationPoints" INTEGER NOT NULL DEFAULT 0,
    "reputationEventSlug" TEXT,
    "cooldownSeconds" INTEGER NOT NULL DEFAULT 0,
    "reviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoRoomAction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoDeadDrop" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "loopSlug" TEXT NOT NULL,
    "roomSlug" TEXT,
    "factionSlug" TEXT,
    "dropType" "MmoDropType" NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'initiate',
    "repeatability" "MmoRepeatability" NOT NULL DEFAULT 'one_time',
    "reviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "submissionType" "MmoSubmissionType" NOT NULL,
    "playerPrompt" TEXT NOT NULL,
    "successText" TEXT NOT NULL,
    "failureText" TEXT NOT NULL,
    "loreNote" TEXT,
    "safetyNote" TEXT,
    "rewardBadgeSlug" TEXT,
    "rewardReputationCategory" "ReputationCategory",
    "rewardReputationPoints" INTEGER NOT NULL DEFAULT 0,
    "rewardLootSlug" TEXT,
    "loreUnlockSlug" TEXT,
    "answerHash" TEXT,
    "acceptedAnswerHashes" JSONB,
    "optionsJson" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoDeadDrop_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoDeadDropSubmission" (
    "id" TEXT NOT NULL,
    "deadDropId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "body" TEXT,
    "url" TEXT,
    "summary" TEXT,
    "selectedOption" TEXT,
    "normalizedAnswerHash" TEXT,
    "status" "MmoDropSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "visibility" "MmoFieldLogVisibility" NOT NULL DEFAULT 'approved_users',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoDeadDropSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoFieldLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "roomId" TEXT,
    "deadDropId" TEXT,
    "actionType" "MmoActionType",
    "message" TEXT NOT NULL,
    "visibility" "MmoFieldLogVisibility" NOT NULL DEFAULT 'approved_users',
    "status" "MmoFieldLogStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MmoFieldLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoLoot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "MmoLootType" NOT NULL,
    "rarity" "MmoLootRarity" NOT NULL DEFAULT 'common',
    "description" TEXT,
    "flavorText" TEXT,
    "displayLocation" TEXT,
    "sourceLoopSlug" TEXT,
    "unlockCondition" TEXT,
    "assetPath" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoLoot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoLootGrant" (
    "id" TEXT NOT NULL,
    "lootId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "sourceType" TEXT,
    "sourceSlug" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MmoLootGrant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoLoreUnlock" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "flavorText" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoLoreUnlock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoLoreUnlockGrant" (
    "id" TEXT NOT NULL,
    "loreUnlockId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" TEXT,
    "sourceSlug" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MmoLoreUnlockGrant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MmoRoom_slug_key" ON "MmoRoom"("slug");
CREATE UNIQUE INDEX "MmoRoomAction_roomId_slug_key" ON "MmoRoomAction"("roomId", "slug");
CREATE UNIQUE INDEX "MmoDeadDrop_slug_key" ON "MmoDeadDrop"("slug");
CREATE INDEX "MmoDeadDropSubmission_deadDropId_idx" ON "MmoDeadDropSubmission"("deadDropId");
CREATE INDEX "MmoDeadDropSubmission_userId_idx" ON "MmoDeadDropSubmission"("userId");
CREATE INDEX "MmoDeadDropSubmission_status_idx" ON "MmoDeadDropSubmission"("status");
CREATE INDEX "MmoFieldLog_userId_createdAt_idx" ON "MmoFieldLog"("userId", "createdAt");
CREATE UNIQUE INDEX "MmoLoot_slug_key" ON "MmoLoot"("slug");
CREATE UNIQUE INDEX "MmoLootGrant_userId_lootId_key" ON "MmoLootGrant"("userId", "lootId");
CREATE UNIQUE INDEX "MmoLoreUnlock_slug_key" ON "MmoLoreUnlock"("slug");
CREATE UNIQUE INDEX "MmoLoreUnlockGrant_userId_loreUnlockId_key" ON "MmoLoreUnlockGrant"("userId", "loreUnlockId");

ALTER TABLE "MmoRoomAction" ADD CONSTRAINT "MmoRoomAction_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "MmoRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoDeadDrop" ADD CONSTRAINT "MmoDeadDrop_roomSlug_fkey" FOREIGN KEY ("roomSlug") REFERENCES "MmoRoom"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MmoDeadDropSubmission" ADD CONSTRAINT "MmoDeadDropSubmission_deadDropId_fkey" FOREIGN KEY ("deadDropId") REFERENCES "MmoDeadDrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoDeadDropSubmission" ADD CONSTRAINT "MmoDeadDropSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoDeadDropSubmission" ADD CONSTRAINT "MmoDeadDropSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MmoFieldLog" ADD CONSTRAINT "MmoFieldLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoFieldLog" ADD CONSTRAINT "MmoFieldLog_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "MmoRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MmoFieldLog" ADD CONSTRAINT "MmoFieldLog_deadDropId_fkey" FOREIGN KEY ("deadDropId") REFERENCES "MmoDeadDrop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MmoLootGrant" ADD CONSTRAINT "MmoLootGrant_lootId_fkey" FOREIGN KEY ("lootId") REFERENCES "MmoLoot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoLootGrant" ADD CONSTRAINT "MmoLootGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoLoreUnlockGrant" ADD CONSTRAINT "MmoLoreUnlockGrant_loreUnlockId_fkey" FOREIGN KEY ("loreUnlockId") REFERENCES "MmoLoreUnlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoLoreUnlockGrant" ADD CONSTRAINT "MmoLoreUnlockGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
