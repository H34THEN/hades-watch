import Link from "next/link";
import { AdminCard } from "@/components/cards/AdminCard";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { PageShell } from "@/components/layout/PageShell";
import { ModerationNav } from "@/components/moderation/ModerationNav";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getModerationStats, getReports } from "@/lib/actions/moderation";
import { getHighestRole } from "@/lib/auth/guards";

export const metadata = { title: "Moderation" };

export default async function ModerationPage() {
  const mod = await (await import("@/lib/auth/guards")).requireModeratorUser();

  if (!mod.ok) {
    if (mod.reason === "role") {
      await writeAuditLog({ action: "access.denied.moderation" });
    }
    return (
      <AccessDenied
        title={mod.reason === "auth" ? "Authentication Required" : "Clearance Insufficient"}
        message="Moderation console requires Owner, Admin, or Moderator clearance."
        requiredRole="Owner / Admin / Moderator"
      />
    );
  }

  const [stats, reports] = await Promise.all([
    getModerationStats(),
    getReports(),
  ]);

  return (
    <PageShell variant="dashboard" scanlines>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Moderation</h1>
        <RoleBadge role={getHighestRole(mod.user.roles)} />
      </div>
      <ModerationNav active="/moderation" />
      <div className="mb-6">
        <Link href="/admin/archivist">
          <CommandButton size="sm" variant="outline">
            Archivist Action Feed
          </CommandButton>
        </Link>
      </div>

      <div className="mb-8 hw-dashboard-grid">
        <AdminCard title="Open" status={stats.open > 0 ? "degraded" : "online"}>
          <p className="font-mono text-2xl text-primary">{stats.open}</p>
        </AdminCard>
        <AdminCard title="Reviewing" status="online">
          <p className="font-mono text-2xl text-primary">{stats.reviewing}</p>
        </AdminCard>
        <AdminCard title="Resolved" status="online">
          <p className="font-mono text-2xl text-primary">{stats.resolved}</p>
        </AdminCard>
        <AdminCard title="Dismissed" status="online">
          <p className="font-mono text-2xl text-primary">{stats.dismissed}</p>
        </AdminCard>
        <AdminCard title="Notes" status="online">
          <p className="font-mono text-2xl text-primary">{stats.notes}</p>
        </AdminCard>
      </div>

      <TerminalPanel title="report.latest">
        {reports.slice(0, 5).map((r) => (
          <div key={r.id} className="flex justify-between border-b border-border/30 py-2 font-mono text-xs">
            <Link href={`/moderation/reports/${r.id}`} className="text-primary hover:underline">
              {r.targetType}:{r.targetId.slice(0, 8)}…
            </Link>
            <span className="text-muted-foreground">{r.status}</span>
          </div>
        ))}
        <Link href="/moderation/reports" className="mt-4 inline-block">
          <CommandButton size="sm">All Reports</CommandButton>
        </Link>
      </TerminalPanel>
    </PageShell>
  );
}
