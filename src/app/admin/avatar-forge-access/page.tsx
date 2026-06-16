import Link from "next/link";
import { AdminAvatarForgeAccessPanel } from "@/components/admin/AdminAvatarForgeAccessPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { isAvatarForgeConfigured } from "@/lib/avatar-forge/config";
import { listAvatarForgeAccessRequests } from "@/lib/queries/avatar-forge-access";
import { getHighestRole, isAdmin, isOwner } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Avatar Forge Access Requests" };

export default async function AdminAvatarForgeAccessPage() {
  const user = await getSessionUser();
  if (!user) {
    return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  }
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Avatar Forge access review requires Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const [pending, approved, rejected] = await Promise.all([
    listAvatarForgeAccessRequests("PENDING"),
    listAvatarForgeAccessRequests("APPROVED"),
    listAvatarForgeAccessRequests("REJECTED"),
  ]);

  const owner = isOwner(user.roles);
  const configured = isAvatarForgeConfigured();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Avatar Forge Access Requests</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Approve only operatives who should receive the private GPT relay.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin">
            <CommandButton size="sm" variant="outline">
              ← Admin
            </CommandButton>
          </Link>
        </div>
      </div>

      {!configured && (
        <p className="mb-6 font-mono text-xs text-destructive">
          AVATAR_FORGE_GPT_URL is not set on this server. Link reveal will fail until configured.
        </p>
      )}

      <TerminalPanel title="forge.requests.pending" className="mb-6">
        <AdminAvatarForgeAccessPanel requests={pending} isOwner={owner} />
      </TerminalPanel>

      <TerminalPanel title="forge.requests.approved" className="mb-6">
        <AdminAvatarForgeAccessPanel requests={approved} isOwner={owner} />
      </TerminalPanel>

      <TerminalPanel title="forge.requests.rejected">
        <AdminAvatarForgeAccessPanel requests={rejected} isOwner={owner} />
      </TerminalPanel>
    </div>
  );
}
