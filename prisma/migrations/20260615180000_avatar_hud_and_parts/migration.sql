-- CreateEnum
CREATE TYPE "AvatarPartCategory" AS ENUM ('BODY', 'POSE', 'SPECIES_FEATURE', 'EYES', 'HAIR', 'OUTFIT', 'ACCESSORY', 'BACKGROUND', 'OVERLAY');
CREATE TYPE "AvatarPartVisibility" AS ENUM ('PRIVATE', 'SHARED');

-- AlterTable
ALTER TABLE "UserAvatar" ADD COLUMN IF NOT EXISTS "poseSlug" TEXT NOT NULL DEFAULT 'pose-neutral';
ALTER TABLE "UserAvatar" ADD COLUMN IF NOT EXISTS "customPartIds" JSONB;

-- CreateTable
CREATE TABLE "AvatarUserPart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "AvatarPartCategory" NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "visibility" "AvatarPartVisibility" NOT NULL DEFAULT 'PRIVATE',
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvatarUserPart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvatarUserPart_userId_slug_key" ON "AvatarUserPart"("userId", "slug");
CREATE INDEX "AvatarUserPart_userId_category_idx" ON "AvatarUserPart"("userId", "category");
CREATE INDEX "AvatarUserPart_visibility_category_idx" ON "AvatarUserPart"("visibility", "category");

-- AddForeignKey
ALTER TABLE "AvatarUserPart" ADD CONSTRAINT "AvatarUserPart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
