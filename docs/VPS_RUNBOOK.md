# Hades Watch VPS Runbook

Operator overview for **Hostinger VPS**, Ubuntu 22.04, domain **hadeswatch.com**.

Detailed steps live in specialized docs — this runbook is the decision tree and quick reference.

**Do not execute until `docs/LAUNCH_CHECKLIST.md` is understood.**

---

## Choose Deployment Path

| Path | When to use | Guide |
|------|-------------|-------|
| **systemd + Node** | Default for single VPS | `docs/SYSTEMD_DEPLOYMENT.md` |
| **Docker Compose** | Prefer containerized app+DB | `docs/DOCKER_DEPLOYMENT.md` |

Both require:

- Host Nginx (`docs/NGINX.md`)
- Cloudflare DNS (`docs/CLOUDFLARE.md`)
- Production Postgres (`docs/POSTGRES_PRODUCTION.md`)

---

## 1. Initial Server Setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw
```

Firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

**Never** open PostgreSQL (5432) or app port (3000) publicly.

## 2. PostgreSQL

See `docs/POSTGRES_PRODUCTION.md`.

- DB name: `hadeswatch_db`
- App user: `archivist` (strong password — not dev default)
- Bind to localhost only

## 3. Application Deploy

Follow `docs/SYSTEMD_DEPLOYMENT.md` or `docs/DOCKER_DEPLOYMENT.md`.

Key commands:

```bash
npm ci
npm run db:generate
npm run build
npm run db:deploy          # NOT db:migrate or db:seed
```

## 4. Owner Bootstrap

```bash
ALLOW_PROD_ADMIN_BOOTSTRAP=true npm run db:bootstrap
```

See `docs/ADMIN_BOOTSTRAP.md`. Revoke all `DEV-*` invites before launch.

## 5. Nginx + TLS

See `docs/NGINX.md` and `docs/CLOUDFLARE.md`.

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Email

Configure SMTP per `docs/EMAIL.md` before enforcing `REQUIRE_EMAIL_VERIFICATION=true`.

## 7. Health Check

```bash
curl -s http://127.0.0.1:3000/api/health | jq
curl -s https://hadeswatch.com/api/health | jq
```

## 8. Pre-Launch Verification

- `docs/LAUNCH_CHECKLIST.md`
- `docs/SMOKE_TESTS.md`
- `/admin/launch` in browser

## 9. Backups

Daily automated dumps. See `docs/BACKUPS.md`.

Before every deploy:

```bash
pg_dump -h localhost -U archivist -d hadeswatch_db -F c -f pre_deploy.dump
```

## 10. Updates

```bash
# backup first
git pull
npm ci && npm run build
npm run db:deploy
sudo systemctl restart hades-watch   # or docker compose up -d --build web
curl -s http://127.0.0.1:3000/api/health
```

## 11. Rollback

See `docs/ROLLBACK.md`.

## 12. Logs

```bash
# systemd
sudo journalctl -u hades-watch -f

# Docker
docker compose logs -f web

# Nginx
sudo tail -f /var/log/nginx/hadeswatch.error.log
```

---

## Quick Reference

| Task | Command / Doc |
|------|---------------|
| Migrations | `npm run db:deploy` |
| Owner invite | `npm run db:bootstrap` |
| Revoke DEV invites | `docs/ADMIN_BOOTSTRAP.md` |
| Smoke tests | `docs/SMOKE_TESTS.md` |
| Rollback | `docs/ROLLBACK.md` |

---

## Pre-Launch Reminders

- Revoke all `DEV-*` invites
- `DISABLE_DEV_INVITES=true`
- Strong secrets in `.env` (mode 600)
- SMTP live before email enforcement
- Do not run `npm run db:seed` in production
