# Text MMO Implementation Notes

Implementation of the first five playable Underwatch loops per [TEXT_MMO_PLAYABLE_LOOPS.md](TEXT_MMO_PLAYABLE_LOOPS.md).

## Routes implemented

| Route | Purpose |
|-------|---------|
| `/mmo/rooms` | Room map — lists five core rooms |
| `/mmo/rooms/[roomSlug]` | Room detail — entry text, actions, drops, field logs |
| `/mmo/dead-drops` | Dead Drop cache listing |
| `/mmo/dead-drops/[dropSlug]` | Drop detail + submission UI |
| `/mmo/field-log` | Public/approved-users activity stream |
| `/mmo/factions/[slug]/floor` | Phase-2 placeholder linking to dossier |
| `/admin/mmo-submissions` | Moderator review for review-required drops |

MMO Hub (`/mmo`) links via new **Underwatch Text MMO** section in `hub-modules.ts`.

## Models added

Prisma models prefixed `Mmo*` to avoid collision with phase-4 `DeadDrop`:

- `MmoRoom`, `MmoRoomAction`
- `MmoDeadDrop`, `MmoDeadDropSubmission`
- `MmoFieldLog`
- `MmoLoot`, `MmoLootGrant`
- `MmoLoreUnlock`, `MmoLoreUnlockGrant`

`ReputationCategory` extended with `FACTION` and `RECOGNITION`.

Existing `Badge` / `UserBadge` and `ReputationEvent` are reused for rewards.

## Seed script

- `prisma/scripts/seed-text-mmo-loops.ts`
- `npm run db:seed:text-mmo`
- Included in `db:seed` / `seed-all.ts` (production-safe, idempotent upserts by slug)
- Data source: `src/lib/mmo/text-mmo-seed-data.ts` (derived from canonical MD)
- Cipher answers hashed at seed time; plaintext never stored

## Reward hooks implemented

- Field Log creation (safe messages only — no submission body in public logs)
- Reputation via `recordReputationEvent` with daily cap on room READ_SIGNAL actions
- Badge grants via existing `Badge` / `UserBadge`
- Loot grants via `MmoLootGrant` (unique per user/loot)
- Lore unlock grants via `MmoLoreUnlockGrant`
- Duplicate one-time drop prevention via submission status checks

## Reward hooks deferred

- Cooldown UI on room actions (server-side daily cap only for reputation)
- Weekly/rotating drop expiry windows (`startsAt` / `expiresAt` not enforced in UI yet)
- Avatar-item / profile-cosmetic loot display in profile (grants stored; display TBD)
- Faction floor dedicated gameplay (placeholder route only)
- JOIN_DISCUSSION → forum thread deep links (shows route actions where seeded)

## Moderation behavior

- Review-required drop types submit as `PENDING`; no auto-publish
- Moderators approve / reject / request revision at `/admin/mmo-submissions`
- Approved submissions trigger reward grants once
- Field Logs for pending submissions use generic safe copy (no body text)

## Safety rules

- Plain-text sanitization; no raw HTML from users
- URL validation: http/https only
- External links use `rel="noopener noreferrer nofollow ugc"`
- No combat, weapons, harmful hacking, doxxing, or credential collection
- Dead Drop submissions require approved operative status

## Access rules

- `/mmo/rooms`, room pages, field log: logged-in
- Dead Drop submissions: approved user
- Admin review: Moderator / Admin / Owner
- No email verification required

## Known limitations

- Async page-based loop only (no real-time multiplayer)
- POST_FIELD_NOTE and similar write actions route to Dead Drops or external systems where seeded
- Phase-4 `/dead-drops` (roleplay) remains separate from `/mmo/dead-drops` (text MMO)

## Next steps

- Faction floor room gameplay per cell
- Field log filters and per-user private log view
- Loot/cosmetic display in profile and relic zone
- Rotating drop scheduler and expiry enforcement
- Deeper cipher integration from Oracular Relay room actions
