import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { getCharacterLoreSeedEntries } from "../../src/lib/archive/character-lore";
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

  const factions = await prisma.faction.findMany({
    where: {
      slug: {
        in: [
          "chthonic-uprising",
          "asclepian-veil",
          "oracular-circuit",
          "myrmidon-grinders",
          "daedalus-foundry",
          "styx-rats",
        ],
      },
    },
    select: { id: true, slug: true },
  });
  const factionRecords = Object.fromEntries(factions.map((f) => [f.slug, f.id]));

  const entries = [...CANONICAL_LORE_ENTRIES, ...getCharacterLoreSeedEntries()];
  await seedLoreEntries(prisma, entries, factionRecords);

  for (const entry of entries) {
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
