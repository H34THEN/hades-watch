export const AVATAR_CANVAS_SIZE = 1024;

import {
  getRegistryItem,
  type AvatarTransform,
  type SelectedAvatarItem,
} from "@/lib/avatar/avatar-registry";

export type { AvatarTransform, SelectedAvatarItem };
export {
  AVATAR_CATEGORIES,
  AVATAR_GENDER_PRESENTATIONS,
  AVATAR_EMOTIONS,
  AVATAR_REGISTRY_ITEMS,
  getItemsForCategory,
  getDownloadableBases,
  getRegistryItem,
  parseSelectedItems,
  isMovableCategory,
  DEFAULT_AVATAR_TRANSFORM,
} from "@/lib/avatar/avatar-registry";

export interface AvatarLayer {
  key: string;
  src: string;
  zIndex: number;
  transform?: AvatarTransform;
}


export interface AvatarAssetOption {
  slug: string;
  label: string;
  imagePath: string;
  downloadPath?: string;
  sortOrder?: number;
  category?: string;
}

export interface AvatarSpecies {
  slug: string;
  name: string;
  description: string;
  featureLayerSlug: string;
  sortOrder: number;
}

export const AVATAR_SPECIES: AvatarSpecies[] = [
  {
    slug: "tiefling",
    name: "Tiefling",
    description: "Horned underworld-born signal walker.",
    featureLayerSlug: "tiefling-horns-a",
    sortOrder: 1,
  },
  {
    slug: "nymph",
    name: "Nymph",
    description: "Leaf-crowned river memory in human shape.",
    featureLayerSlug: "nymph-leaves-a",
    sortOrder: 2,
  },
  {
    slug: "gorgon",
    name: "Gorgon",
    description: "Serpent-crowned witness with a stare like archive static.",
    featureLayerSlug: "gorgon-snakes-a",
    sortOrder: 3,
  },
  {
    slug: "automaton",
    name: "Automaton",
    description: "Panel-lit construct escaped from the smart-city cage.",
    featureLayerSlug: "automaton-paneling-a",
    sortOrder: 4,
  },
  {
    slug: "wraithborn",
    name: "Wraithborn",
    description: "Half-deleted soul stitched back with neon grief.",
    featureLayerSlug: "wraithborn-aura-a",
    sortOrder: 5,
  },
];

export const AVATAR_BODIES: AvatarAssetOption[] = [
  {
    slug: "body-base-a",
    label: "Body A",
    imagePath: "/avatar-assets/bodies/body-base-a.svg",
    downloadPath: "/avatar-assets/bodies/body-base-a.svg",
    category: "BODY",
    sortOrder: 1,
  },
  {
    slug: "body-base-b",
    label: "Body B",
    imagePath: "/avatar-assets/bodies/body-base-b.svg",
    downloadPath: "/avatar-assets/bodies/body-base-b.svg",
    category: "BODY",
    sortOrder: 2,
  },
];

export const AVATAR_EYES: AvatarAssetOption[] = [
  { slug: "eyes-cyan", label: "Cyan Eyes", imagePath: "/avatar-assets/eyes/eyes-cyan.svg", downloadPath: "/avatar-assets/eyes/eyes-cyan.svg", category: "EYES", sortOrder: 1 },
  { slug: "eyes-gold", label: "Gold Eyes", imagePath: "/avatar-assets/eyes/eyes-gold.svg", downloadPath: "/avatar-assets/eyes/eyes-gold.svg", category: "EYES", sortOrder: 2 },
  { slug: "eyes-pink", label: "Pink Eyes", imagePath: "/avatar-assets/eyes/eyes-pink.svg", downloadPath: "/avatar-assets/eyes/eyes-pink.svg", category: "EYES", sortOrder: 3 },
];

export const AVATAR_HAIR: AvatarAssetOption[] = [
  { slug: "hair-short-black", label: "Short Black", imagePath: "/avatar-assets/hair/hair-short-black.svg", downloadPath: "/avatar-assets/hair/hair-short-black.svg", category: "HAIR", sortOrder: 1 },
  { slug: "hair-long-white", label: "Long White", imagePath: "/avatar-assets/hair/hair-long-white.svg", downloadPath: "/avatar-assets/hair/hair-long-white.svg", category: "HAIR", sortOrder: 2 },
];

export const AVATAR_OUTFITS: AvatarAssetOption[] = [
  {
    slug: "outfit-initiate-coat",
    label: "Initiate Coat",
    imagePath: "/avatar-assets/outfits/outfit-initiate-coat.svg",
    downloadPath: "/avatar-assets/outfits/outfit-initiate-coat.svg",
    category: "OUTFIT",
    sortOrder: 1,
  },
];

export const AVATAR_ACCESSORIES: AvatarAssetOption[] = [
  {
    slug: "accessory-pomegranate-pin",
    label: "Pomegranate Pin",
    imagePath: "/avatar-assets/accessories/accessory-pomegranate-pin.svg",
    downloadPath: "/avatar-assets/accessories/accessory-pomegranate-pin.svg",
    category: "ACCESSORY",
    sortOrder: 1,
  },
];

export const AVATAR_BACKGROUNDS: AvatarAssetOption[] = [
  {
    slug: "bg-underwatch-default",
    label: "Underwatch Default",
    imagePath: "/avatar-assets/backgrounds/bg-underwatch-default.svg",
    downloadPath: "/avatar-assets/backgrounds/bg-underwatch-default.svg",
    category: "BACKGROUND",
    sortOrder: 1,
  },
];

export const AVATAR_SPECIES_FEATURES: Record<string, AvatarAssetOption> = {
  "tiefling-horns-a": {
    slug: "tiefling-horns-a",
    label: "Tiefling Horns",
    imagePath: "/avatar-assets/species/tiefling-horns-a.svg",
    downloadPath: "/avatar-assets/species/tiefling-horns-a.svg",
    category: "SPECIES_FEATURE",
  },
  "nymph-leaves-a": {
    slug: "nymph-leaves-a",
    label: "Nymph Leaves",
    imagePath: "/avatar-assets/species/nymph-leaves-a.svg",
    downloadPath: "/avatar-assets/species/nymph-leaves-a.svg",
    category: "SPECIES_FEATURE",
  },
  "gorgon-snakes-a": {
    slug: "gorgon-snakes-a",
    label: "Gorgon Snakes",
    imagePath: "/avatar-assets/species/gorgon-snakes-a.svg",
    downloadPath: "/avatar-assets/species/gorgon-snakes-a.svg",
    category: "SPECIES_FEATURE",
  },
  "automaton-paneling-a": {
    slug: "automaton-paneling-a",
    label: "Automaton Panel",
    imagePath: "/avatar-assets/species/automaton-paneling-a.svg",
    downloadPath: "/avatar-assets/species/automaton-paneling-a.svg",
    category: "SPECIES_FEATURE",
  },
  "wraithborn-aura-a": {
    slug: "wraithborn-aura-a",
    label: "Wraith Aura",
    imagePath: "/avatar-assets/species/wraithborn-aura-a.svg",
    downloadPath: "/avatar-assets/species/wraithborn-aura-a.svg",
    category: "SPECIES_FEATURE",
  },
};

export const AVATAR_SKIN_COLORS = [
  { slug: "pale", label: "Pale", color: "#e8dcc8" },
  { slug: "bronze", label: "Bronze", color: "#b8845a" },
  { slug: "obsidian", label: "Obsidian", color: "#2a2f38" },
  { slug: "moss", label: "Moss", color: "#5a7a62" },
  { slug: "ash", label: "Ash", color: "#8a9098" },
];

export const AVATAR_HAIR_COLORS = [
  { slug: "black", label: "Black", color: "#1a1a1a" },
  { slug: "white", label: "White", color: "#f0f0f0" },
  { slug: "green", label: "Veil Green", color: "#38f8a8" },
  { slug: "crimson", label: "Crimson", color: "#b1123a" },
  { slug: "violet", label: "Violet", color: "#7b4fd6" },
];

export const AVATAR_EYE_COLORS = [
  { slug: "cyan", label: "Cyan", color: "#38f8a8" },
  { slug: "gold", label: "Gold", color: "#d4a84b" },
  { slug: "pink", label: "Pink", color: "#ff6eb4" },
  { slug: "silver", label: "Silver", color: "#c0c8d0" },
];

export const AVATAR_LAYER_ORDER = [
  "background",
  "body",
  "skin",
  "eyes",
  "species",
  "hair",
  "outfit",
  "accessories",
] as const;

export const MISSING_LAYER_PATH = "/avatar-assets/placeholders/missing-layer.svg";

export const AVATAR_POSES: {
  slug: string;
  label: string;
  cssTransform?: string;
  sortOrder: number;
}[] = [
  { slug: "pose-neutral", label: "Neutral Stance", cssTransform: "none", sortOrder: 1 },
  { slug: "pose-crossed", label: "Crossed Arms", cssTransform: "scale(1.02) translateY(-2%)", sortOrder: 2 },
  { slug: "pose-ready", label: "Ready Stance", cssTransform: "scale(1.04) translateX(2%)", sortOrder: 3 },
  { slug: "pose-seated", label: "Seated Terminal", cssTransform: "scale(0.95) translateY(6%)", sortOrder: 4 },
  { slug: "pose-caster", label: "Signal Caster", cssTransform: "scale(1.06) translateY(-4%)", sortOrder: 5 },
];

export function getPoseBySlug(slug: string) {
  return AVATAR_POSES.find((p) => p.slug === slug) ?? AVATAR_POSES[0];
}

export const AVATAR_OFFICIAL_DOWNLOADS: AvatarAssetOption[] = [
  ...AVATAR_BODIES,
  ...AVATAR_EYES,
  ...AVATAR_HAIR,
  ...AVATAR_OUTFITS,
  ...AVATAR_ACCESSORIES,
  ...AVATAR_BACKGROUNDS,
  ...Object.values(AVATAR_SPECIES_FEATURES),
].map((a) => ({ ...a, downloadPath: a.downloadPath ?? a.imagePath }));

export interface AvatarSelection {
  speciesSlug: string;
  genderPresentation?: string | null;
  bodySlug: string;
  poseSlug?: string | null;
  emotionSlug?: string | null;
  skinColor?: string | null;
  eyeSlug?: string | null;
  eyeColor?: string | null;
  hairSlug?: string | null;
  hairColor?: string | null;
  outfitSlug?: string | null;
  accessorySlugs?: string[] | null;
  backgroundSlug?: string | null;
  customBackgroundUrl?: string | null;
  customPartUrls?: Partial<Record<string, string>>;
  selectedItems?: SelectedAvatarItem[];
}

export function getDefaultAvatarSelection(): AvatarSelection {
  return {
    speciesSlug: "tiefling",
    genderPresentation: "custom",
    bodySlug: "body-base-a",
    poseSlug: "pose-neutral",
    emotionSlug: "emotion-neutral",
    skinColor: "obsidian",
    eyeSlug: "eyes-cyan",
    eyeColor: "cyan",
    hairSlug: "hair-short-black",
    hairColor: "black",
    outfitSlug: "outfit-initiate-coat",
    accessorySlugs: [],
    backgroundSlug: "bg-underwatch-default",
  };
}

export function resolveAvatarLayers(selection: AvatarSelection): AvatarLayer[] {
  const layers: AvatarLayer[] = [];
  let z = 0;

  const push = (key: string, src: string, transform?: AvatarTransform, layerOrder?: number) => {
    layers.push({ key, src, zIndex: layerOrder ?? z++, transform });
  };

  const bg = AVATAR_BACKGROUNDS.find((b) => b.slug === selection.backgroundSlug);
  if (selection.customBackgroundUrl) {
    push("background-custom", selection.customBackgroundUrl, undefined, 10);
  } else if (bg) {
    push("background", bg.imagePath, undefined, 10);
  }

  const body = AVATAR_BODIES.find((b) => b.slug === selection.bodySlug) ?? getRegistryItem(selection.bodySlug);
  if (body) {
    const path = "imagePath" in body ? body.imagePath : (body as AvatarAssetOption).imagePath;
    push("body", path, undefined, 100);
  }

  const species = AVATAR_SPECIES.find((s) => s.slug === selection.speciesSlug);
  if (species) {
    const feature = AVATAR_SPECIES_FEATURES[species.featureLayerSlug];
    if (feature) push("species", feature.imagePath, undefined, 350);
  }

  const eyes = AVATAR_EYES.find((e) => e.slug === selection.eyeSlug);
  if (eyes) push("eyes", eyes.imagePath, undefined, 300);

  const hair = AVATAR_HAIR.find((h) => h.slug === selection.hairSlug);
  if (hair) push("hair", hair.imagePath, undefined, 400);

  const outfit = AVATAR_OUTFITS.find((o) => o.slug === selection.outfitSlug);
  if (outfit) push("outfit", outfit.imagePath, undefined, 500);

  if (selection.emotionSlug) {
    const emotion = getRegistryItem(selection.emotionSlug);
    if (emotion) push("emotion", emotion.imagePath, emotion.defaultTransform, emotion.layerOrder);
  }

  for (const slug of selection.accessorySlugs ?? []) {
    const acc = AVATAR_ACCESSORIES.find((a) => a.slug === slug);
    if (acc) push(`accessory-${slug}`, acc.imagePath, undefined, 600);
  }

  for (const selected of selection.selectedItems ?? []) {
    const official = getRegistryItem(selected.itemSlug);
    const src =
      selected.imagePath ??
      (selected.partId ? `/api/avatar-parts/${selected.partId}` : official?.imagePath);
    if (!src) continue;
    const transform = selected.transform ?? official?.defaultTransform;
    push(
      `selected-${selected.category}-${selected.itemSlug}`,
      src,
      transform,
      official?.layerOrder ?? 500,
    );
  }

  const customOrder = [
    "effects",
    "tech-gear",
    "fictional-props",
    "faction-flair",
    "back-items",
    "accessories",
    "outerwear",
    "OVERLAY",
    "ACCESSORY",
    "OUTFIT",
  ];
  for (const cat of customOrder) {
    const url = selection.customPartUrls?.[cat] ?? selection.customPartUrls?.[cat.toUpperCase()];
    if (url) push(`custom-${cat}`, url, undefined, 550);
  }

  return layers.sort((a, b) => a.zIndex - b.zIndex).map((layer, i) => ({ ...layer, zIndex: i }));
}

export function findAssetBySlug(
  slug: string,
  list: AvatarAssetOption[],
): AvatarAssetOption | undefined {
  return list.find((item) => item.slug === slug);
}
