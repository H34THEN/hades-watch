import Link from "next/link";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { ModerationNav } from "@/components/moderation/ModerationNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getReports } from "@/lib/actions/moderation";
import { requireModeratorUser } from "@/lib/auth/guards";

export const metadata = { title: "Moderation Reports" };

export default async function ModerationReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const mod = await requireModeratorUser();
  if (!mod.ok) {
    return <AccessDenied title="Access Denied" message="Moderation clearance required." requiredRole="Moderator+" />;
  }

  const params = await searchParams;
  const status = params.status as "Open" | "Reviewing" | "Resolved" | "Dismissed" | undefined;
  const reports = await getReports(status);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Reports</h1>
      <ModerationNav active="/moderation/reports" />

      <div className="mb-6 flex gap-2 font-mono text-xs">
        {["", "Open", "Reviewing", "Resolved", "Dismissed"].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/moderation/reports?status=${s}` : "/moderation/reports"}
            className="rounded border border-border px-2 py-1 hover:text-primary"
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <TerminalPanel title="report.queue">
        <div className="space-y-2 font-mono text-xs">
          {reports.map((r) => (
            <Link
              key={r.id}
              href={`/moderation/reports/${r.id}`}
              className="flex justify-between border-b border-border/30 py-2 hover:text-primary"
            >
              <span>{r.targetType} · {r.reason.slice(0, 60)}…</span>
              <span className="text-muted-foreground">{r.status}</span>
            </Link>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}
