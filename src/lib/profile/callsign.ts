export const RESERVED_CALLSIGNS = new Set([
  "edit",
  "avatar",
  "bases",
  "your-callsign",
  "profile",
  "admin",
  "api",
  "login",
  "register",
]);

const CALLSIGN_RE = /^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$/;

export function normalizeCallsign(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);
}

export function validateCallsign(raw: string): { ok: true; callsign: string } | { ok: false; error: string } {
  const callsign = normalizeCallsign(raw);
  if (callsign.length < 2) {
    return { ok: false, error: "Callsign must be at least 2 characters." };
  }
  if (callsign.length > 32) {
    return { ok: false, error: "Callsign must be 32 characters or fewer." };
  }
  if (!CALLSIGN_RE.test(callsign)) {
    return {
      ok: false,
      error: "Use lowercase letters, numbers, hyphens, and underscores only.",
    };
  }
  if (RESERVED_CALLSIGNS.has(callsign)) {
    return { ok: false, error: "That callsign is reserved." };
  }
  return { ok: true, callsign };
}

export function generateFallbackCallsign(seed: string, userId: string): string {
  const base = normalizeCallsign(seed) || "operative";
  const suffix = userId.slice(-6).toLowerCase();
  const candidate = `${base}-${suffix}`.slice(0, 32);
  const validated = validateCallsign(candidate);
  return validated.ok ? validated.callsign : `operative-${suffix}`;
}
