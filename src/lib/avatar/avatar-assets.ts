export const AVATAR_CANVAS_SIZE = 1024;

export interface AvatarAssetOption {
  slug: string;
  label: string;
  imagePath: string;
  sortOrder?: number;
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
  { slug: "body-base-a", label: "Body A", imagePath: "/avatar-assets/bodies/body-base-a.svg", sortOrder: 1 },
  { slug: "body-base-b", label: "Body B", imagePath: "/avatar-assets/bodies/body-base-b.svg", sortOrder: 2 },
];

export const AVATAR_EYES: AvatarAssetOption[] = [
  { slug: "eyes-cyan", label: "Cyan Eyes", imagePath: "/avatar-assets/eyes/eyes-cyan.svg", sortOrder: 1 },
  { slug: "eyes-gold", label: "Gold Eyes", imagePath: "/avatar-assets/eyes/eyes-gold.svg", sortOrder: 2 },
  { slug: "eyes-pink", label: "Pink Eyes", imagePath: "/avatar-assets/eyes/eyes-pink.svg", sortOrder: 3 },
];

export const AVATAR_HAIR: AvatarAssetOption[] = [
  { slug: "hair-short-black", label: "Short Black", imagePath: "/avatar-assets/hair/hair-short-black.svg", sortOrder: 1 },
  { slug: "hair-long-white", label: "Long White", imagePath: "/avatar-assets/hair/hair-long-white.svg", sortOrder: 2 },
];

export const AVATAR_OUTFITS: AvatarAssetOption[] = [
  {
    slug: "outfit-initiate-coat",
    label: "Initiate Coat",
    imagePath: "/avatar-assets/outfits/outfit-initiate-coat.svg",
    sortOrder: 1,
  },
];

export const AVATAR_ACCESSORIES: AvatarAssetOption[] = [
  {
    slug: "accessory-pomegranate-pin",
    label: "Pomegranate Pin",
    imagePath: "/avatar-assets/accessories/accessory-pomegranate-pin.svg",
    sortOrder: 1,
  },
];

export const AVATAR_BACKGROUNDS: AvatarAssetOption[] = [
  {
    slug: "bg-underwatch-default",
    label: "Underwatch Default",
    imagePath: "/avatar-assets/backgrounds/bg-underwatch-default.svg",
    sortOrder: 1,
  },
];

export const AVATAR_SPECIES_FEATURES: Record<string, AvatarAssetOption> = {
  "tiefling-horns-a": {
    slug: "tiefling-horns-a",
    label: "Tiefling Horns",
    imagePath: "/avatar-assets/species/tiefling-horns-a.svg",
  },
  "nymph-leaves-a": {
    slug: "nymph-leaves-a",
    label: "Nymph Leaves",
    imagePath: "/avatar-assets/species/nymph-leaves-a.svg",
  },
  "gorgon-snakes-a": {
    slug: "gorgon-snakes-a",
    label: "Gorgon Snakes",
    imagePath: "/avatar-assets/species/gorgon-snakes-a.svg",
  },
  "automaton-paneling-a": {
    slug: "automaton-paneling-a",
    label: "Automaton Panel",
    imagePath: "/avatar-assets/species/automaton-paneling-a.svg",
  },
  "wraithborn-aura-a": {
    slug: "wraithborn-aura-a",
    label: "Wraith Aura",
    imagePath: "/avatar-assets/species/wraithborn-aura-a.svg",
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

export interface AvatarSelection {
  speciesSlug: string;
  bodySlug: string;
  skinColor?: string | null;
  eyeSlug?: string | null;
  eyeColor?: string | null;
  hairSlug?: string | null;
  hairColor?: string | null;
  outfitSlug?: string | null;
  accessorySlugs?: string[] | null;
  backgroundSlug?: string | null;
  customBackgroundUrl?: string | null;
}

export function getDefaultAvatarSelection(): AvatarSelection {
  return {
    speciesSlug: "tiefling",
    bodySlug: "body-base-a",
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

export function resolveAvatarLayers(selection: AvatarSelection): { key: string; src: string; zIndex: number }[] {
  const layers: { key: string; src: string; zIndex: number }[] = [];
  let z = 0;

  const bg = AVATAR_BACKGROUNDS.find((b) => b.slug === selection.backgroundSlug);
  if (selection.customBackgroundUrl) {
    layers.push({ key: "background-custom", src: selection.customBackgroundUrl, zIndex: z++ });
  } else if (bg) {
    layers.push({ key: "background", src: bg.imagePath, zIndex: z++ });
  }

  const body = AVATAR_BODIES.find((b) => b.slug === selection.bodySlug);
  if (body) layers.push({ key: "body", src: body.imagePath, zIndex: z++ });

  const species = AVATAR_SPECIES.find((s) => s.slug === selection.speciesSlug);
  if (species) {
    const feature = AVATAR_SPECIES_FEATURES[species.featureLayerSlug];
    if (feature) layers.push({ key: "species", src: feature.imagePath, zIndex: z++ });
  }

  const eyes = AVATAR_EYES.find((e) => e.slug === selection.eyeSlug);
  if (eyes) layers.push({ key: "eyes", src: eyes.imagePath, zIndex: z++ });

  const hair = AVATAR_HAIR.find((h) => h.slug === selection.hairSlug);
  if (hair) layers.push({ key: "hair", src: hair.imagePath, zIndex: z++ });

  const outfit = AVATAR_OUTFITS.find((o) => o.slug === selection.outfitSlug);
  if (outfit) layers.push({ key: "outfit", src: outfit.imagePath, zIndex: z++ });

  for (const slug of selection.accessorySlugs ?? []) {
    const acc = AVATAR_ACCESSORIES.find((a) => a.slug === slug);
    if (acc) layers.push({ key: `accessory-${slug}`, src: acc.imagePath, zIndex: z++ });
  }

  return layers;
}

export function findAssetBySlug(
  slug: string,
  list: AvatarAssetOption[],
): AvatarAssetOption | undefined {
  return list.find((item) => item.slug === slug);
}
