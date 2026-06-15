# Archive Lore Taxonomy

The Hades Watch archive organizes recovered lore into five in-world sections. Each section maps to a `LoreCategory` enum value on `LoreEntry`.

## Categories

| Route | LoreCategory | In-world framing |
|-------|--------------|------------------|
| `/archive/characters` | `CHARACTER_LORE` | Operative dossiers and Dead Index profiles |
| `/archive/world` | `WORLD_LORE` | Systems, events, regimes, collapses |
| `/archive/factions` | `FACTION_LORE` | Cells, doctrine, leaders, rivalries |
| `/archive/mythos-and-ethos` | `MYTHOS_AND_ETHOS` | Principles, oaths, symbolism, philosophy |
| `/archive/state-of-affairs` | `CURRENT_NEWS_AND_STATE_OF_AFFAIRS` | Underwatch bulletins and live-state lore |

Legacy route `/archive/lore` lists all published entries across categories.

## Schema

`LoreEntry` fields added for taxonomy:

- `category` — optional `LoreCategory` (null for legacy entries)
- `deadIndexId` — e.g. `DI-0000-HEATHEN`
- `loreMetadata` — JSON for aliases, role, archetype, image prompts, etc.

Full dossier content lives in `body` (markdown). Extended profile fields can migrate into `loreMetadata` over time.

## Canonical Sources

| Content | File | Slug(s) |
|---------|------|---------|
| Chthonic Uprising origin | `docs/lore/CHTHONIC_UPRISING_ORIGIN.md` | `the-chthonic-uprising` |
| Leader dossiers | `docs/lore/LEADERS_OF_THE_CHTHONIC_UPRISING.md` | `heathen-the-archivist`, `dr-ione-vey`, `cassian-nyx`, `brontes-vale`, `mara-kallix`, `rhea-spite` |

## Code

- `src/lib/archive/categories.ts` — route ↔ category mapping
- `src/lib/archive/character-lore.ts` — six leader profiles + seed entries
- `src/lib/lore/canonical-lore-seed.ts` — shared idempotent upsert
- `src/lib/lore/auto-unlock.ts` — origin + character leaders auto-unlock for cleared users

## Seeding

```bash
npm run db:seed:lore
```

Production-safe and idempotent by slug. Requires faction seed for `requiredFactionId` on cell leaders.

## Auto-unlock

These slugs are readable without an explicit unlock step when clearance/faction requirements pass:

- `the-chthonic-uprising`
- All six character leader slugs (see `src/lib/archive/character-lore-slugs.ts`)

## VPS Deploy

```bash
cd /opt/hades-watch-next
git pull
npm ci
npm run db:deploy
npm run db:seed:lore
npm run build
systemctl restart hades-watch-next
```

Test URLs:

- https://hadeswatch.com/archive
- https://hadeswatch.com/archive/characters
- https://hadeswatch.com/archive/characters/heathen-the-archivist
