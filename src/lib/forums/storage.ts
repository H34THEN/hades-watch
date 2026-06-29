import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import { extname } from "path";

export const FORUM_PROFILE_IMAGES_DIR = join(
  process.cwd(),
  "storage/uploads/forum-profile-images",
);

export const FORUM_SIGNATURES_DIR = join(
  process.cwd(),
  "storage/uploads/forum-signatures",
);

export const MAX_FORUM_IMAGE_BYTES = 2 * 1024 * 1024;
export const ALLOWED_FORUM_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
export const ALLOWED_FORUM_IMAGE_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export interface UploadableForumImage {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export async function ensureForumUploadDirs() {
  await mkdir(FORUM_PROFILE_IMAGES_DIR, { recursive: true });
  await mkdir(FORUM_SIGNATURES_DIR, { recursive: true });
}

export function validateForumImageUpload(
  file: UploadableForumImage,
): { ok: true } | { ok: false; error: string } {
  if (!file || file.size === 0) {
    return { ok: false, error: "Image file is required." };
  }
  if (file.size > MAX_FORUM_IMAGE_BYTES) {
    return { ok: false, error: "Image exceeds 2 MB limit." };
  }
  const ext = extname(file.name).toLowerCase();
  if (!ALLOWED_FORUM_IMAGE_EXTENSIONS.has(ext)) {
    return { ok: false, error: "Image must be PNG, JPEG, or WebP." };
  }
  if (file.type && !ALLOWED_FORUM_IMAGE_MIMES.has(file.type)) {
    return { ok: false, error: "Unsupported image type." };
  }
  return { ok: true };
}

export async function saveForumProfileImage(file: UploadableForumImage): Promise<string> {
  await ensureForumUploadDirs();
  const ext = extname(file.name).toLowerCase();
  const safeExt = ALLOWED_FORUM_IMAGE_EXTENSIONS.has(ext) ? ext : ".png";
  const storedName = `${randomBytes(16).toString("hex")}${safeExt}`;
  const absolutePath = `${FORUM_PROFILE_IMAGES_DIR}/${storedName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return `storage/uploads/forum-profile-images/${storedName}`;
}

export async function saveForumSignatureImage(file: UploadableForumImage): Promise<string> {
  await ensureForumUploadDirs();
  const ext = extname(file.name).toLowerCase();
  const safeExt = ALLOWED_FORUM_IMAGE_EXTENSIONS.has(ext) ? ext : ".png";
  const storedName = `${randomBytes(16).toString("hex")}${safeExt}`;
  const absolutePath = `${FORUM_SIGNATURES_DIR}/${storedName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return `storage/uploads/forum-signatures/${storedName}`;
}
