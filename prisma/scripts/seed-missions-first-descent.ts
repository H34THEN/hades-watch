import "dotenv/config";
import type { Prisma } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import {
  FIRST_DESCENT_MISSIONS,
  FIRST_DESCENT_PACK_ID,
} from "../../src/lib/missions/first-descent-pack";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Mission Pack I: First Descent Protocols\n");

  const factions = await prisma.faction.findMany({
    where: {
      slug: {
        in: [
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

  const factionBySlug = Object.fromEntries(factions.map((f) => [f.slug, f.id]));
  const missingFactions = FIRST_DESCENT_MISSIONS.map((m) => m.factionSlug).filter(
    (slug) => !factionBySlug[slug],
  );
  if (missingFactions.length) {
    throw new Error(
      `Missing factions: ${missingFactions.join(", ")}. Run: npm run db:seed:factions`,
    );
  }

  for (const mission of FIRST_DESCENT_MISSIONS) {
    const factionId = factionBySlug[mission.factionSlug];

    for (const badge of mission.badges) {
      await prisma.badge.upsert({
        where: { slug: badge.slug },
        update: {
          name: badge.name,
          description: badge.requirement,
          factionId,
          color: badge.placeholderColor,
          requirement: badge.requirement,
          proofType: badge.proofType,
          missionSlug: mission.slug,
          requiredForMissionCompletion: badge.requiredForMissionCompletion,
          isMissionCompletionBadge: badge.isMissionCompletionBadge,
          placeholderText: badge.placeholderText,
          placeholderColor: badge.placeholderColor,
          profileDisplayCategory: badge.isMissionCompletionBadge
            ? "mission-completion"
            : "mission-component",
        },
        create: {
          slug: badge.slug,
          name: badge.name,
          description: badge.requirement,
          factionId,
          color: badge.placeholderColor,
          requirement: badge.requirement,
          proofType: badge.proofType,
          missionSlug: mission.slug,
          requiredForMissionCompletion: badge.requiredForMissionCompletion,
          isMissionCompletionBadge: badge.isMissionCompletionBadge,
          placeholderText: badge.placeholderText,
          placeholderColor: badge.placeholderColor,
          profileDisplayCategory: badge.isMissionCompletionBadge
            ? "mission-completion"
            : "mission-component",
        },
      });
    }

    const missionMetadata = JSON.parse(
      JSON.stringify({
        sections: mission.sections,
        submissionFields: mission.submissionFields,
        optionalTitle: mission.optionalTitle ?? null,
      }),
    ) as Prisma.InputJsonValue;

    await prisma.quest.upsert({
      where: { slug: mission.slug },
      update: {
        title: mission.title,
        description: mission.description,
        status: "Available",
        factionId,
        difficulty: mission.difficulty,
        missionType: mission.missionType,
        estimatedTime: mission.estimatedTime,
        visibility: "approved",
        repeatable: mission.repeatable,
        openToAllFactions: true,
        reputationReward: mission.reputationReward,
        completionBadgeSlug: mission.completionBadgeSlug,
        requiredBadgeSlugs: mission.requiredBadgeSlugs,
        submissionType: mission.submissionType,
        reviewMode: mission.reviewMode,
        nonviolenceClassification: mission.nonviolenceClassification,
        safetyNotes: mission.sections.safetyNotes,
        proofPrivacyNotes: mission.sections.proofPrivacyNotes,
        loreUnlockSlug: mission.loreUnlockSlug,
        missionPack: FIRST_DESCENT_PACK_ID,
        missionMetadata,
      },
      create: {
        slug: mission.slug,
        title: mission.title,
        description: mission.description,
        status: "Available",
        factionId,
        difficulty: mission.difficulty,
        missionType: mission.missionType,
        estimatedTime: mission.estimatedTime,
        visibility: "approved",
        repeatable: mission.repeatable,
        openToAllFactions: true,
        reputationReward: mission.reputationReward,
        completionBadgeSlug: mission.completionBadgeSlug,
        requiredBadgeSlugs: mission.requiredBadgeSlugs,
        submissionType: mission.submissionType,
        reviewMode: mission.reviewMode,
        nonviolenceClassification: mission.nonviolenceClassification,
        safetyNotes: mission.sections.safetyNotes,
        proofPrivacyNotes: mission.sections.proofPrivacyNotes,
        loreUnlockSlug: mission.loreUnlockSlug,
        missionPack: FIRST_DESCENT_PACK_ID,
        missionMetadata,
      },
    });

    console.log(`  ✓ ${mission.slug}`);
  }

  console.log("\nFirst Descent mission pack seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
