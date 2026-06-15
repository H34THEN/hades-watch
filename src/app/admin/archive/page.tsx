import Link from "next/link";
import { AdminArchivePanel } from "@/components/admin/AdminArchivePanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getAllArchiveItemsAdmin } from "@/lib/actions/archive-items";
import { getHighestRole, isModerator } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Admin Archive" };

export default async function AdminArchivePage() {
  const user = await getSessionUser();
  if (!user) {
    return <AccessDenied title="Authentication Required" message="Admin archive requires authentication." />;
  }
  if (!isModerator(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Archive moderation requires Owner, Admin, or Moderator clearance."
        requiredRole="Moderator+"
      />
    );
  }

  const items = await getAllArchiveItemsAdmin();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Archive Moderation</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin">
            <CommandButton size="sm" variant="outline">
              ← Admin
            </CommandButton>
          </Link>
        </div>
      </div>

      <TerminalPanel title="archive.moderation.registry">
        <p className="mb-4 font-mono text-xs text-muted-foreground">
          State of Affairs articles and Ghost in Tech repo signals. Hide or remove items from public
          feeds.
        </p>
        <AdminArchivePanel items={items} />
      </TerminalPanel>
    </div>
  );
}
