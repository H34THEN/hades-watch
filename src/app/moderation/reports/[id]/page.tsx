import { AccessDenied } from "@/components/layout/AccessDenied";
import { ModerationNav } from "@/components/moderation/ModerationNav";
import { ReportDetailActions } from "@/components/moderation/ReportDetailActions";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getModerators, getReportById } from "@/lib/actions/moderation";
import { requireModeratorUser } from "@/lib/auth/guards";
import { notFound } from "next/navigation";

export const metadata = { title: "Report Detail" };

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const mod = await requireModeratorUser();
  if (!mod.ok) {
    return <AccessDenied title="Access Denied" message="Moderation clearance required." />;
  }

  const { id } = await params;
  const [report, moderators] = await Promise.all([
    getReportById(id),
    getModerators(),
  ]);

  if (!report) notFound();

  const targetUserId = report.targetType === "user" ? report.targetId : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Report Detail</h1>
      <ModerationNav active="/moderation/reports" />

      <TerminalPanel title={`report.${report.status.toLowerCase()}`} className="mb-6">
        <dl className="space-y-3 font-mono text-sm">
          <div><dt className="text-muted-foreground">TARGET</dt><dd>{report.targetType}:{report.targetId}</dd></div>
          <div><dt className="text-muted-foreground">REASON</dt><dd className="whitespace-pre-wrap">{report.reason}</dd></div>
          <div><dt className="text-muted-foreground">REPORTER</dt><dd>{report.reporter?.email ?? "system"}</dd></div>
          <div><dt className="text-muted-foreground">ASSIGNED</dt><dd>{report.assignedTo?.email ?? "unassigned"}</dd></div>
          {report.resolutionNote && (
            <div><dt className="text-muted-foreground">RESOLUTION</dt><dd>{report.resolutionNote}</dd></div>
          )}
        </dl>
      </TerminalPanel>

      <TerminalPanel title="report.actions">
        <ReportDetailActions
          reportId={report.id}
          currentStatus={report.status}
          assignedToId={report.assignedToId}
          moderators={moderators}
          targetUserId={targetUserId}
        />
      </TerminalPanel>
    </div>
  );
}
