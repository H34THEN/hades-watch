import Link from "next/link";
import { NetNeighborAdminPanel } from "@/components/net-neighbors/NetNeighborAdminPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { AdminShell } from "@/components/layout/AdminShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getHighestRole, isModerator } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import {
  getApprovedNetNeighborsForAdmin,
  getPendingNetNeighbors,
} from "@/lib/queries/net-neighbors";
import { parseBannerStyleJson } from "@/lib/net-neighbors/banner-builder";

export const metadata = { title: "Admin Net Neighbors" };

export default async function AdminNetNeighborsPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <AccessDenied
        title="Authentication Required"
        message="Net Neighbor review requires authentication."
      />
    );
  }
  if (!isModerator(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Net Neighbor review requires Moderator clearance or higher."
        requiredRole="Moderator+"
      />
    );
  }

  const [pendingNeighbors, approvedRows] = await Promise.all([
    getPendingNetNeighbors(),
    getApprovedNetNeighborsForAdmin(),
  ]);

  const pending = pendingNeighbors.map((n) => ({
    id: n.id,
    title: n.title,
    url: n.url,
    description: n.description,
    tags: n.tags,
    submitterNote: n.submitterNote,
    bannerPath: n.bannerPath,
    bannerStyle: parseBannerStyleJson(n.bannerStyle),
    submittedBy: n.submittedBy,
  }));

  const approved = approvedRows.map((n) => ({
    id: n.id,
    title: n.title,
    url: n.url,
    sortOrder: n.sortOrder,
    bannerPath: n.bannerPath,
    bannerStyle: n.bannerStyle,
    submittedBy: n.submittedBy,
  }));

  return (
    <AdminShell>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Net Neighbors</h1>
          <p className="text-sm text-muted-foreground">Approve, reject, hide, and reorder signals.</p>
        </div>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/net-neighbors">
            <CommandButton size="sm" variant="outline">
              Public Wall
            </CommandButton>
          </Link>
          <Link href="/admin">
            <CommandButton size="sm" variant="outline">
              ← Admin
            </CommandButton>
          </Link>
        </div>
      </div>

      <TerminalPanel title="net_neighbors.admin">
        <NetNeighborAdminPanel pendingNeighbors={pending} approvedNeighbors={approved} />
      </TerminalPanel>
    </AdminShell>
  );
}
