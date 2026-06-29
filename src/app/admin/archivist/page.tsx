import Link from "next/link";
import { ArchivistActionFeedClient } from "@/components/admin/ArchivistActionFeedClient";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { AdminShell } from "@/components/layout/AdminShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { writeAuditLog } from "@/lib/audit";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { getArchivistActionFeed } from "@/lib/queries/archivist-action-feed";

export const metadata = { title: "Archivist Administrator" };

export default async function ArchivistAdministratorPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <AccessDenied
        title="Authentication Required"
        message="Archivist Administrator requires authentication."
      />
    );
  }

  if (!isAdmin(user.roles)) {
    await writeAuditLog({
      action: "access.denied.admin",
      actorId: user.id,
      metadata: { route: "/admin/archivist" },
    });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Archivist Administrator requires Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const { items, stats } = await getArchivistActionFeed();

  return (
    <AdminShell>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-primary/80 uppercase">
            Dead Index Review Terminal
          </p>
          <h1 className="font-mono text-3xl tracking-widest uppercase">
            Archivist Administrator // Action Feed
          </h1>
          <p className="mt-2 hw-readable-wide text-sm text-muted-foreground">
            One feed for signals requiring Archivist review, moderation, approval, grants, and command
            action.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin">
            <CommandButton size="sm" variant="outline">
              ← Admin
            </CommandButton>
          </Link>
        </div>
      </div>

      <ArchivistActionFeedClient items={items} stats={stats} />
    </AdminShell>
  );
}
