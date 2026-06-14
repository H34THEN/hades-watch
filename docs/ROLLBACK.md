# Rollback Procedure

How to revert **Hades Watch** to a previous release if a deployment fails.

---

## Before Every Deploy

1. **Database backup** — mandatory

```bash
pg_dump -h localhost -U archivist -d hadeswatch_db -F c \
  -f pre_deploy_$(date +%Y%m%d_%H%M).dump
```

2. Note current git commit/tag:

```bash
git rev-parse HEAD
git describe --tags --always
```

3. Confirm health baseline:

```bash
curl -s http://127.0.0.1:3000/api/health
```

---

## Application Rollback (Code Only)

Use when new code is broken but database schema is unchanged or forward-compatible.

### systemd

```bash
sudo systemctl stop hades-watch

cd /opt/hades-watch
git fetch
git checkout <PREVIOUS_TAG_OR_COMMIT>

npm ci
npm run build
# Do NOT run db:deploy unless you know migrations are safe

sudo systemctl start hades-watch
curl -s http://127.0.0.1:3000/api/health
```

### Docker Compose

```bash
cd /opt/hades-watch
git checkout <PREVIOUS_TAG_OR_COMMIT>
docker compose build web
docker compose up -d web
curl -s http://127.0.0.1:3000/api/health
```

### Nginx

Usually unchanged during app rollback. If Nginx config changed:

```bash
sudo cp /etc/nginx/sites-available/hadeswatch.com.bak /etc/nginx/sites-available/hadeswatch.com
sudo nginx -t && sudo systemctl reload nginx
```

---

## Database Rollback Warning

**Prisma does not support automatic migration rollback.**

| Scenario | Action |
|----------|--------|
| Deploy failed before `db:deploy` | Roll back code only |
| `db:deploy` applied bad migration | Prefer **forward-fix** migration |
| Data corruption or bad migration | Restore from backup |

### Forward-Fix (Preferred)

Write a corrective migration, deploy it with `npm run db:deploy`, test on staging first.

### Restore from Backup (Last Resort)

```bash
sudo systemctl stop hades-watch
# or: docker compose stop web

pg_restore -h localhost -U archivist -d hadeswatch_db -c --if-exists pre_deploy.dump

sudo systemctl start hades-watch
curl -s http://127.0.0.1:3000/api/health
```

**Warning:** `pg_restore -c` drops objects. Test restore procedure on a copy first (`docs/BACKUPS.md`).

---

## Partial Rollback Scenarios

### Health check fails after deploy

1. Check logs: `journalctl -u hades-watch -n 100` or `docker compose logs web`
2. Verify `.env` unchanged
3. Roll back code to previous commit
4. Restart service

### Migration failed mid-deploy

1. Do not re-run blindly
2. Inspect `_prisma_migrations` table
3. Fix migration SQL or restore pre-migrate backup
4. Consult Prisma docs for failed migration recovery

### SMTP / email broken

1. Roll back env change only (no code rollback needed)
2. Restart app
3. Re-test verification and reset flows

---

## Post-Rollback Verification

- [ ] `/api/health` returns ok
- [ ] Login works
- [ ] Admin console accessible
- [ ] Run critical smoke tests (`docs/SMOKE_TESTS.md`)
- [ ] Document incident and root cause

---

## Related

- `docs/BACKUPS.md`
- `docs/SYSTEMD_DEPLOYMENT.md`
- `docs/DOCKER_DEPLOYMENT.md`
- `docs/LAUNCH_CHECKLIST.md`
