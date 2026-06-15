"use client";

import { MissionBadgePlaceholder } from "@/components/mmo/MissionBadgePlaceholder";

export interface ProfileMissionBadge {
  slug: string;
  name: string;
  color: string | null;
  placeholderText: string | null;
  placeholderColor: string | null;
  missionSlug: string | null;
  isMissionCompletionBadge: boolean;
  verificationStatus: "Pending" | "Verified" | "Rejected";
  factionName: string | null;
  factionSlug: string | null;
  awardedAt: Date;
}

interface ProfileMissionBadgeGridProps {
  badges: ProfileMissionBadge[];
}

function groupByFaction(badges: ProfileMissionBadge[]) {
  const groups = new Map<string, ProfileMissionBadge[]>();
  for (const badge of badges) {
    const key = badge.factionSlug ?? badge.factionName ?? "unassigned";
    const list = groups.get(key) ?? [];
    list.push(badge);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

function BadgeGroup({
  title,
  badges,
  completion,
}: {
  title: string;
  badges: ProfileMissionBadge[];
  completion: boolean;
}) {
  if (badges.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      <div className="flex flex-wrap gap-3">
        {badges.map((badge) => (
          <div key={badge.slug} className="space-y-1">
            <MissionBadgePlaceholder
              label={badge.placeholderText ?? badge.name}
              color={badge.placeholderColor ?? badge.color}
              completion={completion}
              status={badge.verificationStatus}
              factionName={badge.factionName}
            />
            <p className="max-w-28 text-center font-mono text-[8px] text-muted-foreground">
              {badge.name}
            </p>
            {badge.missionSlug && (
              <p className="max-w-28 text-center font-mono text-[7px] text-muted-foreground/70">
                {badge.missionSlug}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileMissionBadgeGrid({ badges }: ProfileMissionBadgeGridProps) {
  if (badges.length === 0) return null;

  const factionGroups = groupByFaction(badges);

  return (
    <div className="space-y-4 border-t border-border/40 pt-3">
      <dt className="text-muted-foreground">MISSION BADGE RECORD</dt>
      {factionGroups.map(([factionKey, factionBadges]) => {
        const factionLabel =
          factionBadges[0]?.factionName ?? factionKey.replace(/-/g, " ");
        const completion = factionBadges.filter((b) => b.isMissionCompletionBadge);
        const component = factionBadges.filter((b) => !b.isMissionCompletionBadge);

        return (
          <dd key={factionKey} className="space-y-3 rounded border border-border/20 p-3">
            <p className="font-mono text-[10px] tracking-wider text-primary/90 uppercase">
              {factionLabel}
            </p>
            <BadgeGroup title="Mission Completion" badges={completion} completion />
            <BadgeGroup title="Component Badges" badges={component} completion={false} />
          </dd>
        );
      })}
    </div>
  );
}
