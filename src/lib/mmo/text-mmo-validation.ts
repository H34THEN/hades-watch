import { createHash } from "crypto";
import type { Prisma } from "@/generated/prisma/client";
import {
  hashCipherAnswerVariants,
  hashNormalizedCipherAnswer,
  normalizeCipherAnswerForCheck,
} from "@/lib/ciphers/normalize";

export const MMO_TEXT_MAX_SHORT = 280;
export const MMO_TEXT_MAX_LONG = 2000;
export const MMO_URL_MAX = 2048;

const UNSAFE_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /file:/i,
  /<script/i,
  /on\w+\s*=/i,
];

export function sanitizeMmoText(raw: string, maxLen: number): string {
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLen);
}

export function validateMmoUrl(url: string): { ok: true; url: string } | { ok: false; error: string } {
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, error: "URL is required." };
  if (trimmed.length > MMO_URL_MAX) return { ok: false, error: "URL is too long." };
  for (const pat of UNSAFE_PATTERNS) {
    if (pat.test(trimmed)) return { ok: false, error: "Unsafe URL protocol." };
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, error: "Only http/https URLs are allowed." };
    }
    return { ok: true, url: parsed.toString() };
  } catch {
    return { ok: false, error: "Invalid URL." };
  }
}

export function hashMmoCipherAnswer(answer: string): string {
  return hashNormalizedCipherAnswer(normalizeCipherAnswerForCheck(answer, "default"));
}

export function hashMmoCipherVariants(variants: string[]): string[] {
  return hashCipherAnswerVariants(variants, "default");
}

export function playerDisplayName(
  character: { callsign: string } | null,
  user: { name: string | null; email: string },
): string {
  return character?.callsign ?? user.name ?? user.email.split("@")[0] ?? "operative";
}

export function formatFieldLogMessage(template: string, player: string): string {
  return template.replace(/\{player\}/g, player);
}

export function mmoOptionsJson(
  options: { options: Array<{ id: string; label: string }>; correctId: string },
): Prisma.InputJsonValue {
  return options as unknown as Prisma.InputJsonValue;
}

export function hashForStorage(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}
