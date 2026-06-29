import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import {
  AVATAR_UNLOCK_ASSETS,
  CANON_LORE_PROMPTS,
  CANON_TIER_DEFINITIONS,
  COMMUNITY_BUILDER_PROMPTS,
  PLAYER_TITLES,
  RECOGNITION_TEMPLATES,
  REPUTATION_EVENT_DEFINITIONS,
  REWARD_BADGES,
  REWARD_LOOT,
  REWARD_MAPPINGS,
  REWARD_POOLS,
  STARTER_GUILDS,
  VOLUNTEER_OPPORTUNITIES,
} from "../../src/lib/rewards/mmo-rewards-seed-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seeding");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding MMO Seed Data and Reward System...");

  for (const guild of STARTER_GUILDS) {
    await prisma.guild.upsert({
      where: { slug: guild.slug },
      create: {
        name: guild.name,
        slug: guild.slug,
        description: guild.description,
        purpose: guild.purpose,
        conductAgreement: guild.conductAgreement,
        factionAffinity: guild.primaryFactionSlug,
        visibility: guild.visibility,
        status: "APPROVED",
        isStarterGuild: true,
        guildType: guild.guildType,
        publicMotto: guild.publicMotto,
        joinPolicy: guild.joinPolicy,
        primaryFactionSlug: guild.primaryFactionSlug,
        secondaryAffinities: guild.secondaryAffinities,
        suggestedActivities: guild.suggestedActivities,
        starterRoles: guild.starterRoles,
        safetyNotes: guild.safetyNotes,
        badgeHooks: guild.badgeHooks,
        imageAssetPath: guild.imageAssetPath,
        bannerAssetPath: guild.bannerAssetPath,
        foundingHook: guild.foundingHook,
        founderId: null,
        rules: guild.safetyNotes,
        updatedAt: new Date(),
      },
      update: {
        name: guild.name,
        description: guild.description,
        purpose: guild.purpose,
        conductAgreement: guild.conductAgreement,
        factionAffinity: guild.primaryFactionSlug,
        visibility: guild.visibility,
        status: "APPROVED",
        isStarterGuild: true,
        guildType: guild.guildType,
        publicMotto: guild.publicMotto,
        joinPolicy: guild.joinPolicy,
        primaryFactionSlug: guild.primaryFactionSlug,
        secondaryAffinities: guild.secondaryAffinities,
        suggestedActivities: guild.suggestedActivities,
        starterRoles: guild.starterRoles,
        safetyNotes: guild.safetyNotes,
        badgeHooks: guild.badgeHooks,
        imageAssetPath: guild.imageAssetPath,
        bannerAssetPath: guild.bannerAssetPath,
        foundingHook: guild.foundingHook,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ starter guilds seeded");

  for (const opp of VOLUNTEER_OPPORTUNITIES) {
    const description = `${opp.purpose} ${opp.taskDescription}`.trim();
    await prisma.volunteerOpportunity.upsert({
      where: { slug: opp.slug },
      create: {
        title: opp.title,
        slug: opp.slug,
        description,
        lane: opp.lane,
        difficulty: opp.difficulty,
        estimatedTime: opp.estimatedTime,
        status: "OPEN",
        purpose: opp.purpose,
        taskDescription: opp.taskDescription,
        acceptanceCriteria: opp.acceptanceCriteria,
        whatNotToSubmit: opp.whatNotToSubmit,
        factionAffinity: opp.factionAffinity,
        accessLevel: opp.accessLevel,
        reputationRewardPoints: opp.reputationRewardPoints,
        reputationCategory: opp.reputationCategory,
        badgeHookSlug: opp.badgeHookSlug,
        avatarUnlockHookSlug: opp.avatarUnlockHookSlug,
        imageAssetPath: opp.imageAssetPath,
        reviewRequired: opp.reviewRequired,
        isStarterSeed: true,
        updatedAt: new Date(),
      },
      update: {
        title: opp.title,
        description,
        lane: opp.lane,
        difficulty: opp.difficulty,
        estimatedTime: opp.estimatedTime,
        purpose: opp.purpose,
        taskDescription: opp.taskDescription,
        acceptanceCriteria: opp.acceptanceCriteria,
        whatNotToSubmit: opp.whatNotToSubmit,
        factionAffinity: opp.factionAffinity,
        accessLevel: opp.accessLevel,
        reputationRewardPoints: opp.reputationRewardPoints,
        reputationCategory: opp.reputationCategory,
        badgeHookSlug: opp.badgeHookSlug,
        avatarUnlockHookSlug: opp.avatarUnlockHookSlug,
        imageAssetPath: opp.imageAssetPath,
        reviewRequired: opp.reviewRequired,
        isStarterSeed: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ volunteer opportunities seeded");

  for (const prompt of COMMUNITY_BUILDER_PROMPTS) {
    await prisma.communityBuilderPrompt.upsert({
      where: { slug: prompt.slug },
      create: {
        slug: prompt.slug,
        title: prompt.title,
        category: prompt.category,
        suggestedRoute: prompt.suggestedRoute,
        playerPrompt: prompt.playerPrompt,
        reviewRequired: prompt.reviewRequired,
        safetyNote: prompt.safetyNote,
        rewardSuggestions: prompt.rewardSuggestions,
        badgeHooks: prompt.badgeHooks,
        sortOrder: prompt.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: prompt.title,
        category: prompt.category,
        suggestedRoute: prompt.suggestedRoute,
        playerPrompt: prompt.playerPrompt,
        reviewRequired: prompt.reviewRequired,
        safetyNote: prompt.safetyNote,
        rewardSuggestions: prompt.rewardSuggestions,
        badgeHooks: prompt.badgeHooks,
        sortOrder: prompt.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ community builder prompts seeded");

  for (const template of RECOGNITION_TEMPLATES) {
    await prisma.playerRecognitionTemplate.upsert({
      where: { slug: template.slug },
      create: {
        slug: template.slug,
        title: template.title,
        recognitionType: template.recognitionType,
        category: template.category,
        grantedByRole: template.grantedByRole,
        visibility: template.visibility,
        description: template.description,
        flavorText: template.flavorText,
        unlockCondition: template.unlockCondition,
        revocable: template.revocable,
        optOut: template.optOut,
        badgeHookSlug: template.badgeHookSlug,
        titleHookSlug: template.titleHookSlug,
        lootHookSlug: template.lootHookSlug,
        imageAssetPath: template.imageAssetPath,
        sortOrder: template.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: template.title,
        recognitionType: template.recognitionType,
        category: template.category,
        grantedByRole: template.grantedByRole,
        visibility: template.visibility,
        description: template.description,
        flavorText: template.flavorText,
        unlockCondition: template.unlockCondition,
        revocable: template.revocable,
        optOut: template.optOut,
        badgeHookSlug: template.badgeHookSlug,
        titleHookSlug: template.titleHookSlug,
        lootHookSlug: template.lootHookSlug,
        imageAssetPath: template.imageAssetPath,
        sortOrder: template.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ recognition templates seeded");

  for (const def of REPUTATION_EVENT_DEFINITIONS) {
    await prisma.reputationEventDefinition.upsert({
      where: { slug: def.slug },
      create: {
        slug: def.slug,
        eventName: def.eventName,
        category: def.category,
        points: def.points,
        trigger: def.trigger,
        cooldownKey: def.cooldownKey ?? null,
        dailyCap: def.dailyCap ?? null,
        reviewRequired: def.reviewRequired,
        abuseNotes: def.abuseNotes,
        updatedAt: new Date(),
      },
      update: {
        eventName: def.eventName,
        category: def.category,
        points: def.points,
        trigger: def.trigger,
        cooldownKey: def.cooldownKey ?? null,
        dailyCap: def.dailyCap ?? null,
        reviewRequired: def.reviewRequired,
        abuseNotes: def.abuseNotes,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ reputation events seeded");

  for (const tier of CANON_TIER_DEFINITIONS) {
    await prisma.canonTierDefinition.upsert({
      where: { slug: tier.slug },
      create: {
        tier: tier.tier,
        tierLabel: tier.tierLabel,
        slug: tier.slug,
        whatUsersCanCreate: tier.whatUsersCanCreate,
        examplePrompt: tier.examplePrompt,
        reviewRequirement: tier.reviewRequirement,
        ownershipRules: tier.ownershipRules,
        safetyRules: tier.safetyRules,
        rewardHooks: tier.rewardHooks ?? null,
        badgeHooks: tier.badgeHooks ?? null,
        loreUnlockHooks: tier.loreUnlockHooks ?? null,
        sortOrder: tier.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        tierLabel: tier.tierLabel,
        whatUsersCanCreate: tier.whatUsersCanCreate,
        examplePrompt: tier.examplePrompt,
        reviewRequirement: tier.reviewRequirement,
        ownershipRules: tier.ownershipRules,
        safetyRules: tier.safetyRules,
        rewardHooks: tier.rewardHooks ?? null,
        badgeHooks: tier.badgeHooks ?? null,
        loreUnlockHooks: tier.loreUnlockHooks ?? null,
        sortOrder: tier.sortOrder,
        updatedAt: new Date(),
      },
    });
  }

  for (const prompt of CANON_LORE_PROMPTS) {
    await prisma.canonLorePrompt.upsert({
      where: { slug: prompt.slug },
      create: {
        slug: prompt.slug,
        title: prompt.title,
        tier: prompt.tier,
        playerPrompt: prompt.playerPrompt,
        rewardHook: prompt.rewardHook,
        sortOrder: prompt.sortOrder,
        updatedAt: new Date(),
      },
      update: {
        title: prompt.title,
        tier: prompt.tier,
        playerPrompt: prompt.playerPrompt,
        rewardHook: prompt.rewardHook,
        sortOrder: prompt.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ canon tier prompts seeded");

  for (const title of PLAYER_TITLES) {
    await prisma.playerTitle.upsert({
      where: { slug: title.slug },
      create: {
        slug: title.slug,
        title: title.title,
        category: title.category,
        unlockCondition: title.unlockCondition,
        factionAffinity: title.factionAffinity ?? null,
        displayLocation: title.displayLocation ?? null,
        flavorText: title.flavorText ?? null,
        updatedAt: new Date(),
      },
      update: {
        title: title.title,
        category: title.category,
        unlockCondition: title.unlockCondition,
        factionAffinity: title.factionAffinity ?? null,
        displayLocation: title.displayLocation ?? null,
        flavorText: title.flavorText ?? null,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ player titles seeded");

  for (const badge of REWARD_BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      create: {
        slug: badge.slug,
        name: badge.name,
        description: badge.unlockCondition,
        profileDisplayCategory: badge.category,
        tier: badge.tier,
        assetPath: badge.assetPath,
        placeholderText: badge.name.slice(0, 4).toUpperCase(),
      },
      update: {
        name: badge.name,
        description: badge.unlockCondition,
        profileDisplayCategory: badge.category,
        tier: badge.tier,
        assetPath: badge.assetPath,
      },
    });
  }
  console.log("✓ badges seeded");

  for (const loot of REWARD_LOOT) {
    await prisma.mmoLoot.upsert({
      where: { slug: loot.slug },
      create: {
        name: loot.name,
        slug: loot.slug,
        type: loot.type,
        rarity: loot.rarity,
        description: loot.unlockCondition,
        flavorText: loot.flavorText,
        displayLocation: loot.displayLocation,
        unlockCondition: loot.unlockCondition,
        assetPath: loot.assetPath,
        sourceLoopSlug: loot.category,
        updatedAt: new Date(),
      },
      update: {
        name: loot.name,
        type: loot.type,
        rarity: loot.rarity,
        description: loot.unlockCondition,
        flavorText: loot.flavorText,
        displayLocation: loot.displayLocation,
        unlockCondition: loot.unlockCondition,
        assetPath: loot.assetPath,
        sourceLoopSlug: loot.category,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ loot/relics seeded");

  for (const asset of AVATAR_UNLOCK_ASSETS) {
    await prisma.avatarUnlockAsset.upsert({
      where: { slug: asset.slug },
      create: {
        slug: asset.slug,
        name: asset.name,
        category: asset.category,
        rarity: asset.rarity,
        factionAffinity: asset.factionAffinity ?? null,
        unlockSource: asset.unlockSource,
        assetPath: asset.assetPath,
        layerOrder: asset.layerOrder,
        visualDescription: asset.visualDescription,
        updatedAt: new Date(),
      },
      update: {
        name: asset.name,
        category: asset.category,
        rarity: asset.rarity,
        factionAffinity: asset.factionAffinity ?? null,
        unlockSource: asset.unlockSource,
        assetPath: asset.assetPath,
        layerOrder: asset.layerOrder,
        visualDescription: asset.visualDescription,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ avatar unlocks seeded");

  for (const mapping of REWARD_MAPPINGS) {
    await prisma.rewardMapping.upsert({
      where: {
        sourceType_sourceSlug_rewardType_rewardSlug: {
          sourceType: mapping.sourceType,
          sourceSlug: mapping.sourceSlug,
          rewardType: mapping.rewardType,
          rewardSlug: mapping.rewardSlug,
        },
      },
      create: {
        sourceType: mapping.sourceType,
        sourceSlug: mapping.sourceSlug,
        rewardType: mapping.rewardType,
        rewardSlug: mapping.rewardSlug,
        quantity: mapping.quantity ?? 1,
        repeatability: mapping.repeatability ?? "one_time",
        reviewRequired: mapping.reviewRequired ?? false,
        adminNotes: mapping.adminNotes ?? null,
        factionLeaderNotes: mapping.factionLeaderNotes ?? null,
        updatedAt: new Date(),
      },
      update: {
        quantity: mapping.quantity ?? 1,
        repeatability: mapping.repeatability ?? "one_time",
        reviewRequired: mapping.reviewRequired ?? false,
        adminNotes: mapping.adminNotes ?? null,
        factionLeaderNotes: mapping.factionLeaderNotes ?? null,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
  console.log("✓ reward mappings seeded");

  for (const pool of REWARD_POOLS) {
    const dbPool = await prisma.rewardPool.upsert({
      where: { slug: pool.slug },
      create: {
        slug: pool.slug,
        name: pool.name,
        factionSlug: pool.factionSlug,
        poolType: pool.poolType,
        description: pool.description,
        adminNotes: pool.adminNotes ?? null,
        updatedAt: new Date(),
      },
      update: {
        name: pool.name,
        factionSlug: pool.factionSlug,
        poolType: pool.poolType,
        description: pool.description,
        adminNotes: pool.adminNotes ?? null,
        isActive: true,
        updatedAt: new Date(),
      },
    });

    for (const item of pool.items) {
      await prisma.rewardPoolItem.upsert({
        where: {
          poolId_rewardType_rewardSlug: {
            poolId: dbPool.id,
            rewardType: item.rewardType,
            rewardSlug: item.rewardSlug,
          },
        },
        create: {
          poolId: dbPool.id,
          rewardType: item.rewardType,
          rewardSlug: item.rewardSlug,
          quantity: item.quantity ?? 1,
          notes: item.notes ?? null,
        },
        update: {
          quantity: item.quantity ?? 1,
          notes: item.notes ?? null,
        },
      });
    }
  }
  console.log("✓ reward pools seeded");

  console.log("MMO Seed Data and Reward System seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
