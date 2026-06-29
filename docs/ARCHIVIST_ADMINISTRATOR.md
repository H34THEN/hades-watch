# Archivist Administrator // Action Feed

Owner/Admin unified inbox at `/admin/archivist` (alias `/admin/action-feed`).

## Purpose

Aggregates pending signals from existing admin/moderation systems into one actionable feed:

- Net Neighbor submissions
- Archive items (`PENDING_REVIEW`)
- MMO Dead Drop submissions
- Moderation reports (Open/Reviewing)
- Community builder submissions
- Volunteer responses
- Guild reviews
- Lore submissions
- Avatar Forge access requests
- Faction membership requests

Missing modules are skipped gracefully — the page never crashes on empty sources.

## Permissions

- **Owner / Admin only** for `/admin/archivist`
- Moderators use `/moderation` (linked from feed sidebar)

## Quick actions (MVP)

| Source | Approve | Reject | Revision | Open |
|--------|---------|--------|----------|------|
| Net Neighbor | ✓ | ✓ | — | ✓ |
| Archive item | Publish | Remove | — | ✓ |
| MMO Dead Drop submission | ✓ | ✓ | ✓ | ✓ |
| Community submission | Accept | Reject | ✓ | ✓ |
| Volunteer response | Accept | Decline | — | ✓ |
| Avatar Forge access | ✓ (Owner) | ✓ (Owner) | — | ✓ |
| Moderation report | — | — | — | ✓ |
| Guild / Lore / Faction | — | — | — | ✓ |

All successful quick actions write to the existing audit log (`moderation.action` with `archivistFeed: true` metadata).

## UI

- Full-width `AdminShell` dashboard
- Stats strip + filters
- Feed cards with priority/source chips
- Completion: green toast + glitch/fade card removal (`prefers-reduced-motion` respected)

## Code

- `src/lib/queries/archivist-action-feed.ts` — aggregation
- `src/lib/actions/archivist-feed.ts` — server quick actions
- `src/components/admin/ArchivistActionFeedClient.tsx` — client feed UI

See also [ADMIN_ACTION_FEED.md](./ADMIN_ACTION_FEED.md) and [ADMIN_AUDIT_LOG.md](./ADMIN_AUDIT_LOG.md).
