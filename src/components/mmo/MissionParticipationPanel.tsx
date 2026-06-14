"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  completeMissionAction,
  joinMissionAction,
  leaveMissionAction,
} from "@/lib/actions/mmo";
import type { MissionParticipationStatus } from "@/generated/prisma/client";

interface MissionParticipationPanelProps {
  questId: string;
  participation: {
    status: MissionParticipationStatus;
  } | null;
}

export function MissionParticipationPanel({
  questId,
  participation,
}: MissionParticipationPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setError(result.error ?? "Action failed");
        return;
      }
      router.refresh();
    });
  }

  const status = participation?.status;

  return (
    <div className="mt-6 space-y-3 border-t border-border/40 pt-6">
      <p className="font-mono text-xs uppercase text-muted-foreground">
        Participation {status ? `· ${status}` : "· Not joined"}
      </p>
      <div className="flex flex-wrap gap-2">
        {(!status || status === "Dropped" || status === "Completed") && (
          <CommandButton size="sm" disabled={isPending} onClick={() => run(() => joinMissionAction(questId))}>
            Join Mission
          </CommandButton>
        )}
        {status && ["Joined", "InProgress", "Interested"].includes(status) && (
          <>
            <CommandButton size="sm" variant="outline" disabled={isPending} onClick={() => run(() => leaveMissionAction(questId))}>
              Leave Mission
            </CommandButton>
            <CommandButton size="sm" disabled={isPending} onClick={() => run(() => completeMissionAction(questId))}>
              Mark Complete
            </CommandButton>
          </>
        )}
      </div>
      {error && <SystemAlert title="Error" message={error} variant="error" />}
    </div>
  );
}
