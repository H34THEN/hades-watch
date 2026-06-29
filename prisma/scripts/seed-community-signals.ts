import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { DEFAULT_FORUM_CATEGORIES } from "../../src/lib/community/constants";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const VOLUNTEER_OPPORTUNITIES = [
  {
    slug: "accessibility-audit-pass",
    title: "Accessibility Desk Review Pass",
    description:
      "Help review community pages, forms, and forum flows for keyboard navigation, contrast, and screen-reader clarity. Nonviolent, documentation-focused work.",
    lane: "ACCESSIBILITY" as const,
    requiredSkills: "Accessibility familiarity, plain-language notes",
    difficulty: "Field",
    estimatedTime: "2–4 hours",
  },
  {
    slug: "avatar-asset-intake",
    title: "Avatar Asset Intake Helper",
    description:
      "Review submitted avatar layer ideas for safe display, naming consistency, and forge compatibility guidance.",
    lane: "AVATAR_ASSETS" as const,
    requiredSkills: "Image basics, naming discipline",
    difficulty: "Initiate",
    estimatedTime: "1–2 hours/week",
  },
  {
    slug: "lore-index-scribe",
    title: "Lore Index Scribe",
    description:
      "Help organize character and community lore submissions at appropriate canon tiers. No overwriting official canon.",
    lane: "LORE_WRITING" as const,
    requiredSkills: "Careful reading, lore tone matching",
    difficulty: "Field",
    estimatedTime: "Flexible",
  },
  {
    slug: "forum-steward-shadow",
    title: "Forum Steward Shadow Shift",
    description:
      "Assist moderators with report triage, thread locks, and calm-room maintenance. Training provided.",
    lane: "MODERATION" as const,
    requiredSkills: "Patience, de-escalation mindset",
    difficulty: "Specialist",
    estimatedTime: "1 hour/week",
  },
  {
    slug: "docs-underwatch-commons",
    title: "Underwatch Commons Documentation",
    description:
      "Improve docs for community builder, forums, guilds, and volunteer flows. Markdown and clarity over hype.",
    lane: "DOCUMENTATION" as const,
    requiredSkills: "Technical writing",
    difficulty: "Field",
    estimatedTime: "2–6 hours",
  },
  {
    slug: "net-neighbor-scout",
    title: "Net Neighbor Scout Relay",
    description:
      "Nominate useful, strange, kind, or beautiful old-web links for moderator review. No private invite links.",
    lane: "NET_NEIGHBOR_SCOUTING" as const,
    requiredSkills: "Link curation, safety awareness",
    difficulty: "Initiate",
    estimatedTime: "30 minutes/week",
  },
];

async function main() {
  console.log("Seeding forum categories...");
  for (const cat of DEFAULT_FORUM_CATEGORIES) {
    await prisma.forumCategory.upsert({
      where: { slug: cat.slug },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        factionSlug: cat.factionSlug ?? null,
        sortOrder: cat.sortOrder,
        iconGlyph: cat.iconGlyph,
        accessLevel: "APPROVED_POST",
        rules:
          "Do not post secrets, private data, doxxing, harassment, threats, or illegal instructions.",
        isActive: true,
      },
      update: {
        name: cat.name,
        description: cat.description,
        factionSlug: cat.factionSlug ?? null,
        sortOrder: cat.sortOrder,
        iconGlyph: cat.iconGlyph,
        isActive: true,
      },
    });
    console.log(`  ✓ ${cat.slug}`);
  }

  console.log("\nSeeding volunteer opportunities...");
  for (const opp of VOLUNTEER_OPPORTUNITIES) {
    await prisma.volunteerOpportunity.upsert({
      where: { slug: opp.slug },
      create: {
        ...opp,
        status: "OPEN",
      },
      update: {
        title: opp.title,
        description: opp.description,
        lane: opp.lane,
        requiredSkills: opp.requiredSkills,
        difficulty: opp.difficulty,
        estimatedTime: opp.estimatedTime,
      },
    });
    console.log(`  ✓ ${opp.slug}`);
  }

  console.log("\nCommunity signals seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
