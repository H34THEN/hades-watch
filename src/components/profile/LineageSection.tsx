import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import type { DossierData } from "@/lib/queries/dossier";

interface LineageSectionProps {
  dossier: DossierData;
}

export function LineageSection({ dossier }: LineageSectionProps) {
  const { lineage } = dossier;

  return (
    <TerminalPanel title="lineage" className="mb-8">
      {!lineage.hasData ? (
        <p className="font-mono text-sm text-muted-foreground italic">
          No lineage data available.
        </p>
      ) : (
        <dl className="space-y-4 font-mono text-sm">
          {lineage.entryCode ? (
            <>
              <p className="text-xs tracking-wider text-primary uppercase">
                Entry vector verified.
              </p>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <dt className="text-muted-foreground">ENTRY CODE</dt>
                <dd>{lineage.entryCode}</dd>
              </div>
              {lineage.entryRole && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <dt className="text-muted-foreground">ROLE GRANTED</dt>
                  <dd>{lineage.entryRole}</dd>
                </div>
              )}
              {lineage.entryDate && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <dt className="text-muted-foreground">REDEEMED</dt>
                  <dd>{lineage.entryDate.toLocaleDateString()}</dd>
                </div>
              )}
              {lineage.invitedBy && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <dt className="text-muted-foreground">INVITED BY</dt>
                  <dd>{lineage.invitedBy}</dd>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground italic">
              Entry vector not recorded (pre-lineage account).
            </p>
          )}
          <div className="flex justify-between border-b border-border/40 pb-2">
            <dt className="text-muted-foreground">INVITES CREATED</dt>
            <dd>{lineage.invitesCreated}</dd>
          </div>
          {dossier.isAdminViewer && lineage.invitesCreatedList.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground uppercase">Your invite codes</p>
              <ul className="space-y-2 text-xs">
                {lineage.invitesCreatedList.map((inv) => (
                  <li
                    key={inv.id}
                    className="rounded border border-border/40 bg-background/40 px-3 py-2"
                  >
                    <div className="flex justify-between gap-2">
                      <span className="text-primary">{inv.codeDisplay}</span>
                      <span className={inv.revoked ? "text-destructive" : "text-muted-foreground"}>
                        {inv.revoked ? "REVOKED" : `${inv.usesCount}/${inv.maxUses}`}
                      </span>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {inv.roleGranted ?? "Member"} · {inv.createdAt.toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </dl>
      )}
    </TerminalPanel>
  );
}
