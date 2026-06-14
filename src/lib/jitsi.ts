const JITSI_BASE =
  process.env.NEXT_PUBLIC_JITSI_BASE_URL ?? "https://meet.jit.si";

function randomSuffix(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function slugifyRoomPrefix(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

/**
 * Generate an opaque Jitsi room name.
 * Format: hadeswatch-{prefix}-{randomSuffix}
 *
 * Jitsi rooms are NOT private by default — anyone with the URL can join.
 */
export function generateJitsiRoomName(prefix = "briefing"): string {
  const slug = slugifyRoomPrefix(prefix) || "briefing";
  return `hadeswatch-${slug}-${randomSuffix()}`;
}

export function buildJitsiUrl(roomName: string): string {
  const base = JITSI_BASE.replace(/\/$/, "");
  return `${base}/${roomName}`;
}

export function getJitsiBaseUrl(): string {
  return JITSI_BASE.replace(/\/$/, "");
}
