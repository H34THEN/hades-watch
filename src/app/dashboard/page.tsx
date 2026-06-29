import Link from "next/link";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { PageShell } from "@/components/layout/PageShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getUpcomingEvents } from "@/lib/actions/events";
import { getPublishedTransmissions } from "@/lib/actions/announcements";
import { getLoreForUser } from "@/lib/lore/queries";
import { getModerationStats } from "@/lib/actions/moderation";
import { getAvailableQuests, getUserCharacter } from "@/lib/actions/mmo";
import { getDeadDropsForUser } from "@/lib/actions/phase4";
import { getHighestRole, isAdmin, isModerator, isOwner } from "@/lib/auth/roles";
import { requireAuth } from "@/lib/auth/session";
import { getThemeById } from "@/lib/themes/registry";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireAuth();
  const primaryRole = getHighestRole(user.roles);
  const theme = user.themeId ? getThemeById(user.themeId) : null;
  const showMod = isModerator(user.roles);
  const showAdmin = isAdmin(user.roles);
  const showOwner = isOwner(user.roles);

  const [transmissions, upcomingEvents, character, missions, lore, deadDrops, modStats] =
    await Promise.all([
      getPublishedTransmissions(user.roles),
      getUpcomingEvents(user.roles, 3),
      getUserCharacter(user.id),
      getAvailableQuests(),
      getLoreForUser(user.id, user.roles),
      getDeadDropsForUser(user.roles),
      showMod ? getModerationStats() : null,
    ]);

  const readableLore = lore.filter((e) => e.canRead).length;
  const characterLore = lore.filter((e) => e.category === "CHARACTER_LORE");
  const readableCharacters = characterLore.filter((e) => e.canRead).length;
  const readableDrops = deadDrops.filter((d) => d.readable).length;

  return (
    <PageShell variant="dashboard" scanlines>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome, {user.name ?? user.email.split("@")[0]}.
          </p>
        </div>
        <RoleBadge role={primaryRole} />
      </div>

      <TerminalPanel title="operative.status" className="mb-8">
        <dl className="grid gap-3 font-mono text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">EMAIL</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">ROLES</dt>
            <dd className="flex flex-wrap gap-1">
              {user.roles.map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">THEME</dt>
            <dd>{theme?.name ?? "Default"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">STATUS</dt>
            <dd><StatusBadge status="online" /></dd>
          </div>
        </dl>
      </TerminalPanel>

      {showMod && modStats && modStats.open > 0 && (
        <TerminalPanel title="moderation.alert" className="mb-8">
          <p className="font-mono text-sm text-destructive">
            {modStats.open} open moderation report{modStats.open !== 1 ? "s" : ""} require attention.
          </p>
          <Link href="/moderation" className="mt-4 inline-block">
            <CommandButton size="sm">Open Moderation</CommandButton>
          </Link>
        </TerminalPanel>
      )}

      <div className="mb-8 hw-dashboard-grid">
        <DashboardCard title="Transmissions" description={`${transmissions.length} active broadcasts`} icon={<span>◎</span>}>
          <Link href="/dashboard/transmissions">
            <CommandButton size="sm">View Transmissions</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard title="Events" description={`${upcomingEvents.length} upcoming`} icon={<span>◷</span>}>
          <Link href="/dashboard/events">
            <CommandButton size="sm">View Events</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard title="Profile" description="Edit operative identity" icon={<span>◈</span>}>
          <Link href="/profile/dossier">
            <CommandButton size="sm">Open Profile</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard title="Themes" description="Switch visual identity" icon={<span>◇</span>}>
          <Link href="/themes">
            <CommandButton size="sm">Theme Registry</CommandButton>
          </Link>
        </DashboardCard>
      </div>

      <div className="mb-8 hw-dashboard-grid">
        <DashboardCard
          title="Character"
          description={character ? character.callsign : "No operative record"}
          icon={<span>▣</span>}
        >
          <Link href="/mmo/character">
            <CommandButton size="sm">{character ? "Edit" : "Create"}</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard
          title="Chthonic Uprising"
          description="Enter the five founding cells"
          icon={<span>☍</span>}
        >
          <Link href="/mmo/factions">
            <CommandButton size="sm">Enter the Chthonic Uprising</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard
          title="Faction"
          description={character?.faction?.name ?? "Unaffiliated"}
          icon={<span>◈</span>}
        >
          <Link href="/mmo/factions">
            <CommandButton size="sm">Faction Dossiers</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard title="Missions" description={`${missions.length} available`} icon={<span>⚔</span>}>
          <Link href="/mmo/missions">
            <CommandButton size="sm">View Missions</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard title="Archive" description={`${readableLore}/${lore.length} lore unlocked`} icon={<span>◫</span>}>
          <div className="flex flex-wrap gap-2">
            <Link href="/archive">
              <CommandButton size="sm">Archive Hub</CommandButton>
            </Link>
            <Link href="/archive/characters">
              <CommandButton size="sm" variant="outline">
                Character Lore ({readableCharacters})
              </CommandButton>
            </Link>
          </div>
        </DashboardCard>
        <DashboardCard title="Dead Drops" description={`${readableDrops} readable`} icon={<span>◇</span>}>
          <Link href="/dead-drops">
            <CommandButton size="sm">View Drops</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard title="Field Ops" description="MMO hub" icon={<span>⚙</span>}>
          <Link href="/mmo">
            <CommandButton size="sm">Open Hub</CommandButton>
          </Link>
        </DashboardCard>
      </div>

      {showAdmin && (
        <TerminalPanel title="admin.shortcuts" className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link href="/admin"><CommandButton size="sm">Admin Console</CommandButton></Link>
            <Link href="/admin/users"><CommandButton size="sm" variant="outline">Users</CommandButton></Link>
            <Link href="/admin/factions/command"><CommandButton size="sm" variant="outline">Faction Command</CommandButton></Link>
            <Link href="/admin/lore"><CommandButton size="sm" variant="outline">Lore</CommandButton></Link>
            <Link href="/admin/missions"><CommandButton size="sm" variant="outline">Missions</CommandButton></Link>
          </div>
        </TerminalPanel>
      )}

      {showOwner && (
        <TerminalPanel title="chthonic.overlord" className="mb-8 border-primary/20">
          <p className="mb-3 font-mono text-xs text-muted-foreground">
            Warden of the Five Cells — sovereign oversight of the Chthonic Uprising.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/factions/command">
              <CommandButton size="sm">Chthonic Command</CommandButton>
            </Link>
            <Link href="/admin/media">
              <CommandButton size="sm" variant="outline">
                Owner Signal Deck
              </CommandButton>
            </Link>
            <Link href="/admin/media/upload">
              <CommandButton size="sm" variant="outline">
                Upload Signal
              </CommandButton>
            </Link>
          </div>
          <p className="mt-3 font-mono text-[10px] text-muted-foreground">
            Upload and manage Chthonic broadcasts. Signal Player never autoplays.
          </p>
        </TerminalPanel>
      )}

      {transmissions.length > 0 && (
        <TerminalPanel title="transmission.latest" className="mb-8">
          <p className="font-mono text-sm text-primary">
            {transmissions[0].pinned ? "📌 " : ""}
            {transmissions[0].title}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {transmissions[0].body}
          </p>
        </TerminalPanel>
      )}

      {upcomingEvents.length > 0 && (
        <TerminalPanel title="event.upcoming">
          {upcomingEvents.map((ev) => (
            <div key={ev.id} className="border-b border-border/30 py-2 font-mono text-xs">
              <span className="text-primary">{ev.title}</span>
              <span className="ml-2 text-muted-foreground">
                {ev.startsAt.toLocaleString()}
              </span>
            </div>
          ))}
        </TerminalPanel>
      )}
    </PageShell>
  );
}
