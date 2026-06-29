"use client";

import { useState } from "react";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { ForumCommentForm } from "@/components/community/ForumCommentForm";
import { ForumReactionButtons } from "@/components/community/ForumReactionButtons";
import {
  ForumAuthorCard,
  ForumSignatureBlock,
  type ForumAuthorView,
} from "@/components/forums/ForumAuthorCard";
import { ForumPostActions } from "@/components/forums/ForumPostActions";
import { ForumQuoteBlock } from "@/components/forums/ForumQuoteBlock";
import styles from "@/components/community/community.module.css";
import { formatCommunityBody } from "@/lib/community/sanitize";
import { resolveForumCallsign, type ForumCallsignAuthor } from "@/lib/forums/callsign";
import { cn } from "@/lib/utils";

export interface ForumCommentRow {
  id: string;
  body: string;
  score: number;
  createdAt: Date;
  quotedCommentId?: string | null;
  quotedAuthorId?: string | null;
  quoteExcerpt?: string | null;
  author: ForumAuthorView;
  quotedAuthor?: ForumCallsignAuthor & { id: string } | null;
  reactions: { reactionType: string; userId: string }[];
}

interface ForumThreadInteractionProps {
  threadId: string;
  threadSlug: string;
  threadAuthorId: string;
  comments: ForumCommentRow[];
  currentUserId?: string | null;
  canReply?: boolean;
  hideSignatures?: boolean;
}

export function ForumThreadInteraction({
  threadId,
  threadSlug,
  threadAuthorId,
  comments,
  currentUserId,
  canReply = true,
  hideSignatures = false,
}: ForumThreadInteractionProps) {
  const [quote, setQuote] = useState<{
    commentId: string;
    excerpt: string;
    authorCallsign: string;
  } | null>(null);

  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">
          No replies yet. Be the first signal in the thread.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const signatureMode =
              hideSignatures || comment.author.forumProfile?.signatureMode === "HIDDEN"
                ? "HIDDEN"
                : ((comment.author.forumProfile?.signatureMode as "COMPACT" | "FULL") ??
                  "COMPACT");

            return (
              <li
                key={comment.id}
                id={`comment-${comment.id}`}
                className="rounded-lg border border-border/50 bg-card/30 p-4 scroll-mt-24"
              >
                <ForumAuthorCard
                  author={comment.author}
                  createdAt={comment.createdAt}
                  isOp={comment.author.id === threadAuthorId}
                />

                {comment.quotedCommentId && (
                  <div className="mt-3">
                    <ForumQuoteBlock
                      quotedAuthor={comment.quotedAuthor ?? undefined}
                      quoteExcerpt={comment.quoteExcerpt ?? null}
                      quotedCommentId={comment.quotedCommentId}
                      removed={!comment.quoteExcerpt}
                    />
                  </div>
                )}

                <div
                  className={cn("mt-3 text-sm text-foreground/90", styles.threadBody)}
                  dangerouslySetInnerHTML={{ __html: formatCommunityBody(comment.body) }}
                />

                <ForumReactionButtons
                  targetType="comment"
                  targetId={comment.id}
                  reactions={comment.reactions}
                  currentUserId={currentUserId}
                />

                {canReply && (
                  <ForumPostActions
                    commentId={comment.id}
                    threadSlug={threadSlug}
                    onQuote={() =>
                      setQuote({
                        commentId: comment.id,
                        excerpt: comment.body.slice(0, 300),
                        authorCallsign: resolveForumCallsign(comment.author),
                      })
                    }
                  />
                )}

                {!hideSignatures && (
                  <ForumSignatureBlock author={comment.author} mode={signatureMode} />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {canReply && (
        <TerminalPanel title="forums.reply">
          <ForumCommentForm
            threadId={threadId}
            quote={quote}
            onClearQuote={() => setQuote(null)}
          />
        </TerminalPanel>
      )}
    </div>
  );
}
