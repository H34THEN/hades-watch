-- CreateEnum
CREATE TYPE "ArchiveItemType" AS ENUM ('ARTICLE', 'CODE_REPO');

-- CreateEnum
CREATE TYPE "ArchiveItemStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PENDING_REVIEW', 'HIDDEN', 'REMOVED');

-- CreateEnum
CREATE TYPE "CodeForge" AS ENUM ('GITHUB', 'CODEBERG', 'OTHER');

-- CreateTable
CREATE TABLE "ArchiveItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ArchiveItemType" NOT NULL,
    "status" "ArchiveItemStatus" NOT NULL DEFAULT 'PUBLISHED',
    "title" TEXT NOT NULL,
    "sourceName" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "domain" TEXT,
    "summary" TEXT,
    "tags" JSONB,
    "forge" "CodeForge",
    "repoOwner" TEXT,
    "repoName" TEXT,
    "submittedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArchiveItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchiveComment" (
    "id" TEXT NOT NULL,
    "archiveItemId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "parentId" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArchiveComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArchiveItem_slug_key" ON "ArchiveItem"("slug");

-- CreateIndex
CREATE INDEX "ArchiveItem_type_idx" ON "ArchiveItem"("type");

-- CreateIndex
CREATE INDEX "ArchiveItem_status_idx" ON "ArchiveItem"("status");

-- CreateIndex
CREATE INDEX "ArchiveItem_createdAt_idx" ON "ArchiveItem"("createdAt");

-- CreateIndex
CREATE INDEX "ArchiveItem_slug_idx" ON "ArchiveItem"("slug");

-- CreateIndex
CREATE INDEX "ArchiveComment_archiveItemId_idx" ON "ArchiveComment"("archiveItemId");

-- CreateIndex
CREATE INDEX "ArchiveComment_authorId_idx" ON "ArchiveComment"("authorId");

-- CreateIndex
CREATE INDEX "ArchiveComment_parentId_idx" ON "ArchiveComment"("parentId");

-- AddForeignKey
ALTER TABLE "ArchiveItem" ADD CONSTRAINT "ArchiveItem_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchiveComment" ADD CONSTRAINT "ArchiveComment_archiveItemId_fkey" FOREIGN KEY ("archiveItemId") REFERENCES "ArchiveItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchiveComment" ADD CONSTRAINT "ArchiveComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchiveComment" ADD CONSTRAINT "ArchiveComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ArchiveComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
