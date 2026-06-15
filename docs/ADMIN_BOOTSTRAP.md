# Admin Bootstrap — First Production Owner

Safe procedure for creating the first **Owner** account in production.

**Never** use `DEV-*` invite codes in production.

---

## Prerequisites

- `npm run db:deploy` completed
- `DISABLE_DEV_INVITES=true` in `.env`
- No active `DEV-*` invites in database
- Strong `AUTH_SECRET` and database password set

---

## Option 1: Bootstrap Script (Recommended)

One-time script gated by environment variable.

### Run

```bash
cd /opt/hades-watch
ALLOW_PROD_ADMIN_BOOTSTRAP=true npm run db:bootstrap
```

Requirements:

- `ALLOW_PROD_ADMIN_BOOTSTRAP=true` must be set
- Refuses if active dev invites exist
- Creates single-use `OWNER-BOOTSTRAP-XXXXXXXX` invite with Owner role
- Sets `autoApproveOnRegister=true` so Owner registers without manual approval
- Prints code **once** to stdout

### Register

1. Visit `https://hadeswatch.com/invite`
2. Enter the bootstrap code
3. Complete registration at `/register`
4. Verify email if `REQUIRE_EMAIL_VERIFICATION=true`

### Cleanup

1. Remove from `.env`: `ALLOW_PROD_ADMIN_BOOTSTRAP=true`
2. Revoke bootstrap invite in Admin → Invites (or SQL below)
3. Create normal Admin invites as needed

---

## Option 2: Manual SQL Invite

If you prefer not to run the script:

```bash
psql "$DATABASE_URL"
```

```sql
-- Generate a unique code, e.g. PROD-OWNER-INIT-2026
INSERT INTO "InviteCode" (
  id, code, "roleGranted", "maxUses", "useCount", revoked, "isDevCode", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'PROD-OWNER-INIT-REPLACE_ME',
  'Owner',
  1,
  0,
  false,
  false,
  NOW(),
  NOW()
);
```

Replace the code with a strong random value. Register via `/invite`, then revoke the invite.

---

## Option 3: Manual Role Assignment

1. Register any user with a one-time production invite (Member role)
2. As database admin, promote to Owner:

```sql
-- After first user registers (replace USER_ID)
INSERT INTO "UserRole" (id, "userId", "roleId", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, 'USER_ID', r.id, NOW(), NOW()
FROM "Role" r WHERE r.name = 'Owner'
ON CONFLICT DO NOTHING;
```

Use only if bootstrap script and SQL invite are unavailable. Prefer Options 1 or 2.

---

## Revoke / Delete DEV-* Invites

Before launch, remove all development invites.

### List active dev invites

```sql
SELECT id, code, "roleGranted", revoked, "isDevCode"
FROM "InviteCode"
WHERE "isDevCode" = true OR code LIKE 'DEV-%';
```

### Revoke (preferred — preserves audit trail)

```sql
UPDATE "InviteCode"
SET revoked = true, "updatedAt" = NOW()
WHERE "isDevCode" = true OR code LIKE 'DEV-%';
```

### Delete (if no audit requirement)

```sql
DELETE FROM "InviteCode"
WHERE "isDevCode" = true OR code LIKE 'DEV-%';
```

### Verify

```sql
SELECT COUNT(*) FROM "InviteCode"
WHERE ( "isDevCode" = true OR code LIKE 'DEV-%' ) AND revoked = false;
-- Expect 0
```

Also confirm `.env` has `DISABLE_DEV_INVITES=true` so seed never recreates dev codes.

---

## What NOT to Do

- ❌ Run `npm run db:seed` in production
- ❌ Use `DEV-ADMIN`, `DEV-MOD`, or any `DEV-*` code
- ❌ Leave `ALLOW_PROD_ADMIN_BOOTSTRAP=true` after bootstrap
- ❌ Create default admin username/password in code or docs
- ❌ Commit invite codes or secrets to git

---

## Post-Bootstrap

1. Log in as Owner at `/admin`
2. Review `/admin/launch` checklist
3. Create production invites for Admins/Moderators
4. Run smoke tests (`docs/SMOKE_TESTS.md`)

## Related

- `prisma/scripts/bootstrap-owner-invite.ts`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/SMOKE_TESTS.md`
