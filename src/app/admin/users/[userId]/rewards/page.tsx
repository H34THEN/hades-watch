import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminRewardGrantForm } from "@/components/admin/AdminRewardGrantForm";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { writeAuditLog } from "@/lib/audit";
import { getAdminUsers } from "@/lib/actions/phase4";
import { getHighestRole, isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { getUserRewardSummary } from "@/lib/rewards/grants";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { userId } = await params;
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { character: { select: { callsign: true } }, email: true },
  });
  return { title: u ? `Rewards // ${u.character?.callsign ?? u.email}` : "User Rewards" };
}

export default async function AdminUserRewardsPage({ params }: PageProps) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return <AccessDenied title="Authentication Required" message="Admin console requires authentication." />;
  }
  if (!isAdmin(sessionUser.roles)) {
    await writeAuditLog({ action: "access.denied.admin", actorId: sessionUser.id });
    return (
      <AccessDenied
        title="Clearance Insufficient"
        message="User reward management requires Owner or Admin clearance."
        requiredRole="Owner / Admin"
      />
    );
  }

  const { userId } = await params;
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      activeTitle: true,
      character: { select: { callsign: true } },
    },
  });
  if (!target) notFound();

  const [summary, allUsers] = await Promise.all([getUserRewardSummary(userId), getAdminUsers()]);
  const userOptions = allUsers.map((u) => ({
    id: u.id,
    label: u.character?.callsign ?? u.name ?? u.email,
  }));

  const label = target.character?.callsign ?? target.name ?? target.email;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl tracking-widest uppercase">Rewards // {label}</h1>
          {target.activeTitle && (
            <p className="mt-1 font-mono text-xs text-primary">Active title: {target.activeTitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <RoleBadge role={getHighestRole(sessionUser.roles)} />
          <Link href="/admin/rewards">
            <CommandButton size="sm" variant="outline">
              ← Rewards
            </CommandButton>
          </Link>
        </div>
      </div>

      <TerminalPanel title="rewards.summary" className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 font-mono text-xs">
          <p>Badges: {summary.badges.length}</p>
          <p>Loot: {summary.loot.length}</p>
          <p>Avatar unlocks: {summary.avatarUnlocks.length}</p>
          <p>Titles: {summary.titles.length}</p>
          <p>Lore unlocks: {summary.lore.length}</p>
          <p>Reputation events: {summary.reputation.length}</p>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          {summary.badges.slice(0, 8).map((b) => (
            <li key={b.id}>Badge: {b.badge.name}</li>
          ))}
          {summary.avatarUnlocks.slice(0, 8).map((a) => (
            <li key={a.id}>Avatar: {a.asset.name} ({a.asset.category.replace(/_/g, " ")})</li>
          ))}
        </ul>
      </TerminalPanel>

      <TerminalPanel title="rewards.grant_user">
        <AdminRewardGrantForm users={userOptions} defaultRecipientId={userId} />
      </TerminalPanel>
    </div>
  );
}
