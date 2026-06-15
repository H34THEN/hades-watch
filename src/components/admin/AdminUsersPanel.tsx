"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  InviteVerificationMethod,
  InviteVerificationStatus,
  RoleName,
  UserAccountStatus,
} from "@/generated/prisma/client";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  approveUserAction,
  rejectUserAction,
} from "@/lib/actions/admin";
import {
  formatVerificationPreviewLabel,
  VERIFICATION_METHOD_LABELS,
} from "@/lib/verification";

interface AdminUsersPanelProps {
  users: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: Date | null;
    createdAt: Date;
    disabled: boolean;
    banned: boolean;
    accountStatus: UserAccountStatus;
    approvedAt: Date | null;
    approvalSource: string | null;
    character: { callsign: string; faction: { name: string } | null } | null;
    userRoles: { roleId: string; role: { name: RoleName } }[];
    verificationClaim: {
      status: InviteVerificationStatus;
      method: InviteVerificationMethod | null;
      submittedPreview: string | null;
      createdAt: Date;
    } | null;
    inviteRedemption: {
      invite: {
        code: string;
        verificationRequirement: {
          method: InviteVerificationMethod;
          expectedPreview: string | null;
        } | null;
      };
    } | null;
    _count: { notesAbout: number };
  }[];
}

function verificationStatusLabel(status: InviteVerificationStatus): string {
  switch (status) {
    case "MATCHED":
      return "Matched";
    case "MISMATCHED":
      return "Mismatched";
    case "MISSING":
      return "Missing";
    case "MANUAL_REVIEW":
      return "Manual Review";
    default:
      return "Not Required";
  }
}

export function AdminUsersPanel({ users }: AdminUsersPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const pendingUsers = users.filter((u) => u.accountStatus === "Pending");

  return (
    <div className="space-y-6">
      {error && <SystemAlert title="Action Failed" message={error} variant="error" />}

      {pendingUsers.length > 0 && (
        <div className="rounded border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="mb-3 font-mono text-xs tracking-wider text-amber-400 uppercase">
            Approval Queue ({pendingUsers.length})
          </p>
        </div>
      )}

      <div className="space-y-2 font-mono text-xs">
        {users.map((u) => {
          const claim = u.verificationClaim;
          const inviteReq = u.inviteRedemption?.invite.verificationRequirement;
          const isMismatch = claim?.status === "MISMATCHED";

          return (
            <div key={u.id} className="border-b border-border/30 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-primary">{u.name ?? u.email}</span>
                  {u.name && (
                    <span className="ml-2 text-muted-foreground">{u.email}</span>
                  )}
                  <span className="ml-2 uppercase text-muted-foreground">
                    [{u.accountStatus}]
                  </span>
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
                {u.approvalSource && <span>Source: {u.approvalSource}</span>}
                {u.character && (
                  <span>
                    {u.character.callsign}
                    {u.character.faction && ` · ${u.character.faction.name}`}
                  </span>
                )}
              </div>

              {claim && claim.status !== "NOT_REQUIRED" && (
                <div className="mt-2 rounded border border-border/40 bg-background/40 p-3">
                  <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                    Out-of-Band Verification
                  </p>
                  <p className="mt-1">
                    Status:{" "}
                    <span className={isMismatch ? "text-destructive" : "text-primary"}>
                      {verificationStatusLabel(claim.status)}
                    </span>
                  </p>
                  {claim.method && (
                    <p>Method: {VERIFICATION_METHOD_LABELS[claim.method]}</p>
                  )}
                  {claim.submittedPreview && (
                    <p>Submitted preview: ending in {claim.submittedPreview}</p>
                  )}
                  {inviteReq && (
                    <p>
                      Expected preview:{" "}
                      {formatVerificationPreviewLabel(
                        inviteReq.method,
                        inviteReq.expectedPreview,
                      )}
                    </p>
                  )}
                  {isMismatch && (
                    <p className="mt-2 text-destructive">
                      Submitted verification value did not match the invite requirement.
                      Manual review recommended.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {u.accountStatus === "Pending" && (
                  <>
                    <CommandButton
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          const r = await approveUserAction(u.id);
                          if (!r.success) setError(r.error);
                          else setError(null);
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
                          const r = await rejectUserAction(u.id);
                          if (!r.success) setError(r.error);
                          else setError(null);
                          router.refresh();
                        })
                      }
                    >
                      Reject
                    </CommandButton>
                  </>
                )}
                {u.accountStatus === "Approved" && !u.disabled && (
                  <CommandButton
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        const { disableUserAction } = await import("@/lib/actions/phase4");
                        await disableUserAction(u.id);
                        router.refresh();
                      })
                    }
                  >
                    Disable
                  </CommandButton>
                )}
                {u.disabled && u.accountStatus !== "Rejected" && (
                  <CommandButton
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        const { enableUserAction } = await import("@/lib/actions/phase4");
                        await enableUserAction(u.id);
                        router.refresh();
                      })
                    }
                  >
                    Enable
                  </CommandButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
