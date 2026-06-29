# Forum Identity

Forum identity is a compact relay mask separate from Profile World and Character Dossier.

## Fields

- Display name (defaults to callsign)
- Square forum image (upload, avatar, faction icon, or generated glyph)
- Status line, selected title, faction/guild flair
- Signature text + active button/banner
- Style preset and hover effect tokens
- Toggles: badges, reputation, Profile World link

## Page copy

- Title: `FORUM IDENTITY // THREAD RELAY MASK`
- Subtitle: Choose how your operative appears in the Underwatch thread relay.

## Storage

- Profile images: `storage/uploads/forum-profile-images/`
- Served via `/api/forums/profile-images/[userId]`

## Moderation

`ForumProfile.moderationStatus` can be set to `HIDDEN` by moderators via `/admin/forums/identity`.
