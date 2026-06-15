"use server";

import type { InviteVerificationMethod } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { VERIFICATION_METHOD_LABELS } from "@/lib/verification";

export type InviteRegistrationHint = {
  code: string;
  hasVerification: boolean;
  method: InviteVerificationMethod | null;
  methodLabel: string | null;
  customLabel: string | null;
};

export async function getInviteRegistrationHint(
  code: string,
): Promise<InviteRegistrationHint | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized || normalized.length < 8) return null;

  const invite = await prisma.inviteCode.findUnique({
    where: { code: normalized },
    include: { verificationRequirement: true },
  });

  if (!invite || invite.revoked) return null;

  const req = invite.verificationRequirement;
  return {
    code: invite.code,
    hasVerification: !!req,
    method: req?.method ?? null,
    methodLabel: req ? VERIFICATION_METHOD_LABELS[req.method] : null,
    customLabel: req?.label ?? null,
  };
}
