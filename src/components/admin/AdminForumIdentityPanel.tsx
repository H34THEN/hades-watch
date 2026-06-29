"use client";

import { useTransition } from "react";
import { moderateForumIdentityAction } from "@/lib/actions/forum-identity";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

type Queue = Awaited<
  ReturnType<typeof import("@/lib/queries/forum-identity").getForumIdentityModerationQueue>
>;

interface AdminForumIdentityPanelProps {
  queue: Queue;
  showAssetsOnly?: boolean;
}

export function AdminForumIdentityPanel({
  queue,
  showAssetsOnly = false,
}: AdminForumIdentityPanelProps) {
  const [pending, startTransition] = useTransition();

  function moderate(
    targetType: "profile" | "asset",
    targetId: string,
    status: "APPROVED" | "HIDDEN" | "REJECTED",
  ) {
    startTransition(async () => {
      await moderateForumIdentityAction(targetType, targetId, status);
    });
  }

  return (
    <div className="space-y-6">
      {!showAssetsOnly && (
        <TerminalPanel title="forum.profiles">
          {queue.profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No forum profiles flagged.</p>
          ) : (
            <ul className="space-y-3">
              {queue.profiles.map((profile) => (
                <li key={profile.id} className="rounded border border-border/50 p-3 text-sm">
                  <p className="font-mono uppercase text-primary">
                    {profile.user.character?.callsign ?? profile.user.email}
                  </p>
                  <p className="text-muted-foreground">Status: {profile.moderationStatus}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <CommandButton
                      size="sm"
                      disabled={pending}
                      onClick={() => moderate("profile", profile.id, "APPROVED")}
                    >
                      Approve
                    </CommandButton>
                    <CommandButton
                      size="sm"
                      variant="secondary"
                      disabled={pending}
                      onClick={() => moderate("profile", profile.id, "HIDDEN")}
                    >
                      Hide
                    </CommandButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TerminalPanel>
      )}

      <TerminalPanel title="forum.signatures">
        {queue.assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No signature assets flagged.</p>
        ) : (
          <ul className="space-y-3">
            {queue.assets.map((asset) => (
              <li key={asset.id} className="rounded border border-border/50 p-3 text-sm">
                <p className="font-mono uppercase text-primary">
                  {asset.user.character?.callsign ?? asset.user.email}
                </p>
                <p className="text-muted-foreground">
                  {asset.assetType} · {asset.sizePreset} · {asset.moderationStatus}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <CommandButton
                    size="sm"
                    disabled={pending}
                    onClick={() => moderate("asset", asset.id, "APPROVED")}
                  >
                    Approve
                  </CommandButton>
                  <CommandButton
                    size="sm"
                    variant="secondary"
                    disabled={pending}
                    onClick={() => moderate("asset", asset.id, "HIDDEN")}
                  >
                    Hide
                  </CommandButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </TerminalPanel>
    </div>
  );
}
