import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { statusLabel } from "@/lib/mmo/hub-labels";
import styles from "@/components/mmo/mmo-hub.module.css";
import type { ResolvedHubModule } from "@/lib/mmo/hub-types";
import { cn } from "@/lib/utils";

interface MmoHubModuleCardProps {
  module: ResolvedHubModule;
  statHint?: string;
}

function statusClass(status: ResolvedHubModule["resolvedStatus"]): string {
  switch (status) {
    case "live":
      return styles.statusLive;
    case "locked":
      return styles.statusLocked;
    case "coming-soon":
      return styles.statusComingSoon;
    default:
      return styles.statusLocked;
  }
}

export function MmoHubModuleCard({ module, statHint }: MmoHubModuleCardProps) {
  const {
    title,
    eyebrow,
    description,
    resolvedStatus,
    resolvedRoute,
    lockedMessage,
    isLinkable,
    ctaLabel,
    factionAssociations,
    badgeHooks,
    chatWarning,
    missionNote,
    emptyState,
  } = module;

  const body = statHint ?? description;
  const showEmpty = resolvedStatus === "live" && statHint === emptyState;

  const cardContent = (
    <>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>
        <span className={cn(styles.statusChip, statusClass(resolvedStatus))}>
          {statusLabel(resolvedStatus)}
        </span>
      </div>
      <div className={styles.cardBody}>
        <p>{showEmpty && emptyState ? emptyState : body}</p>
        {chatWarning && resolvedStatus === "live" && (
          <p className={cn(styles.warningNote, "mt-2")}>{chatWarning}</p>
        )}
        {missionNote && resolvedStatus === "live" && (
          <p className={cn(styles.warningNote, "mt-2")}>{missionNote}</p>
        )}
        {factionAssociations.length > 0 && (
          <div className={styles.factionTags}>
            {factionAssociations.slice(0, 3).map((f) => (
              <span key={f} className={styles.factionTag}>
                {f}
              </span>
            ))}
          </div>
        )}
        {badgeHooks.length > 0 && (
          <p className={cn(styles.badgeHint, "mt-2")}>
            Badge hooks: {badgeHooks.slice(0, 3).join(", ")}
          </p>
        )}
      </div>
      <div className={styles.cardFooter}>
        {lockedMessage && (
          <p className={styles.lockedMessage}>{lockedMessage}</p>
        )}
        {isLinkable && resolvedRoute ? (
          <span className="font-mono text-xs tracking-wider text-primary uppercase">
            {ctaLabel} →
          </span>
        ) : resolvedStatus === "coming-soon" ? (
          <CommandButton size="sm" disabled>
            Relay Locked
          </CommandButton>
        ) : resolvedStatus === "locked" ? (
          <CommandButton size="sm" disabled>
            Locked
          </CommandButton>
        ) : null}
      </div>
    </>
  );

  if (isLinkable && resolvedRoute) {
    return (
      <Link
        href={resolvedRoute}
        className={cn(styles.card, styles.cardLinkable)}
        aria-label={`${title}: ${ctaLabel}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <article
      className={cn(
        styles.card,
        resolvedStatus !== "live" && styles.cardLocked,
      )}
      aria-label={title}
    >
      {cardContent}
    </article>
  );
}
