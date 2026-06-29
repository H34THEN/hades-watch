import Link from "next/link";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Reward Console // Dead Index Grants" };
export const dynamic = "force-dynamic";

export default async function AdminRewardsPage() {
  const user = await getSessionUser();
  if (!user) {
    return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  }
  if (!isAdmin(user.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Reward console requires Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const isOwner = user.roles.includes("Owner");
  const [recentAudits, poolCount, mappingCount] = await Promise.all([
    prisma.adminRewardGrantAudit.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: {
        actor: { select: { name: true, email: true } },
        recipient: { select: { name: true, email: true, character: { select: { callsign: true } } } },
      },
    }),
    prisma.rewardPool.count({ where: { isActive: true } }),
    prisma.rewardMapping.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">
            {isOwner ? "Owner Reward Console // Dead Index Grants" : "Reward Console // Dead Index Grants"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-amber-500/90">
            Manual grants affect player progression and public recognition. Record a clear reason before
            assigning rewards.
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

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <TerminalPanel title="rewards.grant">
          <p className="mb-4 text-sm text-muted-foreground">Manually grant badges, loot, titles, avatar unlocks, and reputation.</p>
          <Link href="/admin/rewards/grant">
            <CommandButton size="sm">Open Grant Console</CommandButton>
          </Link>
        </TerminalPanel>
        <TerminalPanel title="rewards.pools">
          <p className="font-mono text-2xl text-primary">{poolCount}</p>
          <p className="text-sm text-muted-foreground">Active faction reward pools</p>
          <Link href="/admin/factions/reward-pools" className="mt-4 inline-block">
            <CommandButton size="sm" variant="outline">
              Faction Pools
            </CommandButton>
          </Link>
        </TerminalPanel>
        <TerminalPanel title="rewards.mappings">
          <p className="font-mono text-2xl text-primary">{mappingCount}</p>
          <p className="text-sm text-muted-foreground">Seeded reward mappings</p>
          <Link href="/admin/missions/reward-pools" className="mt-4 inline-block">
            <CommandButton size="sm" variant="outline">
              Mission Mappings
            </CommandButton>
          </Link>
        </TerminalPanel>
      </div>

      <TerminalPanel title="rewards.audit.recent">
        {recentAudits.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No manual grants recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {recentAudits.map((a) => (
              <div key={a.id} className="border-b border-border/30 py-2 last:border-0">
                <p className="font-mono text-xs uppercase text-primary">
                  {a.action} · {a.grantType} · {a.grantSlug}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {a.recipient.character?.callsign ?? a.recipient.email} · by {a.actor.name ?? a.actor.email} ·{" "}
                  {new Date(a.createdAt).toLocaleString()} · {a.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </TerminalPanel>
    </div>
  );
}
