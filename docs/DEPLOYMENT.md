# Hades Watch Deployment

Production target: **Hostinger VPS**, Ubuntu 22.04, `https://hadeswatch.com`.

Phase 6A prepares deployment runbooks. **Do not deploy until `docs/LAUNCH_CHECKLIST.md` and `docs/SMOKE_TESTS.md` pass.**

---

## Deployment Paths

Choose one:

| Path | Doc | Best for |
|------|-----|----------|
| **systemd + Node** | `docs/SYSTEMD_DEPLOYMENT.md` | Direct VPS control, simpler debugging |
| **Docker Compose** | `docs/DOCKER_DEPLOYMENT.md` | Isolated app+DB, reproducible builds |

Both use **host Nginx** for TLS (`docs/NGINX.md`).

---

## Architecture

```txt
Internet → Cloudflare (DNS/TLS) → Nginx :443 → Next.js :3000 → PostgreSQL :5432 (localhost)
```

- PostgreSQL never exposed publicly
- App binds to `127.0.0.1:3000` when behind Nginx
- Only ports 80, 443, and SSH open on firewall

---

## Local vs Production

| Concern | Local Dev | Production |
|---------|-----------|------------|
| `.env` | `.env` (gitignored) | Server-only, mode `600` |
| Database | Local PostgreSQL | VPS or managed PostgreSQL |
| Migrations | `npm run db:migrate` | `npm run db:deploy` |
| Seed | `npm run db:seed` | **Never** |
| Owner bootstrap | Dev invites | `npm run db:bootstrap` or SQL |
| AUTH_SECRET | Dev placeholder | `openssl rand -base64 32` |
| AUTH_URL | `http://localhost:3000` | `https://hadeswatch.com` |
| Invite codes | `DEV-*` OK locally | Production codes only |

---

## Production Checklist (Summary)

- [ ] Strong `AUTH_SECRET` and database password
- [ ] `AUTH_URL` and `NEXT_PUBLIC_APP_URL` = `https://hadeswatch.com`
- [ ] `DISABLE_DEV_INVITES=true`
- [ ] `RATE_LIMIT_ENABLED=true`
- [ ] `TRUSTED_PROXY_HEADERS=true` (behind Nginx)
- [ ] SMTP configured (`docs/EMAIL.md`)
- [ ] `npm run db:deploy` (not `db:migrate` or `db:seed`)
- [ ] Owner bootstrapped (`docs/ADMIN_BOOTSTRAP.md`)
- [ ] All `DEV-*` invites revoked
- [ ] Pre-deploy backup (`docs/BACKUPS.md`)
- [ ] Smoke tests pass (`docs/SMOKE_TESTS.md`)

Full list: `docs/LAUNCH_CHECKLIST.md`

---

## Operator Sequence (First Deploy)

1. Provision VPS (Ubuntu 22.04)
2. Configure Cloudflare DNS (`docs/CLOUDFLARE.md`)
3. Install PostgreSQL (`docs/POSTGRES_PRODUCTION.md`)
4. Clone repo, create `.env` from `.env.example`
5. `npm ci && npm run build`
6. Pre-migration backup
7. `npm run db:deploy`
8. `ALLOW_PROD_ADMIN_BOOTSTRAP=true npm run db:bootstrap`
9. Start app (systemd or Docker)
10. Configure Nginx + TLS (`docs/NGINX.md`)
11. Run smoke tests
12. Review `/admin/launch`

Updates: see path-specific doc. Rollback: `docs/ROLLBACK.md`.

---

## Environment Variables

Copy from `.env.example`. Never commit production `.env`.

Required: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`.

---

## Documentation Index

| Doc | Purpose |
|-----|---------|
| `docs/SYSTEMD_DEPLOYMENT.md` | Node + systemd on Ubuntu |
| `docs/DOCKER_DEPLOYMENT.md` | Docker Compose path |
| `docs/NGINX.md` | Reverse proxy for hadeswatch.com |
| `docs/POSTGRES_PRODUCTION.md` | Production database setup |
| `docs/CLOUDFLARE.md` | DNS and TLS |
| `docs/EMAIL.md` | SMTP configuration |
| `docs/ADMIN_BOOTSTRAP.md` | First Owner account |
| `docs/SMOKE_TESTS.md` | Post-deploy verification |
| `docs/ROLLBACK.md` | Revert failed deploys |
| `docs/BACKUPS.md` | Backup and restore |
| `docs/LAUNCH_CHECKLIST.md` | Pre-launch gates |
| `docs/VPS_RUNBOOK.md` | Operator overview |
| `docs/SECURITY.md` | Security status |

---

## Monitoring

- Application: `journalctl -u hades-watch` or `docker compose logs web`
- Nginx: `/var/log/nginx/hadeswatch.*.log`
- Health: `GET /api/health`
- Uptime: external monitor (UptimeRobot, etc.)

---

## Phase Status

- **Phase 5** — Launch readiness (env, rate limits, email groundwork, health check)
- **Phase 6A** — Deployment runbooks and production templates (this phase)
- **Phase 6B** — Actual VPS deployment (operator-executed)
