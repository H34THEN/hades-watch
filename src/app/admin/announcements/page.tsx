import Link from "next/link";
import { AdminAnnouncementPanel } from "@/components/admin/AdminAnnouncementPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getAllAnnouncements } from "@/lib/actions/announcements";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Admin Announcements" };

export default async function AdminAnnouncementsPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <AccessDenied
        title="Authentication Required"
        message="Admin console requires authentication."
      />
    );
  }

  if (!isAdmin(user.roles)) {
    await writeAuditLog({
      action: "access.denied.admin",
      actorId: user.id,
    });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Announcement management requires Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const announcements = await getAllAnnouncements();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">
            Transmissions Admin
          </h1>
          <p className="text-muted-foreground">
            Create, publish, and archive network broadcasts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin">
            <CommandButton size="sm" variant="outline">← Admin</CommandButton>
          </Link>
        </div>
      </div>

      <TerminalPanel title="announcement.management">
        <AdminAnnouncementPanel announcements={announcements} />
      </TerminalPanel>
    </div>
  );
}
