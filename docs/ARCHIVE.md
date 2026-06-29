# Archive

The Archive is the underworld index for signals, tools, lore, and records the Surface Order would rather bury.

## Sections

### Signal Feeds (discussion + external links)

| Route | Purpose |
|-------|---------|
| `/archive/state-of-affairs` | Public-interest surface signals — privacy, civil liberties, surveillance, digital rights |
| `/archive/state-of-affairs/submit` | File a new article/link (approved users) |
| `/archive/state-of-affairs/[slug]` | Signal thread + comments |
| `/archive/ghost-in-tech` | GitHub/Codeberg repo reliquary — full-width card library |
| `/archive/ghost-in-tech/submit` | Submit a repo (approved users) |
| `/archive/ghost-in-tech/[slug]` | Repo discussion thread |

### Classified Lore (`LoreEntry`)

| Route | Category |
|-------|----------|
| `/archive/characters` | Character Lore |
| `/archive/world` | World Lore |
| `/archive/factions` | Faction Lore |
| `/archive/mythos-and-ethos` | Mythos and Ethos |
| `/archive/lore` | Full lore index (all categories) |

## Models

- `ArchiveItem` — articles (`ARTICLE`) and repos (`CODE_REPO`)
- `ArchiveComment` — discussion threads on archive items
- `LoreEntry` — existing classified lore dossiers (unchanged)

## Permissions

| Action | Who |
|--------|-----|
| View feeds | Authenticated users |
| Submit links/repos | `accountStatus === Approved` |
| Comment | Approved users |
| Moderate items/comments | Owner, Admin, Moderator |

Uses `accountStatus`, not `emailVerified`. Pending users are blocked by middleware before reaching archive routes.

## Seeding

```bash
npm run db:seed:archive   # three EFF State of Affairs starter links (idempotent)
npm run db:seed:lore      # classified lore dossiers
```

## VPS deploy order

```bash
cd /opt/hades-watch-next
git pull
npm ci --include=dev
npm run db:generate
npm run db:deploy
npm run db:seed:factions
npm run db:seed:archive
npm run build
systemctl restart hades-watch-next
```

`tsx` is in `dependencies` so seeds work without `--include=dev`, but `--include=dev` is recommended for Prisma CLI and build tooling.

## Moderation

`/admin/archive` — list items, set status (`PUBLISHED`, `HIDDEN`, `REMOVED`, `PENDING_REVIEW`), open source URLs.

Comment hide/unhide actions exist in `setArchiveCommentHiddenAction` (inline on detail pages can be expanded later).

## Known limitations

- No nested comment replies in UI (schema supports `parentId`)
- No full-text search on tags yet
- No automatic metadata scraping from URLs
- Ghost in Tech: full-width repo card library — see `docs/GHOST_IN_TECH.md`
