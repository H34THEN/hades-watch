-- Phase 5: Launch Readiness + Gameplay Workflow Completion

-- CreateEnum
CREATE TYPE "MissionParticipationStatus" AS ENUM ('Interested', 'Joined', 'InProgress', 'Completed', 'Dropped');

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionParticipation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" "MissionParticipationStatus" NOT NULL DEFAULT 'Joined',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CipherSolve" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cipherPuzzleId" TEXT NOT NULL,
    "solvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CipherSolve_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");
CREATE INDEX "EmailVerificationToken_tokenHash_idx" ON "EmailVerificationToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX "PasswordResetToken_tokenHash_idx" ON "PasswordResetToken"("tokenHash");
CREATE UNIQUE INDEX "MissionParticipation_userId_questId_key" ON "MissionParticipation"("userId", "questId");
CREATE INDEX "MissionParticipation_status_idx" ON "MissionParticipation"("status");
CREATE INDEX "MissionParticipation_questId_idx" ON "MissionParticipation"("questId");
CREATE UNIQUE INDEX "CipherSolve_userId_cipherPuzzleId_key" ON "CipherSolve"("userId", "cipherPuzzleId");
CREATE INDEX "CipherSolve_cipherPuzzleId_idx" ON "CipherSolve"("cipherPuzzleId");

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionParticipation" ADD CONSTRAINT "MissionParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionParticipation" ADD CONSTRAINT "MissionParticipation_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CipherSolve" ADD CONSTRAINT "CipherSolve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CipherSolve" ADD CONSTRAINT "CipherSolve_cipherPuzzleId_fkey" FOREIGN KEY ("cipherPuzzleId") REFERENCES "CipherPuzzle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
