import Link from "next/link";
import { MmoNav } from "@/components/mmo/MmoNav";
import { MissionBadgePlaceholder } from "@/components/mmo/MissionBadgePlaceholder";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  FIRST_DESCENT_PACK_INTRO,
} from "@/lib/missions/first-descent-pack";
import { getFirstDescentMissions } from "@/lib/missions/queries";
import { requireApprovedAuth } from "@/lib/auth/session";
import { FIRST_DESCENT_MISSIONS } from "@/lib/missions/first-descent-pack";

export const dynamic = "force-dynamic";
export const metadata = { title: "Missions" };

function formatMissionType(type: string | null | undefined): string {
  if (!type) return "Support Mission";
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function MissionsPage() {
  await requireApprovedAuth();
  const missions = await getFirstDescentMissions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Missions</h1>
      <MmoNav active="/mmo/missions" />

      <TerminalPanel title="mission.pack.first_descent" className="mb-8 border-primary/20">
        <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
          Mission Pack I: First Descent Protocols
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{FIRST_DESCENT_PACK_INTRO}</p>
        <p className="mt-4 font-mono text-xs text-emerald-500/90">
          Any approved operative may complete any support mission, regardless of primary faction.
        </p>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          Cross-faction work builds solidarity across the Chthonic Uprising. Mission completion
          supports the listed faction and awards badge records to your operative dossier.
        </p>
      </TerminalPanel>

      <div className="space-y-4">
        {missions.map((m) => {
          const pack = FIRST_DESCENT_MISSIONS.find((p) => p.slug === m.slug);
          const completionBadge = pack?.badges.find((b) => b.isMissionCompletionBadge);
          return (
            <Link key={m.id} href={`/mmo/missions/${m.slug}`}>
              <TerminalPanel title={`mission.${m.slug}`}>
                <h3 className="font-mono text-sm font-semibold uppercase text-primary">
                  {m.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.description}</p>
                <div className="mt-3 grid gap-1 font-mono text-[10px] text-muted-foreground sm:grid-cols-2">
                  {m.faction && <p>Supports: {m.faction.name}</p>}
                  <p>Difficulty: {m.difficulty ?? "—"}</p>
                  <p>Type: {formatMissionType(m.missionType)}</p>
                  <p>Time: {m.estimatedTime ?? "—"}</p>
                  <p>Reputation: +{m.reputationReward ?? 0}</p>
                  <p>{m.nonviolenceClassification}</p>
                </div>
                {completionBadge && (
                  <div className="mt-4 flex items-center gap-3">
                    <MissionBadgePlaceholder
                      label={completionBadge.placeholderText}
                      color={completionBadge.placeholderColor}
                      completion
                      factionName={m.faction?.name}
                      missionTitle={m.title}
                    />
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Completion badge: {completionBadge.name}
                    </p>
                  </div>
                )}
              </TerminalPanel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
