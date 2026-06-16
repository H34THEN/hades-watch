#!/usr/bin/env npx tsx
/**
 * Migrates avatar and badge PNG assets from component folders into public/.
 * Idempotent: skips existing destination files (no overwrite).
 * Writes docs/AVATAR_ASSET_MIGRATION_REPORT.md on each run.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { basename, extname, join, relative } from "path";

const ROOT = process.cwd();
const AVATAR_SRC = join(ROOT, "src/components/avatar/avatar assets");
const BADGE_SRC = join(ROOT, "src/components/assets/badges");
const PUBLIC = join(ROOT, "public");
const REPORT_PATH = join(ROOT, "docs/AVATAR_ASSET_MIGRATION_REPORT.md");

interface MigrationRow {
  original: string;
  destination: string;
  category: string;
  slug: string;
  notes: string;
  action: "copied" | "skipped";
}

const avatarRows: MigrationRow[] = [];

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

function classifyAvatar(relativePath: string, fileName: string): { category: string; notes?: string } {
  const p = relativePath.toLowerCase();
  const f = fileName.toLowerCase();

  if (p.includes("bodybases") || p.includes("/base/") || f.includes("_base") || f.includes("-base")) {
    if (f.startsWith("archivist") && !f.includes("archivist-")) {
      return { category: "bodies", notes: "archivist variant body" };
    }
    return { category: "bodies" };
  }
  if (f.includes("pants") || f.includes("trousers") || f.includes("leggings")) return { category: "pants" };
  if (f.includes("skirt")) return { category: "skirts" };
  if (
    f.startsWith("coat_") ||
    f.includes("jacket") ||
    f.includes("cloak") ||
    f.includes("robe") ||
    f.includes("mantle") ||
    f.includes(" coat") ||
    f.endsWith("-coat.png")
  ) {
    return { category: "outerwear" };
  }
  if (
    f.includes("shirt") ||
    f.includes(" top") ||
    f.startsWith("top") ||
    f.includes("_top") ||
    (f.includes("top") && !f.includes("desktop"))
  ) {
    return { category: "tops" };
  }
  if (f.includes("boot") || f.includes("shoe") || f.includes("sandal") || f.includes("sneaker")) {
    return { category: "shoes" };
  }
  if (f.includes("sock") || f.includes("stocking") || f.includes("tight")) return { category: "socks" };
  if (f.includes("glove") || f.includes("gauntlet") || f.includes("cipher-gloves")) return { category: "gloves" };
  if (f.includes("scarf") || f.includes("headwrap") || f.includes(" soft cap")) return { category: "accessories" };
  if (f.includes("horn") || f.includes("antler")) return { category: "horns" };
  if (f.includes("tail")) return { category: "tails" };
  if (f.includes("wing")) return { category: "wings" };
  if (f.includes("hair") || f.includes("braid") || f.includes("mohawk")) return { category: "hair" };
  if (f.includes("eye")) return { category: "eyes" };
  if (f.includes("background") || f.startsWith("bg_")) return { category: "backgrounds" };
  if (f.includes("satchel") || f.includes("backpack") || f.includes("pack") && f.includes("ghost")) {
    return { category: "back-items" };
  }
  if (p.includes("accessories") || f.startsWith("acc_")) {
    if (f.includes("boot") || f.includes("shoe")) return { category: "shoes" };
    if (f.includes("glove")) return { category: "gloves" };
    return { category: "accessories" };
  }
  if (p.includes("clothing")) {
    if (f.includes("pants")) return { category: "pants" };
    if (f.includes("jacket")) return { category: "outerwear" };
    return { category: "tops" };
  }
  if (
    f.includes("tiefling") ||
    f.includes("nymph") ||
    f.includes("gorgon") ||
    f.includes("automaton") ||
    f.includes("wraith")
  ) {
    return { category: "bodies" };
  }
  if (f.includes("archivist") && (f.includes("earpiece") || f.includes("cuff"))) {
    return { category: "accessories" };
  }
  if (f.includes("relic") || f.includes("terminal") || f.includes("tablet") || f.includes("drone")) {
    return { category: "fictional-props" };
  }
  if (f.includes("asclepian") || f.includes("oracular") || f.includes("chthonic") || f.includes("daedalus")) {
    return { category: "faction-flair", notes: "review for clothing vs flair" };
  }
  return { category: "placeholders", notes: "uncertain classification" };
}

function classifyBadge(fileName: string): string {
  const f = fileName.toLowerCase();
  if (f.includes("cipher") || f.includes("c1ph3r") || f.includes("cr4k3r")) return "ciphers";
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
    const { category, notes } = classifyAvatar(rel, basename(file));
    const destDir = join(PUBLIC, "avatar-assets", category);
    mkdirSync(destDir, { recursive: true });
    const destName = `${toKebab(basename(file))}${extname(file).toLowerCase()}`;
    const dest = uniqueDest(destDir, destName);
    const slug = toKebab(basename(dest));
    const action = existsSync(dest) ? "skipped" : "copied";
    if (action === "copied") {
      copyFileSync(file, dest);
      copied += 1;
      console.log(`  avatar → ${dest.replace(PUBLIC, "public")}`);
    }
    avatarRows.push({
      original: relative(AVATAR_SRC, file),
      destination: dest.replace(PUBLIC + "/", "public/"),
      category,
      slug,
      notes: notes ?? (action === "skipped" ? "destination already exists" : ""),
      action,
    });
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

function writeReport() {
  const copied = avatarRows.filter((r) => r.action === "copied");
  const skipped = avatarRows.filter((r) => r.action === "skipped");
  const uncertain = avatarRows.filter((r) => r.category === "placeholders");

  const lines = [
    "# Avatar Asset Migration Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    `- Source reviewed: \`src/components/avatar/avatar assets/\``,
    `- Files processed: ${avatarRows.length}`,
    `- New copies this run: ${copied.length}`,
    `- Skipped (already present): ${skipped.length}`,
    `- Uncertain classifications: ${uncertain.length}`,
    "",
    "Source files are **not deleted** after copy. Remove duplicates only after verifying public paths and registry entries.",
    "",
    "## Migration Table",
    "",
    "| Original File | New File | Category | Registry Slug | Notes |",
    "|---|---|---|---|---|",
    ...avatarRows.map(
      (r) =>
        `| \`${r.original}\` | \`${r.destination}\` | ${r.category} | \`${r.slug}\` | ${r.notes || r.action} |`,
    ),
    "",
    "## Where Future Assets Go",
    "",
    "See [AVATAR_ASSET_DIRECTORY.md](./AVATAR_ASSET_DIRECTORY.md).",
    "",
    "## Avatar Forge GPT Access",
    "",
    "Implemented at `/profile/avatar/forge` with Owner review at `/admin/avatar-forge-access`.",
    "GPT URL is server-side only (`AVATAR_FORGE_GPT_URL` env var).",
    "",
  ];
  writeFileSync(REPORT_PATH, lines.join("\n"));
  console.log(`\nReport written: ${REPORT_PATH}`);
}

console.log("Migrating static avatar and badge assets...\n");
migrateAvatarAssets();
console.log("");
migrateBadgeAssets();
writeReport();
console.log("\nDone.");
