export const GRANT_REASONS = [
  "mission completion",
  "cipher completion",
  "dead drop completion",
  "volunteer contribution",
  "guild milestone",
  "manual Owner recognition",
  "migration/test grant",
  "faction leader approved mission",
  "event participation",
] as const;

export type GrantReason = (typeof GRANT_REASONS)[number];
