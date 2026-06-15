"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  FactionPosition,
  InviteVerificationMethod,
  InviteVerificationStatus,
  RoleName,
  UserAccountStatus,
} from "@/generated/prisma/client";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  approveUserAction,
  assignUserAccountStatusAction,
  assignUserFactionAction,
  assignUserRoleAction,
  rejectUserAction,
  removeUserFactionAction,
} from "@/lib/actions/admin";
import {
  formatVerificationPreviewLabel,
  VERIFICATION_METHOD_LABELS,
} from "@/lib/verification";
import { POSITION_LABELS } from "@/lib/factions/chthonic-data";

const SITE_ROLES: RoleName[] = [
  "Owner",
  "Admin",
  "Moderator",
  "Expert",
  "Operative",
  "Gamer",
  "Member",
  "Recruit",
  "Guest",
];

const ACCOUNT_STATUSES: UserAccountStatus[] = ["Pending", "Approved", "Rejected"];

const FACTION_POSITIONS: FactionPosition[] = [
  "INITIATE",
  "MEMBER",
  "SPECIALIST",
  "CELL_LEAD",
  "LIEUTENANT",
  "LEADER",
];

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
    isTestAccount: boolean;
    character: { callsign: string; faction: { name: string } | null } | null;
    userRoles: { roleId: string; role: { name: RoleName } }[];
    factionMemberships: {
      position: FactionPosition;
      displayTitle: string | null;
      reputation: number;
      faction: { id: string; name: string; slug: string };
    }[];
    userBadges: {
      badge: { name: string; slug: string; color: string | null };
    }[];
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
  factions: { id: string; slug: string; name: string }[];
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

export function AdminUsersPanel({ users, factions }: AdminUsersPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const pendingUsers = users.filter((u) => u.accountStatus === "Pending");

  function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const r = await action();
      if (!r.success) setError(r.error ?? "Action failed");
      else setError(null);
      router.refresh();
    });
  }

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
          const primaryRole = u.userRoles[0]?.role.name ?? "Guest";
          const membership = u.factionMemberships[0];

          return (
            <div key={u.id} className="border-b border-border/30 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-primary">{u.name ?? u.email}</span>
                  {u.name && (
                    <span className="ml-2 text-muted-foreground">{u.email}</span>
                  )}
                  {u.isTestAccount && (
                    <span className="ml-2 rounded border border-amber-500/40 px-1 text-amber-400">
                      TEST
                    </span>
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
                {membership && (
                  <span>
                    {membership.faction.name} ·{" "}
                    {membership.displayTitle ?? POSITION_LABELS[membership.position]}
                    {membership.reputation > 0 && ` · rep ${membership.reputation}`}
                  </span>
                )}
                {u.character && <span>Callsign: {u.character.callsign}</span>}
              </div>

              {u.userBadges.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {u.userBadges.map((ub) => (
                    <span
                      key={ub.badge.slug}
                      className="rounded border border-border/40 px-1.5 py-0.5 text-[10px]"
                      style={
                        ub.badge.color
                          ? { borderColor: `${ub.badge.color}66`, color: ub.badge.color }
                          : undefined
                      }
                    >
                      {ub.badge.name}
                    </span>
                  ))}
                </div>
              )}

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
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/20 pt-3">
                <Select
                  value={primaryRole}
                  onValueChange={(v) =>
                    v && runAction(() => assignUserRoleAction(u.id, v))
                  }
                >
                  <SelectTrigger className="h-7 w-32 font-mono text-[10px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {SITE_ROLES.map((r) => (
                      <SelectItem key={r} value={r} className="font-mono text-xs">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={u.accountStatus}
                  onValueChange={(v) =>
                    v && runAction(() => assignUserAccountStatusAction(u.id, v))
                  }
                >
                  <SelectTrigger className="h-7 w-28 font-mono text-[10px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="font-mono text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={membership?.faction.id ?? ""}
                  onValueChange={(v) => {
                    if (!v) return;
                    runAction(() =>
                      assignUserFactionAction(u.id, v, membership?.position ?? "INITIATE"),
                    );
                  }}
                >
                  <SelectTrigger className="h-7 w-44 font-mono text-[10px]">
                    <SelectValue placeholder="Faction" />
                  </SelectTrigger>
                  <SelectContent>
                    {factions.map((f) => (
                      <SelectItem key={f.id} value={f.id} className="font-mono text-xs">
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {membership && (
                  <Select
                    value={membership.position}
                    onValueChange={(v) =>
                      v &&
                      runAction(() =>
                        assignUserFactionAction(
                          u.id,
                          membership.faction.id,
                          v,
                          membership.displayTitle ?? undefined,
                        ),
                      )
                    }
                  >
                    <SelectTrigger className="h-7 w-36 font-mono text-[10px]">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACTION_POSITIONS.map((p) => (
                        <SelectItem key={p} value={p} className="font-mono text-xs">
                          {POSITION_LABELS[p]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {membership && (
                  <CommandButton
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => runAction(() => removeUserFactionAction(u.id))}
                  >
                    Clear Faction
                  </CommandButton>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {u.accountStatus === "Pending" && (
                  <>
                    <CommandButton
                      size="sm"
                      disabled={isPending}
                      onClick={() => runAction(() => approveUserAction(u.id))}
                    >
                      Approve
                    </CommandButton>
                    <CommandButton
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => runAction(() => rejectUserAction(u.id))}
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
