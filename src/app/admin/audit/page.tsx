import Link from "next/link";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getAuditLogs } from "@/lib/actions/phase4";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Audit Logs" };

const FILTERS = ["", "auth.", "moderation.", "mission.", "user.", "invite."];

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; targetType?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return <AccessDenied title="Clearance Insufficient" message="Audit logs require Owner or Admin clearance." requiredRole="Owner / Admin" />;
  }

  const params = await searchParams;
  const logs = await getAuditLogs({
    action: params.action || undefined,
    targetType: params.targetType || undefined,
    limit: 100,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">Audit Logs</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin"><CommandButton size="sm" variant="outline">← Admin</CommandButton></Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 font-mono text-xs">
        {FILTERS.map((f) => (
          <Link
            key={f || "all"}
            href={f ? `/admin/audit?action=${f}` : "/admin/audit"}
            className="rounded border border-border px-2 py-1 hover:text-primary"
          >
            {f || "All"}
          </Link>
        ))}
      </div>

      <TerminalPanel title="audit.filtered">
        <div className="space-y-1 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="flex justify-between border-b border-border/30 py-1">
              <span>
                <span className="text-primary">{log.action}</span>
                {log.targetType && <span className="text-muted-foreground"> · {log.targetType}</span>}
              </span>
              <span className="text-muted-foreground">
                {log.actor?.email ?? "system"} — {log.createdAt.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}
