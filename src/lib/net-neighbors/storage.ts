import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import { extname } from "path";

export const NET_NEIGHBOR_BANNERS_DIR = join(
  process.cwd(),
  "storage/uploads/net-neighbors/banners",
);

export const MAX_BANNER_BYTES = 512 * 1024;
export const ALLOWED_BANNER_EXTENSIONS = new Set([".gif", ".png", ".jpg", ".jpeg", ".webp"]);
export const ALLOWED_BANNER_MIMES = new Set([
  "image/gif",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export async function ensureNetNeighborBannerDir() {
  await mkdir(NET_NEIGHBOR_BANNERS_DIR, { recursive: true });
}

export interface UploadableBanner {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export function validateBannerUpload(
  file: UploadableBanner,
): { ok: true } | { ok: false; error: string } {
  if (!file || file.size === 0) {
    return { ok: false, error: "Banner image is required." };
  }
  if (file.size > MAX_BANNER_BYTES) {
    return { ok: false, error: "Banner exceeds 512 KB limit." };
  }
  const ext = extname(file.name).toLowerCase();
  if (!ALLOWED_BANNER_EXTENSIONS.has(ext)) {
    return { ok: false, error: "Banner must be GIF, PNG, JPEG, or WebP." };
  }
  if (file.type && !ALLOWED_BANNER_MIMES.has(file.type)) {
    return { ok: false, error: "Unsupported banner image type." };
  }
  return { ok: true };
}

export async function saveBannerUpload(file: UploadableBanner): Promise<string> {
  await ensureNetNeighborBannerDir();
  const ext = extname(file.name).toLowerCase();
  const safeExt = ALLOWED_BANNER_EXTENSIONS.has(ext) ? ext : ".png";
  const storedName = `${randomBytes(16).toString("hex")}${safeExt}`;
  const absolutePath = `${NET_NEIGHBOR_BANNERS_DIR}/${storedName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return `storage/uploads/net-neighbors/banners/${storedName}`;
}
