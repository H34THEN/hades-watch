# Social Features — Old-Web Layer

Hades Watch social features reference early-2000s personal web culture: AIM chat rooms, net neighbor banner walls, and MySpace-style profile customization — all within the gothic cyberpunk Underwatch aesthetic.

## Routes

| Feature | Route | Access |
|---------|-------|--------|
| Chat Rooms | `/chat`, `/chat/[roomSlug]` | Approved users only |
| Net Neighbors | `/net-neighbors` | Approved users (submissions); approved banners visible to approved users |
| Profile Relic Zone | `/profile` (edit in operative settings) | Approved users edit own; display on own dossier |
| Social Admin | `/admin/social` | Moderator+ |

Navigation group: **SOCIAL** in `src/lib/navigation/config.ts`.

---

## Feature 1: AIM-Style Chat Rooms

### Behavior

- Five seeded rooms (max 5 for MVP): Underwatch Lobby, Dead Index, Signal Noise, Faction Floor, Afterhours
- Plain text messages only — no files, no DMs, no public/unauthenticated access
- Polling refresh (~4s) — no WebSockets in MVP
- Users choose a chat alias (sessionStorage) or generate a themed random alias
- Default alias: character callsign → display name → random themed handle

### Privacy wording (required)

**Label:** `HTTPS-protected temporary chat. No secrets. No archives.`

**Full warning:** Messages are protected in transit by HTTPS/TLS only. This is **not** end-to-end encrypted (E2EE). Messages may be stored temporarily in PostgreSQL until expiration. Do not post passwords, private keys, addresses, medical records, or sensitive personal data.

### Retention

- `ChatMessage.expiresAt` — default **24 hours** from post time
- Queries filter `expiresAt > now()` and `deletedAt IS NULL`
- Expired rows removed on fetch (`purgeExpiredChatMessages`) and via `npm run db:cleanup:chat`
- Encryption-at-rest for message bodies: **not implemented** — document as future work if needed

### Moderation

- Users can delete own messages
- Moderator+ can delete any message or clear a room (soft-delete via `deletedAt`)
- Rate limit: 30 messages / minute per user

### Models

- `ChatRoom`, `ChatMessage` — see `prisma/schema.prisma`
- Seed: `npm run db:seed:chat`

---

## Feature 2: Net Neighbors

### Purpose

Old-web banner directory: users submit favorite sites with 88×31-style banners (GIF/PNG/JPG/WebP).

**Copy:** *Net Neighbors are the small doors in the Underwatch wall. Follow at your own risk. Bring back anything beautiful, useful, strange, or kind.*

### Submission flow

1. Approved user submits title, URL, description, tags, note, **banner upload** (required for MVP)
2. Status: `PENDING` → moderator approves/rejects/hides at `/admin/social`
3. Approved banners shown on `/net-neighbors` to approved users

### Security

- URLs: `http`/`https` only; validated server-side
- Outbound links: `rel="noopener noreferrer"`, `target="_blank"`
- No inline HTML in titles/descriptions — plain text only
- Banners stored on disk, not in Git

### Storage

```txt
storage/uploads/net-neighbors/banners/
```

Served via `/api/net-neighbors/banners/[id]` (approved users; moderators can preview pending).

### Model

- `NetNeighbor` with `NetNeighborStatus` enum — see `prisma/schema.prisma`

---

## Feature 3: Profile Relic Zone (MySpace-style)

### Behavior

Approved users customize a **sandboxed iframe** section on their dossier:

- Custom HTML (sanitized subset)
- Custom CSS (scoped inside iframe only)
- Up to 3 RSS feed URLs (server-fetched summaries — no raw feed HTML)
- GIFs/images via safe `img` src (http/https)

### Sandbox rules

- Rendered via `<iframe sandbox="allow-popups allow-popups-to-escape-sandbox">` — **no `allow-scripts`**, no `allow-same-origin`
- User HTML never injected into parent React DOM
- Sanitizer: `sanitize-html` (`src/lib/profile-customization/sanitize.ts`)
- Disallowed: `<script>`, event handlers, `javascript:` URLs, nested iframes, forms, external CSS imports
- Limits: HTML 10k chars, CSS 10k chars

**Warning:** *Custom profile code is sandboxed. Scripts are not allowed. Do not paste secrets, tokens, passwords, or private data.*

### Moderation

- Moderator+ can disable a user's relic zone (`isEnabled = false`) from `/admin/social`

### Model

- `UserProfileCustomization` — see `prisma/schema.prisma`

---

## Permissions Summary

| Role | Chat | Net Neighbors submit | Profile relic |
|------|------|---------------------|---------------|
| Unauthenticated | ✗ | ✗ | ✗ |
| Pending | ✗ | ✗ | ✗ |
| Approved | ✓ | ✓ | ✓ (own) |
| Moderator+ | ✓ + mod tools | ✓ + review | ✓ + disable others |

Email verification is **not** used as a gate.

---

## VPS Setup

After deploy:

```bash
npm run db:deploy
npm run db:seed:chat
mkdir -p /opt/hades-watch-next/storage/uploads/net-neighbors/banners
```

Periodic chat cleanup (cron optional):

```bash
npm run db:cleanup:chat
```

---

## Related Files

```txt
src/lib/actions/chat.ts
src/lib/actions/net-neighbors.ts
src/lib/actions/profile-customization.ts
src/lib/chat/
src/lib/net-neighbors/
src/lib/profile-customization/
src/app/chat/
src/app/net-neighbors/
src/app/admin/social/
prisma/scripts/seed-chat-rooms.ts
prisma/scripts/cleanup-chat-messages.ts
```
