# Chthonic Command

Owner/Admin faction oversight console for The Chthonic Uprising.

## Route

```txt
/admin/factions/command
```

## Access

| Role | Access |
|------|--------|
| Owner | Full Overlord powers — assign, reputation, primary faction, remove |
| Admin | Read-only overview + links to user registry |
| Moderator | Denied |
| Others | Denied |

## Owner / Archivist Lore

The **Owner** site role maps to **The Archivist** in faction lore. Operationally known as Heathen, the Archivist is framed as:

- Hades-Blood Regent
- Keeper of the Dead Index
- Sovereign of the Underwatch
- Warden of the Five Cells
- Chthonic Overlord

This is a command/custodianship layer — not a replacement for the Owner role enum.

## Capabilities

### Overview
All five cells + alliance health: members, pending, reputation, badges, missions, seed status.

### Membership Monitor
Approved members by faction with position, reputation, primary flag.

Owner actions:
- Set primary faction
- Adjust reputation (+10 quick action)
- Remove membership

### Unaffiliated Queue
Approved users without faction — Owner can assign faction + position.

### Pending Requests
Links to `/admin/faction-requests`.

## Public Faction Access

| Route | Purpose |
|-------|---------|
| `/mmo/factions` | Alliance hero + five cell grid |
| `/mmo/factions/chthonic-uprising` | Parent alliance dossier |
| `/mmo/factions/{slug}` | Cell dossier |

Navigation: main header **Factions**, dashboard **Enter the Chthonic Uprising**, MMO hub **Faction Dossiers**.

## Canonical Fallback

If `npm run db:seed:factions` has not run, pages render from `src/lib/factions/chthonic-data.ts` instead of 404.

Admin/command views show a seed warning. Run:

```bash
npm run db:seed:factions
```

## Test Users

```bash
npm run db:seed:test-users
```

Owner test account: `test-owner@operative.hadeswatch.local` / `password`

Cleanup before production:

```bash
npm run db:cleanup-test-users
```

See [TEST_USERS.md](TEST_USERS.md).

## Troubleshooting 404s

1. Confirm route files exist under `src/app/mmo/factions/`
2. User must be logged in (middleware protects `/mmo/*`)
3. Run `npm run db:seed:factions` for live membership/assignment
4. Canonical slugs always resolve even without seed
