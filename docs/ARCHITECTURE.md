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

- Models: `Character` (one per user), `Faction`, `FactionMembership`, `Quest`
- Routes: `/mmo`, `/mmo/character`, `/mmo/factions`, `/mmo/missions`
- Membership requests scaffolded (Pending/Approved/Rejected/Left)
- Mission participation — complete (Phase 5)

### Lore Archive

- Models: `LoreEntry`, `UserLoreUnlock`
- Routes: `/archive`, `/archive/lore`, `/archive/lore/[slug]`
- Locked entries show locked cards; accessible entries require unlock action
- Admin: `/admin/lore`

### Dead Drops / Ciphers (Roleplay Only)

- Models: `DeadDrop`, `SecretTransmission`, `CipherPuzzle`
- Routes: `/dead-drops`, `/dead-drops/[slug]`, `/ciphers`
- **Not secure messaging** — in-world flavor only
- Admin: `/admin/dead-drops`

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
