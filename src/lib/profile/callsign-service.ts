import type { PrismaClient } from "@/generated/prisma/client";
import {
  generateFallbackCallsign,
  normalizeCallsign,
  validateCallsign,
} from "@/lib/profile/callsign";

export interface CallsignSeedUser {
  id: string;
  name: string | null;
  email: string;
}

/** Derive a callsign seed from codename/name — never from email. */
export function deriveCallsignSeed(user: CallsignSeedUser): string {
  const name = user.name?.trim();
  if (name && !name.includes("@")) {
    return name;
  }
  return `operative-${user.id.slice(-6)}`;
}

export async function findAvailableCallsign(
  prisma: PrismaClient,
  base: string,
  excludeUserId?: string,
): Promise<string> {
  let candidate = normalizeCallsign(base);
  const first = validateCallsign(candidate);
  if (!first.ok) {
    candidate = normalizeCallsign("operative");
  }

  for (let suffix = 0; suffix < 100; suffix++) {
    const trySlug =
      suffix === 0
        ? candidate
        : `${candidate.slice(0, Math.max(2, 28 - String(suffix).length - 1))}-${suffix}`;
    const validated = validateCallsign(trySlug);
    if (!validated.ok) continue;

    const taken = await prisma.character.findFirst({
      where: {
        callsign: { equals: validated.callsign, mode: "insensitive" },
        ...(excludeUserId ? { NOT: { userId: excludeUserId } } : {}),
      },
      select: { id: true },
    });
    if (!taken) return validated.callsign;
  }

  return generateFallbackCallsign(base, excludeUserId ?? "user");
}

export interface EnsureCallsignResult {
  callsign: string;
  isPublic: boolean;
  created: boolean;
}

/**
 * Ensure the user has a Character with a callsign.
 * Does not overwrite an existing callsign.
 */
export async function ensureUserCallsign(
  prisma: PrismaClient,
  userId: string,
): Promise<EnsureCallsignResult | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, accountStatus: true, disabled: true, banned: true },
  });
  if (!user || user.disabled || user.banned || user.accountStatus !== "Approved") {
    return null;
  }

  const existing = await prisma.character.findUnique({
    where: { userId },
    select: { callsign: true, isPublic: true },
  });

  if (existing?.callsign) {
    return {
      callsign: existing.callsign.toLowerCase(),
      isPublic: existing.isPublic,
      created: false,
    };
  }

  const seed = deriveCallsignSeed(user);
  const callsign = await findAvailableCallsign(prisma, seed, userId);

  const character = await prisma.character.upsert({
    where: { userId },
    create: {
      userId,
      callsign,
      isPublic: true,
    },
    update: {
      callsign,
    },
    select: { callsign: true, isPublic: true },
  });

  return {
    callsign: character.callsign.toLowerCase(),
    isPublic: character.isPublic,
    created: !existing,
  };
}
