-- Out-of-band invite verification + user account approval status

CREATE TYPE "UserAccountStatus" AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE "InviteVerificationMethod" AS ENUM (
  'SIGNAL_SAFETY_NUMBER',
  'SIMPLEX_CONTACT',
  'MATRIX_DEVICE',
  'SESSION_ID',
  'PGP_FINGERPRINT',
  'SSH_FINGERPRINT',
  'OTHER'
);
CREATE TYPE "InviteVerificationStatus" AS ENUM (
  'NOT_REQUIRED',
  'MATCHED',
  'MISMATCHED',
  'MISSING',
  'MANUAL_REVIEW'
);

ALTER TABLE "User" ADD COLUMN "accountStatus" "UserAccountStatus" NOT NULL DEFAULT 'Pending';
ALTER TABLE "User" ADD COLUMN "approvedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "approvalSource" TEXT;

UPDATE "User" SET "accountStatus" = 'Approved', "approvedAt" = COALESCE("createdAt", NOW()) WHERE "accountStatus" = 'Pending';

ALTER TABLE "InviteCode" ADD COLUMN "autoApproveOnRegister" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "InviteVerificationRequirement" (
    "id" TEXT NOT NULL,
    "inviteCodeId" TEXT NOT NULL,
    "method" "InviteVerificationMethod" NOT NULL,
    "label" TEXT,
    "expectedHash" TEXT NOT NULL,
    "expectedPreview" TEXT,
    "autoApproveOnMatch" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InviteVerificationRequirement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InviteVerificationRequirement_inviteCodeId_key" ON "InviteVerificationRequirement"("inviteCodeId");

CREATE TABLE "UserVerificationClaim" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inviteCodeId" TEXT,
    "method" "InviteVerificationMethod",
    "submittedHash" TEXT,
    "submittedPreview" TEXT,
    "status" "InviteVerificationStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVerificationClaim_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserVerificationClaim_userId_key" ON "UserVerificationClaim"("userId");
CREATE INDEX "UserVerificationClaim_status_idx" ON "UserVerificationClaim"("status");
CREATE INDEX "UserVerificationClaim_inviteCodeId_idx" ON "UserVerificationClaim"("inviteCodeId");
CREATE INDEX "User_accountStatus_idx" ON "User"("accountStatus");

ALTER TABLE "InviteVerificationRequirement" ADD CONSTRAINT "InviteVerificationRequirement_inviteCodeId_fkey"
  FOREIGN KEY ("inviteCodeId") REFERENCES "InviteCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserVerificationClaim" ADD CONSTRAINT "UserVerificationClaim_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
