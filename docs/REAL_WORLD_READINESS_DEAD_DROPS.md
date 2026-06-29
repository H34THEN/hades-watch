# Real-World Readiness Dead Drops

Safe, lawful, nonviolent **field care** Dead Drops seeded under `loopSlug: field-care-cache`.

## Seed

```bash
npm run db:seed:dead-drops:real-world
```

Included in `npm run db:seed` / `db:seed:all`.

## Safety policy

- Framed as **community care kit**, **readiness item**, **public safety supply**, or **Fictional Props & Tech Gear**
- No weapons, evasion, surveillance, confrontation, or targeting language
- No required uploads of private data for sensitive items
- Honor-check / read-only drops use `no_submission_read_only`
- Public resource and accessibility reflections may require admin review

## Routes

- `/dead-drops` — Field Care Cache library
- `/dead-drops/[slug]` — drop detail + safe submission
- `/mmo/dead-drops` — full Text MMO micro-quest cache (includes other loops)

## Starter drops (12)

See `src/lib/dead-drops/field-care-seed-data.ts` for slugs including `ice-watch-whistle-signal` and `black-clinic-pocket-first-aid`.
