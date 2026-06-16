#!/usr/bin/env npx tsx
/**
 * Regenerates src/lib/avatar/avatar-imported-registry.ts from public PNG assets.
 */
import { readdirSync, statSync, writeFileSync } from "fs";
import { basename, join } from "path";

const ROOT = process.cwd();
const PUBLIC_AVATAR = join(ROOT, "public/avatar-assets");
const OUT = join(ROOT, "src/lib/avatar/avatar-imported-registry.ts");

const LAYER_ORDER: Record<string, number> = {
  backgrounds: 10,
  effects: 50,
  tails: 100,
  wings: 120,
  "back-items": 130,
  body: 200,
  bodies: 200,
  markings: 215,
  eyes: 220,
  face: 220,
  ears: 225,
  horns: 230,
  hair: 240,
  emotion: 250,
  emotions: 250,
  tops: 300,
  pants: 310,
  skirts: 315,
  socks: 320,
  shoes: 330,
  gloves: 340,
  hands: 340,
  outerwear: 360,
  accessories: 400,
  "fictional-props": 450,
  "tech-gear": 460,
  "faction-flair": 500,
  placeholders: 900,
};

function toKebab(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function toTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inferSpecies(slug: string): string[] | undefined {
  const species = ["tiefling", "nymph", "gorgon", "automaton", "wraithborn"];
  const found = species.filter((s) => slug.includes(s.replace("wraithborn", "wraith")));
  if (found.length === 0) {
    if (slug.includes("wraith")) return ["wraithborn"];
    if (slug.includes("tielfing") || slug.includes("tiefling")) return ["tiefling"];
  }
  return found.length ? [...new Set(found.map((s) => (s === "wraith" ? "wraithborn" : s)))] : undefined;
}

function inferGender(slug: string): string[] | undefined {
  if (slug.includes("female") || slug.includes("fem-nb") || slug.includes("feminine")) return ["female"];
  if (slug.includes("male") || slug.includes("masc-nb") || slug.includes("masculine")) return ["male"];
  if (slug.includes("nonbinary") || slug.includes("nb-") || slug.includes("-nb-")) {
    return ["nonbinary", "androgynous", "custom"];
  }
  return undefined;
}

function inferFactions(slug: string): string[] | undefined {
  const map: Record<string, string> = {
    asclepian: "asclepian-veil",
    oracular: "oracular-circuit",
    chthonic: "chthonic-uprising",
    daedalus: "daedalus-foundry",
    myrmidon: "myrmidon-grinders",
    styx: "styx-rats",
    underwatch: "underwatch",
    "dead-index": "oracular-circuit",
    archivist: "underwatch",
  };
  const found = Object.entries(map)
    .filter(([k]) => slug.includes(k))
    .map(([, v]) => v);
  return found.length ? [...new Set(found)] : undefined;
}

function walkPng(dir: string, base = dir): { category: string; relPath: string; slug: string }[] {
  const out: { category: string; relPath: string; slug: string }[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walkPng(full, base));
    } else if (/\.(png|webp)$/i.test(entry)) {
      const category = full.slice(base.length + 1).split("/")[0] ?? "placeholders";
      const relPath = `/avatar-assets/${full.slice(base.length + 1)}`;
      out.push({ category, relPath, slug: toKebab(basename(full)) });
    }
  }
  return out;
}

const assets = walkPng(PUBLIC_AVATAR).sort((a, b) => a.slug.localeCompare(b.slug));

function baseSlug(slug: string): string {
  return slug.replace(/-v\d+$/, "");
}

const slugSet = new Set(assets.map((a) => a.slug));
const filtered = assets.filter((a) => {
  const base = baseSlug(a.slug);
  if (a.slug === base) return true;
  return !slugSet.has(base);
});

const entries = filtered.map(({ category, relPath, slug }) => {
  const registryCategory =
    category === "bodies"
      ? "body"
      : category === "emotions"
        ? "emotion"
        : category;
  const layerOrder = LAYER_ORDER[category] ?? LAYER_ORDER[registryCategory] ?? 500;
  const species = inferSpecies(slug);
  const gender = registryCategory === "body" ? inferGender(slug) : undefined;
  const factions = inferFactions(slug);
  const parts = [
    `  imported({`,
    `    slug: "${slug}",`,
    `    name: "${toTitle(slug)}",`,
    `    category: "${registryCategory}",`,
    `    imagePath: "${relPath}",`,
    `    layerOrder: ${layerOrder},`,
    registryCategory === "body" ? `    downloadableBase: true,` : null,
    registryCategory === "body" ? `    placeholder: false,` : null,
    species ? `    allowedSpecies: ${JSON.stringify(species)},` : null,
    gender ? `    allowedGenderPresentations: ${JSON.stringify(gender)},` : null,
    factions ? `    allowedFactions: ${JSON.stringify(factions)},` : null,
    `  }),`,
  ]
    .filter(Boolean)
    .join("\n");
  return parts;
});

const file = `import type { AvatarRegistryItem, AvatarTransform } from "@/lib/avatar/avatar-types";

const DEFAULT: AvatarTransform = { x: 0.5, y: 0.5, scale: 1, rotation: 0 };

function imported(
  partial: Omit<AvatarRegistryItem, "defaultTransform" | "layerOrder"> & {
    layerOrder?: number;
    defaultTransform?: AvatarTransform;
  },
): AvatarRegistryItem {
  return {
    layerOrder: partial.layerOrder ?? 500,
    defaultTransform: partial.defaultTransform ?? DEFAULT,
    downloadableBase: partial.downloadableBase ?? (partial.category === "body"),
    placeholder: partial.placeholder ?? false,
    ...partial,
  };
}

/** PNG/WebP assets in public/avatar-assets/ — generated by npm run assets:registry */
export const AVATAR_IMPORTED_REGISTRY_ITEMS: AvatarRegistryItem[] = [
${entries.join("\n")}
];
`;

writeFileSync(OUT, file);
console.log(`Wrote ${filtered.length} registry entries (${assets.length - filtered.length} version duplicates skipped) to ${OUT}`);
