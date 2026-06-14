import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getHighestRole } from "@/lib/dossier";
import type { DossierData } from "@/lib/queries/dossier";

interface FactionClearanceSectionProps {
  dossier: DossierData;
}

export function FactionClearanceSection({ dossier }: FactionClearanceSectionProps) {
  return (
    <TerminalPanel title="faction.clearance" className="mb-8">
      <dl className="space-y-4 font-mono text-sm">
        <div className="flex justify-between border-b border-border/40 pb-2">
          <dt className="text-muted-foreground">CLEARANCE</dt>
          <dd className="text-primary">{dossier.clearance.label}</dd>
        </div>
        <div className="flex justify-between border-b border-border/40 pb-2">
          <dt className="text-muted-foreground">PRIMARY ROLE</dt>
          <dd>{getHighestRole(dossier.roles)}</dd>
        </div>
        {dossier.faction ? (
          <>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <dt className="text-muted-foreground">FACTION</dt>
              <dd>
                <Link
                  href={`/mmo/factions/${dossier.faction.slug}`}
                  className="text-primary hover:underline"
                >
                  {dossier.faction.name}
                </Link>
              </dd>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <dt className="text-muted-foreground">CALLSIGN</dt>
              <dd>{dossier.faction.slug}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">STATUS</dt>
              <dd className="uppercase">{dossier.faction.status}</dd>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground italic">No faction binding recorded.</p>
        )}
        {dossier.pendingFactionRequest && (
          <p className="border-t border-border/40 pt-3 text-xs text-amber-400/90">
            Pending request: {dossier.pendingFactionRequest.name}
          </p>
        )}
      </dl>
    </TerminalPanel>
  );
}
