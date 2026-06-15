import Link from "next/link";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { writeAuditLog } from "@/lib/audit";
import { getOwnerMediaDeckData } from "@/lib/actions/media";
import { isOwner } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Upload Signal" };

export default async function AdminMediaUploadPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <AccessDenied title="Authentication Required" message="Upload requires authentication." />
    );
  }
  if (!isOwner(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Owner Clearance Required"
        message="Only the Archivist may upload signals to the Owner Signal Deck."
        requiredRole="Owner"
      />
    );
  }

  const data = await getOwnerMediaDeckData();
  const albums = data?.albums ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Upload Signal</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            File Chthonic broadcasts for the Underwatch Signal Player.
          </p>
        </div>
        <Link href="/admin/media">
          <CommandButton variant="outline">Owner Signal Deck</CommandButton>
        </Link>
      </div>
      <MediaUploadForm albums={albums} />
    </div>
  );
}
