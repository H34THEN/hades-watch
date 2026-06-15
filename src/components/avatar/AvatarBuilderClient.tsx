"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AvatarPreview } from "@/components/avatar/AvatarPreview";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { resetAvatarAction, saveAvatarAction } from "@/lib/actions/avatar";
import { uploadProfileAssetAction } from "@/lib/actions/profile-world";
import {
  AVATAR_ACCESSORIES,
  AVATAR_BACKGROUNDS,
  AVATAR_BODIES,
  AVATAR_EYE_COLORS,
  AVATAR_EYES,
  AVATAR_HAIR,
  AVATAR_HAIR_COLORS,
  AVATAR_SKIN_COLORS,
  AVATAR_SPECIES,
  resolveAvatarLayers,
  type AvatarSelection,
} from "@/lib/avatar/avatar-assets";

export interface AvatarBuilderInitial {
  displayName: string;
  tagline: string;
  bio: string;
  pronouns: string;
  motto: string;
  favoriteSignal: string;
  speciesSlug: string;
  bodySlug: string;
  skinColor: string;
  eyeSlug: string;
  eyeColor: string;
  hairSlug: string;
  hairColor: string;
  outfitSlug: string;
  accessorySlugs: string[];
  backgroundSlug: string;
  customBackgroundAssetId: string;
}

interface AvatarBuilderClientProps {
  initial: AvatarBuilderInitial;
}

type TabId = "body" | "species" | "face" | "hair" | "clothing" | "accessories" | "background" | "lore";

const TABS: { id: TabId; label: string }[] = [
  { id: "body", label: "Body" },
  { id: "species", label: "Species" },
  { id: "face", label: "Face" },
  { id: "hair", label: "Hair" },
  { id: "clothing", label: "Clothing" },
  { id: "accessories", label: "Accessories" },
  { id: "background", label: "Background" },
  { id: "lore", label: "Lore" },
];

export function AvatarBuilderClient({ initial }: AvatarBuilderClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("body");
  const [state, setState] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selection: AvatarSelection = useMemo(
    () => ({
      speciesSlug: state.speciesSlug,
      bodySlug: state.bodySlug,
      skinColor: state.skinColor,
      eyeSlug: state.eyeSlug,
      eyeColor: state.eyeColor,
      hairSlug: state.hairSlug,
      hairColor: state.hairColor,
      outfitSlug: state.outfitSlug,
      accessorySlugs: state.accessorySlugs,
      backgroundSlug: state.backgroundSlug,
      customBackgroundUrl: state.customBackgroundAssetId
        ? `/api/profile-assets/${state.customBackgroundAssetId}`
        : null,
    }),
    [state],
  );

  const layers = useMemo(() => resolveAvatarLayers(selection), [selection]);
  const skinHex = AVATAR_SKIN_COLORS.find((c) => c.slug === state.skinColor)?.color;
  const hairHex = AVATAR_HAIR_COLORS.find((c) => c.slug === state.hairColor)?.color;

  function save() {
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    Object.entries(state).forEach(([key, value]) => {
      if (key === "accessorySlugs") {
        formData.set(key, (value as string[]).join(","));
      } else {
        formData.set(key, String(value ?? ""));
      }
    });
    startTransition(async () => {
      const result = await saveAvatarAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("Avatar saved to the mirror chamber.");
      router.refresh();
    });
  }

  function reset() {
    startTransition(async () => {
      const result = await resetAvatarAction();
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  function uploadBg(file: File) {
    const formData = new FormData();
    formData.set("kind", "AVATAR_BACKGROUND");
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadProfileAssetAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (result.assetId) {
        setState((s) => ({ ...s, customBackgroundAssetId: result.assetId! }));
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
        <TerminalPanel title="mirror.preview">
          <AvatarPreview layers={layers} skinColor={skinHex} hairColor={hairHex} />
          <p className="mt-3 font-mono text-[10px] text-muted-foreground">
            Layer-stacked preview · replace art in public/avatar-assets/
          </p>
        </TerminalPanel>
        <div className="flex flex-wrap gap-2">
          <CommandButton onClick={save} disabled={isPending}>
            {isPending ? "Saving…" : "Save Avatar"}
          </CommandButton>
          <CommandButton variant="outline" onClick={reset} disabled={isPending}>
            Reset Default
          </CommandButton>
        </div>
        {error && <SystemAlert title="Error" message={error} variant="error" />}
        {success && <SystemAlert title="Saved" message={success} variant="success" />}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-1 border-b border-border/40 pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
                tab === t.id ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "body" && (
          <div className="grid gap-2 sm:grid-cols-2">
            {AVATAR_BODIES.map((body) => (
              <button
                key={body.slug}
                type="button"
                onClick={() => setState((s) => ({ ...s, bodySlug: body.slug }))}
                className={`border p-2 text-left font-mono text-xs ${
                  state.bodySlug === body.slug ? "border-primary" : "border-border/50"
                }`}
              >
                {body.label}
              </button>
            ))}
            <div className="sm:col-span-2">
              <Label className="text-xs uppercase">Skin Color</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {AVATAR_SKIN_COLORS.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    title={c.label}
                    onClick={() => setState((s) => ({ ...s, skinColor: c.slug }))}
                    className={`h-8 w-8 border-2 ${
                      state.skinColor === c.slug ? "border-primary" : "border-border/40"
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "species" && (
          <div className="space-y-3">
            {AVATAR_SPECIES.map((species) => (
              <button
                key={species.slug}
                type="button"
                onClick={() => setState((s) => ({ ...s, speciesSlug: species.slug }))}
                className={`block w-full border p-3 text-left ${
                  state.speciesSlug === species.slug ? "border-primary bg-primary/5" : "border-border/50"
                }`}
              >
                <p className="font-mono text-sm text-primary">{species.name}</p>
                <p className="text-xs text-muted-foreground">{species.description}</p>
              </button>
            ))}
          </div>
        )}

        {tab === "face" && (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-3">
              {AVATAR_EYES.map((eye) => (
                <button
                  key={eye.slug}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, eyeSlug: eye.slug }))}
                  className={`border p-2 font-mono text-xs ${
                    state.eyeSlug === eye.slug ? "border-primary" : "border-border/50"
                  }`}
                >
                  {eye.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {AVATAR_EYE_COLORS.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, eyeColor: c.slug }))}
                  className={`rounded px-2 py-1 font-mono text-[10px] ${
                    state.eyeColor === c.slug ? "bg-primary/20 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "hair" && (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {AVATAR_HAIR.map((hair) => (
                <button
                  key={hair.slug}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, hairSlug: hair.slug }))}
                  className={`border p-2 font-mono text-xs ${
                    state.hairSlug === hair.slug ? "border-primary" : "border-border/50"
                  }`}
                >
                  {hair.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {AVATAR_HAIR_COLORS.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, hairColor: c.slug }))}
                  className={`h-8 w-8 border-2 ${
                    state.hairColor === c.slug ? "border-primary" : "border-border/40"
                  }`}
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "clothing" && (
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, outfitSlug: "outfit-initiate-coat" }))}
              className={`border p-2 font-mono text-xs ${
                state.outfitSlug === "outfit-initiate-coat" ? "border-primary" : "border-border/50"
              }`}
            >
              Initiate Coat
            </button>
          </div>
        )}

        {tab === "accessories" && (
          <div className="space-y-2">
            {AVATAR_ACCESSORIES.map((acc) => {
              const active = state.accessorySlugs.includes(acc.slug);
              return (
                <button
                  key={acc.slug}
                  type="button"
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      accessorySlugs: active
                        ? s.accessorySlugs.filter((x) => x !== acc.slug)
                        : [...s.accessorySlugs, acc.slug],
                    }))
                  }
                  className={`block w-full border p-2 text-left font-mono text-xs ${
                    active ? "border-primary bg-primary/5" : "border-border/50"
                  }`}
                >
                  {acc.label}
                </button>
              );
            })}
          </div>
        )}

        {tab === "background" && (
          <div className="space-y-4">
            {AVATAR_BACKGROUNDS.map((bg) => (
              <button
                key={bg.slug}
                type="button"
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    backgroundSlug: bg.slug,
                    customBackgroundAssetId: "",
                  }))
                }
                className={`block w-full border p-2 text-left font-mono text-xs ${
                  state.backgroundSlug === bg.slug && !state.customBackgroundAssetId
                    ? "border-primary"
                    : "border-border/50"
                }`}
              >
                {bg.label}
              </button>
            ))}
            <div>
              <Label htmlFor="avatar-bg-upload" className="text-xs uppercase">
                Custom Background Upload
              </Label>
              <Input
                id="avatar-bg-upload"
                type="file"
                accept="image/gif,image/png,image/jpeg,image/webp"
                disabled={isPending}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadBg(file);
                }}
              />
            </div>
          </div>
        )}

        {tab === "lore" && (
          <div className="space-y-3">
            <Input
              value={state.displayName}
              onChange={(e) => setState((s) => ({ ...s, displayName: e.target.value }))}
              placeholder="Avatar display name"
              maxLength={64}
            />
            <Input
              value={state.tagline}
              onChange={(e) => setState((s) => ({ ...s, tagline: e.target.value }))}
              placeholder="Tagline"
              maxLength={160}
            />
            <Input
              value={state.pronouns}
              onChange={(e) => setState((s) => ({ ...s, pronouns: e.target.value }))}
              placeholder="Pronouns (optional)"
              maxLength={32}
            />
            <textarea
              value={state.bio}
              onChange={(e) => setState((s) => ({ ...s, bio: e.target.value }))}
              placeholder="Short bio"
              maxLength={1000}
              rows={4}
              className="w-full border border-border bg-background/50 p-2 font-mono text-xs"
            />
            <Input
              value={state.motto}
              onChange={(e) => setState((s) => ({ ...s, motto: e.target.value }))}
              placeholder="Personal motto"
              maxLength={200}
            />
            <Input
              value={state.favoriteSignal}
              onChange={(e) => setState((s) => ({ ...s, favoriteSignal: e.target.value }))}
              placeholder="Favorite signal"
              maxLength={120}
            />
          </div>
        )}
      </div>
    </div>
  );
}
