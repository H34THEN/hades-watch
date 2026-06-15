"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  approveComponentBadgeAction,
  approveMissionSubmissionAction,
  rejectMissionSubmissionAction,
} from "@/lib/actions/missions";

interface MissionSubmissionReviewPanelProps {
  submissions: {
    id: string;
    submittedAt: Date;
    safetyAffirmation: boolean;
    proofPacket: unknown;
    user: {
      email: string;
      name: string | null;
      character: { callsign: string } | null;
    };
    quest: {
      slug: string;
      title: string;
      requiredBadgeSlugs: unknown;
      completionBadgeSlug: string | null;
      faction: { name: string } | null;
    };
  }[];
}

export function MissionSubmissionReviewPanel({
  submissions,
}: MissionSubmissionReviewPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  if (submissions.length === 0) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        No pending mission field records.
      </p>
    );
  }

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setError(result.error ?? "Review failed");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {error && <SystemAlert title="Review error" message={error} variant="error" />}
      {submissions.map((submission) => {
        const requiredSlugs = Array.isArray(submission.quest.requiredBadgeSlugs)
          ? submission.quest.requiredBadgeSlugs.filter((s): s is string => typeof s === "string")
          : [];
        const codename =
          submission.user.character?.callsign ??
          submission.user.name ??
          submission.user.email;

        return (
          <div
            key={submission.id}
            className="space-y-3 rounded border border-border/40 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-sm font-semibold text-primary">
                  {submission.quest.title}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {codename} · {submission.submittedAt.toLocaleString()}
                  {submission.quest.faction && ` · Supports ${submission.quest.faction.name}`}
                </p>
              </div>
              <span className="font-mono text-[10px] text-amber-400/90 uppercase">Pending</span>
            </div>

            <div className="rounded border border-border/30 bg-background/40 p-3">
              <p className="mb-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                Private Proof Packet (reviewers only)
              </p>
              <ProofPacketDisplay packet={submission.proofPacket} />
            </div>

            <div className="flex flex-wrap gap-2">
              {requiredSlugs.map((slug) => (
                <CommandButton
                  key={slug}
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() =>
                    run(() => approveComponentBadgeAction(submission.id, slug))
                  }
                >
                  Verify {slug}
                </CommandButton>
              ))}
            </div>

            <textarea
              rows={2}
              placeholder="Review note (required for rejection)"
              value={notes[submission.id] ?? ""}
              onChange={(e) =>
                setNotes((prev) => ({ ...prev, [submission.id]: e.target.value }))
              }
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs"
            />

            <div className="flex flex-wrap gap-2">
              <CommandButton
                size="sm"
                disabled={isPending}
                onClick={() =>
                  run(() =>
                    approveMissionSubmissionAction(
                      submission.id,
                      requiredSlugs,
                      notes[submission.id],
                    ),
                  )
                }
              >
                Approve Field Record
              </CommandButton>
              <CommandButton
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  run(() =>
                    rejectMissionSubmissionAction(
                      submission.id,
                      notes[submission.id] ?? "Submission rejected.",
                    ),
                  )
                }
              >
                Reject
              </CommandButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProofPacketDisplay({ packet }: { packet: unknown }) {
  if (!packet || typeof packet !== "object" || Array.isArray(packet)) {
    return <p className="font-mono text-xs text-muted-foreground">Empty packet.</p>;
  }

  const entries = Object.entries(packet as Record<string, unknown>);
  return (
    <dl className="space-y-2 font-mono text-xs">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt className="text-[10px] tracking-wider text-primary/80 uppercase">
            {key.replace(/_/g, " ")}
          </dt>
          <dd className="mt-0.5 whitespace-pre-wrap text-foreground/80">
            {typeof value === "boolean" ? (value ? "Confirmed" : "No") : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
