import { randomInt } from "crypto";
import { CHAT_ALIAS_MAX_LENGTH, CHAT_ALIAS_PREFIXES } from "@/lib/chat/constants";

const ALIAS_PATTERN = /^[A-Za-z0-9_-]{2,32}$/;

export function generateRandomChatAlias(): string {
  const prefix = CHAT_ALIAS_PREFIXES[randomInt(CHAT_ALIAS_PREFIXES.length)];
  const suffix = randomInt(10, 999);
  return `${prefix}${suffix}`.slice(0, CHAT_ALIAS_MAX_LENGTH);
}

export function normalizeChatAlias(raw: string): string {
  return raw.trim().replace(/\s+/g, "");
}

export function validateChatAlias(alias: string): { ok: true; alias: string } | { ok: false; error: string } {
  const normalized = normalizeChatAlias(alias);
  if (!normalized) {
    return { ok: false, error: "Chat alias is required." };
  }
  if (normalized.length < 2 || normalized.length > CHAT_ALIAS_MAX_LENGTH) {
    return { ok: false, error: `Alias must be 2–${CHAT_ALIAS_MAX_LENGTH} characters.` };
  }
  if (!ALIAS_PATTERN.test(normalized)) {
    return { ok: false, error: "Alias may only use letters, numbers, underscores, and hyphens." };
  }
  return { ok: true, alias: normalized };
}

export function resolveDefaultChatAlias(options: {
  preferred?: string | null;
  displayName?: string | null;
  callsign?: string | null;
}): string {
  if (options.preferred) {
    const validated = validateChatAlias(options.preferred);
    if (validated.ok) return validated.alias;
  }
  if (options.callsign) {
    const validated = validateChatAlias(options.callsign);
    if (validated.ok) return validated.alias;
  }
  if (options.displayName) {
    const validated = validateChatAlias(options.displayName.replace(/\s+/g, ""));
    if (validated.ok) return validated.alias;
  }
  return generateRandomChatAlias();
}
