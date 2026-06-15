import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import { extname } from "path";
import type { AvatarPartCategory } from "@/generated/prisma/client";

export const AVATAR_PARTS_DIR = join(process.cwd(), "storage/uploads/avatar-parts");
export const MAX_AVATAR_PART_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([".gif", ".png", ".jpg", ".jpeg", ".webp"]);
const ALLOWED_MIMES = new Set(["image/gif", "image/png", "image/jpeg", "image/webp"]);

export interface UploadableAvatarPart {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export async function ensureAvatarPartsDir(userId: string) {
  const dir = join(AVATAR_PARTS_DIR, userId);
  await mkdir(dir, { recursive: true });
  return dir;
}

export function validateAvatarPartUpload(
  file: UploadableAvatarPart,
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
  return { ok: true };
}

export async function saveAvatarPartUpload(
  userId: string,
  file: UploadableAvatarPart,
  category: AvatarPartCategory,
): Promise<{ path: string; mimeType: string }> {
  const dir = await ensureAvatarPartsDir(userId);
  const ext = extname(file.name).toLowerCase();
  const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : ".png";
  const storedName = `${category.toLowerCase()}-${randomBytes(12).toString("hex")}${safeExt}`;
  const absolutePath = join(dir, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return {
    path: `storage/uploads/avatar-parts/${userId}/${storedName}`,
    mimeType: file.type || "image/png",
  };
}
