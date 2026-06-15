import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { getCategoryByRouteSlug } from "../../src/lib/archive/categories";
import { getLoreBySlug } from "../../src/lib/lore/queries";
import { SURFACE_BREAKS_WORLD_LORE_SLUGS } from "../../src/lib/lore/world-lore-pack";

const slug = process.argv[2] ?? "the-jackal-ledger";
const email = process.argv[3];

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Diagnosing world lore access for slug: ${slug}\n`);

  const row = await prisma.loreEntry.findUnique({
    where: { slug },
    select: { slug: true, title: true, status: true, category: true, body: true },
  });
  console.log("DB row:", row ? { ...row, body: `${row.body.length} chars` } : "NOT FOUND");

  const meta = getCategoryByRouteSlug("world");
  console.log("Route meta:", meta ? { slug: meta.slug, loreCategory: meta.loreCategory } : "MISSING");

  let user = email
    ? await prisma.user.findUnique({
        where: { email },
        include: { userRoles: { include: { role: true } } },
      })
    : await prisma.user.findFirst({
        include: { userRoles: { include: { role: true } } },
        orderBy: { createdAt: "asc" },
      });

  if (!user) {
    console.error("\nNo user found. Pass email: npm run db:diagnose:world-lore -- the-jackal-ledger you@example.com");
    process.exit(1);
  }

  const roles = user.userRoles.map((ur) => ur.role.name);
  console.log("\nSimulating as:", { email: user.email, id: user.id, roles });

  const result = await getLoreBySlug(slug, user.id, roles);
  if (!result) {
    console.log("\n✗ getLoreBySlug returned null → page would 404");
    process.exit(1);
  }

  const { entry, accessible, unlocked, canRead } = result;
  console.log("\ngetLoreBySlug:", {
    title: entry.title,
    category: entry.category,
    accessible,
    unlocked,
    canRead,
  });

  const categoryMismatch =
    !!entry.category &&
    !!meta &&
    entry.category !== meta.loreCategory &&
    !(
      meta.slug === "world" &&
      meta.loreCategory === "WORLD_LORE" &&
      SURFACE_BREAKS_WORLD_LORE_SLUGS.includes(slug)
    );

  if (categoryMismatch) {
    console.log("\n✗ Category guard would 404:", {
      entryCategory: entry.category,
      expected: meta?.loreCategory,
    });
    process.exit(1);
  }

  if (!canRead) {
    console.log("\n! Entry found but canRead=false (would show locked/unlock UI, not 404)");
    if (!accessible) console.log("  Reason: clearance or faction requirement");
    if (!unlocked) console.log("  Reason: not unlocked");
  } else {
    console.log("\n✓ Page should render for this user");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
