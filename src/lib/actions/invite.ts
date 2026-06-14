"use server";

import { writeAuditLog } from "@/lib/audit";
import { validateInviteCode } from "@/lib/invites";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { inviteCodeSchema } from "@/lib/validations/invite";

export type ValidateInviteResult =
  | {
      success: true;
      code: string;
      roleGranted: string;
      emailRestricted: boolean;
      registerUrl: string;
    }
  | { success: false; reason: string; message: string };

export async function validateInviteAction(
  formData: FormData,
): Promise<ValidateInviteResult> {
  const code = formData.get("code") as string;
  const email = (formData.get("email") as string) || undefined;

  const parsed = inviteCodeSchema.safeParse({ code });
  if (!parsed.success) {
    return {
      success: false,
      reason: "invalid_format",
      message: parsed.error.issues[0]?.message ?? "Invalid invite code format",
    };
  }

  try {
    await rateLimitOrThrow({
      key: `invite:${parsed.data.code.toUpperCase()}`,
      limit: 10,
      windowSec: 300,
    });
  } catch {
    return {
      success: false,
      reason: "rate_limited",
      message: "Too many attempts. Please wait and try again.",
    };
  }

  const result = await validateInviteCode(parsed.data.code, email);

  if (!result.valid) {
    await writeAuditLog({
      action: "invite.validate.failed",
      metadata: { reason: result.reason },
    });
    return {
      success: false,
      reason: result.reason,
      message: result.message,
    };
  }

  await writeAuditLog({
    action: "invite.validate",
    metadata: { code: result.code, role: result.roleGranted },
  });

  return {
    success: true,
    code: result.code,
    roleGranted: result.roleGranted,
    emailRestricted: !!result.emailRestricted,
    registerUrl: `/register?invite=${encodeURIComponent(result.code)}`,
  };
}
