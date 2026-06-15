# Net Neighbors

Old-web banner exchange inside the Hades Watch Underwatch — 88×31 signal buttons, moderated submissions, and a full-page cyberpunk HUD wall.

## Concept

Net Neighbors are the small doors in the Underwatch wall. Follow at your own risk. Bring back anything beautiful, useful, strange, or kind.

## Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/net-neighbors` | Public | Approved signal wall (HUD layout) |
| `/net-neighbors/submit` | Approved operatives | Submit a neighbor link/banner |
| `/net-neighbors/thank-you` | Public | Submission confirmation + 5s return to wall |
| `/admin/net-neighbors` | Moderator+ | Review, approve, reject, hide, reorder |
| `/support` | Public | Donation relay placeholder (footer link) |

## Submission Flow

1. Approved user opens `/net-neighbors/submit`
2. Uploads banner or forges HUD button (88×31 default)
3. On success → redirect to `/net-neighbors/thank-you` (5s auto-return to wall)
4. Row created as `PENDING`; moderator approves at `/admin/net-neighbors`

## Banner Sizes

Default **88×31** old-web mini button. Also: 120×40, 180×60, 234×60.

Public wall renders compact linked banners via `NetNeighborButton` — not large cards.

## Banner Builder

`bannerStyle` JSON (version 1) stores background, gradient preset, text, font, border, fancy details, and optional icon path.

Builder previews **actual size** and **3× zoomed** preview on submit page.

## Moderation Statuses

| Status | Public wall | Notes |
|--------|-------------|-------|
| `PENDING` | Hidden | Submitter sees own pending list when logged in |
| `APPROVED` | Visible | Ordered by `sortOrder ASC`, then `createdAt DESC` |
| `REJECTED` | Hidden | `reviewNote` stored |
| `HIDDEN` | Hidden | Soft-hide without delete |

## Banner Builder

Original 88×31-style HUD button forge (not copied from external tools).

- Presets: Dead Index Violet, Styx Neon Rat, Asclepian Green, etc.
- Sizes: 88×31, 120×40, 180×60
- Settings stored as JSON in `NetNeighbor.bannerStyle`
- Rendered as safe CSS `<div>` — no user HTML, no scripts

## Storage

Uploaded banners:

```txt
storage/uploads/net-neighbors/banners/
```

Served via `/api/net-neighbors/banners/[id]` — **approved banners are public** (no auth).

Gitignored — do not commit user uploads.

## Security

- URL validation: http/https only
- No user HTML in submissions
- No SVG uploads (MVP)
- `rel="noopener noreferrer"` on outbound links
- Admin/moderator-only review and reorder
- Server actions return errors (no redirect throws)

## Profile Relic Boundary

Profile customization remains **iframe relic zone only** on `/profile/edit`. Users cannot edit the full profile page layout, nav, or global CSS. See [PROFILE_WORLD.md](PROFILE_WORLD.md).

## Seeds

```bash
npm run db:seed:net-neighbors
```

Included in `npm run db:seed` / `db:release`.

## Deployment

```bash
mkdir -p storage/uploads/net-neighbors/banners
npm run db:deploy
npm run db:seed:net-neighbors  # optional canonical placeholder
```
