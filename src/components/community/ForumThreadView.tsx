import Link from "next/link";
import { ForumCommentForm } from "@/components/community/ForumCommentForm";
import { ForumCommentList } from "@/components/community/ForumCommentList";
import { ForumReactionButtons } from "@/components/community/ForumReactionButtons";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

type ThreadAuthor = {
  id: string;
  character?: { callsign: string | null } | null;
  name: string | null;
  email: string;
};

interface ForumThreadViewProps {
  thread: {
    id: string;
    slug: string;
    title: string;
    pinned: boolean;
    score: number;
    status: string;
    createdAt: Date;
    author: ThreadAuthor;
    category: { slug: string; name: string };
    reactions: { reactionType: string; userId: string }[];
  };
  bodyHtml: string;
  comments: Parameters<typeof ForumCommentList>[0]["comments"];
  currentUserId?: string | null;
  canReply?: boolean;
}

function authorCallsign(author: ThreadAuthor): string {
  const callsign = author.character?.callsign;
  if (callsign) {
    return callsign;
  }
  return author.name ?? author.email.split("@")[0] ?? "operative";
}

export function ForumThreadView({
  thread,
  bodyHtml,
  comments,
  currentUserId,
  canReply = true,
}: ForumThreadViewProps) {
  const locked = thread.status === "LOCKED";

  return (
    <div className="space-y-6">
      <TerminalPanel title={`forums.${thread.category.slug}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/community/forums/${thread.category.slug}`}
            className="font-mono text-[10px] tracking-wider text-primary uppercase hover:underline"
          >
            ← {thread.category.name}
          </Link>
          {thread.pinned && <span className={styles.pinnedBadge}>Pinned</span>}
          {locked && (
            <span className={cn(styles.statusChip, styles.statusNeutral)}>Locked</span>
          )}
        </div>

        <h1 className="font-mono text-lg tracking-wide text-foreground uppercase">
          {thread.title}
        </h1>

        <p className={cn(styles.metaRow, "mt-2")}>
          <span>{authorCallsign(thread.author)}</span>
          <span>Score {thread.score}</span>
          <span>{comments.length} repl{comments.length !== 1 ? "ies" : "y"}</span>
          <span>{thread.createdAt.toLocaleDateString()}</span>
        </p>

        <div
          className={cn(styles.threadBody, "mt-4")}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <ForumReactionButtons
          targetType="thread"
          targetId={thread.id}
          reactions={thread.reactions}
          currentUserId={currentUserId}
        />
      </TerminalPanel>

      <TerminalPanel title="forums.replies">
        <ForumCommentList comments={comments} currentUserId={currentUserId} />
      </TerminalPanel>

      {canReply && !locked && (
        <TerminalPanel title="forums.reply">
          <ForumCommentForm threadId={thread.id} />
        </TerminalPanel>
      )}

      {locked && (
        <p className="font-mono text-xs text-muted-foreground">
          This thread is locked. New replies are disabled.
        </p>
      )}
    </div>
  );
}
