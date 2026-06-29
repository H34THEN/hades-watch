"use client";

import { useCallback, useState, useTransition } from "react";
import Link from "next/link";
import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { RelicFrameSelector } from "@/components/profile/RelicFrameSelector";
import { RelicThemeControls } from "@/components/profile/RelicThemeControls";
import { RelicModuleManager } from "@/components/profile/RelicModuleManager";
import { RelicPreview } from "@/components/profile/RelicPreview";
import { CommandButton } from "@/components/terminal/CommandButton";
import {
  publishRelicBuildAction,
  resetRelicDefaultAction,
  saveRelicDraftAction,
} from "@/lib/actions/relic-zone";
import type { ProfileWorldData } from "@/lib/queries/profile-world";
import type { RelicZoneEditorData } from "@/lib/queries/relic-zone";
import {
  checkSignalStability,
  type RelicBuildConfig,
} from "@/lib/profile/relic-config";
import { getRelicFrame } from "@/lib/profile/relic-frames";
import styles from "@/components/profile/profile-pages.module.css";

interface RelicZoneEditorPageProps {
  world: ProfileWorldData;
  editorData: RelicZoneEditorData;
}

export function RelicZoneEditorPage({ world, editorData }: RelicZoneEditorPageProps) {
  const [config, setConfig] = useState<RelicBuildConfig>(editorData.draftConfig);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const warnings = checkSignalStability(config);

  const updateConfig = useCallback((partial: Partial<RelicBuildConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  function handleFrameSelect(layout: RelicBuildConfig["layout"]) {
    const frame = getRelicFrame(layout);
    setConfig(frame.defaultConfig());
  }

  function runAction(action: (json: string) => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      setMessage(null);
      const result = await action(JSON.stringify(config));
      if (result.success) {
        setMessage("Relic signal synchronized.");
      } else {
        setMessage(result.error ?? "Action failed.");
      }
    });
  }

  return (
    <ProfilePageShell
      title="RELIC ZONE // PROFILE WORLD EDITOR"
      subtitle="Assemble a public-facing myth-tech artifact: part dossier, part shrine, part resistance broadcast, part personal world."
      actions={
        <Link href="/profile/world">
          <CommandButton size="sm" variant="outline">
            Preview Profile World
          </CommandButton>
        </Link>
      }
    >
      <div className={styles.relicEditorLayout}>
        <div className={styles.relicControls}>
          <section className={styles.relicPanel}>
            <h2 className={styles.relicPanelTitle}>Relic Frames</h2>
            <RelicFrameSelector selected={config.layout} onSelect={handleFrameSelect} />
          </section>

          <section className={styles.relicPanel}>
            <h2 className={styles.relicPanelTitle}>Theme Tokens</h2>
            <RelicThemeControls
              theme={config.theme}
              onChange={(theme) => updateConfig({ theme })}
            />
          </section>

          <section className={styles.relicPanel}>
            <h2 className={styles.relicPanelTitle}>Relic Modules</h2>
            <RelicModuleManager
              modules={config.modules}
              onChange={(modules) => updateConfig({ modules })}
            />
          </section>

          <section className={styles.stabilityPanel}>
            <h2 className={styles.relicPanelTitle}>Signal Stability Check</h2>
            <p className="text-xs text-muted-foreground">
              Your Relic Build should be readable, safe, and comfortable for visitors. Lower
              intensity if the signal becomes unstable.
            </p>
            {warnings.length === 0 ? (
              <p className={styles.stabilityInfo}>Signal stable. No warnings.</p>
            ) : (
              warnings.map((w) => (
                <p
                  key={w.id}
                  className={w.level === "warn" ? styles.stabilityWarn : styles.stabilityInfo}
                >
                  {w.message}
                </p>
              ))
            )}
          </section>

          <div className={styles.relicActions}>
            <CommandButton
              size="sm"
              disabled={pending}
              onClick={() => runAction(saveRelicDraftAction)}
            >
              Save Draft
            </CommandButton>
            <CommandButton
              size="sm"
              disabled={pending}
              onClick={() => runAction(publishRelicBuildAction)}
            >
              Publish Profile
            </CommandButton>
            <CommandButton
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  setMessage(null);
                  const result = await resetRelicDefaultAction();
                  if (result.success) {
                    setMessage("Relic reset to Standard Dossier.");
                  } else {
                    setMessage(result.error ?? "Reset failed.");
                  }
                });
              }}
            >
              Reset Default
            </CommandButton>
            <Link href="/profile/edit">
              <CommandButton size="sm" variant="outline">
                Legacy HTML Editor
              </CommandButton>
            </Link>
          </div>

          {editorData.activeBuildName ? (
            <p className="font-mono text-[10px] text-muted-foreground">
              Active relic: {editorData.activeBuildName}
            </p>
          ) : null}
          {message ? (
            <p className="font-mono text-xs text-primary" role="status">
              {message}
            </p>
          ) : null}
        </div>

        <section className={styles.relicPanel}>
          <h2 className={styles.relicPanelTitle}>Live Preview</h2>
          <RelicPreview world={world} config={config} />
        </section>
      </div>
    </ProfilePageShell>
  );
}
