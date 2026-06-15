import type { RoleName } from "@/generated/prisma/client";
import { isAdmin } from "@/lib/auth/roles";

export const DOSSIER_TITLES = [
  "Initiate",
  "Operative",
  "Archivist",
  "Signalborne",
  "Nullrunner",
  "Dead Drop Handler",
  "Cipherbreaker",
  "Oracle",
  "Owner",
] as const;

export type DossierTitle = (typeof DOSSIER_TITLES)[number];

export interface ClearanceInfo {
  level: number;
  label: string;
  shortLabel: string;
}

const CLEARANCE_BY_ROLE: Partial<Record<RoleName, ClearanceInfo>> = {
  Owner: { level: 5, label: "Clearance 5 — Oracle", shortLabel: "Oracle" },
  Admin: { level: 5, label: "Clearance 5 — Oracle", shortLabel: "Oracle" },
  Moderator: { level: 4, label: "Clearance 4 — Archivist", shortLabel: "Archivist" },
  Expert: { level: 4, label: "Clearance 4 — Archivist", shortLabel: "Archivist" },
  Operative: { level: 3, label: "Clearance 3 — Operative", shortLabel: "Operative" },
  Gamer: { level: 3, label: "Clearance 3 — Operative", shortLabel: "Operative" },
  Member: { level: 2, label: "Clearance 2 — Initiate", shortLabel: "Initiate" },
  Recruit: { level: 1, label: "Clearance 1 — Witness", shortLabel: "Witness" },
  Guest: { level: 1, label: "Clearance 1 — Witness", shortLabel: "Witness" },
};

const ROLE_PRIORITY: RoleName[] = [
  "Owner",
  "Admin",
  "Moderator",
  "Expert",
  "Operative",
  "Gamer",
  "Member",
  "Recruit",
  "Guest",
];

export function getHighestRole(roles: RoleName[]): RoleName {
  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) return role;
  }
  return "Member";
}

export function getClearanceForRoles(roles: RoleName[]): ClearanceInfo {
  const highest = getHighestRole(roles);
  return (
    CLEARANCE_BY_ROLE[highest] ?? {
      level: 0,
      label: "Clearance 0 — Ghost",
      shortLabel: "Ghost",
    }
  );
}

export interface DossierBadge {
  id: string;
  label: string;
  description?: string;
}

export interface EarnedTitle {
  id: string;
  label: DossierTitle | string;
}

export function computeEarnedTitles(input: {
  roles: RoleName[];
  cipherSolveCount: number;
  missionsCompleted: number;
  factionApproved: boolean;
  loreUnlockCount: number;
}): EarnedTitle[] {
  const titles: EarnedTitle[] = [{ id: "initiate", label: "Initiate" }];

  const highest = getHighestRole(input.roles);
  if (highest === "Owner") titles.push({ id: "owner", label: "Owner" });
  if (["Owner", "Admin", "Moderator", "Expert"].includes(highest)) {
    titles.push({ id: "archivist", label: "Archivist" });
  }
  if (input.missionsCompleted > 0) {
    titles.push({ id: "operative", label: "Operative" });
  }
  if (input.cipherSolveCount > 0) {
    titles.push({ id: "cipherbreaker", label: "Cipherbreaker" });
  }
  if (input.loreUnlockCount >= 3) {
    titles.push({ id: "signalborne", label: "Signalborne" });
  }
  if (input.factionApproved) {
    titles.push({ id: "nullrunner", label: "Nullrunner" });
  }
  if (input.loreUnlockCount >= 1) {
    titles.push({ id: "oracle-candidate", label: "Oracle" });
  }

  const seen = new Set<string>();
  return titles.filter((t) => {
    if (seen.has(t.label)) return false;
    seen.add(t.label);
    return true;
  });
}

export function computeBadges(input: {
  roles: RoleName[];
  clearance: ClearanceInfo;
  factionName: string | null;
  factionStatus: string | null;
  cipherSolveCount: number;
  missionsCompleted: number;
  activeMissions: number;
  loreUnlockCount: number;
}): DossierBadge[] {
  const badges: DossierBadge[] = [];
  const highest = getHighestRole(input.roles);

  badges.push({
    id: "role",
    label: highest.toUpperCase(),
    description: "Assigned network role",
  });

  badges.push({
    id: "clearance",
    label: input.clearance.shortLabel.toUpperCase(),
    description: input.clearance.label,
  });

  if (input.factionName && input.factionStatus === "Approved") {
    badges.push({
      id: "faction",
      label: input.factionName.toUpperCase(),
      description: "Known affiliation",
    });
  }

  if (input.cipherSolveCount > 0) {
    badges.push({
      id: "cipher",
      label: "CIPHERBREAKER",
      description: `${input.cipherSolveCount} cipher(s) solved`,
    });
  }

  if (input.missionsCompleted > 0) {
    badges.push({
      id: "mission-complete",
      label: "FIELD CLEARED",
      description: `${input.missionsCompleted} mission(s) completed`,
    });
  }

  if (input.activeMissions > 0) {
    badges.push({
      id: "mission-active",
      label: "ACTIVE OPS",
      description: `${input.activeMissions} active mission(s)`,
    });
  }

  if (input.loreUnlockCount > 0) {
    badges.push({
      id: "lore",
      label: "ARCHIVE ACCESS",
      description: `${input.loreUnlockCount} lore unlock(s)`,
    });
  }

  return badges;
}

/** Redact invite code for display — never expose full active codes publicly. */
export function redactInviteCode(code: string, showFullForAdmin = false): string {
  if (showFullForAdmin) return code;
  const parts = code.split("-");
  if (parts.length >= 2) {
    return `${parts.slice(0, -1).join("-")}-••••`;
  }
  if (code.length <= 4) return "••••";
  return `${code.slice(0, 4)}••••`;
}

export function canViewFullInviteLineage(roles: RoleName[]): boolean {
  return isAdmin(roles);
}

export function resolveActiveTitle(
  activeTitle: string | null,
  earned: EarnedTitle[],
): string {
  if (activeTitle && earned.some((t) => t.label === activeTitle)) {
    return activeTitle;
  }
  return earned[earned.length - 1]?.label ?? "Initiate";
}
