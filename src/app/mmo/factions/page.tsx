import Link from "next/link";
import { MmoNav } from "@/components/mmo/MmoNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getFactions } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Factions" };

export default async function FactionsPage() {
  await requireAuth();
  const factions = await getFactions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Factions</h1>
      <MmoNav active="/mmo/factions" />
      <div className="grid gap-4 sm:grid-cols-2">
        {factions.map((f) => (
          <Link key={f.id} href={`/mmo/factions/${f.slug}`}>
            <TerminalPanel title={`faction.${f.slug}`}>
              <h3 className="font-mono text-sm font-semibold uppercase text-primary">{f.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{f.description}</p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                {f._count.characters} operatives · {f._count.memberships} members
              </p>
            </TerminalPanel>
          </Link>
        ))}
      </div>
    </div>
  );
}
