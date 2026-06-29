import Link from "next/link";
import { ChthonicAlliancePanel } from "@/components/admin/ChthonicAlliancePanel";
import { ChthonicCommandPanel } from "@/components/admin/ChthonicCommandPanel";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { AdminShell } from "@/components/layout/AdminShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getChthonicAllianceMembers } from "@/lib/actions/chthonic-alliance";
import { getChthonicCommandData } from "@/lib/actions/chthonic-command";
import { writeAuditLog } from "@/lib/audit";
import { ARCHIVIST_LORE } from "@/lib/factions/chthonic-data";
import { getHighestRole, isAdmin, isOwner } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Chthonic Command" };

export default async function ChthonicCommandPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <AccessDenied
        title="Authentication Required"
        message="Chthonic Command requires authentication."
      />
    );
  }

  if (!isAdmin(user.roles)) {
    await writeAuditLog({
      action: "access.denied.admin",
      actorId: user.id,
      metadata: { route: "/admin/factions/command" },
    });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Chthonic Command requires Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const [data, allianceData] = await Promise.all([
    getChthonicCommandData(),
    getChthonicAllianceMembers(),
  ]);
  const ownerView = isOwner(user.roles);

  return (
    <AdminShell>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-primary/80 uppercase">
            {ownerView ? "Chthonic Overlord Access" : "Faction Command — Admin View"}
          </p>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Chthonic Command</h1>
          <p className="mt-2 hw-readable-wide text-sm text-muted-foreground">
            Overlord access for the Archivist — monitor, assign, and govern the five cells of
            the Chthonic Uprising.
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

      {ownerView && (
        <TerminalPanel
          title="archivist.sovereign"
          className="mb-8 border-primary/25 bg-gradient-to-r from-primary/5 to-transparent"
        >
          <p className="font-mono text-xs text-primary">
            {ARCHIVIST_LORE.operationalName} — {ARCHIVIST_LORE.titles[0]}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {ARCHIVIST_LORE.summary}
          </p>
          <p className="mt-2 text-sm italic text-foreground/70">{ARCHIVIST_LORE.doctrine}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {ARCHIVIST_LORE.titles.map((t) => (
              <span
                key={t}
                className="rounded border border-primary/30 px-2 py-0.5 font-mono text-[10px] text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </TerminalPanel>
      )}

      <ChthonicCommandPanel data={data} isOwner={ownerView} />
      {allianceData && (
        <div className="mt-8">
          <ChthonicAlliancePanel
            members={allianceData.members}
            assignableUsers={allianceData.assignableUsers}
            isOwner={allianceData.isOwner}
          />
        </div>
      )}
    </AdminShell>
  );
}
