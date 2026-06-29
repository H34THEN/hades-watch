import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { getSessionUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Field Assignments // Non-Combat Objectives",
  description:
    "Structured tasks for reading, writing, archiving, testing, documenting, and strengthening the Underwatch.",
};

function assignmentCta(completed: boolean, pending: boolean): string {
  if (pending) return "Review Pending";
  if (completed) return "Completed";
  return "Open Assignment";
}

export default async function FieldAssignmentsPage() {
  await requireAuth();
  const user = await getSessionUser();
  const assignments = await getPromptsByFunction("field-assignments", { userId: user?.id });

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>FIELD ASSIGNMENTS // NON-COMBAT OBJECTIVES</h1>
      <p className={styles.heroSubtitle}>
        Structured tasks for reading, writing, archiving, testing, documenting, and strengthening
        the Underwatch.
      </p>
      <MmoTextNav active="/mmo/play" />

      <div className="space-y-4">
        {assignments.map((a) => (
          <Link key={a.id} href={`/mmo/assignments/${a.slug}`}>
            <TerminalPanel title={`assignment.${a.slug}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{a.title}</h2>
                <span className={`${styles.tag} ${a.userCompleted ? styles.tagState : ""}`}>
                  {assignmentCta(a.userCompleted, a.userPending)}
                </span>
              </div>
              <div className={styles.metaRow}>
                {a.category && <span className={styles.tag}>{a.category}</span>}
                {a.factionSlug && <span className={styles.tag}>{a.factionSlug}</span>}
                {a.proofStyle && <span className={styles.tag}>{a.proofStyle}</span>}
                {a.reviewRequired && <span className={styles.tag}>Review required</span>}
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{a.prompt}</p>
              {a.rewardSummary && (
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">{a.rewardSummary}</p>
              )}
            </TerminalPanel>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
