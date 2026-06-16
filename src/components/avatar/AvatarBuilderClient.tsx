"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import builderStyles from "@/components/avatar/avatar-builder.module.css";
import { AvatarHudFrame } from "@/components/avatar/AvatarHudFrame";
import { AvatarAssetDownloadCard } from "@/components/avatar/AvatarAssetDownloadCard";
import { AvatarPartUploader } from "@/components/avatar/AvatarPartUploader";
import { AvatarCategoryPanel } from "@/components/avatar/AvatarCategoryPanel";
import { AvatarLayerTransformControls } from "@/components/avatar/AvatarLayerTransformControls";
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
  AVATAR_EYE_COLORS,
  AVATAR_HAIR_COLORS,
  AVATAR_GENDER_PRESENTATIONS,
  AVATAR_POSES,
  AVATAR_SKIN_COLORS,
  AVATAR_SPECIES,
  getDownloadableBases,
  getItemsForCategory,
  isMovableCategory,
  resolveAvatarLayers,
  type AvatarSelection,
} from "@/lib/avatar/avatar-assets";
import {
  DEFAULT_AVATAR_TRANSFORM,
  type AvatarRegistryItem,
  type SelectedAvatarItem,
} from "@/lib/avatar/avatar-registry";

export interface AvatarUserPartRef {
  id: string;
  category: string;
  label: string;
  visibility: string;
}

export interface AvatarBuilderInitial {
  displayName: string;
  tagline: string;
  bio: string;
  pronouns: string;
  motto: string;
  favoriteSignal: string;
  speciesSlug: string;
  genderPresentation: string;
  bodySlug: string;
  poseSlug: string;
  emotionSlug: string;
  skinColor: string;
  eyeSlug: string;
  eyeColor: string;
  hairSlug: string;
  hairColor: string;
  outfitSlug: string;
  accessorySlugs: string[];
  backgroundSlug: string;
  customBackgroundAssetId: string;
  customPartIds: Record<string, string>;
  selectedItems: SelectedAvatarItem[];
}

interface AvatarBuilderClientProps {
  initial: AvatarBuilderInitial;
  userParts: AvatarUserPartRef[];
  sharedParts: AvatarUserPartRef[];
  header?: ReactNode;
}

type TabId =
  | "body"
  | "species"
  | "face"
  | "hair"
  | "pose"
  | "gear"
  | "features"
  | "props"
  | "accessories"
  | "background"
  | "uploads"
  | "bases"
  | "lore";

const TABS: { id: TabId; label: string }[] = [
  { id: "body", label: "Body" },
  { id: "species", label: "Species" },
  { id: "face", label: "Face" },
  { id: "hair", label: "Hair" },
  { id: "pose", label: "Pose" },
  { id: "gear", label: "Gear" },
  { id: "features", label: "Features" },
  { id: "props", label: "Props" },
  { id: "accessories", label: "Accessories" },
  { id: "background", label: "Background" },
  { id: "uploads", label: "Uploads" },
  { id: "bases", label: "Base Library" },
  { id: "lore", label: "Lore" },
];

const GEAR_CATEGORIES = ["tops", "pants", "skirts", "shoes", "socks", "outerwear"] as const;
const FEATURE_CATEGORIES = ["ears", "horns", "wings", "tails", "markings", "hands", "emotion"] as const;
const PROP_CATEGORIES = ["fictional-props", "tech-gear", "faction-flair", "effects", "back-items"] as const;

function partUrl(id: string) {
  return `/api/avatar-parts/${id}`;
}

export function AvatarBuilderClient({
  initial,
  userParts,
  sharedParts,
  header,
}: AvatarBuilderClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("body");
  const [state, setState] = useState(initial);
  const [parts, setParts] = useState(userParts);
  const [activeTransformCategory, setActiveTransformCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(
    () => ({
      speciesSlug: state.speciesSlug,
      genderPresentation: state.genderPresentation,
      poseSlug: state.poseSlug,
    }),
    [state.speciesSlug, state.genderPresentation, state.poseSlug],
  );

  const customPartUrls = useMemo(() => {
    const urls: Partial<Record<string, string>> = {};
    for (const [cat, id] of Object.entries(state.customPartIds)) {
      if (id) urls[cat] = partUrl(id);
    }
    return urls;
  }, [state.customPartIds]);

  const selection: AvatarSelection = useMemo(
    () => ({
      speciesSlug: state.speciesSlug,
      genderPresentation: state.genderPresentation,
      bodySlug: state.bodySlug,
      poseSlug: state.poseSlug,
      emotionSlug: state.emotionSlug,
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
      customPartUrls,
      selectedItems: state.selectedItems,
    }),
    [state, customPartUrls],
  );

  const layers = useMemo(() => resolveAvatarLayers(selection), [selection]);
  const skinHex = AVATAR_SKIN_COLORS.find((c) => c.slug === state.skinColor)?.color;
  const hairHex = AVATAR_HAIR_COLORS.find((c) => c.slug === state.hairColor)?.color;
  const speciesName = AVATAR_SPECIES.find((s) => s.slug === state.speciesSlug)?.name;

  function selectRegistryItem(item: AvatarRegistryItem) {
    setState((s) => {
      const nextItems = s.selectedItems.filter((x) => x.category !== item.category);
      nextItems.push({
        itemSlug: item.slug,
        category: item.category,
        source: "official",
        transform: item.defaultTransform ?? DEFAULT_AVATAR_TRANSFORM,
      });
      const patch: Partial<AvatarBuilderInitial> = { selectedItems: nextItems };
      if (item.category === "body") patch.bodySlug = item.slug;
      if (item.category === "eyes") patch.eyeSlug = item.slug;
      if (item.category === "hair") patch.hairSlug = item.slug;
      if (item.category === "outerwear") patch.outfitSlug = item.slug;
      if (item.category === "emotion") patch.emotionSlug = item.slug;
      if (isMovableCategory(item.category)) setActiveTransformCategory(item.category);
      return { ...s, ...patch };
    });
  }

  function updateSelectedTransform(category: string, transform: SelectedAvatarItem["transform"]) {
    setState((s) => ({
      ...s,
      selectedItems: s.selectedItems.map((item) =>
        item.category === category ? { ...item, transform } : item,
      ),
    }));
  }

  function removeSelectedCategory(category: string) {
    setState((s) => ({
      ...s,
      selectedItems: s.selectedItems.filter((item) => item.category !== category),
    }));
    if (activeTransformCategory === category) setActiveTransformCategory(null);
  }

  function assignCustomPart(category: string, partId: string, source: "private" | "shared") {
    setState((s) => {
      const nextItems = s.selectedItems.filter((x) => x.category !== category);
      nextItems.push({
        itemSlug: partId,
        category,
        source,
        partId,
        transform: DEFAULT_AVATAR_TRANSFORM,
      });
      return {
        ...s,
        customPartIds: { ...s.customPartIds, [category]: partId },
        selectedItems: nextItems,
      };
    });
    if (isMovableCategory(category)) setActiveTransformCategory(category);
  }

  function save() {
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    const { customPartIds, accessorySlugs, selectedItems, ...rest } = state;
    Object.entries(rest).forEach(([key, value]) => {
      formData.set(key, String(value ?? ""));
    });
    formData.set("accessorySlugs", accessorySlugs.join(","));
    formData.set("customPartIds", JSON.stringify(customPartIds));
    formData.set("selectedItems", JSON.stringify(selectedItems));
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

  const activeItem = state.selectedItems.find((i) => i.category === activeTransformCategory);
  const downloadableBases = getDownloadableBases();

  return (
    <div className={builderStyles.avatarBuilderShell}>
      {header && <div className={builderStyles.avatarBuilderHeader}>{header}</div>}

      <div className={builderStyles.avatarBuilderWorkspace}>
        <div className={builderStyles.avatarPreviewRail}>
          <TerminalPanel
            title="mirror.preview"
            className={builderStyles.avatarPreviewPanel}
            contentClassName={builderStyles.avatarPreviewPanelInner}
          >
            <AvatarHudFrame
                layers={layers}
                skinColor={skinHex}
                hairColor={hairHex}
                poseSlug={state.poseSlug}
                status={{
                  speciesName,
                  poseSlug: state.poseSlug,
                  hasBackground: !!state.customBackgroundAssetId,
                  loadStatus: layers.length > 0 ? "stable" : "empty",
              }}
            />
            <p className={builderStyles.avatarPreviewNote}>
              Layer-stacked preview · replace art in public/avatar-assets/
            </p>
          </TerminalPanel>
          {activeItem && isMovableCategory(activeItem.category) && (
            <AvatarLayerTransformControls
              label={`Position · ${activeItem.category}`}
              transform={activeItem.transform}
              onChange={(transform) => updateSelectedTransform(activeItem.category, transform)}
              onRemove={() => removeSelectedCategory(activeItem.category)}
            />
          )}
          <div className={builderStyles.avatarPreviewActions}>
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

        <div className={builderStyles.avatarEditorWorkspace}>
          <div className={builderStyles.avatarTabRow}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
                  tab === t.id ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

        {tab === "body" && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase">Gender / Presentation</Label>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Choose the body presentation signal for this avatar. This does not need to match your
                real-world identity.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AVATAR_GENDER_PRESENTATIONS.map((g) => (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={() => setState((s) => ({ ...s, genderPresentation: g.slug }))}
                    className={`rounded border px-2 py-1 font-mono text-[10px] ${
                      state.genderPresentation === g.slug
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 text-muted-foreground"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <AvatarCategoryPanel
              category="body"
              title="Body Base"
              items={getItemsForCategory("body", filters)}
              selectedSlug={state.bodySlug}
              onSelect={selectRegistryItem}
            />
            <div>
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
            <AvatarCategoryPanel
              category="eyes"
              title="Eyes"
              items={getItemsForCategory("eyes", filters)}
              selectedSlug={state.eyeSlug}
              onSelect={selectRegistryItem}
            />
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
            <AvatarCategoryPanel
              category="emotion"
              title="Emotion"
              items={getItemsForCategory("emotion", filters)}
              selectedSlug={state.emotionSlug}
              onSelect={selectRegistryItem}
            />
          </div>
        )}

        {tab === "hair" && (
          <div className="space-y-4">
            <AvatarCategoryPanel
              category="hair"
              title="Hair"
              items={getItemsForCategory("hair", filters)}
              selectedSlug={state.hairSlug}
              onSelect={selectRegistryItem}
            />
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

        {tab === "pose" && (
          <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {AVATAR_POSES.map((pose) => (
              <button
                key={pose.slug}
                type="button"
                onClick={() => setState((s) => ({ ...s, poseSlug: pose.slug }))}
                className={`border p-3 text-left font-mono text-xs ${
                  state.poseSlug === pose.slug ? "border-primary bg-primary/5" : "border-border/50"
                }`}
              >
                <p className="text-primary">{pose.label}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Pose art placeholders use CSS transform until full pose layers ship.
                </p>
              </button>
            ))}
          </div>
        )}

        {tab === "gear" && (
          <div className="space-y-6">
            {GEAR_CATEGORIES.map((cat) => (
              <AvatarCategoryPanel
                key={cat}
                category={cat}
                title={cat.replace(/-/g, " ")}
                items={getItemsForCategory(cat, filters)}
                selectedSlug={state.selectedItems.find((i) => i.category === cat)?.itemSlug}
                onSelect={selectRegistryItem}
              />
            ))}
          </div>
        )}

        {tab === "features" && (
          <div className="space-y-6">
            {FEATURE_CATEGORIES.map((cat) => (
              <AvatarCategoryPanel
                key={cat}
                category={cat}
                title={cat.replace(/-/g, " ")}
                items={getItemsForCategory(cat, filters)}
                selectedSlug={state.selectedItems.find((i) => i.category === cat)?.itemSlug ?? (cat === "emotion" ? state.emotionSlug : undefined)}
                onSelect={selectRegistryItem}
              />
            ))}
          </div>
        )}

        {tab === "props" && (
          <div className="space-y-4">
            <p className="font-mono text-[10px] text-muted-foreground">
              Fictional Props &amp; Tech Gear — cosmetic loadout items only. Not connected to missions or
              violence.
            </p>
            {PROP_CATEGORIES.map((cat) => (
              <AvatarCategoryPanel
                key={cat}
                category={cat}
                title={cat.replace(/-/g, " ")}
                items={getItemsForCategory(cat, filters)}
                selectedSlug={state.selectedItems.find((i) => i.category === cat)?.itemSlug}
                onSelect={selectRegistryItem}
              />
            ))}
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
            <AvatarCategoryPanel
              category="accessories"
              title="More Accessories"
              items={getItemsForCategory("accessories", filters)}
              selectedSlug={state.selectedItems.find((i) => i.category === "accessories")?.itemSlug}
              onSelect={selectRegistryItem}
            />
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

        {tab === "uploads" && (
          <div className="space-y-6">
            <AvatarPartUploader
              onUploaded={(partId, category) => {
                setParts((prev) => [
                  ...prev,
                  { id: partId, category, label: "New upload", visibility: "PRIVATE" },
                ]);
                assignCustomPart(category, partId, "private");
                setSuccess("Custom part uploaded.");
              }}
            />
            <TerminalPanel title="your.parts">
              {parts.length === 0 ? (
                <p className="font-mono text-xs text-muted-foreground">No custom parts uploaded yet.</p>
              ) : (
                <ul className="space-y-2">
                  {parts.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-2 font-mono text-xs">
                      <span>
                        {p.label} · {p.category}
                        {p.visibility === "SHARED_PENDING" && (
                          <span className="text-muted-foreground"> · pending review</span>
                        )}
                      </span>
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => assignCustomPart(p.category, p.id, "private")}
                      >
                        Equip
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </TerminalPanel>
            {sharedParts.length > 0 && (
              <TerminalPanel title="community.approved">
                <ul className="space-y-2">
                  {sharedParts.map((p) => (
                    <li key={p.id} className="flex items-center justify-between font-mono text-xs">
                      <span>
                        {p.label} · {p.category}
                      </span>
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => assignCustomPart(p.category, p.id, "shared")}
                      >
                        Equip
                      </button>
                    </li>
                  ))}
                </ul>
              </TerminalPanel>
            )}
          </div>
        )}

        {tab === "bases" && (
          <div className="space-y-4">
            <p className="font-mono text-[10px] text-muted-foreground">
              Download official base parts to draw compatible avatar layers. Keep the canvas size and
              transparent background so your part lines up in the builder.
            </p>
            <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
              {downloadableBases.map((asset) => (
                <AvatarAssetDownloadCard
                  key={asset.slug}
                  asset={{
                    slug: asset.slug,
                    label: asset.name,
                    imagePath: asset.imagePath,
                    downloadPath: asset.imagePath,
                    category: asset.category,
                  }}
                />
              ))}
            </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/profile/avatar/bases" className="font-mono text-xs text-primary hover:underline">
            Open full base library page →
          </Link>
          <Link href="/profile/avatar/forge" className="font-mono text-xs text-primary hover:underline">
            Avatar Forge GPT Access →
          </Link>
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
    </div>
  );
}
