# Profile Dossier — Identity & Media Layer

The `/profile` route is the signed-in user's **operative dossier**: an in-universe character sheet / classified identity record.

Public user profile pages are **not** implemented in this phase. Only the authenticated user sees their own dossier.

---

## Spotify Playlist Embed

- Users paste a **public Spotify playlist URL** on `/profile`
- Server validates via `parseSpotifyPlaylistUrl()` in `src/lib/spotify.ts`
- Stored fields on `User`: `spotifyPlaylistId`, `spotifyPlaylistUrl`, `spotifyEmbedUrl`
- Rendered as Spotify Embed iframe (`https://open.spotify.com/embed/playlist/{id}`)
- **No Spotify OAuth** or Web Playback SDK in this phase
- Raw iframe HTML, javascript URLs, and non-playlist Spotify links are rejected

### CSP

`next.config.ts` includes:

```txt
frame-src 'self' https://open.spotify.com
```

Do not duplicate CSP in Nginx.

---

## Dossier Identity (Titles & Badges)

- **Active title** — user-selectable from earned titles (`User.activeTitle`)
- **Badges** — computed at read time from role, clearance, faction, missions, ciphers, lore
- **Titles** — computed from role, mission completion, cipher solves, faction approval, lore unlocks
- No separate `Badge` / `UserBadge` tables in MVP — extensible via `src/lib/dossier.ts`

---

## Faction & Clearance

- Faction from approved `FactionMembership` or `Character.faction`
- Clearance derived from highest role (`getClearanceForRoles`)
- Pending faction requests shown as status note

Clearance labels:

| Level | Label |
|-------|-------|
| 0 | Clearance 0 — Ghost |
| 1 | Clearance 1 — Witness |
| 2 | Clearance 2 — Initiate |
| 3 | Clearance 3 — Operative |
| 4 | Clearance 4 — Archivist |
| 5 | Clearance 5 — Oracle |

---

## Invite Lineage

Model: `InviteRedemption` links user → invite used at registration.

Privacy rules:

- Entry invite codes shown **redacted** (`OWNER-BOOTSTRAP-••••`)
- Owner/Admin viewing own dossier may see fuller codes for their created invites
- **Active** invite codes are never exposed on profile
- Moderation notes and audit logs are not shown

Lineage display:

- Entry code (redacted), role granted, redeemed date, invited-by (if `InviteCode.createdBy` set)
- Count of invites created by user
- Admin/Owner: list of own created invites with usage/revoked status

Pre-lineage accounts (registered before this migration) show "Entry vector not recorded."

---

## Operational History

Sourced from existing models:

| Stat | Model |
|------|-------|
| Missions | `MissionParticipation` + `Quest` |
| Ciphers | `CipherSolve` + `CipherPuzzle` |
| Lore unlocks | `UserLoreUnlock` |

Dead drop **access** is not tracked per-user in schema — not shown in history.

---

## Server Actions

| Action | File |
|--------|------|
| `updateSpotifyPlaylistAction` | `src/lib/actions/profile.ts` |
| `updateActiveTitleAction` | `src/lib/actions/profile.ts` |
| Registration lineage | `src/lib/actions/auth.ts` creates `InviteRedemption` |

---

## Future Work

- Spotify OAuth / Web Playback SDK
- Public dossier pages (`/dossier/[callsign]`)
- Persistent badge/title award tables
- Dead drop access tracking
