"use server";

import { revalidatePath } from "next/cache";
import type { RoleName } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { isExpired, matchesClearance } from "@/lib/clearance";
import { requireAdminUser } from "@/lib/auth/guards";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function getDeadDropsForUser(roles: RoleName[]) {
  const drops = await prisma.deadDrop.findMany({
    where: { status: { in: ["Active", "Expired"] } },
    orderBy: { createdAt: "desc" },
  });

  return drops.map((drop) => {
    const expired = isExpired(drop.expiresAt) || drop.status === "Expired";
    const clearance = matchesClearance(drop.clearanceRole, roles);
    return {
      ...drop,
      expired,
      visible: clearance,
      readable: clearance && !expired && drop.status === "Active",
    };
  });
}

export async function getDeadDropBySlug(slug: string, roles: RoleName[]) {
  const drop = await prisma.deadDrop.findUnique({ where: { slug } });
  if (!drop) return null;

  const expired = isExpired(drop.expiresAt) || drop.status === "Expired";
  const clearance = matchesClearance(drop.clearanceRole, roles);

  return {
    drop,
    expired,
    visible: clearance,
    readable: clearance && !expired && drop.status === "Active",
  };
}

export async function viewDeadDropAction(slug: string): Promise<void> {
  const user = await requireAuth();
  const result = await getDeadDropBySlug(slug, user.roles);
  if (result?.readable) {
    await writeAuditLog({
      action: "deaddrop.view",
      actorId: user.id,
      targetType: "deaddrop",
      targetId: result.drop.id,
    });
  }
}

export async function getCiphers() {
  return prisma.cipherPuzzle.findMany({
    where: { status: "Active" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      prompt: true,
      hint: true,
      difficulty: true,
    },
  });
}

export async function getCipherBySlug(slug: string) {
  return prisma.cipherPuzzle.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      prompt: true,
      hint: true,
      difficulty: true,
      status: true,
    },
  });
}

export async function getUserCipherSolve(userId: string, cipherPuzzleId: string) {
  return prisma.cipherSolve.findUnique({
    where: { userId_cipherPuzzleId: { userId, cipherPuzzleId } },
  });
}

export async function submitCipherAnswerAction(
  slug: string,
  answer: string,
): Promise<ActionResult & { solved?: boolean }> {
  const user = await requireAuth();

  const { rateLimitOrThrow } = await import("@/lib/rate-limit");
  const { hashCipherAnswer } = await import("@/lib/tokens");

  try {
    await rateLimitOrThrow({
      key: `cipher:${user.id}:${slug}`,
      limit: 10,
      windowSec: 600,
    }, "Too many attempts. Wait before trying again.");
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Rate limited" };
  }

  const cipher = await prisma.cipherPuzzle.findUnique({ where: { slug } });
  if (!cipher || cipher.status !== "Active" || !cipher.solutionHash) {
    return { success: false, error: "Cipher not available." };
  }

  const existing = await prisma.cipherSolve.findUnique({
    where: { userId_cipherPuzzleId: { userId: user.id, cipherPuzzleId: cipher.id } },
  });
  if (existing) {
    return { success: true, solved: true };
  }

  const answerHash = hashCipherAnswer(answer);
  const solved = answerHash === cipher.solutionHash;

  if (solved) {
    await prisma.cipherSolve.create({
      data: { userId: user.id, cipherPuzzleId: cipher.id, attemptCount: 1 },
    });
    await writeAuditLog({
      action: "cipher.solved",
      actorId: user.id,
      targetType: "cipher",
      targetId: cipher.id,
    });
    revalidatePath("/ciphers");
    revalidatePath(`/ciphers/${slug}`);
    return { success: true, solved: true };
  }

  return { success: false, error: "Incorrect answer. Try again." };
}

export async function getAllDeadDropsAdmin() {
  return prisma.deadDrop.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createDeadDropAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  const codename = formData.get("codename") as string;
  const title = formData.get("title") as string;
  const locationHint = formData.get("locationHint") as string;
  const message = formData.get("message") as string;
  const clearanceRole = (formData.get("clearanceRole") as string) || null;
  const expiresAt = formData.get("expiresAt") as string;

  if (!codename || !title || !message) {
    return { success: false, error: "Required fields missing" };
  }

  const drop = await prisma.deadDrop.create({
    data: {
      codename,
      title,
      slug: slugify(codename),
      locationHint: locationHint || "Unknown sector",
      message,
      clearanceRole: clearanceRole as RoleName | null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdById: admin.user.id,
      status: "Active",
    },
  });

  await writeAuditLog({
    action: "deaddrop.create",
    actorId: admin.user.id,
    targetType: "deaddrop",
    targetId: drop.id,
  });

  revalidatePath("/admin/dead-drops");
  revalidatePath("/dead-drops");
  return { success: true };
}

export async function getAdminUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      createdAt: true,
      disabled: true,
      banned: true,
      character: { select: { callsign: true, faction: { select: { name: true } } } },
      userRoles: { include: { role: true } },
      _count: { select: { notesAbout: true } },
    },
  });
}

export async function disableUserAction(userId: string): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };
  if (userId === admin.user.id) return { success: false, error: "Cannot disable yourself." };

  await prisma.user.update({ where: { id: userId }, data: { disabled: true } });
  await writeAuditLog({
    action: "user.disable",
    actorId: admin.user.id,
    targetType: "user",
    targetId: userId,
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function enableUserAction(userId: string): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin.ok) return { success: false, error: "Unauthorized" };

  await prisma.user.update({ where: { id: userId }, data: { disabled: false } });
  await writeAuditLog({
    action: "user.enable",
    actorId: admin.user.id,
    targetType: "user",
    targetId: userId,
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function getAuditLogs(filters?: {
  action?: string;
  targetType?: string;
  actorId?: string;
  limit?: number;
}) {
  return prisma.auditLog.findMany({
    where: {
      ...(filters?.action ? { action: { startsWith: filters.action } } : {}),
      ...(filters?.targetType ? { targetType: filters.targetType } : {}),
      ...(filters?.actorId ? { actorId: filters.actorId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: filters?.limit ?? 50,
    include: { actor: { select: { email: true, name: true } } },
  });
}
