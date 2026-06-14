import type { RoleName } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type InviteFailureReason =
  | "not_found"
  | "revoked"
  | "expired"
  | "maxed_out"
  | "email_mismatch";

export type InviteValidationResult =
  | {
      valid: true;
      code: string;
      roleGranted: RoleName;
      emailRestricted: string | null;
    }
  | {
      valid: false;
      reason: InviteFailureReason;
      message: string;
    };

export async function findInviteByCode(
  code: string,
): Promise<{ id: string; code: string } | null> {
  const normalized = code.trim().toUpperCase();
  return prisma.inviteCode.findUnique({
    where: { code: normalized },
    select: { id: true, code: true },
  });
}

export async function validateInviteCode(
  code: string,
  email?: string,
): Promise<InviteValidationResult> {
  const normalized = code.trim().toUpperCase();
  const invite = await prisma.inviteCode.findUnique({
    where: { code: normalized },
  });

  if (!invite) {
    return {
      valid: false,
      reason: "not_found",
      message: "Invite code not recognized.",
    };
  }

  if (invite.revoked) {
    return {
      valid: false,
      reason: "revoked",
      message: "This invite code has been revoked.",
    };
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return {
      valid: false,
      reason: "expired",
      message: "This invite code has expired.",
    };
  }

  if (invite.usesCount >= invite.maxUses) {
    return {
      valid: false,
      reason: "maxed_out",
      message: "This invite code has reached its usage limit.",
    };
  }

  if (invite.emailRestricted) {
    const restricted = invite.emailRestricted.toLowerCase();
    const provided = email?.toLowerCase();
    if (!provided || provided !== restricted) {
      return {
        valid: false,
        reason: "email_mismatch",
        message: "This invite is restricted to a specific email address.",
      };
    }
  }

  return {
    valid: true,
    code: invite.code,
    roleGranted: invite.roleGranted ?? "Member",
    emailRestricted: invite.emailRestricted,
  };
}

export async function consumeInviteCode(
  code: string,
  tx?: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
): Promise<void> {
  const db = tx ?? prisma;
  const normalized = code.trim().toUpperCase();
  await db.inviteCode.update({
    where: { code: normalized },
    data: { usesCount: { increment: 1 } },
  });
}
