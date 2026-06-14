# Security

Honest security status for Hades Watch.

---

## Implemented in Phase 2

- Password hashing (bcrypt, 12 rounds)
- Invite-only registration with server-side validation
- Invite usage tracking and revocation support
- Role-gated routes (middleware + page-level checks)
- Database-backed users, roles, and theme preferences
- Basic audit logging (registration, login, invite, profile, access denied)
- IP hashing for audit logs (SHA-256 with AUTH_SECRET salt)
- Zod validation on auth/invite/profile forms
- Disabled/banned user flags checked at login

## Implemented in Phase 3

- Transmission (announcement) system with role targeting
- Event calendar with Jitsi link scaffolding
- Audit logs for announcement and event actions
- Moderation report/note model foundations

## Implemented in Phase 4

- Full moderation workflow with audit logging
- Character, faction, quest, lore, dead-drop systems
- Moderation notes visible only to Owner/Admin/Moderator
- Role/faction clearance checks on lore and dead drops
- Dead drops display roleplay disclaimer — **not secure messaging**
- Admin CRUD with audit logs for create/publish actions

## Implemented in Phase 5

- Environment validation (`src/lib/env.ts`) with production safety checks
- Rate limiting foundation on login, register, invite, reset, cipher (`src/lib/rate-limit.ts`)
- Security headers + CSP starter (`next.config.ts`)
- Email verification tokens and routes (`/verify-email`)
- Password reset tokens and routes (`/forgot-password`, `/reset-password`)
- Email abstraction — SMTP-ready, dev console fallback (`src/lib/email/`)
- `DISABLE_DEV_INVITES` production safety switch
- `REQUIRE_EMAIL_VERIFICATION` enforcement flag
- Health check endpoint (`/api/health`)
- Launch checklist admin page (`/admin/launch`)

## Implemented in Phase 6A

- Production deployment runbooks (systemd, Docker, Nginx, Postgres, Cloudflare)
- Production-safe Owner bootstrap script (`npm run db:bootstrap`)
- `npm run db:deploy` for production migrations
- Smoke test and rollback documentation

---

## Not Production-Ready Yet

- [ ] SMTP transport wired (abstraction exists; nodemailer/provider SDK pending)
- [ ] Distributed rate limiting (in-memory only — not multi-instance safe)
- [ ] Bot protection (CAPTCHA / Turnstile)
- [ ] Account lockout after failed attempts (beyond rate limit)
- [ ] Production monitoring and alerting automation
- [ ] Abuse detection automation
- [ ] Backup restore drill completed on operator VPS
- [ ] CSP tightened for production (starter policy allows `unsafe-inline`)
- [ ] Jitsi room access controls (rooms are public by default)

## Must Happen Before Public Launch

- [ ] Strong production `AUTH_SECRET` (rotate from dev)
- [ ] Strong production database password
- [ ] HTTPS everywhere (Cloudflare + Nginx — `docs/CLOUDFLARE.md`)
- [ ] Secure cookie flags verified in production
- [ ] Rate limiting enabled (`RATE_LIMIT_ENABLED=true`)
- [ ] Email verification required when SMTP is live (`REQUIRE_EMAIL_VERIFICATION=true`)
- [ ] Password reset tested with live SMTP
- [ ] Automated database backups (`docs/BACKUPS.md`)
- [ ] Cloudflare WAF / bot rules
- [ ] Server hardening (Ubuntu 22.04 VPS)
- [ ] Remove all `DEV-*` invite codes (`docs/ADMIN_BOOTSTRAP.md`)
- [ ] Smoke tests pass (`docs/SMOKE_TESTS.md`)

---

## Dead Drops / Secret Messages

This is an **in-world roleplay/game system**. It is **not** secure private messaging and should not be used for real secrets. No cryptographic guarantees are made.

## Email Security

- Forgot-password uses generic responses (no email enumeration)
- Production must not log raw verification/reset tokens (`src/lib/email/email.ts`)
- Local dev may print links when SMTP is unset
- Configure SPF/DKIM/DMARC (`docs/EMAIL.md`)

## Audit Log Privacy

- Passwords are never logged
- IP addresses are stored as hashes, not plaintext
- User agents are truncated to 512 characters
- Moderation notes are not exposed to regular users

## Dev Environment Warnings

- `DEV-*` invite codes must never be used in production
- Local `.env` secrets are not production-grade
- Set `DISABLE_DEV_INVITES=true` in production
- Do not run `npm run db:seed` in production

## Related

- `docs/EMAIL.md`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/DEPLOYMENT.md`
