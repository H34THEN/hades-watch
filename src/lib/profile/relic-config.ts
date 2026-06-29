import type { RelicLayoutKey } from "@/lib/profile/relic-frames";

export type RelicFontKey = "terminal" | "sans" | "serif";
export type RelicBorderKey = "solid" | "double" | "dashed";
export type RelicGlowKey = "off" | "low" | "medium" | "high";
export type RelicGlitchKey = "off" | "low";
export type RelicModuleRegion = "header" | "main" | "sidebar" | "footer";

export type RelicModuleType =
  | "character_card"
  | "bio"
  | "badges"
  | "faction"
  | "missions"
  | "ciphers"
  | "links"
  | "relic_iframe"
  | "spotify";

export interface RelicThemeConfig {
  background: string;
  panel: string;
  accent: string;
  text: string;
  link: string;
  font: RelicFontKey;
  border: RelicBorderKey;
  glow: RelicGlowKey;
  cornerRadius: number;
  effects: {
    scanlines: boolean;
    glitch: RelicGlitchKey;
    cursor: boolean;
  };
}

export interface RelicModuleConfig {
  type: RelicModuleType;
  region: RelicModuleRegion;
  title?: string;
  visible: boolean;
  sortOrder: number;
}

export interface RelicBuildConfig {
  layout: RelicLayoutKey;
  theme: RelicThemeConfig;
  modules: RelicModuleConfig[];
}

export const DEFAULT_RELIC_THEME: RelicThemeConfig = {
  background: "#08080d",
  panel: "#151522",
  accent: "#d93bff",
  text: "#f4f4f8",
  link: "#22c55e",
  font: "terminal",
  border: "double",
  glow: "medium",
  cornerRadius: 4,
  effects: {
    scanlines: true,
    glitch: "low",
    cursor: true,
  },
};

export const DEFAULT_RELIC_MODULES: RelicModuleConfig[] = [
  { type: "character_card", region: "header", visible: true, sortOrder: 0 },
  { type: "bio", region: "main", title: "Encrypted Biography", visible: true, sortOrder: 1 },
  { type: "faction", region: "main", title: "Faction Standing", visible: true, sortOrder: 2 },
  { type: "badges", region: "sidebar", title: "Recovered Relics", visible: true, sortOrder: 3 },
  { type: "missions", region: "main", title: "Mission Records", visible: true, sortOrder: 4 },
  { type: "ciphers", region: "main", title: "Cipher Standing", visible: true, sortOrder: 5 },
  { type: "links", region: "footer", title: "Net Neighbor Links", visible: true, sortOrder: 6 },
  { type: "relic_iframe", region: "main", title: "Relic Zone Fragment", visible: false, sortOrder: 7 },
  { type: "spotify", region: "footer", title: "Signal Soundtrack", visible: false, sortOrder: 8 },
];

export function createDefaultRelicBuild(layout: RelicLayoutKey = "standard_dossier"): RelicBuildConfig {
  return {
    layout,
    theme: { ...DEFAULT_RELIC_THEME },
    modules: DEFAULT_RELIC_MODULES.map((m) => ({ ...m })),
  };
}

export function parseRelicBuildConfig(raw: unknown): RelicBuildConfig {
  if (!raw || typeof raw !== "object") return createDefaultRelicBuild();
  const data = raw as Partial<RelicBuildConfig>;
  const layout = data.layout ?? "standard_dossier";
  const theme = { ...DEFAULT_RELIC_THEME, ...(data.theme ?? {}) };
  const modules =
    Array.isArray(data.modules) && data.modules.length > 0
      ? data.modules.map((m, i) => ({
          type: (m as RelicModuleConfig).type ?? "bio",
          region: (m as RelicModuleConfig).region ?? "main",
          title: (m as RelicModuleConfig).title,
          visible: (m as RelicModuleConfig).visible !== false,
          sortOrder: (m as RelicModuleConfig).sortOrder ?? i,
        }))
      : DEFAULT_RELIC_MODULES.map((m) => ({ ...m }));
  return { layout, theme, modules };
}

export function relicThemeToCssVars(theme: RelicThemeConfig): Record<string, string> {
  const glowMap: Record<RelicGlowKey, string> = {
    off: "0",
    low: "0.15",
    medium: "0.35",
    high: "0.55",
  };
  const fontMap: Record<RelicFontKey, string> = {
    terminal: "var(--font-mono, monospace)",
    sans: "system-ui, sans-serif",
    serif: "Georgia, serif",
  };
  return {
    "--pw-bg": theme.background,
    "--pw-panel": theme.panel,
    "--pw-accent": theme.accent,
    "--pw-text": theme.text,
    "--pw-link": theme.link,
    "--pw-glow": glowMap[theme.glow] ?? "0.35",
    "--pw-radius": `${theme.cornerRadius}px`,
    "--pw-font": fontMap[theme.font] ?? fontMap.terminal,
  };
}

export interface SignalStabilityWarning {
  id: string;
  level: "warn" | "info";
  message: string;
}

export function checkSignalStability(config: RelicBuildConfig): SignalStabilityWarning[] {
  const warnings: SignalStabilityWarning[] = [];
  const { theme } = config;

  function luminance(hex: string): number {
    const c = hex.replace("#", "");
    if (c.length !== 6) return 0.5;
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  const textLum = luminance(theme.text);
  const bgLum = luminance(theme.background);
  if (Math.abs(textLum - bgLum) < 0.25) {
    warnings.push({
      id: "contrast",
      level: "warn",
      message: "Text and background contrast may be too low for comfortable reading.",
    });
  }

  if (theme.glow === "high" && theme.effects.glitch !== "off") {
    warnings.push({
      id: "effects",
      level: "warn",
      message: "High glow with glitch effects may feel unstable for some visitors.",
    });
  }

  if (theme.effects.scanlines && theme.effects.glitch === "low" && theme.glow !== "off") {
    warnings.push({
      id: "stacked-effects",
      level: "info",
      message: "Multiple visual effects are active. Consider lowering intensity.",
    });
  }

  const essential = config.modules.filter((m) =>
    ["character_card", "bio"].includes(m.type),
  );
  if (essential.every((m) => !m.visible)) {
    warnings.push({
      id: "hidden-essential",
      level: "warn",
      message: "Character identity or biography modules are hidden.",
    });
  }

  return warnings;
}
