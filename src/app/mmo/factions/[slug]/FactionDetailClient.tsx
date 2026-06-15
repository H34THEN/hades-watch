"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MmoNav } from "@/components/mmo/MmoNav";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { requestFactionJoinAction } from "@/lib/actions/mmo";
import { POSITION_LABELS } from "@/lib/factions/chthonic-data";

interface FactionDetailPageProps {
  faction: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    tagline: string | null;
    archetype: string | null;
    leaderName: string | null;
    leaderTitle: string | null;
    leaderLore: string | null;
    coreValues: string[] | null;
    palette: Record<string, string> | null;
    symbol: string | null;
    rivalrySlug: string | null;
    synergySlug: string | null;
    themeUnlock: string | null;
    typicalMissions: string[] | null;
    reputationFlavor: string | null;
    badges: string[] | null;
    titles: { starting: string; advanced: string[] } | null;
    alliance: { name: string; slug: string; motto: string | null } | null;
    rivalry: { name: string; slug: string } | null;
    synergy: { name: string; slug: string } | null;
    badgeRecords: { id: string; name: string; slug: string; color: string | null }[];
    quests: { id: string; slug: string; title: string }[];
    characters: { callsign: string; archetype: string | null }[];
    _count: { characters: number; memberships: number };
  };
  membershipStatus?: string | null;
}

const POSITION_ORDER = [
  "INITIATE",
  "MEMBER",
  "SPECIALIST",
  "CELL_LEAD",
  "LIEUTENANT",
  "LEADER",
] as const;

export function FactionDetailClient({ faction, membershipStatus }: FactionDetailPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const palette = faction.palette ?? {};
  const accent = Object.values(palette)[0] ?? undefined;

  function handleJoin() {
    startTransition(async () => {
      await requestFactionJoinAction(faction.id);
      router.refresh();
    });
  }

  const titles = faction.titles;
  const positionRanks = titles
    ? [
        { key: "INITIATE", label: titles.starting },
        ...titles.advanced.map((label, i) => ({
          key: POSITION_ORDER[i + 1] ?? `RANK_${i}`,
          label,
        })),
      ]
    : POSITION_ORDER.map((p) => ({ key: p, label: POSITION_LABELS[p] }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <MmoNav active="/mmo/factions" />

      {faction.alliance && (
        <p className="mb-4 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          Cell of{" "}
          <Link
            href={`/mmo/factions/${faction.alliance.slug}`}
            className="text-primary hover:underline"
          >
            {faction.alliance.name}
          </Link>
        </p>
      )}

      <TerminalPanel title={`faction.${faction.slug}`}>
        <h1
          className="font-mono text-2xl tracking-widest uppercase"
          style={accent ? { color: accent } : undefined}
        >
          {faction.name}
        </h1>
        {faction.tagline && (
          <p className="mt-2 font-mono text-xs tracking-wide text-muted-foreground italic">
            &ldquo;{faction.tagline}&rdquo;
          </p>
        )}
        {faction.archetype && (
          <p className="mt-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            {faction.archetype}
          </p>
        )}
        <p className="mt-4 text-sm leading-relaxed text-foreground/80">{faction.description}</p>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          {faction._count.characters} operatives · {faction._count.memberships} members
        </p>
        {membershipStatus ? (
          <p className="mt-2 font-mono text-xs text-primary">Your request: {membershipStatus}</p>
        ) : (
          <CommandButton className="mt-6" onClick={handleJoin} disabled={isPending}>
            Request Membership
          </CommandButton>
        )}
      </TerminalPanel>

      {(faction.leaderName || faction.leaderLore) && (
        <TerminalPanel title="faction.leader" className="mt-6">
          {faction.leaderName && (
            <h2 className="font-mono text-sm font-semibold uppercase text-primary">
              {faction.leaderName}
              {faction.leaderTitle && (
                <span className="ml-2 text-muted-foreground">— {faction.leaderTitle}</span>
              )}
            </h2>
          )}
          {faction.leaderLore && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{faction.leaderLore}</p>
          )}
        </TerminalPanel>
      )}

      {faction.coreValues && faction.coreValues.length > 0 && (
        <TerminalPanel title="faction.values" className="mt-6">
          <ul className="space-y-1 font-mono text-xs text-foreground/80">
            {faction.coreValues.map((v) => (
              <li key={v}>· {v}</li>
            ))}
          </ul>
        </TerminalPanel>
      )}

      {faction.symbol && (
        <TerminalPanel title="faction.symbology" className="mt-6">
          <p className="text-sm leading-relaxed text-foreground/80">{faction.symbol}</p>
          {Object.keys(palette).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(palette).map(([key, hex]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 rounded border border-border/40 px-2 py-1 font-mono text-[10px]"
                >
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: hex }}
                  />
                  {key}
                </span>
              ))}
            </div>
          )}
        </TerminalPanel>
      )}

      <TerminalPanel title="faction.ranks" className="mt-6">
        <ol className="space-y-1 font-mono text-xs">
          {positionRanks.map((r, i) => (
            <li key={r.key} className="text-foreground/80">
              <span className="text-muted-foreground">{i + 1}.</span> {r.label}
            </li>
          ))}
        </ol>
      </TerminalPanel>

      {(faction.badges?.length || faction.badgeRecords.length > 0) && (
        <TerminalPanel title="faction.badges" className="mt-6">
          <div className="flex flex-wrap gap-2">
            {(faction.badgeRecords.length > 0
              ? faction.badgeRecords.map((b) => b.name)
              : (faction.badges ?? [])
            ).map((badge) => (
              <span
                key={badge}
                className="rounded border border-border/50 px-2 py-1 font-mono text-[10px] uppercase"
                style={accent ? { borderColor: `${accent}55`, color: accent } : undefined}
              >
                {badge}
              </span>
            ))}
          </div>
        </TerminalPanel>
      )}

      {faction.typicalMissions && faction.typicalMissions.length > 0 && (
        <TerminalPanel title="faction.mission_types" className="mt-6">
          <ul className="space-y-1 font-mono text-xs text-foreground/80">
            {faction.typicalMissions.map((m) => (
              <li key={m}>· {m}</li>
            ))}
          </ul>
        </TerminalPanel>
      )}

      {faction.reputationFlavor && (
        <TerminalPanel title="faction.reputation" className="mt-6">
          <p className="text-sm leading-relaxed text-foreground/80">{faction.reputationFlavor}</p>
        </TerminalPanel>
      )}

      {(faction.rivalry || faction.synergy) && (
        <TerminalPanel title="faction.relations" className="mt-6">
          <dl className="space-y-2 font-mono text-xs">
            {faction.rivalry && (
              <div>
                <dt className="text-muted-foreground uppercase">Tension</dt>
                <dd>
                  <Link
                    href={`/mmo/factions/${faction.rivalry.slug}`}
                    className="text-primary hover:underline"
                  >
                    {faction.rivalry.name}
                  </Link>
                </dd>
              </div>
            )}
            {faction.synergy && (
              <div>
                <dt className="text-muted-foreground uppercase">Synergy</dt>
                <dd>
                  <Link
                    href={`/mmo/factions/${faction.synergy.slug}`}
                    className="text-primary hover:underline"
                  >
                    {faction.synergy.name}
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </TerminalPanel>
      )}

      {faction.themeUnlock && (
        <TerminalPanel title="faction.theme_unlock" className="mt-6">
          <p className="font-mono text-sm text-primary">{faction.themeUnlock}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Faction standing may unlock this interface theme.
          </p>
        </TerminalPanel>
      )}

      {faction.quests.length > 0 && (
        <TerminalPanel title="faction.missions" className="mt-6">
          {faction.quests.map((q) => (
            <Link
              key={q.id}
              href={`/mmo/missions/${q.slug}`}
              className="block py-2 font-mono text-sm text-primary hover:underline"
            >
              {q.title}
            </Link>
          ))}
        </TerminalPanel>
      )}
    </div>
  );
}
