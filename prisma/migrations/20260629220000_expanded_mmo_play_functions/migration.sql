-- Expanded Text MMO Play Functions

CREATE TYPE "MmoPlayActionType" AS ENUM (
  'READ_SIGNAL',
  'POST_FIELD_NOTE',
  'VISIT_ARCHIVE',
  'ATTEMPT_CIPHER',
  'VISIT_FACTION_FLOOR',
  'JOIN_DISCUSSION',
  'VISIT_PROFILE_WORLD',
  'READ_NET_NEIGHBOR',
  'OPEN_DEAD_DROP',
  'VISIT_SIGNAL_PLAYER',
  'ANSWER_PROMPT',
  'SUBMIT_FEEDBACK',
  'REST_SIGNAL',
  'SUBMIT_RESOURCE',
  'SUBMIT_LORE',
  'SUBMIT_PUBLIC_WORK',
  'SUBMIT_FORUM_QUEST',
  'COMPLETE_ASSIGNMENT',
  'MARK_COMPLETE'
);

CREATE TYPE "MmoPlayPromptStatus" AS ENUM ('draft', 'active', 'retired', 'seasonal');

CREATE TYPE "MmoPublicWorksTaskType" AS ENUM (
  'bug',
  'accessibility',
  'documentation',
  'avatar_asset_need',
  'badge_asset_need',
  'lore_prompt',
  'forum_category',
  'ghost_in_tech_summary',
  'net_neighbor_button',
  'profile_theme',
  'mobile_qa',
  'safety_copy',
  'seed_data',
  'event_idea',
  'guild_support'
);

CREATE TYPE "MmoPublicWorksTaskStatus" AS ENUM ('open', 'in_progress', 'closed');

ALTER TYPE "RewardSourceType" ADD VALUE IF NOT EXISTS 'play_prompt';

CREATE TABLE "MmoPlayFunction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "primaryRoute" TEXT NOT NULL,
    "connectedSystems" JSONB NOT NULL DEFAULT '[]',
    "primaryPlayType" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL DEFAULT 'approved-user',
    "repeatability" TEXT NOT NULL,
    "reviewRequirement" TEXT NOT NULL,
    "mvpPriority" TEXT NOT NULL DEFAULT 'phase-3',
    "description" TEXT,
    "loreFraming" TEXT,
    "playerFantasy" TEXT,
    "safetyNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoPlayFunction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoPlayablePrompt" (
    "id" TEXT NOT NULL,
    "functionSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "actionType" "MmoPlayActionType" NOT NULL,
    "category" TEXT,
    "factionSlug" TEXT,
    "connectedRoute" TEXT,
    "difficulty" TEXT,
    "repeatability" TEXT NOT NULL DEFAULT 'daily',
    "cooldown" TEXT,
    "reviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "proofStyle" TEXT,
    "rewardSummary" TEXT,
    "badgeHook" TEXT,
    "avatarUnlockHook" TEXT,
    "reputationCategory" "ReputationCategory",
    "reputationPoints" INTEGER NOT NULL DEFAULT 0,
    "fieldLogTemplate" TEXT,
    "safetyNote" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "status" "MmoPlayPromptStatus" NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoPlayablePrompt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoPlayableSubmission" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "body" TEXT,
    "url" TEXT,
    "selectedOption" TEXT,
    "proofText" TEXT,
    "status" "MmoDropSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "visibility" "MmoFieldLogVisibility" NOT NULL DEFAULT 'private',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoPlayableSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoPublicWorksTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "taskType" "MmoPublicWorksTaskType" NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "estimatedTime" TEXT,
    "ownerRole" TEXT,
    "description" TEXT NOT NULL,
    "acceptanceCriteria" TEXT,
    "rewardSummary" TEXT,
    "badgeHook" TEXT,
    "avatarUnlockHook" TEXT,
    "reviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "status" "MmoPublicWorksTaskStatus" NOT NULL DEFAULT 'open',
    "safetyNote" TEXT,
    "assetNeedPath" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoPublicWorksTask_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoRelicSet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fragmentsNeeded" JSONB NOT NULL DEFAULT '[]',
    "completedRelicName" TEXT NOT NULL,
    "profileDisplayEffect" TEXT,
    "avatarUnlockHook" TEXT,
    "badgeHook" TEXT,
    "safetyNote" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoRelicSet_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoRoomStateDefinition" (
    "id" TEXT NOT NULL,
    "stateName" TEXT NOT NULL,
    "roomSlug" TEXT,
    "trigger" TEXT,
    "roomCopy" TEXT,
    "visualEffect" TEXT,
    "rewardHook" TEXT,
    "safetyNote" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoRoomStateDefinition_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoVisitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "appearanceText" TEXT NOT NULL,
    "roomSlug" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "rewardSummary" TEXT,
    "loreUnlock" TEXT,
    "avatarItem" TEXT,
    "fieldLogText" TEXT,
    "safetyNote" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoVisitor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MmoSeasonalEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "seasonTiming" TEXT,
    "eventRooms" JSONB NOT NULL DEFAULT '[]',
    "eventPrompts" JSONB NOT NULL DEFAULT '[]',
    "eventRewards" TEXT,
    "badges" JSONB NOT NULL DEFAULT '[]',
    "profileCosmetics" JSONB NOT NULL DEFAULT '[]',
    "avatarUnlocks" JSONB NOT NULL DEFAULT '[]',
    "guildHooks" TEXT,
    "safetyNotes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MmoSeasonalEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MmoPlayFunction_slug_key" ON "MmoPlayFunction"("slug");
CREATE INDEX "MmoPlayFunction_isActive_sortOrder_idx" ON "MmoPlayFunction"("isActive", "sortOrder");

CREATE UNIQUE INDEX "MmoPlayablePrompt_slug_key" ON "MmoPlayablePrompt"("slug");
CREATE INDEX "MmoPlayablePrompt_functionSlug_status_sortOrder_idx" ON "MmoPlayablePrompt"("functionSlug", "status", "sortOrder");
CREATE INDEX "MmoPlayablePrompt_factionSlug_idx" ON "MmoPlayablePrompt"("factionSlug");

CREATE INDEX "MmoPlayableSubmission_promptId_userId_createdAt_idx" ON "MmoPlayableSubmission"("promptId", "userId", "createdAt");
CREATE INDEX "MmoPlayableSubmission_userId_status_idx" ON "MmoPlayableSubmission"("userId", "status");
CREATE INDEX "MmoPlayableSubmission_status_createdAt_idx" ON "MmoPlayableSubmission"("status", "createdAt");

CREATE UNIQUE INDEX "MmoPublicWorksTask_slug_key" ON "MmoPublicWorksTask"("slug");
CREATE INDEX "MmoPublicWorksTask_taskType_status_idx" ON "MmoPublicWorksTask"("taskType", "status");

CREATE UNIQUE INDEX "MmoRelicSet_slug_key" ON "MmoRelicSet"("slug");

CREATE UNIQUE INDEX "MmoRoomStateDefinition_roomSlug_stateName_key" ON "MmoRoomStateDefinition"("roomSlug", "stateName");
CREATE INDEX "MmoRoomStateDefinition_roomSlug_idx" ON "MmoRoomStateDefinition"("roomSlug");

CREATE UNIQUE INDEX "MmoVisitor_slug_key" ON "MmoVisitor"("slug");

CREATE UNIQUE INDEX "MmoSeasonalEvent_slug_key" ON "MmoSeasonalEvent"("slug");

ALTER TABLE "MmoPlayablePrompt" ADD CONSTRAINT "MmoPlayablePrompt_functionSlug_fkey" FOREIGN KEY ("functionSlug") REFERENCES "MmoPlayFunction"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MmoPlayableSubmission" ADD CONSTRAINT "MmoPlayableSubmission_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "MmoPlayablePrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoPlayableSubmission" ADD CONSTRAINT "MmoPlayableSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MmoPlayableSubmission" ADD CONSTRAINT "MmoPlayableSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
