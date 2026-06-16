# Avatar Builder

Gaia Online–style layered character identity for Hades Watch operatives.

## Routes

| Route | Purpose |
|-------|---------|
| `/profile/avatar` | Builder + mirror chamber HUD preview |
| `/profile/avatar/bases` | Download official base parts |

Approved users only.

**Layout:** The builder page structure is preserved — left mirror HUD preview (`lg:grid-cols-[320px_1fr]`), scrollable tabs on the right. New categories are added as tabs/sections, not a page redesign.

## Callsign / Public Profile

Public URLs use `Character.callsign` (unique, lowercase):

```txt
/profile/slewfoot
```

Edit callsign and public visibility on `/profile/edit`. Reserved slugs are blocked.

## Gender / Presentation

Avatar presentation only — does not need to match real-world identity:

`female` · `male` · `nonbinary` · `androgynous` · `custom`

Stored on `UserAvatar.genderPresentation`.

## Species (MVP)

| Slug | Name |
|------|------|
| `tiefling` | Tiefling |
| `nymph` | Nymph |
| `gorgon` | Gorgon |
| `automaton` | Automaton |
| `wraithborn` | Wraithborn |

## Layer Stack Order

1. Background
2. Body base
3. Skin tone overlay
4. Eyes
5. Species features (horns, leaves, snakes, paneling, aura)
6. Hair
7. Outfit
8. Accessories
9. User custom part overlays (per category)

Preview uses `AvatarLayeredPreview` inside `AvatarHudFrame` — no server-side compositing in MVP.

## Poses

Pose slugs on `UserAvatar.poseSlug`. MVP uses CSS transforms until per-pose art ships:

| Slug | Label |
|------|-------|
| `pose-neutral` | Neutral Stance |
| `pose-crossed` | Crossed Arms |
| `pose-ready` | Ready Stance |
| `pose-seated` | Seated Terminal |
| `pose-caster` | Signal Caster |

Add pose layer art later under `public/avatar-assets/poses/` and extend `AVATAR_POSES` in `avatar-assets.ts`.

## Emotions

Separate from pose. Stored on `UserAvatar.emotionSlug`. Placeholders in `public/avatar-assets/emotions/`.

## Registry

Central registry: `src/lib/avatar/avatar-registry.ts` (categories, items, transforms, compatibility).

Legacy re-exports: `src/lib/avatar/avatar-assets.ts`.

### Categories

Body, Gender, Species, Skin Color, Face, Eyes, Ears, Hair, Emotion, Pose, Hands, Horns, Wings, Tails, Markings, Accessories, Tops, Pants, Skirts, Shoes, Socks, Outerwear, Back Items, Backgrounds, Fictional Props & Tech Gear, Tech Gear, Faction Flair, Effects, Uploads, Base Library.

### Layer transforms

Movable items store normalized transforms in `UserAvatar.selectedItems`:

```json
{ "x": 0.5, "y": 0.5, "scale": 1, "rotation": 0 }
```

## Official Base Downloads

Users download creator-provided bases from `/profile/avatar/bases` or per-part links in the builder.

Registry: `AVATAR_OFFICIAL_DOWNLOADS` in `src/lib/avatar/avatar-assets.ts`. Each option may set `downloadPath` (defaults to `imagePath`).

### Where to place official art

```txt
public/avatar-assets/bodies/          # species base bodies
public/avatar-assets/species/         # horns, leaves, snakes, etc.
public/avatar-assets/eyes/
public/avatar-assets/hair/
public/avatar-assets/outfits/
public/avatar-assets/accessories/
public/avatar-assets/backgrounds/
public/avatar-assets/poses/           # future pose layers
public/avatar-assets/hud/             # optional HUD image overlays
public/avatar-assets/placeholders/
```

PNG assets from `src/components/avatar/avatar assets/` can be migrated into these folders with:

```bash
npm run assets:migrate
```

Imported PNG registry entries live in `src/lib/avatar/avatar-imported-registry.ts` and merge into `AVATAR_REGISTRY_ITEMS` in `avatar-registry.ts`.

Mission and cipher badge PNGs belong under `public/badge-assets/missions/` and `public/badge-assets/ciphers/`.

## User Custom Parts

Model: `AvatarUserPart` — category, label, path, visibility (`PRIVATE` | `SHARED`).

Storage:

```txt
storage/uploads/avatar-parts/private/{userId}/
storage/uploads/avatar-parts/shared/{userId}/
storage/uploads/avatar-backgrounds/
```

Visibility: `PRIVATE`, `SHARED_PENDING` (awaiting review), `SHARED_APPROVED` (community usable).

Equipped parts stored on `UserAvatar.customPartIds` as JSON `{ "OUTFIT": "partId", ... }`.

Upload in builder **Uploads** tab (`AvatarPartUploader`). Formats: GIF, PNG, JPEG, WebP (max 5 MB). SVG blocked.

## Asset Registry

All options are defined in:

```txt
src/lib/avatar/avatar-assets.ts
```

Heathen can add or swap art without hunting through UI code.

## Placeholder Art Paths

Static placeholders live under:

```txt
public/avatar-assets/bodies/
public/avatar-assets/species/
public/avatar-assets/eyes/
public/avatar-assets/hair/
public/avatar-assets/outfits/
public/avatar-assets/accessories/
public/avatar-assets/backgrounds/
public/avatar-assets/placeholders/
```

Regenerate placeholders:

```bash
npx tsx scripts/generate-avatar-placeholders.ts
```

## How to Replace Avatar Art

1. Create a transparent PNG at **1024×1024** (character layers) or **1024×1024 / 1600×900** (backgrounds).
2. Save into the correct `public/avatar-assets/<category>/` subfolder.
3. Keep the same filename to replace an existing placeholder, **or** add a new slug entry in `src/lib/avatar/avatar-assets.ts`.
4. Rebuild and deploy.

Example:

```txt
public/avatar-assets/species/tiefling-horns-a.png
```

replaces the SVG placeholder at the same path if you switch the registry `imagePath` extension.

## Custom Background Upload

Users may upload a custom avatar background (GIF/PNG/JPEG/WebP, max 5 MB). Stored at:

```txt
storage/uploads/profiles/backgrounds/
```

Referenced via `UserAvatar.customBackgroundAssetId`.

## Character Lore Fields (optional)

- Avatar display name
- Tagline
- Bio
- Pronouns
- Motto
- Favorite signal

No real-world identity required.

## How Heathen Adds New Official Avatar Art

1. Create a transparent PNG at **1024×1024** (or SVG placeholder via `scripts/generate-avatar-placeholders.ts`).
2. Save into the correct `public/avatar-assets/<category>/` folder.
3. Add an entry to `src/lib/avatar/avatar-registry.ts` (`AVATAR_REGISTRY_ITEMS`).
4. Set `layerOrder` and `defaultTransform`.
5. Set `downloadableBase: true` if users may download it.
6. Rebuild and deploy.

## Model

- `UserAvatar` — selections, `poseSlug`, `customPartIds`, lore fields
- `AvatarUserPart` — user-uploaded layers

## Actions

- `saveAvatarAction` — persist selections, pose, custom parts
- `resetAvatarAction` — restore defaults
- `uploadAvatarPartAction` — upload private/shared custom part
- `deleteAvatarPartAction` — remove owned part

## HUD Components

```txt
src/components/avatar/AvatarHudFrame.tsx
src/components/avatar/AvatarLayeredPreview.tsx
src/components/avatar/AvatarAssetDownloadCard.tsx
src/components/avatar/AvatarPartUploader.tsx
src/components/avatar/avatar-hud.module.css
```

## Future Work

- Server-side flatten avatar to single PNG
- Per-pose layer art (not just CSS transform)
- Faction flair layers tied to membership
- Export/share card image
- Moderation queue for shared parts
