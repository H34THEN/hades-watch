"use server";

import { writeAuditLog } from "@/lib/audit";
import { createVerificationForNewUser } from "@/lib/actions/email-verification";
import { hashPassword } from "@/lib/auth/password";
import { consumeInviteCode, findInviteByCode, validateInviteCode } from "@/lib/invites";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export type RegisterResult =
  | { success: true }
  | { success: false; error: string };

export async function registerUser(
  formData: FormData,
): Promise<RegisterResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    inviteCode: formData.get("inviteCode") as string,
    name: (formData.get("name") as string) || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid registration data",
    };
  }

  const { email, password, inviteCode, name } = parsed.data;

  try {
    await rateLimitOrThrow({
      key: `register:${email.toLowerCase()}`,
      limit: 5,
      windowSec: 3600,
    });
  } catch {
    return { success: false, error: "Too many registration attempts. Try again later." };
  }

  const inviteResult = await validateInviteCode(inviteCode, email);

  if (!inviteResult.valid) {
    await writeAuditLog({
      action: "auth.register.failed",
      metadata: { reason: inviteResult.reason },
    });
    return { success: false, error: inviteResult.message };
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  try {
    const passwordHash = await hashPassword(password);
    const role = await prisma.role.findUnique({
      where: { name: inviteResult.roleGranted },
    });

    if (!role) {
      return { success: false, error: "Assigned role not found. Contact an admin." };
    }

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name: name ?? email.split("@")[0],
          passwordHash,
        },
      });

      await tx.userRole.create({
        data: { userId: created.id, roleId: role.id },
      });

      const invite = await findInviteByCode(inviteCode);
      if (invite) {
        await tx.inviteRedemption.create({
          data: {
            inviteCodeId: invite.id,
            userId: created.id,
            roleGranted: inviteResult.roleGranted,
          },
        });
      }

      await consumeInviteCode(inviteCode, tx);

      return created;
    });

    await writeAuditLog({
      action: "auth.register",
      actorId: user.id,
      targetType: "user",
      targetId: user.id,
      metadata: { role: inviteResult.roleGranted, invite: inviteCode },
    });

    await createVerificationForNewUser(user.id, user.email);

    return { success: true };
  } catch (error) {
    console.error("[register]", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}
