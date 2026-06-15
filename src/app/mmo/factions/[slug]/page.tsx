import { notFound } from "next/navigation";
import Link from "next/link";
import { getAlliance, getFactionBySlug, getUserFactionMembership } from "@/lib/actions/mmo";
import { getSessionUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/roles";
import { MmoNav } from "@/components/mmo/MmoNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import { FactionDetailClient } from "./FactionDetailClient";

export const metadata = { title: "Faction" };

export default async function FactionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getSessionUser();
  const { slug } = await params;

  if (slug === "chthonic-uprising") {
    const alliance = await getAlliance();
    if (!alliance) notFound();
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <MmoNav active="/mmo/factions" />
        <TerminalPanel title={`alliance.${alliance.slug}`}>
          <p className="font-mono text-[10px] tracking-[0.3em] text-primary/70 uppercase">
            Parent Alliance — Classified
          </p>
          <h1 className="mt-2 font-mono text-2xl tracking-widest uppercase text-primary">
            {alliance.name}
          </h1>
          {alliance.tagline && (
            <p className="mt-2 font-mono text-xs italic text-muted-foreground">
              &ldquo;{alliance.tagline}&rdquo;
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{alliance.description}</p>

          <div className="mt-6 rounded border border-primary/20 bg-primary/5 p-4">
            <p className="font-mono text-[10px] tracking-wider text-primary uppercase">
              {alliance.archivistLore.operationalName} — The Archivist
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {alliance.archivistLore.summary}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70 italic">
              {alliance.archivistLore.doctrine}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {alliance.archivistLore.titles.map((t) => (
                <span
                  key={t}
                  className="rounded border border-primary/30 px-2 py-0.5 font-mono text-[10px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {alliance.leaderLore && (
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">{alliance.leaderLore}</p>
          )}
          {alliance.symbol && (
            <p className="mt-4 font-mono text-xs text-muted-foreground">◈ {alliance.symbol}</p>
          )}
          {alliance.dataSource === "canonical" && (
            <p className="mt-4 font-mono text-[10px] text-amber-400">
              Canonical lore fallback — seed factions on server for live membership data.
            </p>
          )}
        </TerminalPanel>
        <TerminalPanel title="alliance.cells" className="mt-6">
          <div className="space-y-2">
            {alliance.cells.map((cell) => (
              <Link
                key={cell.slug}
                href={`/mmo/factions/${cell.slug}`}
                className="block rounded border border-border/30 px-3 py-2 font-mono text-sm text-primary hover:border-primary/40 hover:bg-primary/5"
              >
                {cell.name}
                {cell.tagline && (
                  <span className="ml-2 text-xs text-muted-foreground italic">
                    — {cell.tagline}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </TerminalPanel>
        {user && isAdmin(user.roles) && (
          <Link href="/admin/factions/command" className="mt-6 inline-block">
            <CommandButton>Chthonic Command</CommandButton>
          </Link>
        )}
      </div>
    );
  }

  const faction = await getFactionBySlug(slug);
  if (!faction) notFound();

  const membership =
    user && faction.id
      ? await getUserFactionMembership(user.id, faction.id)
      : null;

  return (
    <FactionDetailClient
      faction={faction}
      membershipStatus={membership?.status ?? null}
      isAdmin={user ? isAdmin(user.roles) : false}
      canRequestJoin={!!faction.id && !!user}
    />
  );
}
