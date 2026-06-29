"use client";

import type { RelicLayoutKey } from "@/lib/profile/relic-frames";
import { RELIC_FRAMES } from "@/lib/profile/relic-frames";
import styles from "@/components/profile/profile-pages.module.css";

interface RelicFrameSelectorProps {
  selected: RelicLayoutKey;
  onSelect: (key: RelicLayoutKey) => void;
}

export function RelicFrameSelector({ selected, onSelect }: RelicFrameSelectorProps) {
  return (
    <div className={styles.frameGrid} role="radiogroup" aria-label="Relic Frames">
      {RELIC_FRAMES.map((frame) => (
        <button
          key={frame.key}
          type="button"
          role="radio"
          aria-checked={selected === frame.key}
          className={`${styles.frameOption} ${selected === frame.key ? styles.frameOptionActive : ""}`}
          onClick={() => onSelect(frame.key)}
        >
          <span className={styles.frameOptionName}>{frame.name}</span>
          <span className={styles.frameOptionDesc}>{frame.description}</span>
        </button>
      ))}
    </div>
  );
}
