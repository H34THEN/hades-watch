import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { REPUTATION_LEVELS } from "@/lib/community/constants";
import { getUserReputationSummary } from "@/lib/community/reputation";
import type { ReputationCategory } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<ReputationCategory, string> = {
  COMMUNITY: "Community",
  LORE: "Lore",
  MISSIONS: "Missions",
  CIPHERS: "Ciphers",
  ARCHIVE: "Archive",
  FORGE: "Forge",
  GUILDS: "Guilds",
  MODERATION: "Moderation",
  ACCESSIBILITY: "Accessibility",
  FACTION: "Faction",
  RECOGNITION: "Recognition",
};

interface ReputationPanelProps {
  userId: string;
}

export async function ReputationPanel({ userId }: ReputationPanelProps) {
  const summary = await getUserReputationSummary(userId);
  const nextLevel = REPUTATION_LEVELS[summary.level + 1];
  const currentThreshold = REPUTATION_LEVELS[summary.level]?.minPoints ?? 0;
  const progressToNext = nextLevel
    ? Math.min(
        100,
        Math.round(
          ((summary.total - currentThreshold) /
            (nextLevel.minPoints - currentThreshold)) *
            100,
        ),
      )
    : 100;

  const topCategories = (
    Object.entries(summary.byCategory) as [ReputationCategory, number][]
  )
    .filter(([, points]) => points > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <TerminalPanel title="reputation.panel">
      <div className="space-y-4">
        <div>
          <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Underwatch Standing
          </p>
          <p className="mt-1 font-mono text-2xl text-primary">{summary.levelTitle}</p>
          <p className={cn(styles.metaRow, "mt-1")}>
            <span>{summary.total} reputation points</span>
            {nextLevel && (
              <span>
                {nextLevel.minPoints - summary.total} to {nextLevel.title}
              </span>
            )}
          </p>
        </div>

        {nextLevel && (
          <div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-primary/80"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}

        {topCategories.length > 0 && (
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              Signal Breakdown
            </p>
            <ul className="space-y-1">
              {topCategories.map(([category, points]) => (
                <li
                  key={category}
                  className="flex items-center justify-between font-mono text-xs"
                >
                  <span className="text-muted-foreground">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="text-primary">{points}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </TerminalPanel>
  );
}
