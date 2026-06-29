import {
  BANNER_SIZE_PRESETS,
  DEFAULT_BANNER_STYLE,
  GRADIENT_PRESETS,
  normalizeBannerStyle,
  parseBannerStyleJson,
  type NetNeighborBannerStyle,
} from "@/lib/net-neighbors/banner-builder";

export const FORUM_BUTTON_SIZE_PRESETS = BANNER_SIZE_PRESETS.filter((s) =>
  ["88x31", "120x40", "180x60", "234x60"].includes(s.id),
);

export const FORUM_BANNER_SIZE_PRESETS = [
  ...BANNER_SIZE_PRESETS,
  { id: "468x60", width: 468, height: 60, label: "468×60 classic forum banner" },
  { id: "96x96", width: 96, height: 96, label: "96×96 square badge" },
];

export const FORUM_THEME_PRESETS = [
  { id: "dead-index-violet", label: "Dead Index Violet" },
  { id: "styx-neon-rat", label: "Styx Neon Rat" },
  { id: "asclepian-green", label: "Asclepian Green Pulse" },
  { id: "oracular-blue", label: "Oracular Signal Blue" },
  { id: "daedalus-brass", label: "Daedalus Brass Grid" },
  { id: "myrmidon-amber", label: "Myrmidon Warning Amber" },
  { id: "underworld-red", label: "Underworld Redline" },
  { id: "bone-terminal", label: "Bone Terminal" },
  { id: "ghost-in-tech-mono", label: "Ghost in Tech Mono" },
  { id: "pomegranate-gate", label: "Pomegranate Gate" },
] as const;

export const FORUM_HOVER_EFFECTS = [
  { id: "none", label: "No effect" },
  { id: "soft-glow", label: "Soft glow" },
  { id: "scanline-flicker", label: "Scanline flicker" },
  { id: "glitch-nudge", label: "Glitch nudge" },
  { id: "invert-border", label: "Invert border" },
  { id: "terminal-pulse", label: "Terminal cursor pulse" },
] as const;

export const FORUM_STYLE_PRESETS = [
  { id: "terminal-dark", label: "Terminal Dark" },
  { id: "relay-violet", label: "Relay Violet" },
  { id: "bone-index", label: "Bone Index" },
  { id: "rat-nest", label: "Rat Nest Neon" },
] as const;

export type ForumHoverEffectId = (typeof FORUM_HOVER_EFFECTS)[number]["id"];

export interface ForumSignatureConfig extends NetNeighborBannerStyle {
  hoverEffect?: ForumHoverEffectId;
  glowLevel?: "none" | "low" | "medium" | "high";
  glitchLevel?: "none" | "low" | "medium";
}

export const DEFAULT_FORUM_BUTTON_CONFIG: ForumSignatureConfig = {
  ...DEFAULT_BANNER_STYLE,
  text: "UNDERWATCH",
  subtext: "",
  gradientPreset: "dead-index-violet",
  hoverEffect: "soft-glow",
  glowLevel: "medium",
  glitchLevel: "none",
};

export function normalizeForumSignatureConfig(
  raw: Partial<ForumSignatureConfig>,
  assetType: "BUTTON" | "BANNER" = "BUTTON",
): ForumSignatureConfig {
  const presets = assetType === "BANNER" ? FORUM_BANNER_SIZE_PRESETS : FORUM_BUTTON_SIZE_PRESETS;
  const size =
    presets.find((s) => s.id === raw.size) ??
    presets.find((s) => s.width === raw.width && s.height === raw.height) ??
    presets[0];

  const base = normalizeBannerStyle({
    ...DEFAULT_FORUM_BUTTON_CONFIG,
    ...raw,
    size: size.id,
    width: size.width,
    height: size.height,
  });

  const hover = FORUM_HOVER_EFFECTS.find((h) => h.id === raw.hoverEffect)?.id ?? "soft-glow";
  const glowLevel =
    raw.glowLevel === "none" || raw.glowLevel === "low" || raw.glowLevel === "high"
      ? raw.glowLevel
      : "medium";
  const glitchLevel =
    raw.glitchLevel === "none" || raw.glitchLevel === "low" || raw.glitchLevel === "medium"
      ? raw.glitchLevel
      : "none";

  return {
    ...base,
    hoverEffect: hover,
    glowLevel,
    glitchLevel,
    gradientPreset:
      GRADIENT_PRESETS.find((g) => g.id === raw.gradientPreset)?.id ??
      base.gradientPreset,
  };
}

export function parseForumSignatureConfig(raw: unknown): ForumSignatureConfig | null {
  if (!raw) return null;
  const parsed = parseBannerStyleJson(raw);
  if (!parsed) return null;
  return normalizeForumSignatureConfig(parsed as ForumSignatureConfig);
}

export function configToPrimaryText(config: ForumSignatureConfig): string {
  return config.text.slice(0, 24);
}

export function configToSecondaryText(config: ForumSignatureConfig): string {
  return (config.subtext ?? "").slice(0, 32);
}
