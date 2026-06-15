import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import {
  CANONICAL_LORE_ENTRIES,
  seedLoreEntries,
} from "../../src/lib/lore/canonical-lore-seed";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding canonical lore (production-safe)...");

  await seedLoreEntries(prisma, CANONICAL_LORE_ENTRIES);

  for (const entry of CANONICAL_LORE_ENTRIES) {
    console.log(`  ✓ ${entry.slug}`);
  }

  console.log("\nCanonical lore seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
