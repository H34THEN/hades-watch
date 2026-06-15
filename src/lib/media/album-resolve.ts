import type { MediaVisibility } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { slugifyMediaTitle } from "@/lib/media/storage";

export type AlbumResolveResult =
  | { ok: true; albumId: string | null }
  | { ok: false; error: string };

export async function resolveAlbumForUpload(params: {
  albumId: string | null;
  newAlbumTitle: string;
  newAlbumArtistName?: string | null;
  newAlbumDescription?: string | null;
  visibility: MediaVisibility;
  createdById: string;
}): Promise<AlbumResolveResult> {
  const albumId = params.albumId?.trim() || null;
  const newAlbumTitle = params.newAlbumTitle.trim();

  if (albumId && newAlbumTitle) {
    return {
      ok: false,
      error: "Choose either an existing album or type a new album name — not both.",
    };
  }

  if (newAlbumTitle) {
    const existing = await prisma.mediaAlbum.findFirst({
      where: { title: { equals: newAlbumTitle, mode: "insensitive" } },
    });
    if (existing) {
      return { ok: true, albumId: existing.id };
    }

    const album = await prisma.mediaAlbum.create({
      data: {
        slug: slugifyMediaTitle(newAlbumTitle),
        title: newAlbumTitle,
        artistName: params.newAlbumArtistName?.trim() || null,
        description: params.newAlbumDescription?.trim() || null,
        visibility: params.visibility,
        createdById: params.createdById,
      },
    });
    return { ok: true, albumId: album.id };
  }

  if (albumId) {
    const album = await prisma.mediaAlbum.findUnique({ where: { id: albumId } });
    if (!album) {
      return { ok: false, error: "Selected album not found." };
    }
    return { ok: true, albumId: album.id };
  }

  return { ok: true, albumId: null };
}

export function formatUploadError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes("Body exceeded") || msg.includes("413")) {
      return "File too large for upload. Maximum size is 50 MB. If this persists after a deploy, confirm next.config serverActions.bodySizeLimit and proxy client_max_body_size.";
    }
    if (msg.includes("EACCES") || msg.includes("permission denied")) {
      return "Upload failed: storage permission denied. Ensure the app can write to storage/uploads/audio/tracks.";
    }
    if (msg.includes("ENOSPC")) {
      return "Upload failed: server disk is full.";
    }
    if (msg.includes("Unique constraint") || msg.includes("slug")) {
      return "Upload failed: duplicate track or album slug. Retry with a slightly different title.";
    }
    console.error("[media.upload]", err);
    return `Upload failed: ${msg}`;
  }
  console.error("[media.upload]", err);
  return "Upload failed. The signal could not be stored. Check file type, size, and server storage permissions.";
}
