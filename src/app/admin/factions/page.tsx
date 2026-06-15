import Link from "next/link";
import { AdminFactionForm } from "@/components/admin/AdminFactionForm";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getFactions } from "@/lib/actions/mmo";
import { getHighestRole, isAdmin, isOwner } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Admin Factions" };

export default async function AdminFactionsPage() {
  const user = await getSessionUser();
  if (!user) return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return <AccessDenied title="Clearance Insufficient" message="Faction management requires Owner or Admin clearance." requiredRole="Owner / Admin" />;
  }

  const factions = await getFactions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Factions</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          {isOwner(user.roles) && (
            <Link href="/admin/factions/command">
              <CommandButton size="sm">Chthonic Command</CommandButton>
            </Link>
          )}
          <Link href="/admin"><CommandButton size="sm" variant="outline">← Admin</CommandButton></Link>
        </div>
      </div>

      <TerminalPanel title="faction.registry">
        <div className="space-y-2 font-mono text-xs">
          {factions.map((f) => (
            <div key={f.id} className="border-b border-border/30 py-2">
              {f.name} · {f.slug} · {f._count.characters} operatives
            </div>
          ))}
        </div>
        <AdminFactionForm />
      </TerminalPanel>
    </div>
  );
}
