import Link from "next/link";
import { AdminSocialPanel } from "@/components/admin/AdminSocialPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getHighestRole, isModerator } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { getPendingNetNeighbors } from "@/lib/queries/net-neighbors";

export const metadata = { title: "Admin Social" };

export default async function AdminSocialPage() {
  const user = await getSessionUser();
  if (!user) {
    return <AccessDenied title="Authentication Required" message="Admin social review requires authentication." />;
  }
  if (!isModerator(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Social review requires Moderator clearance or higher."
        requiredRole="Moderator+"
      />
    );
  }

  const pendingNeighbors = await getPendingNetNeighbors();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Social Review</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin">
            <CommandButton size="sm" variant="outline">← Admin</CommandButton>
          </Link>
        </div>
      </div>

      <TerminalPanel title="social.review">
        <p className="mb-4 font-mono text-xs text-muted-foreground">
          Review Net Neighbor banner submissions. Disable abusive profile relic zones from pending rows.
        </p>
        <AdminSocialPanel pendingNeighbors={pendingNeighbors} />
      </TerminalPanel>
    </div>
  );
}
