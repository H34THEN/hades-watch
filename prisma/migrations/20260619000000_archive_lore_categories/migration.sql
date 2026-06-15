-- CreateEnum
CREATE TYPE "LoreCategory" AS ENUM ('CHARACTER_LORE', 'WORLD_LORE', 'FACTION_LORE', 'MYTHOS_AND_ETHOS', 'CURRENT_NEWS_AND_STATE_OF_AFFAIRS');

-- AlterTable
ALTER TABLE "LoreEntry" ADD COLUMN     "category" "LoreCategory",
ADD COLUMN     "deadIndexId" TEXT,
ADD COLUMN     "loreMetadata" JSONB;

-- CreateIndex
CREATE INDEX "LoreEntry_category_idx" ON "LoreEntry"("category");
