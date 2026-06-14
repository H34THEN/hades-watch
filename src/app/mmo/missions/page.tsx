import Link from "next/link";
import { MmoNav } from "@/components/mmo/MmoNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getAvailableQuests } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Missions" };

export default async function MissionsPage() {
  await requireAuth();
  const missions = await getAvailableQuests();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Missions</h1>
      <MmoNav active="/mmo/missions" />
      <div className="space-y-4">
        {missions.map((m) => (
          <Link key={m.id} href={`/mmo/missions/${m.slug}`}>
            <TerminalPanel title={`mission.${m.slug}`}>
              <h3 className="font-mono text-sm font-semibold uppercase">{m.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.description}</p>
              {m.faction && (
                <p className="mt-2 font-mono text-[10px] text-primary">{m.faction.name}</p>
              )}
            </TerminalPanel>
          </Link>
        ))}
      </div>
    </div>
  );
}
