#!/usr/bin/env npx tsx
/**
 * Migrates avatar and badge PNG assets from component folders into public/.
 * Idempotent: skips existing destination files (no overwrite).
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { basename, extname, join } from "path";

const ROOT = process.cwd();
const AVATAR_SRC = join(ROOT, "src/components/avatar/avatar assets");
const BADGE_SRC = join(ROOT, "src/components/assets/badges");
const PUBLIC = join(ROOT, "public");

function toKebab(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function uniqueDest(dir: string, filename: string): string {
  const ext = extname(filename);
  const base = basename(filename, ext);
  let candidate = `${base}${ext}`;
  let n = 2;
  while (existsSync(join(dir, candidate))) {
    candidate = `${base}-v${String(n).padStart(2, "0")}${ext}`;
    n += 1;
  }
  return join(dir, candidate);
}

function classifyAvatar(relativePath: string, fileName: string): string {
  const p = relativePath.toLowerCase();
  const f = fileName.toLowerCase();
  if (p.includes("bodybases") || p.includes("/base/") || f.includes("_base")) {
    return "bodies";
  }
  if (p.includes("accessories") || f.startsWith("acc_")) return "accessories";
  if (p.includes("clothing") || f.startsWith("coat_")) return "outerwear";
  if (f.includes("horn")) return "horns";
  if (f.includes("tail")) return "tails";
  if (f.includes("wing")) return "wings";
  if (f.includes("hair")) return "hair";
  if (f.includes("eye")) return "eyes";
  if (f.includes("background") || f.includes("bg_")) return "backgrounds";
  if (
    f.includes("tiefling") ||
    f.includes("nymph") ||
    f.includes("gorgon") ||
    f.includes("automaton") ||
    f.includes("wraith")
  ) {
    return "bodies";
  }
  if (f.includes("archivist") || f.includes("dead index") || f.includes("underwatch")) {
    return "accessories";
  }
  return "placeholders";
}

function classifyBadge(fileName: string): string {
  const f = fileName.toLowerCase();
  if (f.includes("cipher") || f.includes("c1ph3r") || f.includes("cr4k3r")) {
    return "ciphers";
  }
  if (
    f.includes("veil") ||
    f.includes("oracle") ||
    f.includes("gatewatch") ||
    f.includes("forge") ||
    f.includes("graffiti") ||
    f.includes("quorum") ||
    f.includes("lantern") ||
    f.includes("pattern") ||
    f.includes("relay") ||
    f.includes("theory") ||
    f.includes("wall bloom") ||
    f.includes("mutual aid") ||
    f.includes("observer") ||
    f.includes("underwatch archivist")
  ) {
    return "missions";
  }
  if (f.includes("grid-badge") || f.includes("deflock")) return "placeholders";
  return "profile";
}

function walk(dir: string, files: string[] = [], base = dir): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files, base);
    } else if (/\.(png|jpg|jpeg|webp|svg)$/i.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function migrateAvatarAssets() {
  if (!existsSync(AVATAR_SRC)) {
    console.log("No avatar source folder found, skipping.");
    return;
  }
  let copied = 0;
  for (const file of walk(AVATAR_SRC)) {
    const rel = file.slice(AVATAR_SRC.length + 1);
    const category = classifyAvatar(rel, basename(file));
    const destDir = join(PUBLIC, "avatar-assets", category);
    mkdirSync(destDir, { recursive: true });
    const destName = `${toKebab(basename(file))}${extname(file).toLowerCase()}`;
    const dest = uniqueDest(destDir, destName);
    if (!existsSync(dest)) {
      copyFileSync(file, dest);
      copied += 1;
      console.log(`  avatar → ${dest.replace(PUBLIC, "public")}`);
    }
  }
  console.log(`Avatar assets copied: ${copied}`);
}

function migrateBadgeAssets() {
  if (!existsSync(BADGE_SRC)) {
    console.log("No badge source folder found, skipping.");
    return;
  }
  let copied = 0;
  for (const file of walk(BADGE_SRC)) {
    const category = classifyBadge(basename(file));
    const destDir = join(PUBLIC, "badge-assets", category);
    mkdirSync(destDir, { recursive: true });
    const destName = `${toKebab(basename(file))}${extname(file).toLowerCase()}`;
    const dest = uniqueDest(destDir, destName);
    if (!existsSync(dest)) {
      copyFileSync(file, dest);
      copied += 1;
      console.log(`  badge → ${dest.replace(PUBLIC, "public")}`);
    }
  }
  console.log(`Badge assets copied: ${copied}`);
}

console.log("Migrating static avatar and badge assets...\n");
migrateAvatarAssets();
console.log("");
migrateBadgeAssets();
console.log("\nDone.");
