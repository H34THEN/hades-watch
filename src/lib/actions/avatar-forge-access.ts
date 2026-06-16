"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { isApprovedUser, getSessionUser } from "@/lib/auth/session";
import { isOwner } from "@/lib/auth/roles";
import { getAvatarForgeGptUrl } from "@/lib/avatar-forge/config";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { rateLimitOrThrow } from "@/lib/rate-limit";

type ActionResult =
  | { success: true; url?: string; plaintextCode?: string }
  | { success: false; error: string };

function genericUnlockError(): ActionResult {
  return { success: false, error: "Unlock failed. Check your code or request a new one." };
}

export async function requestAvatarForgeAccessAction(): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Authentication required." };
  if (!isApprovedUser(user)) {
    return { success: false, error: "Avatar Forge requests open after operative approval." };
  }

  const existing = await prisma.avatarForgeAccessRequest.findUnique({ where: { userId: user.id } });
  if (existing) {
    if (existing.status === "REVOKED") {
      return { success: false, error: "Forge access was revoked. Contact an Archivist." };
    }
    if (existing.status === "REJECTED") {
      return { success: false, error: "Your previous request was rejected." };
    }
    return { success: true };
  }

  await prisma.avatarForgeAccessRequest.create({
    data: { userId: user.id, status: "PENDING" },
  });

  await writeAuditLog({
    action: "avatar.forge.request",
    actorId: user.id,
    targetType: "AvatarForgeAccessRequest",
    targetId: user.id,
  });

  revalidatePath("/profile/avatar/forge");
  revalidatePath("/admin/avatar-forge-access");
  return { success: true };
}

export async function reviewAvatarForgeAccessAction(
  requestId: string,
  decision: "approve" | "reject" | "revoke",
  reviewNote?: string,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || !isOwner(user.roles)) {
    return { success: false, error: "Owner clearance required." };
  }

  const row = await prisma.avatarForgeAccessRequest.findUnique({ where: { id: requestId } });
  if (!row) return { success: false, error: "Request not found." };

  const status =
    decision === "approve" ? "APPROVED" : decision === "reject" ? "REJECTED" : "REVOKED";

  await prisma.avatarForgeAccessRequest.update({
    where: { id: requestId },
    data: {
      status,
      reviewedAt: new Date(),
      reviewedById: user.id,
      reviewNote: reviewNote?.trim() || null,
      ...(decision === "revoke"
        ? { unlockCodeHash: null, codeExpiresAt: null, unlockedAt: null }
        : {}),
    },
  });

  await writeAuditLog({
    action:
      decision === "approve"
        ? "avatar.forge.approve"
        : decision === "reject"
          ? "avatar.forge.reject"
          : "avatar.forge.revoke",
    actorId: user.id,
    targetType: "AvatarForgeAccessRequest",
    targetId: requestId,
    metadata: reviewNote ? { reviewNote } : undefined,
  });

  revalidatePath("/admin/avatar-forge-access");
  revalidatePath("/profile/avatar/forge");
  return { success: true };
}

export async function setAvatarForgeUnlockCodeAction(
  requestId: string,
  expiresInDays = 30,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || !isOwner(user.roles)) {
    return { success: false, error: "Owner clearance required." };
  }

  const row = await prisma.avatarForgeAccessRequest.findUnique({ where: { id: requestId } });
  if (!row) return { success: false, error: "Request not found." };
  if (row.status !== "APPROVED") {
    return { success: false, error: "Request must be approved before setting an unlock code." };
  }

  const plaintextCode = randomBytes(4).toString("hex").slice(0, 8).toUpperCase();
  const unlockCodeHash = await hashPassword(plaintextCode);
  const codeExpiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  await prisma.avatarForgeAccessRequest.update({
    where: { id: requestId },
    data: {
      unlockCodeHash,
      codeExpiresAt,
      unlockedAt: null,
    },
  });

  await writeAuditLog({
    action: "avatar.forge.code.generated",
    actorId: user.id,
    targetType: "AvatarForgeAccessRequest",
    targetId: requestId,
  });

  revalidatePath("/admin/avatar-forge-access");
  return { success: true, plaintextCode };
}

export async function unlockAvatarForgeLinkAction(code?: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Authentication required." };
  if (!isApprovedUser(user)) {
    return { success: false, error: "Avatar Forge requests open after operative approval." };
  }

  await rateLimitOrThrow(
    { key: `avatar-forge-unlock:${user.id}`, limit: 8, windowSec: 600 },
    "Unlock failed. Check your code or request a new one.",
  );

  const row = await prisma.avatarForgeAccessRequest.findUnique({ where: { userId: user.id } });
  if (!row || row.status !== "APPROVED") {
    return genericUnlockError();
  }

  const url = getAvatarForgeGptUrl();
  if (!url) {
    return { success: false, error: "Avatar Forge relay is not configured on this server." };
  }

  if (row.unlockedAt) {
    await prisma.avatarForgeAccessRequest.update({
      where: { id: row.id },
      data: { lastRevealedAt: new Date() },
    });
    await writeAuditLog({
      action: "avatar.forge.link.revealed",
      actorId: user.id,
      targetType: "AvatarForgeAccessRequest",
      targetId: row.id,
    });
    return { success: true, url };
  }

  if (!code?.trim() || !row.unlockCodeHash) {
    return genericUnlockError();
  }

  if (row.codeExpiresAt && row.codeExpiresAt < new Date()) {
    return genericUnlockError();
  }

  const valid = await verifyPassword(code.trim().toUpperCase(), row.unlockCodeHash);
  if (!valid) {
    await writeAuditLog({
      action: "avatar.forge.unlock.failed",
      actorId: user.id,
      targetType: "AvatarForgeAccessRequest",
      targetId: row.id,
    });
    return genericUnlockError();
  }

  const now = new Date();
  await prisma.avatarForgeAccessRequest.update({
    where: { id: row.id },
    data: { unlockedAt: now, lastRevealedAt: now },
  });

  await writeAuditLog({
    action: "avatar.forge.unlock.success",
    actorId: user.id,
    targetType: "AvatarForgeAccessRequest",
    targetId: row.id,
  });

  revalidatePath("/profile/avatar/forge");
  return { success: true, url };
}
