import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const dirs: Record<string, string[]> = {
  "public/avatar-assets/bodies": [
    "body-base-a",
    "body-base-b",
    "body-female-a",
    "body-male-a",
    "body-nonbinary-a",
  ],
  "public/avatar-assets/species": [
    "tiefling-horns-a",
    "nymph-leaves-a",
    "gorgon-snakes-a",
    "automaton-paneling-a",
    "wraithborn-aura-a",
  ],
  "public/avatar-assets/eyes": ["eyes-cyan", "eyes-gold", "eyes-pink"],
  "public/avatar-assets/ears": ["ears-pointed-a"],
  "public/avatar-assets/hair": ["hair-short-black", "hair-long-white"],
  "public/avatar-assets/emotions": [
    "emotion-neutral",
    "emotion-smirk",
    "emotion-focused",
    "emotion-haunted",
    "emotion-angry",
    "emotion-soft",
    "emotion-glitch",
  ],
  "public/avatar-assets/hands": ["hands-neutral-a"],
  "public/avatar-assets/wings": ["wings-a"],
  "public/avatar-assets/tails": ["tail-a"],
  "public/avatar-assets/markings": ["marking-a"],
  "public/avatar-assets/outfits": ["outfit-initiate-coat"],
  "public/avatar-assets/tops": ["top-initiate-a"],
  "public/avatar-assets/pants": ["pants-underwatch-a"],
  "public/avatar-assets/skirts": ["skirt-veil-a"],
  "public/avatar-assets/shoes": ["shoes-boots-a"],
  "public/avatar-assets/socks": ["socks-stripe-a"],
  "public/avatar-assets/accessories": ["accessory-pomegranate-pin"],
  "public/avatar-assets/back-items": ["back-item-pack-a"],
  "public/avatar-assets/fictional-props": ["prop-relic-blade-a"],
  "public/avatar-assets/tech-gear": ["tech-gear-terminal-a"],
  "public/avatar-assets/faction-flair": ["faction-flair-uprising-a"],
  "public/avatar-assets/effects": ["effect-glitch-a"],
  "public/avatar-assets/backgrounds": ["bg-underwatch-default"],
  "public/avatar-assets/placeholders": ["missing-layer"],
};

function svg(label: string, bg = "#111820", fg = "#38f8a8") {
  const text = label.replace(/-/g, " ").toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="${bg}" opacity="0.35"/><text x="512" y="512" text-anchor="middle" dominant-baseline="middle" font-family="monospace" font-size="42" fill="${fg}">${text}</text></svg>`;
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
