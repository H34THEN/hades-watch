import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { hashMmoCipherVariants, mmoOptionsJson } from "../../src/lib/mmo/text-mmo-validation";
import {
  TEXT_MMO_BADGES,
  TEXT_MMO_DEAD_DROPS,
  TEXT_MMO_LOOT,
  TEXT_MMO_LORE_UNLOCKS,
  TEXT_MMO_ROOM_ACTIONS,
  TEXT_MMO_ROOMS,
} from "../../src/lib/mmo/text-mmo-seed-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seeding");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Text MMO Playable Loops...");

  for (const room of TEXT_MMO_ROOMS) {
    await prisma.mmoRoom.upsert({
      where: { slug: room.slug },
      create: {
        title: room.title,
        slug: room.slug,
        description: room.description,
        entryText: room.entryText,
        roomType: room.roomType,
        primaryFactionSlug: room.primaryFactionSlug,
        secondaryFactionSlugs: room.secondaryFactionSlugs ?? [],
        accessLevel: room.accessLevel,
        mvpPriority: room.mvpPriority,
        state: room.state,
        safetyNote: room.safetyNote,
        emptyStateText: room.emptyStateText,
        sortOrder: room.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: room.title,
        description: room.description,
        entryText: room.entryText,
        roomType: room.roomType,
        primaryFactionSlug: room.primaryFactionSlug,
        secondaryFactionSlugs: room.secondaryFactionSlugs ?? [],
        accessLevel: room.accessLevel,
        mvpPriority: room.mvpPriority,
        state: room.state,
        safetyNote: room.safetyNote,
        emptyStateText: room.emptyStateText,
        sortOrder: room.sortOrder,
        updatedAt: new Date(),
      },
    });
    console.log(`✓ room: ${room.slug}`);
  }

  for (const room of TEXT_MMO_ROOMS) {
    const dbRoom = await prisma.mmoRoom.findUnique({ where: { slug: room.slug } });
    if (!dbRoom) continue;
    const actions = TEXT_MMO_ROOM_ACTIONS[room.slug] ?? [];
    for (const action of actions) {
      await prisma.mmoRoomAction.upsert({
        where: { roomId_slug: { roomId: dbRoom.id, slug: action.slug } },
        create: {
          roomId: dbRoom.id,
          label: action.label,
          slug: action.slug,
          description: action.description,
          actionType: action.actionType,
          targetRoute: action.targetRoute,
          accessLevel: action.accessLevel ?? room.accessLevel,
          rewardReputationCategory: action.rewardReputationCategory ?? null,
          rewardReputationPoints: action.rewardReputationPoints ?? 0,
          reputationEventSlug: action.reputationEventSlug ?? null,
          reviewRequired: action.reviewRequired ?? false,
          sortOrder: action.sortOrder,
          updatedAt: new Date(),
        },
        update: {
          label: action.label,
          description: action.description,
          actionType: action.actionType,
          targetRoute: action.targetRoute,
          accessLevel: action.accessLevel ?? room.accessLevel,
          rewardReputationCategory: action.rewardReputationCategory ?? null,
          rewardReputationPoints: action.rewardReputationPoints ?? 0,
          reputationEventSlug: action.reputationEventSlug ?? null,
          reviewRequired: action.reviewRequired ?? false,
          sortOrder: action.sortOrder,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    }
  }
  console.log("✓ room actions seeded");

  for (const drop of TEXT_MMO_DEAD_DROPS) {
    let acceptedAnswerHashes: string[] | undefined;
    let answerHash: string | undefined;
    if (drop.answerPlaintext) {
      acceptedAnswerHashes = hashMmoCipherVariants([drop.answerPlaintext]);
      answerHash = acceptedAnswerHashes[0];
    }

    await prisma.mmoDeadDrop.upsert({
      where: { slug: drop.slug },
      create: {
        title: drop.title,
        slug: drop.slug,
        loopSlug: drop.loopSlug,
        roomSlug: drop.roomSlug,
        factionSlug: drop.factionSlug,
        dropType: drop.dropType,
        difficulty: drop.difficulty,
        repeatability: drop.repeatability,
        reviewRequired: drop.reviewRequired,
        submissionType: drop.submissionType,
        playerPrompt: drop.playerPrompt,
        successText: drop.successText,
        failureText: drop.failureText,
        loreNote: drop.loreNote,
        safetyNote: drop.safetyNote,
        rewardBadgeSlug: drop.rewardBadgeSlug,
        rewardReputationCategory: drop.rewardReputationCategory,
        rewardReputationPoints: drop.rewardReputationPoints ?? 0,
        rewardLootSlug: drop.rewardLootSlug,
        loreUnlockSlug: drop.loreUnlockSlug,
        answerHash: answerHash ?? null,
        acceptedAnswerHashes: acceptedAnswerHashes ?? undefined,
        optionsJson: drop.optionsJson ? mmoOptionsJson(drop.optionsJson) : undefined,
        sortOrder: drop.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: drop.title,
        loopSlug: drop.loopSlug,
        roomSlug: drop.roomSlug,
        factionSlug: drop.factionSlug,
        dropType: drop.dropType,
        difficulty: drop.difficulty,
        repeatability: drop.repeatability,
        reviewRequired: drop.reviewRequired,
        submissionType: drop.submissionType,
        playerPrompt: drop.playerPrompt,
        successText: drop.successText,
        failureText: drop.failureText,
        loreNote: drop.loreNote,
        safetyNote: drop.safetyNote,
        rewardBadgeSlug: drop.rewardBadgeSlug,
        rewardReputationCategory: drop.rewardReputationCategory,
        rewardReputationPoints: drop.rewardReputationPoints ?? 0,
        rewardLootSlug: drop.rewardLootSlug,
        loreUnlockSlug: drop.loreUnlockSlug,
        answerHash: answerHash ?? null,
        acceptedAnswerHashes: acceptedAnswerHashes ?? undefined,
        optionsJson: drop.optionsJson ? mmoOptionsJson(drop.optionsJson) : undefined,
        sortOrder: drop.sortOrder,
        status: "active",
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ dead drops seeded");

  for (const loot of TEXT_MMO_LOOT) {
    await prisma.mmoLoot.upsert({
      where: { slug: loot.slug },
      create: {
        name: loot.name,
        slug: loot.slug,
        type: loot.type,
        rarity: loot.rarity,
        unlockCondition: loot.unlockCondition,
        displayLocation: loot.displayLocation,
        flavorText: loot.flavorText,
        sourceLoopSlug: loot.sourceLoopSlug,
        updatedAt: new Date(),
      },
      update: {
        name: loot.name,
        type: loot.type,
        rarity: loot.rarity,
        unlockCondition: loot.unlockCondition,
        displayLocation: loot.displayLocation,
        flavorText: loot.flavorText,
        sourceLoopSlug: loot.sourceLoopSlug,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ loot seeded");

  for (const badge of TEXT_MMO_BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      create: {
        slug: badge.slug,
        name: badge.name,
        description: badge.unlockCondition,
        profileDisplayCategory: badge.category,
        tier: badge.tier,
        placeholderText: badge.name.slice(0, 4).toUpperCase(),
      },
      update: {
        name: badge.name,
        description: badge.unlockCondition,
        profileDisplayCategory: badge.category,
        tier: badge.tier,
      },
    });
  }
  console.log("✓ badges seeded");

  for (const lore of TEXT_MMO_LORE_UNLOCKS) {
    await prisma.mmoLoreUnlock.upsert({
      where: { slug: lore.slug },
      create: {
        slug: lore.slug,
        title: lore.title,
        description: lore.description,
        flavorText: lore.flavorText,
        isPublic: lore.isPublic ?? true,
        updatedAt: new Date(),
      },
      update: {
        title: lore.title,
        description: lore.description,
        flavorText: lore.flavorText,
        isPublic: lore.isPublic ?? true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ lore unlocks seeded");

  console.log("Text MMO Playable Loops seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
