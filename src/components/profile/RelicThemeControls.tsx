"use client";

import type { RelicThemeConfig } from "@/lib/profile/relic-config";
import styles from "@/components/profile/profile-pages.module.css";

interface RelicThemeControlsProps {
  theme: RelicThemeConfig;
  onChange: (theme: RelicThemeConfig) => void;
}

export function RelicThemeControls({ theme, onChange }: RelicThemeControlsProps) {
  function update<K extends keyof RelicThemeConfig>(key: K, value: RelicThemeConfig[K]) {
    onChange({ ...theme, [key]: value });
  }

  return (
    <div>
      <div className={styles.themeRow}>
        <label className={styles.themeLabel}>
          Background
          <input
            type="color"
            className={styles.themeInput}
            value={theme.background}
            onChange={(e) => update("background", e.target.value)}
          />
        </label>
        <label className={styles.themeLabel}>
          Panel
          <input
            type="color"
            className={styles.themeInput}
            value={theme.panel}
            onChange={(e) => update("panel", e.target.value)}
          />
        </label>
        <label className={styles.themeLabel}>
          Accent
          <input
            type="color"
            className={styles.themeInput}
            value={theme.accent}
            onChange={(e) => update("accent", e.target.value)}
          />
        </label>
        <label className={styles.themeLabel}>
          Text
          <input
            type="color"
            className={styles.themeInput}
            value={theme.text}
            onChange={(e) => update("text", e.target.value)}
          />
        </label>
        <label className={styles.themeLabel}>
          Link
          <input
            type="color"
            className={styles.themeInput}
            value={theme.link}
            onChange={(e) => update("link", e.target.value)}
          />
        </label>
        <label className={styles.themeLabel}>
          Font
          <select
            className={styles.themeInput}
            value={theme.font}
            onChange={(e) => update("font", e.target.value as RelicThemeConfig["font"])}
          >
            <option value="terminal">Terminal</option>
            <option value="sans">Sans</option>
            <option value="serif">Serif</option>
          </select>
        </label>
        <label className={styles.themeLabel}>
          Border
          <select
            className={styles.themeInput}
            value={theme.border}
            onChange={(e) => update("border", e.target.value as RelicThemeConfig["border"])}
          >
            <option value="solid">Solid</option>
            <option value="double">Double</option>
            <option value="dashed">Dashed</option>
          </select>
        </label>
        <label className={styles.themeLabel}>
          Glow
          <select
            className={styles.themeInput}
            value={theme.glow}
            onChange={(e) => update("glow", e.target.value as RelicThemeConfig["glow"])}
          >
            <option value="off">Off</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div className={styles.moduleRow}>
        <span>Scanlines</span>
        <input
          type="checkbox"
          checked={theme.effects.scanlines}
          onChange={(e) =>
            onChange({
              ...theme,
              effects: { ...theme.effects, scanlines: e.target.checked },
            })
          }
          aria-label="Enable scanlines"
        />
      </div>
      <div className={styles.moduleRow}>
        <span>Glitch</span>
        <select
          className={styles.themeInput}
          value={theme.effects.glitch}
          onChange={(e) =>
            onChange({
              ...theme,
              effects: {
                ...theme.effects,
                glitch: e.target.value as RelicThemeConfig["effects"]["glitch"],
              },
            })
          }
        >
          <option value="off">Off</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className={styles.moduleRow}>
        <span>Terminal Cursor</span>
        <input
          type="checkbox"
          checked={theme.effects.cursor}
          onChange={(e) =>
            onChange({
              ...theme,
              effects: { ...theme.effects, cursor: e.target.checked },
            })
          }
          aria-label="Enable terminal cursor effect"
        />
      </div>
    </div>
  );
}
