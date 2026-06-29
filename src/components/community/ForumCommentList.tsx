import { ForumReactionButtons } from "@/components/community/ForumReactionButtons";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

type CommentAuthor = {
  id: string;
  character?: { callsign: string | null } | null;
  name: string | null;
  email: string;
};

export interface ForumCommentRow {
  id: string;
  body: string;
  score: number;
  createdAt: Date;
  author: CommentAuthor;
  reactions: { reactionType: string; userId: string }[];
}

interface ForumCommentListProps {
  comments: ForumCommentRow[];
  currentUserId?: string | null;
}

function authorCallsign(author: CommentAuthor): string {
  return (
    author.character?.callsign ??
    author.name ??
    author.email.split("@")[0] ??
    "operative"
  );
}

export function ForumCommentList({ comments, currentUserId }: ForumCommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">
        No replies yet. Be the first signal in the thread.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="rounded-lg border border-border/50 bg-card/30 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={styles.metaRow}>
              <span className="text-primary">{authorCallsign(comment.author)}</span>
              <span>Score {comment.score}</span>
              <span>{comment.createdAt.toLocaleDateString()}</span>
            </p>
          </div>
          <p className={cn("mt-2 whitespace-pre-wrap text-sm text-foreground/90")}>
            {comment.body}
          </p>
          <ForumReactionButtons
            targetType="comment"
            targetId={comment.id}
            reactions={comment.reactions}
            currentUserId={currentUserId}
          />
        </li>
      ))}
    </ul>
  );
}
