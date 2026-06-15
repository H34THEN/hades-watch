import type { CodeForge } from "@/generated/prisma/client";

export interface ParsedRepoUrl {
  forge: CodeForge;
  repoOwner: string;
  repoName: string;
  domain: string;
}

export function parseDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseRepoUrl(url: string): ParsedRepoUrl | null {
  if (!isHttpUrl(url)) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const parts = parsed.pathname.split("/").filter(Boolean);

    if (host === "github.com" && parts.length >= 2) {
      return {
        forge: "GITHUB",
        repoOwner: parts[0],
        repoName: parts[1].replace(/\.git$/, ""),
        domain: host,
      };
    }

    if (host === "codeberg.org" && parts.length >= 2) {
      return {
        forge: "CODEBERG",
        repoOwner: parts[0],
        repoName: parts[1].replace(/\.git$/, ""),
        domain: host,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function isAllowedRepoHost(url: string): boolean {
  const parsed = parseRepoUrl(url);
  return parsed !== null;
}

export function parseTagsInput(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}
