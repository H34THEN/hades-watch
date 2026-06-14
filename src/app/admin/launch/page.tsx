import Link from "next/link";
import { AdminCard } from "@/components/cards/AdminCard";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getLaunchChecklist } from "@/lib/actions/launch";
import { getProductionSafetyIssues } from "@/lib/env";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Launch Checklist" };

export default async function AdminLaunchPage() {
  const user = await getSessionUser();
  if (!user) return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return <AccessDenied title="Clearance Insufficient" message="Launch checklist requires Owner or Admin clearance." requiredRole="Owner / Admin" />;
  }

  const [items, safetyIssues] = await Promise.all([
    getLaunchChecklist(),
    Promise.resolve(getProductionSafetyIssues()),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Launch Checklist</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin"><CommandButton size="sm" variant="outline">← Admin</CommandButton></Link>
        </div>
      </div>

      {safetyIssues.length > 0 && (
        <TerminalPanel title="safety.warnings" className="mb-8">
          {safetyIssues.map((issue) => (
            <p key={issue.code} className={`font-mono text-xs ${issue.level === "error" ? "text-destructive" : "text-muted-foreground"}`}>
              [{issue.level.toUpperCase()}] {issue.message}
            </p>
          ))}
        </TerminalPanel>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <AdminCard
            key={item.id}
            title={item.label}
            status={item.status === "ok" ? "online" : item.status === "error" ? "degraded" : "locked"}
            description={item.detail}
          />
        ))}
      </div>

      <TerminalPanel title="launch.docs" className="mt-8">
        <p className="font-mono text-xs text-muted-foreground">
          See docs/LAUNCH_CHECKLIST.md, docs/VPS_RUNBOOK.md, docs/BACKUPS.md, and docs/DEPLOYMENT.md before deploying to hadeswatch.com.
        </p>
      </TerminalPanel>
    </div>
  );
}
