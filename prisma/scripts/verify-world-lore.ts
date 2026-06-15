import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { SURFACE_BREAKS_WORLD_LORE_SLUGS } from "../../src/lib/lore/world-lore-pack";
import { getWorldLorePackSeedEntries } from "../../src/lib/lore/world-lore-seed";
import { seedLoreEntries } from "../../src/lib/lore/canonical-lore-seed";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function verify(): Promise<boolean> {
  const rows = await prisma.loreEntry.findMany({
    where: { slug: { in: [...SURFACE_BREAKS_WORLD_LORE_SLUGS] } },
    select: { slug: true, title: true, status: true, category: true },
    orderBy: { slug: "asc" },
  });

  const bySlug = Object.fromEntries(rows.map((r) => [r.slug, r]));

  let ok = true;
  for (const slug of SURFACE_BREAKS_WORLD_LORE_SLUGS) {
    const row = bySlug[slug];
    if (!row) {
      console.log(`  ✗ ${slug} — MISSING`);
      ok = false;
      continue;
    }
    const issues: string[] = [];
    if (row.status !== "Published") issues.push(`status=${row.status}`);
    if (row.category !== "WORLD_LORE") issues.push(`category=${row.category ?? "null"}`);
    if (issues.length) {
      console.log(`  ✗ ${slug} — ${issues.join(", ")}`);
      ok = false;
    } else {
      console.log(`  ✓ ${slug} — ${row.title}`);
    }
  }

  return ok;
}

async function main() {
  const fix = process.argv.includes("--fix");

  console.log("World lore pack verification\n");

  const ok = await verify();

  if (ok) {
    console.log("\nAll five Surface Breaks world lore entries are present and valid.");
    return;
  }

  console.log("\nWorld lore pack is incomplete or mis-tagged.");

  if (!fix) {
    console.log("\nRun with --fix to re-seed world lore entries:");
    console.log("  npm run db:verify:world-lore -- --fix");
    console.log("\nOr full lore seed:");
    console.log("  npm run db:seed:lore");
    process.exit(1);
  }

  console.log("\nApplying fix (upsert world lore pack)...");
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

  await seedLoreEntries(prisma, getWorldLorePackSeedEntries(), factionRecords);

  console.log("Fix applied. Re-checking...\n");

  const okAfter = await verify();
  if (!okAfter) {
    console.error("\nFix did not resolve all issues. Check docs/lore/WORLD_LORE_PACK_001_SURFACE_BREAKS.md exists.");
    process.exit(1);
  }

  console.log("\nAll five Surface Breaks world lore entries are present and valid.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
