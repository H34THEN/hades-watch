# Docker Compose Deployment — Hades Watch

Docker path for Hostinger VPS or any Linux host with Docker Engine installed.

Nginx on the **host** should reverse-proxy to `127.0.0.1:3000` (see `docs/NGINX.md`).

---

## Prerequisites

- Docker Engine + Docker Compose plugin
- `.env` file on server (never committed)
- Nginx configured on host (recommended)

## 1. Prepare Files

```bash
git clone <YOUR_GITHUB_REPO_URL> /opt/hades-watch
cd /opt/hades-watch
cp docker-compose.example.yml docker-compose.yml
cp .env.example .env
chmod 600 .env
nano .env
```

Set production values per `.env.example`. For Compose-internal DB:

```env
DATABASE_URL="postgresql://archivist:STRONG_PASSWORD@db:5432/hadeswatch_db?schema=public"
```

For **external Postgres**, remove the `db` service from `docker-compose.yml` and point `DATABASE_URL` at your managed instance.

## 2. Build and Start Database

```bash
docker compose up -d db
docker compose ps
```

Wait until `db` is healthy.

## 3. Run Migrations (before web traffic)

Migrations run from the host (recommended) so Prisma CLI is available:

```bash
npm ci
npm run db:generate
npm run db:deploy
```

Alternatively, one-off migrate container:

```bash
docker compose run --rm \
  -e DATABASE_URL="postgresql://archivist:STRONG_PASSWORD@db:5432/hadeswatch_db" \
  --entrypoint npx \
  web prisma migrate deploy
```

Note: the production `web` image is a slim standalone build without full Prisma CLI — prefer host-side `npm run db:deploy`.

**Never** run `npm run db:seed` in production.

## 4. Build and Start Web

```bash
docker compose build web
docker compose up -d
docker compose ps
docker compose logs -f web
```

## 5. Health Check

```bash
curl -s http://127.0.0.1:3000/api/health | jq
```

## 6. Owner Bootstrap

```bash
ALLOW_PROD_ADMIN_BOOTSTRAP=true npm run db:bootstrap
```

See `docs/ADMIN_BOOTSTRAP.md`. Unset the env var after use.

## 7. Port Binding

`docker-compose.example.yml` binds web to `127.0.0.1:3000` so Postgres and the app are not exposed publicly. Only Nginx should face the internet on 80/443.

## 8. Updates

```bash
# backup DB first — docs/BACKUPS.md
git pull
docker compose build web
npm run db:deploy
docker compose up -d web
curl -s http://127.0.0.1:3000/api/health
```

## 9. Backups

```bash
docker compose exec db pg_dump -U archivist -d hadeswatch_db -F c -f /tmp/backup.dump
docker cp $(docker compose ps -q db):/tmp/backup.dump ./hadeswatch_backup.dump
```

See `docs/BACKUPS.md`.

## 10. Logs

```bash
docker compose logs -f web
docker compose logs -f db
```

## External Postgres Option

1. Remove `db` service from `docker-compose.yml`
2. Set `DATABASE_URL` to external host with SSL if required
3. Remove `depends_on: db` from `web`
4. Run `npm run db:deploy` against external URL

## Related Docs

- `Dockerfile` — multi-stage, non-root user, healthcheck
- `docs/NGINX.md`
- `docs/ROLLBACK.md`
- `docs/SMOKE_TESTS.md`
