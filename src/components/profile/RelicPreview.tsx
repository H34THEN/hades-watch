"use client";

import { useState } from "react";
import type { ProfileWorldData } from "@/lib/queries/profile-world";
import type { RelicBuildConfig } from "@/lib/profile/relic-config";
import { ProfileWorldRenderer } from "@/components/profile/ProfileWorldRenderer";
import styles from "@/components/profile/profile-pages.module.css";

interface RelicPreviewProps {
  world: ProfileWorldData;
  config: RelicBuildConfig;
}

export function RelicPreview({ world, config }: RelicPreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  return (
    <div>
      <div className={styles.previewToolbar}>
        <button
          type="button"
          className={`${styles.previewToggle} ${viewport === "desktop" ? styles.previewToggleActive : ""}`}
          onClick={() => setViewport("desktop")}
        >
          Desktop
        </button>
        <button
          type="button"
          className={`${styles.previewToggle} ${viewport === "mobile" ? styles.previewToggleActive : ""}`}
          onClick={() => setViewport("mobile")}
        >
          Mobile
        </button>
      </div>
      <div
        className={`${styles.previewFrame} ${viewport === "mobile" ? styles.previewFrameMobile : styles.previewFrameDesktop}`}
      >
        <ProfileWorldRenderer
          world={world}
          relicConfig={config}
          showEditLinks={false}
          isPreview
        />
      </div>
    </div>
  );
}
