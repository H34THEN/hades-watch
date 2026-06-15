# Hades Watch Architecture

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS variables |
| UI | shadcn/ui |
| ORM | Prisma 7 + PostgreSQL (`@prisma/adapter-pg`) |
| Auth | Auth.js / NextAuth v5 (credentials, JWT sessions) |
| Validation | Zod |
| Meetings | Jitsi Meet links (public instance, no self-host) |

## Directory Layout

```txt
src/
  app/
    dashboard/                 # Operative hub
    dashboard/transmissions/   # User-facing broadcasts
    dashboard/events/          # Upcoming events summary
    events/                    # Full event calendar
    mmo/                       # Text MMO hub, character, factions, missions
    archive/                   # Lore archive
    dead-drops/                # Fictional dead drops (roleplay)
    ciphers/                   # Cipher puzzles (roleplay)
    moderation/                # Moderation console
    admin/                     # Admin console + subpages
    profile/                   # Operative dossier (signed-in user)
  components/
    profile/                   # Dossier sections, Spotify form, badges
    moderation/                # Report actions, nav
    mmo/                       # Character form, MMO nav
    archive/                   # Locked cards, unlock button
    admin/                     # Admin CRUD panels
  lib/
    actions/moderation.ts      # Reports, notes, assignment
    actions/mmo.ts             # Character, factions, quests
    actions/lore.ts            # Lore listing, unlock, admin CRUD
    actions/phase4.ts          # Dead drops, ciphers, admin users
    auth/guards.ts             # requireModeratorUser, requireAdminUser
    clearance.ts               # Role clearance + roleplay disclaimer
    dossier.ts                 # Titles, badges, clearance, invite redaction
    spotify.ts                 # Playlist URL validation
    queries/dossier.ts         # Profile dossier data loader
    jitsi.ts                   # Room name / URL generation
```

## Profile Dossier (Phase 7)

- Route: `/profile` — signed-in user's operative dossier
- Spotify embed (iframe), titles/badges, faction/clearance, invite lineage, mission/cipher history
- Models: `User` Spotify fields, `InviteRedemption`
- See [PROFILE_DOSSIER.md](PROFILE_DOSSIER.md)

## Beta Access & Out-of-Band Verification (Phase 8)

- No email required for beta registration (codename + optional email)
- `User.accountStatus`: Pending → Approved via admin or verification match
- `InviteVerificationRequirement` — hashed expected fingerprint on invite
- `UserVerificationClaim` — registration verification result (preview only)
- See [BETA_ACCESS_MODEL.md](BETA_ACCESS_MODEL.md)

## Navigation (Phase 10)

- `src/lib/navigation/config.ts` — grouped nav sections with permission gates
- `src/components/navigation/SiteHeader.tsx` — compact header, mobile drawer, desktop dropdowns
- Mobile: upper-right menu trigger; logout in drawer account section
- Desktop: COMMAND / MMO / ARCHIVE dropdowns; optional sidebar toggle
- Admin links visible only to Owner/Admin; moderation to Moderator+
- Pending users: Account group only (profile, pending approval)
- No email verification gate on navigation

## Chthonic Uprising Factions (Phase 9)

- Parent alliance: **The Chthonic Uprising** (`chthonic-uprising`) — led by The Archivist (Owner)
- Five baseline cells with full lore metadata in `Faction` model
- `FactionPosition` enum on `FactionMembership` (separate from site `RoleName`)
- `Badge` / `UserBadge` for awardable faction badges
- Seed scripts: `db:seed:factions`, `db:seed:test-users`, `db:cleanup-test-users`
- Canonical fallback: `src/lib/factions/resolve.ts` (no 404 if seed missing)
- Chthonic Command: `/admin/factions/command` — see [CHTHONIC_COMMAND.md](CHTHONIC_COMMAND.md)
- See [FACTIONS.md](FACTIONS.md) and [TEST_USERS.md](TEST_USERS.md)

## Phase 4 Systems

### Moderation Workflow

- Model: `ModerationReport` (Open, Reviewing, Resolved, Dismissed), `ModerationNote`
- Routes: `/moderation`, `/moderation/reports`, `/moderation/reports/[id]`, `/moderation/notes`, `/moderation/actions`
- Access: Owner, Admin, Moderator
- Audit: report create/status/assign, note create

### Text MMO (Lightweight)

- Models: `Character` (one per user), `Faction`, `FactionMembership`, `Quest`, `MissionSubmission`, `Badge`, `UserBadge`
- Routes: `/mmo`, `/mmo/character`, `/mmo/factions`, `/mmo/missions`, `/mmo/missions/[slug]`
- Membership requests scaffolded (Pending/Approved/Rejected/Left)
- Mission participation — join/leave/complete (Phase 5)
- **First Descent Protocols** (Phase 10): real-world readiness support missions, cross-faction completion, private proof packets, moderator review — see [missions/FIRST_DESCENT_PROTOCOLS.md](missions/FIRST_DESCENT_PROTOCOLS.md)
- Seed: `db:seed:missions:first-descent`

### Lore Archive

- Models: `LoreEntry` (`category`, `deadIndexId`, `loreMetadata`), `UserLoreUnlock`, `ArchiveItem`, `ArchiveComment`
- Routes: `/archive`, lore categories, `/archive/state-of-affairs`, `/archive/ghost-in-tech`
- Signal feeds: articles + repo library with comments — see [ARCHIVE.md](ARCHIVE.md)
- Categories: Character, World, Faction, Mythos and Ethos — see [ARCHIVE_LORE_TAXONOMY.md](ARCHIVE_LORE_TAXONOMY.md)
- Seed: `db:seed:lore`, `db:seed:archive` (production-safe, idempotent)
- Locked entries show locked cards; accessible entries require unlock action (auto-unlock for origin + leaders)
- Admin: `/admin/lore`

### Dead Drops / Ciphers (Roleplay Only)

- Models: `DeadDrop`, `SecretTransmission`, `CipherPuzzle`
- Routes: `/dead-drops`, `/dead-drops/[slug]`, `/ciphers`
- **Not secure messaging** — in-world flavor only
- Admin: `/admin/dead-drops`

### Owner Signal Deck / Signal Player

- Models: `MediaAlbum`, `MediaTrack`, `MediaVisibility`
- Storage: `storage/uploads/audio/` (disk, not DB blobs — not in Git)
- Owner upload: `/admin/media/upload`; management: `/admin/media`
- Global client player: `SignalPlayer` + `SignalPlayerProvider` (no autoplay)
- Streaming: `/api/media/audio/[trackId]` with range requests
- See `docs/MEDIA_PLAYER.md`

### Chthonic Alliance Membership

- `chthonic-uprising` is `isAlliance: true` — not joinable via public request
- Owner assigns alliance membership via `/admin/factions/command` (Chthonic Uprising Membership section)
- Cell membership remains separate; dossier shows **Alliance Mark** distinct from cell
- Owner seed: `db:seed:factions` upserts Owner users as alliance `LEADER` / The Archivist

### Phase 3 Systems (unchanged)

- Transmissions, Events, Jitsi scaffolding — see prior sections in git history

## Route Protection

| Route | Requirement |
|-------|-------------|
| `/dashboard/*` | Authenticated |
| `/events`, `/mmo/*`, `/archive/*`, `/dead-drops/*`, `/ciphers` | Authenticated |
| `/admin/*` | Owner or Admin (page-level) |
| `/moderation/*` | Owner, Admin, or Moderator |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md). Live at `https://hadeswatch.com`.
