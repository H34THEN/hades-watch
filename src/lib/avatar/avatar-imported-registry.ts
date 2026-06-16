import type { AvatarRegistryItem, AvatarTransform } from "@/lib/avatar/avatar-types";

const DEFAULT: AvatarTransform = { x: 0.5, y: 0.5, scale: 1, rotation: 0 };

function imported(
  partial: Omit<AvatarRegistryItem, "defaultTransform" | "layerOrder"> & {
    layerOrder?: number;
    defaultTransform?: AvatarTransform;
  },
): AvatarRegistryItem {
  return {
    layerOrder: partial.layerOrder ?? 500,
    defaultTransform: partial.defaultTransform ?? DEFAULT,
    downloadableBase: partial.downloadableBase ?? true,
    placeholder: false,
    ...partial,
  };
}

/** PNG assets migrated from src/components/avatar/avatar assets → public/avatar-assets/ */
export const AVATAR_IMPORTED_REGISTRY_ITEMS: AvatarRegistryItem[] = [
  imported({
    slug: "body-male-tiefling-base-png",
    name: "Male Tiefling Base (PNG)",
    category: "body",
    imagePath: "/avatar-assets/bodies/male-tiefling-base-v02.png",
    layerOrder: 105,
    allowedSpecies: ["tiefling"],
    allowedGenderPresentations: ["male"],
  }),
  imported({
    slug: "body-female-tiefling-base-png",
    name: "Female Tiefling Base (PNG)",
    category: "body",
    imagePath: "/avatar-assets/bodies/female-tiefling-base.png",
    layerOrder: 105,
    allowedSpecies: ["tiefling"],
    allowedGenderPresentations: ["female"],
  }),
  imported({
    slug: "body-male-gorgon-base-png",
    name: "Male Gorgon Base (PNG)",
    category: "body",
    imagePath: "/avatar-assets/bodies/male-gorgon-base-v02.png",
    layerOrder: 105,
    allowedSpecies: ["gorgon"],
    allowedGenderPresentations: ["male"],
  }),
  imported({
    slug: "body-male-automaton-base-png",
    name: "Male Automaton Base (PNG)",
    category: "body",
    imagePath: "/avatar-assets/bodies/male-automaton-base-v02.png",
    layerOrder: 105,
    allowedSpecies: ["automaton"],
    allowedGenderPresentations: ["male"],
  }),
  imported({
    slug: "body-male-wraithborn-base-png",
    name: "Male Wraithborn Base (PNG)",
    category: "body",
    imagePath: "/avatar-assets/bodies/male-wraithborn-base-v02.png",
    layerOrder: 105,
    allowedSpecies: ["wraithborn"],
    allowedGenderPresentations: ["male"],
  }),
  imported({
    slug: "accessory-dead-index-keyring",
    name: "Dead Index Keyring",
    category: "accessories",
    imagePath: "/avatar-assets/accessories/dead-index-keyring.png",
    layerOrder: 610,
    defaultTransform: { x: 0.55, y: 0.65, scale: 0.85, rotation: 0 },
  }),
  imported({
    slug: "accessory-archivist-signal-cuff",
    name: "Archivist Signal Cuff",
    category: "accessories",
    imagePath: "/avatar-assets/accessories/archivist-signal-cuff.png",
    layerOrder: 610,
    defaultTransform: { x: 0.42, y: 0.58, scale: 0.9, rotation: 0 },
  }),
  imported({
    slug: "accessory-black-pomegranate-pendant",
    name: "Black Pomegranate Pendant",
    category: "accessories",
    imagePath: "/avatar-assets/accessories/black-pomegranate-pendant.png",
    layerOrder: 610,
  }),
  imported({
    slug: "outerwear-dead-index-mantle",
    name: "Dead Index Mantle",
    category: "outerwear",
    imagePath: "/avatar-assets/outerwear/coat-dead-index-mantle.png",
    layerOrder: 520,
  }),
  imported({
    slug: "outerwear-underwatch-operative-coat",
    name: "Underwatch Operative Coat",
    category: "outerwear",
    imagePath: "/avatar-assets/outerwear/coat-underwatch-operative-coat.png",
    layerOrder: 520,
  }),
  imported({
    slug: "accessory-underclinic-boots",
    name: "Underclinic Utility Boots",
    category: "shoes",
    imagePath: "/avatar-assets/accessories/acc-underclinic-utility-boots.png",
    layerOrder: 515,
  }),
];
