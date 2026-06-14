import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import type { DossierData } from "@/lib/queries/dossier";

interface OperationalHistorySectionProps {
  dossier: DossierData;
}

export function OperationalHistorySection({ dossier }: OperationalHistorySectionProps) {
  const { history } = dossier;
  const hasActivity =
    history.missionsCompleted > 0 ||
    history.activeMissions > 0 ||
    history.ciphersSolved > 0 ||
    history.loreUnlocks > 0;

  return (
    <TerminalPanel title="operational.history" className="mb-8">
      <div className="mb-4 grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-4">
        <Stat label="Missions Completed" value={history.missionsCompleted} />
        <Stat label="Active Missions" value={history.activeMissions} />
        <Stat label="Ciphers Solved" value={history.ciphersSolved} />
        <Stat label="Lore Unlocks" value={history.loreUnlocks} />
      </div>

      {!hasActivity ? (
        <p className="font-mono text-sm text-muted-foreground italic">
          No field activity logged yet.
        </p>
      ) : (
        <div className="space-y-6 font-mono text-sm">
          {history.recentMissions.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                Recent Missions
              </h3>
              <ul className="space-y-2">
                {history.recentMissions.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-col gap-1 border-b border-border/30 pb-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <Link
                      href={`/mmo/missions/${m.slug}`}
                      className="text-primary hover:underline"
                    >
                      {m.title}
                    </Link>
                    <span className="text-xs text-muted-foreground uppercase">{m.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {history.recentCiphers.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                Recent Cipher Solves
              </h3>
              <ul className="space-y-2">
                {history.recentCiphers.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-col gap-1 border-b border-border/30 pb-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <Link
                      href={`/ciphers/${c.slug}`}
                      className="text-primary hover:underline"
                    >
                      {c.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {c.solvedAt.toLocaleDateString()} · {c.attemptCount} attempt(s)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </TerminalPanel>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-border/40 bg-background/30 px-3 py-2">
      <p className="text-[10px] tracking-wider text-muted-foreground uppercase">{label}</p>
      <p className="text-lg text-primary">{value}</p>
    </div>
  );
}
