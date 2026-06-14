"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { appUrl, sendEmail } from "@/lib/email/email";
import { buildVerificationEmail } from "@/lib/email/templates";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { generateSecureToken, hashToken } from "@/lib/tokens";

const TOKEN_TTL_HOURS = 24;

export type ActionResult =
  | { success: true; devLink?: string }
  | { success: false; error: string };

async function createVerificationToken(userId: string): Promise<string> {
  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await prisma.emailVerificationToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return rawToken;
}

export async function sendVerificationEmailAction(): Promise<ActionResult> {
  const user = await requireAuth();

  await rateLimitOrThrow({
    key: `verify:${user.id}`,
    limit: 3,
    windowSec: 3600,
  });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return { success: false, error: "User not found." };
  if (dbUser.emailVerified) {
    return { success: false, error: "Email is already verified." };
  }

  const rawToken = await createVerificationToken(user.id);
  const verifyUrl = appUrl(`/verify-email?token=${rawToken}`);
  const template = buildVerificationEmail(verifyUrl);
  const result = await sendEmail({ to: dbUser.email, ...template });

  await writeAuditLog({
    action: "auth.email.verify.request",
    actorId: user.id,
    targetType: "user",
    targetId: user.id,
  });

  revalidatePath("/profile");
  return { success: true, devLink: result.devLink };
}

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  if (!token || token.length < 16) {
    return { success: false, error: "Invalid verification link." };
  }

  const tokenHash = hashToken(token);
  const record = await prisma.emailVerificationToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true },
  });

  if (!record) {
    return { success: false, error: "Verification link is invalid or expired." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await writeAuditLog({
    action: "auth.email.verified",
    actorId: record.userId,
    targetType: "user",
    targetId: record.userId,
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function createVerificationForNewUser(userId: string, email: string): Promise<void> {
  const rawToken = await createVerificationToken(userId);
  const verifyUrl = appUrl(`/verify-email?token=${rawToken}`);
  const template = buildVerificationEmail(verifyUrl);
  await sendEmail({ to: email, ...template });

  await writeAuditLog({
    action: "auth.email.verify.request",
    actorId: userId,
    targetType: "user",
    targetId: userId,
    metadata: { trigger: "registration" },
  });
}

export async function getEmailVerificationStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true, email: true },
  });
  return user;
}
