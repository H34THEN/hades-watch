# Hades Watch Avatar Asset Directory

This document defines where **official avatar builder assets** live in the repo and where future art should be saved.

## Root

All static avatar layers served to the browser:

```txt
public/avatar-assets/
```

Source art may arrive in `src/components/avatar/avatar assets/` during import — run `npm run assets:migrate` to copy into `public/avatar-assets/` without deleting sources until verified.

## Directory Tree

```txt
public/avatar-assets/
├── bodies/           # Full-body bases (species × presentation)
├── species/          # Species-specific SVG/PNG feature sheets
├── eyes/
├── ears/
├── face/
├── hair/
├── emotions/
├── poses/
├── hands/
├── horns/
├── wings/
├── tails/
├── markings/
├── accessories/      # Pins, cuffs, pendants, scarves, visors
├── tops/
├── pants/
├── skirts/
├── shoes/
├── socks/
├── gloves/
├── outerwear/        # Coats, jackets, cloaks, mantles
├── back-items/       # Satchels, packs worn on back
├── backgrounds/
├── fictional-props/  # Cosmetic relics (non-weapon language)
├── tech-gear/        # Terminals, scanners, signal devices
├── faction-flair/    # Small faction marks (not full outfits)
├── effects/
└── placeholders/     # Missing-layer SVG, temp art
```

Badge art is separate: `public/badge-assets/`

## Where to Save Future Assets

| You generated… | Save to… | Registry category |
|---|---|---|
| New full body base | `public/avatar-assets/bodies/` | `body` |
| New horns / species horns | `public/avatar-assets/horns/` | `horns` |
| New ears | `public/avatar-assets/ears/` | `ears` |
| New tail | `public/avatar-assets/tails/` | `tails` |
| New wings | `public/avatar-assets/wings/` | `wings` |
| New hair layer | `public/avatar-assets/hair/` | `hair` |
| New eyes | `public/avatar-assets/eyes/` | `eyes` |
| New emotion overlay | `public/avatar-assets/emotions/` | `emotion` |
| New shirt/top | `public/avatar-assets/tops/` | `tops` |
| New pants | `public/avatar-assets/pants/` | `pants` |
| New skirt | `public/avatar-assets/skirts/` | `skirts` |
| New socks/stockings | `public/avatar-assets/socks/` | `socks` |
| New boots/shoes | `public/avatar-assets/shoes/` | `shoes` |
| New gloves/gauntlets | `public/avatar-assets/gloves/` | `gloves` |
| New jacket/coat/cloak | `public/avatar-assets/outerwear/` | `outerwear` |
| New faction jacket | `public/avatar-assets/outerwear/` + faction metadata | `outerwear` |
| New necklace/pin/cuff | `public/avatar-assets/accessories/` | `accessories` |
| New back satchel/pack | `public/avatar-assets/back-items/` | `back-items` |
| New background scene | `public/avatar-assets/backgrounds/` | `backgrounds` |
| New cosmetic relic device | `public/avatar-assets/fictional-props/` or `tech-gear/` | `fictional-props` / `tech-gear` |
| New small faction patch | `public/avatar-assets/faction-flair/` | `faction-flair` |
| New aura/glitch overlay | `public/avatar-assets/effects/` | `effects` |
| Unsure / WIP | `public/avatar-assets/placeholders/` | `placeholders` |

## Naming Conventions

- **lowercase kebab-case**: `asclepian-veil-masculine-top.png`
- No spaces; hyphens only
- Preserve meaningful tokens (`tiefling`, `oracular-circuit`)
- Version collisions: `-v02`, `-v03`
- Prefer **transparent PNG** for modular layers
- Backgrounds may be JPG/WebP/PNG

## Layer Order

See [AVATAR_PROMPT_REFERENCE.md](./AVATAR_PROMPT_REFERENCE.md#recommended-layer-order).

Registry `layerOrder` values are set in `src/lib/avatar/avatar-imported-registry.ts`.

## Registry Update Instructions

1. Save PNG to the correct `public/avatar-assets/<category>/` folder.
2. Run:

```bash
npm run assets:registry
```

3. This regenerates `src/lib/avatar/avatar-imported-registry.ts` from public PNG/WebP files.
4. Verify in `/profile/avatar` that the item appears in the matching tab.
5. Downloadable bases appear in `/profile/avatar/bases` when `downloadableBase: true`.

Manual SVG placeholders remain in `src/lib/avatar/avatar-registry.ts`.

## What NOT to Put in Each Folder

| Folder | Do not put |
|---|---|
| `bodies/` | Clothing, hair, props, backgrounds |
| `tops/` | Pants, shoes, full body |
| `accessories/` | Full outfits (use clothing folders) |
| `fictional-props/` | Real weapons, tactical gear |
| `backgrounds/` | Character layers |
| `placeholders/` | Production-ready official art (move when finalized) |

## User Upload Paths (private/shared)

User-uploaded parts are **not** stored under `public/avatar-assets/`. They use:

- Database: `AvatarUserPart`
- API: `/api/avatar-parts/[partId]`

## Avatar Forge GPT

Generating art with the private Avatar Forge GPT does **not** change save locations — export still goes to `public/avatar-assets/` per this map.

Access flow: [AVATAR_FORGE_GPT_ACCESS.md](./AVATAR_FORGE_GPT_ACCESS.md)

## Migration

Asset copy report: [AVATAR_ASSET_MIGRATION_REPORT.md](./AVATAR_ASSET_MIGRATION_REPORT.md)

Migrate command:

```bash
npm run assets:migrate
```

## Allowed File Types

- PNG (preferred for layers)
- WebP
- JPG/JPEG (backgrounds)
- SVG (official placeholders only in repo)

Do not commit scripts, HTML, or executable content in asset folders.
