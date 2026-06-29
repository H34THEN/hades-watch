import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  forgeLabel,
  repoPath,
  submitterLabel,
  type ArchiveRepoCardItem,
} from "@/lib/archive/repo-card";
import type { ArchiveSignalSection } from "@/lib/archive/signal-sections";
import { getSignalSectionPath } from "@/lib/archive/signal-sections";

interface ArchiveSignalDetailSidebarProps {
  section: ArchiveSignalSection;
  item: ArchiveRepoCardItem & {
    sourceUrl: string;
    domain: string | null;
    status: string;
    updatedAt?: Date;
  };
  isRepo: boolean;
  showModeration?: boolean;
}

export function ArchiveSignalDetailSidebar({
  section,
  item,
  isRepo,
  showModeration = false,
}: ArchiveSignalDetailSidebarProps) {
  const submitter = submitterLabel(item.submittedBy);

  return (
    <aside className="min-w-0 space-y-4">
      <TerminalPanel title="signal.metadata">
        <dl className="space-y-2 font-mono text-xs">
          {isRepo && item.forge ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Forge</dt>
              <dd>{forgeLabel(item.forge)}</dd>
            </div>
          ) : null}
          {isRepo ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Repo</dt>
              <dd className="truncate text-right">{repoPath(item)}</dd>
            </div>
          ) : (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Domain</dt>
              <dd className="truncate text-right">{item.domain ?? "—"}</dd>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Filed</dt>
            <dd>{item.createdAt.toLocaleDateString()}</dd>
          </div>
          {item.updatedAt ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Updated</dt>
              <dd>{item.updatedAt.toLocaleDateString()}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Comments</dt>
            <dd>{item.commentCount}</dd>
          </div>
          {showModeration && item.status !== "PUBLISHED" ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="text-amber-400">{item.status}</dd>
            </div>
          ) : null}
        </dl>
      </TerminalPanel>

      {item.tags.length > 0 ? (
        <TerminalPanel title="signal.tags">
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Link
                key={tag}
                href={`${getSignalSectionPath(section.slug)}?tag=${encodeURIComponent(tag)}`}
                className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-primary"
              >
                {tag}
              </Link>
            ))}
          </div>
        </TerminalPanel>
      ) : null}

      <TerminalPanel title="signal.relay">
        <p className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">Submitter</p>
        <p className="font-mono text-sm">{submitter}</p>
        <div className="mt-4 flex flex-col gap-2">
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer nofollow ugc">
            <CommandButton size="sm" variant="outline" className="w-full">
              {isRepo ? "Open Relic" : "External Source"}
            </CommandButton>
          </a>
          <Link href={getSignalSectionPath(section.slug)}>
            <CommandButton size="sm" variant="outline" className="w-full">
              ← {section.title}
            </CommandButton>
          </Link>
        </div>
      </TerminalPanel>

      {isRepo ? (
        <div className="rounded border border-amber-500/25 bg-amber-500/5 p-3">
          <p className="font-mono text-[10px] tracking-wider text-amber-400/90 uppercase">
            Safety note
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Verify repo intent before running code. Ghost in Tech indexes tools for learning and
            defensive research — not exploit distribution.
          </p>
        </div>
      ) : null}
    </aside>
  );
}
