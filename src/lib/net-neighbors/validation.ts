const SAFE_URL_PATTERN = /^https?:\/\/.+/i;

export function validateOutboundUrl(url: string): { ok: true; url: string } | { ok: false; error: string } {
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, error: "URL is required." };
  if (trimmed.length > 2048) return { ok: false, error: "URL is too long." };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are allowed." };
  }

  if (!SAFE_URL_PATTERN.test(parsed.href)) {
    return { ok: false, error: "Invalid URL format." };
  }

  return { ok: true, url: parsed.href };
}

export function parseTagsInput(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((t) => t.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .slice(0, 8)
    .map((t) => t.slice(0, 32));
}

export function stripUserText(raw: string, maxLen: number): string {
  return raw
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLen);
}
