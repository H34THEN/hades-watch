import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const PLACEHOLDER = {
  slug: "hades-watch-placeholder",
  title: "Hades Watch Placeholder Neighbor",
  url: "https://hadeswatch.com",
  description: "Canonical Underwatch self-signal placeholder.",
  bannerText: "HADES WATCH",
  bannerStyle: {
    preset: "dead-index-violet",
    text: "HADES WATCH",
    subtext: "",
    width: 88,
    height: 31,
    scanlines: true,
    flicker: false,
    glyph: "◈",
  },
  status: "APPROVED" as const,
  sortOrder: 0,
  tags: ["canonical", "underwatch"],
};

async function main() {
  await prisma.netNeighbor.upsert({
    where: { slug: PLACEHOLDER.slug },
    create: PLACEHOLDER,
    update: {
      title: PLACEHOLDER.title,
      url: PLACEHOLDER.url,
      description: PLACEHOLDER.description,
      bannerText: PLACEHOLDER.bannerText,
      bannerStyle: PLACEHOLDER.bannerStyle,
      status: PLACEHOLDER.status,
      sortOrder: PLACEHOLDER.sortOrder,
      tags: PLACEHOLDER.tags,
    },
  });
  console.log("✓ net-neighbors placeholder seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
