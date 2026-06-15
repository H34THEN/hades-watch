import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";
import { DossierIdentitySection } from "@/components/profile/DossierIdentitySection";
import { FactionClearanceSection } from "@/components/profile/FactionClearanceSection";
import { LineageSection } from "@/components/profile/LineageSection";
import { OperationalHistorySection } from "@/components/profile/OperationalHistorySection";
import { SignalSoundtrackSection } from "@/components/profile/SignalSoundtrackSection";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import Link from "next/link";
import { isOwner } from "@/lib/auth/roles";
import { requireAuth } from "@/lib/auth/session";
import { getDossierForUser } from "@/lib/queries/dossier";

export const metadata = { title: "Dossier" };

export default async function ProfilePage() {
  const user = await requireAuth();
  const dossier = await getDossierForUser(user.id);

  if (!dossier) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <SystemAlert
          title="Dossier Unavailable"
          message="Unable to load operative record."
          variant="error"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">Dossier</h1>
      <p className="mb-8 text-muted-foreground">
        Classified operative identity — field record and operational history.
      </p>

      <DossierIdentitySection dossier={dossier} />
      {isOwner(user.roles) && (
        <TerminalPanel title="owner.signal_deck" className="mb-8 border-primary/20">
          <p className="mb-3 text-sm text-muted-foreground">
            Owner Signal Deck — upload and manage Chthonic broadcasts for the Underwatch.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/media">
              <CommandButton size="sm">Owner Signal Deck</CommandButton>
            </Link>
            <Link href="/admin/media/upload">
              <CommandButton size="sm" variant="outline">
                Upload Signal
              </CommandButton>
            </Link>
          </div>
        </TerminalPanel>
      )}
      <FactionClearanceSection dossier={dossier} />
      <SignalSoundtrackSection dossier={dossier} />
      <LineageSection dossier={dossier} />
      <OperationalHistorySection dossier={dossier} />

      <TerminalPanel title="operative.settings">
        <ProfileSettingsForm user={user} />
      </TerminalPanel>
    </div>
  );
}
