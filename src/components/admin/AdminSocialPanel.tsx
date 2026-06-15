"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { reviewNetNeighborAction } from "@/lib/actions/net-neighbors";
import { disableProfileCustomizationAction } from "@/lib/actions/profile-customization";

interface PendingNeighbor {
  id: string;
  title: string;
  url: string;
  description: string | null;
  tags: string[];
  submitterNote: string | null;
  bannerPath: string | null;
  submittedBy: { id: string; name: string | null; email: string } | null;
}

interface AdminSocialPanelProps {
  pendingNeighbors: PendingNeighbor[];
}

export function AdminSocialPanel({ pendingNeighbors }: AdminSocialPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function review(id: string, status: "APPROVED" | "REJECTED" | "HIDDEN") {
    setError(null);
    startTransition(async () => {
      const result = await reviewNetNeighborAction(id, status);
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  function disableCustomization(userId: string) {
    setError(null);
    startTransition(async () => {
      const result = await disableProfileCustomizationAction(userId);
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {error && <SystemAlert title="Action Failed" message={error} variant="error" />}

      <div className="space-y-4">
        <h2 className="font-mono text-sm tracking-wider uppercase">Pending Net Neighbors</h2>
        {pendingNeighbors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending banner submissions.</p>
        ) : (
          pendingNeighbors.map((n) => (
            <div key={n.id} className="border border-border/50 p-4">
              <div className="mb-2">
                <p className="font-mono text-primary">{n.title}</p>
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  {n.url}
                </a>
              </div>
              {n.description && <p className="text-xs text-muted-foreground">{n.description}</p>}
              {n.submitterNote && (
                <p className="mt-1 text-xs italic text-muted-foreground">“{n.submitterNote}”</p>
              )}
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                by {n.submittedBy?.name ?? n.submittedBy?.email ?? "unknown"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <CommandButton size="sm" disabled={isPending} onClick={() => review(n.id, "APPROVED")}>
                  Approve
                </CommandButton>
                <CommandButton size="sm" variant="outline" disabled={isPending} onClick={() => review(n.id, "REJECTED")}>
                  Reject
                </CommandButton>
                <CommandButton size="sm" variant="outline" disabled={isPending} onClick={() => review(n.id, "HIDDEN")}>
                  Hide
                </CommandButton>
                {n.submittedBy && (
                  <CommandButton
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => disableCustomization(n.submittedBy!.id)}
                  >
                    Disable Submitter Relic Zone
                  </CommandButton>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
