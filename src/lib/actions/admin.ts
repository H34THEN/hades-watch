"use server";

import { revalidatePath } from "next/cache";
import type { InviteVerificationMethod, RoleName } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  formatVerificationPreviewLabel,
  getVerificationPreview,
  hashVerificationValue,
  normalizeVerificationValue,
  validateVerificationValueLength,
} from "@/lib/verification";
import { z } from "zod";

const verificationMethods = z.enum([
  "SIGNAL_SAFETY_NUMBER",
  "SIMPLEX_CONTACT",
  "MATRIX_DEVICE",
  "SESSION_ID",
  "PGP_FINGERPRINT",
  "SSH_FINGERPRINT",
  "OTHER",
]);

const createInviteSchema = z.object({
  code: z
    .string()
    .min(8)
    .max(64)
    .regex(/^[A-Za-z0-9-]+$/, "Code may only contain letters, numbers, and hyphens"),
  roleGranted: z.enum([
    "Owner",
    "Admin",
    "Moderator",
    "Expert",
    "Gamer",
    "Member",
    "Guest",
  ]),
  maxUses: z.coerce.number().int().min(1).max(1000),
  emailRestricted: z.string().email().optional().or(z.literal("")),
  expiresAt: z.string().optional(),
  autoApproveOnRegister: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "on"),
  verificationMethod: verificationMethods.optional().or(z.literal("")),
  verificationValue: z.string().max(4096).optional().or(z.literal("")),
  verificationLabel: z.string().max(128).optional().or(z.literal("")),
  autoApproveOnMatch: z
    .string()
    .optional()
    .transform((v) => v !== "false" && v !== "off"),
});

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function createInviteAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = createInviteSchema.safeParse({
    code: formData.get("code"),
    roleGranted: formData.get("roleGranted"),
    maxUses: formData.get("maxUses"),
    emailRestricted: formData.get("emailRestricted") || undefined,
    expiresAt: formData.get("expiresAt") || undefined,
    autoApproveOnRegister: formData.get("autoApproveOnRegister"),
    verificationMethod: formData.get("verificationMethod") || undefined,
    verificationValue: formData.get("verificationValue") || undefined,
    verificationLabel: formData.get("verificationLabel") || undefined,
    autoApproveOnMatch: formData.get("autoApproveOnMatch"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid invite data",
    };
  }

  const {
    code,
    roleGranted,
    maxUses,
    emailRestricted,
    expiresAt,
    autoApproveOnRegister,
    verificationMethod,
    verificationValue,
    verificationLabel,
    autoApproveOnMatch,
  } = parsed.data;
  const normalized = code.trim().toUpperCase();

  const existing = await prisma.inviteCode.findUnique({
    where: { code: normalized },
  });
  if (existing) {
    return { success: false, error: "Invite code already exists." };
  }

  const hasVerification = !!(verificationMethod && verificationValue?.trim());

  if (verificationMethod && !verificationValue?.trim()) {
    return {
      success: false,
      error: "Enter the expected safety number or fingerprint when a method is selected.",
    };
  }

  let expectedHash: string | null = null;
  let expectedPreview: string | null = null;

  if (hasVerification && verificationMethod && verificationValue) {
    try {
      const norm = normalizeVerificationValue(verificationValue);
      if (!validateVerificationValueLength(norm)) {
        return { success: false, error: "Verification value is too short or too long." };
      }
      expectedHash = hashVerificationValue(norm);
      expectedPreview = getVerificationPreview(norm);
    } catch {
      return { success: false, error: "Invalid verification value format." };
    }
  }

  const invite = await prisma.inviteCode.create({
    data: {
      code: normalized,
      roleGranted: roleGranted as RoleName,
      maxUses,
      emailRestricted: emailRestricted || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdById: admin.id,
      isDevCode: false,
      autoApproveOnRegister: autoApproveOnRegister ?? false,
      verificationRequirement:
        hasVerification && expectedHash
          ? {
              create: {
                method: verificationMethod as InviteVerificationMethod,
                label: verificationLabel || null,
                expectedHash,
                expectedPreview,
                autoApproveOnMatch: autoApproveOnMatch ?? true,
              },
            }
          : undefined,
    },
    include: { verificationRequirement: true },
  });

  await writeAuditLog({
    action: hasVerification ? "invite.create.with_verification" : "invite.create",
    actorId: admin.id,
    targetType: "invite",
    targetId: normalized,
    metadata: {
      roleGranted,
      maxUses,
      autoApproveOnRegister,
      verificationMethod: invite.verificationRequirement?.method,
      verificationPreview: invite.verificationRequirement
        ? formatVerificationPreviewLabel(
            invite.verificationRequirement.method,
            invite.verificationRequirement.expectedPreview,
          )
        : undefined,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function revokeInviteAction(
  inviteId: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const invite = await prisma.inviteCode.findUnique({
    where: { id: inviteId },
    include: { verificationRequirement: true },
  });
  if (!invite) {
    return { success: false, error: "Invite not found." };
  }

  await prisma.inviteCode.update({
    where: { id: inviteId },
    data: { revoked: true },
  });

  await writeAuditLog({
    action: "invite.revoke",
    actorId: admin.id,
    targetType: "invite",
    targetId: invite.code,
    metadata: invite.verificationRequirement
      ? { hadVerification: true, method: invite.verificationRequirement.method }
      : undefined,
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function approveUserAction(userId: string): Promise<ActionResult> {
  const admin = await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { verificationClaim: true },
  });
  if (!user) return { success: false, error: "User not found." };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        accountStatus: "Approved",
        approvedAt: new Date(),
        approvalSource: "ADMIN_MANUAL_APPROVE",
      },
    }),
    ...(user.verificationClaim
      ? [
          prisma.userVerificationClaim.update({
            where: { userId },
            data: {
              status: "MANUAL_REVIEW",
              reviewedAt: new Date(),
              reviewedById: admin.id,
            },
          }),
        ]
      : []),
  ]);

  await writeAuditLog({
    action:
      user.verificationClaim?.status === "MISMATCHED"
        ? "user.approve.override_mismatch"
        : "user.approve",
    actorId: admin.id,
    targetType: "user",
    targetId: userId,
    metadata: {
      priorStatus: user.accountStatus,
      verificationStatus: user.verificationClaim?.status,
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function rejectUserAction(userId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (userId === admin.id) {
    return { success: false, error: "Cannot reject your own account." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { accountStatus: "Rejected", disabled: true },
  });

  await writeAuditLog({
    action: "user.reject",
    actorId: admin.id,
    targetType: "user",
    targetId: userId,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function getAdminStats() {
  const [userCount, inviteCount, announcementCount, eventCount, auditLogs, roles] =
    await Promise.all([
      prisma.user.count(),
      prisma.inviteCode.count({ where: { revoked: false } }),
      prisma.announcement.count({ where: { status: "Published" } }),
      prisma.event.count({ where: { status: "Published" } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { actor: { select: { email: true, name: true } } },
      }),
      prisma.role.findMany({
        include: { _count: { select: { userRoles: true } } },
        orderBy: { name: "asc" },
      }),
    ]);

  return { userCount, inviteCount, announcementCount, eventCount, auditLogs, roles };
}

export async function getInviteCodes() {
  return prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      createdBy: { select: { email: true, name: true } },
      verificationRequirement: true,
    },
  });
}
