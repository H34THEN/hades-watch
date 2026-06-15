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

export const BANNER_SIZE_PRESETS = [
  { id: "88x31", width: 88, height: 31, label: "88×31 classic" },
  { id: "120x40", width: 120, height: 40, label: "120×40" },
  { id: "180x60", width: 180, height: 60, label: "180×60" },
] as const;

export const BANNER_GLYPHS = ["◈", "☍", "⌁", "⚡", "☠", "✦", "⛧", ""] as const;

export interface NetNeighborBannerStyle {
  preset: string;
  text: string;
  subtext?: string;
  width: number;
  height: number;
  scanlines: boolean;
  flicker: boolean;
  glyph: string;
}

export const DEFAULT_BANNER_STYLE: NetNeighborBannerStyle = {
  preset: "dead-index-violet",
  text: "HADES WATCH",
  subtext: "",
  width: 88,
  height: 31,
  scanlines: true,
  flicker: false,
  glyph: "◈",
};

export function parseBannerStyleJson(raw: unknown): NetNeighborBannerStyle | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const preset = typeof o.preset === "string" ? o.preset : DEFAULT_BANNER_STYLE.preset;
  const text = typeof o.text === "string" ? o.text.slice(0, 24) : "";
  const subtext = typeof o.subtext === "string" ? o.subtext.slice(0, 20) : "";
  const width = typeof o.width === "number" ? o.width : 88;
  const height = typeof o.height === "number" ? o.height : 31;
  const scanlines = o.scanlines !== false;
  const flicker = o.flicker === true;
  const glyph = typeof o.glyph === "string" ? o.glyph.slice(0, 2) : "";
  if (!text.trim()) return null;
  return { preset, text: text.trim(), subtext: subtext.trim(), width, height, scanlines, flicker, glyph };
}

export function parseBannerStyleForm(formData: FormData): NetNeighborBannerStyle | null {
  const useBuilder = formData.get("useBannerBuilder") === "true";
  if (!useBuilder) return null;
  const preset = String(formData.get("bannerPreset") ?? DEFAULT_BANNER_STYLE.preset);
  const text = String(formData.get("bannerText") ?? "").trim().slice(0, 24);
  if (!text) return null;
  const sizeId = String(formData.get("bannerSize") ?? "88x31");
  const size =
    BANNER_SIZE_PRESETS.find((s) => s.id === sizeId) ?? BANNER_SIZE_PRESETS[0];
  return {
    preset,
    text,
    subtext: String(formData.get("bannerSubtext") ?? "").trim().slice(0, 20),
    width: size.width,
    height: size.height,
    scanlines: formData.get("bannerScanlines") !== "false",
    flicker: formData.get("bannerFlicker") === "true",
    glyph: String(formData.get("bannerGlyph") ?? "").slice(0, 2),
  };
}

export function escapeBannerText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
