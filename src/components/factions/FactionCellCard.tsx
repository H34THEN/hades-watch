import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import type { ResolvedFactionListItem } from "@/lib/factions/resolve";

interface FactionCellCardProps {
  faction: ResolvedFactionListItem;
}

export function FactionCellCard({ faction }: FactionCellCardProps) {
  const accent = faction.palette ? Object.values(faction.palette)[0] : undefined;

  return (
    <TerminalPanel
      title={`faction.${faction.slug}`}
      className="h-full transition-colors hover:border-primary/40"
      style={
        accent
          ? {
              borderColor: `${accent}33`,
              boxShadow: `0 0 24px ${accent}12`,
            }
          : undefined
      }
    >
      <h3
        className="font-mono text-sm font-semibold tracking-wider uppercase"
        style={accent ? { color: accent } : undefined}
      >
        {faction.name}
      </h3>
      {faction.archetype && (
        <p className="mt-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          {faction.archetype}
        </p>
      )}
      {faction.tagline && (
        <p className="mt-2 font-mono text-[10px] italic text-muted-foreground">
          &ldquo;{faction.tagline}&rdquo;
        </p>
      )}
      {faction.leaderName && (
        <p className="mt-2 font-mono text-[10px] text-foreground/70">
          Cell Lead: {faction.leaderName}
        </p>
      )}
      {faction.symbol && (
        <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground/80">
          ◈ {faction.symbol}
        </p>
      )}
      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{faction.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">
          {faction._count.memberships} members
        </span>
        <Link href={`/mmo/factions/${faction.slug}`}>
          <CommandButton size="sm" variant="outline">
            View Dossier
          </CommandButton>
        </Link>
      </div>
    </TerminalPanel>
  );
}
