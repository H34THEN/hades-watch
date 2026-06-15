import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { ArchiveArticleCard, ArchiveRepoCard } from "@/components/archive/ArchiveSignalCards";
import { ArchiveCommentForm } from "@/components/archive/ArchiveCommentForm";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getArchiveItemBySlug } from "@/lib/actions/archive-items";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import type { ArchiveSignalSection } from "@/lib/archive/signal-sections";
import { getSignalSectionPath } from "@/lib/archive/signal-sections";

interface ArchiveSignalItemDetailProps {
  section: ArchiveSignalSection;
  slug: string;
}

export async function ArchiveSignalItemDetail({ section, slug }: ArchiveSignalItemDetailProps) {
  await requireAuth();
  const user = await getSessionUser();
  const canComment = user ? isApprovedUser(user) : false;
  const canModerate = user ? isModerator(user.roles) : false;

  const item = await getArchiveItemBySlug(slug, section.itemType);
  if (!item) notFound();

  const submitter = item.submittedBy?.name ?? item.submittedBy?.email.split("@")[0] ?? "Underwatch";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <ArchiveNav active={section.slug} />
      <Link
        href={getSignalSectionPath(section.slug)}
        className="font-mono text-xs text-muted-foreground hover:text-primary"
      >
        ← {section.title}
      </Link>

      <TerminalPanel title={`signal.detail.${item.slug}`} className="mt-4">
        <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
          Source Record · Signal Thread
        </p>
        <h1 className="mt-2 font-mono text-xl tracking-widest uppercase text-primary">{item.title}</h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          {item.sourceName ?? item.domain} · Filed by {submitter} · {item.createdAt.toLocaleDateString()}
        </p>
        {canModerate && item.status !== "PUBLISHED" && (
          <p className="mt-2 font-mono text-[10px] text-amber-400 uppercase">Moderation: {item.status}</p>
        )}
        {item.summary && <p className="mt-4 text-sm leading-relaxed text-foreground/80">{item.summary}</p>}
        {item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4">
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            <CommandButton size="sm" variant="outline">
              {section.itemType === "CODE_REPO" ? "External Forge" : "External Source"}
            </CommandButton>
          </a>
        </div>
      </TerminalPanel>

      <TerminalPanel title="signal.discussion" className="mt-6">
        <h2 className="mb-4 font-mono text-sm tracking-widest uppercase text-primary">
          Open Discussion ({item.comments.length})
        </h2>
        {item.comments.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No comments filed yet.</p>
        ) : (
          <div className="space-y-4">
            {item.comments.map((comment) => (
              <div
                key={comment.id}
                className={`rounded border border-border/40 p-3 ${comment.isHidden ? "opacity-50" : ""}`}
              >
                <p className="font-mono text-[10px] text-muted-foreground">
                  {comment.author.name ?? comment.author.email.split("@")[0]} ·{" "}
                  {comment.createdAt.toLocaleString()}
                  {comment.isHidden && canModerate ? " · HIDDEN" : ""}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/85">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
        {canComment ? (
          <div className="mt-6 border-t border-border/40 pt-6">
            <ArchiveCommentForm archiveItemId={item.id} />
          </div>
        ) : (
          <p className="mt-6 font-mono text-xs text-muted-foreground italic">
            Approved operatives may comment. Pending accounts cannot transmit to Underwatch threads.
          </p>
        )}
      </TerminalPanel>
    </div>
  );
}
