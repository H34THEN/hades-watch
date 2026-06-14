import Link from "next/link";
import { AdminFactionRequestsPanel } from "@/components/admin/AdminFactionRequestsPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getPendingFactionRequests } from "@/lib/actions/mmo";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Faction Requests" };

export default async function AdminFactionRequestsPage() {
  const user = await getSessionUser();
  if (!user) return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return <AccessDenied title="Clearance Insufficient" message="Faction requests require Owner or Admin clearance." requiredRole="Owner / Admin" />;
  }

  const requests = await getPendingFactionRequests();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Faction Requests</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin"><CommandButton size="sm" variant="outline">← Admin</CommandButton></Link>
        </div>
      </div>
      <TerminalPanel title="faction.requests.pending">
        <AdminFactionRequestsPanel requests={requests} />
      </TerminalPanel>
    </div>
  );
}
