import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const dirs: Record<string, string[]> = {
  "public/avatar-assets/bodies": ["body-base-a", "body-base-b"],
  "public/avatar-assets/species": [
    "tiefling-horns-a",
    "nymph-leaves-a",
    "gorgon-snakes-a",
    "automaton-paneling-a",
    "wraithborn-aura-a",
  ],
  "public/avatar-assets/eyes": ["eyes-cyan", "eyes-gold", "eyes-pink"],
  "public/avatar-assets/hair": ["hair-short-black", "hair-long-white"],
  "public/avatar-assets/outfits": ["outfit-initiate-coat"],
  "public/avatar-assets/accessories": ["accessory-pomegranate-pin"],
  "public/avatar-assets/backgrounds": ["bg-underwatch-default"],
  "public/avatar-assets/placeholders": ["missing-layer"],
};

function svg(label: string, bg = "#111820", fg = "#38f8a8") {
  const text = label.replace(/-/g, " ").toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="${bg}" opacity="0.35"/><text x="512" y="512" text-anchor="middle" dominant-baseline="middle" font-family="monospace" font-size="48" fill="${fg}">${text}</text></svg>`;
}

async function main() {
  for (const [dir, files] of Object.entries(dirs)) {
    await mkdir(dir, { recursive: true });
    for (const file of files) {
      await writeFile(join(dir, `${file}.svg`), svg(file));
    }
  }
  console.log("Avatar placeholder SVGs created.");
}

main();
