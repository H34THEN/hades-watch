import { join } from "path";

export const AUDIO_TRACKS_DIR = join(process.cwd(), "storage/uploads/audio/tracks");
export const AUDIO_COVERS_DIR = join(process.cwd(), "storage/uploads/audio/covers");

export const MAX_AUDIO_BYTES = 50 * 1024 * 1024;

export const ALLOWED_AUDIO_EXTENSIONS = new Set([".mp3", ".m4a", ".wav", ".ogg"]);

export const ALLOWED_AUDIO_MIMES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/vorbis",
]);

export const ALLOWED_COVER_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MAX_COVER_BYTES = 5 * 1024 * 1024;
