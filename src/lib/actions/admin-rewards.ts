"use server";

import { revalidatePath } from "next/cache";
import type { AdminGrantType, ReputationCategory } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { adminGrantReward, adminRevokeReward } from "@/lib/rewards/grants";
import type { GrantReason } from "@/lib/rewards/grant-constants";
import { prisma } from "@/lib/prisma";

export type AdminRewardActionResult =
  | { success: true }
  | { success: false; error: string };

async function requireAdminActor(): Promise<
  { user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>> } | { error: string }
> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.roles)) {
    return { error: "Owner or Admin clearance required." };
  }
  return { user };
}

export async function adminGrantRewardAction(formData: FormData): Promise<AdminRewardActionResult> {
  const auth = await requireAdminActor();
  if ("error" in auth) return { success: false, error: auth.error };
  const { user } = auth;

  const recipientId = String(formData.get("recipientId") ?? "");
  const grantType = String(formData.get("grantType") ?? "") as AdminGrantType;
  const grantSlug = String(formData.get("grantSlug") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() as GrantReason;
  const adminNote = String(formData.get("adminNote") ?? "").trim();
  const reputationCategory = String(formData.get("reputationCategory") ?? "") as ReputationCategory;
  const reputationPoints = Number(formData.get("reputationPoints") ?? 0);

  if (!recipientId || !grantSlug || !reason) {
    return { success: false, error: "Recipient, reward slug, and reason are required." };
  }

  const result = await adminGrantReward({
    actorId: user.id,
    recipientId,
    grantType,
    grantSlug,
    reason,
    adminNote: adminNote || undefined,
    reputationCategory: grantType === "reputation" ? reputationCategory : undefined,
    reputationPoints: grantType === "reputation" ? reputationPoints : undefined,
    sourceType: "admin_grant",
    sourceSlug: grantSlug,
  });

  if (!result.ok) return { success: false, error: result.error };

  await writeAuditLog({
    action: "admin.reward.grant",
    actorId: user.id,
    targetType: "user",
    targetId: recipientId,
    metadata: { grantType, grantSlug, reason },
  });

  revalidatePath("/admin/rewards");
  revalidatePath(`/admin/users/${recipientId}/rewards`);
  return { success: true };
}

export async function adminRevokeRewardAction(formData: FormData): Promise<AdminRewardActionResult> {
  const auth = await requireAdminActor();
  if ("error" in auth) return { success: false, error: auth.error };
  const { user } = auth;

  const recipientId = String(formData.get("recipientId") ?? "");
  const grantType = String(formData.get("grantType") ?? "") as AdminGrantType;
  const grantSlug = String(formData.get("grantSlug") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() as GrantReason;

  if (!recipientId || !grantSlug || !reason) {
    return { success: false, error: "Recipient, reward slug, and reason are required." };
  }

  const result = await adminRevokeReward({
    actorId: user.id,
    recipientId,
    grantType,
    grantSlug,
    reason,
  });

  if (!result.ok) return { success: false, error: result.error };

  await writeAuditLog({
    action: "admin.reward.revoke",
    actorId: user.id,
    targetType: "user",
    targetId: recipientId,
    metadata: { grantType, grantSlug, reason },
  });

  revalidatePath("/admin/rewards");
  revalidatePath(`/admin/users/${recipientId}/rewards`);
  return { success: true };
}

export async function setActiveTitleAction(userId: string, titleSlug: string): Promise<AdminRewardActionResult> {
  const auth = await requireAdminActor();
  if ("error" in auth) return { success: false, error: auth.error };

  const title = await prisma.playerTitle.findUnique({ where: { slug: titleSlug } });
  if (!title) return { success: false, error: "Title not found." };

  const grant = await prisma.playerTitleGrant.findFirst({
    where: { userId, titleId: title.id, revoked: false },
  });
  if (!grant) return { success: false, error: "User has not earned this title." };

  await prisma.user.update({
    where: { id: userId },
    data: { activeTitle: title.title },
  });

  revalidatePath(`/admin/users/${userId}/rewards`);
  revalidatePath("/profile/dossier");
  return { success: true };
}
