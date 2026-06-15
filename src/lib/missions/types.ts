import type {
  MissionDifficulty,
  MissionPackMissionType,
  MissionReviewMode,
  MissionSubmissionType,
} from "@/generated/prisma/client";

export interface MissionBadgeDefinition {
  slug: string;
  name: string;
  requirement: string;
  proofType: string;
  placeholderText: string;
  placeholderColor: string;
  requiredForMissionCompletion: boolean;
  isMissionCompletionBadge: boolean;
}

export interface MissionSubmissionField {
  id: string;
  label: string;
  type: "text" | "textarea" | "checkbox";
  required: boolean;
  placeholder?: string;
  helpText?: string;
}

export interface MissionLeaderTransmission {
  speaker: string;
  body: string;
}

export interface MissionContentSections {
  missionBrief: string;
  realWorldPurpose: string;
  inUniverseContext: string;
  objective: string;
  operativeTasks: string[];
  submissionRequirements: string[];
  proofPrivacyNotes: string;
  safetyNotes: string;
  successCriteria: string[];
  factionLeaderTransmission: MissionLeaderTransmission;
  archivistNote: string;
  rewards: string[];
  profileBadgePlaceholderNotes: string;
}

export interface FirstDescentMissionDefinition {
  slug: string;
  title: string;
  description: string;
  factionSlug: string;
  difficulty: MissionDifficulty;
  missionType: MissionPackMissionType;
  estimatedTime: string;
  repeatable: boolean;
  reputationReward: number;
  completionBadgeSlug: string;
  requiredBadgeSlugs: string[];
  submissionType: MissionSubmissionType;
  reviewMode: MissionReviewMode;
  nonviolenceClassification: string;
  loreUnlockSlug: string;
  optionalTitle?: string;
  badges: MissionBadgeDefinition[];
  sections: MissionContentSections;
  submissionFields: MissionSubmissionField[];
}

export interface MissionBadgeRecord {
  slug: string;
  name: string;
  color: string | null;
  placeholderText: string | null;
  placeholderColor: string | null;
  missionSlug: string | null;
  requiredForMissionCompletion: boolean;
  isMissionCompletionBadge: boolean;
  verificationStatus: "Pending" | "Verified" | "Rejected" | null;
  awardedAt: Date | null;
}

export interface MissionDetailForUser {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  difficulty: MissionDifficulty | null;
  missionType: MissionPackMissionType | null;
  estimatedTime: string | null;
  repeatable: boolean;
  openToAllFactions: boolean;
  reputationReward: number | null;
  completionBadgeSlug: string | null;
  requiredBadgeSlugs: string[];
  submissionType: MissionSubmissionType | null;
  reviewMode: MissionReviewMode | null;
  nonviolenceClassification: string | null;
  safetyNotes: string | null;
  proofPrivacyNotes: string | null;
  loreUnlockSlug: string | null;
  missionPack: string | null;
  sections: MissionContentSections | null;
  submissionFields: MissionSubmissionField[];
  faction: { name: string; slug: string } | null;
  badges: MissionBadgeDefinition[];
  userBadges: MissionBadgeRecord[];
  participation: { status: string } | null;
  latestSubmission: {
    id: string;
    status: string;
    submittedAt: Date;
    reviewNote: string | null;
  } | null;
  canSubmit: boolean;
}
