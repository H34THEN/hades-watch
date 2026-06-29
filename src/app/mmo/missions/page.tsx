import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { MmoNav } from "@/components/mmo/MmoNav";
import { MissionBadgePlaceholder } from "@/components/mmo/MissionBadgePlaceholder";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  FIRST_DESCENT_PACK_INTRO,
  FIRST_DESCENT_PACK_ID,
} from "@/lib/missions/first-descent-pack";
import {
  UNDERWATCH_CIVIC_ACTION_PACK_INTRO,
  UNDERWATCH_CIVIC_ACTION_PACK_ID,
} from "@/lib/missions/underwatch-civic-action-pack";
import { getMissionDefinitionBySlug } from "@/lib/missions/registry";
import { getMissionsByPack } from "@/lib/missions/queries";
import { requireApprovedAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Missions" };

function formatMissionType(type: string | null | undefined): string {
  if (!type) return "Support Mission";
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSourceConfidence(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface MissionListProps {
  missions: Awaited<ReturnType<typeof getMissionsByPack>>;
}

function MissionList({ missions }: MissionListProps) {
  return (
    <div className="space-y-4">
      {missions.map((m) => {
        const pack = getMissionDefinitionBySlug(m.slug);
        const completionBadge = pack?.badges.find((b) => b.isMissionCompletionBadge);
        const sourceConfidence =
          pack?.sourceConfidence ??
          (typeof m.missionMetadata === "object" &&
          m.missionMetadata &&
          !Array.isArray(m.missionMetadata) &&
          typeof (m.missionMetadata as Record<string, unknown>).sourceConfidence === "string"
            ? ((m.missionMetadata as Record<string, unknown>).sourceConfidence as string)
            : null);

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
                {sourceConfidence && (
                  <p>Source confidence: {formatSourceConfidence(sourceConfidence)}</p>
                )}
                <p className="sm:col-span-2">{m.nonviolenceClassification}</p>
                <p className="sm:col-span-2">Open to all factions: Yes</p>
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
  );
}

export default async function MissionsPage() {
  await requireApprovedAuth();
  const [firstDescent, underwatchCivic] = await Promise.all([
    getMissionsByPack(FIRST_DESCENT_PACK_ID),
    getMissionsByPack(UNDERWATCH_CIVIC_ACTION_PACK_ID),
  ]);

  return (
    <PageShell variant="wide" scanlines>
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Missions</h1>
      <MmoNav active="/mmo/missions" />

      <TerminalPanel title="mission.cross_faction" className="mb-8 border-emerald-500/20">
        <p className="font-mono text-xs text-emerald-500/90">
          Any approved operative may complete any support mission, regardless of primary faction.
        </p>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          Cross-faction work builds solidarity across the Chthonic Uprising. Mission completion
          supports the listed faction and awards badge records to your operative dossier.
        </p>
      </TerminalPanel>

      <TerminalPanel title="mission.pack.first_descent" className="mb-8 border-primary/20">
        <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
          Mission Pack I: First Descent Protocols
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{FIRST_DESCENT_PACK_INTRO}</p>
      </TerminalPanel>
      <MissionList missions={firstDescent} />

      <TerminalPanel
        title="mission.pack.underwatch_civic_action"
        className="mb-8 mt-10 border-primary/20"
      >
        <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
          Mission Pack II: Underwatch Civic Action Protocols
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{UNDERWATCH_CIVIC_ACTION_PACK_INTRO}</p>
        <p className="mt-3 font-mono text-[10px] text-amber-400/80">
          Provisional mission design layer. Source confidence tracked per mission for future
          verification upgrades.
        </p>
      </TerminalPanel>
      <MissionList missions={underwatchCivic} />
    </PageShell>
  );
}
