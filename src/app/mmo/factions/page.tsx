import Link from "next/link";
import { MmoNav } from "@/components/mmo/MmoNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getAlliance, getFactions } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Factions" };

export default async function FactionsPage() {
  await requireAuth();
  const [factions, alliance] = await Promise.all([getFactions(), getAlliance()]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Factions</h1>
      <MmoNav active="/mmo/factions" />

      {alliance && (
        <TerminalPanel title={`alliance.${alliance.slug}`} className="mb-6">
          <h2 className="font-mono text-lg tracking-widest uppercase text-primary">
            {alliance.name}
          </h2>
          {alliance.tagline && (
            <p className="mt-2 font-mono text-xs italic text-muted-foreground">
              &ldquo;{alliance.tagline}&rdquo;
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {alliance.description}
          </p>
          {alliance.leaderName && (
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              Led by {alliance.leaderName}
              {alliance.leaderTitle ? ` — ${alliance.leaderTitle}` : ""}
            </p>
          )}
          {alliance.motto && (
            <p className="mt-2 font-mono text-[10px] tracking-wider text-primary/80 uppercase">
              {alliance.motto}
            </p>
          )}
        </TerminalPanel>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {factions.map((f) => {
          const palette = (f.palette as Record<string, string> | null) ?? {};
          const accent = Object.values(palette)[0];
          return (
            <Link key={f.id} href={`/mmo/factions/${f.slug}`}>
              <TerminalPanel title={`faction.${f.slug}`}>
                <h3
                  className="font-mono text-sm font-semibold uppercase"
                  style={accent ? { color: accent } : undefined}
                >
                  {f.name}
                </h3>
                {f.tagline && (
                  <p className="mt-1 font-mono text-[10px] italic text-muted-foreground line-clamp-1">
                    {f.tagline}
                  </p>
                )}
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{f.description}</p>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                  {f._count.characters} operatives · {f._count.memberships} members
                </p>
              </TerminalPanel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
