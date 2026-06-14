# Hades Watch Launch Checklist

Use this checklist before pointing `hadeswatch.com` at production.

After deployment, complete `docs/SMOKE_TESTS.md`.

---

## Environment

- [ ] Strong `AUTH_SECRET` (`openssl rand -base64 32`)
- [ ] `AUTH_URL=https://hadeswatch.com`
- [ ] `NEXT_PUBLIC_APP_URL=https://hadeswatch.com`
- [ ] `NODE_ENV=production`
- [ ] `DISABLE_DEV_INVITES=true`
- [ ] `RATE_LIMIT_ENABLED=true`
- [ ] `TRUSTED_PROXY_HEADERS=true`
- [ ] `REQUIRE_EMAIL_VERIFICATION=true` (when SMTP is live)
- [ ] SMTP configured (`docs/EMAIL.md`)
- [ ] `.env` permissions `600`, never committed

## Database

- [ ] Production PostgreSQL provisioned (`docs/POSTGRES_PRODUCTION.md`)
- [ ] Strong password (not dev default)
- [ ] `DATABASE_URL` uses SSL if remote
- [ ] Pre-migration backup taken (`docs/BACKUPS.md`)
- [ ] `npm run db:deploy` succeeded
- [ ] **Never** run `npm run db:seed` in production

## Admin Bootstrap

- [ ] All `DEV-*` invites revoked (`docs/ADMIN_BOOTSTRAP.md`)
- [ ] Owner account created via bootstrap or SQL
- [ ] `ALLOW_PROD_ADMIN_BOOTSTRAP` unset after use
- [ ] Production invites created for team roles

## Security

- [ ] HTTPS enabled (Cloudflare + Nginx — `docs/CLOUDFLARE.md`, `docs/NGINX.md`)
- [ ] Security headers verified (`docs/SECURITY.md`)
- [ ] Rate limiting tested
- [ ] Email verification flow tested end-to-end
- [ ] Password reset flow tested end-to-end
- [ ] UFW: only SSH, 80, 443

## Infrastructure

- [ ] Deployment path chosen (systemd or Docker)
- [ ] Nginx reverse proxy configured
- [ ] Systemd service or Docker Compose running with restart policy
- [ ] `/api/health` returns `database: connected`
- [ ] Logs monitored
- [ ] Backup cron configured; restore drill completed

## Application

- [ ] `npm ci && npm run build` passes on server
- [ ] Theme system works
- [ ] Auth, RBAC, events, transmissions, moderation, MMO, lore, dead drops verified
- [ ] `/admin/launch` checklist reviewed in browser
- [ ] `docs/SMOKE_TESTS.md` signed off

## Not Ready Until

- SMTP transport wired and sending (if enforcing email verification)
- Distributed rate limiting (if running multiple app instances)
- Production monitoring/alerting configured
- Backup restore drill completed on non-prod copy

---

## Documentation

- `docs/DEPLOYMENT.md` — overview
- `docs/VPS_RUNBOOK.md` — operator quick reference
- `docs/SMOKE_TESTS.md` — post-deploy tests
- `docs/ROLLBACK.md` — failure recovery
- `docs/ADMIN_BOOTSTRAP.md` — first Owner
- `docs/BACKUPS.md` — backup procedures
