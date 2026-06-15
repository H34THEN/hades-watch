-- CreateEnum
CREATE TYPE "MediaVisibility" AS ENUM ('PRIVATE', 'APPROVED_USERS', 'PUBLIC', 'HIDDEN');

-- CreateTable
CREATE TABLE "MediaAlbum" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artistName" TEXT,
    "description" TEXT,
    "coverPath" TEXT,
    "visibility" "MediaVisibility" NOT NULL DEFAULT 'APPROVED_USERS',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaTrack" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artistName" TEXT,
    "albumId" TEXT,
    "trackNumber" INTEGER,
    "description" TEXT,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT,
    "durationSec" INTEGER,
    "visibility" "MediaVisibility" NOT NULL DEFAULT 'APPROVED_USERS',
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAlbum_slug_key" ON "MediaAlbum"("slug");

-- CreateIndex
CREATE INDEX "MediaAlbum_visibility_idx" ON "MediaAlbum"("visibility");

-- CreateIndex
CREATE UNIQUE INDEX "MediaTrack_slug_key" ON "MediaTrack"("slug");

-- CreateIndex
CREATE INDEX "MediaTrack_visibility_idx" ON "MediaTrack"("visibility");

-- CreateIndex
CREATE INDEX "MediaTrack_albumId_idx" ON "MediaTrack"("albumId");

-- AddForeignKey
ALTER TABLE "MediaAlbum" ADD CONSTRAINT "MediaAlbum_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaTrack" ADD CONSTRAINT "MediaTrack_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "MediaAlbum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaTrack" ADD CONSTRAINT "MediaTrack_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
