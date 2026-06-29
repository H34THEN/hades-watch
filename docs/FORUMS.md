# Forums // Thread Relay

Reddit-style forum system under `/community/forums`.

## Behavior

- 12 seeded categories (Underwatch Lobby, Cipher Help, etc.)
- Thread create (approved users)
- Flat comments (MVP)
- Reactions: Signal Boost, Useful, Loreful, Needs Care, Thanks
- Sort: active, newest, top
- Moderator hide/lock via server actions
- Report via existing moderation report system (`targetType`: `forum_thread`, `forum_comment`)

## Sanitization

Bodies stored as plain text. Display via `formatCommunityBody()` — escaped with safe linkify.

## Badge hooks

- `first-thread`, `signal-reply`, `thread-tender`, `forum-steward`
