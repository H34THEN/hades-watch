"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FactionPosition } from "@/generated/prisma/client";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignChthonicAllianceAction,
  removeChthonicAllianceAction,
  updateChthonicAllianceMembershipAction,
} from "@/lib/actions/chthonic-alliance";
import { POSITION_LABELS } from "@/lib/factions/chthonic-data";

const POSITIONS: FactionPosition[] = [
  "INITIATE",
  "MEMBER",
  "SPECIALIST",
  "CELL_LEAD",
  "LIEUTENANT",
  "LEADER",
];

interface AllianceMember {
  id: string;
  userId: string;
  userName: string;
  email: string;
  accountStatus: string;
  siteRole: string;
  position: FactionPosition;
  displayTitle: string | null;
  reputation: number;
  isPrimary: boolean;
  joinedAt: Date;
  primaryCell: { name: string; slug: string } | null;
}

interface AssignableUser {
  id: string;
  email: string;
  name: string | null;
}

interface ChthonicAlliancePanelProps {
  members: AllianceMember[];
  assignableUsers: AssignableUser[];
  isOwner: boolean;
}

export function ChthonicAlliancePanel({
  members,
  assignableUsers,
  isOwner,
}: ChthonicAlliancePanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignPosition, setAssignPosition] = useState<FactionPosition>("MEMBER");
  const [assignTitle, setAssignTitle] = useState("");

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const r = await action();
      if (!r.success) setError(r.error ?? "Action failed");
      else setError(null);
      router.refresh();
    });
  }

  return (
    <TerminalPanel title="alliance.membership" className="border-primary/20">
      <p className="mb-4 text-sm text-muted-foreground">
        The Chthonic Uprising is assigned by the Archivist. No operative joins the underworld by
        accident. Membership in the Uprising is conferred by Slewfoot through the Dead Index — not
        requested through a public form.
      </p>
      {error && <p className="mb-3 font-mono text-xs text-red-400">{error}</p>}

      {isOwner && assignableUsers.length > 0 && (
        <div className="mb-6 rounded border border-border/40 p-4">
          <p className="mb-3 font-mono text-[10px] tracking-widest text-primary uppercase">
            Confer Alliance Mark
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <Select
              value={assignUserId}
              onValueChange={(v) => setAssignUserId(v ?? "")}
            >
              <SelectTrigger className="h-8 w-56 font-mono text-[10px]">
                <SelectValue placeholder="Select operative" />
              </SelectTrigger>
              <SelectContent>
                {assignableUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id} className="font-mono text-xs">
                    {u.name ?? u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={assignPosition}
              onValueChange={(v) => setAssignPosition(v as FactionPosition)}
            >
              <SelectTrigger className="h-8 w-40 font-mono text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((p) => (
                  <SelectItem key={p} value={p} className="font-mono text-xs">
                    {POSITION_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              value={assignTitle}
              onChange={(e) => setAssignTitle(e.target.value)}
              placeholder="Display title (optional)"
              className="h-8 rounded border border-border/50 bg-background px-2 font-mono text-[10px]"
            />
            <CommandButton
              size="sm"
              disabled={isPending || !assignUserId}
              onClick={() =>
                run(() =>
                  assignChthonicAllianceAction(
                    assignUserId,
                    assignPosition,
                    assignTitle || undefined,
                  ),
                )
              }
            >
              Mark Chthonic
            </CommandButton>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-[10px]">
          <thead>
            <tr className="border-b border-border/40 text-left text-muted-foreground">
              <th className="py-2 pr-2">Operative</th>
              <th className="py-2 pr-2">Site Role</th>
              <th className="py-2 pr-2">Primary Cell</th>
              <th className="py-2 pr-2">Alliance Title</th>
              <th className="py-2 pr-2">Position</th>
              <th className="py-2 pr-2">Rep</th>
              <th className="py-2 pr-2">Joined</th>
              {isOwner && <th className="py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr>
                <td colSpan={isOwner ? 8 : 7} className="py-4 text-muted-foreground">
                  No Chthonic Uprising members recorded yet.
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.id} className="border-b border-border/20">
                <td className="py-2 pr-2">{m.userName}</td>
                <td className="py-2 pr-2">{m.siteRole}</td>
                <td className="py-2 pr-2">{m.primaryCell?.name ?? "—"}</td>
                <td className="py-2 pr-2">{m.displayTitle ?? "—"}</td>
                <td className="py-2 pr-2">{POSITION_LABELS[m.position]}</td>
                <td className="py-2 pr-2">{m.reputation}</td>
                <td className="py-2 pr-2">{new Date(m.joinedAt).toLocaleDateString()}</td>
                {isOwner && (
                  <td className="py-2">
                    <div className="flex flex-wrap gap-1">
                      <CommandButton
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() =>
                          run(() =>
                            updateChthonicAllianceMembershipAction(m.id, {
                              reputation: m.reputation + 10,
                            }),
                          )
                        }
                      >
                        +10 Rep
                      </CommandButton>
                      <CommandButton
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => run(() => removeChthonicAllianceAction(m.userId))}
                      >
                        Remove Mark
                      </CommandButton>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TerminalPanel>
  );
}
