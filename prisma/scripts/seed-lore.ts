import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { LEADERS_LORE_FILE, ORIGIN_LORE_FILE, WORLD_LORE_PACK_FILE } from "../../src/lib/archive/extract-lore-markdown";
import { getCharacterLoreSeedEntries } from "../../src/lib/archive/character-lore";
import {
  CANONICAL_LORE_ENTRIES,
  seedLoreEntries,
} from "../../src/lib/lore/canonical-lore-seed";
import { getWorldLorePackSeedEntries } from "../../src/lib/lore/world-lore-seed";
import { existsSync } from "fs";
import { join } from "path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function assertLoreSourcesPresent() {
  for (const file of [ORIGIN_LORE_FILE, LEADERS_LORE_FILE, WORLD_LORE_PACK_FILE]) {
    const path = join(process.cwd(), file);
    if (!existsSync(path)) {
      throw new Error(`Missing lore source file: ${path}`);
    }
  }
}

async function assertLoreTaxonomyColumns() {
  const rows = await prisma.$queryRaw<{ column_name: string }[]>`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'LoreEntry'
      AND column_name IN ('category', 'deadIndexId', 'loreMetadata')
  `;

  if (rows.length < 3) {
    throw new Error(
      [
        "LoreEntry taxonomy columns are missing in the database.",
        "Run: npm run db:deploy",
        "Then: npm run db:generate && npm run db:seed:lore",
      ].join("\n"),
    );
  }
}

async function main() {
  console.log("Seeding canonical lore (production-safe)...");

  await assertLoreSourcesPresent();
  await assertLoreTaxonomyColumns();

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

  const entries = [
    ...CANONICAL_LORE_ENTRIES,
    ...getCharacterLoreSeedEntries(),
    ...getWorldLorePackSeedEntries(),
  ];
  await seedLoreEntries(prisma, entries, factionRecords);

  const deprecatedLoreSlugs = ["dr-ione-vey"];
  for (const slug of deprecatedLoreSlugs) {
    const removed = await prisma.loreEntry.deleteMany({ where: { slug } });
    if (removed.count > 0) {
      console.log(`  ✗ removed deprecated lore: ${slug}`);
    }
  }

  for (const entry of entries) {
    console.log(`  ✓ ${entry.slug}`);
  }

  const worldRows = await prisma.loreEntry.findMany({
    where: { slug: { in: ["the-jackal-ledger", "the-bronze-gate-levies", "the-white-lantern-hunts", "the-two-new-fires", "the-thunder-casket-posts"] } },
    select: { slug: true, category: true, status: true },
  });
  const missing = 5 - worldRows.filter((r) => r.status === "Published" && r.category === "WORLD_LORE").length;
  if (missing > 0) {
    console.warn(`\n  ! World lore pack incomplete (${5 - missing}/5 valid). Run: npm run db:verify:world-lore`);
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
