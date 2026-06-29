# Text MMO Expanded Play — Implementation Notes

Canonical gameplay source: [TEXT_MMO_EXPANDED_PLAY_FUNCTIONS.md](./TEXT_MMO_EXPANDED_PLAY_FUNCTIONS.md) (do not overwrite except typo fixes).

## Models Added

- `MmoPlayFunction` — 15 expanded play systems
- `MmoPlayablePrompt` — daily signals, faction calls, assignments, quests, hunts, etc.
- `MmoPlayableSubmission` — user completions (reuses `MmoDropSubmissionStatus`, `MmoFieldLogVisibility`)
- `MmoPublicWorksTask` — public works board tasks
- `MmoRelicSet` — cosmetic relic collection sets
- `MmoRoomStateDefinition` — room state progression definitions
- `MmoVisitor` — traveling visitor prompts
- `MmoSeasonalEvent` — seasonal event metadata

`RewardSourceType.play_prompt` added for expanded play reward mappings (existing `RewardMapping` model reused).

## Seed Script

```bash
npm run db:seed:text-mmo-expanded
```

Idempotent seed: `prisma/scripts/seed-text-mmo-expanded-play.ts`  
Data: `src/lib/mmo/expanded-play-seed-data.ts`  
Included in `npm run db:seed` via `seed-all.ts`.

## Routes

### Phase 1 (implemented)

| Route | Status |
| --- | --- |
| `/mmo/play` | Hub — all 15 play function cards |
| `/mmo/daily-signals` | Daily signals + highlighted signal + completion |
| `/mmo/faction-calls` | Weekly faction calls |
| `/mmo/factions/[slug]/calls` | Per-faction calls |
| `/mmo/assignments` | Assignment list |
| `/mmo/assignments/[assignmentSlug]` | Detail + submission |
| `/community/forums/quests` | Forum quest cards |
| `/archive/hunts` | Archive hunt cards |
| `/community/public-works` | Task board + filters |
| `/community/public-works/[taskSlug]` | Task detail + submission |

### Phase 2/3 (scaffolded — seeded content, relay pending where noted)

Guild projects, profile challenges, signal broadcasts, micro-missions, relics, visitors, events, guides, mentors.

## Systems Fully Implemented (MVP)

- Prisma models + migration
- Idempotent seed (15 functions, all prompt categories, public works, relics, room states, visitors, events, reward mappings)
- Play hub and Phase 1 pages with dashboard layout
- Read-only / auto-complete prompts (mark complete, field logs, small rep grants)
- Review-required submissions → `PENDING` status (not auto-published)
- Public works task submission flow
- Archivist feed integration for pending play submissions
- MMO hub link + hub module card

## Deferred

- Full reward automation (badges, avatar unlocks, titles from mappings)
- Quote-reply forum quest wiring (“Echo relay pending”)
- Guild project progress tracking
- Relic fragment earning/assembly
- Room state automatic progression (definitions seeded; admin override later)
- Faction leader draft/publish UI
- Signal Player media playback for broadcasts
- Visitor interaction beyond seeded cards
- Micro-mission player creation workflow

## Safety Policy

All gameplay remains fictional, legal, nonviolent, privacy-aware. Avatar rewards use **Fictional Props & Tech Gear** — no weapons category. No fake users or activity seeded.

## Layout

Pages use `PageShell variant="dashboard"` and responsive card grids (`expanded-play.module.css`).

## Next Steps

1. Wire reward grants from `RewardMapping` on approved submissions
2. Connect forum quote-reply to `forum-quest-quote-signal`
3. Faction leader read-only scaffolds with admin publish gate
4. Room state display on `/mmo/rooms/[roomSlug]`
5. Production: migrate, seed, build, restart
