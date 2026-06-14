const SPOTIFY_PLAYLIST_WEB =
  /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]{22})(?:\?.*)?$/;
const SPOTIFY_PLAYLIST_URI = /^spotify:playlist:([a-zA-Z0-9]{22})$/;

export interface ParsedSpotifyPlaylist {
  playlistId: string;
  embedUrl: string;
  canonicalUrl: string;
}

/**
 * Parse and normalize a Spotify playlist URL or URI.
 * Rejects non-Spotify domains, raw HTML, javascript:, and non-playlist types.
 */
export function parseSpotifyPlaylistUrl(input: string): ParsedSpotifyPlaylist | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    trimmed.includes("<") ||
    trimmed.includes(">")
  ) {
    return null;
  }

  let playlistId: string | null = null;

  const webMatch = trimmed.match(SPOTIFY_PLAYLIST_WEB);
  if (webMatch) {
    playlistId = webMatch[1];
  } else {
    const uriMatch = trimmed.match(SPOTIFY_PLAYLIST_URI);
    if (uriMatch) playlistId = uriMatch[1];
  }

  if (!playlistId) return null;

  return {
    playlistId,
    embedUrl: `https://open.spotify.com/embed/playlist/${playlistId}`,
    canonicalUrl: `https://open.spotify.com/playlist/${playlistId}`,
  };
}
