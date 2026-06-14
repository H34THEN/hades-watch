import { z } from "zod";

const WEAK_AUTH_SECRETS = new Set([
  "replace-me-with-a-real-secret",
  "dev-secret-change-in-production",
  "changeme",
  "secret",
]);

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  AUTH_URL: z.string().url("AUTH_URL must be a valid URL"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Hades Watch"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_JITSI_BASE_URL: z.string().url().default("https://meet.jit.si"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  RATE_LIMIT_ENABLED: z
    .string()
    .optional()
    .transform((v) => v !== "false" && v !== "0"),
  TRUSTED_PROXY_HEADERS: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),
  DISABLE_DEV_INVITES: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),
  REQUIRE_EMAIL_VERIFICATION: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const messages = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    throw new Error(`Environment validation failed:\n${messages.join("\n")}`);
  }
  return result.data;
}

export function getEnv(): Env {
  if (!cached) cached = parseEnv();
  return cached;
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}

export function isSmtpConfigured(): boolean {
  const env = getEnv();
  return !!(env.SMTP_HOST && env.SMTP_FROM);
}

export function isRateLimitEnabled(): boolean {
  return getEnv().RATE_LIMIT_ENABLED !== false;
}

export function isDevInviteSeedingAllowed(): boolean {
  if (isProduction()) return false;
  if (getEnv().DISABLE_DEV_INVITES) return false;
  return true;
}

export function isEmailVerificationRequired(): boolean {
  return getEnv().REQUIRE_EMAIL_VERIFICATION === true;
}

export type SafetyIssue = {
  level: "error" | "warning";
  code: string;
  message: string;
};

export function getProductionSafetyIssues(): SafetyIssue[] {
  const issues: SafetyIssue[] = [];
  const env = getEnv();
  const secret = process.env.AUTH_SECRET ?? "";

  if (isProduction()) {
    if (WEAK_AUTH_SECRETS.has(secret.toLowerCase()) || secret.length < 32) {
      issues.push({
        level: "error",
        code: "weak_auth_secret",
        message: "AUTH_SECRET is weak or uses a default value. Set a strong random secret before launch.",
      });
    }

    if (env.AUTH_URL.includes("localhost")) {
      issues.push({
        level: "error",
        code: "localhost_auth_url",
        message: "AUTH_URL points to localhost in production.",
      });
    }

    if (!isSmtpConfigured()) {
      issues.push({
        level: "warning",
        code: "smtp_not_configured",
        message: "SMTP is not configured. Email verification and password reset will not work.",
      });
    }

    if (!env.RATE_LIMIT_ENABLED) {
      issues.push({
        level: "warning",
        code: "rate_limit_disabled",
        message: "RATE_LIMIT_ENABLED is false. Enable rate limiting before public launch.",
      });
    }
  } else {
    if (WEAK_AUTH_SECRETS.has(secret.toLowerCase())) {
      issues.push({
        level: "warning",
        code: "dev_auth_secret",
        message: "Using default AUTH_SECRET — acceptable for local dev only.",
      });
    }
  }

  return issues;
}

/** Call at app startup in production to fail fast on critical misconfig. */
export function assertProductionSafety(): void {
  if (!isProduction()) return;
  const errors = getProductionSafetyIssues().filter((i) => i.level === "error");
  if (errors.length > 0) {
    throw new Error(
      `Production safety check failed:\n${errors.map((e) => `- ${e.message}`).join("\n")}`,
    );
  }
}
