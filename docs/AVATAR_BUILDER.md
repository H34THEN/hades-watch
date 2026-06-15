# Avatar Builder

Gaia Online–style layered character identity for Hades Watch operatives.

## Routes

| Route | Purpose |
|-------|---------|
| `/profile/avatar` | Builder + mirror chamber HUD preview |
| `/profile/avatar/bases` | Download official base parts |

Approved users only.

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

## User Custom Parts

Model: `AvatarUserPart` — category, label, path, visibility (`PRIVATE` | `SHARED`).

Storage:

```txt
storage/uploads/avatar-parts/{userId}/
```

Served via `/api/avatar-parts/[partId]`. Private parts: owner + moderators. Shared parts: approved users.

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
