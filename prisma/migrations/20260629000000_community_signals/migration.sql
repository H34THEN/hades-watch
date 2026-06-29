-- Community Signals: forums, builder, volunteer, guilds, reputation, lore, recognition

CREATE TYPE "CommunitySubmissionType" AS ENUM (
  'FORUM_CATEGORY', 'MISSION', 'CIPHER', 'LORE_FRAGMENT', 'AVATAR_ASSET',
  'BADGE_IDEA', 'ACCESSIBILITY', 'NET_NEIGHBOR', 'COMMUNITY_EVENT',
  'ARCHIVE_RESOURCE', 'FIELD_NOTE', 'COMMUNITY_QUESTION', 'OTHER'
);

CREATE TYPE "CommunitySubmissionStatus" AS ENUM (
  'PENDING', 'ACCEPTED', 'NEEDS_REVISION', 'REJECTED', 'ARCHIVED', 'IMPLEMENTED'
);

CREATE TYPE "ForumAccessLevel" AS ENUM ('PUBLIC_READ', 'APPROVED_POST', 'MODERATOR_ONLY');

CREATE TYPE "ForumThreadStatus" AS ENUM ('ACTIVE', 'LOCKED', 'HIDDEN', 'REMOVED', 'ARCHIVED');

CREATE TYPE "ForumCommentStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'REMOVED');

CREATE TYPE "ForumReactionType" AS ENUM ('SIGNAL_BOOST', 'USEFUL', 'LOREFUL', 'NEEDS_CARE', 'THANKS');

CREATE TYPE "VolunteerLane" AS ENUM (
  'CODE', 'DESIGN', 'AVATAR_ASSETS', 'BADGE_ART', 'LORE_WRITING', 'MISSION_WRITING',
  'CIPHER_WRITING', 'MODERATION', 'ACCESSIBILITY', 'DOCUMENTATION', 'RESEARCH_ARCHIVE',
  'QA_TESTING', 'COMMUNITY_EVENTS', 'MUSIC_SIGNAL', 'NET_NEIGHBOR_SCOUTING'
);

CREATE TYPE "VolunteerOpportunityStatus" AS ENUM ('OPEN', 'CLAIMED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

CREATE TYPE "VolunteerResponseStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN');

CREATE TYPE "GuildStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED', 'ARCHIVED');

CREATE TYPE "GuildVisibility" AS ENUM ('PUBLIC', 'APPROVED_USERS', 'INVITE_ONLY');

CREATE TYPE "GuildMembershipRole" AS ENUM ('FOUNDER', 'LEADER', 'STEWARD', 'MEMBER', 'APPLICANT');

CREATE TYPE "GuildMembershipStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'LEFT');

CREATE TYPE "ReputationCategory" AS ENUM (
  'COMMUNITY', 'LORE', 'MISSIONS', 'CIPHERS', 'ARCHIVE', 'FORGE', 'GUILDS', 'MODERATION', 'ACCESSIBILITY'
);

CREATE TYPE "CanonTier" AS ENUM (
  'PRIVATE_DRAFT', 'CHARACTER', 'GUILD', 'LOCAL_COMMUNITY', 'FACTION_ECHO', 'WORLD'
);

CREATE TYPE "LoreSubmissionStatus" AS ENUM (
  'DRAFT', 'SUBMITTED', 'APPROVED', 'NEEDS_REVISION', 'REJECTED', 'ARCHIVED'
);

CREATE TYPE "PlayerRecognitionType" AS ENUM (
  'BADGE', 'TITLE', 'FEATURED_PROFILE', 'FEATURED_GUILD', 'COMMUNITY_SPOTLIGHT',
  'ARCHIVE_CREDIT', 'MISSION_CREDIT', 'FORGE_CREDIT', 'LORE_CREDIT',
  'MODERATOR_COMMENDATION', 'ARCHIVIST_MARK'
);

CREATE TYPE "PlayerRecognitionCategory" AS ENUM (
  'COMMUNITY_CARE', 'LORE_CRAFT', 'CIPHER_HELP', 'MISSION_SUPPORT', 'ARCHIVE_WORK',
  'FORGE_CONTRIBUTIONS', 'ACCESSIBILITY', 'MODERATION', 'GUILD_LEADERSHIP', 'OLD_WEB_CULTURE'
);

CREATE TABLE "CommunitySubmission" (
  "id" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "type" "CommunitySubmissionType" NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "factionSlug" TEXT,
  "relatedSystem" TEXT,
  "relatedUrl" TEXT,
  "status" "CommunitySubmissionStatus" NOT NULL DEFAULT 'PENDING',
  "consentNoSecrets" BOOLEAN NOT NULL DEFAULT false,
  "reviewNote" TEXT,
  "reviewedById" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CommunitySubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ForumCategory" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "factionSlug" TEXT,
  "accessLevel" "ForumAccessLevel" NOT NULL DEFAULT 'APPROVED_POST',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "iconGlyph" TEXT,
  "rules" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ForumCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ForumThread" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" "ForumThreadStatus" NOT NULL DEFAULT 'ACTIVE',
  "pinned" BOOLEAN NOT NULL DEFAULT false,
  "score" INTEGER NOT NULL DEFAULT 0,
  "commentCount" INTEGER NOT NULL DEFAULT 0,
  "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ForumThread_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ForumComment" (
  "id" TEXT NOT NULL,
  "threadId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "parentCommentId" TEXT,
  "body" TEXT NOT NULL,
  "status" "ForumCommentStatus" NOT NULL DEFAULT 'ACTIVE',
  "score" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ForumComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ForumReaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "threadId" TEXT,
  "commentId" TEXT,
  "reactionType" "ForumReactionType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ForumReaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VolunteerOpportunity" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "lane" "VolunteerLane" NOT NULL,
  "requiredSkills" TEXT,
  "difficulty" TEXT,
  "estimatedTime" TEXT,
  "status" "VolunteerOpportunityStatus" NOT NULL DEFAULT 'OPEN',
  "createdById" TEXT,
  "claimedById" TEXT,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VolunteerOpportunity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VolunteerResponse" (
  "id" TEXT NOT NULL,
  "opportunityId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "skills" TEXT,
  "availability" TEXT,
  "status" "VolunteerResponseStatus" NOT NULL DEFAULT 'PENDING',
  "reviewNote" TEXT,
  "reviewedById" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VolunteerResponse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Guild" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "conductAgreement" TEXT NOT NULL,
  "factionAffinity" TEXT,
  "visibility" "GuildVisibility" NOT NULL DEFAULT 'APPROVED_USERS',
  "status" "GuildStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "founderId" TEXT NOT NULL,
  "bannerGlyph" TEXT,
  "rules" TEXT,
  "reviewNote" TEXT,
  "reviewedById" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuildMembership" (
  "id" TEXT NOT NULL,
  "guildId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "GuildMembershipRole" NOT NULL DEFAULT 'MEMBER',
  "status" "GuildMembershipStatus" NOT NULL DEFAULT 'PENDING',
  "message" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuildMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReputationEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "category" "ReputationCategory" NOT NULL,
  "points" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "sourceType" TEXT,
  "sourceId" TEXT,
  "revoked" BOOLEAN NOT NULL DEFAULT false,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReputationEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LoreSubmission" (
  "id" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "tierRequested" "CanonTier" NOT NULL DEFAULT 'CHARACTER',
  "tierApproved" "CanonTier",
  "characterCallsign" TEXT,
  "guildId" TEXT,
  "factionSlug" TEXT,
  "contentWarnings" TEXT,
  "status" "LoreSubmissionStatus" NOT NULL DEFAULT 'DRAFT',
  "reviewNote" TEXT,
  "reviewedById" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LoreSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlayerRecognition" (
  "id" TEXT NOT NULL,
  "recipientId" TEXT NOT NULL,
  "grantedById" TEXT NOT NULL,
  "type" "PlayerRecognitionType" NOT NULL,
  "category" "PlayerRecognitionCategory" NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "revoked" BOOLEAN NOT NULL DEFAULT false,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PlayerRecognition_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ForumCategory_slug_key" ON "ForumCategory"("slug");
CREATE UNIQUE INDEX "ForumThread_slug_key" ON "ForumThread"("slug");
CREATE UNIQUE INDEX "VolunteerOpportunity_slug_key" ON "VolunteerOpportunity"("slug");
CREATE UNIQUE INDEX "Guild_slug_key" ON "Guild"("slug");
CREATE UNIQUE INDEX "LoreSubmission_slug_key" ON "LoreSubmission"("slug");
CREATE UNIQUE INDEX "ForumReaction_userId_threadId_key" ON "ForumReaction"("userId", "threadId");
CREATE UNIQUE INDEX "ForumReaction_userId_commentId_key" ON "ForumReaction"("userId", "commentId");
CREATE UNIQUE INDEX "VolunteerResponse_opportunityId_userId_key" ON "VolunteerResponse"("opportunityId", "userId");
CREATE UNIQUE INDEX "GuildMembership_guildId_userId_key" ON "GuildMembership"("guildId", "userId");

CREATE INDEX "CommunitySubmission_authorId_idx" ON "CommunitySubmission"("authorId");
CREATE INDEX "CommunitySubmission_status_idx" ON "CommunitySubmission"("status");
CREATE INDEX "CommunitySubmission_type_idx" ON "CommunitySubmission"("type");
CREATE INDEX "ForumCategory_sortOrder_idx" ON "ForumCategory"("sortOrder");
CREATE INDEX "ForumThread_categoryId_lastActivityAt_idx" ON "ForumThread"("categoryId", "lastActivityAt");
CREATE INDEX "ForumThread_authorId_idx" ON "ForumThread"("authorId");
CREATE INDEX "ForumThread_status_idx" ON "ForumThread"("status");
CREATE INDEX "ForumComment_threadId_createdAt_idx" ON "ForumComment"("threadId", "createdAt");
CREATE INDEX "ForumComment_authorId_idx" ON "ForumComment"("authorId");
CREATE INDEX "ForumReaction_threadId_idx" ON "ForumReaction"("threadId");
CREATE INDEX "ForumReaction_commentId_idx" ON "ForumReaction"("commentId");
CREATE INDEX "VolunteerOpportunity_status_idx" ON "VolunteerOpportunity"("status");
CREATE INDEX "VolunteerOpportunity_lane_idx" ON "VolunteerOpportunity"("lane");
CREATE INDEX "VolunteerResponse_userId_idx" ON "VolunteerResponse"("userId");
CREATE INDEX "VolunteerResponse_status_idx" ON "VolunteerResponse"("status");
CREATE INDEX "Guild_status_idx" ON "Guild"("status");
CREATE INDEX "Guild_founderId_idx" ON "Guild"("founderId");
CREATE INDEX "GuildMembership_userId_idx" ON "GuildMembership"("userId");
CREATE INDEX "ReputationEvent_userId_createdAt_idx" ON "ReputationEvent"("userId", "createdAt");
CREATE INDEX "ReputationEvent_category_idx" ON "ReputationEvent"("category");
CREATE INDEX "LoreSubmission_authorId_idx" ON "LoreSubmission"("authorId");
CREATE INDEX "LoreSubmission_status_idx" ON "LoreSubmission"("status");
CREATE INDEX "LoreSubmission_tierRequested_idx" ON "LoreSubmission"("tierRequested");
CREATE INDEX "PlayerRecognition_recipientId_idx" ON "PlayerRecognition"("recipientId");
CREATE INDEX "PlayerRecognition_isPublic_revoked_idx" ON "PlayerRecognition"("isPublic", "revoked");

ALTER TABLE "CommunitySubmission" ADD CONSTRAINT "CommunitySubmission_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunitySubmission" ADD CONSTRAINT "CommunitySubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ForumThread" ADD CONSTRAINT "ForumThread_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumThread" ADD CONSTRAINT "ForumThread_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumComment" ADD CONSTRAINT "ForumComment_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ForumThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumComment" ADD CONSTRAINT "ForumComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumComment" ADD CONSTRAINT "ForumComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "ForumComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ForumReaction" ADD CONSTRAINT "ForumReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumReaction" ADD CONSTRAINT "ForumReaction_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ForumThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumReaction" ADD CONSTRAINT "ForumReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ForumComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VolunteerOpportunity" ADD CONSTRAINT "VolunteerOpportunity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VolunteerResponse" ADD CONSTRAINT "VolunteerResponse_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "VolunteerOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VolunteerResponse" ADD CONSTRAINT "VolunteerResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VolunteerResponse" ADD CONSTRAINT "VolunteerResponse_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_founderId_fkey" FOREIGN KEY ("founderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuildMembership" ADD CONSTRAINT "GuildMembership_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuildMembership" ADD CONSTRAINT "GuildMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReputationEvent" ADD CONSTRAINT "ReputationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LoreSubmission" ADD CONSTRAINT "LoreSubmission_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LoreSubmission" ADD CONSTRAINT "LoreSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LoreSubmission" ADD CONSTRAINT "LoreSubmission_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PlayerRecognition" ADD CONSTRAINT "PlayerRecognition_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlayerRecognition" ADD CONSTRAINT "PlayerRecognition_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
