"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { requireApprovedAuth } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import {
  saveBannerUpload,
  validateBannerUpload,
} from "@/lib/net-neighbors/storage";
import { parseTagsInput, stripUserText, validateOutboundUrl } from "@/lib/net-neighbors/validation";
import {
  getNetNeighborById,
  updateNetNeighborStatus,
} from "@/lib/queries/net-neighbors";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import type { NetNeighborStatus } from "@/generated/prisma/client";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitNetNeighborAction(formData: FormData): Promise<ActionResult> {
  const user = await requireApprovedAuth();

  const title = stripUserText(String(formData.get("title") ?? ""), 80);
  const urlRaw = String(formData.get("url") ?? "");
  const description = stripUserText(String(formData.get("description") ?? ""), 500);
  const tagsRaw = String(formData.get("tags") ?? "");
  const submitterNote = stripUserText(String(formData.get("submitterNote") ?? ""), 500);
  const bannerFile = formData.get("banner");

  if (!title || title.length < 2) {
    return { success: false, error: "Site title is required." };
  }

  const urlResult = validateOutboundUrl(urlRaw);
  if (!urlResult.ok) return { success: false, error: urlResult.error };

  let bannerPath: string | null = null;
  if (bannerFile && typeof bannerFile !== "string" && bannerFile.size > 0) {
    const validation = validateBannerUpload(bannerFile);
    if (!validation.ok) return { success: false, error: validation.error };
    bannerPath = await saveBannerUpload(bannerFile);
  } else {
    return { success: false, error: "Banner image upload is required for MVP submissions." };
  }

  const baseSlug = slugify(title) || "neighbor";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  await prisma.netNeighbor.create({
    data: {
      title,
      slug,
      url: urlResult.url,
      description: description || null,
      bannerPath,
      tags: parseTagsInput(tagsRaw),
      submitterNote: submitterNote || null,
      status: "PENDING",
      submittedById: user.id,
    },
  });

  await writeAuditLog({
    action: "net_neighbor.submit",
    actorId: user.id,
    metadata: { title, slug },
  });

  revalidatePath("/net-neighbors");
  revalidatePath("/admin/social");
  return { success: true };
}

export async function reviewNetNeighborAction(
  id: string,
  status: NetNeighborStatus,
  reviewNote?: string,
): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  if (!isModerator(user.roles)) {
    return { success: false, error: "Moderator clearance required." };
  }

  const neighbor = await getNetNeighborById(id);
  if (!neighbor) return { success: false, error: "Submission not found." };

  await updateNetNeighborStatus(id, status, user.id, reviewNote);

  await writeAuditLog({
    action: "net_neighbor.review",
    actorId: user.id,
    metadata: { id, status },
  });

  revalidatePath("/net-neighbors");
  revalidatePath("/admin/social");
  return { success: true };
}
