# Hades Watch Deployment

Production: **Hostinger VPS**, Ubuntu 22.04, `https://hadeswatch.com`.

---

## Live Production Layout (systemd + standalone)

Current VPS setup:

| Item | Value |
|------|-------|
| App path | `/opt/hades-watch-next` |
| systemd unit | `hades-watch-next.service` |
| Start command | `node /opt/hades-watch-next/.next/standalone/server.js` |
| Working directory | `/opt/hades-watch-next/.next/standalone` |
| Internal URL | `http://127.0.0.1:3000` |
| Public URL | `https://hadeswatch.com` (Nginx → app) |

Use **`node .next/standalone/server.js`**, not `npm run start`, for production standalone output.

After every `npm run build`, static assets must exist inside standalone (handled automatically by `postbuild`):

```bash
npm run build   # runs postbuild → copies .next/static and public into standalone
```

Or manually:

```bash
npm run deploy:standalone-assets
```

---

## Deployment Paths

| Path | Doc |
|------|-----|
| **systemd + standalone** | `docs/SYSTEMD_DEPLOYMENT.md` |
| **Docker Compose** | `docs/DOCKER_DEPLOYMENT.md` |
| **Nginx** | `docs/NGINX.md` |

---

## Architecture

```txt
Internet → Cloudflare (DNS/TLS) → Nginx :443 → Next.js standalone :3000 → PostgreSQL :5432 (localhost)
```

---

## Theme System (Production Behavior)

Themes are **not** defined only in static CSS files. On the client, `ThemeProvider` calls `applyThemeToDocument()` which:

1. Sets `data-theme="<id>"` on `<html>`
2. Sets CSS variables via **inline styles** on `<html>` (`--background`, `--primary`, etc.)

Default theme when no localStorage/DB preference: **`ghost-in-the-machine`** (first entry in theme registry).

| Source | Priority |
|--------|----------|
| Logged-in user DB preference | Highest |
| `localStorage` key `hades-watch-theme` | Guests / fallback |
| `ghost-in-the-machine` | Default |

All 8 themes ship in `src/lib/themes/registry.ts` (bundled JS, not tree-shaken). Colors apply after React hydrates (`useEffect`). Global CSS in `globals.css` provides Tailwind/shadcn variable wiring; theme colors come from inline variables.

**CSP requirement:** `style-src` must include `'unsafe-inline'`. Next.js sets this in `next.config.ts`. **Nginx must not send a second, stricter CSP** — that blocks theme colors while layout may still look partially styled.

---

## Production Troubleshooting

### Symptom: Layout works but theme colors missing

**Cause (most common):** Duplicate Nginx CSP blocking inline styles on `<html>`.

Diagnose:

```bash
curl -I https://hadeswatch.com | grep -i "content-security-policy\|x-frame-options\|referrer-policy\|strict-transport-security"
```

If you see two `content-security-policy` lines, or one without `'unsafe-inline'` in `style-src`, fix Nginx:

1. Remove backup configs from `sites-enabled`:

```bash
ls -la /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/*.bak
sudo rm /etc/nginx/sites-enabled/*~
```

2. Edit `/etc/nginx/sites-available/hadeswatch` — comment out or delete old `add_header` lines (especially `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`).

3. Reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

4. Hard-refresh browser (Ctrl+Shift+R). Check DevTools → Elements → `<html>` should have `data-theme="..."` and inline `--background`, `--primary`, etc.

See `docs/NGINX.md` for the corrected config template.

### Symptom: Unstyled / broken layout (no CSS at all)

**Cause:** Standalone server missing static files.

Fix:

```bash
cd /opt/hades-watch-next
npm run deploy:standalone-assets
# or after pull + build:
npm run build

sudo systemctl restart hades-watch-next
```

Manual copy (equivalent):

```bash
cd /opt/hades-watch-next
mkdir -p .next/standalone/.next
rm -rf .next/standalone/.next/static
cp -r .next/static .next/standalone/.next/static
rm -rf .next/standalone/public
cp -r public .next/standalone/public
sudo systemctl restart hades-watch-next
```

Verify CSS loads:

```bash
curl -I https://hadeswatch.com/_next/static/css/$(curl -s https://hadeswatch.com | grep -o '_next/static/css/[^"]*\.css' | head -1 | xargs basename)
```

### Symptom: `conflicting server name` in nginx -t

Remove duplicate symlinks in `/etc/nginx/sites-enabled/` (see above).

### Symptom: Health OK but 502 from Nginx

```bash
sudo systemctl status hades-watch-next
curl -s http://127.0.0.1:3000/api/health
sudo journalctl -u hades-watch-next -n 50
```

---

## Deploy Updates (VPS)

Minimal post-pull sequence (migrations, canonical seed, build):

```bash
cd /opt/hades-watch-next
git pull
npm ci --include=dev
npm run deploy:full
sudo systemctl restart hades-watch-next
curl -s https://hadeswatch.com/api/health
```

### What each command does

| Script | Steps |
|--------|--------|
| `npm run db:generate` | Prisma client only — **does not** migrate, seed, or sync assets |
| `npm run db:deploy` | Apply migrations + regenerate Prisma client |
| `npm run db:seed` | Canonical upsert seed (factions, lore, missions, ciphers, chat, net-neighbors) — no test users |
| `npm run db:release` | `db:generate` + `db:deploy` + `db:seed` |
| `npm run deploy:update` | Alias for `db:release` — use after `git pull` when schema/seed data changed |
| `npm run deploy:full` | `deploy:update` + production `build` |
| `npm run assets:sync` | Copy source PNGs → `public/` + regenerate `avatar-imported-registry.ts` (dev/maintainer; commit results) |

Avatar/badge PNGs in `public/` and the generated registry are **committed in git**. On VPS you normally do **not** run `assets:sync` — `git pull` already delivers them. Run `assets:sync` locally when adding files under `src/components/avatar/avatar assets/`, then commit and push.

### Granular (if you need one step only)

```bash
npm run db:deploy      # migrations only
npm run db:seed        # canonical seed only
npm run build          # prisma generate + next build (+ postbuild standalone assets)
```

---

## Local vs Production

| Concern | Local Dev | Production |
|---------|-----------|------------|
| `.env` | `.env` (gitignored) | Server-only, mode `600` |
| Migrations | `npm run db:migrate` | `npm run db:deploy` |
| Seed | `npm run db:seed` | **Never** |
| Start | `npm run dev` | `node .next/standalone/server.js` |
| Static assets | automatic | `postbuild` copies into standalone |

---

## Documentation Index

| Doc | Purpose |
|-----|---------|
| `docs/SYSTEMD_DEPLOYMENT.md` | systemd + standalone |
| `docs/NGINX.md` | Reverse proxy (no duplicate headers) |
| `docs/DOCKER_DEPLOYMENT.md` | Docker path |
| `docs/POSTGRES_PRODUCTION.md` | Database |
| `docs/CLOUDFLARE.md` | DNS/TLS |
| `docs/SMOKE_TESTS.md` | Post-deploy tests |
| `docs/ROLLBACK.md` | Failure recovery |

---

## Phase Status

- **Phase 6A** — Deployment runbooks
- **Phase 6B** — Live at hadeswatch.com (standalone + Nginx)
