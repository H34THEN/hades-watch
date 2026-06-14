# Hades Watch Backups

## What to Back Up

1. **PostgreSQL database** — users, roles, game state, audit logs, invites
2. **Uploaded assets** — if/when user uploads are added (`public/assets`)
3. **Environment secrets** — password manager only; not plaintext on shared drives
4. **Nginx config** — `/etc/nginx/sites-available/hadeswatch.com`

## PostgreSQL Dump

### Host PostgreSQL

```bash
pg_dump -h localhost -U archivist -d hadeswatch_db -F c \
  -f hadeswatch_$(date +%Y%m%d_%H%M).dump
```

### Docker Compose

```bash
docker compose exec db pg_dump -U archivist -d hadeswatch_db -F c -f /tmp/backup.dump
docker cp $(docker compose ps -q db):/tmp/backup.dump ./hadeswatch_backup.dump
```

### Remote / Managed DB

Use connection string host; enable SSL as required by provider.

## Automated Daily Backup (cron example)

```bash
# /etc/cron.d/hadeswatch-backup (adjust paths)
0 3 * * * archivist pg_dump -h localhost -U archivist -d hadeswatch_db -F c -f /var/backups/hadeswatch/hadeswatch_$(date +\%Y\%m\%d).dump
```

Store off-server (S3, another VPS, encrypted storage). Rotate per retention policy.

## Restore Test

Always test restores on a **non-production** instance:

```bash
createdb -h localhost -U archivist hadeswatch_restore_test
pg_restore -h localhost -U archivist -d hadeswatch_restore_test -c hadeswatch_YYYYMMDD.dump
```

## Before Migrations / Deploys

Mandatory pre-deploy backup:

```bash
pg_dump -h localhost -U archivist -d hadeswatch_db -F c -f pre_migrate_backup.dump
npm run db:deploy
```

See `docs/ROLLBACK.md` if restore is needed.

## Where NOT to Store Backups

- Public S3 buckets without encryption
- Unencrypted laptop sync folders
- Git repositories
- Slack / Discord attachments

## Retention

| Environment | Recommendation |
|-------------|----------------|
| Local dev | Optional |
| Production | Daily + 7 daily / 4 weekly minimum |

Encrypt backups at rest. Document restore in runbook drills.

## Assets

Theme and static assets are in git. User-generated content backups depend on future upload features.

## Related

- `docs/POSTGRES_PRODUCTION.md`
- `docs/ROLLBACK.md`
- `docs/VPS_RUNBOOK.md`
