import Link from "next/link";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Mission Reward Mappings" };
export const dynamic = "force-dynamic";

export default async function AdminMissionRewardPoolsPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.roles)) {
    if (user) await writeAuditLog({ action: "access.denied.admin", actorId: user.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="Mission reward mappings require Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const mappings = await prisma.rewardMapping.findMany({
    where: { sourceType: "mission", isActive: true },
    orderBy: [{ sourceSlug: "asc" }, { rewardType: "asc" }],
  });

  const byMission = mappings.reduce<Record<string, typeof mappings>>((acc, m) => {
    (acc[m.sourceSlug] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-mono text-2xl tracking-widest uppercase">Mission Reward Mappings</h1>
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
        {Object.entries(byMission).map(([slug, items]) => (
          <TerminalPanel key={slug} title={`mission.${slug}`}>
            <ul className="space-y-1 font-mono text-xs">
              {items.map((item) => (
                <li key={item.id}>
                  {item.rewardType.replace(/_/g, " ")} · {item.rewardSlug}
                  {item.reviewRequired ? " · review required" : ""}
                </li>
              ))}
            </ul>
            {items[0]?.adminNotes && (
              <p className="mt-3 font-mono text-[10px] text-muted-foreground">{items[0].adminNotes}</p>
            )}
          </TerminalPanel>
        ))}
      </div>
    </div>
  );
}
