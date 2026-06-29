"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CommandButton } from "@/components/terminal/CommandButton";
import { NetNeighborButton } from "@/components/net-neighbors/NetNeighborButton";
import {
  DEFAULT_FORUM_BUTTON_CONFIG,
  FORUM_BANNER_SIZE_PRESETS,
  FORUM_BUTTON_SIZE_PRESETS,
  FORUM_HOVER_EFFECTS,
  normalizeForumSignatureConfig,
  type ForumSignatureConfig,
} from "@/lib/forums/signature-builder";
import { GRADIENT_PRESETS } from "@/lib/net-neighbors/banner-builder";
import { saveForumSignatureAssetAction } from "@/lib/actions/forum-identity";
import styles from "./forums.module.css";

interface ForumSignatureBuilderProps {
  assetType: "BUTTON" | "BANNER";
  initialConfig?: ForumSignatureConfig;
}

export function ForumSignatureBuilder({ assetType, initialConfig }: ForumSignatureBuilderProps) {
  const presets = assetType === "BANNER" ? FORUM_BANNER_SIZE_PRESETS : FORUM_BUTTON_SIZE_PRESETS;
  const [style, setStyle] = useState<ForumSignatureConfig>(
    initialConfig ?? {
      ...DEFAULT_FORUM_BUTTON_CONFIG,
      size: presets[0]?.id ?? "88x31",
      width: presets[0]?.width ?? 88,
      height: presets[0]?.height ?? 31,
    },
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const previewStyle = useMemo(
    () => normalizeForumSignatureConfig(style, assetType),
    [style, assetType],
  );

  function update<K extends keyof ForumSignatureConfig>(key: K, value: ForumSignatureConfig[K]) {
    setStyle((s) => normalizeForumSignatureConfig({ ...s, [key]: value }, assetType));
    setSaved(false);
  }

  async function handleSave(setActive: boolean) {
    setError(null);
    const formData = new FormData();
    formData.set("assetType", assetType);
    formData.set("setActive", String(setActive));
    formData.set("signatureConfigJson", JSON.stringify(previewStyle));
    formData.set("altText", previewStyle.text);
    const result = await saveForumSignatureAssetAction(formData);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="signatureConfigJson" value={JSON.stringify(previewStyle)} readOnly />

      <div className={styles.builderPreview}>
        <p className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">Preview</p>
        <NetNeighborButton title={previewStyle.text} bannerStyle={previewStyle} zoom={assetType === "BUTTON" ? 2 : 1.5} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs uppercase">Format</Label>
          <select
            value={previewStyle.size}
            onChange={(e) => {
              const preset = presets.find((p) => p.id === e.target.value) ?? presets[0];
              update("size", preset.id);
              update("width", preset.width);
              update("height", preset.height);
            }}
            className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs uppercase">Theme</Label>
          <select
            value={previewStyle.gradientPreset}
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
          <Label className="text-xs uppercase">Text line 1</Label>
          <Input
            value={previewStyle.text}
            maxLength={24}
            onChange={(e) => update("text", e.target.value)}
            className="mt-1 font-mono text-xs"
          />
        </div>
        <div>
          <Label className="text-xs uppercase">Text line 2</Label>
          <Input
            value={previewStyle.subtext ?? ""}
            maxLength={32}
            onChange={(e) => update("subtext", e.target.value)}
            className="mt-1 font-mono text-xs"
          />
        </div>
        <div>
          <Label className="text-xs uppercase">Hover effect</Label>
          <select
            value={previewStyle.hoverEffect ?? "soft-glow"}
            onChange={(e) =>
              update("hoverEffect", e.target.value as ForumSignatureConfig["hoverEffect"])
            }
            className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
          >
            {FORUM_HOVER_EFFECTS.map((h) => (
              <option key={h.id} value={h.id}>
                {h.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs uppercase">Glow</Label>
          <select
            value={previewStyle.glowLevel ?? "medium"}
            onChange={(e) =>
              update("glowLevel", e.target.value as ForumSignatureConfig["glowLevel"])
            }
            className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <p className={styles.safetyNote}>
        Forum signatures use safe tokens and trusted components. Raw scripts, iframes, tracking
        pixels, and unsafe CSS are not allowed.
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-primary">Signature saved.</p>}

      <div className="flex flex-wrap gap-2">
        <CommandButton type="button" size="sm" onClick={() => void handleSave(true)}>
          Save &amp; set active
        </CommandButton>
        <CommandButton type="button" size="sm" variant="secondary" onClick={() => void handleSave(false)}>
          Save draft
        </CommandButton>
      </div>
    </div>
  );
}
