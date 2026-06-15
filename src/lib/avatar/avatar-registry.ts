export const AVATAR_CANVAS_SIZE = 1024;

export interface AvatarTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const DEFAULT_AVATAR_TRANSFORM: AvatarTransform = {
  x: 0.5,
  y: 0.5,
  scale: 1,
  rotation: 0,
};

export interface AvatarCategoryDef {
  slug: string;
  name: string;
  sortOrder: number;
  movable?: boolean;
}

export const AVATAR_CATEGORIES: AvatarCategoryDef[] = [
  { slug: "body", name: "Body", sortOrder: 10 },
  { slug: "gender", name: "Gender / Presentation", sortOrder: 15 },
  { slug: "species", name: "Species", sortOrder: 20 },
  { slug: "skin-color", name: "Skin Color", sortOrder: 25 },
  { slug: "face", name: "Face", sortOrder: 30 },
  { slug: "eyes", name: "Eyes", sortOrder: 40 },
  { slug: "eye-color", name: "Eye Color", sortOrder: 45 },
  { slug: "ears", name: "Ears", sortOrder: 50 },
  { slug: "hair", name: "Hair", sortOrder: 60 },
  { slug: "hair-color", name: "Hair Color", sortOrder: 65 },
  { slug: "emotion", name: "Emotion", sortOrder: 70 },
  { slug: "pose", name: "Pose", sortOrder: 75 },
  { slug: "hands", name: "Hands", sortOrder: 80 },
  { slug: "horns", name: "Horns", sortOrder: 85, movable: true },
  { slug: "wings", name: "Wings", sortOrder: 90, movable: true },
  { slug: "tails", name: "Tails", sortOrder: 95, movable: true },
  { slug: "markings", name: "Markings", sortOrder: 100, movable: true },
  { slug: "accessories", name: "Accessories", sortOrder: 110, movable: true },
  { slug: "tops", name: "Tops", sortOrder: 120 },
  { slug: "pants", name: "Pants", sortOrder: 130 },
  { slug: "skirts", name: "Skirts", sortOrder: 135 },
  { slug: "shoes", name: "Shoes", sortOrder: 140 },
  { slug: "socks", name: "Socks", sortOrder: 145 },
  { slug: "outerwear", name: "Outerwear", sortOrder: 150 },
  { slug: "back-items", name: "Back Items", sortOrder: 160, movable: true },
  { slug: "backgrounds", name: "Backgrounds", sortOrder: 170 },
  { slug: "fictional-props", name: "Fictional Props & Tech Gear", sortOrder: 180, movable: true },
  { slug: "tech-gear", name: "Tech Gear", sortOrder: 185, movable: true },
  { slug: "faction-flair", name: "Faction Flair", sortOrder: 190, movable: true },
  { slug: "effects", name: "Effects", sortOrder: 200, movable: true },
];

export const AVATAR_GENDER_PRESENTATIONS = [
  { slug: "female", label: "Female" },
  { slug: "male", label: "Male" },
  { slug: "nonbinary", label: "Nonbinary" },
  { slug: "androgynous", label: "Androgynous" },
  { slug: "custom", label: "Custom / Unspecified" },
] as const;

export const AVATAR_EMOTIONS = [
  { slug: "emotion-neutral", label: "Neutral", imagePath: "/avatar-assets/emotions/emotion-neutral.svg" },
  { slug: "emotion-smirk", label: "Smirk", imagePath: "/avatar-assets/emotions/emotion-smirk.svg" },
  { slug: "emotion-focused", label: "Focused", imagePath: "/avatar-assets/emotions/emotion-focused.svg" },
  { slug: "emotion-haunted", label: "Haunted", imagePath: "/avatar-assets/emotions/emotion-haunted.svg" },
  { slug: "emotion-angry", label: "Angry", imagePath: "/avatar-assets/emotions/emotion-angry.svg" },
  { slug: "emotion-soft", label: "Soft", imagePath: "/avatar-assets/emotions/emotion-soft.svg" },
  { slug: "emotion-glitch", label: "Glitch", imagePath: "/avatar-assets/emotions/emotion-glitch.svg" },
];

export interface AvatarRegistryItem {
  slug: string;
  name: string;
  category: string;
  imagePath: string;
  layerOrder: number;
  defaultTransform: AvatarTransform;
  allowedSpecies?: string[];
  allowedGenderPresentations?: string[];
  allowedPoses?: string[];
  downloadableBase?: boolean;
  placeholder?: boolean;
}

function item(
  partial: Omit<AvatarRegistryItem, "defaultTransform" | "layerOrder"> & {
    layerOrder?: number;
    defaultTransform?: AvatarTransform;
  },
): AvatarRegistryItem {
  return {
    layerOrder: partial.layerOrder ?? 500,
    defaultTransform: partial.defaultTransform ?? DEFAULT_AVATAR_TRANSFORM,
    downloadableBase: partial.downloadableBase ?? true,
    placeholder: partial.placeholder ?? true,
    ...partial,
  };
}

export const AVATAR_REGISTRY_ITEMS: AvatarRegistryItem[] = [
  item({ slug: "body-base-a", name: "Body A", category: "body", imagePath: "/avatar-assets/bodies/body-base-a.svg", layerOrder: 100 }),
  item({ slug: "body-base-b", name: "Body B", category: "body", imagePath: "/avatar-assets/bodies/body-base-b.svg", layerOrder: 100 }),
  item({ slug: "body-female-a", name: "Female Base A", category: "body", imagePath: "/avatar-assets/bodies/body-female-a.svg", layerOrder: 100, allowedGenderPresentations: ["female"] }),
  item({ slug: "body-male-a", name: "Male Base A", category: "body", imagePath: "/avatar-assets/bodies/body-male-a.svg", layerOrder: 100, allowedGenderPresentations: ["male"] }),
  item({ slug: "body-nonbinary-a", name: "Nonbinary Base A", category: "body", imagePath: "/avatar-assets/bodies/body-nonbinary-a.svg", layerOrder: 100, allowedGenderPresentations: ["nonbinary", "androgynous", "custom"] }),
  item({ slug: "eyes-cyan", name: "Cyan Eyes", category: "eyes", imagePath: "/avatar-assets/eyes/eyes-cyan.svg", layerOrder: 300 }),
  item({ slug: "eyes-gold", name: "Gold Eyes", category: "eyes", imagePath: "/avatar-assets/eyes/eyes-gold.svg", layerOrder: 300 }),
  item({ slug: "eyes-pink", name: "Pink Eyes", category: "eyes", imagePath: "/avatar-assets/eyes/eyes-pink.svg", layerOrder: 300 }),
  item({ slug: "ears-pointed-a", name: "Pointed Ears A", category: "ears", imagePath: "/avatar-assets/ears/ears-pointed-a.svg", layerOrder: 280 }),
  item({ slug: "hair-short-black", name: "Short Black", category: "hair", imagePath: "/avatar-assets/hair/hair-short-black.svg", layerOrder: 400 }),
  item({ slug: "hair-long-white", name: "Long White", category: "hair", imagePath: "/avatar-assets/hair/hair-long-white.svg", layerOrder: 400 }),
  item({ slug: "tiefling-horns-a", name: "Tiefling Horns", category: "horns", imagePath: "/avatar-assets/species/tiefling-horns-a.svg", layerOrder: 350, allowedSpecies: ["tiefling"] }),
  item({ slug: "nymph-leaves-a", name: "Nymph Vines", category: "horns", imagePath: "/avatar-assets/species/nymph-leaves-a.svg", layerOrder: 350, allowedSpecies: ["nymph"] }),
  item({ slug: "gorgon-snakes-a", name: "Gorgon Snakes", category: "horns", imagePath: "/avatar-assets/species/gorgon-snakes-a.svg", layerOrder: 350, allowedSpecies: ["gorgon"] }),
  item({ slug: "wings-a", name: "Wings A", category: "wings", imagePath: "/avatar-assets/wings/wings-a.svg", layerOrder: 450, defaultTransform: { x: 0.5, y: 0.4, scale: 1, rotation: 0 } }),
  item({ slug: "tail-a", name: "Tail A", category: "tails", imagePath: "/avatar-assets/tails/tail-a.svg", layerOrder: 120 }),
  item({ slug: "marking-a", name: "Marking A", category: "markings", imagePath: "/avatar-assets/markings/marking-a.svg", layerOrder: 420 }),
  item({ slug: "hands-neutral-a", name: "Neutral Hands", category: "hands", imagePath: "/avatar-assets/hands/hands-neutral-a.svg", layerOrder: 380 }),
  item({ slug: "outfit-initiate-coat", name: "Initiate Coat", category: "outerwear", imagePath: "/avatar-assets/outfits/outfit-initiate-coat.svg", layerOrder: 500 }),
  item({ slug: "top-initiate-a", name: "Initiate Top", category: "tops", imagePath: "/avatar-assets/tops/top-initiate-a.svg", layerOrder: 480 }),
  item({ slug: "pants-underwatch-a", name: "Underwatch Pants", category: "pants", imagePath: "/avatar-assets/pants/pants-underwatch-a.svg", layerOrder: 490 }),
  item({ slug: "skirt-veil-a", name: "Veil Skirt", category: "skirts", imagePath: "/avatar-assets/skirts/skirt-veil-a.svg", layerOrder: 490 }),
  item({ slug: "shoes-boots-a", name: "Boots A", category: "shoes", imagePath: "/avatar-assets/shoes/shoes-boots-a.svg", layerOrder: 510 }),
  item({ slug: "socks-stripe-a", name: "Stripe Socks", category: "socks", imagePath: "/avatar-assets/socks/socks-stripe-a.svg", layerOrder: 505 }),
  item({ slug: "accessory-pomegranate-pin", name: "Pomegranate Pin", category: "accessories", imagePath: "/avatar-assets/accessories/accessory-pomegranate-pin.svg", layerOrder: 600 }),
  item({ slug: "back-item-pack-a", name: "Signal Pack", category: "back-items", imagePath: "/avatar-assets/back-items/back-item-pack-a.svg", layerOrder: 550 }),
  item({ slug: "prop-relic-blade-a", name: "Relic Blade (cosmetic)", category: "fictional-props", imagePath: "/avatar-assets/fictional-props/prop-relic-blade-a.svg", layerOrder: 650, defaultTransform: { x: 0.62, y: 0.55, scale: 1, rotation: -8 } }),
  item({ slug: "tech-gear-terminal-a", name: "Hand Terminal", category: "tech-gear", imagePath: "/avatar-assets/tech-gear/tech-gear-terminal-a.svg", layerOrder: 660, defaultTransform: { x: 0.58, y: 0.6, scale: 0.9, rotation: 0 } }),
  item({ slug: "faction-flair-uprising-a", name: "Uprising Flair", category: "faction-flair", imagePath: "/avatar-assets/faction-flair/faction-flair-uprising-a.svg", layerOrder: 620 }),
  item({ slug: "effect-glitch-a", name: "Glitch Effect", category: "effects", imagePath: "/avatar-assets/effects/effect-glitch-a.svg", layerOrder: 700 }),
  item({ slug: "bg-underwatch-default", name: "Underwatch Default", category: "backgrounds", imagePath: "/avatar-assets/backgrounds/bg-underwatch-default.svg", layerOrder: 10, downloadableBase: true }),
  ...AVATAR_EMOTIONS.map((e) =>
    item({ slug: e.slug, name: e.label, category: "emotion", imagePath: e.imagePath, layerOrder: 320 }),
  ),
];

export interface SelectedAvatarItem {
  itemSlug: string;
  category: string;
  source: "official" | "private" | "shared";
  partId?: string;
  imagePath?: string;
  transform: AvatarTransform;
}

export function getRegistryItem(slug: string): AvatarRegistryItem | undefined {
  return AVATAR_REGISTRY_ITEMS.find((i) => i.slug === slug);
}

export function getItemsForCategory(
  category: string,
  filters?: { speciesSlug?: string; genderPresentation?: string; poseSlug?: string },
): AvatarRegistryItem[] {
  return AVATAR_REGISTRY_ITEMS.filter((item) => {
    if (item.category !== category) return false;
    if (filters?.speciesSlug && item.allowedSpecies && !item.allowedSpecies.includes(filters.speciesSlug)) {
      return false;
    }
    if (
      filters?.genderPresentation &&
      item.allowedGenderPresentations &&
      !item.allowedGenderPresentations.includes(filters.genderPresentation)
    ) {
      return false;
    }
    if (filters?.poseSlug && item.allowedPoses && !item.allowedPoses.includes(filters.poseSlug)) {
      return false;
    }
    return true;
  }).sort((a, b) => a.layerOrder - b.layerOrder);
}

export function getDownloadableBases(): AvatarRegistryItem[] {
  return AVATAR_REGISTRY_ITEMS.filter((i) => i.downloadableBase).sort(
    (a, b) => a.category.localeCompare(b.category) || a.layerOrder - b.layerOrder,
  );
}

export function parseSelectedItems(raw: unknown): SelectedAvatarItem[] {
  if (!Array.isArray(raw)) return [];
  const items: SelectedAvatarItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    if (typeof e.itemSlug !== "string" || typeof e.category !== "string") continue;
    const transform = (e.transform as AvatarTransform) ?? DEFAULT_AVATAR_TRANSFORM;
    items.push({
      itemSlug: e.itemSlug,
      category: e.category,
      source: (e.source as SelectedAvatarItem["source"]) ?? "official",
      partId: typeof e.partId === "string" ? e.partId : undefined,
      imagePath: typeof e.imagePath === "string" ? e.imagePath : undefined,
      transform: {
        x: typeof transform.x === "number" ? transform.x : 0.5,
        y: typeof transform.y === "number" ? transform.y : 0.5,
        scale: typeof transform.scale === "number" ? transform.scale : 1,
        rotation: typeof transform.rotation === "number" ? transform.rotation : 0,
      },
    });
  }
  return items;
}

export function isMovableCategory(category: string): boolean {
  return AVATAR_CATEGORIES.find((c) => c.slug === category)?.movable === true;
}
