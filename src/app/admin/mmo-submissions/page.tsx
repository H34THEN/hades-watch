import Link from "next/link";
import { AdminMmoSubmissionsPanel } from "@/components/admin/AdminMmoSubmissionsPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getHighestRole, isModerator } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { getPendingMmoSubmissions } from "@/lib/queries/text-mmo";

export const metadata = { title: "Admin MMO Submissions" };
export const dynamic = "force-dynamic";

export default async function AdminMmoSubmissionsPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <AccessDenied title="Authentication Required" message="Moderator console requires authentication." />
    );
  }
  if (!isModerator(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="MMO Dead Drop review requires Moderator, Admin, or Owner clearance."
        requiredRole="Moderator+"
      />
    );
  }

  const submissions = await getPendingMmoSubmissions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-3xl tracking-widest uppercase">MMO Dead Drop Review</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin">
            <CommandButton size="sm" variant="outline">
              ← Admin
            </CommandButton>
          </Link>
        </div>
      </div>

      <TerminalPanel title="mmo.submissions.pending">
        <AdminMmoSubmissionsPanel submissions={submissions} />
      </TerminalPanel>
    </div>
  );
}
