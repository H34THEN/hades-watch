import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { COMMUNITY_SUBMISSION_TYPE_LABELS } from "@/lib/community/constants";
import type {
  CommunitySubmission,
  CommunitySubmissionStatus,
} from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<CommunitySubmissionStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  NEEDS_REVISION: "Needs Revision",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
  IMPLEMENTED: "Implemented",
};

function statusClass(status: CommunitySubmissionStatus): string {
  switch (status) {
    case "PENDING":
      return styles.statusPending;
    case "ACCEPTED":
    case "IMPLEMENTED":
      return styles.statusAccepted;
    case "NEEDS_REVISION":
      return styles.statusRevision;
    case "REJECTED":
      return styles.statusRejected;
    default:
      return styles.statusNeutral;
  }
}

interface CommunitySubmissionListProps {
  submissions: CommunitySubmission[];
}

export function CommunitySubmissionList({ submissions }: CommunitySubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <TerminalPanel title="builder.submissions">
        <p className="font-mono text-sm text-muted-foreground">
          No community signals queued. Plant the first one.
        </p>
      </TerminalPanel>
    );
  }

  return (
    <TerminalPanel title="builder.submissions">
      <ul className="space-y-3">
        {submissions.map((submission) => (
          <li
            key={submission.id}
            className="rounded-lg border border-border/60 bg-card/40 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs tracking-wider text-primary uppercase">
                  {COMMUNITY_SUBMISSION_TYPE_LABELS[submission.type]}
                </p>
                <h3 className="mt-1 font-mono text-sm text-foreground">{submission.title}</h3>
              </div>
              <span
                className={cn(styles.statusChip, statusClass(submission.status))}
              >
                {STATUS_LABELS[submission.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{submission.summary}</p>
            <p className={cn(styles.metaRow, "mt-2")}>
              Filed {submission.createdAt.toLocaleDateString()}
            </p>
            {submission.reviewNote && (
              <p className="mt-2 border-l-2 border-primary/30 pl-2 font-mono text-xs text-muted-foreground">
                Review: {submission.reviewNote}
              </p>
            )}
          </li>
        ))}
      </ul>
    </TerminalPanel>
  );
}
