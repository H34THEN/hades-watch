import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import type { ArchiveSignalSection } from "@/lib/archive/signal-sections";
import { getSignalItemPath } from "@/lib/archive/signal-sections";

interface ArticleCardItem {
  slug: string;
  title: string;
  sourceName: string | null;
  sourceUrl: string;
  domain: string | null;
  summary: string | null;
  tags: string[];
  createdAt: Date;
  commentCount: number;
  status: string;
  submittedBy: { name: string | null; email: string } | null;
}

export function ArchiveArticleCard({
  item,
  section,
  showModeration = false,
}: {
  item: ArticleCardItem;
  section: ArchiveSignalSection;
  showModeration?: boolean;
}) {
  const submitter = item.submittedBy?.name ?? item.submittedBy?.email.split("@")[0] ?? "Unknown";

  return (
    <TerminalPanel title={`signal.${item.slug}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
            Filed From the Surface · External Source
          </p>
          <h3 className="mt-1 font-mono text-sm font-semibold uppercase text-primary">{item.title}</h3>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            {item.sourceName ?? item.domain} · {item.domain}
          </p>
        </div>
        {showModeration && item.status !== "PUBLISHED" && (
          <span className="rounded border border-amber-500/40 px-2 py-0.5 font-mono text-[10px] text-amber-400 uppercase">
            {item.status}
          </span>
        )}
      </div>
      {item.summary && <p className="mt-3 text-sm leading-relaxed text-foreground/80">{item.summary}</p>}
      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="mt-3 font-mono text-[10px] text-muted-foreground">
        Submitted by {submitter} · {item.createdAt.toLocaleDateString()} · {item.commentCount} comment
        {item.commentCount !== 1 ? "s" : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
          <CommandButton size="sm" variant="outline">
            External Link
          </CommandButton>
        </a>
        <Link href={getSignalItemPath(section.slug, item.slug)}>
          <CommandButton size="sm">Open Discussion</CommandButton>
        </Link>
      </div>
    </TerminalPanel>
  );
}

interface RepoCardItem extends ArticleCardItem {
  forge: string | null;
  repoOwner: string | null;
  repoName: string | null;
}

export function ArchiveRepoCard({
  item,
  section,
  showModeration = false,
}: {
  item: RepoCardItem;
  section: ArchiveSignalSection;
  showModeration?: boolean;
}) {
  const submitter = item.submittedBy?.name ?? item.submittedBy?.email.split("@")[0] ?? "Unknown";
  const forgeLabel = item.forge === "GITHUB" ? "GitHub" : item.forge === "CODEBERG" ? "Codeberg" : "External Forge";
  const repoPath =
    item.repoOwner && item.repoName ? `${item.repoOwner}/${item.repoName}` : item.domain;

  return (
    <TerminalPanel title={`repo.${item.slug}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
            Repo Signal · {forgeLabel}
          </p>
          <h3 className="mt-1 font-mono text-sm font-semibold uppercase text-primary">{item.title}</h3>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">{repoPath}</p>
        </div>
        {showModeration && item.status !== "PUBLISHED" && (
          <span className="rounded border border-amber-500/40 px-2 py-0.5 font-mono text-[10px] text-amber-400 uppercase">
            {item.status}
          </span>
        )}
      </div>
      {item.summary && <p className="mt-3 text-sm leading-relaxed text-foreground/80">{item.summary}</p>}
      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="mt-3 font-mono text-[10px] text-muted-foreground">
        Submitted by {submitter} · {item.createdAt.toLocaleDateString()} · {item.commentCount} comment
        {item.commentCount !== 1 ? "s" : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
          <CommandButton size="sm" variant="outline">
            External Forge
          </CommandButton>
        </a>
        <Link href={getSignalItemPath(section.slug, item.slug)}>
          <CommandButton size="sm">Discuss Tool</CommandButton>
        </Link>
      </div>
    </TerminalPanel>
  );
}
