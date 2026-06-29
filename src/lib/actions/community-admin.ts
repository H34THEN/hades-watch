"use server";

import { reviewCommunitySubmissionAction } from "@/lib/actions/community-builder";
import { reviewLoreSubmissionAction } from "@/lib/actions/lore-submissions";
import { reviewGuildAction } from "@/lib/actions/guilds";
import { reviewVolunteerResponseAction } from "@/lib/actions/volunteer";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function reviewCommunitySubmissionFormAction(
  formData: FormData,
): Promise<ActionResult> {
  return reviewCommunitySubmissionAction(
    String(formData.get("submissionId") ?? ""),
    String(formData.get("status") ?? "") as Parameters<
      typeof reviewCommunitySubmissionAction
    >[1],
    String(formData.get("reviewNote") ?? "") || undefined,
  );
}

export async function reviewVolunteerResponseFormAction(
  formData: FormData,
): Promise<ActionResult> {
  return reviewVolunteerResponseAction(
    String(formData.get("responseId") ?? ""),
    String(formData.get("status") ?? "") as Parameters<
      typeof reviewVolunteerResponseAction
    >[1],
    String(formData.get("reviewNote") ?? "") || undefined,
  );
}

export async function reviewGuildFormAction(formData: FormData): Promise<ActionResult> {
  return reviewGuildAction(
    String(formData.get("guildId") ?? ""),
    String(formData.get("status") ?? "") as Parameters<typeof reviewGuildAction>[1],
    String(formData.get("reviewNote") ?? "") || undefined,
  );
}

export async function reviewLoreSubmissionFormAction(
  formData: FormData,
): Promise<ActionResult> {
  return reviewLoreSubmissionAction(
    String(formData.get("submissionId") ?? ""),
    String(formData.get("status") ?? "") as Parameters<
      typeof reviewLoreSubmissionAction
    >[1],
    undefined,
    String(formData.get("reviewNote") ?? "") || undefined,
  );
}
