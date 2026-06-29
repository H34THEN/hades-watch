import type { ForumImageSource } from "@/generated/prisma/client";

type GeneratedImageConfig = {
  glyph?: string;
  theme?: string;
};

export function forumProfileImageUrl(
  userId: string,
  source: ForumImageSource,
  forumImagePath: string | null | undefined,
  avatarUrl: string | null | undefined,
): string | null {
  if (source === "UPLOADED" && forumImagePath) {
    return `/api/forums/profile-images/${userId}`;
  }
  if (source === "AVATAR" && avatarUrl) {
    return avatarUrl.startsWith("/") || avatarUrl.startsWith("http") ? avatarUrl : `/${avatarUrl}`;
  }
  return null;
}

export function forumGeneratedGlyph(
  callsign: string,
  config: GeneratedImageConfig | null | undefined,
): string {
  if (config?.glyph) return config.glyph.slice(0, 3).toUpperCase();
  return callsign.slice(0, 2).toUpperCase();
}

export function forumGeneratedTheme(config: GeneratedImageConfig | null | undefined): string {
  return config?.theme ?? "dead-index-violet";
}

export function signatureAssetImageUrl(
  assetId: string,
  imagePath: string | null | undefined,
): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `/api/forums/signatures/${assetId}`;
}
