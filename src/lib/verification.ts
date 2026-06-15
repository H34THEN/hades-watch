import { createHmac } from "crypto";
import type { InviteVerificationMethod } from "@/generated/prisma/client";

const MIN_LENGTH = 8;
const MAX_LENGTH = 4096;

const DANGEROUS_PREFIXES = ["javascript:", "data:", "vbscript:"];

export const VERIFICATION_METHOD_LABELS: Record<InviteVerificationMethod, string> = {
  SIGNAL_SAFETY_NUMBER: "Signal Safety Number",
  SIMPLEX_CONTACT: "SimpleX Contact / Safety Code",
  MATRIX_DEVICE: "Matrix Device Fingerprint",
  SESSION_ID: "Session ID / Fingerprint",
  PGP_FINGERPRINT: "PGP Public Key Fingerprint",
  SSH_FINGERPRINT: "SSH Public Key Fingerprint",
  OTHER: "Other",
};

export function getVerificationPepper(): string {
  return process.env.VERIFICATION_PEPPER || process.env.AUTH_SECRET || "dev-verification-pepper";
}

/** Normalize safety numbers, fingerprints, and verification phrases for comparison. */
export function normalizeVerificationValue(input: string): string {
  let value = input.trim();
  const lower = value.toLowerCase();
  for (const prefix of DANGEROUS_PREFIXES) {
    if (lower.startsWith(prefix)) {
      throw new Error("Invalid verification value");
    }
  }
  if (value.includes("<") || value.includes(">")) {
    throw new Error("Invalid verification value");
  }

  value = value.toUpperCase();
  value = value.replace(/[\s\-:./\\|]+/g, "");
  return value;
}

export function validateVerificationValueLength(normalized: string): boolean {
  return normalized.length >= MIN_LENGTH && normalized.length <= MAX_LENGTH;
}

export function hashVerificationValue(normalized: string): string {
  return createHmac("sha256", getVerificationPepper()).update(normalized).digest("hex");
}

/** Last 4 characters of normalized value for safe display. */
export function getVerificationPreview(normalized: string): string {
  if (normalized.length <= 4) return "••••";
  return normalized.slice(-4);
}

export function compareVerificationValues(
  expectedHash: string,
  submittedValue: string,
): boolean {
  try {
    const normalized = normalizeVerificationValue(submittedValue);
    if (!validateVerificationValueLength(normalized)) return false;
    const submittedHash = hashVerificationValue(normalized);
    return submittedHash === expectedHash;
  } catch {
    return false;
  }
}

export function formatVerificationPreviewLabel(
  method: InviteVerificationMethod,
  preview: string | null | undefined,
): string {
  const label = VERIFICATION_METHOD_LABELS[method];
  if (!preview) return label;
  return `${label} ending in ${preview}`;
}

export function getEntryVerificationDisplay(
  status: string,
): string {
  switch (status) {
    case "MATCHED":
      return "Trusted Channel Match";
    case "MISMATCHED":
      return "Manual Review Required";
    case "MISSING":
      return "Verification Missing";
    case "MANUAL_REVIEW":
      return "Awaiting Admin Review";
    case "NOT_REQUIRED":
      return "Standard Invite Entry";
    default:
      return "Unknown";
  }
}
