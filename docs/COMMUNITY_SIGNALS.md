# Community Signals

The **Community Signals** layer is the Underwatch commons: forums, builder submissions, volunteer board, guilds, canon lore tiers, reputation, and player recognition.

## Routes

| Route | Purpose |
|---|---|
| `/community` | Community landing hub |
| `/community/builder` | Community Builder submissions |
| `/community/forums` | Forum category index |
| `/community/forums/[categorySlug]` | Category thread list + create thread |
| `/community/threads/[threadSlug]` | Thread detail + comments + reactions |
| `/community/volunteer` | Volunteer / contributor board |
| `/community/guilds` | Approved guild index + request form |
| `/community/guilds/[guildSlug]` | Guild profile + join request |
| `/community/lore` | Canon tier lore submissions |
| `/community/recognition` | Public player recognition board |
| `/admin/community` | Moderator review queues |

## Access

- **Public:** landing pages readable; no posting
- **Logged-in pending:** locked submit/post states
- **Approved users:** submit, thread, comment, volunteer, guild request, lore
- **Moderators+:** review queues, hide/lock content, grant recognition

No email verification required. Approval uses existing `UserAccountStatus`.

## Safety

All user content is plain-text sanitized. No raw HTML, scripts, or uploads in community forums/builder/volunteer/guild forms.

See `COMMUNITY_SAFETY_NOTICE` in `src/lib/community/constants.ts`.

## Seed

```bash
npm run db:seed:community-signals
```

Seeds 12 forum categories and 6 volunteer opportunity placeholders. No fake users or posts.

## Related docs

- [FORUMS.md](./FORUMS.md)
- [GUILDS.md](./GUILDS.md)
- [REPUTATION.md](./REPUTATION.md)
- [CANON_TIERS.md](./CANON_TIERS.md)
- [PLAYER_RECOGNITION.md](./PLAYER_RECOGNITION.md)
- [MMO_HUB_EXPANSION_LORE.md](./MMO_HUB_EXPANSION_LORE.md)

## MMO Hub integration

MMO Hub `/mmo` Community Signals cards link to live community routes (updated from coming-soon stubs).

## Deferred

- Nested forum comment replies UI (schema supports `parentCommentId`)
- Dedicated `/admin/forums` category editor (use seed + DB for now)
- Automatic badge seeding for community badge slugs
- Profile dossier reputation display integration (ReputationPanel on community hub for now)
