"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { InviteVerificationMethod, RoleName } from "@/generated/prisma/client";
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
import { VERIFICATION_METHOD_LABELS } from "@/lib/verification";

interface InviteRow {
  id: string;
  code: string;
  roleGranted: RoleName | null;
  maxUses: number;
  usesCount: number;
  revoked: boolean;
  isDevCode: boolean;
  expiresAt: Date | null;
  autoApproveOnRegister: boolean;
  verificationRequirement: {
    method: InviteVerificationMethod;
    expectedPreview: string | null;
    label: string | null;
    autoApproveOnMatch: boolean;
  } | null;
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

const METHODS = Object.entries(VERIFICATION_METHOD_LABELS) as [
  InviteVerificationMethod,
  string,
][];

export function AdminInvitePanel({ invites }: AdminInvitePanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [roleGranted, setRoleGranted] = useState<RoleName>("Member");
  const [verificationMethod, setVerificationMethod] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("roleGranted", roleGranted);
    if (verificationMethod) formData.set("verificationMethod", verificationMethod);

    startTransition(async () => {
      const result = await createInviteAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      (e.target as HTMLFormElement).reset();
      setVerificationMethod("");
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
          <Label className="font-mono text-xs uppercase">Email Restricted (optional)</Label>
          <Input name="emailRestricted" type="email" placeholder="Optional" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="font-mono text-xs uppercase">Verification Method (optional)</Label>
          <Select value={verificationMethod} onValueChange={(v) => setVerificationMethod(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="None — manual approval queue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {METHODS.map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Optional: bind this invite to a safety number, public key fingerprint, or
            out-of-band verification value. If the recipient enters the same value during
            registration, their account can be auto-approved.
          </p>
        </div>

        {verificationMethod && (
          <>
            <div className="space-y-2 sm:col-span-2">
              <Label className="font-mono text-xs uppercase">
                Expected Safety Number / Fingerprint
              </Label>
              <Input
                name="verificationValue"
                placeholder="Paste value from Signal, SimpleX, Matrix, etc."
                className="font-mono text-sm"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase">Custom Label (optional)</Label>
              <Input name="verificationLabel" placeholder="e.g. Signal with @archivist" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoApproveOnMatch"
                name="autoApproveOnMatch"
                defaultChecked
                className="rounded border-border"
              />
              <Label htmlFor="autoApproveOnMatch" className="text-xs">
                Auto-approve on match
              </Label>
            </div>
          </>
        )}

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="autoApproveOnRegister"
            name="autoApproveOnRegister"
            className="rounded border-border"
          />
          <Label htmlFor="autoApproveOnRegister" className="text-xs">
            Auto-approve on register without verification (bootstrap/trusted invites only)
          </Label>
        </div>

        <div className="sm:col-span-2">
          <CommandButton type="submit" disabled={isPending}>
            Create Invite Code
          </CommandButton>
        </div>
      </form>

      {error && <SystemAlert title="Admin Error" message={error} variant="error" />}

      <div className="overflow-x-auto font-mono text-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-2">Code</th>
              <th className="p-2">Role</th>
              <th className="p-2">Uses</th>
              <th className="p-2">Verification</th>
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
                <td className="p-2">
                  {inv.verificationRequirement
                    ? `${VERIFICATION_METHOD_LABELS[inv.verificationRequirement.method]}${inv.verificationRequirement.expectedPreview ? ` ·••${inv.verificationRequirement.expectedPreview}` : ""}`
                    : inv.autoApproveOnRegister
                      ? "auto-approve"
                      : "manual queue"}
                </td>
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
