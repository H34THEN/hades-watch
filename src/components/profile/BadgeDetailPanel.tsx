"use client";

import type { BadgeCaseItem } from "@/lib/profile/badge-case-types";
import styles from "@/components/profile/profile-pages.module.css";

interface BadgeDetailPanelProps {
  badge: BadgeCaseItem | null;
}

export function BadgeDetailPanel({ badge }: BadgeDetailPanelProps) {
  if (!badge) {
    return (
      <aside className={styles.badgeDetailPanel} aria-live="polite">
        <p className={styles.badgeDetailEmpty}>
          Select a hex socket to inspect a mark from the Dead Index.
        </p>
      </aside>
    );
  }

  return (
    <aside className={styles.badgeDetailPanel} aria-live="polite">
      <h2 className={styles.badgeDetailTitle}>{badge.name}</h2>
      <p className={styles.badgeDetailMeta}>
        {badge.category}
        {badge.tier ? ` · ${badge.tier}` : ""}
        {badge.factionName ? ` · ${badge.factionName}` : ""}
        {" · "}
        {badge.earned ? "Earned" : "Locked"}
      </p>

      {badge.description ? (
        <p className={styles.badgeDetailBody}>{badge.description}</p>
      ) : null}

      {badge.earned && badge.awardedAt ? (
        <p className={styles.badgeDetailMeta}>
          Earned {new Date(badge.awardedAt).toLocaleDateString()}
        </p>
      ) : null}

      {!badge.earned && badge.requirement ? (
        <p className={styles.badgeDetailBody}>
          <strong>Unlock:</strong> {badge.requirement}
        </p>
      ) : null}

      {badge.source ? (
        <p className={styles.badgeDetailMeta}>Source · {badge.source}</p>
      ) : null}
    </aside>
  );
}
