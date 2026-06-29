import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPublicWorksTasks } from "@/lib/queries/expanded-play";
import { getSessionUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Public Works Board // Build the Commons",
  description: "Small tasks that help repair, document, decorate, test, and improve Hades Watch.",
};

const TASK_TYPES = [
  "all",
  "bug",
  "accessibility",
  "documentation",
  "avatar_asset_need",
  "badge_asset_need",
  "lore_prompt",
  "forum_category",
  "ghost_in_tech_summary",
  "net_neighbor_button",
  "profile_theme",
  "mobile_qa",
  "safety_copy",
  "seed_data",
  "event_idea",
  "guild_support",
] as const;

export default async function PublicWorksPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireAuth();
  const user = await getSessionUser();
  const { type } = await searchParams;
  const filterType = type && type !== "all" ? type : undefined;
  const tasks = await getPublicWorksTasks({ taskType: filterType, userId: user?.id });

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>PUBLIC WORKS BOARD // BUILD THE COMMONS</h1>
      <p className={styles.heroSubtitle}>
        Small tasks that help repair, document, decorate, test, and improve Hades Watch.
      </p>
      <Link href="/community" className="mb-4 inline-block font-mono text-xs text-primary hover:underline">
        ← Community
      </Link>

      <nav className={styles.filterRow} aria-label="Filter by task type">
        {TASK_TYPES.map((t) => (
          <Link
            key={t}
            href={t === "all" ? "/community/public-works" : `/community/public-works?type=${t}`}
            className={cn(styles.filterLink, (filterType ?? "all") === t && styles.filterActive)}
          >
            {t.replace(/_/g, " ")}
          </Link>
        ))}
      </nav>

      <div className={styles.grid}>
        {tasks.map((task) => (
          <Link key={task.id} href={`/community/public-works/${task.slug}`} className={styles.cardLink}>
            <TerminalPanel title={`pw.${task.slug}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{task.title}</h2>
                {task.userPending && <span className={styles.tag}>Review Pending</span>}
              </div>
              <div className={styles.metaRow}>
                <span className={styles.tag}>{task.taskType.replace(/_/g, " ")}</span>
                <span className={styles.tag}>{task.difficulty}</span>
                {task.estimatedTime && <span className={styles.tag}>{task.estimatedTime}</span>}
                {task.reviewRequired && <span className={styles.tag}>Review needed</span>}
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
              {task.rewardSummary && (
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">{task.rewardSummary}</p>
              )}
            </TerminalPanel>
          </Link>
        ))}
      </div>

      <p className={styles.safetyNote}>
        Security issues: use private admin-safe channels. No credentials, secrets, or exploit details
        in public submissions.
      </p>
    </PageShell>
  );
}
