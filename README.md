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
