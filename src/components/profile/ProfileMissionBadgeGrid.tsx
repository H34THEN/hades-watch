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
  awardedAt: Date;
}

interface ProfileMissionBadgeGridProps {
  badges: ProfileMissionBadge[];
}

export function ProfileMissionBadgeGrid({ badges }: ProfileMissionBadgeGridProps) {
  if (badges.length === 0) return null;

  const completion = badges.filter((b) => b.isMissionCompletionBadge);
  const component = badges.filter((b) => !b.isMissionCompletionBadge);

  return (
    <div className="space-y-4 border-t border-border/40 pt-3">
      <dt className="text-muted-foreground">MISSION BADGE RECORD</dt>
      {completion.length > 0 && (
        <dd>
          <p className="mb-2 font-mono text-[10px] tracking-wider text-primary/80 uppercase">
            Mission Completion
          </p>
          <div className="flex flex-wrap gap-3">
            {completion.map((badge) => (
              <div key={badge.slug} className="space-y-1">
                <MissionBadgePlaceholder
                  label={badge.placeholderText ?? badge.name}
                  color={badge.placeholderColor ?? badge.color}
                  completion
                  status={badge.verificationStatus}
                  factionName={badge.factionName}
                />
                <p className="max-w-28 text-center font-mono text-[8px] text-muted-foreground">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </dd>
      )}
      {component.length > 0 && (
        <dd>
          <p className="mb-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            Component Badges
          </p>
          <div className="flex flex-wrap gap-3">
            {component.map((badge) => (
              <div key={badge.slug} className="space-y-1">
                <MissionBadgePlaceholder
                  label={badge.placeholderText ?? badge.name}
                  color={badge.placeholderColor ?? badge.color}
                  status={badge.verificationStatus}
                  factionName={badge.factionName}
                />
                <p className="max-w-28 text-center font-mono text-[8px] text-muted-foreground">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </dd>
      )}
    </div>
  );
}
