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
    mmo/                       # Text MMO hub, character, factions, missions, rooms, dead-drops, field-log
    archive/                   # Lore archive
    dead-drops/                # Fictional dead drops (roleplay)
    ciphers/                   # Cipher puzzles (roleplay)
    chat/                      # AIM-style temporary chat (approved users)
    community/                 # Forums, builder, volunteer, guilds, lore, recognition
    layout/                    # PageShell, AdminShell, AppShell — responsive width system
    net-neighbors/             # Old-web banner wall
    moderation/                # Moderation console
    admin/                     # Admin console + subpages
    profile/                   # Profile world, edit, avatar, public [handle]
  components/
    profile/                   # ProfileWorldView, relic sandbox, edit client
    avatar/                    # AvatarHudFrame, builder, layered preview
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

## Layout System

Responsive page width is controlled by `PageShell` / `AdminShell` (`src/components/layout/`) and shared CSS utilities in `globals.css`. Child routes choose variants per purpose — dashboard libraries use `dashboard`/`wide`, long-form lore articles use `standard`, auth forms use `narrow`. Archive signal feeds and repo detail pages use `ArchiveSignalFeed` / `ArchiveSignalItemDetail` with split sidebars. See [LAYOUT_SYSTEM.md](LAYOUT_SYSTEM.md).

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
- Desktop: COMMAND / MMO / ARCHIVE / SOCIAL dropdowns; optional sidebar toggle
- Admin links visible only to Owner/Admin; moderation to Moderator+
- Pending users: Account group only (profile, pending approval)
- Social group: Chat (approved), Net Neighbors (open/public wall), Profile (approved)
- Footer: **Support the Underwatch** → `/support` (donation placeholder)
- No email verification gate on navigation

## Social Features (Phase 11)

- Chat: `ChatRoom`, `ChatMessage` — HTTPS temporary chat, 24h retention, not E2EE
- Net Neighbors: `NetNeighbor` — public HUD banner wall, moderated submissions, `bannerStyle` JSON builder, `sortOrder` admin reorder. See [NET_NEIGHBORS.md](NET_NEIGHBORS.md)
- Footer donation placeholder: `/support` — no payment provider yet
- Profile relic: iframe-sandboxed HTML/CSS only on `/profile/edit` — not full-page customization
- Profile: `Character.callsign` (unique public slug), `UserAvatar`, `AvatarUserPart`, `UserProfileCustomization`
- Public profile: `/profile/[callsign]` — `Character.callsign`, auto-provisioned from `User.name` if missing
- See [PROFILE_WORLDS.md](PROFILE_WORLDS.md), [PROFILE_WORLD.md](PROFILE_WORLD.md), [AVATAR_BUILDER.md](AVATAR_BUILDER.md), [SOCIAL_FEATURES.md](SOCIAL_FEATURES.md)

## Database Scripts

| Script | Purpose |
|--------|---------|
| `npm run db:generate` | Generate Prisma client only — no data changes |
| `npm run db:deploy` | Apply migrations + regenerate client |
| `npm run db:seed` / `db:seed:all` | Canonical production-safe seeds (factions, lore, archive, missions, chat, net-neighbors, text-mmo, mmo-rewards) |
| `npm run db:release` | `db:generate` + `db:deploy` + canonical seed |
| `npm run db:backfill:profile-slugs` | Provision missing `Character.callsign` from codename |
| `npm run db:seed:legacy` | Legacy dev seed (roles + dev invites when allowed) |

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
- **Text MMO playable loops:** `MmoRoom`, `MmoDeadDrop`, `MmoFieldLog`, loot/lore grant models — routes `/mmo/rooms`, `/mmo/dead-drops`, `/mmo/field-log` — see [TEXT_MMO_PLAYABLE_LOOPS.md](TEXT_MMO_PLAYABLE_LOOPS.md), [TEXT_MMO_IMPLEMENTATION_NOTES.md](TEXT_MMO_IMPLEMENTATION_NOTES.md)
- Seed: `db:seed:text-mmo` (included in `db:seed`)
- Membership requests scaffolded (Pending/Approved/Rejected/Left)
- Mission participation — join/leave/complete (Phase 5)
- **First Descent Protocols** (Phase 10): real-world readiness support missions, cross-faction completion, private proof packets, moderator review — see [missions/FIRST_DESCENT_PROTOCOLS.md](missions/FIRST_DESCENT_PROTOCOLS.md)
- **Underwatch Civic Action Protocols** (Phase 11): nine safe civic action support missions, `sourceConfidence` tracking, ethical archiving and data minimization — see [missions/UNDERWATCH_CIVIC_ACTION_PROTOCOLS.md](missions/UNDERWATCH_CIVIC_ACTION_PROTOCOLS.md)
- Seed: `db:seed:missions:first-descent`, `db:seed:missions:underwatch-civic-action`

### Lore Archive

- Models: `LoreEntry` (`category`, `deadIndexId`, `loreMetadata`), `UserLoreUnlock`, `ArchiveItem`, `ArchiveComment`
- Routes: `/archive`, lore categories, `/archive/state-of-affairs`, `/archive/ghost-in-tech` (full-width repo library)
- Signal feeds: articles + repo library with comments — see [ARCHIVE.md](ARCHIVE.md)
- Categories: Character, World, Faction, Mythos and Ethos — see [ARCHIVE_LORE_TAXONOMY.md](ARCHIVE_LORE_TAXONOMY.md)
- Seed: `db:seed:lore`, `db:seed:archive` (production-safe, idempotent)
- Locked entries show locked cards; accessible entries require unlock action (auto-unlock for origin + leaders)
- Admin: `/admin/lore`

### Dead Drops / Ciphers (Roleplay Only)

- Models: `DeadDrop`, `SecretTransmission`, `CipherPuzzle`, `CipherSolve`, `Badge`, `UserBadge`
- Routes: `/dead-drops`, `/dead-drops/[slug]`, `/ciphers`, `/ciphers/[slug]`
- **First Cipher Set (C1PH3R CR4K3R):** five seeded puzzle missions, hashed answers, automatic badge awards — see [ciphers/FIRST_CIPHER_SET.md](ciphers/FIRST_CIPHER_SET.md), [CIPHERS.md](CIPHERS.md)
- Seed: `db:seed:ciphers:first-set`
- Static assets: `public/avatar-assets/`, `public/badge-assets/` (`npm run assets:migrate`, `npm run assets:registry`)
- Avatar prompts: `docs/avatarPrompts/`, `docs/AVATAR_PROMPT_REFERENCE.md`, `docs/AVATAR_ASSET_DIRECTORY.md`
- Avatar Forge GPT access: `/profile/avatar/forge`, `/admin/avatar-forge-access` — URL in `AVATAR_FORGE_GPT_URL` env only — see [AVATAR_FORGE_GPT_ACCESS.md](AVATAR_FORGE_GPT_ACCESS.md)
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
