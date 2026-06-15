-- AlterEnum: expand AvatarPartVisibility
CREATE TYPE "AvatarPartVisibility_new" AS ENUM ('PRIVATE', 'SHARED_PENDING', 'SHARED_APPROVED', 'SHARED_REJECTED', 'HIDDEN');

ALTER TABLE "AvatarUserPart" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "AvatarUserPart" ALTER COLUMN "visibility" TYPE "AvatarPartVisibility_new" USING (
  CASE "visibility"::text
    WHEN 'SHARED' THEN 'SHARED_PENDING'::"AvatarPartVisibility_new"
    ELSE "visibility"::text::"AvatarPartVisibility_new"
  END
);
ALTER TABLE "AvatarUserPart" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE';

DROP TYPE "AvatarPartVisibility";
ALTER TYPE "AvatarPartVisibility_new" RENAME TO "AvatarPartVisibility";

-- AlterTable AvatarUserPart: category as text
ALTER TABLE "AvatarUserPart" ALTER COLUMN "category" TYPE TEXT USING "category"::text;

-- DropEnum AvatarPartCategory (no longer used on AvatarUserPart)
DROP TYPE IF EXISTS "AvatarPartCategory";

-- AlterTable UserAvatar
ALTER TABLE "UserAvatar" ADD COLUMN IF NOT EXISTS "genderPresentation" TEXT DEFAULT 'custom';
ALTER TABLE "UserAvatar" ADD COLUMN IF NOT EXISTS "emotionSlug" TEXT DEFAULT 'emotion-neutral';
ALTER TABLE "UserAvatar" ADD COLUMN IF NOT EXISTS "selectedItems" JSONB;

-- Character callsign unique (normalize duplicates first via suffix if needed)
CREATE UNIQUE INDEX IF NOT EXISTS "Character_callsign_key" ON "Character"("callsign");
