# Avatar Builder

Gaia Online–style layered character identity for Hades Watch operatives.

## Route

`/profile/avatar` — approved users only.

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

Preview uses absolutely positioned `<img>` layers in React — no server-side compositing in MVP.

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

`UserAvatar` in `prisma/schema.prisma` — one record per user.

## Actions

- `saveAvatarAction` — persist selections
- `resetAvatarAction` — restore defaults

## Future Work

- Server-side flatten avatar to single PNG
- Pose variants
- Faction flair layers tied to membership
- Export/share card image
