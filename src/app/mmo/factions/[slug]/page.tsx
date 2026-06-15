import { notFound } from "next/navigation";
import Link from "next/link";
import { getAlliance, getFactionBySlug, getUserFactionMembership } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";
import { MmoNav } from "@/components/mmo/MmoNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { FactionDetailClient } from "./FactionDetailClient";

export const metadata = { title: "Faction" };

export default async function FactionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAuth();
  const { slug } = await params;

  if (slug === "chthonic-uprising") {
    const alliance = await getAlliance();
    if (!alliance) notFound();
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <MmoNav active="/mmo/factions" />
        <TerminalPanel title={`alliance.${alliance.slug}`}>
          <h1 className="font-mono text-2xl tracking-widest uppercase text-primary">
            {alliance.name}
          </h1>
          {alliance.tagline && (
            <p className="mt-2 font-mono text-xs italic text-muted-foreground">
              &ldquo;{alliance.tagline}&rdquo;
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{alliance.description}</p>
          {alliance.leaderLore && (
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">{alliance.leaderLore}</p>
          )}
          {alliance.symbol && (
            <p className="mt-4 text-sm text-foreground/70">{alliance.symbol}</p>
          )}
        </TerminalPanel>
        <TerminalPanel title="alliance.cells" className="mt-6">
          <div className="space-y-2">
            {alliance.cells.map((cell) => (
              <Link
                key={cell.id}
                href={`/mmo/factions/${cell.slug}`}
                className="block font-mono text-sm text-primary hover:underline"
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
      </div>
    );
  }

  const faction = await getFactionBySlug(slug);
  if (!faction) notFound();

  const membership = await getUserFactionMembership(user.id, faction.id);

  return <FactionDetailClient faction={faction} membershipStatus={membership?.status ?? null} />;
}
