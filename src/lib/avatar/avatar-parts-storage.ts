import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import { extname } from "path";

export const AVATAR_PARTS_PRIVATE_DIR = join(process.cwd(), "storage/uploads/avatar-parts/private");
export const AVATAR_PARTS_SHARED_DIR = join(process.cwd(), "storage/uploads/avatar-parts/shared");
export const AVATAR_BACKGROUNDS_DIR = join(process.cwd(), "storage/uploads/avatar-backgrounds");
export const MAX_AVATAR_PART_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([".gif", ".png", ".jpg", ".jpeg", ".webp"]);
const ALLOWED_MIMES = new Set(["image/gif", "image/png", "image/jpeg", "image/webp"]);

export interface UploadableAvatarPart {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export async function ensureAvatarPartsDirs() {
  await Promise.all([
    mkdir(AVATAR_PARTS_PRIVATE_DIR, { recursive: true }),
    mkdir(AVATAR_PARTS_SHARED_DIR, { recursive: true }),
    mkdir(AVATAR_BACKGROUNDS_DIR, { recursive: true }),
  ]);
}

export function validateAvatarPartUpload(
  file: UploadableAvatarPart,
  category: string,
): { ok: true } | { ok: false; error: string } {
  if (!file || file.size === 0) return { ok: false, error: "File is required." };
  if (file.size > MAX_AVATAR_PART_BYTES) {
    return { ok: false, error: "File exceeds 5 MB limit." };
  }
  const ext = extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { ok: false, error: "Allowed formats: GIF, PNG, JPEG, WebP. SVG blocked." };
  }
  if (file.type && !ALLOWED_MIMES.has(file.type)) {
    return { ok: false, error: "Unsupported image type." };
  }
  if (file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml") {
    return { ok: false, error: "SVG uploads are not allowed." };
  }
  const isBackground = category === "backgrounds";
  if (!isBackground && (ext === ".jpg" || ext === ".jpeg")) {
    return { ok: false, error: "JPEG is allowed for backgrounds only. Use PNG for transparent layers." };
  }
  return { ok: true };
}

export async function saveAvatarPartUpload(
  userId: string,
  file: UploadableAvatarPart,
  category: string,
  visibility: "PRIVATE" | "SHARED_PENDING" | "SHARED_APPROVED",
): Promise<{ path: string; mimeType: string }> {
  await ensureAvatarPartsDirs();
  const bucket =
    visibility === "PRIVATE" ? AVATAR_PARTS_PRIVATE_DIR : AVATAR_PARTS_SHARED_DIR;
  const userDir = join(bucket, userId);
  await mkdir(userDir, { recursive: true });
  const ext = extname(file.name).toLowerCase();
  const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : ".png";
  const storedName = `${category.replace(/[^a-z0-9-]/g, "")}-${randomBytes(12).toString("hex")}${safeExt}`;
  const absolutePath = join(userDir, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  const bucketName = visibility === "PRIVATE" ? "private" : "shared";
  return {
    path: `storage/uploads/avatar-parts/${bucketName}/${userId}/${storedName}`,
    mimeType: file.type || "image/png",
  };
}
