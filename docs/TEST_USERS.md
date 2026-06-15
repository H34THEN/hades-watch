# Test Users

**WARNING:** These accounts exist only for development and QA. Remove them before production or the real beta invite wave.

```bash
npm run db:cleanup-test-users
```

All test user passwords: **`password`**

Test users are identified by:

- Email ending with `@operative.hadeswatch.local`
- Name starting with `Test `
- `isTestAccount = true` on the User record

## Prerequisites

```bash
npm run db:seed:factions
npm run db:seed:test-users
```

## Site-Level Role Test Users

| Name | Email | Site Role | Password |
|------|-------|-----------|----------|
| Test Archivist Owner | test-owner@operative.hadeswatch.local | Owner | password |
| Test Admin | test-admin@operative.hadeswatch.local | Admin | password |
| Test Moderator | test-moderator@operative.hadeswatch.local | Moderator | password |
| Test Expert | test-expert@operative.hadeswatch.local | Expert | password |
| Test Operative | test-operative@operative.hadeswatch.local | Operative | password |
| Test Recruit | test-recruit@operative.hadeswatch.local | Recruit | password |

## Faction Position Test Users

30 accounts — one per faction × position. All use site role **Operative**, password **password**.

Email pattern:

```txt
test-{faction-slug}-{position-slug}@operative.hadeswatch.local
```

Position slugs: `initiate`, `member`, `specialist`, `cell-lead`, `lieutenant`, `leader`

### Examples

| Email | Faction | Position |
|-------|---------|----------|
| test-asclepian-veil-initiate@operative.hadeswatch.local | Asclepian Veil | Initiate (Veil Initiate) |
| test-oracular-circuit-specialist@operative.hadeswatch.local | Oracular Circuit | Specialist (Cipher Adept) |
| test-myrmidon-grinders-cell-lead@operative.hadeswatch.local | Myrmidon Grinders | Cell Lead (Gatebreaker) |
| test-daedalus-foundry-lieutenant@operative.hadeswatch.local | Daedalus Foundry | Lieutenant (Forge Architect) |
| test-styx-rats-leader@operative.hadeswatch.local | Styx Rats | Leader (Ferryman of Static) |

Full list is printed when `npm run db:seed:test-users` completes.

## Test URLs

- https://hadeswatch.com/mmo/factions
- https://hadeswatch.com/mmo/factions/asclepian-veil
- https://hadeswatch.com/admin/users
- https://hadeswatch.com/profile

## Cleanup

```bash
npm run db:cleanup-test-users
```

This script only deletes users matching the criteria above. Real production users are not targeted.
