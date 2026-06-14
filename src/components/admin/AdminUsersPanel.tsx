"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { CommandButton } from "@/components/terminal/CommandButton";
import { disableUserAction, enableUserAction } from "@/lib/actions/phase4";

interface AdminUsersPanelProps {
  users: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: Date | null;
    createdAt: Date;
    disabled: boolean;
    banned: boolean;
    character: { callsign: string; faction: { name: string } | null } | null;
    userRoles: { roleId: string; role: { name: import("@/generated/prisma/client").RoleName } }[];
    _count: { notesAbout: number };
  }[];
}

export function AdminUsersPanel({ users }: AdminUsersPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2 font-mono text-xs">
      {users.map((u) => (
        <div key={u.id} className="border-b border-border/30 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-primary">{u.email}</span>
              {u.name && <span className="ml-2 text-muted-foreground">{u.name}</span>}
              {u.banned && <span className="ml-2 text-destructive">BANNED</span>}
              {u.disabled && <span className="ml-2 text-destructive">DISABLED</span>}
            </div>
            <div className="flex items-center gap-2">
              {u.userRoles.map((ur) => (
                <RoleBadge key={ur.roleId} role={ur.role.name} />
              ))}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-muted-foreground">
            <span>Joined {u.createdAt.toLocaleDateString()}</span>
            <span>{u.emailVerified ? "✓ Verified" : "⚠ Unverified"}</span>
            {u.character && (
              <span>
                {u.character.callsign}
                {u.character.faction && ` · ${u.character.faction.name}`}
              </span>
            )}
            {u._count.notesAbout > 0 && <span>{u._count.notesAbout} mod notes</span>}
          </div>
          <div className="mt-2 flex gap-2">
            {u.disabled ? (
              <CommandButton
                size="sm"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await enableUserAction(u.id);
                    router.refresh();
                  })
                }
              >
                Enable
              </CommandButton>
            ) : (
              <CommandButton
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await disableUserAction(u.id);
                    router.refresh();
                  })
                }
              >
                Disable
              </CommandButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
