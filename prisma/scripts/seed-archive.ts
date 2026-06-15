import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { STATE_OF_AFFAIRS_SEED_ITEMS } from "../../src/lib/archive/archive-seed-data";
import { seedArchiveItems } from "../../src/lib/actions/archive-items";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding archive signal feeds (production-safe)...");

  await seedArchiveItems(prisma, STATE_OF_AFFAIRS_SEED_ITEMS);

  for (const item of STATE_OF_AFFAIRS_SEED_ITEMS) {
    console.log(`  ✓ ${item.slug}`);
  }

  console.log("\nArchive seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
