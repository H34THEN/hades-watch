-- Profile dossier layer: Spotify fields, active title, invite redemption lineage

ALTER TABLE "User" ADD COLUMN "spotifyPlaylistId" TEXT;
ALTER TABLE "User" ADD COLUMN "spotifyPlaylistUrl" TEXT;
ALTER TABLE "User" ADD COLUMN "spotifyEmbedUrl" TEXT;
ALTER TABLE "User" ADD COLUMN "activeTitle" TEXT;

CREATE TABLE "InviteRedemption" (
    "id" TEXT NOT NULL,
    "inviteCodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleGranted" "RoleName",
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InviteRedemption_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InviteRedemption_userId_key" ON "InviteRedemption"("userId");
CREATE INDEX "InviteRedemption_inviteCodeId_idx" ON "InviteRedemption"("inviteCodeId");

ALTER TABLE "InviteRedemption" ADD CONSTRAINT "InviteRedemption_inviteCodeId_fkey"
  FOREIGN KEY ("inviteCodeId") REFERENCES "InviteCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InviteRedemption" ADD CONSTRAINT "InviteRedemption_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
