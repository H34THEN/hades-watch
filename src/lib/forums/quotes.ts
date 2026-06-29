import { stripCommunityText } from "@/lib/community/sanitize";

export const MAX_QUOTE_EXCERPT = 300;

export function buildQuoteExcerpt(body: string): string {
  const stripped = stripCommunityText(body, MAX_QUOTE_EXCERPT + 50);
  if (stripped.length <= MAX_QUOTE_EXCERPT) {
    return stripped;
  }
  return `${stripped.slice(0, MAX_QUOTE_EXCERPT).trim()}…`;
}

export function parseMentions(text: string, max = 5): string[] {
  const matches = text.match(/@([a-zA-Z0-9_-]{2,32})/g) ?? [];
  const unique = new Set<string>();
  for (const match of matches) {
    const callsign = match.slice(1).toLowerCase();
    unique.add(callsign);
    if (unique.size >= max) break;
  }
  return [...unique];
}
