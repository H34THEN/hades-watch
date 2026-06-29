# Admin Audit Log

Hades Watch uses `writeAuditLog()` in `src/lib/audit.ts` with persisted `AuditLog` rows.

## Archivist feed actions

Quick actions from `/admin/archivist` log as:

- `action: moderation.action`
- `metadata.archivistFeed: true`
- `metadata.action` — quick action id (`approve`, `reject`, etc.)
- `targetType` / `targetId` — source record

Specialized actions still log their native audit types when delegated (e.g. `net_neighbor.review`, `archive.item.status`, `mmo.dead_drop.review`).

## Viewing logs

- `/admin/audit` — full audit console (Owner/Admin)

No separate `AdminActionLog` model — reuse existing audit infrastructure.
