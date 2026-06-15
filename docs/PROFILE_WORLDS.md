# Profile Worlds

Full-page operative shrines — MySpace-era personal pages inside the Hades Watch gothic cyberpunk shell.

## Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/profile` | Authenticated | Your full-page Profile World |
| `/profile/edit` | Approved | Edit world fields, uploads, relic HTML/CSS |
| `/profile/avatar` | Approved | Layered avatar builder + mirror chamber HUD |
| `/profile/avatar/bases` | Approved | Download official base parts |
| `/profile/[handle]` | Approved | Public world by character callsign (when `isPublic`) |

Public handle = `Character.callsign` (case-insensitive). Reserved slugs (`edit`, `avatar`, `bases`) are not valid public handles.

## Layout (v2)

Full-width profile world (`max-w-[1600px]`):

- **Desktop:** dossier panels left; dominant **AvatarHudFrame** right (sticky, ~72vh)
- **Mobile:** avatar HUD first, then dossier stack
- Banner, portrait thumbnail, identity header, faction, badges, soundtrack, relic zone

See [PROFILE_WORLD.md](./PROFILE_WORLD.md) for HUD implementation notes.

Previously (v1): narrow header with small avatar — replaced by mirror chamber viewport.

Empty states:

- Relic: *This operative has not opened a custom signal window yet.*
- Avatar: *No avatar body has been assembled in the mirror chamber.*
- Badges: *No badge records have surfaced from the Dead Index yet.*

## Sandboxed Customization

User HTML/CSS is rendered in a sandboxed iframe:

```html
<iframe sandbox="allow-popups allow-popups-to-escape-sandbox"></iframe>
```

- No `allow-scripts`, no `allow-same-origin`
- Never injected into parent React DOM
- Sanitized with `sanitize-html` before save and at preview time

### Limits

| Field | Max |
|-------|-----|
| HTML | 20,000 chars |
| CSS | 20,000 chars |
| RSS feeds | 5 |
| Links | 20 |
| Profile buttons | 20 |

### Allowed HTML (MVP)

`a`, `p`, `br`, `strong`, `em`, `b`, `i`, `u`, `small`, `h1`–`h4`, `ul`, `ol`, `li`, `blockquote`, `img`, `marquee`, `div`, `span`, `hr`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `section`, `article`, `header`, `footer`

Disallowed: `script`, nested `iframe`, `form`, `input`, event handlers, `javascript:` URLs, external CSS imports.

## Uploads

Persistent disk storage (not Git):

```txt
storage/uploads/profiles/portraits/
storage/uploads/profiles/backgrounds/
storage/uploads/profiles/banners/
storage/uploads/profiles/relic-images/
```

Served via `/api/profile-assets/[assetId]` — owner, moderators, or viewers of public profiles.

- Formats: GIF, PNG, JPEG, WebP
- SVG uploads blocked for MVP
- Portrait max 3 MB, background/banner max 5 MB

## Models

- `UserProfileCustomization` — HTML/CSS, RSS, links, buttons, asset IDs, world metadata
- `UserProfileAsset` — uploaded images
- `UserAvatar` — layered avatar selections, pose, custom part IDs
- `AvatarUserPart` — user-uploaded avatar layers (private or shared)

## Security Warning (UI)

*Custom profile code is sandboxed. Scripts are not allowed. Do not paste secrets, tokens, passwords, private keys, recovery codes, addresses, medical records, or private data.*

## Moderation

Moderator+ can disable relic zones via `/admin/social` (existing flow).

## Related

- [PROFILE_WORLD.md](PROFILE_WORLD.md)
- [AVATAR_BUILDER.md](AVATAR_BUILDER.md)
- [SOCIAL_FEATURES.md](SOCIAL_FEATURES.md)
- `src/lib/queries/profile-world.ts`
- `src/components/profile/ProfileWorldView.tsx`
