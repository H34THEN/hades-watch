import Link from "next/link";
import { FactionCellCard } from "@/components/factions/FactionCellCard";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import { ARCHIVE_LEADER_INDEX } from "@/lib/archive/character-lore-slugs";
import { CHTHONIC_FACTIONS } from "@/lib/factions/chthonic-data";
import {
  BEFORE_THE_DESCENT_SUMMARY,
  DEAD_INDEX_OPENING_EXCERPT,
  FOUNDING_CELLS_SUMMARY,
  ORIGIN_LORE_SLUG,
  UPRISING_TIMELINE,
  WHAT_WE_FIGHT_FOR_EXCERPT,
} from "@/lib/factions/origin-dossier";
import type { ResolvedAlliance } from "@/lib/factions/resolve";

interface AllianceOriginDossierProps {
  alliance: ResolvedAlliance;
  showAdminLink?: boolean;
}

export function AllianceOriginDossier({
  alliance,
  showAdminLink = false,
}: AllianceOriginDossierProps) {
  const cellBySlug = Object.fromEntries(alliance.cells.map((c) => [c.slug, c]));

  return (
    <div className="space-y-6">
      <TerminalPanel
        title="dead_index.opening"
        className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5"
      >
        <p className="font-mono text-[10px] tracking-[0.3em] text-primary/70 uppercase">
          Dead Index Entry CH-0001 · Recovered Testimony
        </p>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Speaker: Heathen · Aliases: The Archivist, Slewfoot · Integrity: 87%
        </p>
        <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/85 italic">
          {DEAD_INDEX_OPENING_EXCERPT}
        </div>
        <Link href={`/archive/factions/${ORIGIN_LORE_SLUG}`} className="mt-4 inline-block">
          <CommandButton size="sm" variant="outline">
            Read Full Origin in Archive
          </CommandButton>
        </Link>
        <Link href="/archive/characters" className="mt-4 ml-2 inline-block">
          <CommandButton size="sm" variant="outline">
            Leader Dossiers
          </CommandButton>
        </Link>
      </TerminalPanel>

      <TerminalPanel title="origin.before_descent">
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
          {BEFORE_THE_DESCENT_SUMMARY}
        </p>
      </TerminalPanel>

      <TerminalPanel title="origin.founding_cells">
        <p className="mb-4 text-xs text-muted-foreground">
          Five founding cells. Each born from a different wound in the Surface Order.
        </p>
        <div className="space-y-4">
          {FOUNDING_CELLS_SUMMARY.map((cell) => {
            const factionData = CHTHONIC_FACTIONS.find((f) => f.slug === cell.slug);
            const resolved = cellBySlug[cell.slug];
            return (
              <div
                key={cell.slug}
                className="rounded border border-border/40 p-4"
                style={
                  factionData?.palette
                    ? { borderColor: `${Object.values(factionData.palette)[0]}44` }
                    : undefined
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-mono text-sm font-semibold uppercase text-primary">
                      {factionData?.name ?? cell.slug}
                    </h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">
                      {cell.function}
                    </p>
                  </div>
                  <Link href={`/mmo/factions/${cell.slug}`}>
                    <CommandButton size="sm" variant="outline">
                      Cell Dossier
                    </CommandButton>
                  </Link>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {cell.summary}
                </p>
                {resolved?.tagline && (
                  <p className="mt-2 font-mono text-[10px] italic text-muted-foreground">
                    &ldquo;{resolved.tagline}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </TerminalPanel>

      <TerminalPanel title="origin.timeline">
        <ol className="space-y-3 font-mono text-xs">
          {UPRISING_TIMELINE.map((item) => (
            <li key={`${item.year}-${item.event.slice(0, 24)}`} className="flex gap-3">
              <span className="shrink-0 text-primary">{item.year}</span>
              <span className="text-foreground/80">{item.event}</span>
            </li>
          ))}
        </ol>
      </TerminalPanel>

      <TerminalPanel title="origin.what_we_fight_for">
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
          {WHAT_WE_FIGHT_FOR_EXCERPT}
        </p>
      </TerminalPanel>

      <TerminalPanel title="origin.leaders" className="border-primary/20">
        <p className="mb-4 text-sm text-muted-foreground">
          Six founding leaders. Each dossier is a Dead Index record in Character Lore.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {ARCHIVE_LEADER_INDEX.map((leader) => (
            <Link
              key={leader.slug}
              href={`/archive/characters/${leader.slug}`}
              className="rounded border border-border/40 p-3 hover:border-primary/40"
            >
              <p className="font-mono text-sm font-semibold uppercase text-primary">{leader.title}</p>
              <p className="font-mono text-[10px] text-emerald-500/70">{leader.deadIndexId}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{leader.faction}</p>
            </Link>
          ))}
        </div>
      </TerminalPanel>

      <div>
        <h2 className="mb-3 font-mono text-sm tracking-widest text-primary uppercase">
          Five Founding Cells
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {alliance.cells.map((cell) => (
            <FactionCellCard key={cell.slug} faction={cell} />
          ))}
        </div>
      </div>

      {showAdminLink && (
        <Link href="/admin/factions/command">
          <CommandButton>Chthonic Command</CommandButton>
        </Link>
      )}
    </div>
  );
}
