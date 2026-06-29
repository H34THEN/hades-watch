import Link from "next/link";
import { AdminRewardGrantForm } from "@/components/admin/AdminRewardGrantForm";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getAdminUsers } from "@/lib/actions/phase4";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Grant Rewards // Dead Index" };
export const dynamic = "force-dynamic";

export default async function AdminRewardsGrantPage() {
  const user = await getSessionUser();
  if (!user) {
    return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  }
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Reward grants require Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const users = await getAdminUsers();
  const userOptions = users.map((u) => ({
    id: u.id,
    label: u.character?.callsign ?? u.name ?? u.email,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-2xl tracking-widest uppercase">Grant // Dead Index</h1>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin/rewards">
            <CommandButton size="sm" variant="outline">
              ← Rewards
            </CommandButton>
          </Link>
        </div>
      </div>

      <TerminalPanel title="rewards.manual_grant">
        <p className="mb-6 text-sm text-muted-foreground">
          Owner may grant any reward to any user, including self, for testing and canon recognition.
          Chthonic Uprising marks and Dead Index Witness remain Owner-controlled.
        </p>
        <AdminRewardGrantForm users={userOptions} defaultRecipientId={user.id} />
      </TerminalPanel>
    </div>
  );
}
