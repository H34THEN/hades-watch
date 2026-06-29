const CONTROL_CHAR_RE = /[\u0000-\u001f\u007f]/g;
const HTML_TAG_RE = /<[^>]*>/g;
const SCRIPT_PATTERN_RE = /javascript\s*:/gi;
const URL_PATTERN =
  /https?:\/\/[^\s<>"']+/gi;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function stripCommunityText(text: string, maxLen: number): string {
  return text
    .replace(HTML_TAG_RE, "")
    .replace(SCRIPT_PATTERN_RE, "")
    .replace(CONTROL_CHAR_RE, "")
    .trim()
    .slice(0, maxLen);
}

export function validateOptionalUrl(
  url: string | null | undefined,
): { ok: true; url: string | null } | { ok: false; error: string } {
  if (url == null || url.trim() === "") {
    return { ok: true, url: null };
  }

  const trimmed = url.trim();
  if (trimmed.length > 2048) {
    return { ok: false, error: "URL is too long." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are allowed." };
  }

  return { ok: true, url: parsed.href };
}

function linkifyEscapedText(text: string): string {
  let result = "";
  let lastIndex = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const url = match[0];
    const index = match.index ?? 0;
    result += text.slice(lastIndex, index);
    const escapedUrl = escapeHtml(url);
    result += `<a href="${escapedUrl}" rel="noopener noreferrer nofollow ugc" target="_blank">${escapedUrl}</a>`;
    lastIndex = index + url.length;
  }

  result += text.slice(lastIndex);
  return result;
}

export function formatCommunityBody(text: string): string {
  const escaped = escapeHtml(text);
  return linkifyEscapedText(escaped).replace(/\n/g, "<br />");
}
