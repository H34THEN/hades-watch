# Admin Action Feed

Technical reference for the Archivist action feed aggregation layer.

## Feed item shape

Defined in `src/lib/admin/archivist-action-feed.ts`:

- `sourceType` + `sourceId` — stable identity for quick actions
- `actions[]` — only actions safe to perform from the feed
- `targetUrl` — deep link to full review UI

## Server actions

`executeArchivistQuickAction(sourceType, sourceId, action, note?)` in `src/lib/actions/archivist-feed.ts`:

1. Requires Owner/Admin
2. Delegates to existing review actions (no duplicate business logic)
3. Writes audit log
4. Revalidates `/admin/archivist`

Stale/conflict errors return `{ stale: true }` and trigger client refresh.

## Deferred quick actions

- Guild approve/reject from feed (open community admin only)
- Lore submission tier decisions from feed
- Faction membership approve from feed
- Media track moderation from feed (no pending media queue model yet)
- Reward grant from feed (use `/admin/rewards`)
