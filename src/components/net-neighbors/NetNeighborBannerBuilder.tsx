"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NetNeighborButton } from "@/components/net-neighbors/NetNeighborButton";
import {
  BANNER_FONTS,
  BANNER_GLYPHS,
  BANNER_SIZE_PRESETS,
  DEFAULT_BANNER_STYLE,
  FACTION_ACCENTS,
  GRADIENT_PRESETS,
  ICON_POSITIONS,
  normalizeBannerStyle,
  type NetNeighborBannerStyle,
} from "@/lib/net-neighbors/banner-builder";
import styles from "./net-neighbors.module.css";

type BuilderTab = "background" | "image" | "text" | "fancy" | "border";

interface NetNeighborBannerBuilderProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export function NetNeighborBannerBuilder({
  enabled,
  onEnabledChange,
}: NetNeighborBannerBuilderProps) {
  const [style, setStyle] = useState<NetNeighborBannerStyle>(DEFAULT_BANNER_STYLE);
  const [tab, setTab] = useState<BuilderTab>("background");
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const previewStyle = useMemo(
    () => ({
      ...style,
      iconPreviewUrl: iconPreview ?? undefined,
    }),
    [style, iconPreview],
  );

  function update<K extends keyof NetNeighborBannerStyle>(
    key: K,
    value: NetNeighborBannerStyle[K],
  ) {
    setStyle((s) => normalizeBannerStyle({ ...s, [key]: value }));
  }

  function handleIconFile(file: File | undefined) {
    if (!file) {
      setIconPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setIconPreview(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    return () => {
      if (iconPreview?.startsWith("blob:")) URL.revokeObjectURL(iconPreview);
    };
  }, [iconPreview]);

  const tabs: { id: BuilderTab; label: string }[] = [
    { id: "background", label: "Backgrounds" },
    { id: "image", label: "Add Image" },
    { id: "text", label: "Add Text" },
    { id: "fancy", label: "Fancy Details" },
    { id: "border", label: "Border" },
  ];

  return (
    <div className={`${styles.hudFrame} p-4`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-mono text-sm tracking-wider uppercase text-primary">
            Signal Button Forge
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Forge a tiny signal button for the Underwatch wall.
          </p>
        </div>
        <label className="flex items-center gap-2 font-mono text-xs">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
          />
          Use generated banner
        </label>
      </div>

      {enabled && (
        <>
          <input type="hidden" name="useBannerBuilder" value="true" />
          <input type="hidden" name="bannerStyleJson" value={JSON.stringify(previewStyle)} />

          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div className="rounded border border-border/40 bg-black/60 p-3">
              <p className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">
                Actual Size
              </p>
              <NetNeighborButton title="Preview" bannerStyle={previewStyle} />
            </div>
            <div className="rounded border border-border/40 bg-black/60 p-3">
              <p className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">
                Zoomed Preview (3×)
              </p>
              <NetNeighborButton title="Preview" bannerStyle={previewStyle} zoom={3} />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`border px-2 py-1 font-mono text-[10px] uppercase ${
                  tab === t.id ? "border-primary text-primary" : "border-border/50 text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "background" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs uppercase">Gradient Preset</Label>
                <select
                  value={style.gradientPreset}
                  onChange={(e) => update("gradientPreset", e.target.value)}
                  className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
                >
                  {GRADIENT_PRESETS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs uppercase">Background Color</Label>
                <Input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => update("backgroundColor", e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Accent Color</Label>
                <Input
                  type="color"
                  value={style.accentColor}
                  onChange={(e) => update("accentColor", e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Size</Label>
                <select
                  value={style.size}
                  onChange={(e) => {
                    const size = BANNER_SIZE_PRESETS.find((s) => s.id === e.target.value);
                    if (size) {
                      setStyle((s) =>
                        normalizeBannerStyle({
                          ...s,
                          size: size.id,
                          width: size.width,
                          height: size.height,
                        }),
                      );
                    }
                  }}
                  className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
                >
                  {BANNER_SIZE_PRESETS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {tab === "image" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label className="text-xs uppercase">Icon / Image (PNG/GIF/JPG/WEBP)</Label>
                <Input
                  type="file"
                  name="builderIcon"
                  accept="image/gif,image/png,image/jpeg,image/webp"
                  className="mt-1"
                  onChange={(e) => handleIconFile(e.target.files?.[0])}
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Icon Position</Label>
                <select
                  value={style.iconPosition}
                  onChange={(e) => update("iconPosition", e.target.value)}
                  className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
                >
                  {ICON_POSITIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs uppercase">Glyph / Sigil</Label>
                <select
                  value={style.glyph}
                  onChange={(e) => update("glyph", e.target.value)}
                  className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
                >
                  {BANNER_GLYPHS.map((g) => (
                    <option key={g || "none"} value={g}>
                      {g || "None"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs uppercase">Image W × H</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    type="number"
                    min={8}
                    max={40}
                    value={style.imageWidth}
                    onChange={(e) => update("imageWidth", Number(e.target.value))}
                    className="font-mono text-xs"
                  />
                  <Input
                    type="number"
                    min={8}
                    max={40}
                    value={style.imageHeight}
                    onChange={(e) => update("imageHeight", Number(e.target.value))}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 font-mono text-xs">
                <input
                  type="checkbox"
                  checked={style.pixelArtMode}
                  onChange={(e) => update("pixelArtMode", e.target.checked)}
                />
                Pixel-art mode
              </label>
            </div>
          )}

          {tab === "text" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs uppercase">Main Text</Label>
                <Input
                  value={style.text}
                  onChange={(e) => update("text", e.target.value.slice(0, 24))}
                  maxLength={24}
                  className="mt-1 font-mono text-xs"
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Subtext</Label>
                <Input
                  value={style.subtext ?? ""}
                  onChange={(e) => update("subtext", e.target.value.slice(0, 32))}
                  maxLength={32}
                  className="mt-1 font-mono text-xs"
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Font</Label>
                <select
                  value={style.fontFamily}
                  onChange={(e) => update("fontFamily", e.target.value)}
                  className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
                >
                  {BANNER_FONTS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs uppercase">Font Size</Label>
                <Input
                  type="number"
                  min={6}
                  max={14}
                  value={style.fontSize}
                  onChange={(e) => update("fontSize", Number(e.target.value))}
                  className="mt-1 font-mono text-xs"
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Text Color</Label>
                <Input
                  type="color"
                  value={style.textColor}
                  onChange={(e) => update("textColor", e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Alignment</Label>
                <select
                  value={style.textAlign}
                  onChange={(e) =>
                    update("textAlign", e.target.value as NetNeighborBannerStyle["textAlign"])
                  }
                  className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <label className="flex items-center gap-2 font-mono text-xs">
                <input
                  type="checkbox"
                  checked={style.fontWeight === "bold"}
                  onChange={(e) => update("fontWeight", e.target.checked ? "bold" : "normal")}
                />
                Bold
              </label>
              <label className="flex items-center gap-2 font-mono text-xs">
                <input
                  type="checkbox"
                  checked={style.textShadow}
                  onChange={(e) => update("textShadow", e.target.checked)}
                />
                Text glow
              </label>
            </div>
          )}

          {tab === "fancy" && (
            <div className="grid gap-2 sm:grid-cols-2 font-mono text-xs">
              {(
                [
                  ["scanlines", "Scanlines"],
                  ["flicker", "Flicker"],
                  ["glow", "Glow edge"],
                  ["cornerBrackets", "Corner brackets"],
                  ["pixelBorder", "Pixel border"],
                  ["warningStripe", "Warning stripe"],
                  ["terminalGrid", "Terminal grid"],
                  ["blinkingDot", "Blinking dot"],
                  ["underlineRail", "Underline rail"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={style[key]}
                    onChange={(e) => update(key, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
              <div className="sm:col-span-2">
                <Label className="text-xs uppercase">Faction Accent</Label>
                <select
                  value={style.factionAccent}
                  onChange={(e) => update("factionAccent", e.target.value)}
                  className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
                >
                  {FACTION_ACCENTS.map((f) => (
                    <option key={f.id || "none"} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {tab === "border" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs uppercase">Border Color</Label>
                <Input
                  type="color"
                  value={style.borderColor}
                  onChange={(e) => update("borderColor", e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Border Width</Label>
                <Input
                  type="number"
                  min={0}
                  max={4}
                  value={style.borderWidth}
                  onChange={(e) => update("borderWidth", Number(e.target.value))}
                  className="mt-1 font-mono text-xs"
                />
              </div>
              <div>
                <Label className="text-xs uppercase">Border Style</Label>
                <select
                  value={style.borderStyle}
                  onChange={(e) =>
                    update("borderStyle", e.target.value as NetNeighborBannerStyle["borderStyle"])
                  }
                  className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
