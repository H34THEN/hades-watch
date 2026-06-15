"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { getApprovedUserForAction, getModeratorUserForAction } from "@/lib/auth/session";
import { parseBannerStyleForm } from "@/lib/net-neighbors/banner-builder";
import {
  saveBannerUpload,
  validateBannerUpload,
} from "@/lib/net-neighbors/storage";
import { parseTagsInput, stripUserText, validateOutboundUrl } from "@/lib/net-neighbors/validation";
import {
  getNetNeighborById,
  updateNetNeighborOrder,
  updateNetNeighborStatus,
} from "@/lib/queries/net-neighbors";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import type { NetNeighborStatus } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitNetNeighborAction(formData: FormData): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }
  const user = auth;

  const title = stripUserText(String(formData.get("title") ?? ""), 80);
  const urlRaw = String(formData.get("url") ?? "");
  const description = stripUserText(String(formData.get("description") ?? ""), 500);
  const tagsRaw = String(formData.get("tags") ?? "");
  const submitterNote = stripUserText(String(formData.get("submitterNote") ?? ""), 500);
  const bannerFile = formData.get("banner");
  const builderIcon = formData.get("builderIcon");
  let bannerStyle = parseBannerStyleForm(formData);

  if (!title || title.length < 2) {
    return { success: false, error: "Site title is required." };
  }

  const urlResult = validateOutboundUrl(urlRaw);
  if (!urlResult.ok) return { success: false, error: urlResult.error };

  let bannerPath: string | null = null;
  let iconPath: string | null = null;

  if (bannerFile && typeof bannerFile !== "string" && bannerFile.size > 0) {
    const validation = validateBannerUpload(bannerFile);
    if (!validation.ok) return { success: false, error: validation.error };
    bannerPath = await saveBannerUpload(bannerFile);
  }

  if (builderIcon && typeof builderIcon !== "string" && builderIcon.size > 0) {
    const validation = validateBannerUpload(builderIcon);
    if (!validation.ok) return { success: false, error: validation.error };
    iconPath = await saveBannerUpload(builderIcon);
    if (bannerStyle) {
      bannerStyle = { ...bannerStyle, iconPath };
    }
  }

  if (!bannerPath && !bannerStyle) {
    return {
      success: false,
      error: "Upload a banner image or forge one with the signal button builder.",
    };
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
      bannerText: bannerStyle?.text ?? null,
      bannerStyle: bannerStyle
        ? (bannerStyle as unknown as Prisma.InputJsonValue)
        : undefined,
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
  revalidatePath("/net-neighbors/submit");
  revalidatePath("/admin/net-neighbors");
  revalidatePath("/admin/social");
  return { success: true };
}

export async function reviewNetNeighborAction(
  id: string,
  status: NetNeighborStatus,
  reviewNote?: string,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }
  const user = auth;

  const neighbor = await getNetNeighborById(id);
  if (!neighbor) return { success: false, error: "Submission not found." };

  await updateNetNeighborStatus(id, status, user.id, reviewNote);

  await writeAuditLog({
    action: "net_neighbor.review",
    actorId: user.id,
    metadata: { id, status },
  });

  revalidatePath("/net-neighbors");
  revalidatePath("/admin/net-neighbors");
  revalidatePath("/admin/social");
  return { success: true };
}

export async function updateNetNeighborOrderAction(
  items: { id: string; sortOrder: number }[],
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: "No items to reorder." };
  }

  const ids = items.map((i) => i.id);
  const rows = await prisma.netNeighbor.findMany({
    where: { id: { in: ids }, status: "APPROVED" },
    select: { id: true },
  });

  if (rows.length !== ids.length) {
    return { success: false, error: "Invalid banner selection for reorder." };
  }

  await updateNetNeighborOrder(
    items.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    })),
  );

  revalidatePath("/net-neighbors");
  revalidatePath("/admin/net-neighbors");
  return { success: true };
}
