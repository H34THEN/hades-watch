import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PublicWorksSubmitForm } from "@/components/mmo/PublicWorksSubmitForm";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPublicWorksTaskBySlug } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function PublicWorksTaskPage({
  params,
}: {
  params: Promise<{ taskSlug: string }>;
}) {
  await requireAuth();
  const { taskSlug } = await params;
  const task = await getPublicWorksTaskBySlug(taskSlug);
  if (!task) notFound();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <Link href="/community/public-works" className="mb-4 inline-block font-mono text-xs text-primary hover:underline">
        ← Public Works Board
      </Link>
      <h1 className={styles.heroTitle}>{task.title}</h1>

      <TerminalPanel title={`pw.${task.slug}`}>
        <div className={styles.metaRow}>
          <span className={styles.tag}>{task.taskType.replace(/_/g, " ")}</span>
          <span className={styles.tag}>{task.difficulty}</span>
          {task.estimatedTime && <span className={styles.tag}>{task.estimatedTime}</span>}
          <span className={styles.tag}>{task.ownerRole}</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed">{task.description}</p>
        {task.acceptanceCriteria && (
          <>
            <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Acceptance Criteria
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{task.acceptanceCriteria}</p>
          </>
        )}
        {task.rewardSummary && (
          <>
            <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Reward
            </h3>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{task.rewardSummary}</p>
          </>
        )}
        {task.assetNeedPath && (
          <p className="mt-4 font-mono text-[10px] text-muted-foreground">
            Asset need: {task.assetNeedPath}
          </p>
        )}
        <PublicWorksSubmitForm taskSlug={task.slug} />
        {task.safetyNote && <p className={styles.safetyNote}>{task.safetyNote}</p>}
      </TerminalPanel>
    </PageShell>
  );
}
