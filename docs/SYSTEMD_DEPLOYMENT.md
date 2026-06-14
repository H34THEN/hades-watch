# Systemd Deployment — Hades Watch

Target: **Hostinger VPS**, Ubuntu 22.04, `https://hadeswatch.com`

This path runs Next.js directly on the host with systemd supervision. Nginx terminates TLS in front (see `docs/NGINX.md`).

Do not deploy until `docs/LAUNCH_CHECKLIST.md` is reviewed.

---

## 1. System Packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw postgresql postgresql-contrib
```

Optional (if not using Cloudflare Origin Certificate):

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## 2. Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v22.x
npm -v
```

## 3. Application User (least privilege)

```bash
sudo useradd --system --create-home --shell /bin/bash hadeswatch
sudo mkdir -p /opt/hades-watch
sudo chown hadeswatch:hadeswatch /opt/hades-watch
```

Alternative path: `/home/archivist/hades-watch` if using a named deploy user.

## 4. Clone Repository

```bash
sudo -u hadeswatch -H bash -c '
  cd /opt/hades-watch
  git clone <YOUR_GITHUB_REPO_URL> .
'
```

Replace `<YOUR_GITHUB_REPO_URL>` with your actual repository URL.

## 5. Production Environment File

```bash
sudo -u hadeswatch cp /opt/hades-watch/.env.example /opt/hades-watch/.env
sudo chmod 600 /opt/hades-watch/.env
sudo chown hadeswatch:hadeswatch /opt/hades-watch/.env
sudo nano /opt/hades-watch/.env
```

Required production values (see `.env.example`):

- `NODE_ENV=production`
- `AUTH_URL=https://hadeswatch.com`
- `NEXT_PUBLIC_APP_URL=https://hadeswatch.com`
- `AUTH_SECRET` — `openssl rand -base64 32`
- `DATABASE_URL` — strong password, localhost only
- `DISABLE_DEV_INVITES=true`
- `RATE_LIMIT_ENABLED=true`
- `TRUSTED_PROXY_HEADERS=true`
- SMTP variables when email is required

Never commit `.env`.

## 6. Install and Build

```bash
sudo -u hadeswatch -H bash -c '
  cd /opt/hades-watch
  npm ci
  npm run db:generate
  npm run build
'
```

## 7. Database Migrations

Take a backup first (`docs/BACKUPS.md`).

```bash
sudo -u hadeswatch -H bash -c '
  cd /opt/hades-watch
  npm run db:deploy
'
```

**Never** run `npm run db:migrate` or `npm run db:seed` in production.

## 8. Owner Bootstrap (first admin)

See `docs/ADMIN_BOOTSTRAP.md`. One-time:

```bash
sudo -u hadeswatch -H bash -c '
  cd /opt/hades-watch
  ALLOW_PROD_ADMIN_BOOTSTRAP=true npm run db:bootstrap
'
```

Unset `ALLOW_PROD_ADMIN_BOOTSTRAP` in `.env` after Owner registers.

## 9. systemd Service

Create `/etc/systemd/system/hades-watch.service`:

```ini
[Unit]
Description=Hades Watch Next.js Application
Documentation=https://hadeswatch.com
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=hadeswatch
Group=hadeswatch
WorkingDirectory=/opt/hades-watch
EnvironmentFile=/opt/hades-watch/.env
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=hades-watch

# Hardening
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable hades-watch
sudo systemctl start hades-watch
sudo systemctl status hades-watch
```

## 10. Logs

```bash
sudo journalctl -u hades-watch -f
sudo journalctl -u hades-watch --since "1 hour ago"
```

## 11. Health Check

```bash
curl -s http://127.0.0.1:3000/api/health | jq
```

Expect:

```json
{ "status": "ok", "database": "connected" }
```

## 12. Nginx

Configure reverse proxy per `docs/NGINX.md`, then:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 13. Deploy Updates

```bash
sudo systemctl stop hades-watch
# backup DB — see docs/BACKUPS.md
sudo -u hadeswatch -H bash -c '
  cd /opt/hades-watch
  git pull
  npm ci
  npm run build
  npm run db:deploy
'
sudo systemctl start hades-watch
curl -s http://127.0.0.1:3000/api/health
```

Rollback: `docs/ROLLBACK.md`

## Related Docs

- `docs/NGINX.md`
- `docs/POSTGRES_PRODUCTION.md`
- `docs/CLOUDFLARE.md`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/SMOKE_TESTS.md`
