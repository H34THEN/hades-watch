"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { reviewNetNeighborAction } from "@/lib/actions/net-neighbors";
import { setArchiveItemStatusAction } from "@/lib/actions/archive-items";
import { reviewMmoDeadDropSubmissionAction } from "@/lib/actions/text-mmo";
import { reviewCommunitySubmissionAction } from "@/lib/actions/community-builder";
import { reviewVolunteerResponseAction } from "@/lib/actions/volunteer";
import { reviewAvatarForgeAccessAction } from "@/lib/actions/avatar-forge-access";
import { writeAuditLog } from "@/lib/audit";
import type { ArchivistQuickActionType } from "@/lib/admin/archivist-action-feed";
import { isAdmin } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export type ArchivistActionResult =
  | { success: true; message?: string }
  | { success: false; error: string; stale?: boolean };

async function requireArchivistAdmin() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.roles)) {
    return { ok: false as const, error: "Owner or Admin clearance required." };
  }
  return { ok: true as const, user };
}

export async function executeArchivistQuickAction(
  sourceType: string,
  sourceId: string,
  action: ArchivistQuickActionType,
  note?: string,
): Promise<ArchivistActionResult> {
  const auth = await requireArchivistAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  if (action === "open") {
    return { success: false, error: "Use the open link — not a server action." };
  }

  let result: { success: boolean; error?: string } = { success: false, error: "Unsupported action." };

  switch (sourceType) {
    case "net_neighbor":
      if (action === "approve") result = await reviewNetNeighborAction(sourceId, "APPROVED", note);
      else if (action === "reject") result = await reviewNetNeighborAction(sourceId, "REJECTED", note);
      break;
    case "archive_item":
      if (action === "approve") result = await setArchiveItemStatusAction(sourceId, "PUBLISHED");
      else if (action === "reject") result = await setArchiveItemStatusAction(sourceId, "REMOVED");
      else if (action === "hide") result = await setArchiveItemStatusAction(sourceId, "HIDDEN");
      break;
    case "mmo_dead_drop_submission":
      if (action === "approve")
        result = await reviewMmoDeadDropSubmissionAction(sourceId, "APPROVED", note);
      else if (action === "reject")
        result = await reviewMmoDeadDropSubmissionAction(sourceId, "REJECTED", note);
      else if (action === "request_revision")
        result = await reviewMmoDeadDropSubmissionAction(sourceId, "NEEDS_REVISION", note);
      break;
    case "community_submission":
      if (action === "approve")
        result = await reviewCommunitySubmissionAction(sourceId, "ACCEPTED", note);
      else if (action === "reject")
        result = await reviewCommunitySubmissionAction(sourceId, "REJECTED", note);
      else if (action === "request_revision")
        result = await reviewCommunitySubmissionAction(sourceId, "NEEDS_REVISION", note);
      break;
    case "volunteer_response":
      if (action === "approve")
        result = await reviewVolunteerResponseAction(sourceId, "ACCEPTED", note);
      else if (action === "reject")
        result = await reviewVolunteerResponseAction(sourceId, "DECLINED", note);
      else if (action === "request_revision")
        result = { success: false, error: "Use Open Community Admin for revision requests." };
      break;
    case "avatar_forge_access":
      if (action === "approve") result = await reviewAvatarForgeAccessAction(sourceId, "approve", note);
      else if (action === "reject") result = await reviewAvatarForgeAccessAction(sourceId, "reject", note);
      break;
    default:
      return {
        success: false,
        error: "This item requires the full review page. Use Open Review.",
      };
  }

  if (!result.success) {
    return { success: false, error: result.error ?? "Action failed.", stale: true };
  }

  await writeAuditLog({
    action: "moderation.action",
    actorId: auth.user.id,
    targetType: sourceType,
    targetId: sourceId,
    metadata: { archivistFeed: true, action, note: note?.slice(0, 200) },
  });

  revalidatePath("/admin/archivist");
  revalidatePath("/admin/action-feed");
  return { success: true, message: "ACTION CONFIRMED // SIGNAL HANDLED" };
}

export async function redirectArchivistAlias() {
  redirect("/admin/archivist");
}
