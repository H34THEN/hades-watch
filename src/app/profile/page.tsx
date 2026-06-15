import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";
import { DossierIdentitySection } from "@/components/profile/DossierIdentitySection";
import { FactionClearanceSection } from "@/components/profile/FactionClearanceSection";
import { LineageSection } from "@/components/profile/LineageSection";
import { OperationalHistorySection } from "@/components/profile/OperationalHistorySection";
import { SignalSoundtrackSection } from "@/components/profile/SignalSoundtrackSection";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
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
