# Layout System // Page Shell

Hades Watch uses a shared **PageShell** layout system so dashboard pages use desktop width while prose and auth forms stay readable.

## Variants

| Variant | Max width | Use for |
|---------|-----------|---------|
| `narrow` | 720px | Login, register, invite, small forms |
| `standard` | 1040px | Long-form articles, lore detail, help copy |
| `wide` | 1360px | Card libraries, ciphers, missions list |
| `dashboard` | 1680px | MMO hub, forums, admin, profile systems |
| `full` | none | Avatar builder, full workspaces |
| `bleed` | none | Landing sections with edge-to-edge bands |
| `split` | 1680px grid | Main + sidebar (forum threads) |

## CSS variables (`globals.css`)

```css
--hw-page-pad-x: clamp(1rem, 2vw, 2rem);
--hw-page-pad-y: clamp(1rem, 2vw, 2.5rem);
--hw-width-narrow: 720px;
--hw-width-standard: 1040px;
--hw-width-wide: 1360px;
--hw-width-dashboard: 1680px;
```

## Components

- `src/components/layout/PageShell.tsx` — primary wrapper
- `src/components/layout/AdminShell.tsx` — dashboard + scanlines for `/admin/*`
- `Readable` — `hw-readable` (72ch) / `hw-readable-wide` (96ch) helper

## Grid utilities (`globals.css`)

- `.hw-grid-cards` — min 280px cards
- `.hw-grid-library` — min 340px repo/library cards
- `.hw-grid-dashboard` — min 320px dashboard tiles
- `.hw-library-grid` — alias for library card grids
- `.hw-dashboard-grid` — alias for dashboard module grids
- `.hw-split-layout` / `.hw-split-panel` — main + aside (stacks ≤900px)
- `.hw-wide-toolbar` — full-width filter/action bars

## Route Width Audit

| Route | Desired Variant | Updated | Notes |
|---|---|---|---|
| `/archive` | dashboard | yes | hub card grids |
| `/archive/lore` | dashboard | yes | lore library grid |
| `/archive/state-of-affairs` | dashboard | yes | via `ArchiveSignalFeed` |
| `/archive/ghost-in-tech` | dashboard | yes | `GhostInTechLibrary` shell |
| `/archive/ghost-in-tech/[slug]` | split | yes | repo detail + metadata sidebar |
| `/archive/state-of-affairs/[slug]` | split | yes | article detail + sidebar |
| `/dashboard` | dashboard | yes | operative command modules |
| `/dashboard/transmissions` | split | yes | list + console sidebar |
| `/dashboard/events` | dashboard | yes | event card grid |
| `/admin/factions/command` | dashboard | yes | `AdminShell` |

## Parent layouts

No route-group `layout.tsx` files constrain width — only `src/app/layout.tsx` wraps the app shell without max-width. Narrow columns were coming from **page-level and shared component wrappers** (`mx-auto max-w-*`), not parent route layouts.

## Shared shells updated

These module shells now use `--hw-width-dashboard`:

- `CommunityShell` → `community.module.css`
- `MmoHubShell` → `mmo-hub.module.css`
- `ProfilePageShell` → `profile-pages.module.css`
- `GhostInTechLibrary` → already 1680px inner

Site header/footer use `.hw-page-header-band` aligned to dashboard width.

## Text readability

Use `Readable` or `.hw-readable` inside wide dashboards for paragraph copy. Grids, tables, editors, and badge hex grids stay full inner width.

## Mobile

- Split layouts stack at 900px
- Padding via `clamp()` — no edge-to-edge crush on small screens
- `min-width: 0` on grid children prevents overflow

## Pages migrated (manual + shared shells)

**PageShell / AdminShell (pass 2 — child routes):**
- `/archive`, `/archive/lore`
- `/archive/state-of-affairs`, `/archive/ghost-in-tech/[slug]` (via `ArchiveSignalFeed` / `ArchiveSignalItemDetail`)
- `/dashboard`, `/dashboard/transmissions`, `/dashboard/events`
- `/admin/factions/command`

**PageShell / AdminShell (pass 1):**
- `/admin`, `/admin/community`, `/admin/users`
- `/login`, `/register`, `/invite`
- `/ciphers`, `/notifications`, `/chat`
- `/mmo/rooms`, `/mmo/rooms/[roomSlug]`, `/mmo/dead-drops`, `/mmo/dead-drops/[dropSlug]`
- `/mmo/field-log`, `/mmo/factions`, `/mmo/missions`, `/mmo/factions/[slug]/floor`
- `/community/threads/[threadSlug]` (split layout + sidebar)
- `/profile/world` (error state)

**Shared module shells (no page file change required):**
- `/mmo`, `/community/*`, `/profile/badges`, `/profile/relic-zone`, `/profile/dossier`, `/profile/avatar`
- `/archive/ghost-in-tech` (library grid)

## Deferred cleanup

- Remaining `/admin/*` routes still on `mx-auto max-w-*` — migrate to `AdminShell`
- Auth pages: `forgot-password`, `reset-password`, `verify-email`
- Moderation, profile forum builder pages
- `LoreDetailView` — article detail pages use `standard` width for long prose (intentional)
- `FactionDetailClient` may retain internal width constraints
- Avatar builder already uses full width wrapper
