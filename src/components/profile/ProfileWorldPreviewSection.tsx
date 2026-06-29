"use client";

import { ProfileWorldRenderer } from "@/components/profile/ProfileWorldRenderer";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import type { ProfileWorldData } from "@/lib/queries/profile-world";
import type { RelicBuildConfig } from "@/lib/profile/relic-config";
import { hasVisibleProfileWorldContent } from "@/lib/profile/profile-world-content";
import styles from "@/components/profile/profile-pages.module.css";

interface ProfileWorldPreviewSectionProps {
  world: ProfileWorldData;
  relicConfig: RelicBuildConfig;
  showEditLinks?: boolean;
  buildName?: string | null;
}

export function ProfileWorldPreviewSection({
  world,
  relicConfig,
  showEditLinks = false,
  buildName,
}: ProfileWorldPreviewSectionProps) {
  const hasContent = hasVisibleProfileWorldContent(world, relicConfig);

  return (
    <section className={styles.worldPreviewSection} aria-label="Profile World preview">
      <div className={styles.worldPreviewMeta}>
        <p className={styles.worldPreviewHint}>
          Preview below mirrors your published Active Relic configuration
          {buildName ? ` · ${buildName}` : ""}.
        </p>
      </div>
      <div className={styles.worldPreviewFrame}>
        <ProfileWorldRenderer
          world={world}
          relicConfig={relicConfig}
          showEditLinks={showEditLinks}
          embedded
        />
      </div>
      {!hasContent ? (
        <TerminalPanel title="relic.modules.hidden" className={styles.worldPreviewFallback}>
          <p className="font-mono text-sm text-muted-foreground">
            Your published layout has all modules hidden or no display data yet. Open the Relic Zone
            editor to show identity panels, badges, or biography modules.
          </p>
        </TerminalPanel>
      ) : null}
    </section>
  );
}
