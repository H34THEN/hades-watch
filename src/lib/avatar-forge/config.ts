/**
 * Server-only Avatar Forge GPT configuration.
 *
 * Do not import this module into client components. The Avatar Forge GPT URL
 * must remain server-side until an approved unlock succeeds.
 *
 * Configure on the server via AVATAR_FORGE_GPT_URL (never NEXT_PUBLIC_*).
 */
export function getAvatarForgeGptUrl(): string | null {
  const url = process.env.AVATAR_FORGE_GPT_URL?.trim();
  if (!url) return null;
  if (!url.startsWith("https://")) return null;
  return url;
}

export function isAvatarForgeConfigured(): boolean {
  return getAvatarForgeGptUrl() !== null;
}
