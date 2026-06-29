"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { executeArchivistQuickAction } from "@/lib/actions/archivist-feed";
import type {
  ArchivistActionFeedItem,
  ArchivistFeedStats,
  ArchivistQuickActionType,
} from "@/lib/admin/archivist-action-feed";
import styles from "@/components/admin/archivist-feed.module.css";

interface ArchivistActionFeedClientProps {
  items: ArchivistActionFeedItem[];
  stats: ArchivistFeedStats;
}

export function ArchivistActionFeedClient({ items, stats }: ArchivistActionFeedClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [glitchingIds, setGlitchingIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      if (completedIds.has(item.id)) return false;
      if (filter === "all") return true;
      if (filter === "urgent") return item.priority === "urgent" || item.priority === "high";
      return item.category.toLowerCase().includes(filter);
    });
  }, [items, completedIds, filter]);

  function runAction(item: ArchivistActionFeedItem, action: ArchivistQuickActionType) {
    if (action === "open" && item.targetUrl) {
      router.push(item.targetUrl);
      return;
    }

    startTransition(async () => {
      const result = await executeArchivistQuickAction(item.sourceType, item.sourceId, action);
      if (!result.success) {
        setToast(result.error ?? "Action failed.");
        if (result.stale) router.refresh();
        return;
      }

      setGlitchingIds((prev) => new Set(prev).add(item.id));
      setToast(result.message ?? "Archivist action logged. The signal has been handled.");

      window.setTimeout(() => {
        setCompletedIds((prev) => new Set(prev).add(item.id));
        setGlitchingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
        router.refresh();
      }, 650);

      window.setTimeout(() => setToast(null), 3200);
    });
  }

  return (
    <div className={styles.archivistShell}>
      <div className={styles.statsRow}>
        <div className={styles.statChip}>
          <p className={styles.statLabel}>Pending</p>
          <p className={styles.statValue}>{stats.total}</p>
        </div>
        <div className={styles.statChip}>
          <p className={styles.statLabel}>Urgent</p>
          <p className={styles.statValue}>{stats.urgent}</p>
        </div>
        <div className={styles.statChip}>
          <p className={styles.statLabel}>Archive</p>
          <p className={styles.statValue}>{stats.archive}</p>
        </div>
        <div className={styles.statChip}>
          <p className={styles.statLabel}>Net Neighbors</p>
          <p className={styles.statValue}>{stats.netNeighbors}</p>
        </div>
        <div className={styles.statChip}>
          <p className={styles.statLabel}>Moderation</p>
          <p className={styles.statValue}>{stats.moderation}</p>
        </div>
        <div className={styles.statChip}>
          <p className={styles.statLabel}>Community</p>
          <p className={styles.statValue}>{stats.community}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "urgent", "archive", "moderation", "net", "community", "dead"].map((f) => (
          <CommandButton
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f}
          </CommandButton>
        ))}
      </div>

      <div className={styles.feedGrid}>
        <div className="min-w-0 space-y-4">
          {visibleItems.length === 0 ? (
            <TerminalPanel title="archivist.relay.empty">
              <p className="font-mono text-sm text-muted-foreground">No active relay signals in this filter.</p>
            </TerminalPanel>
          ) : (
            visibleItems.map((item) => (
              <article
                key={item.id}
                className={`${styles.actionCard} ${item.priority === "urgent" ? styles.actionCardUrgent : ""} ${glitchingIds.has(item.id) ? styles.actionCardGlitchAway : ""} ${completedIds.has(item.id) ? styles.actionCardCompleted : ""}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={styles.sourceChip}>{item.category}</span>
                  <span
                    className={`${styles.sourceChip} ${item.priority === "urgent" ? styles.priorityUrgent : item.priority === "high" ? styles.priorityHigh : ""}`}
                  >
                    {item.priority}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {item.createdAt.toLocaleString()}
                  </span>
                </div>
                <h3 className="mt-2 font-mono text-sm font-semibold uppercase text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                {item.actorName && (
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground">From: {item.actorName}</p>
                )}
                <div className={styles.actionButtons}>
                  {item.actions.map((a) => (
                    <CommandButton
                      key={a.action}
                      size="sm"
                      variant={a.dangerous ? "destructive" : a.action === "open" ? "outline" : "default"}
                      disabled={pending}
                      onClick={() => runAction(item, a.action)}
                    >
                      {a.label}
                    </CommandButton>
                  ))}
                  {item.targetUrl && (
                    <Link href={item.targetUrl}>
                      <CommandButton size="sm" variant="outline">
                        Source Page
                      </CommandButton>
                    </Link>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        <aside className={styles.sidePanel}>
          <TerminalPanel title="archivist.doctrine">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Process signals lawfully. Do not approve harassment, targeting, evasion advice, or unsafe
              real-world tactics. When in doubt, open the source review page.
            </p>
          </TerminalPanel>
          <TerminalPanel title="archivist.relay.links" className="mt-4">
            <ul className="space-y-1 font-mono text-xs">
              <li>
                <Link href="/admin/archive" className="text-primary hover:underline">
                  Archive moderation
                </Link>
              </li>
              <li>
                <Link href="/admin/net-neighbors" className="text-primary hover:underline">
                  Net Neighbors
                </Link>
              </li>
              <li>
                <Link href="/moderation" className="text-primary hover:underline">
                  Moderation console
                </Link>
              </li>
              <li>
                <Link href="/admin/mmo-submissions" className="text-primary hover:underline">
                  MMO submissions
                </Link>
              </li>
            </ul>
          </TerminalPanel>
        </aside>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
