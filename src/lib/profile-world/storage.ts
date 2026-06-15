import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import { extname } from "path";
import type { UserProfileAssetKind } from "@/generated/prisma/client";

export const PROFILE_PORTRAITS_DIR = join(process.cwd(), "storage/uploads/profiles/portraits");
export const PROFILE_BACKGROUNDS_DIR = join(process.cwd(), "storage/uploads/profiles/backgrounds");
export const PROFILE_BANNERS_DIR = join(process.cwd(), "storage/uploads/profiles/banners");
export const PROFILE_RELIC_DIR = join(process.cwd(), "storage/uploads/profiles/relic-images");

export const MAX_PORTRAIT_BYTES = 3 * 1024 * 1024;
export const MAX_BACKGROUND_BYTES = 5 * 1024 * 1024;
export const MAX_BANNER_BYTES = 5 * 1024 * 1024;
export const MAX_RELIC_BYTES = 512 * 1024;

const ALLOWED_EXTENSIONS = new Set([".gif", ".png", ".jpg", ".jpeg", ".webp"]);
const ALLOWED_MIMES = new Set([
  "image/gif",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const KIND_DIRS: Record<UserProfileAssetKind, string> = {
  PORTRAIT: PROFILE_PORTRAITS_DIR,
  BANNER: PROFILE_BANNERS_DIR,
  BACKGROUND: PROFILE_BACKGROUNDS_DIR,
  RELIC_IMAGE: PROFILE_RELIC_DIR,
  AVATAR_BACKGROUND: PROFILE_BACKGROUNDS_DIR,
};

const KIND_LIMITS: Record<UserProfileAssetKind, number> = {
  PORTRAIT: MAX_PORTRAIT_BYTES,
  BANNER: MAX_BANNER_BYTES,
  BACKGROUND: MAX_BACKGROUND_BYTES,
  RELIC_IMAGE: MAX_RELIC_BYTES,
  AVATAR_BACKGROUND: MAX_BACKGROUND_BYTES,
};

const KIND_PREFIX: Record<UserProfileAssetKind, string> = {
  PORTRAIT: "portraits",
  BANNER: "banners",
  BACKGROUND: "backgrounds",
  RELIC_IMAGE: "relic-images",
  AVATAR_BACKGROUND: "backgrounds",
};

export interface UploadableProfileImage {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export async function ensureProfileAssetDirs() {
  await Promise.all([
    mkdir(PROFILE_PORTRAITS_DIR, { recursive: true }),
    mkdir(PROFILE_BACKGROUNDS_DIR, { recursive: true }),
    mkdir(PROFILE_BANNERS_DIR, { recursive: true }),
    mkdir(PROFILE_RELIC_DIR, { recursive: true }),
  ]);
}

export function validateProfileImageUpload(
  file: UploadableProfileImage,
  kind: UserProfileAssetKind,
): { ok: true } | { ok: false; error: string } {
  if (!file || file.size === 0) return { ok: false, error: "File is required." };
  const limit = KIND_LIMITS[kind];
  if (file.size > limit) {
    return { ok: false, error: `File exceeds ${Math.round(limit / 1024 / 1024)} MB limit.` };
  }
  const ext = extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { ok: false, error: "Allowed formats: GIF, PNG, JPEG, WebP. SVG blocked for MVP." };
  }
  if (file.type && !ALLOWED_MIMES.has(file.type)) {
    return { ok: false, error: "Unsupported image type." };
  }
  if (file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml") {
    return { ok: false, error: "SVG uploads are not allowed." };
  }
  return { ok: true };
}

export async function saveProfileAssetUpload(
  file: UploadableProfileImage,
  kind: UserProfileAssetKind,
): Promise<{ path: string; mimeType: string }> {
  await ensureProfileAssetDirs();
  const dir = KIND_DIRS[kind];
  const ext = extname(file.name).toLowerCase();
  const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : ".png";
  const storedName = `${randomBytes(16).toString("hex")}${safeExt}`;
  const absolutePath = `${dir}/${storedName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return {
    path: `storage/uploads/profiles/${KIND_PREFIX[kind]}/${storedName}`,
    mimeType: file.type || "image/png",
  };
}
