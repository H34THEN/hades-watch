"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  reviewAvatarForgeAccessAction,
  setAvatarForgeUnlockCodeAction,
} from "@/lib/actions/avatar-forge-access";

export interface AdminForgeRequestRow {
  id: string;
  status: string;
  requestedAt: Date;
  reviewNote: string | null;
  unlockedAt: Date | null;
  codeExpiresAt: Date | null;
  user: {
    email: string;
    name: string | null;
    character: { callsign: string } | null;
  };
}

interface AdminAvatarForgeAccessPanelProps {
  requests: AdminForgeRequestRow[];
  isOwner: boolean;
}

export function AdminAvatarForgeAccessPanel({ requests, isOwner }: AdminAvatarForgeAccessPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOwner) {
    return (
      <SystemAlert
        title="Owner Only"
        message="Approve, reject, revoke, and unlock-code operations require Owner clearance."
        variant="warning"
      />
    );
  }

  if (requests.length === 0) {
    return <p className="font-mono text-xs text-muted-foreground">No Avatar Forge access requests.</p>;
  }

  return (
    <div className="space-y-4">
      {generatedCode && (
        <SystemAlert
          title="Unlock Code Generated"
          message={`Copy this code now — it will not be shown again: ${generatedCode}`}
          variant="success"
        />
      )}
      {error && <SystemAlert title="Error" message={error} variant="error" />}

      {requests.map((r) => (
        <div key={r.id} className="space-y-2 border border-border/40 p-3 font-mono text-xs">
          <div className="flex flex-wrap justify-between gap-2">
            <span>
              {r.user.email}
              {r.user.character && ` (${r.user.character.callsign})`}
            </span>
            <span className="text-primary">{r.status}</span>
          </div>
          <p className="text-muted-foreground">Requested: {new Date(r.requestedAt).toLocaleString()}</p>
          {r.unlockedAt && (
            <p className="text-muted-foreground">Unlocked: {new Date(r.unlockedAt).toLocaleString()}</p>
          )}
          {r.codeExpiresAt && (
            <p className="text-muted-foreground">Code expires: {new Date(r.codeExpiresAt).toLocaleString()}</p>
          )}
          {r.reviewNote && <p className="text-muted-foreground">Note: {r.reviewNote}</p>}

          <Input
            value={notes[r.id] ?? ""}
            onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
            placeholder="Review note (optional)"
            className="text-xs"
          />

          <div className="flex flex-wrap gap-2">
            {r.status === "PENDING" && (
              <>
                <CommandButton
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      setError(null);
                      setGeneratedCode(null);
                      const result = await reviewAvatarForgeAccessAction(r.id, "approve", notes[r.id]);
                      if (!result.success) setError(result.error);
                      else router.refresh();
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
                      setError(null);
                      const result = await reviewAvatarForgeAccessAction(r.id, "reject", notes[r.id]);
                      if (!result.success) setError(result.error);
                      else router.refresh();
                    })
                  }
                >
                  Reject
                </CommandButton>
              </>
            )}
            {r.status === "APPROVED" && (
              <>
                <CommandButton
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      setError(null);
                      setGeneratedCode(null);
                      const result = await setAvatarForgeUnlockCodeAction(r.id);
                      if (!result.success) setError(result.error);
                      else {
                        setGeneratedCode(result.plaintextCode ?? null);
                        router.refresh();
                      }
                    })
                  }
                >
                  Generate Unlock Code
                </CommandButton>
                <CommandButton
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      setError(null);
                      const result = await reviewAvatarForgeAccessAction(r.id, "revoke", notes[r.id]);
                      if (!result.success) setError(result.error);
                      else router.refresh();
                    })
                  }
                >
                  Revoke
                </CommandButton>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
