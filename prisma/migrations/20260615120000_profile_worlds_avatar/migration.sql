-- CreateEnum
CREATE TYPE "UserProfileAssetKind" AS ENUM ('PORTRAIT', 'BANNER', 'BACKGROUND', 'RELIC_IMAGE', 'AVATAR_BACKGROUND');

-- AlterTable
ALTER TABLE "UserProfileCustomization" ADD COLUMN "links" JSONB;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "profileButtons" JSONB;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "featuredBadgeSlugs" JSONB;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "tagline" TEXT;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "motto" TEXT;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "favoriteSignal" TEXT;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "backgroundColor" TEXT;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "portraitAssetId" TEXT;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "bannerAssetId" TEXT;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "backgroundAssetId" TEXT;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "showRelicZone" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "UserProfileCustomization" ADD COLUMN "showRssZone" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "UserProfileAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "UserProfileAssetKind" NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "originalName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAvatar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "tagline" TEXT,
    "bio" TEXT,
    "pronouns" TEXT,
    "motto" TEXT,
    "favoriteSignal" TEXT,
    "speciesSlug" TEXT NOT NULL DEFAULT 'tiefling',
    "bodySlug" TEXT NOT NULL DEFAULT 'body-base-a',
    "skinColor" TEXT,
    "eyeSlug" TEXT,
    "eyeColor" TEXT,
    "hairSlug" TEXT,
    "hairColor" TEXT,
    "outfitSlug" TEXT,
    "accessorySlugs" JSONB,
    "backgroundSlug" TEXT DEFAULT 'bg-underwatch-default',
    "customBackgroundAssetId" TEXT,
    "layerConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAvatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserProfileAsset_userId_kind_idx" ON "UserProfileAsset"("userId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "UserAvatar_userId_key" ON "UserAvatar"("userId");

-- AddForeignKey
ALTER TABLE "UserProfileAsset" ADD CONSTRAINT "UserProfileAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAvatar" ADD CONSTRAINT "UserAvatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
