/**
 * In-memory rate limiter — suitable for single-instance local dev only.
 *
 * NOT sufficient for multi-instance production. Replace with Redis, Upstash,
 * or Postgres-backed limiting before scaling horizontally.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  /** Unique key prefix, e.g. "login:email@example.com" */
  key: string;
  /** Max attempts in window */
  limit: number;
  /** Window size in seconds */
  windowSec: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = store.get(config.key);

  if (!entry || now >= entry.resetAt) {
    const resetAt = now + config.windowSec * 1000;
    store.set(config.key, { count: 1, resetAt });
    return { allowed: true, remaining: config.limit - 1, resetAt };
  }

  if (entry.count >= config.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

export async function rateLimitOrThrow(
  config: RateLimitConfig,
  message = "Too many attempts. Please try again later.",
): Promise<void> {
  const { isRateLimitEnabled } = await import("@/lib/env");
  if (!isRateLimitEnabled()) return;

  const result = await checkRateLimit(config);
  if (!result.allowed) {
    throw new RateLimitError(message, result.resetAt);
  }
}

export class RateLimitError extends Error {
  resetAt: number;
  constructor(message: string, resetAt: number) {
    super(message);
    this.name = "RateLimitError";
    this.resetAt = resetAt;
  }
}

/** Periodic cleanup — call optionally in long-running processes */
export function pruneRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
}
