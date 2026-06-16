import { createHash } from "crypto";

export type CipherAnswerNormalization =
  | "default"
  | "strip_the"
  | "strip_the_black";

export function normalizeCipherAnswerForCheck(
  answer: string,
  mode: CipherAnswerNormalization = "default",
): string {
  let normalized = answer.trim().toLowerCase().replace(/\s+/g, " ");
  if (mode === "strip_the" || mode === "strip_the_black") {
    normalized = normalized.replace(/^the\s+/, "");
  }
  if (mode === "strip_the_black") {
    normalized = normalized.replace(/^black\s+/, "");
  }
  return normalized;
}

export function hashNormalizedCipherAnswer(normalized: string): string {
  return createHash("sha256").update(normalized).digest("hex");
}

export function hashCipherAnswerVariants(
  variants: string[],
  mode: CipherAnswerNormalization = "default",
): string[] {
  const hashes = new Set<string>();
  for (const variant of variants) {
    hashes.add(
      hashNormalizedCipherAnswer(normalizeCipherAnswerForCheck(variant, mode)),
    );
  }
  return [...hashes];
}

export function isCipherAnswerCorrect(
  answer: string,
  acceptedHashes: string[],
  mode: CipherAnswerNormalization = "default",
): boolean {
  const normalized = normalizeCipherAnswerForCheck(answer, mode);
  const hash = hashNormalizedCipherAnswer(normalized);
  return acceptedHashes.includes(hash);
}
