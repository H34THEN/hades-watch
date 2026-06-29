"use client";

import { useMemo, useState } from "react";
import type { BadgeCaseCategory, BadgeCaseItem } from "@/lib/profile/badge-case-types";
import { BADGE_CASE_CATEGORIES } from "@/lib/profile/badge-case-types";
import { BadgeHexCell } from "@/components/profile/BadgeHexCell";
import { BadgeDetailPanel } from "@/components/profile/BadgeDetailPanel";
import styles from "@/components/profile/profile-pages.module.css";

interface BadgeHexGridProps {
  items: BadgeCaseItem[];
  earnedCount: number;
  totalCount: number;
}

export function BadgeHexGrid({ items, earnedCount, totalCount }: BadgeHexGridProps) {
  const [category, setCategory] = useState<BadgeCaseCategory>("All");
  const [selected, setSelected] = useState<BadgeCaseItem | null>(null);

  const filtered = useMemo(() => {
    if (category === "All") return items;
    return items.filter((item) => item.category === category);
  }, [items, category]);

  return (
    <div className={styles.badgeCaseShell}>
      <div className={styles.badgeCaseStats}>
        <span>
          {earnedCount} / {totalCount} marks recovered
        </span>
        <span>{filtered.length} visible in grid</span>
      </div>

      <div className={styles.badgeCategoryFilters} role="group" aria-label="Badge categories">
        {BADGE_CASE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.badgeCategoryBtn} ${category === cat ? styles.badgeCategoryBtnActive : ""}`}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.badgeCaseLayout}>
        <div
          className={styles.badgeHexGrid}
          role="listbox"
          aria-label="Badge collection"
        >
          {filtered.map((badge) => (
            <BadgeHexCell
              key={badge.slug}
              badge={badge}
              selected={selected?.slug === badge.slug}
              onSelect={setSelected}
            />
          ))}
        </div>
        <BadgeDetailPanel badge={selected} />
      </div>
    </div>
  );
}
