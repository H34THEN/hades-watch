import Link from "next/link";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { MmoNav } from "@/components/mmo/MmoNav";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getAvailableQuests, getFactions, getUserActiveMissions, getUserCharacter } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "MMO Hub" };

export default async function MmoPage() {
  const user = await requireAuth();
  const [character, factions, missions, activeMissions] = await Promise.all([
    getUserCharacter(user.id),
    getFactions(),
    getAvailableQuests(),
    getUserActiveMissions(user.id),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Field Ops</h1>
      <MmoNav active="/mmo" />

      <TerminalPanel title="operative.character" className="mb-8">
        {character ? (
          <div className="font-mono text-sm">
            <p className="text-lg text-primary">{character.callsign}</p>
            <p className="text-muted-foreground">{character.archetype ?? "Unclassified"} · {character.faction?.name ?? "Unaffiliated"}</p>
            <Link href="/mmo/character" className="mt-4 inline-block">
              <CommandButton size="sm">Edit Character</CommandButton>
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground">No operative record initialized.</p>
            <Link href="/mmo/character" className="mt-4 inline-block">
              <CommandButton size="sm">Create Character</CommandButton>
            </Link>
          </div>
        )}
      </TerminalPanel>

      {activeMissions.length > 0 && (
        <TerminalPanel title="mission.active" className="mb-8">
          {activeMissions.map((p) => (
            <Link key={p.id} href={`/mmo/missions/${p.quest.slug}`} className="block py-2 font-mono text-sm text-primary hover:underline">
              {p.quest.title} · {p.status}
            </Link>
          ))}
        </TerminalPanel>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard title="Faction Dossiers" description={`${factions.length} Chthonic cells`} icon={<span>◈</span>}>
          <Link href="/mmo/factions"><CommandButton size="sm">View Dossiers</CommandButton></Link>
        </DashboardCard>
        <DashboardCard title="Missions" description={`${missions.length} available`} icon={<span>⚔</span>}>
          <Link href="/mmo/missions"><CommandButton size="sm">View Missions</CommandButton></Link>
        </DashboardCard>
        <DashboardCard title="Archive" description="Lore and unlocks" icon={<span>◫</span>}>
          <Link href="/archive"><CommandButton size="sm">Enter Archive</CommandButton></Link>
        </DashboardCard>
      </div>
    </div>
  );
}
