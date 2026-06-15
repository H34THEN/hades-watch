import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import type { ResolvedAlliance } from "@/lib/factions/resolve";
import { isAdmin, isOwner } from "@/lib/auth/roles";
import type { RoleName } from "@/generated/prisma/client";

interface AllianceHeroProps {
  alliance: ResolvedAlliance;
  roles?: RoleName[];
  showSeedWarning?: boolean;
}

export function AllianceHero({ alliance, roles = [], showSeedWarning }: AllianceHeroProps) {
  const showCommand = isAdmin(roles);
  const showOverlord = isOwner(roles);

  return (
    <TerminalPanel
      title={`alliance.${alliance.slug}`}
      className="mb-8 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5"
    >
      <p className="font-mono text-[10px] tracking-[0.3em] text-primary/70 uppercase">
        Classified — Parent Alliance Dossier
      </p>
      <h2 className="mt-2 font-mono text-2xl tracking-widest uppercase text-primary">
        {alliance.name}
      </h2>
      {alliance.tagline && (
        <p className="mt-2 font-mono text-xs italic text-muted-foreground">
          &ldquo;{alliance.tagline}&rdquo;
        </p>
      )}
      <p className="mt-4 text-sm leading-relaxed text-foreground/85">{alliance.description}</p>

      <div className="mt-4 rounded border border-border/40 bg-background/50 p-4">
        <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          The Archivist
        </p>
        <p className="mt-1 font-mono text-xs text-primary">
          {alliance.leaderName}
          {alliance.leaderTitle ? ` — ${alliance.leaderTitle}` : ""}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-foreground/75">
          {alliance.archivistLore.summary}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-foreground/65 italic">
          {alliance.archivistLore.doctrine}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {alliance.archivistLore.titles.map((t) => (
            <span
              key={t}
              className="rounded border border-primary/30 px-2 py-0.5 font-mono text-[10px] text-primary/90"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {alliance.symbol && (
        <p className="mt-4 font-mono text-xs text-muted-foreground">◈ {alliance.symbol}</p>
      )}
      {alliance.motto && (
        <p className="mt-2 font-mono text-[10px] tracking-wider text-primary/80 uppercase">
          {alliance.motto}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/mmo/factions/${alliance.slug}`}>
          <CommandButton size="sm" variant="outline">
            Alliance Dossier
          </CommandButton>
        </Link>
        {showCommand && (
          <Link href="/admin/factions/command">
            <CommandButton size="sm">
              {showOverlord ? "Chthonic Command" : "Faction Command"}
            </CommandButton>
          </Link>
        )}
      </div>

      {showSeedWarning && alliance.dataSource === "canonical" && (
        <p className="mt-4 font-mono text-[10px] text-amber-400">
          ⚠ Canonical lore fallback active — run npm run db:seed:factions on the server.
        </p>
      )}
    </TerminalPanel>
  );
}
