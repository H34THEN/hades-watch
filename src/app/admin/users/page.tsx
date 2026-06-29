import Link from "next/link";
import { AdminUsersPanel } from "@/components/admin/AdminUsersPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { AdminShell } from "@/components/layout/AdminShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getAdminUsers } from "@/lib/actions/phase4";
import { getFactionsForAdmin } from "@/lib/actions/mmo";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Admin Users" };

export default async function AdminUsersPage() {
  const user = await getSessionUser();

  if (!user) {
    return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  }

  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="User management requires Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const [users, factions] = await Promise.all([getAdminUsers(), getFactionsForAdmin()]);

  return (
    <AdminShell>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Users</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin"><CommandButton size="sm" variant="outline">← Admin</CommandButton></Link>
        </div>
      </div>

      <TerminalPanel title="user.registry">
        <AdminUsersPanel users={users} factions={factions} />
      </TerminalPanel>
    </AdminShell>
  );
}
