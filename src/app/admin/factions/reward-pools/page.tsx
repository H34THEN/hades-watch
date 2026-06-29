import Link from "next/link";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Faction Reward Pools" };
export const dynamic = "force-dynamic";

export default async function AdminFactionRewardPoolsPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.roles)) {
    if (user) await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Faction reward pools require Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const pools = await prisma.rewardPool.findMany({
    where: { poolType: "faction_mission", isActive: true },
    orderBy: { name: "asc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl tracking-widest uppercase">Faction Reward Pools</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Faction leaders may only select from approved pools. Chthonic Uprising marks and Dead Index Witness
            are Owner-controlled and excluded.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(user.roles)} />
          <Link href="/admin/rewards">
            <CommandButton size="sm" variant="outline">
              ← Rewards
            </CommandButton>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {pools.map((pool) => (
          <TerminalPanel key={pool.id} title={`pool.${pool.slug}`}>
            <p className="font-mono text-sm uppercase text-primary">{pool.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{pool.description}</p>
            {pool.adminNotes && (
              <p className="mt-2 font-mono text-[10px] text-amber-500/80">{pool.adminNotes}</p>
            )}
            <ul className="mt-4 space-y-1 font-mono text-xs">
              {pool.items.map((item) => (
                <li key={item.id}>
                  {item.rewardType.replace(/_/g, " ")} · {item.rewardSlug}
                  {item.notes ? ` · ${item.notes}` : ""}
                </li>
              ))}
            </ul>
          </TerminalPanel>
        ))}
      </div>
    </div>
  );
}
