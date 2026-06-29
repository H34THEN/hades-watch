import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

type ThreadAuthor = {
  character?: { callsign: string | null } | null;
  name: string | null;
  email: string;
};

interface ForumThreadRow {
  id: string;
  slug: string;
  title: string;
  pinned: boolean;
  score: number;
  status: string;
  commentCount: number;
  lastActivityAt: Date;
  createdAt: Date;
  author: ThreadAuthor;
  category: { slug: string; name: string };
  _count?: { comments: number };
}

interface ForumThreadListProps {
  threads: ForumThreadRow[];
}

function authorCallsign(author: ThreadAuthor): string {
  return (
    author.character?.callsign ??
    author.name ??
    author.email.split("@")[0] ??
    "operative"
  );
}

export function ForumThreadList({ threads }: ForumThreadListProps) {
  const sorted = [...threads].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.lastActivityAt.getTime() - a.lastActivityAt.getTime();
  });

  if (sorted.length === 0) {
    return (
      <TerminalPanel title="forums.threads">
        <p className="font-mono text-sm text-muted-foreground">
          No threads in this channel. Start the first signal.
        </p>
      </TerminalPanel>
    );
  }

  return (
    <TerminalPanel title="forums.threads">
      <ul className="divide-y divide-border/40">
        {sorted.map((thread) => {
          const replies = thread._count?.comments ?? thread.commentCount;
          return (
            <li key={thread.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {thread.pinned && (
                      <span className={styles.pinnedBadge}>Pinned</span>
                    )}
                    {thread.status === "LOCKED" && (
                      <span className={cn(styles.statusChip, styles.statusNeutral)}>
                        Locked
                      </span>
                    )}
                    <Link
                      href={`/community/threads/${thread.slug}`}
                      className="font-mono text-sm text-foreground hover:text-primary"
                    >
                      {thread.title}
                    </Link>
                  </div>
                  <p className={cn(styles.metaRow, "mt-1")}>
                    <span>{authorCallsign(thread.author)}</span>
                    <span>Score {thread.score}</span>
                    <span>
                      {replies} repl{replies !== 1 ? "ies" : "y"}
                    </span>
                    <span>
                      Active {thread.lastActivityAt.toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </TerminalPanel>
  );
}
