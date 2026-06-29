"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { requireApprovedAuth } from "@/lib/auth/session";
import { parseRelicBuildConfig, type RelicBuildConfig } from "@/lib/profile/relic-config";
import {
  publishRelicBuild,
  resetRelicToDefault,
  saveRelicDraft,
} from "@/lib/queries/relic-zone";

export type RelicActionResult = { success: true } | { success: false; error: string };

function parseConfigJson(raw: string): RelicBuildConfig | null {
  try {
    return parseRelicBuildConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function saveRelicDraftAction(configJson: string): Promise<RelicActionResult> {
  const user = await requireApprovedAuth();
  const config = parseConfigJson(configJson);
  if (!config) return { success: false, error: "Invalid relic configuration." };

  await saveRelicDraft(user.id, config);
  await writeAuditLog({ action: "profile.world.update", actorId: user.id });
  revalidatePath("/profile/relic-zone");
  revalidatePath("/profile/world");
  return { success: true };
}

export async function publishRelicBuildAction(configJson: string): Promise<RelicActionResult> {
  const user = await requireApprovedAuth();
  const config = parseConfigJson(configJson);
  if (!config) return { success: false, error: "Invalid relic configuration." };

  await publishRelicBuild(user.id, config);
  await writeAuditLog({ action: "profile.world.update", actorId: user.id });
  revalidatePath("/profile/relic-zone");
  revalidatePath("/profile/world");
  if (user.id) revalidatePath("/profile");
  return { success: true };
}

export async function resetRelicDefaultAction(): Promise<RelicActionResult> {
  const user = await requireApprovedAuth();
  await resetRelicToDefault(user.id);
  await writeAuditLog({ action: "profile.world.update", actorId: user.id });
  revalidatePath("/profile/relic-zone");
  revalidatePath("/profile/world");
  return { success: true };
}
