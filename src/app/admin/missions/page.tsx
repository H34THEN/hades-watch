import Link from "next/link";
import { AdminMissionPanel } from "@/components/admin/AdminMissionPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getFactions } from "@/lib/actions/mmo";
import { prisma } from "@/lib/prisma";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Admin Missions" };

export default async function AdminMissionsPage() {
  const user = await getSessionUser();
  if (!user) return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return <AccessDenied title="Clearance Insufficient" message="Mission management requires Owner or Admin clearance." requiredRole="Owner / Admin" />;
  }

  const [missions, factions] = await Promise.all([
    prisma.quest.findMany({ orderBy: { updatedAt: "desc" }, include: { faction: { select: { name: true } } } }),
    getFactions(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Missions</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin"><CommandButton size="sm" variant="outline">← Admin</CommandButton></Link>
        </div>
      </div>

      <TerminalPanel title="mission.registry">
        <AdminMissionPanel
          missions={missions}
          factions={factions.map((f) => ({ id: f.id, name: f.name }))}
        />
      </TerminalPanel>
    </div>
  );
}
