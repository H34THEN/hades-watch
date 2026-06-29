# Forums // Thread Relay

Expressive old-web forum system under `/community/forums` with identity cards, safe signatures, and quote notifications.

## Routes

| Route | Purpose |
|-------|---------|
| `/community/forums` | Category index |
| `/community/forums/[categorySlug]` | Category threads |
| `/community/threads/[threadSlug]` | Thread + replies |
| `/profile/forum` | Forum identity hub |
| `/profile/forum/edit` | Edit identity + preferences |
| `/profile/forum/button-builder` | 88×31 / 120×40 button builder |
| `/profile/forum/banner-builder` | Larger banner builder |
| `/notifications` | Quote/reply/mention inbox |
| `/admin/forums/identity` | Moderate forum profiles |
| `/admin/forums/signatures` | Moderate signature assets |

## Features

- Forum author cards with square profile image, title, faction flair
- Safe generated Net Neighbor-style buttons/banners (token JSON, trusted React render)
- Optional PNG/JPG/WEBP upload for profile image and signature images
- Direct reply quoting (`Echo Quote`) with `FORUM_QUOTE` notifications
- Direct reply and `@callsign` mention notifications
- Reactions: Signal Boost, Useful, Loreful, Thanks, Needs Care
- Thread flair, pinned, locked, solved markers (schema + display)
- User preferences: hide signatures, notification toggles, reduce motion hooks

## Safety

- No raw HTML/CSS in posts or signatures
- Upload MIME/size validation; no SVG user uploads
- External links use `rel="noopener noreferrer nofollow ugc"`
- Moderators can hide profiles/signatures

## MMO reward hooks (deferred auto-grant)

Badge hooks documented in seed data: `thread-tender`, `signal-reply`, `echo-quoter`, `button-smith`, `old-web-ghost`.

See also: `FORUM_IDENTITY.md`, `FORUM_SIGNATURES.md`, `FORUM_QUOTES_AND_NOTIFICATIONS.md`.
