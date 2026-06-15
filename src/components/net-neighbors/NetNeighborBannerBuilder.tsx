"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NetNeighborGeneratedBanner } from "@/components/net-neighbors/NetNeighborGeneratedBanner";
import {
  BANNER_GLYPHS,
  BANNER_PRESETS,
  BANNER_SIZE_PRESETS,
  DEFAULT_BANNER_STYLE,
  type NetNeighborBannerStyle,
} from "@/lib/net-neighbors/banner-builder";
import styles from "./net-neighbors.module.css";

interface NetNeighborBannerBuilderProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export function NetNeighborBannerBuilder({
  enabled,
  onEnabledChange,
}: NetNeighborBannerBuilderProps) {
  const [style, setStyle] = useState<NetNeighborBannerStyle>(DEFAULT_BANNER_STYLE);

  const preview = useMemo(() => style, [style]);

  function update<K extends keyof NetNeighborBannerStyle>(
    key: K,
    value: NetNeighborBannerStyle[K],
  ) {
    setStyle((s) => ({ ...s, [key]: value }));
  }

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
          <input type="hidden" name="bannerPreset" value={style.preset} />
          <input type="hidden" name="bannerText" value={style.text} />
          <input type="hidden" name="bannerSubtext" value={style.subtext ?? ""} />
          <input type="hidden" name="bannerSize" value={`${style.width}x${style.height}`} />
          <input type="hidden" name="bannerScanlines" value={String(style.scanlines)} />
          <input type="hidden" name="bannerFlicker" value={String(style.flicker)} />
          <input type="hidden" name="bannerGlyph" value={style.glyph} />

          <div className="mb-4 flex justify-center rounded border border-border/40 bg-black/50 p-4">
            <NetNeighborGeneratedBanner style={preview} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase">Banner Text</Label>
              <Input
                value={style.text}
                onChange={(e) => update("text", e.target.value.slice(0, 24))}
                maxLength={24}
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="text-xs uppercase">Subtext (optional)</Label>
              <Input
                value={style.subtext ?? ""}
                onChange={(e) => update("subtext", e.target.value.slice(0, 20))}
                maxLength={20}
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="text-xs uppercase">HUD Preset</Label>
              <select
                value={style.preset}
                onChange={(e) => update("preset", e.target.value)}
                className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
              >
                {BANNER_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs uppercase">Size</Label>
              <select
                value={`${style.width}x${style.height}`}
                onChange={(e) => {
                  const size = BANNER_SIZE_PRESETS.find((s) => s.id === e.target.value);
                  if (size) {
                    setStyle((s) => ({ ...s, width: size.width, height: size.height }));
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
            <div className="flex flex-wrap items-end gap-4 font-mono text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={style.scanlines}
                  onChange={(e) => update("scanlines", e.target.checked)}
                />
                Scanlines
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={style.flicker}
                  onChange={(e) => update("flicker", e.target.checked)}
                />
                Flicker
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
