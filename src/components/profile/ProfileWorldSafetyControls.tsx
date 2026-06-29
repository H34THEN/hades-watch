"use client";

import { useState } from "react";
import styles from "@/components/profile/profile-pages.module.css";

interface ProfileWorldSafetyControlsProps {
  onReadableChange?: (enabled: boolean) => void;
  onEffectsChange?: (disabled: boolean) => void;
  showReport?: boolean;
  reportHref?: string;
}

export function ProfileWorldSafetyControls({
  onReadableChange,
  onEffectsChange,
  showReport = true,
  reportHref = "/community/forums",
}: ProfileWorldSafetyControlsProps) {
  const [readable, setReadable] = useState(false);
  const [noEffects, setNoEffects] = useState(false);

  return (
    <div className={styles.profileWorldSafetyBar} role="toolbar" aria-label="Visitor safety controls">
      <button
        type="button"
        className={`${styles.safetyToggle} ${readable ? styles.safetyToggleActive : ""}`}
        onClick={() => {
          const next = !readable;
          setReadable(next);
          onReadableChange?.(next);
        }}
      >
        Readable Mode
      </button>
      <button
        type="button"
        className={`${styles.safetyToggle} ${noEffects ? styles.safetyToggleActive : ""}`}
        onClick={() => {
          const next = !noEffects;
          setNoEffects(next);
          onEffectsChange?.(next);
        }}
      >
        Disable Effects
      </button>
      {showReport ? (
        <a
          href={reportHref}
          className={styles.safetyToggle}
          rel="noopener noreferrer nofollow ugc"
        >
          Report Profile
        </a>
      ) : null}
    </div>
  );
}

export function useProfileWorldSafetyClasses(readable: boolean, noEffects: boolean) {
  return [
    styles.profileWorld,
    !noEffects ? styles.profileWorldScanlines : styles.profileWorldNoEffects,
    readable ? styles.profileWorldReadable : "",
    noEffects ? styles.profileWorldNoEffects : "",
  ]
    .filter(Boolean)
    .join(" ");
}
