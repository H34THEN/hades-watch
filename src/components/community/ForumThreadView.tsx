import Link from "next/link";
import { ForumReactionButtons } from "@/components/community/ForumReactionButtons";
import { ForumThreadInteraction } from "@/components/forums/ForumThreadInteraction";
import {
  ForumAuthorCard,
  ForumSignatureBlock,
  type ForumAuthorView,
} from "@/components/forums/ForumAuthorCard";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

type ThreadAuthor = ForumAuthorView;

interface ForumThreadViewProps {
  thread: {
    id: string;
    slug: string;
    title: string;
    flair?: string | null;
    pinned: boolean;
    solved?: boolean;
    score: number;
    status: string;
    createdAt: Date;
    authorId: string;
    author: ThreadAuthor;
    category: { slug: string; name: string };
    reactions: { reactionType: string; userId: string }[];
  };
  bodyHtml: string;
  comments: Parameters<typeof ForumThreadInteraction>[0]["comments"];
  currentUserId?: string | null;
  canReply?: boolean;
  hideSignatures?: boolean;
}

export function ForumThreadView({
  thread,
  bodyHtml,
  comments,
  currentUserId,
  canReply = true,
  hideSignatures = false,
}: ForumThreadViewProps) {
  const locked = thread.status === "LOCKED";
  const threadSignatureMode =
    hideSignatures || thread.author.forumProfile?.signatureMode === "HIDDEN"
      ? "HIDDEN"
      : ((thread.author.forumProfile?.signatureMode as "COMPACT" | "FULL") ?? "COMPACT");

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
          {thread.solved && <span className={styles.statusChip}>Solved</span>}
          {thread.flair && <span className={styles.statusChip}>{thread.flair}</span>}
          {locked && (
            <span className={cn(styles.statusChip, styles.statusNeutral)}>Locked</span>
          )}
        </div>

        <h1 className="font-mono text-lg tracking-wide text-foreground uppercase">
          {thread.title}
        </h1>

        <div className="mt-4">
          <ForumAuthorCard author={thread.author} createdAt={thread.createdAt} isOp />
        </div>

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

        {!hideSignatures && (
          <ForumSignatureBlock author={thread.author} mode={threadSignatureMode} />
        )}
      </TerminalPanel>

      <TerminalPanel title="forums.replies">
        <ForumThreadInteraction
          threadId={thread.id}
          threadSlug={thread.slug}
          threadAuthorId={thread.authorId}
          comments={comments}
          currentUserId={currentUserId}
          canReply={canReply && !locked}
          hideSignatures={hideSignatures}
        />
      </TerminalPanel>

      {locked && (
        <p className="font-mono text-xs text-muted-foreground">
          This thread is locked. New replies are disabled.
        </p>
      )}
    </div>
  );
}
