-- Net Neighbors HUD: sort order, generated banner fields
ALTER TABLE "NetNeighbor" ADD COLUMN IF NOT EXISTS "bannerText" TEXT;
ALTER TABLE "NetNeighbor" ADD COLUMN IF NOT EXISTS "bannerStyle" JSONB;
ALTER TABLE "NetNeighbor" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "NetNeighbor_sortOrder_idx" ON "NetNeighbor"("sortOrder");
CREATE INDEX IF NOT EXISTS "NetNeighbor_submittedById_idx" ON "NetNeighbor"("submittedById");
