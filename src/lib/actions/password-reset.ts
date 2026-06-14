"use server";

import { writeAuditLog } from "@/lib/audit";
import { hashPassword } from "@/lib/auth/password";
import { appUrl, sendEmail } from "@/lib/email/email";
import { buildPasswordResetEmail } from "@/lib/email/templates";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { generateSecureToken, hashToken } from "@/lib/tokens";
import { z } from "zod";

const TOKEN_TTL_HOURS = 1;

export type ActionResult =
  | { success: true; devLink?: string }
  | { success: false; error: string };

const emailSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(16),
  password: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const GENERIC_MESSAGE =
  "If an account exists for that email, a reset link has been sent.";

export async function requestPasswordResetAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, error: "Enter a valid email address." };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    await rateLimitOrThrow({
      key: `reset:${email}`,
      limit: 3,
      windowSec: 3600,
    });
  } catch {
    return { success: true };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && !user.disabled && !user.banned) {
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const resetUrl = appUrl(`/reset-password?token=${rawToken}`);
    const template = buildPasswordResetEmail(resetUrl);
    const result = await sendEmail({ to: user.email, ...template });

    await writeAuditLog({
      action: "auth.password.reset.request",
      actorId: user.id,
      targetType: "user",
      targetId: user.id,
    });

    return { success: true, devLink: result.devLink };
  }

  // Always return success to avoid email enumeration
  return { success: true };
}

export async function resetPasswordAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid reset data",
    };
  }

  const tokenHash = hashToken(parsed.data.token);
  const record = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
  });

  if (!record) {
    return { success: false, error: "Reset link is invalid or expired." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await writeAuditLog({
    action: "auth.password.reset.complete",
    actorId: record.userId,
    targetType: "user",
    targetId: record.userId,
  });

  return { success: true };
}

export { GENERIC_MESSAGE as PASSWORD_RESET_GENERIC_MESSAGE };
