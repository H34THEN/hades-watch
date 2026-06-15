import { unlink } from "fs/promises";
import type { MediaVisibility } from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { formatUploadError, resolveAlbumForUpload } from "@/lib/media/album-resolve";
import {
  resolveStoredPath,
  saveAudioUpload,
  slugifyMediaTitle,
  validateAudioUpload,
  type UploadableAudio,
} from "@/lib/media/storage";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export type MediaUploadResult =
  | { success: true; trackId: string }
  | { success: false; error: string };

const visibilitySchema = z.enum(["PRIVATE", "APPROVED_USERS", "PUBLIC", "HIDDEN"]);

export function extractAudioFromFormData(formData: FormData): UploadableAudio | null {
  const audio = formData.get("audio");
  if (!audio || typeof audio !== "object" || !("arrayBuffer" in audio)) {
    return null;
  }

  const blob = audio as Blob & { name?: string };
  if (!blob.size) {
    return null;
  }

  const name =
    "name" in blob && typeof blob.name === "string" && blob.name.trim()
      ? blob.name
      : "upload.mp3";

  return {
    name,
    type: blob.type || "audio/mpeg",
    size: blob.size,
    arrayBuffer: () => blob.arrayBuffer(),
  };
}

export async function uploadMediaTrackFromForm(
  formData: FormData,
  ownerId: string,
): Promise<MediaUploadResult> {
  let savedFilePath: string | null = null;

  try {
    const audio = extractAudioFromFormData(formData);
    if (!audio) {
      return { success: false, error: "Audio file is required." };
    }

    const audioCheck = validateAudioUpload(audio);
    if (!audioCheck.ok) return { success: false, error: audioCheck.error };

    const title = String(formData.get("title") ?? "").trim();
    if (!title) return { success: false, error: "Title is required." };

    const visibilityParsed = visibilitySchema.safeParse(
      formData.get("visibility") || "APPROVED_USERS",
    );
    if (!visibilityParsed.success) return { success: false, error: "Invalid visibility." };

    const albumResolved = await resolveAlbumForUpload({
      albumId: String(formData.get("albumId") ?? "").trim() || null,
      newAlbumTitle: String(formData.get("newAlbumTitle") ?? ""),
      newAlbumArtistName: String(formData.get("newAlbumArtistName") ?? "").trim() || null,
      newAlbumDescription: String(formData.get("newAlbumDescription") ?? "").trim() || null,
      visibility: visibilityParsed.data as MediaVisibility,
      createdById: ownerId,
    });
    if (!albumResolved.ok) return { success: false, error: albumResolved.error };

    const trackNumberRaw = formData.get("trackNumber");
    const trackNumber =
      trackNumberRaw && String(trackNumberRaw).trim()
        ? Number.parseInt(String(trackNumberRaw), 10)
        : null;

    const { filePath, mimeType } = await saveAudioUpload(audio, title);
    savedFilePath = filePath;
    const slug = slugifyMediaTitle(title);

    const track = await prisma.mediaTrack.create({
      data: {
        slug,
        title,
        artistName: String(formData.get("artistName") ?? "").trim() || null,
        albumId: albumResolved.albumId,
        trackNumber: Number.isFinite(trackNumber) ? trackNumber : null,
        description: String(formData.get("description") ?? "").trim() || null,
        filePath,
        mimeType,
        visibility: visibilityParsed.data,
        uploadedById: ownerId,
      },
    });

    await writeAuditLog({
      action: "media.track.upload",
      actorId: ownerId,
      targetType: "media_track",
      targetId: track.id,
      metadata: { slug, title, albumId: albumResolved.albumId },
    });

    return { success: true, trackId: track.id };
  } catch (err) {
    if (savedFilePath) {
      try {
        await unlink(resolveStoredPath(savedFilePath));
      } catch {
        // best-effort cleanup
      }
    }
    return { success: false, error: formatUploadError(err) };
  }
}
