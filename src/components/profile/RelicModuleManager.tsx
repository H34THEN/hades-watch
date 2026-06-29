"use client";

import type { RelicModuleConfig } from "@/lib/profile/relic-config";
import styles from "@/components/profile/profile-pages.module.css";

const MODULE_LABELS: Record<string, string> = {
  character_card: "Character Card",
  bio: "Biography",
  badges: "Badge / Relic Display",
  faction: "Faction Display",
  missions: "Mission Records",
  ciphers: "Cipher Standing",
  links: "Net Neighbor Links",
  relic_iframe: "Legacy Relic Fragment",
  spotify: "Signal Soundtrack",
};

interface RelicModuleManagerProps {
  modules: RelicModuleConfig[];
  onChange: (modules: RelicModuleConfig[]) => void;
}

export function RelicModuleManager({ modules, onChange }: RelicModuleManagerProps) {
  function toggle(type: string) {
    onChange(
      modules.map((m) => (m.type === type ? { ...m, visible: !m.visible } : m)),
    );
  }

  function updateTitle(type: string, title: string) {
    onChange(
      modules.map((m) => (m.type === type ? { ...m, title: title || undefined } : m)),
    );
  }

  const sorted = [...modules].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      {sorted.map((mod) => (
        <div key={mod.type} className={styles.moduleRow}>
          <span>{MODULE_LABELS[mod.type] ?? mod.type}</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className={styles.themeInput}
              value={mod.title ?? ""}
              placeholder="Module title"
              onChange={(e) => updateTitle(mod.type, e.target.value)}
              aria-label={`Title for ${MODULE_LABELS[mod.type] ?? mod.type}`}
            />
            <input
              type="checkbox"
              checked={mod.visible}
              onChange={() => toggle(mod.type)}
              aria-label={`Show ${MODULE_LABELS[mod.type] ?? mod.type}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
