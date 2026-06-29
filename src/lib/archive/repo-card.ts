import type { ArchiveItem } from "@/generated/prisma/client";

export function resolveRepoSummary(item: {
  summary: string | null;
  title: string;
}): string {
  if (item.summary?.trim()) return item.summary.trim();
  return "Repo relic recovered from the surface web.";
}

export type ArchiveRepoCardItem = Pick<
  ArchiveItem,
  | "slug"
  | "title"
  | "sourceName"
  | "sourceUrl"
  | "domain"
  | "summary"
  | "createdAt"
  | "status"
  | "forge"
  | "repoOwner"
  | "repoName"
> & {
  updatedAt?: Date;
  tags: string[];
  commentCount: number;
  submittedBy: { name: string | null; email: string } | null;
};

export function forgeLabel(forge: string | null): string {
  if (forge === "GITHUB") return "GitHub";
  if (forge === "CODEBERG") return "Codeberg";
  return "Other Forge";
}

export function forgeChipClass(forge: string | null): string {
  if (forge === "GITHUB") return "forgeGithub";
  if (forge === "CODEBERG") return "forgeCodeberg";
  return "forgeOther";
}

export function submitterLabel(
  submittedBy: { name: string | null; email: string } | null,
): string {
  if (!submittedBy) return "Unknown";
  return submittedBy.name ?? submittedBy.email.split("@")[0] ?? "Unknown";
}

export function repoPath(item: ArchiveRepoCardItem): string {
  if (item.repoOwner && item.repoName) return `${item.repoOwner}/${item.repoName}`;
  return item.domain ?? item.sourceUrl;
}
