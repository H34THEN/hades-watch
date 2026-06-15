"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { requireApprovedAuth } from "@/lib/auth/session";
import { isAdmin, isModerator } from "@/lib/auth/roles";
import { validateOutboundUrl } from "@/lib/net-neighbors/validation";
import {
  buildRssEmbedHtml,
} from "@/lib/profile-customization/rss";
import {
  parseRssFeedsInput,
  PROFILE_CSS_MAX,
  PROFILE_HTML_MAX,
  sanitizeProfileHtml,
} from "@/lib/profile-customization/sanitize";
import { prisma } from "@/lib/prisma";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

function parseRssFeedsFromForm(formData: FormData) {
  const feeds: { url: string; title?: string }[] = [];
  for (let i = 0; i < 3; i++) {
    const url = String(formData.get(`rssUrl${i}`) ?? "").trim();
    const title = String(formData.get(`rssTitle${i}`) ?? "").trim();
    if (!url) continue;
    const validated = validateOutboundUrl(url);
    if (!validated.ok) continue;
    feeds.push({ url: validated.url, title: title || undefined });
  }
  return feeds.slice(0, 3);
}

export async function updateProfileCustomizationAction(formData: FormData): Promise<ActionResult> {
  const user = await requireApprovedAuth();

  const html = String(formData.get("html") ?? "").slice(0, PROFILE_HTML_MAX);
  const css = String(formData.get("css") ?? "").slice(0, PROFILE_CSS_MAX);
  const isEnabled = formData.get("isEnabled") === "on" || formData.get("isEnabled") === "true";
  const rssFeeds = parseRssFeedsFromForm(formData);

  const sanitizedHtml = sanitizeProfileHtml(html);

  await prisma.userProfileCustomization.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      html,
      css,
      sanitizedHtml,
      rssFeeds,
      isEnabled,
    },
    update: {
      html,
      css,
      sanitizedHtml,
      rssFeeds,
      isEnabled,
    },
  });

  await writeAuditLog({
    action: "profile.customization.update",
    actorId: user.id,
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function disableProfileCustomizationAction(userId: string): Promise<ActionResult> {
  const actor = await requireApprovedAuth();
  if (!isModerator(actor.roles)) {
    return { success: false, error: "Moderator clearance required." };
  }

  await prisma.userProfileCustomization.updateMany({
    where: { userId },
    data: { isEnabled: false },
  });

  await writeAuditLog({
    action: "profile.customization.disable",
    actorId: actor.id,
    metadata: { userId },
  });

  revalidatePath("/profile");
  revalidatePath("/admin/social");
  return { success: true };
}

export async function getProfileCustomizationPreview(userId: string) {
  const record = await prisma.userProfileCustomization.findUnique({
    where: { userId },
  });
  if (!record || !record.isEnabled) return null;

  const feeds = parseRssFeedsInput(record.rssFeeds);
  const rssHtml = feeds.length > 0 ? await buildRssEmbedHtml(feeds) : "";

  return {
    html: record.sanitizedHtml ?? "",
    css: record.css ?? "",
    rssHtml,
  };
}

export async function canDisableProfileCustomization(user: { roles: import("@/generated/prisma/client").RoleName[] }) {
  return isAdmin(user.roles) || isModerator(user.roles);
}
