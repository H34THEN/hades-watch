# Hades Watch Avatar Prompt Reference

## Purpose

This reference helps Hades Watch users and contributors generate **compatible avatar parts** for the modular avatar builder at `/profile/avatar`.

The builder stacks transparent PNG (or SVG placeholder) layers: body, species features, clothing, accessories, props, and backgrounds. Prompts in `docs/avatarPrompts/` preserve pose alignment, transparency, and Gaia-inspired Hades Watch styling.

**Avatar Forge GPT:** Approved operatives can request access to the private Avatar Forge GPT at `/profile/avatar/forge`. The invite link is server-side only until Owner approval and unlock-code verification succeed.

---

## Avatar Builder Technical Rules

- Use square **1024×1024** canvas unless a prompt specifies otherwise.
- Use **transparent background** whenever possible; if not, use plain neutral gray.
- Keep the avatar **centered** with comfortable margins.
- **Full body visible** for base/body assets (head to feet).
- Preserve the **approved base pose** when making overlays.
- **Do not** rotate, mirror, straighten, or reinterpret the body pose for overlay assets.
- Clothing layers must align to the **same body angle and canvas placement**.
- **Do not** include the body in final clothing overlay exports unless generating a preview composite.
- When generating a **single clothing layer**, exclude skin, face, hair, hands, pants, shoes, props, and background.
- Avoid dramatic perspective, action poses, cropped limbs, heavy shadows.
- Avoid text, watermarks, signatures, random logos.
- Avoid oversexualized or scrawny doll anatomy.
- Use clean silhouettes and readable **Gaia-inspired** avatar styling.
- UI language: **Fictional Props & Tech Gear** — not weapons.

---

## Universal Style Clause

Use this language in prompts when not already included:

```txt
Hades Watch cyberpunk gothic avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, practical modular game-ready asset design, technomythic underworld aesthetic.
```

---

## Universal Technical Clause

```txt
1024x1024 square canvas, transparent background (or flat neutral gray if transparency unavailable). Centered composition. Full-body visibility for bases. Relaxed natural 3/4 pose with body turned slightly toward viewer, arms relaxed, hands visible, feet visible, no extreme perspective, no action pose. Layer-ready output with clean edges for modular stacking.
```

---

## Universal Negative Prompt

```txt
changed pose, new stance, straightened stance, front-facing clothing, mirrored clothing, wrong facing direction, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, extreme perspective, action pose, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, gore, violence, weapons, real logos, malware symbols, readable private data, AI artifacting, fused fingers, distorted hands, unusable layer edges.
```

---

## Base Body Prompts

**Use for:** Full-body species bases with neutral underlayer only.

**Best output:** Transparent PNG (or neutral gray), full body, no hair/clothing/shoes/props.

See species-complete prompts in:

- `docs/HADES_WATCH_NANO_BANANA_2_AVATAR_PROMPT_SYSTEM.md` — Tiefling, Nymph, Gorgon, Automaton, Wraithborn base bodies

### Example — Tiefling Base (abbreviated)

**Use for:** Tiefling full-body base layer.

**Best output:** Transparent PNG, 1024×1024, modular underlayer.

**Prompt:**

```txt
Create a full-body Hades Watch avatar base for a Tiefling character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no extreme perspective, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

The character is a Tiefling humanoid with natural balanced proportions, soft athletic tone, believable torso and hips, natural limb thickness, and relaxed grounded posture. Use a relaxed natural 3/4 pose with the body turned slightly toward the viewer, head gently facing forward, arms relaxed and slightly away from the torso, hands visible, one leg relaxed slightly forward, feet visible, no action pose. The body should wear only a simple neutral fitted avatar underlayer or bodysuit for layer compatibility.

Tiefling features: curved horns, pointed ears, subtle ember-like underworld markings on skin, optional faint infernal glow, charcoal and smoky plum undertones, restrained antique gold accents in the markings only. Do not add hair, clothing, shoes, jewelry, large props, wings, or background scenery. The base must be clean and ready for modular avatar layering.
```

**Negative Prompt:** See Universal Negative Prompt plus species-specific lines in the Nano Banana doc.

**Notes:** Download official bases from `/profile/avatar/bases` before generating overlays.

---

## Clothing Layer Prompts

**Use for:** Tops, pants, skirts, socks, shoes, gloves, outerwear — one layer per export.

**Best output:** Transparent PNG aligned to approved masculine/feminine/nb base pose.

**Critical overlay rule:**

```txt
Use the approved base body image as the exact placement reference. First fit the garment onto the approved base body's exact pose and screen-facing direction. Then output only the transparent clothing layer in the same canvas position. Do not include the body, skin, face, hair, hands, pants, shoes, props, or background unless generating a preview composite.
```

**Faction outfit sets (full copy-paste prompts):**

| Set | File |
|---|---|
| Oracular Circuit | `docs/avatarPrompts/ORACULAR_CIRCUIT_OUTFIT_PROMPTS.md` |
| Asclepian Veil | `docs/avatarPrompts/ASCLEPIAN_VEIL_OUTFIT_PROMPTS.md` |
| Chthonic Uprising Leadership | `docs/avatarPrompts/CHTHONIC_UPRISING_LEADERSHIP_OUTFIT_PROMPTS.md` |
| Daedalus Foundry | `docs/avatarPrompts/DAEDALUS_FOUNDRY_OUTFIT_PROMPTS.md` |
| Myrmidon Grinders | `docs/avatarPrompts/MYRMIDON_GRINDERS_OUTFIT_PROMPTS.md` |
| Styx Rats | `docs/avatarPrompts/STYX_RATS_OUTFIT_PROMPTS.md` |

---

## Species Feature Prompts

**Use for:** Horns, ears, tails, wings, markings — separate layer sheets or individual PNGs.

**Best output:** Transparent PNG, spaced features or single feature aligned to 3/4 pose.

See `docs/HADES_WATCH_NANO_BANANA_2_AVATAR_PROMPT_SYSTEM.md` § Species Prompt Guide for complete species asset prompts.

---

## Hair Prompts

**Use for:** Hair-back and hair-front layers.

**Best output:** Transparent PNG; no face/body/clothing.

See Nano Banana doc § Hair Layer Prompts.

---

## Face, Eyes, and Emotion Prompts

**Use for:** Eye overlays, expression/emotion layers.

**Best output:** Transparent PNG aligned to base head angle.

See Nano Banana doc § Face and Emotion sections.

---

## Accessories Prompts

**Use for:** Pins, cuffs, pendants, visors, satchels, scarves — cosmetic only.

**Best output:** Transparent PNG; align to base pose; accessories at 3/4 angle when worn on body.

Faction outfit files include accessory prompts (e.g. Oracular Circuit visor, gloves, satchel).

Safe unlock accessory spread: `docs/avatarPrompts/HADES_WATCH_SAFE_TECH_GEAR_ACCESSORY_UNLOCK_PROMPTS.md`

---

## Fictional Props & Tech Gear Prompts

**Use for:** Relic tablets, signal devices, archive tools — **cosmetic**, non-functional.

**Best output:** Transparent PNG; optional hand-offset transform in registry.

See Nano Banana doc § Fictional Props & Tech Gear. Use UI label **Fictional Props & Tech Gear**, not weapons.

---

## Faction Flair Prompts

**Use for:** Small faction marks, pins, patches that are not full clothing.

**Save to:** `public/avatar-assets/faction-flair/` with faction metadata in registry.

If an item is clearly a jacket or top, use clothing folders instead.

---

## Background Prompts

**Use for:** Profile/avatar chamber backgrounds.

**Best output:** PNG/JPG/WebP; full canvas; not required transparent.

See Nano Banana doc § Background Prompts.

---

## Badge / Icon Prompt Notes

Mission and cipher badge art prompts: `docs/HADES_WATCH_MISSION_BADGE_PROMPTS.md`

Badge assets live under `public/badge-assets/` — not avatar layer folders.

---

## Prompt Editing Guide for Users

1. Pick the **correct base** (species + presentation) and keep it as the locked template for overlays.
2. Copy the prompt block for the layer type you need.
3. Do not remove **CRITICAL POSE PRESERVATION** clauses from outfit prompts.
4. If output includes the body, re-run with stronger “output only the [layer] layer” language.
5. Export PNG; verify transparency in an image editor.
6. Name and file per [AVATAR_ASSET_DIRECTORY.md](./AVATAR_ASSET_DIRECTORY.md).

---

## Asset Naming Rules

- Lowercase **kebab-case**: `oracular-circuit-masculine-shirt.png`
- Spaces → hyphens; underscores → hyphens
- Preserve meaningful tokens (`c1ph3r`, species names)
- Do not overwrite existing files; append `-v02`, `-v03` if needed
- Match registry `slug` to filename stem

---

## Asset Directory Map

See [AVATAR_ASSET_DIRECTORY.md](./AVATAR_ASSET_DIRECTORY.md) for the full tree.

Quick map:

| Layer type | Folder |
|---|---|
| Bodies | `public/avatar-assets/bodies/` |
| Tops | `public/avatar-assets/tops/` |
| Pants | `public/avatar-assets/pants/` |
| Outerwear | `public/avatar-assets/outerwear/` |
| Shoes | `public/avatar-assets/shoes/` |
| Gloves | `public/avatar-assets/gloves/` |
| Accessories | `public/avatar-assets/accessories/` |
| Back items | `public/avatar-assets/back-items/` |
| Horns / species | `public/avatar-assets/horns/` or `species/` |
| Backgrounds | `public/avatar-assets/backgrounds/` |
| Fictional props | `public/avatar-assets/fictional-props/` |
| Tech gear | `public/avatar-assets/tech-gear/` |

After adding PNGs: `npm run assets:registry` (maintainers).

---

## Avatar Forge GPT Access

1. Approved user visits `/profile/avatar/forge`
2. Clicks **Request Avatar Forge Access**
3. Owner reviews at `/admin/avatar-forge-access`
4. Owner approves and generates an **unlock code** (shown once to Owner)
5. User enters code → server returns GPT URL **only after verification**

The link is **not** in public docs, client bundles, or page HTML before unlock. Once revealed, an approved user can copy it — protection is pre-reveal gating.

Details: [AVATAR_FORGE_GPT_ACCESS.md](./AVATAR_FORGE_GPT_ACCESS.md)

---

## Quality Control Checklist

- [ ] 1024×1024 canvas
- [ ] Transparent PNG (or documented neutral BG for bases)
- [ ] Correct pose alignment vs approved base
- [ ] Single layer only (no embedded body in clothing export)
- [ ] No text/watermark/logo
- [ ] Readable at avatar preview scale
- [ ] Correct folder + kebab-case filename
- [ ] Registry updated (`npm run assets:registry`)
- [ ] Tested in `/profile/avatar` preview

---

## Source Prompt Files

| File | Description |
|---|---|
| `docs/avatarPrompts/ORACULAR_CIRCUIT_OUTFIT_PROMPTS.md` | Oracular Circuit 9-piece outfit spread |
| `docs/avatarPrompts/ASCLEPIAN_VEIL_OUTFIT_PROMPTS.md` | Asclepian Veil clinic layers |
| `docs/avatarPrompts/CHTHONIC_UPRISING_LEADERSHIP_OUTFIT_PROMPTS.md` | Chthonic leadership outfit spread |
| `docs/avatarPrompts/DAEDALUS_FOUNDRY_OUTFIT_PROMPTS.md` | Foundry worker outfit spread |
| `docs/avatarPrompts/MYRMIDON_GRINDERS_OUTFIT_PROMPTS.md` | Gatewatch outfit spread |
| `docs/avatarPrompts/STYX_RATS_OUTFIT_PROMPTS.md` | Styx Rats outfit spread |
| `docs/avatarPrompts/HADES_WATCH_SAFE_TECH_GEAR_ACCESSORY_UNLOCK_PROMPTS.md` | 10 safe tech accessory unlocks |
| `docs/HADES_WATCH_NANO_BANANA_2_AVATAR_PROMPT_SYSTEM.md` | Master species/base/layer architecture |

---

## Recommended Layer Order

| Band | Category | Order |
|---|---|---|
| Backgrounds | `backgrounds` | 0–10 |
| Effects (behind) | `effects` | 50 |
| Tails | `tails` | 100 |
| Wings / back | `wings`, `back-items` | 120–130 |
| Body | `body` | 200 |
| Markings | `markings` | 215 |
| Eyes / face | `eyes`, `face` | 220 |
| Ears | `ears` | 225 |
| Horns | `horns` | 230 |
| Hair | `hair` | 240 |
| Emotion | `emotion` | 250 |
| Tops | `tops` | 300 |
| Pants / skirts | `pants`, `skirts` | 310–315 |
| Socks / shoes / gloves | `socks`, `shoes`, `gloves` | 320–340 |
| Outerwear | `outerwear` | 360 |
| Accessories | `accessories` | 400 |
| Fictional props / tech | `fictional-props`, `tech-gear` | 450–460 |
| Faction flair | `faction-flair` | 500 |
| Effects (front) | `effects` | 600+ |

Registry entries in `src/lib/avatar/avatar-imported-registry.ts` use these bands.
