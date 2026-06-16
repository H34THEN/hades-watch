export const AVATAR_CANVAS_SIZE = 1024;

export interface AvatarTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface AvatarRegistryItem {
  slug: string;
  name: string;
  category: string;
  imagePath: string;
  layerOrder: number;
  defaultTransform: AvatarTransform;
  allowedSpecies?: string[];
  allowedGenderPresentations?: string[];
  allowedFactions?: string[];
  allowedPoses?: string[];
  downloadableBase?: boolean;
  placeholder?: boolean;
}

export interface SelectedAvatarItem {
  itemSlug: string;
  category: string;
  source: "official" | "private" | "shared";
  partId?: string;
  imagePath?: string;
  transform: AvatarTransform;
}
