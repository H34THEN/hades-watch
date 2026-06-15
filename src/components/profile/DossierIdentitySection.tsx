import { RoleBadge } from "@/components/badges/RoleBadge";
import { DossierBadgeList } from "@/components/profile/DossierBadgeList";
import { TitleSelector } from "@/components/profile/TitleSelector";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import type { DossierData } from "@/lib/queries/dossier";

interface DossierIdentitySectionProps {
  dossier: DossierData;
}

export function DossierIdentitySection({ dossier }: DossierIdentitySectionProps) {
  return (
    <TerminalPanel title="dossier.identity" className="mb-8">
      <div className="space-y-4 font-mono text-sm">
        <div className="flex flex-col gap-1 border-b border-border/40 pb-3 sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">ENTRY VERIFICATION</span>
          <span>{dossier.entryVerification}</span>
        </div>
        <div className="flex flex-col gap-1 border-b border-border/40 pb-3 sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">CODENAME</span>
          <span className="text-primary">{dossier.codename}</span>
        </div>
        <div className="flex flex-col gap-1 border-b border-border/40 pb-3 sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">ACTIVE TITLE</span>
          <span>{dossier.activeTitle}</span>
        </div>
        <div className="flex flex-col gap-2 border-b border-border/40 pb-3">
          <span className="text-muted-foreground">ROLES</span>
          <div className="flex flex-wrap gap-1">
            {dossier.roles.map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
          </div>
        </div>
        <div className="space-y-2 border-b border-border/40 pb-3">
          <span className="text-muted-foreground">BADGES</span>
          <DossierBadgeList badges={dossier.badges} />
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">ENLISTED</dt>
            <dd>{dossier.joinDate.toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">THEME</dt>
            <dd className="text-primary">{dossier.themeName ?? "Default"}</dd>
          </div>
        </dl>
        <TitleSelector
          earnedTitles={dossier.earnedTitles}
          activeTitle={dossier.activeTitle}
        />
      </div>
    </TerminalPanel>
  );
}
