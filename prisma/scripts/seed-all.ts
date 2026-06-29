import "dotenv/config";
import { execSync } from "child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RoleName } from "../../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const ROLES: { name: RoleName; description: string }[] = [
  { name: "Owner", description: "Full platform authority — The Archivist" },
  { name: "Admin", description: "Administrative operations" },
  { name: "Moderator", description: "Community moderation" },
  { name: "Expert", description: "Subject matter specialist" },
  { name: "Operative", description: "Approved standard operative" },
  { name: "Gamer", description: "Game-layer participant" },
  { name: "Member", description: "Standard community member" },
  { name: "Recruit", description: "Pending or limited recruit access" },
  { name: "Guest", description: "Limited access visitor" },
];

const CANONICAL_SEEDS: { name: string; script: string; optional?: boolean }[] = [
  { name: "factions", script: "prisma/scripts/seed-factions.ts" },
  { name: "lore", script: "prisma/scripts/seed-lore.ts" },
  { name: "archive", script: "prisma/scripts/seed-archive.ts" },
  { name: "missions:first-descent", script: "prisma/scripts/seed-missions-first-descent.ts" },
  { name: "missions:underwatch-civic-action", script: "prisma/scripts/seed-missions-underwatch-civic-action.ts" },
  { name: "ciphers:first-set", script: "prisma/scripts/seed-ciphers-first-set.ts" },
  { name: "chat", script: "prisma/scripts/seed-chat-rooms.ts" },
  { name: "net-neighbors", script: "prisma/scripts/seed-net-neighbors.ts" },
  { name: "text-mmo", script: "prisma/scripts/seed-text-mmo-loops.ts" },
  { name: "mmo-rewards", script: "prisma/scripts/seed-mmo-rewards.ts" },
];

async function seedRoles() {
  const adapter = new PrismaPg({ connectionString: connectionString! });
  const prisma = new PrismaClient({ adapter });
  try {
    for (const role of ROLES) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: { description: role.description },
        create: role,
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

function runScript(script: string) {
  execSync(`npx tsx ${script}`, {
    stdio: "inherit",
    env: process.env,
    cwd: process.cwd(),
  });
}

async function main() {
  console.log("Seeding canonical Hades Watch data...\n");

  console.log("→ roles");
  await seedRoles();
  console.log("✓ roles\n");

  for (const seed of CANONICAL_SEEDS) {
    console.log(`→ ${seed.name}`);
    try {
      runScript(seed.script);
      console.log(`✓ ${seed.name}\n`);
    } catch (error) {
      if (seed.optional) {
        console.warn(`⚠ ${seed.name} skipped (${error})\n`);
      } else {
        throw error;
      }
    }
  }

  console.log("Canonical seed complete.");
  console.log("\nNote: test users and dev invites are NOT included.");
  console.log("Run db:backfill:profile-slugs after deploy to provision user callsigns.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
