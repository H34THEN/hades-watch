"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { reviewMmoDeadDropSubmissionAction } from "@/lib/actions/text-mmo";
import { playerDisplayName } from "@/lib/mmo/text-mmo-validation";

interface SubmissionRow {
  id: string;
  body: string | null;
  url: string | null;
  summary: string | null;
  createdAt: Date;
  deadDrop: { title: string; slug: string; dropType: string };
  user: {
    name: string | null;
    email: string;
    character: { callsign: string } | null;
  };
}

export function AdminMmoSubmissionsPanel({ submissions }: { submissions: SubmissionRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function review(id: string, decision: "APPROVED" | "REJECTED" | "NEEDS_REVISION") {
    setError(null);
    startTransition(async () => {
      const result = await reviewMmoDeadDropSubmissionAction(id, decision);
      if (!result.success) {
        setError(result.error ?? "Review failed");
        return;
      }
      router.refresh();
    });
  }

  if (submissions.length === 0) {
    return <p className="font-mono text-sm text-muted-foreground">No pending MMO Dead Drop submissions.</p>;
  }

  return (
    <div className="space-y-6">
      {error && <SystemAlert title="Error" message={error} variant="error" />}
      {submissions.map((sub) => {
        const player = playerDisplayName(sub.user.character, sub.user);
        return (
          <div key={sub.id} className="border border-border/40 p-4">
            <p className="font-mono text-xs uppercase text-primary">{sub.deadDrop.title}</p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {player} · {sub.deadDrop.dropType.replace(/_/g, " ")} ·{" "}
              {new Date(sub.createdAt).toLocaleString()}
            </p>
            {sub.body && (
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{sub.body}</p>
            )}
            {sub.url && (
              <p className="mt-2 font-mono text-xs break-all">
                <a href={sub.url} target="_blank" rel="noopener noreferrer nofollow ugc">
                  {sub.url}
                </a>
              </p>
            )}
            {sub.summary && <p className="mt-2 text-sm">{sub.summary}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <CommandButton size="sm" disabled={isPending} onClick={() => review(sub.id, "APPROVED")}>
                Approve
              </CommandButton>
              <CommandButton
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => review(sub.id, "NEEDS_REVISION")}
              >
                Needs Revision
              </CommandButton>
              <CommandButton
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => review(sub.id, "REJECTED")}
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
