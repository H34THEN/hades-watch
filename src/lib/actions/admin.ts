"use server";

import { revalidatePath } from "next/cache";
import type { RoleName } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid invite data",
    };
  }

  const { code, roleGranted, maxUses, emailRestricted, expiresAt } = parsed.data;
  const normalized = code.trim().toUpperCase();

  const existing = await prisma.inviteCode.findUnique({
    where: { code: normalized },
  });
  if (existing) {
    return { success: false, error: "Invite code already exists." };
  }

  await prisma.inviteCode.create({
    data: {
      code: normalized,
      roleGranted: roleGranted as RoleName,
      maxUses,
      emailRestricted: emailRestricted || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdById: admin.id,
      isDevCode: false,
    },
  });

  await writeAuditLog({
    action: "invite.create",
    actorId: admin.id,
    targetType: "invite",
    targetId: normalized,
    metadata: { roleGranted, maxUses },
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
  });

  revalidatePath("/admin");
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
    include: { createdBy: { select: { email: true, name: true } } },
  });
}
