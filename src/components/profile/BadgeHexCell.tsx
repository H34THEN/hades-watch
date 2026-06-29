"use client";

import type { BadgeCaseItem } from "@/lib/profile/badge-case-types";
import styles from "@/components/profile/profile-pages.module.css";

interface BadgeHexCellProps {
  badge: BadgeCaseItem;
  selected: boolean;
  onSelect: (badge: BadgeCaseItem) => void;
}

function badgeImageSrc(assetPath: string | null): string | null {
  if (!assetPath) return null;
  if (assetPath.startsWith("/")) return assetPath;
  return `/badge-assets/${assetPath.replace(/^badge-assets\//, "")}`;
}

export function BadgeHexCell({ badge, selected, onSelect }: BadgeHexCellProps) {
  const imgSrc = badgeImageSrc(badge.assetPath);
  const classes = [
    styles.badgeHex,
    badge.earned ? styles.badgeHexEarned : styles.badgeHexLocked,
    selected ? styles.badgeHexSelected : "",
    badge.isCapstone ? styles.badgeHexCapstone : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={() => onSelect(badge)}
      aria-pressed={selected}
      aria-label={`${badge.name}${badge.earned ? ", earned" : ", locked"}`}
    >
      <span className={styles.badgeHexInner}>
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt="" className={styles.badgeHexImage} />
        ) : (
          <span
            className={styles.badgeHexGlyph}
            style={badge.placeholderColor ? { color: badge.placeholderColor } : undefined}
          >
            {badge.placeholderText ?? badge.name.slice(0, 3).toUpperCase()}
          </span>
        )}
      </span>
      <span className={styles.badgeHexLabel}>{badge.name}</span>
    </button>
  );
}
