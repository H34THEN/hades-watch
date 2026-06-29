# Upload Safety // Forum Assets

## Allowed

- MIME: `image/png`, `image/jpeg`, `image/webp`
- Max size: 2 MB per forum profile or signature image
- Stored under `storage/uploads/` (not in git)

## Rejected

- SVG uploads from users
- Remote hotlinked profile images (MVP)
- GIF animation (not enabled for forum uploads in MVP)
- Files with disallowed extensions or MIME mismatch

## Validation

`src/lib/forums/storage.ts` — `validateForumImageUpload`, `saveForumProfileImage`, `saveForumSignatureImage`

## Serving

- `/api/forums/profile-images/[userId]`
- `/api/forums/signatures/[assetId]`

Hidden assets return 404 unless owner or moderator.

## User warning (shown in editor)

Do not upload private documents, screenshots with personal data, copied art, hate symbols, or images meant to impersonate staff/system messages.
