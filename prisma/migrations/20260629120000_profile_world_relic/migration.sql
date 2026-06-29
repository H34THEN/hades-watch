-- AlterTable
ALTER TABLE "UserProfileCustomization" ADD COLUMN IF NOT EXISTS "activeLayout" TEXT NOT NULL DEFAULT 'standard_dossier';
ALTER TABLE "UserProfileCustomization" ADD COLUMN IF NOT EXISTS "relicThemeConfig" JSONB;
ALTER TABLE "UserProfileCustomization" ADD COLUMN IF NOT EXISTS "relicModuleConfig" JSONB;
ALTER TABLE "UserProfileCustomization" ADD COLUMN IF NOT EXISTS "relicDraftConfig" JSONB;

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProfileWorld" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeLayout" TEXT NOT NULL DEFAULT 'standard_dossier',
    "title" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'approved',
    "globalThemeConfig" JSONB,
    "moduleConfig" JSONB,
    "activeRelicBuildId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileWorld_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "RelicBuild" (
    "id" TEXT NOT NULL,
    "profileWorldId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Default Build',
    "layoutKey" TEXT NOT NULL DEFAULT 'standard_dossier',
    "themeConfig" JSONB,
    "moduleConfig" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelicBuild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ProfileWorld_userId_key" ON "ProfileWorld"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "ProfileWorld_activeRelicBuildId_key" ON "ProfileWorld"("activeRelicBuildId");
CREATE INDEX IF NOT EXISTS "RelicBuild_userId_idx" ON "RelicBuild"("userId");
CREATE INDEX IF NOT EXISTS "RelicBuild_profileWorldId_idx" ON "RelicBuild"("profileWorldId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "ProfileWorld" ADD CONSTRAINT "ProfileWorld_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "RelicBuild" ADD CONSTRAINT "RelicBuild_profileWorldId_fkey" FOREIGN KEY ("profileWorldId") REFERENCES "ProfileWorld"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ProfileWorld" ADD CONSTRAINT "ProfileWorld_activeRelicBuildId_fkey" FOREIGN KEY ("activeRelicBuildId") REFERENCES "RelicBuild"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
