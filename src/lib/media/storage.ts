import { mkdir, writeFile, copyFile } from "fs/promises";
import { existsSync } from "fs";
import { randomBytes } from "crypto";
import { basename, extname } from "path";
import {
  ALLOWED_AUDIO_EXTENSIONS,
  ALLOWED_AUDIO_MIMES,
  ALLOWED_COVER_MIMES,
  AUDIO_COVERS_DIR,
  AUDIO_TRACKS_DIR,
  MAX_AUDIO_BYTES,
  MAX_COVER_BYTES,
} from "@/lib/media/constants";

export async function ensureMediaDirs() {
  await mkdir(AUDIO_TRACKS_DIR, { recursive: true });
  await mkdir(AUDIO_COVERS_DIR, { recursive: true });
}

export function slugifyMediaTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const suffix = randomBytes(4).toString("hex");
  return base ? `${base}-${suffix}` : `signal-${suffix}`;
}

function sanitizeExtension(filename: string, allowed: Set<string>): string | null {
  const ext = extname(filename).toLowerCase();
  return allowed.has(ext) ? ext : null;
}

export function validateAudioFile(file: File): { ok: true } | { ok: false; error: string } {
  if (!file || file.size === 0) {
    return { ok: false, error: "Audio file is required." };
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return { ok: false, error: "Audio file exceeds 50 MB limit." };
  }
  const ext = sanitizeExtension(file.name, ALLOWED_AUDIO_EXTENSIONS);
  if (!ext) {
    return { ok: false, error: "Unsupported audio format. Use .mp3, .m4a, .wav, or .ogg." };
  }
  if (file.type && !ALLOWED_AUDIO_MIMES.has(file.type)) {
    return {
      ok: false,
      error: `Unsupported audio MIME type (${file.type}). Use .mp3, .m4a, .wav, or .ogg.`,
    };
  }
  return { ok: true };
}

export function validateCoverFile(file: File): { ok: true } | { ok: false; error: string } {
  if (!file || file.size === 0) {
    return { ok: false, error: "Cover file is empty." };
  }
  if (file.size > MAX_COVER_BYTES) {
    return { ok: false, error: "Cover image exceeds 5 MB limit." };
  }
  if (file.type && !ALLOWED_COVER_MIMES.has(file.type)) {
    return { ok: false, error: "Cover must be JPEG, PNG, WebP, or GIF." };
  }
  return { ok: true };
}

export async function saveAudioFile(
  file: File,
  preferredName?: string,
): Promise<{ filePath: string; mimeType: string; storedName: string }> {
  await ensureMediaDirs();
  const ext = sanitizeExtension(file.name, ALLOWED_AUDIO_EXTENSIONS) ?? ".mp3";
  const nameHint = preferredName
    ? preferredName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40)
    : "";
  const storedName = nameHint
    ? `${randomBytes(8).toString("hex")}-${nameHint}${ext}`
    : `${randomBytes(16).toString("hex")}${ext}`;
  const absolutePath = `${AUDIO_TRACKS_DIR}/${storedName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return {
    filePath: `storage/uploads/audio/tracks/${storedName}`,
    mimeType: file.type || "audio/mpeg",
    storedName,
  };
}

export async function copyAudioFileFromPath(
  sourcePath: string,
  title?: string,
): Promise<{ filePath: string; mimeType: string; storedName: string }> {
  if (!existsSync(sourcePath)) {
    throw new Error(`Source audio file not found: ${sourcePath}`);
  }
  await ensureMediaDirs();
  const ext = sanitizeExtension(basename(sourcePath), ALLOWED_AUDIO_EXTENSIONS) ?? ".mp3";
  const nameHint = title
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40)
    : "";
  const storedName = nameHint
    ? `${randomBytes(8).toString("hex")}-${nameHint}${ext}`
    : `${randomBytes(16).toString("hex")}${ext}`;
  const absolutePath = `${AUDIO_TRACKS_DIR}/${storedName}`;
  await copyFile(sourcePath, absolutePath);
  const mimeType =
    ext === ".mp3"
      ? "audio/mpeg"
      : ext === ".ogg"
        ? "audio/ogg"
        : ext === ".wav"
          ? "audio/wav"
          : "audio/mp4";
  return {
    filePath: `storage/uploads/audio/tracks/${storedName}`,
    mimeType,
    storedName,
  };
}

export async function saveCoverFile(file: File): Promise<string> {
  await ensureMediaDirs();
  const ext = extname(file.name).toLowerCase() || ".jpg";
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg";
  const storedName = `${randomBytes(16).toString("hex")}${safeExt}`;
  const absolutePath = `${AUDIO_COVERS_DIR}/${storedName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return `storage/uploads/audio/covers/${storedName}`;
}

export function resolveStoredPath(relativePath: string): string {
  if (relativePath.startsWith("storage/")) {
    return `${process.cwd()}/${relativePath}`;
  }
  return relativePath;
}
