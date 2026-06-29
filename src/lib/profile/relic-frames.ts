import type { RelicBuildConfig } from "@/lib/profile/relic-config";
import { createDefaultRelicBuild } from "@/lib/profile/relic-config";

export type RelicLayoutKey =
  | "standard_dossier"
  | "terminal_shrine"
  | "faction_banner"
  | "relic_gallery"
  | "profile_world_custom";

export interface RelicFrameDefinition {
  key: RelicLayoutKey;
  name: string;
  description: string;
  previewLabel: string;
  allowedRegions: ("header" | "main" | "sidebar" | "footer")[];
  defaultConfig: () => RelicBuildConfig;
}

export const RELIC_FRAMES: RelicFrameDefinition[] = [
  {
    key: "standard_dossier",
    name: "Standard Dossier",
    description: "Clean official Hades Watch profile layout.",
    previewLabel: "DOSSIER",
    allowedRegions: ["header", "main", "sidebar", "footer"],
    defaultConfig: () => createDefaultRelicBuild("standard_dossier"),
  },
  {
    key: "terminal_shrine",
    name: "Terminal Shrine",
    description: "Underground resistance terminal with command-line panels.",
    previewLabel: "TERMINAL",
    allowedRegions: ["header", "main", "sidebar", "footer"],
    defaultConfig: () => {
      const config = createDefaultRelicBuild("terminal_shrine");
      config.theme.background = "#050508";
      config.theme.panel = "#0d0d14";
      config.theme.accent = "#22c55e";
      config.theme.effects.scanlines = true;
      config.theme.effects.cursor = true;
      return config;
    },
  },
  {
    key: "faction_banner",
    name: "Faction Banner",
    description: "Faction-forward shrine and recruitment style profile.",
    previewLabel: "BANNER",
    allowedRegions: ["header", "main", "sidebar", "footer"],
    defaultConfig: () => {
      const config = createDefaultRelicBuild("faction_banner");
      config.theme.accent = "#dc2626";
      config.theme.glow = "high";
      config.modules = config.modules.map((m) =>
        m.type === "faction" ? { ...m, visible: true, region: "header" as const } : m,
      );
      return config;
    },
  },
  {
    key: "relic_gallery",
    name: "Relic Gallery",
    description: "Visual collection for badges, relics, outfits, and lore fragments.",
    previewLabel: "GALLERY",
    allowedRegions: ["header", "main", "sidebar", "footer"],
    defaultConfig: () => {
      const config = createDefaultRelicBuild("relic_gallery");
      config.theme.accent = "#a855f7";
      config.modules = config.modules.map((m) =>
        m.type === "badges" ? { ...m, visible: true, region: "main" as const } : m,
      );
      return config;
    },
  },
  {
    key: "profile_world_custom",
    name: "Profile World Custom",
    description: "Freeform modular canvas within safe Relic Zone limits.",
    previewLabel: "CUSTOM",
    allowedRegions: ["header", "main", "sidebar", "footer"],
    defaultConfig: () => createDefaultRelicBuild("profile_world_custom"),
  },
];

export function getRelicFrame(key: RelicLayoutKey): RelicFrameDefinition {
  return RELIC_FRAMES.find((f) => f.key === key) ?? RELIC_FRAMES[0];
}
