# Hades Watch Roadmap

## Phase 1 — Complete

- Foundation (Next.js, TypeScript, Tailwind, shadcn/ui)
- Layout and theme system (8 themes)
- Public pages and scaffolding
- Prisma schema and PostgreSQL setup

## Phase 2 — Complete

- Credentials auth (Auth.js / NextAuth v5)
- Invite-only registration
- Role-based route protection
- Profile settings and theme persistence
- Database seeding (roles + dev invites)
- Audit logging
- Admin invite management foundation
- Deployment documentation

## Phase 3 — Complete

- Transmissions (announcements) system with role targeting
- Event calendar foundation
- Jitsi meeting link scaffolding
- Admin transmission and event management
- Moderation model foundations (reports, notes)
- Text MMO model stubs (Character, Faction, Quest)
- Secret message / dead-drop model stubs
- Dashboard integration for transmissions and events

## Phase 4 — Complete

- Full moderation workflow
- Character, factions, missions (lightweight)
- Lore archive and unlocks
- Dead drops and ciphers (roleplay only)
- Admin expansion for game systems
- Dashboard integration for MMO/archive/dead drops

## Phase 5 — Complete

- Environment validation (`src/lib/env.ts`)
- Rate limiting foundation (in-memory, single-instance)
- Security headers (Next.js config + CSP starter)
- Email verification groundwork (tokens, routes, profile UI)
- Password reset groundwork (tokens, routes)
- Email abstraction (SMTP-ready, dev fallback)
- Mission participation (join/leave/complete)
- Faction approval workflow (admin requests page)
- Cipher solution flow with hashed answers
- Admin user management improvements (disable/enable, verification status)
- Audit log filters (`/admin/audit`)
- Launch checklist (`/admin/launch`)
- Health check (`/api/health`)
- Deployment templates (Dockerfile, docker-compose.example.yml)
- VPS runbook, backups doc, launch checklist

## Phase 6A — Complete

- Production `.env.example` with launch checklist comments
- `npm run db:deploy` and `npm run db:bootstrap` scripts
- Production-safe Owner bootstrap script
- Dockerfile improvements (non-root, healthcheck, standalone)
- Docker Compose example (localhost binding, health checks)
- Deployment runbooks:
  - `docs/SYSTEMD_DEPLOYMENT.md`
  - `docs/DOCKER_DEPLOYMENT.md`
  - `docs/NGINX.md`
  - `docs/POSTGRES_PRODUCTION.md`
  - `docs/CLOUDFLARE.md`
  - `docs/EMAIL.md`
  - `docs/ADMIN_BOOTSTRAP.md`
  - `docs/SMOKE_TESTS.md`
  - `docs/ROLLBACK.md`
- Updated `docs/DEPLOYMENT.md`, `docs/VPS_RUNBOOK.md`, `docs/LAUNCH_CHECKLIST.md`

## Phase 6B — Live

- Production deployment at `https://hadeswatch.com`
- Standalone Next.js + systemd + Nginx + Cloudflare

## Phase 7 — Profile Identity + Media Layer

- Spotify playlist embed on `/profile` (iframe, no OAuth)
- Dossier identity: titles, badges, clearance, faction display
- Invite lineage (`InviteRedemption` model)
- Operational history: missions, ciphers, lore unlocks
- See `docs/PROFILE_DOSSIER.md`

## Phase 10 — Navigation Refactor

- Grouped header navigation: Command, MMO, Archive, Social, Account
- Mobile slide-out drawer (`Open Underwatch Menu`) — logout moved into account section
- Desktop compact dropdown groups + optional collapsible sidebar (localStorage preference)
- Permission-aware links (admin/moderator/approved/pending)
- See `src/lib/navigation/config.ts`

## Phase 12 — Profile Worlds & Avatar Builder

- **Profile Worlds** — full-width `/profile` with dossier panels + dominant mirror chamber HUD
- **Edit** — `/profile/edit` for HTML/CSS, RSS, uploads, world metadata
- **Avatar Builder** — `/profile/avatar` with poses, custom part uploads, HUD preview
- **Base downloads** — `/profile/avatar/bases` for official creator parts
- **Public profiles** — `/profile/[handle]` by character callsign when `isPublic`
- Models: `UserAvatar` (pose, customPartIds), `AvatarUserPart`, `UserProfileAsset`, `UserProfileCustomization`
- See `docs/PROFILE_WORLDS.md`, `docs/PROFILE_WORLD.md`, `docs/AVATAR_BUILDER.md`

## Phase 11 — Old-Web Social Features

- **Chat Rooms** (`/chat`) — HTTPS-protected temporary chat, 5 AIM-style rooms, 24h retention, alias support
- **Net Neighbors** (`/net-neighbors`) — 88×31 banner wall, moderated submissions, disk storage
- **Profile Relic Zone** (`/profile`) — sandboxed MySpace-style HTML/CSS/RSS in iframe (no user JS)
- Admin review: `/admin/social`
- Seed: `db:seed:chat`; cleanup: `db:cleanup:chat`
- See `docs/SOCIAL_FEATURES.md`

## Phase 10 — First Descent Mission Pack

- **Mission Pack I: First Descent Protocols** — five nonviolent real-world readiness support missions
- Cross-faction completion: any approved operative may complete any mission to support a faction
- Faction support reputation on verified mission completion (no primary-faction requirement)
- Component badges + mission completion badges on operative dossier (square placeholders, verification status)
- Private proof packets — reviewer-only; never on public profile
- Routes: `/mmo/missions`, `/mmo/missions/[slug]`
- Admin/moderator review: `/admin/missions`
- Seed: `db:seed:missions:first-descent` (production-safe, idempotent)
- Canonical lore: `docs/missions/FIRST_DESCENT_PROTOCOLS.md`

## Phase 8 — Out-of-Band Beta Verification

- No-email beta access model (`docs/BETA_ACCESS_MODEL.md`)
- User account status: Pending / Approved / Rejected
- Optional invite-bound safety number / fingerprint verification
- Auto-approve on verification match
- Admin approval queue at `/admin/users`
- `/pending-approval` for queued operatives

## Phase 9 — Chthonic Uprising Factions

- Parent alliance + five baseline cells (canonical lore)
- `FactionPosition` ranks separate from site roles
- Badge models and faction page lore display
- Admin user assignment: role, status, faction, position
- Profile dossier: faction position, reputation, DB badges
- Seed: `db:seed:factions`, `db:seed:test-users` (explicit)
- Cleanup: `db:cleanup-test-users` before production
- Chthonic Command: `/admin/factions/command` — see `docs/CHTHONIC_COMMAND.md`
- Canonical fallback prevents faction 404 when seed not run
- See `docs/FACTIONS.md`, `docs/TEST_USERS.md`, `FactionsLoreBuilder.md`
- **Origin dossier added:** `docs/lore/CHTHONIC_UPRISING_ORIGIN.md`
- **Archive lore:** `the-chthonic-uprising` (Dead Index testimony from Heathen)
- **Character lore:** six Chthonic leader dossiers — see `docs/ARCHIVE_LORE_TAXONOMY.md`
- **Archive taxonomy:** lore sections + State of Affairs + Ghost in Tech — see `docs/ARCHIVE.md`
- **State of Affairs:** EFF starter links seeded via `db:seed:archive`
- **Alliance page:** `/mmo/factions/chthonic-uprising` surfaces origin excerpts

## Phase 10 — Owner Signal Deck & Alliance Assignment

- **Media models:** `MediaAlbum`, `MediaTrack` with visibility tiers
- **Owner Signal Deck:** `/admin/media`, `/admin/media/upload` (Owner upload only)
- **Signal Player:** global corner player, collapsed by default, no autoplay
- **Chthonic alliance membership:** Owner-only assignment; blocks self-join on alliance
- **Profile dossier:** alliance mark shown separately from cell faction
- **Docs:** `docs/MEDIA_PLAYER.md`
- **Seed:** `db:seed:factions` assigns Owner → Chthonic Uprising `LEADER` / The Archivist

## Future Lore

Planned archive entries and mission chains from the origin dossier:

- The Ledger Purges
- The All-Seeing Census
- The Burning of the Civic Tablets
- The Thunder Casket Crisis
- The Bronze Gate Levies
- Signal Ghosts
- Underwatch

## Future

- Wire SMTP transport (nodemailer or provider SDK)
- Distributed rate limiting (Redis/Upstash) if multi-instance
- Spotify OAuth / Web Playback SDK
- Public dossier pages
