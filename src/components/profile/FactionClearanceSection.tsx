import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getHighestRole } from "@/lib/dossier";
import { POSITION_LABELS } from "@/lib/factions/chthonic-data";
import type { DossierData } from "@/lib/queries/dossier";

interface FactionClearanceSectionProps {
  dossier: DossierData;
}

export function FactionClearanceSection({ dossier }: FactionClearanceSectionProps) {
  const positionLabel =
    dossier.faction?.displayTitle ??
    (dossier.faction?.position
      ? POSITION_LABELS[dossier.faction.position as keyof typeof POSITION_LABELS]
      : null);

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
        <div className="flex justify-between border-b border-border/40 pb-2">
          <dt className="text-muted-foreground">ACCOUNT STATUS</dt>
          <dd className="uppercase">{dossier.accountStatus}</dd>
        </div>
        {dossier.faction ? (
          <>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <dt className="text-muted-foreground">CELL / FACTION</dt>
              <dd>
                <Link
                  href={`/mmo/factions/${dossier.faction.slug}`}
                  className="text-primary hover:underline"
                >
                  {dossier.faction.name}
                </Link>
              </dd>
            </div>
            {positionLabel && (
              <div className="flex justify-between border-b border-border/40 pb-2">
                <dt className="text-muted-foreground">POSITION</dt>
                <dd className="text-primary">{positionLabel}</dd>
              </div>
            )}
            {dossier.faction.reputation > 0 && (
              <div className="flex justify-between border-b border-border/40 pb-2">
                <dt className="text-muted-foreground">REPUTATION</dt>
                <dd>{dossier.faction.reputation}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">STATUS</dt>
              <dd className="uppercase">{dossier.faction.status}</dd>
            </div>
          </>
        ) : (
          <div>
            <p className="text-muted-foreground italic">No cell binding recorded.</p>
            <Link
              href="/mmo/factions"
              className="mt-3 inline-block font-mono text-xs text-primary hover:underline"
            >
              Browse Chthonic Uprising cells →
            </Link>
          </div>
        )}
        {dossier.allianceMembership && (
          <div className="border-t border-primary/20 pt-4">
            <p className="mb-3 font-mono text-[10px] tracking-widest text-primary/80 uppercase">
              Alliance Mark · Dead Index Recognized
            </p>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <dt className="text-muted-foreground">CHTHONIC UPRISING</dt>
              <dd>
                <Link
                  href={`/mmo/factions/${dossier.allianceMembership.slug}`}
                  className="text-primary hover:underline"
                >
                  {dossier.allianceMembership.name}
                </Link>
              </dd>
            </div>
            {(dossier.allianceMembership.displayTitle ||
              dossier.allianceMembership.position) && (
              <div className="flex justify-between border-b border-border/40 py-2">
                <dt className="text-muted-foreground">MARKED AS</dt>
                <dd className="text-primary">
                  {dossier.allianceMembership.displayTitle ??
                    (dossier.allianceMembership.position
                      ? POSITION_LABELS[
                          dossier.allianceMembership
                            .position as keyof typeof POSITION_LABELS
                        ]
                      : null)}
                </dd>
              </div>
            )}
            {dossier.allianceMembership.reputation > 0 && (
              <div className="flex justify-between py-2">
                <dt className="text-muted-foreground">ALLIANCE REP</dt>
                <dd>{dossier.allianceMembership.reputation}</dd>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground italic">
              Marked by the Archivist. The five cells may recruit. The Uprising remembers.
            </p>
          </div>
        )}
        {dossier.pendingFactionRequest && (
          <p className="border-t border-border/40 pt-3 text-xs text-amber-400/90">
            Pending request: {dossier.pendingFactionRequest.name}
          </p>
        )}
        {dossier.dbBadges.length > 0 && (
          <div className="border-t border-border/40 pt-3">
            <dt className="mb-2 text-muted-foreground">AWARDED BADGES</dt>
            <dd className="flex flex-wrap gap-1">
              {dossier.dbBadges.map((b) => (
                <span
                  key={b.slug}
                  className="rounded border border-border/40 px-2 py-0.5 text-[10px]"
                  style={
                    b.color ? { borderColor: `${b.color}66`, color: b.color } : undefined
                  }
                >
                  {b.name}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </TerminalPanel>
  );
}
