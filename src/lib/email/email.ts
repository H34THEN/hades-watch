import { getEnv, isProduction, isSmtpConfigured } from "@/lib/env";
import type { EmailPayload } from "@/lib/email/templates";

/**
 * Email abstraction. When SMTP is not configured, logs a safe dev notice.
 * Never logs raw tokens in production.
 */
export async function sendEmail(payload: EmailPayload): Promise<{ sent: boolean; devLink?: string }> {
  if (isSmtpConfigured()) {
    // SMTP transport not wired yet — log intent without secrets
    console.info(`[email] Would send to ${payload.to}: ${payload.subject}`);
    // Phase 6: integrate nodemailer or provider SDK here
    return { sent: false };
  }

  if (!isProduction()) {
    const linkMatch = payload.text.match(/https?:\/\/[^\s]+/);
    const devLink = linkMatch?.[0];
    console.info(
      `[email:dev] SMTP not configured. Email to ${payload.to}: ${payload.subject}`,
    );
    if (devLink) {
      console.warn(`[email:dev] Link (local dev only): ${devLink}`);
      return { sent: false, devLink };
    }
    return { sent: false };
  }

  console.error(`[email] SMTP not configured — cannot send to ${payload.to}`);
  return { sent: false };
}

export function appUrl(path: string): string {
  const base = getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
