"use server";

import { prisma } from "@/lib/prisma";
import {
  getEnv,
  getProductionSafetyIssues,
  isDevInviteSeedingAllowed,
  isEmailVerificationRequired,
  isProduction,
  isRateLimitEnabled,
  isSmtpConfigured,
} from "@/lib/env";

export interface LaunchCheckItem {
  id: string;
  label: string;
  status: "ok" | "warning" | "error" | "manual";
  detail?: string;
}

export async function getLaunchChecklist(): Promise<LaunchCheckItem[]> {
  const env = getEnv();
  const safetyIssues = getProductionSafetyIssues();

  const devInviteCount = await prisma.inviteCode.count({
    where: { isDevCode: true, revoked: false },
  });

  const items: LaunchCheckItem[] = [
    {
      id: "auth_secret",
      label: "Strong AUTH_SECRET configured",
      status: safetyIssues.some((i) => i.code === "weak_auth_secret")
        ? "error"
        : safetyIssues.some((i) => i.code === "dev_auth_secret")
          ? "warning"
          : "ok",
    },
    {
      id: "auth_url",
      label: "Production AUTH_URL (https://hadeswatch.com)",
      status: isProduction() && env.AUTH_URL.includes("localhost") ? "error" : isProduction() ? "ok" : "manual",
      detail: env.AUTH_URL,
    },
    {
      id: "dev_invites",
      label: "DEV-* invite codes removed or revoked",
      status: devInviteCount > 0 ? "error" : "ok",
      detail: devInviteCount > 0 ? `${devInviteCount} active dev invites` : undefined,
    },
    {
      id: "smtp",
      label: "SMTP configured for email flows",
      status: isSmtpConfigured() ? "ok" : "warning",
    },
    {
      id: "rate_limit",
      label: "Rate limiting enabled",
      status: isRateLimitEnabled() ? "ok" : "warning",
    },
    {
      id: "email_verify",
      label: "Email verification requirement configured",
      status: isEmailVerificationRequired() ? "ok" : "manual",
      detail: isEmailVerificationRequired() ? "Required" : "Optional (set REQUIRE_EMAIL_VERIFICATION=true for production)",
    },
    {
      id: "https",
      label: "HTTPS via Cloudflare + Nginx",
      status: "manual",
    },
    {
      id: "backups",
      label: "Database backups configured and tested",
      status: "manual",
    },
    {
      id: "migrate",
      label: "Run npx prisma migrate deploy on production",
      status: "manual",
    },
    {
      id: "build",
      label: "Production build passes (npm run build)",
      status: "manual",
    },
    {
      id: "seed_guard",
      label: "Dev seeding disabled in production",
      status: !isDevInviteSeedingAllowed() && isProduction() ? "ok" : isProduction() ? "warning" : "ok",
    },
  ];

  return items;
}
