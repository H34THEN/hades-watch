import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import {
  FIELD_CARE_BADGES,
  FIELD_CARE_DEAD_DROPS,
  FIELD_CARE_LOOP_SLUG,
  FIELD_CARE_LOOT,
} from "../../src/lib/dead-drops/field-care-seed-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seeding");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Field Care / Real-World Readiness Dead Drops...");

  for (const loot of FIELD_CARE_LOOT) {
    await prisma.mmoLoot.upsert({
      where: { slug: loot.slug },
      create: {
        name: loot.name,
        slug: loot.slug,
        type: "avatar_item",
        rarity: "common",
        description: loot.flavorText,
        flavorText: loot.flavorText,
        displayLocation: loot.displayLocation,
        sourceLoopSlug: FIELD_CARE_LOOP_SLUG,
        unlockCondition: `Complete field care drop linked to ${loot.slug}`,
        isActive: true,
        updatedAt: new Date(),
      },
      update: {
        name: loot.name,
        description: loot.flavorText,
        flavorText: loot.flavorText,
        displayLocation: loot.displayLocation,
        sourceLoopSlug: FIELD_CARE_LOOP_SLUG,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log(`✓ ${FIELD_CARE_LOOT.length} field care loot items`);

  for (const badge of FIELD_CARE_BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      create: {
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        tier: "field",
        profileDisplayCategory: "readiness",
      },
      update: {
        name: badge.name,
        description: badge.description,
      },
    });
  }
  console.log(`✓ ${FIELD_CARE_BADGES.length} field care badges`);

  for (const drop of FIELD_CARE_DEAD_DROPS) {
    await prisma.mmoDeadDrop.upsert({
      where: { slug: drop.slug },
      create: {
        title: drop.title,
        slug: drop.slug,
        loopSlug: FIELD_CARE_LOOP_SLUG,
        roomSlug: null,
        factionSlug: null,
        dropType: drop.dropType,
        difficulty: drop.difficulty,
        repeatability: drop.repeatability,
        reviewRequired: drop.reviewRequired,
        submissionType: drop.submissionType,
        playerPrompt: drop.playerPrompt,
        successText: drop.successText,
        failureText: drop.failureText,
        loreNote: drop.loreNote ? `${drop.loreNote} · category: ${drop.category}` : `category: ${drop.category}`,
        safetyNote: drop.safetyNote,
        rewardBadgeSlug: drop.rewardBadgeSlug ?? null,
        rewardReputationCategory: drop.rewardReputationCategory ?? null,
        rewardReputationPoints: drop.rewardReputationPoints ?? 0,
        rewardLootSlug: drop.rewardLootSlug ?? null,
        sortOrder: drop.sortOrder,
        status: "active",
        updatedAt: new Date(),
      },
      update: {
        title: drop.title,
        loopSlug: FIELD_CARE_LOOP_SLUG,
        dropType: drop.dropType,
        difficulty: drop.difficulty,
        repeatability: drop.repeatability,
        reviewRequired: drop.reviewRequired,
        submissionType: drop.submissionType,
        playerPrompt: drop.playerPrompt,
        successText: drop.successText,
        failureText: drop.failureText,
        loreNote: drop.loreNote ? `${drop.loreNote} · category: ${drop.category}` : `category: ${drop.category}`,
        safetyNote: drop.safetyNote,
        rewardBadgeSlug: drop.rewardBadgeSlug ?? null,
        rewardReputationCategory: drop.rewardReputationCategory ?? null,
        rewardReputationPoints: drop.rewardReputationPoints ?? 0,
        rewardLootSlug: drop.rewardLootSlug ?? null,
        sortOrder: drop.sortOrder,
        status: "active",
        updatedAt: new Date(),
      },
    });
    console.log(`✓ drop: ${drop.slug}`);
  }

  console.log("Field Care Dead Drops seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
