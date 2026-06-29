# Dead Drops

Hades Watch has two Dead Drop surfaces:

## Field Care Cache (`/dead-drops`)

Safe real-world-adjacent readiness prompts seeded as `MmoDeadDrop` records with `loopSlug: field-care-cache`.

See [REAL_WORLD_READINESS_DEAD_DROPS.md](./REAL_WORLD_READINESS_DEAD_DROPS.md).

## Text MMO Micro-Quest Cache (`/mmo/dead-drops`)

Playable Underwatch micro-quests tied to rooms and loops. Seeded via `npm run db:seed:text-mmo`.

## Legacy roleplay drops

The older `DeadDrop` model (codename/locationHint/message) remains for clearance-gated roleplay drops managed at `/admin/dead-drops`. The public `/dead-drops` route now uses Field Care Cache.
