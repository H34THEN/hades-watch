import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { PlayPromptCompleteForm } from "@/components/mmo/PlayPromptCompleteForm";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptBySlug } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function FieldAssignmentDetailPage({
  params,
}: {
  params: Promise<{ assignmentSlug: string }>;
}) {
  await requireAuth();
  const { assignmentSlug } = await params;
  const assignment = await getPromptBySlug(assignmentSlug);
  if (!assignment || assignment.functionSlug !== "field-assignments") notFound();

  const needsSubmission =
    assignment.proofStyle !== "no proof/read-only" &&
    !["READ_SIGNAL", "VISIT_ARCHIVE", "ATTEMPT_CIPHER", "VISIT_PROFILE_WORLD", "OPEN_DEAD_DROP"].includes(
      assignment.actionType,
    );

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <Link href="/mmo/assignments" className="mb-4 inline-block font-mono text-xs text-primary hover:underline">
        ← Field Assignments
      </Link>
      <h1 className={styles.heroTitle}>{assignment.title}</h1>
      <MmoTextNav active="/mmo/assignments" />

      <TerminalPanel title={`assignment.${assignment.slug}`}>
        <div className={styles.metaRow}>
          {assignment.category && <span className={styles.tag}>{assignment.category}</span>}
          {assignment.factionSlug && <span className={styles.tag}>{assignment.factionSlug}</span>}
          {assignment.proofStyle && <span className={styles.tag}>{assignment.proofStyle}</span>}
        </div>
        <p className="mt-4 text-sm leading-relaxed">{assignment.prompt}</p>

        <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Objective
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{assignment.prompt}</p>

        {assignment.proofStyle && (
          <>
            <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Proof Instructions
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{assignment.proofStyle}</p>
          </>
        )}

        {assignment.rewardSummary && (
          <>
            <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Reward Preview
            </h3>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{assignment.rewardSummary}</p>
          </>
        )}

        {assignment.fieldLogTemplate && (
          <>
            <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Field Log Copy
            </h3>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{assignment.fieldLogTemplate}</p>
          </>
        )}

        {assignment.userPending && (
          <p className={styles.relayPending}>Your submission is pending steward review.</p>
        )}

        {assignment.userCompleted ? (
          <p className={`${styles.tag} ${styles.tagState} mt-4 inline-block`}>Completed</p>
        ) : needsSubmission ? (
          <PlayPromptCompleteForm
            prompt={assignment}
            showBody
            showUrl={assignment.proofStyle?.includes("URL") ?? false}
          />
        ) : (
          <PlayPromptCompleteForm prompt={assignment} ctaLabel="Mark Complete" />
        )}

        {assignment.safetyNote && <p className={styles.safetyNote}>{assignment.safetyNote}</p>}
      </TerminalPanel>
    </PageShell>
  );
}
