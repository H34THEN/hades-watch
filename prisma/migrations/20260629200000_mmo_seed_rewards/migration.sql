-- MMO seed data and reward system
-- See docs/MMO_SEED_DATA_AND_REWARD_SYSTEM.md

-- Guild: starter guild support
ALTER TABLE "Guild" ALTER COLUMN "founderId" DROP NOT NULL;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "isStarterGuild" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "guildType" TEXT;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "publicMotto" TEXT;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "joinPolicy" TEXT;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "primaryFactionSlug" TEXT;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "secondaryAffinities" JSONB;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "suggestedActivities" TEXT;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "starterRoles" JSONB;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "safetyNotes" TEXT;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "badgeHooks" JSONB;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "imageAssetPath" TEXT;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "bannerAssetPath" TEXT;
ALTER TABLE "Guild" ADD COLUMN IF NOT EXISTS "foundingHook" TEXT;
CREATE INDEX IF NOT EXISTS "Guild_isStarterGuild_idx" ON "Guild"("isStarterGuild");

-- VolunteerOpportunity: extended metadata
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "purpose" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "taskDescription" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "acceptanceCriteria" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "whatNotToSubmit" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "factionAffinity" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "accessLevel" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "reputationRewardPoints" INTEGER;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "reputationCategory" "ReputationCategory";
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "badgeHookSlug" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "avatarUnlockHookSlug" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "imageAssetPath" TEXT;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "reviewRequired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "VolunteerOpportunity" ADD COLUMN IF NOT EXISTS "isStarterSeed" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "VolunteerOpportunity_isStarterSeed_idx" ON "VolunteerOpportunity"("isStarterSeed");

-- Enums
CREATE TYPE "AvatarUnlockCategory" AS ENUM ('accessories', 'fictional_props', 'tech_gear', 'faction_flair', 'outerwear', 'back_items', 'effects', 'backgrounds');
CREATE TYPE "RewardSourceType" AS ENUM ('mission', 'dead_drop', 'cipher', 'faction_mission', 'guild', 'archive', 'ghost_in_tech', 'relic_zone', 'profile_world', 'signal_player', 'manual_recognition', 'admin_grant', 'volunteer', 'community_builder');
CREATE TYPE "RewardMappingRewardType" AS ENUM ('badge', 'loot', 'avatar_unlock', 'title', 'profile_cosmetic', 'reputation', 'lore_unlock', 'relic', 'signal_player_unlock', 'guild_banner', 'forum_flair');
CREATE TYPE "AdminGrantType" AS ENUM ('badge', 'loot', 'avatar_unlock', 'title', 'profile_cosmetic', 'reputation', 'lore_unlock', 'recognition');
CREATE TYPE "CommunityBuilderPromptCategory" AS ENUM ('forum_topic', 'mission_idea', 'cipher_idea', 'lore_fragment', 'avatar_asset_idea', 'badge_idea', 'accessibility_note', 'archive_resource', 'net_neighbor', 'event_idea', 'profile_world_theme', 'signal_player_idea');
CREATE TYPE "RewardPoolType" AS ENUM ('faction_mission', 'guild_milestone', 'admin_manual');

CREATE TABLE "CommunityBuilderPrompt" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "CommunityBuilderPromptCategory" NOT NULL,
    "suggestedRoute" TEXT,
    "playerPrompt" TEXT NOT NULL,
    "reviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "safetyNote" TEXT,
    "rewardSuggestions" TEXT,
    "badgeHooks" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommunityBuilderPrompt_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CommunityBuilderPrompt_slug_key" ON "CommunityBuilderPrompt"("slug");
CREATE INDEX "CommunityBuilderPrompt_category_sortOrder_idx" ON "CommunityBuilderPrompt"("category", "sortOrder");

CREATE TABLE "PlayerRecognitionTemplate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "recognitionType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "grantedByRole" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "description" TEXT NOT NULL,
    "flavorText" TEXT,
    "unlockCondition" TEXT,
    "revocable" BOOLEAN NOT NULL DEFAULT true,
    "optOut" BOOLEAN NOT NULL DEFAULT true,
    "badgeHookSlug" TEXT,
    "titleHookSlug" TEXT,
    "lootHookSlug" TEXT,
    "imageAssetPath" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlayerRecognitionTemplate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PlayerRecognitionTemplate_slug_key" ON "PlayerRecognitionTemplate"("slug");
CREATE INDEX "PlayerRecognitionTemplate_category_sortOrder_idx" ON "PlayerRecognitionTemplate"("category", "sortOrder");

CREATE TABLE "ReputationEventDefinition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "category" "ReputationCategory" NOT NULL,
    "points" INTEGER NOT NULL,
    "trigger" TEXT NOT NULL,
    "cooldownKey" TEXT,
    "dailyCap" INTEGER,
    "reviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "abuseNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ReputationEventDefinition_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ReputationEventDefinition_slug_key" ON "ReputationEventDefinition"("slug");

CREATE TABLE "CanonTierDefinition" (
    "id" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "tierLabel" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "whatUsersCanCreate" TEXT NOT NULL,
    "examplePrompt" TEXT NOT NULL,
    "reviewRequirement" TEXT NOT NULL,
    "ownershipRules" TEXT NOT NULL,
    "safetyRules" TEXT NOT NULL,
    "rewardHooks" TEXT,
    "badgeHooks" TEXT,
    "loreUnlockHooks" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CanonTierDefinition_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CanonTierDefinition_tier_key" ON "CanonTierDefinition"("tier");
CREATE UNIQUE INDEX "CanonTierDefinition_slug_key" ON "CanonTierDefinition"("slug");

CREATE TABLE "CanonLorePrompt" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "playerPrompt" TEXT NOT NULL,
    "rewardHook" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CanonLorePrompt_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CanonLorePrompt_slug_key" ON "CanonLorePrompt"("slug");
CREATE INDEX "CanonLorePrompt_tier_sortOrder_idx" ON "CanonLorePrompt"("tier", "sortOrder");

CREATE TABLE "PlayerTitle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unlockCondition" TEXT NOT NULL,
    "factionAffinity" TEXT,
    "displayLocation" TEXT,
    "flavorText" TEXT,
    "imageAssetPath" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlayerTitle_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PlayerTitle_slug_key" ON "PlayerTitle"("slug");

CREATE TABLE "PlayerTitleGrant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "sourceType" TEXT,
    "sourceSlug" TEXT,
    "adminNote" TEXT,
    "grantedById" TEXT,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerTitleGrant_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PlayerTitleGrant_userId_titleId_key" ON "PlayerTitleGrant"("userId", "titleId");
CREATE INDEX "PlayerTitleGrant_userId_idx" ON "PlayerTitleGrant"("userId");
ALTER TABLE "PlayerTitleGrant" ADD CONSTRAINT "PlayerTitleGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlayerTitleGrant" ADD CONSTRAINT "PlayerTitleGrant_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "PlayerTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlayerTitleGrant" ADD CONSTRAINT "PlayerTitleGrant_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "AvatarUnlockAsset" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AvatarUnlockCategory" NOT NULL,
    "rarity" "MmoLootRarity" NOT NULL DEFAULT 'common',
    "factionAffinity" TEXT,
    "unlockSource" TEXT,
    "assetPath" TEXT NOT NULL,
    "layerOrder" INTEGER NOT NULL DEFAULT 50,
    "visualDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AvatarUnlockAsset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AvatarUnlockAsset_slug_key" ON "AvatarUnlockAsset"("slug");

CREATE TABLE "UserAvatarUnlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "sourceType" TEXT,
    "sourceSlug" TEXT,
    "grantedById" TEXT,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAvatarUnlock_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserAvatarUnlock_userId_assetId_key" ON "UserAvatarUnlock"("userId", "assetId");
CREATE INDEX "UserAvatarUnlock_userId_idx" ON "UserAvatarUnlock"("userId");
ALTER TABLE "UserAvatarUnlock" ADD CONSTRAINT "UserAvatarUnlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAvatarUnlock" ADD CONSTRAINT "UserAvatarUnlock_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "AvatarUnlockAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAvatarUnlock" ADD CONSTRAINT "UserAvatarUnlock_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "RewardMapping" (
    "id" TEXT NOT NULL,
    "sourceType" "RewardSourceType" NOT NULL,
    "sourceSlug" TEXT NOT NULL,
    "rewardType" "RewardMappingRewardType" NOT NULL,
    "rewardSlug" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "repeatability" TEXT NOT NULL DEFAULT 'one_time',
    "reviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "adminNotes" TEXT,
    "factionLeaderNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RewardMapping_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RewardMapping_sourceType_sourceSlug_rewardType_rewardSlug_key" ON "RewardMapping"("sourceType", "sourceSlug", "rewardType", "rewardSlug");
CREATE INDEX "RewardMapping_sourceType_sourceSlug_idx" ON "RewardMapping"("sourceType", "sourceSlug");

CREATE TABLE "RewardPool" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "factionSlug" TEXT,
    "poolType" "RewardPoolType" NOT NULL,
    "description" TEXT,
    "adminNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RewardPool_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RewardPool_slug_key" ON "RewardPool"("slug");
CREATE INDEX "RewardPool_factionSlug_idx" ON "RewardPool"("factionSlug");

CREATE TABLE "RewardPoolItem" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "rewardType" "RewardMappingRewardType" NOT NULL,
    "rewardSlug" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    CONSTRAINT "RewardPoolItem_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RewardPoolItem_poolId_rewardType_rewardSlug_key" ON "RewardPoolItem"("poolId", "rewardType", "rewardSlug");
ALTER TABLE "RewardPoolItem" ADD CONSTRAINT "RewardPoolItem_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "RewardPool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AdminRewardGrantAudit" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "grantType" "AdminGrantType" NOT NULL,
    "grantSlug" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "adminNote" TEXT,
    "sourceType" TEXT,
    "sourceSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminRewardGrantAudit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdminRewardGrantAudit_recipientId_createdAt_idx" ON "AdminRewardGrantAudit"("recipientId", "createdAt");
CREATE INDEX "AdminRewardGrantAudit_actorId_createdAt_idx" ON "AdminRewardGrantAudit"("actorId", "createdAt");
ALTER TABLE "AdminRewardGrantAudit" ADD CONSTRAINT "AdminRewardGrantAudit_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdminRewardGrantAudit" ADD CONSTRAINT "AdminRewardGrantAudit_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
