"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FactionPosition, RoleName } from "@/generated/prisma/client";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adjustFactionReputationAction,
  chthonicAssignFactionAction,
  chthonicRemoveFactionAction,
  setPrimaryFactionAction,
} from "@/lib/actions/chthonic-command";
import { POSITION_LABELS } from "@/lib/factions/chthonic-data";

const POSITIONS: FactionPosition[] = [
  "INITIATE",
  "MEMBER",
  "SPECIALIST",
  "CELL_LEAD",
  "LIEUTENANT",
  "LEADER",
];

interface ChthonicCommandPanelProps {
  data: Awaited<ReturnType<typeof import("@/lib/actions/chthonic-command").getChthonicCommandData>>;
  isOwner: boolean;
}

export function ChthonicCommandPanel({ data, isOwner }: ChthonicCommandPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [expandedLore, setExpandedLore] = useState<string | null>(null);

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const r = await action();
      if (!r.success) setError(r.error ?? "Action failed");
      else setError(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {error && <SystemAlert title="Command Failed" message={error} variant="error" />}

      {data.seedWarning && (
        <SystemAlert
          title="Canonical Fallback Active"
          message="Some factions are not seeded in the database. Run: npm run db:seed:factions"
          variant="warning"
        />
      )}

      {!isOwner && (
        <SystemAlert
          title="Read-Only Access"
          message="Admin clearance — overview visible. Owner clearance required for Overlord assignment actions."
          variant="warning"
        />
      )}

      <TerminalPanel title="overlord.overview">
        <div className="grid gap-4 lg:grid-cols-2">
          {data.factions.map((f) => (
            <div
              key={f.slug}
              className="rounded border border-border/40 p-4"
              style={
                f.palette
                  ? { borderColor: `${Object.values(f.palette)[0]}44` }
                  : undefined
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-mono text-sm font-semibold uppercase text-primary">
                    {f.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">{f.archetype}</p>
                  <p className="mt-1 text-[10px]">
                    Lead: {f.leaderName ?? "—"}
                  </p>
                </div>
                <span
                  className={`font-mono text-[10px] uppercase ${f.seeded ? "text-primary" : "text-amber-400"}`}
                >
                  {f.seeded ? "Seeded" : "Canonical"}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div>
                  <dt className="text-muted-foreground">Members</dt>
                  <dd>{f.memberCount}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Pending</dt>
                  <dd>{f.pendingCount}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Cell Leads+</dt>
                  <dd>{f.lieutenantCount}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Reputation</dt>
                  <dd>{f.totalReputation}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Badges</dt>
                  <dd>{f.badgeCount}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Missions</dt>
                  <dd>{f.missionCount}</dd>
                </div>
              </dl>
              {f.warnings.length > 0 && (
                <ul className="mt-2 text-[10px] text-amber-400">
                  {f.warnings.map((w) => (
                    <li key={w}>· {w}</li>
                  ))}
                </ul>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/mmo/factions/${f.slug}`}>
                  <CommandButton size="sm" variant="outline">
                    Lore Page
                  </CommandButton>
                </Link>
                <Link href="/admin/factions">
                  <CommandButton size="sm" variant="outline">
                    Registry
                  </CommandButton>
                </Link>
                <CommandButton
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setExpandedLore(expandedLore === f.slug ? null : f.slug)
                  }
                >
                  {expandedLore === f.slug ? "Hide Lore" : "Quick Lore"}
                </CommandButton>
              </div>
              {expandedLore === f.slug && (
                <div className="mt-3 border-t border-border/30 pt-3 text-xs text-foreground/80">
                  {f.tagline && <p className="italic">&ldquo;{f.tagline}&rdquo;</p>}
                  <p className="mt-2">{f.description}</p>
                  {f.symbol && <p className="mt-2 text-muted-foreground">◈ {f.symbol}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </TerminalPanel>

      <TerminalPanel title="membership.monitor">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-[10px]">
            <thead>
              <tr className="border-b border-border/40 text-left text-muted-foreground">
                <th className="py-2 pr-2">Operative</th>
                <th className="py-2 pr-2">Role</th>
                <th className="py-2 pr-2">Faction</th>
                <th className="py-2 pr-2">Position</th>
                <th className="py-2 pr-2">Rep</th>
                <th className="py-2 pr-2">Primary</th>
                {isOwner && <th className="py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.memberships.map((m) => (
                <tr key={m.id} className="border-b border-border/20">
                  <td className="py-2 pr-2">
                    {m.userName}
                    {m.isTestAccount && (
                      <span className="ml-1 text-amber-400">TEST</span>
                    )}
                  </td>
                  <td className="py-2 pr-2">{m.siteRole}</td>
                  <td className="py-2 pr-2">{m.factionName}</td>
                  <td className="py-2 pr-2">
                    {m.displayTitle ?? POSITION_LABELS[m.position]}
                  </td>
                  <td className="py-2 pr-2">{m.reputation}</td>
                  <td className="py-2 pr-2">{m.isPrimary ? "Yes" : "—"}</td>
                  {isOwner && (
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {!m.isPrimary && (
                          <CommandButton
                            size="sm"
                            variant="outline"
                            disabled={isPending}
                            onClick={() =>
                              run(() => setPrimaryFactionAction(m.userId, m.id))
                            }
                          >
                            Primary
                          </CommandButton>
                        )}
                        <CommandButton
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() =>
                            run(() =>
                              adjustFactionReputationAction(m.id, m.reputation + 10),
                            )
                          }
                        >
                          +10 Rep
                        </CommandButton>
                        <CommandButton
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => run(() => chthonicRemoveFactionAction(m.userId))}
                        >
                          Remove
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

      <TerminalPanel title="unaffiliated.queue">
        <div className="space-y-2 font-mono text-xs">
          {data.unaffiliated.length === 0 && (
            <p className="text-muted-foreground">No approved unaffiliated operatives.</p>
          )}
          {data.unaffiliated.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border/20 py-2"
            >
              <span>
                {u.name ?? u.email}
                {u.isTestAccount && <span className="ml-1 text-amber-400">TEST</span>}
                <span className="ml-2 text-muted-foreground">
                  {(u.userRoles[0]?.role.name as RoleName) ?? "Guest"}
                </span>
              </span>
              {isOwner && data.factions.some((f) => f.dbId) && (
                <Select
                  onValueChange={(v) => {
                    if (!v || typeof v !== "string") return;
                    const [factionId, position] = v.split(":");
                    run(() =>
                      chthonicAssignFactionAction(
                        u.id,
                        factionId,
                        position as FactionPosition,
                      ),
                    );
                  }}
                >
                  <SelectTrigger className="h-7 w-48 font-mono text-[10px]">
                    <SelectValue placeholder="Assign faction" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.factions
                      .filter((f) => f.dbId)
                      .flatMap((f) =>
                        POSITIONS.map((p) => (
                          <SelectItem
                            key={`${f.dbId}-${p}`}
                            value={`${f.dbId}:${p}`}
                            className="font-mono text-xs"
                          >
                            {f.name} — {POSITION_LABELS[p]}
                          </SelectItem>
                        )),
                      )}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      </TerminalPanel>

      {data.pendingRequests.length > 0 && (
        <TerminalPanel title="pending.requests">
          {data.pendingRequests.map((r) => (
            <div key={r.id} className="border-b border-border/20 py-2 font-mono text-xs">
              {r.user.name ?? r.user.email} → {r.faction.name}
              {r.user.isTestAccount && <span className="ml-1 text-amber-400">TEST</span>}
              <Link href="/admin/faction-requests" className="ml-3 text-primary hover:underline">
                Review
              </Link>
            </div>
          ))}
        </TerminalPanel>
      )}

      {isOwner && data.badges.length > 0 && (
        <TerminalPanel title="badge.award">
          <p className="mb-3 text-xs text-muted-foreground">
            Award faction badges from Chthonic Command. Select operative in Users for full control.
          </p>
          <Link href="/admin/users">
            <CommandButton size="sm">Open User Registry</CommandButton>
          </Link>
        </TerminalPanel>
      )}
    </div>
  );
}
