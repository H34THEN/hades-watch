import { FIRST_DESCENT_MISSIONS } from "@/lib/missions/first-descent-pack";
import { UNDERWATCH_CIVIC_ACTION_MISSIONS } from "@/lib/missions/underwatch-civic-action-pack";
import type { MissionPackMissionDefinition } from "@/lib/missions/types";

export const ALL_MISSION_DEFINITIONS: MissionPackMissionDefinition[] = [
  ...FIRST_DESCENT_MISSIONS,
  ...UNDERWATCH_CIVIC_ACTION_MISSIONS,
];

export function getMissionDefinitionBySlug(
  slug: string,
): MissionPackMissionDefinition | undefined {
  return ALL_MISSION_DEFINITIONS.find((mission) => mission.slug === slug);
}
