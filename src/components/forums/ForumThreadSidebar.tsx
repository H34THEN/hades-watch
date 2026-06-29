import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";

interface ForumThreadSidebarProps {
  thread: {
    slug: string;
    title: string;
    score: number;
    commentCount: number;
    pinned: boolean;
    solved?: boolean;
    flair?: string | null;
    status: string;
    createdAt: Date;
    category: { slug: string; name: string };
  };
  replyCount: number;
}

export function ForumThreadSidebar({ thread, replyCount }: ForumThreadSidebarProps) {
  return (
    <aside className="space-y-4 min-w-0">
      <TerminalPanel title="thread.stats">
        <dl className="space-y-2 font-mono text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Score</dt>
            <dd>{thread.score}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Replies</dt>
            <dd>{replyCount}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Status</dt>
            <dd>{thread.status}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Opened</dt>
            <dd>{thread.createdAt.toLocaleDateString()}</dd>
          </div>
        </dl>
      </TerminalPanel>

      <TerminalPanel title="thread.relay">
        <p className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">
          Category
        </p>
        <Link
          href={`/community/forums/${thread.category.slug}`}
          className="font-mono text-sm text-primary hover:underline"
        >
          {thread.category.name}
        </Link>
        <p className="mt-4 mb-2 font-mono text-[10px] uppercase text-muted-foreground">
          Related
        </p>
        <ul className="space-y-1 font-mono text-xs">
          <li>
            <Link href="/community/forums" className="text-primary hover:underline">
              All forums
            </Link>
          </li>
          <li>
            <Link href="/mmo" className="text-primary hover:underline">
              MMO Hub
            </Link>
          </li>
          <li>
            <Link href="/community/guilds" className="text-primary hover:underline">
              Guild cells
            </Link>
          </li>
        </ul>
      </TerminalPanel>

      <div className={styles.safetyNotice}>
        <p className={styles.safetyTitle}>Relay safety</p>
        <p className={styles.safetyBody}>
          Report unsafe signatures or posts via moderation tools. No secrets or private data in
          threads.
        </p>
      </div>
    </aside>
  );
}
