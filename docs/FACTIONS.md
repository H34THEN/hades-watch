# Chthonic Uprising Factions

Canonical faction lore for Hades Watch lives in:

- `FactionsLoreBuilder.md` (repo root, builder reference)
- **`docs/lore/CHTHONIC_UPRISING_ORIGIN.md`** (canonical alliance origin dossier)

Archive entry: `/archive/lore/the-chthonic-uprising` (seeded from the origin dossier).

## Parent Alliance

**The Chthonic Uprising** (`chthonic-uprising`) is the parent underworld resistance alliance.

- **Coordinator:** Heathen, also known as **The Archivist** and **Slewfoot**
- **Site role mapping:** Owner (keeper of the Dead Index, not a surface king)
- **Motto:** *What the surface buries, the underworld remembers.*
- **Alt motto:** *No ghost goes uncounted. No god goes unwatched.*

Heathen is not a flawless chosen-one ruler. The Uprising was built collectively by the five founding cells. See the [origin dossier](lore/CHTHONIC_UPRISING_ORIGIN.md) for Dead Index testimony.

## The Dead Index

The Dead Index is the underworld memory spine of the Uprising: erased names, suppressed uprisings, broken algorithms, blacksite contracts, and testimonies the Surface Order tried to bury. Heathen began it as backups; the cells taught it consent, threat modeling, and exits. Full origin in `docs/lore/CHTHONIC_UPRISING_ORIGIN.md` §7.

## Five Baseline Cells

| Faction | Slug | Leader |
|---------|------|--------|
| The Asclepian Veil | `asclepian-veil` | Circe Runic |
| The Oracular Circuit | `oracular-circuit` | Cassian Nyx |
| The Myrmidon Grinders | `myrmidon-grinders` | Brontes Vale |
| The Daedalus Foundry | `daedalus-foundry` | Mara Kallix |
| The Styx Rats | `styx-rats` | Rhea Spite |

Each cell has full lore metadata: tagline, values, palette, badges, titles, missions, tensions, synergies, and theme unlock concepts.

## Site Roles vs Faction Positions

These layers are **separate**:

### Site-level roles (access control)

| Role | Purpose |
|------|---------|
| Owner | Full authority — The Archivist |
| Admin | User/invite/faction management |
| Moderator | Moderation queues and safety |
| Expert | Trusted lore/mission contributor |
| Operative | Approved standard user |
| Recruit | Limited / pending recruit access |
| Member / Gamer / Guest | Legacy / game-layer roles |

### Faction positions (rank within a cell)

Shared enum `FactionPosition`:

- `INITIATE`
- `MEMBER`
- `SPECIALIST`
- `CELL_LEAD`
- `LIEUTENANT`
- `LEADER`

Each faction maps positions to flavored display titles (e.g. Asclepian Veil Initiate → **Veil Initiate**). Stored on `FactionMembership.displayTitle`.

## Schema

- `Faction` — lore fields, alliance parent, palette JSON, badges/titles JSON
- `FactionMembership` — `position`, `displayTitle`, `reputation`, `isPrimary`
- `Badge` / `UserBadge` — awardable faction badges

## Seeding

```bash
# Safe canonical data (roles, dev content) — no test users
npm run db:seed

# Chthonic Uprising alliance + five cells + badges
npm run db:seed:factions

# Canonical lore (including origin dossier) — safe for production
npm run db:seed:lore

# Dev/test accounts only — run explicitly
npm run db:seed:test-users

# Remove all test users before production/beta
npm run db:cleanup-test-users
```

`db:seed` does **not** create test users automatically.

## Admin Assignment

`/admin/users` supports assigning:

- Site-level role
- Account status (Pending / Approved / Rejected)
- Faction membership
- Faction position

## Public Pages

- `/mmo/factions` — alliance overview + five cell grid (canonical fallback if unseeded)
- `/mmo/factions/{slug}` — full cell dossier
- `/mmo/factions/chthonic-uprising` — alliance detail

Navigation: header **Factions**, dashboard **Enter the Chthonic Uprising**, profile link when unaffiliated.

## Chthonic Command (Owner/Admin)

- `/admin/factions/command` — Overlord oversight console
- Owner: full assignment/reputation powers
- Admin: read-only overview
- See [CHTHONIC_COMMAND.md](CHTHONIC_COMMAND.md)

## The Archivist / Owner Lore

The **Owner** role maps to **Heathen** (The Archivist, Slewfoot): Keeper of the Dead Index, Warden of the Five Cells. Custodianship over memory and access — not divine right or surface kingship. Full testimony: `docs/lore/CHTHONIC_UPRISING_ORIGIN.md`.

## Troubleshooting 404s

Faction pages use `src/lib/factions/resolve.ts` to fall back to canonical data when DB seed has not run. If you still see 404:

1. Ensure you are logged in (`/mmo/*` requires auth)
2. Run `npm run db:deploy` then `npm run db:seed:factions`
3. Verify slug matches canonical list in this doc

## Source Data

Canonical seed definitions: `src/lib/factions/chthonic-data.ts`

Origin dossier excerpts for UI: `src/lib/factions/origin-dossier.ts`

Full alliance origin prose: `docs/lore/CHTHONIC_UPRISING_ORIGIN.md`
