-- Chthonic Uprising factions, positions, badges, test user support

CREATE TYPE "FactionPosition" AS ENUM (
  'INITIATE',
  'MEMBER',
  'SPECIALIST',
  'CELL_LEAD',
  'LIEUTENANT',
  'LEADER'
);

ALTER TYPE "RoleName" ADD VALUE IF NOT EXISTS 'Operative';
ALTER TYPE "RoleName" ADD VALUE IF NOT EXISTS 'Recruit';

ALTER TABLE "User" ADD COLUMN "isTestAccount" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Faction" ADD COLUMN "tagline" TEXT;
ALTER TABLE "Faction" ADD COLUMN "archetype" TEXT;
ALTER TABLE "Faction" ADD COLUMN "leaderName" TEXT;
ALTER TABLE "Faction" ADD COLUMN "leaderTitle" TEXT;
ALTER TABLE "Faction" ADD COLUMN "leaderLore" TEXT;
ALTER TABLE "Faction" ADD COLUMN "coreValues" JSONB;
ALTER TABLE "Faction" ADD COLUMN "palette" JSONB;
ALTER TABLE "Faction" ADD COLUMN "symbol" TEXT;
ALTER TABLE "Faction" ADD COLUMN "motto" TEXT;
ALTER TABLE "Faction" ADD COLUMN "rivalrySlug" TEXT;
ALTER TABLE "Faction" ADD COLUMN "synergySlug" TEXT;
ALTER TABLE "Faction" ADD COLUMN "themeUnlock" TEXT;
ALTER TABLE "Faction" ADD COLUMN "typicalMissions" JSONB;
ALTER TABLE "Faction" ADD COLUMN "reputationFlavor" TEXT;
ALTER TABLE "Faction" ADD COLUMN "badges" JSONB;
ALTER TABLE "Faction" ADD COLUMN "titles" JSONB;
ALTER TABLE "Faction" ADD COLUMN "isAlliance" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Faction" ADD COLUMN "allianceId" TEXT;

ALTER TABLE "FactionMembership" ADD COLUMN "position" "FactionPosition" NOT NULL DEFAULT 'INITIATE';
ALTER TABLE "FactionMembership" ADD COLUMN "displayTitle" TEXT;
ALTER TABLE "FactionMembership" ADD COLUMN "reputation" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "FactionMembership" ADD COLUMN "isPrimary" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "factionId" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Badge_slug_key" ON "Badge"("slug");

CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardedById" TEXT,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");
CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");

ALTER TABLE "Faction" ADD CONSTRAINT "Faction_allianceId_fkey"
  FOREIGN KEY ("allianceId") REFERENCES "Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_factionId_fkey"
  FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey"
  FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
