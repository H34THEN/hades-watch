import Link from "next/link";
import { MissionBadgePlaceholder } from "@/components/mmo/MissionBadgePlaceholder";
import { MissionSubmissionForm } from "@/components/mmo/MissionSubmissionForm";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import type { MissionDetailForUser } from "@/lib/missions/types";

function formatMissionType(type: string | null): string {
  if (!type) return "Support Mission";
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

interface MissionDetailViewProps {
  mission: MissionDetailForUser;
}

export function MissionDetailView({ mission }: MissionDetailViewProps) {
  const sections = mission.sections;

  return (
    <div className="space-y-6">
      <TerminalPanel title={`mission.${mission.slug}`}>
        <h1 className="font-mono text-xl tracking-widest uppercase text-primary">{mission.title}</h1>
        {mission.faction && (
          <Link
            href={`/mmo/factions/${mission.faction.slug}`}
            className="mt-2 inline-block font-mono text-xs text-muted-foreground hover:text-primary"
          >
            Supports: {mission.faction.name}
          </Link>
        )}
        <div className="mt-4 grid gap-2 font-mono text-[10px] text-muted-foreground sm:grid-cols-2">
          <p>Difficulty: {mission.difficulty ?? "—"}</p>
          <p>Type: {formatMissionType(mission.missionType)}</p>
          <p>Estimated: {mission.estimatedTime ?? "—"}</p>
          <p>Reputation: +{mission.reputationReward ?? 0} faction standing</p>
          <p>Repeatable: {mission.repeatable ? "Yes" : "No"}</p>
          <p>Open to all factions: {mission.openToAllFactions ? "Yes" : "No"}</p>
        </div>
        <p className="mt-3 font-mono text-[10px] text-emerald-500/80">
          {mission.nonviolenceClassification}
        </p>
        {mission.latestSubmission && (
          <p className="mt-3 font-mono text-xs text-amber-400/90">
            Latest field record: {mission.latestSubmission.status} ·{" "}
            {mission.latestSubmission.submittedAt.toLocaleDateString()}
          </p>
        )}
      </TerminalPanel>

      {sections && (
        <>
          <Section title="Mission Brief" body={sections.missionBrief} />
          <Section title="Real World Purpose" body={sections.realWorldPurpose} />
          <Section title="In-Universe Context" body={sections.inUniverseContext} />
          <Section title="Objective" body={sections.objective} />
          <ListSection title="Operative Tasks" items={sections.operativeTasks} />
          <ListSection title="Submission Requirements" items={sections.submissionRequirements} />
          <Section title="Proof and Privacy Notes" body={sections.proofPrivacyNotes} />
          <Section title="Safety and Nonviolence Notes" body={sections.safetyNotes} />
          <ListSection title="Success Criteria" items={sections.successCriteria} />
          <TerminalPanel title="faction.leader.transmission">
            <p className="font-mono text-[10px] text-primary/80">{sections.factionLeaderTransmission.speaker}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
              {sections.factionLeaderTransmission.body}
            </p>
          </TerminalPanel>
          <Section title="Archivist Note" body={sections.archivistNote} />
          <ListSection title="Rewards" items={sections.rewards} />
          <Section title="Profile Badge Placeholder Notes" body={sections.profileBadgePlaceholderNotes} />
        </>
      )}

      <TerminalPanel title="mission.required_badges">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-[10px]">
            <thead>
              <tr className="border-b border-border/40 text-left text-muted-foreground">
                <th className="py-2 pr-3">Badge</th>
                <th className="py-2 pr-3">Requirement</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {mission.badges.map((badge) => {
                const earned = mission.userBadges.find((ub) => ub.slug === badge.slug);
                return (
                  <tr key={badge.slug} className="border-b border-border/20 align-top">
                    <td className="py-2 pr-3">
                      <p className="font-semibold text-primary">{badge.name}</p>
                      <p className="text-muted-foreground">{badge.slug}</p>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{badge.requirement}</td>
                    <td className="py-2">
                      {earned?.verificationStatus === "Verified"
                        ? "Verified"
                        : earned?.verificationStatus === "Pending"
                          ? "Pending Review"
                          : earned?.verificationStatus === "Rejected"
                            ? "Rejected"
                            : "Not yet filed"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {mission.badges.map((badge) => {
            const earned = mission.userBadges.find((ub) => ub.slug === badge.slug);
            return (
              <MissionBadgePlaceholder
                key={badge.slug}
                label={badge.placeholderText}
                color={badge.placeholderColor}
                completion={badge.isMissionCompletionBadge}
                status={earned?.verificationStatus ?? null}
                factionName={mission.faction?.name}
                missionTitle={mission.title}
              />
            );
          })}
        </div>
      </TerminalPanel>

      <TerminalPanel title="mission.file_record">
        <MissionSubmissionForm
          questSlug={mission.slug}
          fields={mission.submissionFields}
          disabled={!mission.canSubmit}
        />
      </TerminalPanel>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <TerminalPanel title={title.toLowerCase().replace(/\s+/g, "_")}>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{body}</p>
    </TerminalPanel>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <TerminalPanel title={title.toLowerCase().replace(/\s+/g, "_")}>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground/80">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </TerminalPanel>
  );
}
