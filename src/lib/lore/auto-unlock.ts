import { ORIGIN_LORE_SLUG } from "@/lib/factions/origin-dossier";

export const AUTO_UNLOCK_LORE_SLUGS = new Set<string>([ORIGIN_LORE_SLUG]);

export function isAutoUnlockLoreSlug(slug: string): boolean {
  return AUTO_UNLOCK_LORE_SLUGS.has(slug);
}
