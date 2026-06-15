"use server";

import { writeAuditLog } from "@/lib/audit";
import { createVerificationForNewUser } from "@/lib/actions/email-verification";
import { hashPassword } from "@/lib/auth/password";
import { consumeInviteCode, findInviteByCode, validateInviteCode } from "@/lib/invites";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import type {
  InviteVerificationMethod,
  InviteVerificationStatus,
  UserAccountStatus,
} from "@/generated/prisma/client";
import {
  compareVerificationValues,
  getVerificationPreview,
  hashVerificationValue,
  normalizeVerificationValue,
  validateVerificationValueLength,
} from "@/lib/verification";
import { randomBytes } from "crypto";

export type RegisterResult =
  | { success: true; approved: boolean; redirectTo: string }
  | { success: false; error: string };

function isSyntheticEmail(email: string): boolean {
  return email.endsWith("@operative.hadeswatch.local");
}

function resolveLoginEmail(email: string | undefined, codename: string): string {
  if (email?.trim()) return email.trim().toLowerCase();
  const slug = codename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  const suffix = randomBytes(3).toString("hex");
  return `${slug || "operative"}-${suffix}@operative.hadeswatch.local`;
}

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const raw = {
    email: (formData.get("email") as string) || undefined,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    inviteCode: formData.get("inviteCode") as string,
    name: formData.get("name") as string,
    verificationValue: (formData.get("verificationValue") as string) || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid registration data",
    };
  }

  const { password, inviteCode, name, verificationValue } = parsed.data;
  const email = resolveLoginEmail(parsed.data.email, name);

  try {
    await rateLimitOrThrow({
      key: `register:${inviteCode.toUpperCase()}`,
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

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this identifier already exists." };
  }

  const inviteRecord = await prisma.inviteCode.findUnique({
    where: { code: inviteResult.code },
    include: { verificationRequirement: true },
  });

  if (!inviteRecord) {
    return { success: false, error: "Invite not found." };
  }

  const req = inviteRecord.verificationRequirement;
  let accountStatus: UserAccountStatus = "Pending";
  let approvalSource: string | null = null;
  let verificationStatus: InviteVerificationStatus = "NOT_REQUIRED";
  let submittedHash: string | null = null;
  let submittedPreview: string | null = null;
  let verificationMethod: InviteVerificationMethod | null = null;

  if (req) {
    verificationMethod = req.method;
    const submitted = verificationValue?.trim();
    if (!submitted) {
      verificationStatus = "MISSING";
      await writeAuditLog({
        action: "invite.verification.missing",
        metadata: { invite: inviteResult.code, method: req.method },
      });
    } else {
      try {
        const normalized = normalizeVerificationValue(submitted);
        if (!validateVerificationValueLength(normalized)) {
          return { success: false, error: "Verification value is too short or too long." };
        }
        submittedHash = hashVerificationValue(normalized);
        submittedPreview = getVerificationPreview(normalized);
        if (compareVerificationValues(req.expectedHash, submitted)) {
          verificationStatus = "MATCHED";
          await writeAuditLog({
            action: "invite.verification.match",
            metadata: {
              invite: inviteResult.code,
              method: req.method,
              preview: submittedPreview,
            },
          });
          if (req.autoApproveOnMatch) {
            accountStatus = "Approved";
            approvalSource = "OUT_OF_BAND_VERIFICATION_MATCH";
            await writeAuditLog({
              action: "user.auto_approve.verification",
              metadata: { invite: inviteResult.code, method: req.method },
            });
          }
        } else {
          verificationStatus = "MISMATCHED";
          await writeAuditLog({
            action: "invite.verification.mismatch",
            metadata: {
              invite: inviteResult.code,
              method: req.method,
              preview: submittedPreview,
            },
          });
        }
      } catch {
        return { success: false, error: "Invalid verification value format." };
      }
    }
  } else if (inviteRecord.autoApproveOnRegister) {
    accountStatus = "Approved";
    approvalSource = "INVITE_AUTO_APPROVE";
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
          email,
          name,
          passwordHash,
          accountStatus,
          approvedAt: accountStatus === "Approved" ? new Date() : null,
          approvalSource,
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

      await tx.userVerificationClaim.create({
        data: {
          userId: created.id,
          inviteCodeId: inviteRecord.id,
          method: verificationMethod,
          submittedHash,
          submittedPreview,
          status: verificationStatus,
        },
      });

      await consumeInviteCode(inviteCode, tx);
      return created;
    });

    await writeAuditLog({
      action: "auth.register",
      actorId: user.id,
      targetType: "user",
      targetId: user.id,
      metadata: {
        role: inviteResult.roleGranted,
        invite: inviteCode,
        accountStatus,
        verificationStatus,
      },
    });

    if (!isSyntheticEmail(email)) {
      await createVerificationForNewUser(user.id, user.email);
    }

    const approved = accountStatus === "Approved";
    return {
      success: true,
      approved,
      redirectTo: approved ? "/dashboard" : "/pending-approval",
    };
  } catch (error) {
    console.error("[register]", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}
