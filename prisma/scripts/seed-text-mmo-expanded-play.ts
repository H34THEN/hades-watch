import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../../src/generated/prisma/client";
import {
  ALL_PLAYABLE_PROMPTS,
  ARCHIVE_HUNTS,
  DAILY_SIGNALS,
  EXPANDED_PLAY_FUNCTIONS,
  EXPANDED_PLAY_REWARD_MAPPINGS,
  FIELD_ASSIGNMENTS,
  FORUM_QUESTS,
  GUILD_PROJECTS,
  MENTOR_GUIDE_PROMPTS,
  MICRO_MISSION_TEMPLATES,
  PROFILE_WORLD_CHALLENGES,
  PUBLIC_WORKS_TASKS,
  RELIC_SETS,
  ROOM_STATE_DEFINITIONS,
  SEASONAL_EVENTS,
  SIGNAL_BROADCASTS,
  VISITORS,
  WEEKLY_FACTION_CALLS,
} from "../../src/lib/mmo/expanded-play-seed-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seeding");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedPlayFunctions() {
  for (const fn of EXPANDED_PLAY_FUNCTIONS) {
    await prisma.mmoPlayFunction.upsert({
      where: { slug: fn.slug },
      create: {
        title: fn.title,
        slug: fn.slug,
        primaryRoute: fn.primaryRoute,
        connectedSystems: fn.connectedSystems,
        primaryPlayType: fn.primaryPlayType,
        accessLevel: fn.accessLevel,
        repeatability: fn.repeatability,
        reviewRequirement: fn.reviewRequirement,
        mvpPriority: fn.mvpPriority,
        description: fn.description,
        loreFraming: fn.loreFraming,
        playerFantasy: fn.playerFantasy,
        safetyNotes: fn.safetyNotes,
        sortOrder: fn.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: fn.title,
        primaryRoute: fn.primaryRoute,
        connectedSystems: fn.connectedSystems,
        primaryPlayType: fn.primaryPlayType,
        accessLevel: fn.accessLevel,
        repeatability: fn.repeatability,
        reviewRequirement: fn.reviewRequirement,
        mvpPriority: fn.mvpPriority,
        description: fn.description,
        loreFraming: fn.loreFraming,
        playerFantasy: fn.playerFantasy,
        safetyNotes: fn.safetyNotes,
        sortOrder: fn.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
}

async function seedPrompts(prompts: typeof ALL_PLAYABLE_PROMPTS, label: string) {
  for (const p of prompts) {
    await prisma.mmoPlayablePrompt.upsert({
      where: { slug: p.slug },
      create: {
        functionSlug: p.functionSlug,
        title: p.title,
        slug: p.slug,
        prompt: p.prompt,
        actionType: p.actionType,
        category: p.category ?? null,
        factionSlug: p.factionSlug ?? null,
        connectedRoute: p.connectedRoute ?? null,
        difficulty: p.difficulty ?? null,
        repeatability: p.repeatability ?? "always-available",
        cooldown: p.cooldown ?? null,
        reviewRequired: p.reviewRequired ?? false,
        proofStyle: p.proofStyle ?? null,
        rewardSummary: p.rewardSummary ?? null,
        badgeHook: p.badgeHook ?? null,
        avatarUnlockHook: p.avatarUnlockHook ?? null,
        reputationCategory: p.reputationCategory ?? null,
        reputationPoints: p.reputationPoints ?? 0,
        fieldLogTemplate: p.fieldLogTemplate ?? null,
        safetyNote: p.safetyNote ?? null,
        metadata: (p.metadata ?? {}) as Prisma.InputJsonValue,
        sortOrder: p.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        functionSlug: p.functionSlug,
        title: p.title,
        prompt: p.prompt,
        actionType: p.actionType,
        category: p.category ?? null,
        factionSlug: p.factionSlug ?? null,
        connectedRoute: p.connectedRoute ?? null,
        difficulty: p.difficulty ?? null,
        repeatability: p.repeatability ?? "always-available",
        cooldown: p.cooldown ?? null,
        reviewRequired: p.reviewRequired ?? false,
        proofStyle: p.proofStyle ?? null,
        rewardSummary: p.rewardSummary ?? null,
        badgeHook: p.badgeHook ?? null,
        avatarUnlockHook: p.avatarUnlockHook ?? null,
        reputationCategory: p.reputationCategory ?? null,
        reputationPoints: p.reputationPoints ?? 0,
        fieldLogTemplate: p.fieldLogTemplate ?? null,
        safetyNote: p.safetyNote ?? null,
        metadata: (p.metadata ?? {}) as Prisma.InputJsonValue,
        sortOrder: p.sortOrder,
        status: "active",
        updatedAt: new Date(),
      },
    });
  }
  console.log(`✓ ${label} seeded`);
}

async function seedPublicWorks() {
  for (const task of PUBLIC_WORKS_TASKS) {
    await prisma.mmoPublicWorksTask.upsert({
      where: { slug: task.slug },
      create: {
        title: task.title,
        slug: task.slug,
        taskType: task.taskType,
        difficulty: task.difficulty,
        estimatedTime: task.estimatedTime,
        ownerRole: task.ownerRole,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria,
        rewardSummary: task.rewardSummary,
        badgeHook: task.badgeHook ?? null,
        avatarUnlockHook: task.avatarUnlockHook ?? null,
        reviewRequired: task.reviewRequired ?? true,
        safetyNote: task.safetyNote,
        assetNeedPath: task.assetNeedPath ?? null,
        sortOrder: task.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: task.title,
        taskType: task.taskType,
        difficulty: task.difficulty,
        estimatedTime: task.estimatedTime,
        ownerRole: task.ownerRole,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria,
        rewardSummary: task.rewardSummary,
        badgeHook: task.badgeHook ?? null,
        avatarUnlockHook: task.avatarUnlockHook ?? null,
        reviewRequired: task.reviewRequired ?? true,
        safetyNote: task.safetyNote,
        assetNeedPath: task.assetNeedPath ?? null,
        sortOrder: task.sortOrder,
        status: "open",
        updatedAt: new Date(),
      },
    });
  }
}

async function seedRelicSets() {
  for (const set of RELIC_SETS) {
    await prisma.mmoRelicSet.upsert({
      where: { slug: set.slug },
      create: {
        title: set.title,
        slug: set.slug,
        fragmentsNeeded: set.fragmentsNeeded,
        completedRelicName: set.completedRelicName,
        profileDisplayEffect: set.profileDisplayEffect,
        avatarUnlockHook: set.avatarUnlockHook ?? null,
        badgeHook: set.badgeHook ?? null,
        safetyNote: set.safetyNote,
        sortOrder: set.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: set.title,
        fragmentsNeeded: set.fragmentsNeeded,
        completedRelicName: set.completedRelicName,
        profileDisplayEffect: set.profileDisplayEffect,
        avatarUnlockHook: set.avatarUnlockHook ?? null,
        badgeHook: set.badgeHook ?? null,
        safetyNote: set.safetyNote,
        sortOrder: set.sortOrder,
        updatedAt: new Date(),
      },
    });
  }
}

async function seedRoomStates() {
  for (const state of ROOM_STATE_DEFINITIONS) {
    await prisma.mmoRoomStateDefinition.upsert({
      where: { roomSlug_stateName: { roomSlug: state.roomSlug ?? "", stateName: state.stateName } },
      create: {
        stateName: state.stateName,
        roomSlug: state.roomSlug,
        trigger: state.trigger,
        roomCopy: state.roomCopy,
        visualEffect: state.visualEffect,
        rewardHook: state.rewardHook ?? null,
        safetyNote: state.safetyNote,
        sortOrder: state.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        trigger: state.trigger,
        roomCopy: state.roomCopy,
        visualEffect: state.visualEffect,
        rewardHook: state.rewardHook ?? null,
        safetyNote: state.safetyNote,
        sortOrder: state.sortOrder,
        updatedAt: new Date(),
      },
    });
  }
}

async function seedVisitors() {
  for (const v of VISITORS) {
    await prisma.mmoVisitor.upsert({
      where: { slug: v.slug },
      create: {
        name: v.name,
        slug: v.slug,
        appearanceText: v.appearanceText,
        roomSlug: v.roomSlug,
        prompt: v.prompt,
        rewardSummary: v.rewardSummary,
        loreUnlock: v.loreUnlock ?? null,
        avatarItem: v.avatarItem ?? null,
        fieldLogText: v.fieldLogText,
        safetyNote: v.safetyNote,
        sortOrder: v.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        name: v.name,
        appearanceText: v.appearanceText,
        roomSlug: v.roomSlug,
        prompt: v.prompt,
        rewardSummary: v.rewardSummary,
        loreUnlock: v.loreUnlock ?? null,
        avatarItem: v.avatarItem ?? null,
        fieldLogText: v.fieldLogText,
        safetyNote: v.safetyNote,
        sortOrder: v.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
}

async function seedSeasonalEvents() {
  for (const e of SEASONAL_EVENTS) {
    await prisma.mmoSeasonalEvent.upsert({
      where: { slug: e.slug },
      create: {
        title: e.title,
        slug: e.slug,
        seasonTiming: e.seasonTiming,
        eventRooms: e.eventRooms,
        eventPrompts: e.eventPrompts,
        eventRewards: e.eventRewards,
        badges: e.badges,
        profileCosmetics: e.profileCosmetics,
        avatarUnlocks: e.avatarUnlocks,
        guildHooks: e.guildHooks,
        safetyNotes: e.safetyNotes,
        sortOrder: e.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: e.title,
        seasonTiming: e.seasonTiming,
        eventRooms: e.eventRooms,
        eventPrompts: e.eventPrompts,
        eventRewards: e.eventRewards,
        badges: e.badges,
        profileCosmetics: e.profileCosmetics,
        avatarUnlocks: e.avatarUnlocks,
        guildHooks: e.guildHooks,
        safetyNotes: e.safetyNotes,
        sortOrder: e.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
}

async function seedRewardMappings() {
  for (const m of EXPANDED_PLAY_REWARD_MAPPINGS) {
    await prisma.rewardMapping.upsert({
      where: {
        sourceType_sourceSlug_rewardType_rewardSlug: {
          sourceType: "play_prompt",
          sourceSlug: m.sourceSlug,
          rewardType: m.rewardType,
          rewardSlug: m.rewardSlug,
        },
      },
      create: {
        sourceType: "play_prompt",
        sourceSlug: m.sourceSlug,
        rewardType: m.rewardType,
        rewardSlug: m.rewardSlug,
        repeatability: m.repeatability ?? "one_time",
        reviewRequired: m.reviewRequired ?? false,
        adminNotes: m.notes ?? null,
        isActive: true,
        updatedAt: new Date(),
      },
      update: {
        repeatability: m.repeatability ?? "one_time",
        reviewRequired: m.reviewRequired ?? false,
        adminNotes: m.notes ?? null,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
}

async function main() {
  console.log("Seeding Text MMO Expanded Play Functions...");

  await seedPlayFunctions();
  console.log("✓ play functions seeded");

  await seedPrompts(DAILY_SIGNALS, "daily signals");
  await seedPrompts(WEEKLY_FACTION_CALLS, "weekly faction calls");
  await seedPrompts(FIELD_ASSIGNMENTS, "field assignments");
  await seedPrompts(GUILD_PROJECTS, "guild projects");
  await seedPrompts(FORUM_QUESTS, "forum quests");
  await seedPrompts(PROFILE_WORLD_CHALLENGES, "profile world challenges");
  await seedPrompts(ARCHIVE_HUNTS, "archive hunts");
  await seedPrompts(SIGNAL_BROADCASTS, "signal player broadcasts");
  await seedVisitors();
  console.log("✓ visitors seeded");
  await seedSeasonalEvents();
  console.log("✓ seasonal events seeded");
  await seedPrompts(MICRO_MISSION_TEMPLATES, "micro-mission templates");
  await seedRelicSets();
  console.log("✓ relic sets seeded");
  await seedRoomStates();
  console.log("✓ room states seeded");
  await seedPrompts(MENTOR_GUIDE_PROMPTS, "mentor guide prompts");
  await seedPublicWorks();
  console.log("✓ public works tasks seeded");
  await seedRewardMappings();
  console.log("✓ reward mappings seeded");

  console.log("Text MMO Expanded Play Functions seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
