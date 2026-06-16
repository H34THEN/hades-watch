import Link from "next/link";
import { AdminCard } from "@/components/cards/AdminCard";
import { AdminInvitePanel } from "@/components/admin/AdminInvitePanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getAdminStats, getInviteCodes } from "@/lib/actions/admin";
import { getModerationStats } from "@/lib/actions/moderation";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
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
        message="Admin console requires Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const [stats, invites, modStats] = await Promise.all([
    getAdminStats(),
    getInviteCodes(),
    getModerationStats(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">
            Admin Console
          </h1>
          <p className="text-muted-foreground">
            Restricted operations surface.
          </p>
        </div>
        <RoleBadge role={getHighestRole(user.roles)} />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminCard title="Users" description="Registered operatives" status="online">
          <p className="font-mono text-2xl text-primary">{stats.userCount}</p>
          <Link href="/admin/users" className="mt-2 inline-block">
            <CommandButton size="sm">Manage</CommandButton>
          </Link>
        </AdminCard>
        <AdminCard title="Active Invites" description="Non-revoked codes" status="online">
          <p className="font-mono text-2xl text-primary">{stats.inviteCount}</p>
        </AdminCard>
        <AdminCard title="Transmissions" description="Published broadcasts" status="online">
          <p className="font-mono text-2xl text-primary">{stats.announcementCount}</p>
          <Link href="/admin/announcements" className="mt-2 inline-block">
            <CommandButton size="sm">Manage</CommandButton>
          </Link>
        </AdminCard>
        <AdminCard title="Events" description="Published events" status="online">
          <p className="font-mono text-2xl text-primary">{stats.eventCount}</p>
          <Link href="/admin/events" className="mt-2 inline-block">
            <CommandButton size="sm">Manage</CommandButton>
          </Link>
        </AdminCard>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <AdminCard title="Lore" description="Archive entries" status="online">
          <Link href="/admin/lore"><CommandButton size="sm">Manage</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Archive Signals" description="Articles & repos" status="online">
          <Link href="/admin/archive"><CommandButton size="sm">Moderate</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Faction Command" description="Chthonic Overlord console" status="online">
          <Link href="/admin/factions/command"><CommandButton size="sm">Chthonic Command</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Owner Signal Deck" description="Chthonic broadcasts" status="online">
          <Link href="/admin/media"><CommandButton size="sm">Signal Deck</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Factions" description="Allegiance registry" status="online">
          <Link href="/admin/factions"><CommandButton size="sm">Manage</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Missions" description="Quest registry" status="online">
          <Link href="/admin/missions"><CommandButton size="sm">Manage</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Dead Drops" description="Roleplay messages" status="online">
          <Link href="/admin/dead-drops"><CommandButton size="sm">Manage</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Social" description="Net Neighbors & relic zones" status="online">
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/net-neighbors"><CommandButton size="sm">Net Neighbors</CommandButton></Link>
            <Link href="/admin/social"><CommandButton size="sm" variant="outline">Social Review</CommandButton></Link>
          </div>
        </AdminCard>
        <AdminCard title="Mod Queue" description={`${modStats.open} open reports`} status={modStats.open > 0 ? "degraded" : "online"}>
          <Link href="/moderation"><CommandButton size="sm">Moderation</CommandButton></Link>
        </AdminCard>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminCard title="Launch" description="Pre-flight checklist" status="locked">
          <Link href="/admin/launch"><CommandButton size="sm">Checklist</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Audit Logs" description="Filtered event history" status="online">
          <Link href="/admin/audit"><CommandButton size="sm">Browse</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Faction Requests" description="Pending memberships" status="online">
          <Link href="/admin/faction-requests"><CommandButton size="sm">Review</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Avatar Forge" description="GPT relay access requests" status="online">
          <Link href="/admin/avatar-forge-access"><CommandButton size="sm">Review</CommandButton></Link>
        </AdminCard>
        <AdminCard title="Deployment" description="docs/DEPLOYMENT.md" status="locked">
          <p className="font-mono text-[10px] text-muted-foreground">Do not deploy until checklist passes.</p>
        </AdminCard>
      </div>

      <TerminalPanel title="invite.management" className="mb-8">
        <AdminInvitePanel invites={invites} />
      </TerminalPanel>

      <TerminalPanel title="audit.recent">
        <div className="space-y-2 font-mono text-xs">
          {stats.auditLogs.length === 0 ? (
            <p className="text-muted-foreground">No audit logs yet.</p>
          ) : (
            stats.auditLogs.map((log) => (
              <div key={log.id} className="flex justify-between border-b border-border/30 py-1">
                <span className="text-primary">{log.action}</span>
                <span className="text-muted-foreground">
                  {log.actor?.email ?? "system"} — {log.createdAt.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </TerminalPanel>

      <TerminalPanel title="roles.overview" className="mt-8">
        <div className="grid gap-2 font-mono text-sm sm:grid-cols-2">
          {stats.roles.map((role) => (
            <div key={role.id} className="flex justify-between border-b border-border/30 py-1">
              <span>{role.name}</span>
              <span className="text-muted-foreground">{role._count.userRoles} users</span>
            </div>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}
