import { createHash, randomBytes } from "crypto";

export function generateSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function hashToken(token: string): string {
  const salt = process.env.AUTH_SECRET ?? "dev-salt";
  return createHash("sha256")
    .update(`${token}:${salt}`)
    .digest("hex");
}

export function normalizeCipherAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hashCipherAnswer(answer: string): string {
  return createHash("sha256")
    .update(normalizeCipherAnswer(answer))
    .digest("hex");
}

export function tokensMatch(rawToken: string, storedHash: string): boolean {
  return hashToken(rawToken) === storedHash;
}
