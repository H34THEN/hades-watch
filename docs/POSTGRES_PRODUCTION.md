# PostgreSQL Production Setup — Ubuntu 22.04

Production database for **Hades Watch** on Hostinger VPS or managed Postgres.

**Never** use dev credentials (`archivist` / `your_password` from `.env.example` examples without rotation).

---

## Option A: Local PostgreSQL on VPS

### Install

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Create User and Database

Generate a strong password:

```bash
openssl rand -base64 24
```

As `postgres` superuser:

```bash
sudo -u postgres psql
```

```sql
-- Replace STRONG_PASSWORD with generated value
CREATE USER archivist WITH PASSWORD 'STRONG_PASSWORD';
CREATE DATABASE hadeswatch_db OWNER archivist;
GRANT ALL PRIVILEGES ON DATABASE hadeswatch_db TO archivist;
\c hadeswatch_db
GRANT ALL ON SCHEMA public TO archivist;
\q
```

### Connection String

```env
DATABASE_URL="postgresql://archivist:STRONG_PASSWORD@localhost:5432/hadeswatch_db?schema=public"
```

Store in `/opt/hades-watch/.env` with mode `600`. Never commit.

### Bind to Localhost Only

Edit `/etc/postgresql/14/main/postgresql.conf` (version may vary):

```conf
listen_addresses = 'localhost'
```

Verify `/etc/postgresql/14/main/pg_hba.conf` allows local connections only:

```conf
local   all   all   peer
host    all   all   127.0.0.1/32   scram-sha-256
host    all   all   ::1/128        scram-sha-256
```

Restart:

```bash
sudo systemctl restart postgresql
```

**Do not** expose port 5432 to the public internet. UFW should not allow 5432.

## Option B: Docker Compose Postgres

See `docker-compose.example.yml`. Bind to `127.0.0.1:5432` only.

Use a strong `POSTGRES_PASSWORD` in `.env` — not `change-me-local-only`.

## Option C: Managed PostgreSQL

Hostinger managed DB or external provider:

- Use provider connection string
- Enable SSL: append `?sslmode=require` if required
- Restrict network access to VPS IP only

---

## Migrations (Production)

**Always** backup first (`docs/BACKUPS.md`).

```bash
cd /opt/hades-watch
npm run db:deploy
```

This runs `prisma migrate deploy`.

| Command | Production |
|---------|------------|
| `npm run db:deploy` | ✅ Yes |
| `npm run db:migrate` | ❌ Never (`migrate dev`) |
| `npm run db:seed` | ❌ Never (dev invites) |
| `npm run db:reset` | ❌ Never (destructive) |
| `npm run db:push` | ❌ Never (bypasses migrations) |

## Verify

```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM _prisma_migrations;"
curl -s http://127.0.0.1:3000/api/health
```

## Backup

```bash
pg_dump -h localhost -U archivist -d hadeswatch_db -F c \
  -f hadeswatch_$(date +%Y%m%d_%H%M).dump
```

Docker:

```bash
docker compose exec db pg_dump -U archivist -d hadeswatch_db -F c -f /tmp/backup.dump
```

See `docs/BACKUPS.md`.

## Restore (Disaster Recovery)

On a **non-production** instance first:

```bash
pg_restore -h localhost -U archivist -d hadeswatch_restore_test -c backup.dump
```

Production restore requires stopping the app, restoring, then restarting. See `docs/ROLLBACK.md`.

## Security Checklist

- [ ] Strong unique password (not dev default)
- [ ] PostgreSQL listens on localhost only (or provider private network)
- [ ] Port 5432 not in UFW allow rules
- [ ] Pre-migration backup taken
- [ ] No `DEV-*` invites after bootstrap (`docs/ADMIN_BOOTSTRAP.md`)

## Related

- `docs/VPS_RUNBOOK.md`
- `docs/SYSTEMD_DEPLOYMENT.md`
- `docs/DOCKER_DEPLOYMENT.md`
