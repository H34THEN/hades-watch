"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { approveFactionJoinAction, rejectFactionJoinAction } from "@/lib/actions/mmo";

interface AdminFactionRequestsPanelProps {
  requests: {
    id: string;
    createdAt: Date;
    user: { email: string; name: string | null; character: { callsign: string } | null };
    faction: { name: string; slug: string };
  }[];
}

export function AdminFactionRequestsPanel({ requests }: AdminFactionRequestsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (requests.length === 0) {
    return <p className="font-mono text-xs text-muted-foreground">No pending requests.</p>;
  }

  return (
    <div className="space-y-3 font-mono text-xs">
      {requests.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border/30 py-2">
          <span>
            {r.user.email}
            {r.user.character && ` (${r.user.character.callsign})`}
            {" → "}
            {r.faction.name}
          </span>
          <div className="flex gap-2">
            <CommandButton
              size="sm"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await approveFactionJoinAction(r.id);
                  router.refresh();
                })
              }
            >
              Approve
            </CommandButton>
            <CommandButton
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await rejectFactionJoinAction(r.id);
                  router.refresh();
                })
              }
            >
              Reject
            </CommandButton>
          </div>
        </div>
      ))}
    </div>
  );
}
