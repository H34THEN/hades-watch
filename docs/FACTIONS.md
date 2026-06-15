# Chthonic Uprising Factions

Canonical faction lore for Hades Watch lives in `FactionsLoreBuilder.md` at the repo root. This document describes the database model, seed workflow, and role separation.

## Parent Alliance

**The Chthonic Uprising** (`chthonic-uprising`) is the parent underworld resistance alliance.

- **Leader:** The Archivist
- **Site role mapping:** Owner (founder / keeper of the Dead Index)
- **Motto:** *What the surface buries, the underworld remembers.*

The Archivist is not a normal faction leader — they coordinate the whole movement.

## Five Baseline Cells

| Faction | Slug | Leader |
|---------|------|--------|
| The Asclepian Veil | `asclepian-veil` | Dr. Ione Vey |
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

- `/mmo/factions` — alliance overview + cell grid
- `/mmo/factions/{slug}` — full cell dossier (lore, ranks, badges, missions)
- `/mmo/factions/chthonic-uprising` — alliance detail

## Source Data

Canonical seed definitions: `src/lib/factions/chthonic-data.ts`
