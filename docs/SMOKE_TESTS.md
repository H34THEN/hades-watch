# Launch Smoke Tests

Run after deployment, before announcing **hadeswatch.com** publicly.

Record pass/fail for each item. Fix failures before launch.

---

## Public Pages

- [ ] `https://hadeswatch.com/` loads without errors
- [ ] `/about` loads
- [ ] `/themes` loads; theme switcher works
- [ ] `/invite` loads
- [ ] `/login` loads
- [ ] No stack traces or Prisma errors in browser
- [ ] HTTPS certificate valid (no browser warnings)

## Auth Flows

- [ ] Valid production invite code accepted at `/invite`
- [ ] Invalid/expired invite rejected with safe message
- [ ] Registration completes with invite
- [ ] Email verification email received (if SMTP + enforcement on)
- [ ] `/verify-email` completes verification
- [ ] Login succeeds with verified account
- [ ] Logout works
- [ ] `/forgot-password` shows generic response (no enumeration)
- [ ] Password reset email received and `/reset-password` works
- [ ] Protected routes redirect unauthenticated users to login

## RBAC

- [ ] Member cannot access `/admin`
- [ ] Member cannot access `/moderation`
- [ ] Moderator can access `/moderation`
- [ ] Admin/Owner can access `/admin`
- [ ] Owner can create and revoke invites at `/admin/invites`

## Core Systems

- [ ] Transmissions visible at `/dashboard/transmissions`
- [ ] Events visible at `/events` and `/dashboard/events`
- [ ] Event with Jitsi link renders meeting URL (external meet.jit.si)
- [ ] Profile update works (`/profile`)
- [ ] Theme preference persists after reload and re-login
- [ ] Character create/edit works (`/mmo/character`)
- [ ] Faction request works (`/mmo/factions`)
- [ ] Mission join/leave works (`/mmo/missions`)
- [ ] Lore unlock works (`/archive/lore`)
- [ ] Dead drop page shows roleplay disclaimer (not secure messaging)
- [ ] Cipher solve works (`/ciphers`)

## Operations

- [ ] `curl https://hadeswatch.com/api/health` → `status: ok`, `database: connected`
- [ ] Nginx access/error logs show no repeated 5xx
- [ ] App logs (`journalctl -u hades-watch` or `docker compose logs web`) clean
- [ ] Latest Prisma migration applied (`npm run db:deploy` or `_prisma_migrations` table)
- [ ] Zero active `DEV-*` invites (see `docs/ADMIN_BOOTSTRAP.md`)
- [ ] `/admin/launch` checklist green or documented exceptions

## Security Quick Checks

- [ ] `DISABLE_DEV_INVITES=true`
- [ ] `RATE_LIMIT_ENABLED=true`
- [ ] Rate limit triggers after repeated failed logins (optional spot check)
- [ ] Security headers present (`curl -I https://hadeswatch.com`)

## Sign-Off

| Role | Name | Date | Result |
|------|------|------|--------|
| Operator | | | |
| Owner | | | |

## Related

- `docs/LAUNCH_CHECKLIST.md`
- `docs/ROLLBACK.md`
- `docs/ADMIN_BOOTSTRAP.md`
