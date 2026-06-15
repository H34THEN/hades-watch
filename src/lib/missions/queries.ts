import type { Prisma } from "@/generated/prisma/client";
import { FIRST_DESCENT_PACK_ID } from "@/lib/missions/first-descent-pack";
import { getMissionDefinitionBySlug } from "@/lib/missions/registry";
import type {
  MissionContentSections,
  MissionDetailForUser,
  MissionSubmissionField,
} from "@/lib/missions/types";
import { prisma } from "@/lib/prisma";

function parseMissionMetadata(value: Prisma.JsonValue | null): {
  sections: MissionContentSections | null;
  submissionFields: MissionSubmissionField[];
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { sections: null, submissionFields: [] };
  }
  const raw = value as Record<string, unknown>;
  const sections =
    raw.sections && typeof raw.sections === "object" && !Array.isArray(raw.sections)
      ? (raw.sections as MissionContentSections)
      : null;
  const submissionFields = Array.isArray(raw.submissionFields)
    ? (raw.submissionFields as MissionSubmissionField[])
    : [];
  return { sections, submissionFields };
}

function parseRequiredBadgeSlugs(value: Prisma.JsonValue | null): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((s): s is string => typeof s === "string");
}

export async function getFirstDescentMissions() {
  return getMissionsByPack(FIRST_DESCENT_PACK_ID);
}

export async function getMissionsByPack(packId: string) {
  return prisma.quest.findMany({
    where: {
      status: "Available",
      missionPack: packId,
    },
    orderBy: { title: "asc" },
    include: {
      faction: { select: { name: true, slug: true } },
    },
  });
}

export async function getMissionDetailForUser(
  slug: string,
  userId: string,
): Promise<MissionDetailForUser | null> {
  const quest = await prisma.quest.findUnique({
    where: { slug },
    include: {
      faction: { select: { name: true, slug: true } },
    },
  });
  if (!quest || quest.status !== "Available") return null;

  const packMission = getMissionDefinitionBySlug(slug);
  const { sections, submissionFields } = parseMissionMetadata(quest.missionMetadata);
  const requiredBadgeSlugs =
    parseRequiredBadgeSlugs(quest.requiredBadgeSlugs) ||
    packMission?.requiredBadgeSlugs ||
    [];

  const [participation, latestSubmission, userBadges] = await Promise.all([
    prisma.missionParticipation.findUnique({
      where: { userId_questId: { userId, questId: quest.id } },
      select: { status: true },
    }),
    prisma.missionSubmission.findFirst({
      where: { userId, questId: quest.id },
      orderBy: { submittedAt: "desc" },
      select: { id: true, status: true, submittedAt: true, reviewNote: true },
    }),
    prisma.userBadge.findMany({
      where: {
        userId,
        badge: { missionSlug: slug },
      },
      include: {
        badge: {
          select: {
            slug: true,
            name: true,
            color: true,
            placeholderText: true,
            placeholderColor: true,
            missionSlug: true,
            requiredForMissionCompletion: true,
            isMissionCompletionBadge: true,
          },
        },
      },
      orderBy: { awardedAt: "desc" },
    }),
  ]);

  const missionCompleted = userBadges.some(
    (ub) =>
      ub.badge.isMissionCompletionBadge &&
      ub.verificationStatus === "Verified",
  );

  const canSubmit =
    quest.repeatable ||
    (!missionCompleted &&
      (!latestSubmission || latestSubmission.status === "Rejected"));

  return {
    id: quest.id,
    slug: quest.slug,
    title: quest.title,
    description: quest.description,
    status: quest.status,
    difficulty: quest.difficulty,
    missionType: quest.missionType,
    estimatedTime: quest.estimatedTime,
    repeatable: quest.repeatable,
    openToAllFactions: quest.openToAllFactions,
    reputationReward: quest.reputationReward,
    completionBadgeSlug: quest.completionBadgeSlug,
    requiredBadgeSlugs,
    submissionType: quest.submissionType,
    reviewMode: quest.reviewMode,
    sourceConfidence: packMission?.sourceConfidence ?? null,
    nonviolenceClassification: quest.nonviolenceClassification,
    safetyNotes: quest.safetyNotes,
    proofPrivacyNotes: quest.proofPrivacyNotes,
    loreUnlockSlug: quest.loreUnlockSlug,
    missionPack: quest.missionPack,
    sections: sections ?? packMission?.sections ?? null,
    submissionFields: submissionFields.length
      ? submissionFields
      : (packMission?.submissionFields ?? []),
    faction: quest.faction,
    badges: packMission?.badges ?? [],
    userBadges: userBadges.map((ub) => ({
      slug: ub.badge.slug,
      name: ub.badge.name,
      color: ub.badge.color,
      placeholderText: ub.badge.placeholderText,
      placeholderColor: ub.badge.placeholderColor,
      missionSlug: ub.badge.missionSlug,
      requiredForMissionCompletion: ub.badge.requiredForMissionCompletion,
      isMissionCompletionBadge: ub.badge.isMissionCompletionBadge,
      verificationStatus: ub.verificationStatus,
      awardedAt: ub.awardedAt,
    })),
    participation,
    latestSubmission,
    canSubmit,
  };
}

export async function getPendingMissionSubmissions() {
  return prisma.missionSubmission.findMany({
    where: { status: "Pending" },
    orderBy: { submittedAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          character: { select: { callsign: true } },
        },
      },
      quest: {
        select: {
          id: true,
          slug: true,
          title: true,
          faction: { select: { name: true, slug: true } },
          requiredBadgeSlugs: true,
          completionBadgeSlug: true,
          reputationReward: true,
          repeatable: true,
        },
      },
    },
  });
}

export async function getMissionSubmissionForReview(submissionId: string) {
  return prisma.missionSubmission.findUnique({
    where: { id: submissionId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          character: { select: { callsign: true } },
        },
      },
      quest: {
        include: { faction: { select: { id: true, slug: true, name: true } } },
      },
    },
  });
}

export async function getUserMissionBadges(userId: string) {
  return prisma.userBadge.findMany({
    where: {
      userId,
      badge: { missionSlug: { not: null } },
    },
    include: {
      badge: {
        include: { faction: { select: { name: true, slug: true } } },
      },
    },
    orderBy: { awardedAt: "desc" },
  });
}
