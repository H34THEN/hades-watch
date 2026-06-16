-- CreateEnum
CREATE TYPE "AvatarForgeAccessStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED');

-- CreateTable
CREATE TABLE "AvatarForgeAccessRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AvatarForgeAccessStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "reviewNote" TEXT,
    "unlockCodeHash" TEXT,
    "codeExpiresAt" TIMESTAMP(3),
    "unlockedAt" TIMESTAMP(3),
    "lastRevealedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvatarForgeAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvatarForgeAccessRequest_userId_key" ON "AvatarForgeAccessRequest"("userId");

-- CreateIndex
CREATE INDEX "AvatarForgeAccessRequest_status_idx" ON "AvatarForgeAccessRequest"("status");

-- AddForeignKey
ALTER TABLE "AvatarForgeAccessRequest" ADD CONSTRAINT "AvatarForgeAccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarForgeAccessRequest" ADD CONSTRAINT "AvatarForgeAccessRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
