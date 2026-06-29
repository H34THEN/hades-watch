import Link from "next/link";
import { OwnerMediaDeckPanel } from "@/components/admin/OwnerMediaDeckPanel";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { AdminShell } from "@/components/layout/AdminShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getOwnerMediaDeckData } from "@/lib/actions/media";
import { writeAuditLog } from "@/lib/audit";
import { isAdmin, isOwner } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Owner Signal Deck" };

export default async function AdminMediaPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <AccessDenied title="Authentication Required" message="Signal Deck requires authentication." />
    );
  }
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Owner Signal Deck requires Admin or Owner clearance."
      />
    );
  }

  const data = await getOwnerMediaDeckData();
  if (!data) {
    return (
      <AccessDenied title="Deck Unavailable" message="Could not load Owner Signal Deck." />
    );
  }

  const owner = isOwner(user.roles);

  return (
    <AdminShell>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-primary/80 uppercase">
            Chthonic Broadcast · Underworld Radio
          </p>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Owner Signal Deck</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload and manage Chthonic broadcasts. Dead Index Audio filed on disk — back up{" "}
            <code className="text-primary">storage/uploads/audio/</code> separately.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {owner && (
            <Link href="/admin/media/upload">
              <CommandButton>Upload Signal</CommandButton>
            </Link>
          )}
          <Link href="/admin">
            <CommandButton variant="outline">Admin</CommandButton>
          </Link>
        </div>
      </div>

      {owner && (
        <TerminalPanel title="archivist.broadcast" className="mb-6 border-primary/20">
          <p className="text-sm text-muted-foreground">
            Heathen/Slewfoot/The Archivist may upload Suno albums and underworld signals directly.
            The site Signal Player never autoplays — operatives must open the player and press play.
          </p>
        </TerminalPanel>
      )}

      <OwnerMediaDeckPanel albums={data.albums} tracks={data.tracks} isOwner={owner} />
    </AdminShell>
  );
}
