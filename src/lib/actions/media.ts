"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import { writeAuditLog } from "@/lib/audit";
import { getSessionUser, requireAdmin, type SessionUser } from "@/lib/auth/session";
import { isOwner } from "@/lib/auth/roles";
import {
  resolveStoredPath,
  saveCoverFile,
  slugifyMediaTitle,
  validateCoverFile,
} from "@/lib/media/storage";
import { uploadMediaTrackFromForm } from "@/lib/media/upload-track";
import { canListMediaVisibility } from "@/lib/media/visibility";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export type ActionResult = { success: true } | { success: false; error: string };

async function requireOwnerMedia() {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false as const, error: "Authentication required. Sign in and retry the upload." };
  }
  if (!isOwner(user.roles)) {
    return { ok: false as const, error: "Owner clearance required for Signal Deck uploads." };
  }
  return { ok: true as const, user };
}

const visibilitySchema = z.enum(["PRIVATE", "APPROVED_USERS", "PUBLIC", "HIDDEN"]);

export async function getOwnerMediaDeckData() {
  try {
    const user = await requireAdmin();
    const [albums, tracks] = await Promise.all([
      prisma.mediaAlbum.findMany({
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        include: { _count: { select: { tracks: true } } },
      }),
      prisma.mediaTrack.findMany({
        orderBy: [{ album: { sortOrder: "asc" } }, { trackNumber: "asc" }, { createdAt: "desc" }],
        include: { album: { select: { id: true, title: true, slug: true } } },
      }),
    ]);

    return { albums, tracks, isOwner: isOwner(user.roles) };
  } catch {
    return null;
  }
}

export async function getSignalPlayerTracks(user: SessionUser | null) {
  const tracks = await prisma.mediaTrack.findMany({
    where: {
      visibility: { in: ["PUBLIC", "APPROVED_USERS", "PRIVATE", "HIDDEN"] },
    },
    orderBy: [
      { album: { sortOrder: "asc" } },
      { trackNumber: "asc" },
      { createdAt: "asc" },
    ],
    include: {
      album: { select: { id: true, title: true, slug: true, artistName: true } },
    },
  });

  return tracks
    .filter((t) => canListMediaVisibility(t.visibility, user))
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      artistName: t.artistName,
      albumTitle: t.album?.title ?? null,
      albumArtist: t.album?.artistName ?? null,
      trackNumber: t.trackNumber,
      description: t.description,
      mimeType: t.mimeType,
      durationSec: t.durationSec,
      visibility: t.visibility,
      streamUrl: `/api/media/audio/${t.id}`,
    }));
}

const albumSchema = z.object({
  title: z.string().min(1).max(200),
  artistName: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  visibility: visibilitySchema,
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});

export async function createMediaAlbumAction(formData: FormData): Promise<ActionResult> {
  const gate = await requireOwnerMedia();
  if (!gate.ok) return { success: false, error: gate.error };

  const parsed = albumSchema.safeParse({
    title: formData.get("title"),
    artistName: formData.get("artistName") || undefined,
    description: formData.get("description") || undefined,
    visibility: formData.get("visibility") || "APPROVED_USERS",
    sortOrder: formData.get("sortOrder") || 0,
  });
  if (!parsed.success) return { success: false, error: "Invalid album fields." };

  let coverPath: string | null = null;
  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    const coverCheck = validateCoverFile(cover);
    if (!coverCheck.ok) return { success: false, error: coverCheck.error };
    coverPath = await saveCoverFile(cover);
  }

  const slug = slugifyMediaTitle(parsed.data.title);
  await prisma.mediaAlbum.create({
    data: {
      slug,
      title: parsed.data.title.trim(),
      artistName: parsed.data.artistName?.trim() || null,
      description: parsed.data.description?.trim() || null,
      coverPath,
      visibility: parsed.data.visibility,
      sortOrder: parsed.data.sortOrder ?? 0,
      createdById: gate.user.id,
    },
  });

  await writeAuditLog({
    action: "media.album.create",
    actorId: gate.user.id,
    metadata: { slug, title: parsed.data.title },
  });

  revalidatePath("/admin/media");
  return { success: true };
}

export async function uploadMediaTrackAction(formData: FormData): Promise<ActionResult> {
  const gate = await requireOwnerMedia();
  if (!gate.ok) return { success: false, error: gate.error };

  const result = await uploadMediaTrackFromForm(formData, gate.user.id);
  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/admin/media");
  revalidatePath("/admin/media/upload");
  return { success: true };
}

export async function updateMediaTrackAction(formData: FormData): Promise<ActionResult> {
  const gate = await requireOwnerMedia();
  if (!gate.ok) return { success: false, error: gate.error };

  const id = String(formData.get("id") ?? "");
  if (!id) return { success: false, error: "Track id required." };

  const visibilityParsed = visibilitySchema.safeParse(formData.get("visibility"));
  if (!visibilityParsed.success) return { success: false, error: "Invalid visibility." };

  const trackNumberRaw = formData.get("trackNumber");
  const trackNumber =
    trackNumberRaw && String(trackNumberRaw).trim()
      ? Number.parseInt(String(trackNumberRaw), 10)
      : null;

  const albumId = String(formData.get("albumId") ?? "").trim() || null;

  await prisma.mediaTrack.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? "").trim(),
      artistName: String(formData.get("artistName") ?? "").trim() || null,
      albumId,
      trackNumber: Number.isFinite(trackNumber) ? trackNumber : null,
      description: String(formData.get("description") ?? "").trim() || null,
      visibility: visibilityParsed.data,
    },
  });

  await writeAuditLog({
    action: "media.track.update",
    actorId: gate.user.id,
    targetType: "media_track",
    targetId: id,
  });

  revalidatePath("/admin/media");
  return { success: true };
}

export async function deleteMediaTrackAction(trackId: string): Promise<ActionResult> {
  const gate = await requireOwnerMedia();
  if (!gate.ok) return { success: false, error: gate.error };

  const track = await prisma.mediaTrack.findUnique({ where: { id: trackId } });
  if (!track) return { success: false, error: "Track not found." };

  await prisma.mediaTrack.delete({ where: { id: trackId } });
  try {
    await unlink(resolveStoredPath(track.filePath));
  } catch {
    // file may already be missing on disk
  }

  await writeAuditLog({
    action: "media.track.delete",
    actorId: gate.user.id,
    targetType: "media_track",
    targetId: trackId,
    metadata: { slug: track.slug },
  });

  revalidatePath("/admin/media");
  return { success: true };
}

export async function updateMediaAlbumAction(formData: FormData): Promise<ActionResult> {
  const gate = await requireOwnerMedia();
  if (!gate.ok) return { success: false, error: gate.error };

  const id = String(formData.get("id") ?? "");
  if (!id) return { success: false, error: "Album id required." };

  const visibilityParsed = visibilitySchema.safeParse(formData.get("visibility"));
  if (!visibilityParsed.success) return { success: false, error: "Invalid visibility." };

  let coverPath: string | undefined;
  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    const coverCheck = validateCoverFile(cover);
    if (!coverCheck.ok) return { success: false, error: coverCheck.error };
    coverPath = await saveCoverFile(cover);
  }

  await prisma.mediaAlbum.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? "").trim(),
      artistName: String(formData.get("artistName") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      visibility: visibilityParsed.data,
      sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
      ...(coverPath ? { coverPath } : {}),
    },
  });

  revalidatePath("/admin/media");
  return { success: true };
}
