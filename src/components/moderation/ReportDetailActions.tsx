"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ModerationReportStatus } from "@/generated/prisma/client";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignReportAction,
  updateReportStatusAction,
} from "@/lib/actions/moderation";

interface ReportDetailActionsProps {
  reportId: string;
  currentStatus: ModerationReportStatus;
  assignedToId?: string | null;
  moderators: { id: string; email: string; name: string | null }[];
  targetUserId?: string | null;
}

const STATUSES: ModerationReportStatus[] = ["Open", "Reviewing", "Resolved", "Dismissed"];

export function ReportDetailActions({
  reportId,
  currentStatus,
  assignedToId,
  moderators,
  targetUserId,
}: ReportDetailActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">Assign Moderator</Label>
        <Select
          value={assignedToId ?? ""}
          onValueChange={(v) => {
            if (!v) return;
            startTransition(async () => {
              await assignReportAction(reportId, v);
              router.refresh();
            });
          }}
        >
          <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
          <SelectContent>
            {moderators.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name ?? m.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.filter((s) => s !== currentStatus).map((status) => (
          <CommandButton
            key={status}
            size="sm"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await updateReportStatusAction(reportId, status);
                router.refresh();
              })
            }
          >
            Mark {status}
          </CommandButton>
        ))}
      </div>

      {targetUserId && (
        <a href={`/moderation/notes/new?userId=${targetUserId}`}>
          <CommandButton size="sm" variant="outline">Add Note on User</CommandButton>
        </a>
      )}
    </div>
  );
}
