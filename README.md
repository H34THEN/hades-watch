# Hades Watch

Hades Watch is a cyberpunk/gothic/ops-themed community platform with invite-based onboarding, role-aware dashboards, future admin tools, and a flexible visual theme system.

This repo is being started from scratch and should be built using Cursor.

## Cursor Agent Handoff

You are Cursor acting as a senior full-stack engineer, product architect, and UI systems designer. Start a brand-new website project from scratch called **Hades Watch**.

Build a strong, extensible foundation for a cyberpunk/gothic/ops-themed community platform with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- Prisma ORM
- PostgreSQL-ready config
- Auth.js / NextAuth-ready scaffolding
- Zod validation
- ESLint / Prettier
- `.env.example`
- clean docs

## Project Identity

Hades Watch should feel like a forbidden terminal, hidden network, haunted admin console, field command system, gothic archive, and cyberpunk community platform.

The site should support:

- public landing pages
- invite-only registration
- login/register scaffolding
- authenticated dashboard scaffolding
- admin/moderator scaffolding
- role-aware future architecture
- theme switching
- placeholder asset system

## Themes

Implement a CSS-variable theme system with localStorage persistence.

Create these themes:

- Ghost in the Machine
- Terminal Kiddie
- Fallout CRT
- Neon Oracle
- Corporate Dystopia
- Underworld Ops
- Null Signal
- Arcade Necropolis

Each theme should include:

- id
- display name
- description
- CSS variables
- optional overlay flags for scanlines, glow, noise, vignette
- future asset slots for logo, favicon, background image, background video, texture overlay, cursor image, loading animation, alert sound, login ambience audio, and dashboard ambience audio

Use placeholders only. Do not include copyrighted assets.

## Pages

Create:

- `/`
- `/about`
- `/themes`
- `/invite`
- `/login`
- `/register`
- `/dashboard`
- `/profile`
- `/admin`
- `/moderation`

## Components

Create reusable components such as:

- AppShell
- SiteHeader
- SiteFooter
- ThemeProvider
- ThemeSwitcher
- ThemePreviewCard
- TerminalPanel
- GlitchText
- StatusBadge
- RoleBadge
- InviteCodeForm
- LoginForm
- RegisterForm
- DashboardCard
- AdminCard
- AssetPlaceholder
- ScanlineOverlay
- NoiseOverlay
- CommandButton
- SystemAlert
- LoreBlock

## Data Model Scaffolding

Prepare Prisma models for:

- User
- Account/session if using Auth.js
- InviteCode
- Role
- UserRole
- AuditLog
- Announcement
- Asset
- ThemePreference or user setting

InviteCode should anticipate:

- code
- optional email restriction
- optional role granted
- max uses
- uses count
- expires at
- created by
- created at
- revoked boolean

Roles:

- Owner
- Admin
- Moderator
- Expert
- Gamer
- Member
- Guest

## Asset Folders

Preserve and document:

- `public/assets/logo`
- `public/assets/icons`
- `public/assets/backgrounds`
- `public/assets/textures`
- `public/assets/audio`
- `public/assets/video`
- `public/assets/avatars`
- `public/assets/documents`
- `public/assets/lore`

## Docs To Create

Create or update:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/THEMES.md`
- `docs/ASSETS.md`
- `docs/ROADMAP.md`
- `.env.example`

## Security TODOs

Add honest placeholders for:

- CSRF
- rate limiting
- input validation
- audit logging
- role-based access control
- admin route protection
- email verification
- password reset
- session handling
- bot protection
- environment secrets
- deployment hardening

Do not implement fake security.

## Acceptance Criteria

When finished:

- App runs locally.
- Homepage renders with cyberpunk styling.
- Theme switching works and persists.
- All listed routes exist.
- Placeholder assets are documented.
- Prisma schema is PostgreSQL-ready.
- No real secrets are committed.

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment template (never commit .env)
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Run migrations (first time or after schema changes)
npm run db:migrate

# Seed roles and dev invite codes
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Local PostgreSQL database: `hadeswatch_db`

Configure `DATABASE_URL` in `.env` (see `.env.example`).

```bash
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Apply migrations (dev)
npm run db:seed       # Seed roles + dev invites
npm run db:studio     # Prisma Studio GUI
npm run db:reset      # Destructive — resets DB and re-seeds
```

### Dev Invite Codes (Local Only)

Never use these in production:

| Code | Role Granted |
|------|--------------|
| `DEV-OWNER-ACCESS` | Owner |
| `DEV-MEMBER-ACCESS` | Member |
| `DEV-MOD-ACCESS` | Moderator |

Flow: `/invite` → validate code → `/register?invite=CODE` → create account → login.

### Phase 5 Status

**Working now:**

- Environment validation and production safety checks
- Rate limiting on login, register, invite, reset, cipher attempts
- Email verification flow (`/verify-email`, profile resend)
- Password reset flow (`/forgot-password`, `/reset-password`)
- Mission participation (join/leave/complete)
- Faction approval workflow (`/admin/faction-requests`)
- Cipher solutions (`/ciphers/[slug]`, dev answer: `phase` for Veil Count)
- Admin launch checklist (`/admin/launch`)
- Audit log filters (`/admin/audit`)
- Health check (`/api/health`)
- Deployment templates (Dockerfile, docker-compose.example.yml)

**Phase 6A — deployment readiness (runbooks, not live deploy):**

- Production `.env.example`, `db:deploy`, `db:bootstrap` scripts
- systemd, Docker, Nginx, Postgres, Cloudflare, email, smoke test, rollback docs

**Still not production-ready until Phase 6B:**

- SMTP transport not wired (dev console links only)
- In-memory rate limiting (not multi-instance safe)
- No VPS deployment attempted yet

See `docs/DEPLOYMENT.md`, `docs/LAUNCH_CHECKLIST.md`, `docs/SMOKE_TESTS.md`.

### Phase 4 Status

**Working now:**

- Moderation workflow (`/moderation`, reports, notes, actions)
- Character creation (`/mmo/character`)
- Faction browsing and membership requests (`/mmo/factions`)
- Mission browsing (`/mmo/missions`)
- Lore archive with unlock foundation (`/archive/lore`)
- Dead drops and ciphers — **roleplay only, not secure** (`/dead-drops`, `/ciphers`)
- Admin: users, lore, factions, missions, dead drops
- Dashboard panels wired to real data

**Routes (authenticated unless noted):**

| Route | Access |
|-------|--------|
| `/mmo`, `/mmo/character`, `/mmo/factions`, `/mmo/missions` | All logged-in users |
| `/archive`, `/archive/lore` | All logged-in users (clearance-gated) |
| `/dead-drops`, `/ciphers` | All logged-in users (clearance-gated) |
| `/moderation/*` | Owner / Admin / Moderator |
| `/admin/users`, `/admin/lore`, `/admin/factions`, `/admin/missions`, `/admin/dead-drops` | Owner / Admin |

**Not production-ready:**

- Email verification, password reset, rate limiting, bot protection
- Jitsi rooms are not access-controlled
- Dead drops are roleplay flavor only — not real secure messaging
- Mission participation and faction approval UI incomplete
- See [docs/SECURITY.md](docs/SECURITY.md)

### Phase 3 Status

**Working now:**

- Transmissions system (`/dashboard/transmissions`, `/admin/announcements`)
- Event calendar (`/events`, `/dashboard/events`, `/admin/events`)
- Jitsi meeting link generation on events (public meet.jit.si — not private)
- Role-targeted broadcasts and events
- Moderation model foundations (reports, notes)
- Text MMO stubs (Faction, Character, Quest)
- Secret message / dead-drop stubs (roleplay only, not secure)

**Routes (authenticated unless noted):**

| Route | Access |
|-------|--------|
| `/dashboard/transmissions` | All logged-in users (role-filtered) |
| `/events` | All logged-in users (role-filtered) |
| `/admin/announcements` | Owner / Admin |
| `/admin/events` | Owner / Admin |

### Phase 2 Status

**Working now:**

- Credentials login/logout
- Invite-only registration with role assignment
- Route protection (dashboard, profile, admin, moderation, events)
- Profile settings (display name, theme preference)
- Admin console with invite management and audit logs
- Audit logging for key events

**Not production-ready:**

- Email verification, password reset, rate limiting, bot protection
- Jitsi rooms are not access-controlled
- Secret messages are roleplay stubs only — not real secure messaging
- See [docs/SECURITY.md](docs/SECURITY.md)

### Phase 6A Status

Deployment runbooks finalized for Hostinger VPS (`hadeswatch.com`). Operator executes deploy in Phase 6B.

| Path | Doc |
|------|-----|
| Overview | [Deployment](docs/DEPLOYMENT.md) |
| systemd + Node | [Systemd Deployment](docs/SYSTEMD_DEPLOYMENT.md) |
| Docker Compose | [Docker Deployment](docs/DOCKER_DEPLOYMENT.md) |
| Nginx | [Nginx](docs/NGINX.md) |
| PostgreSQL | [Postgres Production](docs/POSTGRES_PRODUCTION.md) |
| Cloudflare | [Cloudflare](docs/CLOUDFLARE.md) |
| Email / SMTP | [Email](docs/EMAIL.md) |
| Owner bootstrap | [Admin Bootstrap](docs/ADMIN_BOOTSTRAP.md) |
| Smoke tests | [Smoke Tests](docs/SMOKE_TESTS.md) |
| Rollback | [Rollback](docs/ROLLBACK.md) |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations (dev only) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed roles and dev invites (dev only) |
| `npm run db:bootstrap` | One-time Owner invite (production, gated) |
| `npm run db:studio` | Prisma Studio |

### Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Themes](docs/THEMES.md)
- [Assets](docs/ASSETS.md)
- [Roadmap](docs/ROADMAP.md)
- [Security](docs/SECURITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [VPS Runbook](docs/VPS_RUNBOOK.md)
- [Launch Checklist](docs/LAUNCH_CHECKLIST.md)
- [Backups](docs/BACKUPS.md)
- [Text MMO](docs/TEXT_MMO.md)
- [Secret Messages (roleplay)](docs/SECRET_MESSAGES.md)
- [Meetings / Jitsi (future)](docs/MEETINGS.md)
