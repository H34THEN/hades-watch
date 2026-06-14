"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { createInviteAction, revokeInviteAction } from "@/lib/actions/admin";
import type { RoleName } from "@/generated/prisma/client";

interface InviteRow {
  id: string;
  code: string;
  roleGranted: RoleName | null;
  maxUses: number;
  usesCount: number;
  revoked: boolean;
  isDevCode: boolean;
  expiresAt: Date | null;
}

interface AdminInvitePanelProps {
  invites: InviteRow[];
}

const ROLES: RoleName[] = [
  "Member",
  "Gamer",
  "Expert",
  "Moderator",
  "Admin",
  "Owner",
];

export function AdminInvitePanel({ invites }: AdminInvitePanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [roleGranted, setRoleGranted] = useState<RoleName>("Member");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("roleGranted", roleGranted);

    startTransition(async () => {
      const result = await createInviteAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      (e.target as HTMLFormElement).reset();
      router.refresh();
    });
  }

  function handleRevoke(id: string) {
    startTransition(async () => {
      const result = await revokeInviteAction(id);
      if (!result.success) setError(result.error);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Code</Label>
          <Input name="code" placeholder="CUSTOM-INVITE" className="font-mono uppercase" required />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Role Granted</Label>
          <Select value={roleGranted} onValueChange={(v) => v && setRoleGranted(v as RoleName)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Max Uses</Label>
          <Input name="maxUses" type="number" defaultValue="1" min="1" required />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Email Restricted</Label>
          <Input name="emailRestricted" type="email" placeholder="Optional" />
        </div>
        <div className="sm:col-span-2">
          <CommandButton type="submit" disabled={isPending}>
            Create Invite Code
          </CommandButton>
        </div>
      </form>

      {error && (
        <SystemAlert title="Admin Error" message={error} variant="error" />
      )}

      <div className="overflow-x-auto font-mono text-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-2">Code</th>
              <th className="p-2">Role</th>
              <th className="p-2">Uses</th>
              <th className="p-2">Status</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {invites.map((inv) => (
              <tr key={inv.id} className="border-b border-border/40">
                <td className="p-2">{inv.code}{inv.isDevCode ? " (dev)" : ""}</td>
                <td className="p-2">{inv.roleGranted ?? "Member"}</td>
                <td className="p-2">{inv.usesCount}/{inv.maxUses}</td>
                <td className="p-2">{inv.revoked ? "revoked" : "active"}</td>
                <td className="p-2">
                  {!inv.revoked && (
                    <button
                      type="button"
                      onClick={() => handleRevoke(inv.id)}
                      className="text-destructive hover:underline"
                      disabled={isPending}
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
