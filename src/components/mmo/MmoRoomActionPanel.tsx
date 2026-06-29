"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { performRoomActionAction } from "@/lib/actions/text-mmo";
import styles from "@/components/mmo/text-mmo.module.css";

interface RoomAction {
  slug: string;
  label: string;
  description: string | null;
  actionType: string;
  targetRoute: string | null;
}

interface MmoRoomActionPanelProps {
  roomSlug: string;
  actions: RoomAction[];
}

export function MmoRoomActionPanel({ roomSlug, actions }: MmoRoomActionPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAction(actionSlug: string) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await performRoomActionAction(roomSlug, actionSlug);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(result.message ?? "Action recorded.");
      router.refresh();
    });
  }

  return (
    <div className={styles.actionList}>
      {actions.map((action) => {
        if (action.targetRoute) {
          return (
            <div key={action.slug} className="rounded border border-border/40 p-3">
              <p className="font-mono text-xs font-semibold uppercase text-primary">{action.label}</p>
              {action.description && (
                <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
              )}
              <Link href={action.targetRoute} className="mt-3 inline-block">
                <CommandButton size="sm">{action.label}</CommandButton>
              </Link>
            </div>
          );
        }

        if (action.actionType === "READ_SIGNAL" || action.actionType === "OFFER_HELP") {
          return (
            <div key={action.slug} className="rounded border border-border/40 p-3">
              <p className="font-mono text-xs font-semibold uppercase text-primary">{action.label}</p>
              {action.description && (
                <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
              )}
              <CommandButton
                size="sm"
                className="mt-3"
                disabled={isPending}
                onClick={() => runAction(action.slug)}
              >
                {action.label}
              </CommandButton>
            </div>
          );
        }

        return (
          <div key={action.slug} className="rounded border border-border/40 p-3 opacity-70">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              {action.label}
            </p>
            {action.description && (
              <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
            )}
            <p className="mt-2 font-mono text-[10px] text-amber-500/80">Use linked terminal for this action.</p>
          </div>
        );
      })}
      {error && <SystemAlert title="Action blocked" message={error} variant="error" />}
      {success && <SystemAlert title="Signal logged" message={success} variant="success" />}
    </div>
  );
}
