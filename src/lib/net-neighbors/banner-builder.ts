export const BANNER_PRESETS = [
  { id: "dead-index-violet", label: "Dead Index Violet" },
  { id: "styx-neon-rat", label: "Styx Neon Rat" },
  { id: "asclepian-green", label: "Asclepian Green Pulse" },
  { id: "oracular-blue", label: "Oracular Signal Blue" },
  { id: "daedalus-brass", label: "Daedalus Brass Grid" },
  { id: "myrmidon-amber", label: "Myrmidon Warning Amber" },
  { id: "underworld-red", label: "Underworld Redline" },
  { id: "bone-terminal", label: "Bone Terminal" },
] as const;

export const GRADIENT_PRESETS = [
  { id: "underworld-redline", label: "Underworld Redline" },
  { id: "dead-index-violet", label: "Dead Index Violet" },
  { id: "bone-terminal", label: "Bone Terminal" },
  { id: "styx-neon-rat", label: "Styx Neon Rat" },
  { id: "oracular-blue", label: "Oracular Signal Blue" },
  { id: "asclepian-green", label: "Asclepian Green Pulse" },
  { id: "daedalus-brass", label: "Daedalus Brass Grid" },
  { id: "myrmidon-amber", label: "Myrmidon Warning Amber" },
  { id: "void-black", label: "Void Black" },
  { id: "toxic-terminal", label: "Toxic Terminal" },
] as const;

export const BANNER_SIZE_PRESETS = [
  { id: "88x31", width: 88, height: 31, label: "88×31 classic" },
  { id: "120x40", width: 120, height: 40, label: "120×40" },
  { id: "180x60", width: 180, height: 60, label: "180×60" },
  { id: "234x60", width: 234, height: 60, label: "234×60" },
] as const;

export const BANNER_GLYPHS = ["◈", "☍", "⌁", "⚡", "☠", "✦", "⛧", ""] as const;

export const BANNER_FONTS = [
  "Verdana",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "monospace",
  "sans-serif",
  "serif",
  "system-ui",
] as const;

export const FACTION_ACCENTS = [
  { id: "", label: "None" },
  { id: "dead-index", label: "Dead Index" },
  { id: "styx-rats", label: "Styx Rats" },
  { id: "asclepian-veil", label: "Asclepian Veil" },
  { id: "oracular-circuit", label: "Oracular Circuit" },
  { id: "daedalus-foundry", label: "Daedalus Foundry" },
  { id: "myrmidon-grinders", label: "Myrmidon Grinders" },
  { id: "chthonic-uprising", label: "Chthonic Uprising" },
] as const;

export const ICON_POSITIONS = [
  "left",
  "right",
  "center",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export interface NetNeighborBannerStyle {
  version: number;
  preset: string;
  size: string;
  width: number;
  height: number;
  text: string;
  subtext?: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline" | "overline" | "line-through";
  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
  textColor: string;
  backgroundColor: string;
  accentColor: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: "solid" | "dashed" | "dotted" | "double";
  gradientPreset: string;
  scanlines: boolean;
  flicker: boolean;
  glow: boolean;
  cornerBrackets: boolean;
  pixelBorder: boolean;
  warningStripe: boolean;
  terminalGrid: boolean;
  blinkingDot: boolean;
  underlineRail: boolean;
  factionAccent: string;
  glyph: string;
  textShadow: boolean;
  textOffsetX: number;
  textOffsetY: number;
  iconPosition: string;
  imageWidth: number;
  imageHeight: number;
  iconOffsetX: number;
  iconOffsetY: number;
  iconOpacity: number;
  pixelArtMode: boolean;
  iconPath?: string;
  iconPreviewUrl?: string;
}

export const DEFAULT_BANNER_STYLE: NetNeighborBannerStyle = {
  version: 1,
  preset: "dead-index-violet",
  size: "88x31",
  width: 88,
  height: 31,
  text: "HADES WATCH",
  subtext: "",
  fontFamily: "Verdana",
  fontSize: 9,
  fontWeight: "bold",
  fontStyle: "normal",
  textDecoration: "none",
  textAlign: "center",
  verticalAlign: "middle",
  textColor: "#e8d4ff",
  backgroundColor: "#12051f",
  accentColor: "#b84cff",
  borderColor: "#b84cff",
  borderWidth: 1,
  borderStyle: "solid",
  gradientPreset: "dead-index-violet",
  scanlines: true,
  flicker: false,
  glow: true,
  cornerBrackets: false,
  pixelBorder: false,
  warningStripe: false,
  terminalGrid: false,
  blinkingDot: false,
  underlineRail: false,
  factionAccent: "",
  glyph: "◈",
  textShadow: true,
  textOffsetX: 0,
  textOffsetY: 0,
  iconPosition: "left",
  imageWidth: 14,
  imageHeight: 14,
  iconOffsetX: 0,
  iconOffsetY: 0,
  iconOpacity: 1,
  pixelArtMode: true,
};

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

function safeHex(value: unknown, fallback: string): string {
  if (typeof value === "string" && HEX_COLOR.test(value)) return value;
  return fallback;
}

function safeNum(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function safeEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  return fallback;
}

export function normalizeBannerStyle(raw: Partial<NetNeighborBannerStyle>): NetNeighborBannerStyle {
  const size =
    BANNER_SIZE_PRESETS.find((s) => s.id === raw.size) ??
    BANNER_SIZE_PRESETS.find((s) => s.width === raw.width && s.height === raw.height) ??
    BANNER_SIZE_PRESETS[0];

  return {
    ...DEFAULT_BANNER_STYLE,
    ...raw,
    version: 1,
    size: size.id,
    width: size.width,
    height: size.height,
    text: String(raw.text ?? DEFAULT_BANNER_STYLE.text).trim().slice(0, 24),
    subtext: String(raw.subtext ?? "").trim().slice(0, 32),
    fontFamily: safeEnum(raw.fontFamily, BANNER_FONTS, "Verdana"),
    fontSize: safeNum(raw.fontSize, 9, 6, 14),
    fontWeight: raw.fontWeight === "normal" ? "normal" : "bold",
    fontStyle: raw.fontStyle === "italic" ? "italic" : "normal",
    textDecoration: safeEnum(
      raw.textDecoration,
      ["none", "underline", "overline", "line-through"] as const,
      "none",
    ),
    textAlign: safeEnum(raw.textAlign, ["left", "center", "right"] as const, "center"),
    verticalAlign: safeEnum(raw.verticalAlign, ["top", "middle", "bottom"] as const, "middle"),
    textColor: safeHex(raw.textColor, DEFAULT_BANNER_STYLE.textColor),
    backgroundColor: safeHex(raw.backgroundColor, DEFAULT_BANNER_STYLE.backgroundColor),
    accentColor: safeHex(raw.accentColor, DEFAULT_BANNER_STYLE.accentColor),
    borderColor: safeHex(raw.borderColor, DEFAULT_BANNER_STYLE.borderColor),
    borderWidth: safeNum(raw.borderWidth, 1, 0, 4),
    borderStyle: safeEnum(
      raw.borderStyle,
      ["solid", "dashed", "dotted", "double"] as const,
      "solid",
    ),
    gradientPreset:
      GRADIENT_PRESETS.find((g) => g.id === raw.gradientPreset)?.id ??
      raw.preset ??
      DEFAULT_BANNER_STYLE.gradientPreset,
    preset:
      BANNER_PRESETS.find((p) => p.id === raw.preset)?.id ?? DEFAULT_BANNER_STYLE.preset,
    scanlines: raw.scanlines !== false,
    flicker: raw.flicker === true,
    glow: raw.glow !== false,
    cornerBrackets: raw.cornerBrackets === true,
    pixelBorder: raw.pixelBorder === true,
    warningStripe: raw.warningStripe === true,
    terminalGrid: raw.terminalGrid === true,
    blinkingDot: raw.blinkingDot === true,
    underlineRail: raw.underlineRail === true,
    factionAccent: String(raw.factionAccent ?? "").slice(0, 32),
    glyph: String(raw.glyph ?? "").slice(0, 2),
    textShadow: raw.textShadow !== false,
    textOffsetX: safeNum(raw.textOffsetX, 0, -12, 12),
    textOffsetY: safeNum(raw.textOffsetY, 0, -8, 8),
    iconPosition: safeEnum(raw.iconPosition, ICON_POSITIONS, "left"),
    imageWidth: safeNum(raw.imageWidth, 14, 8, 40),
    imageHeight: safeNum(raw.imageHeight, 14, 8, 40),
    iconOffsetX: safeNum(raw.iconOffsetX, 0, -20, 20),
    iconOffsetY: safeNum(raw.iconOffsetY, 0, -12, 12),
    iconOpacity: safeNum(raw.iconOpacity, 1, 0.2, 1),
    pixelArtMode: raw.pixelArtMode !== false,
    iconPath: typeof raw.iconPath === "string" ? raw.iconPath : undefined,
    iconPreviewUrl: typeof raw.iconPreviewUrl === "string" ? raw.iconPreviewUrl : undefined,
  };
}

export function parseBannerStyleJson(raw: unknown): NetNeighborBannerStyle | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const text = typeof o.text === "string" ? o.text.trim() : "";
  if (!text) return null;
  return normalizeBannerStyle(o as Partial<NetNeighborBannerStyle>);
}

export function parseBannerStyleForm(formData: FormData): NetNeighborBannerStyle | null {
  const useBuilder = formData.get("useBannerBuilder") === "true";
  if (!useBuilder) return null;

  const jsonRaw = formData.get("bannerStyleJson");
  if (typeof jsonRaw === "string" && jsonRaw.trim()) {
    try {
      const parsed = JSON.parse(jsonRaw) as Partial<NetNeighborBannerStyle>;
      if (!parsed.text?.trim()) return null;
      return normalizeBannerStyle(parsed);
    } catch {
      return null;
    }
  }

  const text = String(formData.get("bannerText") ?? "").trim();
  if (!text) return null;
  return normalizeBannerStyle({
    preset: String(formData.get("bannerPreset") ?? DEFAULT_BANNER_STYLE.preset),
    text,
    subtext: String(formData.get("bannerSubtext") ?? ""),
    size: String(formData.get("bannerSize") ?? "88x31"),
    scanlines: formData.get("bannerScanlines") !== "false",
    flicker: formData.get("bannerFlicker") === "true",
    glyph: String(formData.get("bannerGlyph") ?? ""),
  });
}

export function escapeBannerText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getGradientCss(presetId: string): string {
  const map: Record<string, string> = {
    "underworld-redline": "linear-gradient(180deg, #1a0808 0%, #4a1010 100%)",
    "dead-index-violet": "linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 100%)",
    "bone-terminal": "linear-gradient(180deg, #1a1814 0%, #2d2a24 100%)",
    "styx-neon-rat": "linear-gradient(180deg, #0a1a10 0%, #143d28 100%)",
    "oracular-blue": "linear-gradient(180deg, #0a1628 0%, #1e3a5f 100%)",
    "asclepian-green": "linear-gradient(180deg, #0d2818 0%, #1a4d32 100%)",
    "daedalus-brass": "linear-gradient(180deg, #1a1408 0%, #3d3018 100%)",
    "myrmidon-amber": "linear-gradient(180deg, #2a1800 0%, #5c3a08 100%)",
    "void-black": "linear-gradient(180deg, #030508 0%, #0a0e14 100%)",
    "toxic-terminal": "linear-gradient(180deg, #0a1a08 0%, #1a3d10 50%, #0a1a08 100%)",
  };
  return map[presetId] ?? map["dead-index-violet"];
}
