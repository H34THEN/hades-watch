# Avatar Forge GPT Access

Controlled request, Owner approval, and unlock-code flow for the private **Hades Watch Avatar Forge GPT** invite link.

## Security Model

**Goal:** The GPT invite URL must not appear in:

- Client-side React source
- Public static files or JSON
- Page HTML / view-source before unlock
- Public documentation
- `NEXT_PUBLIC_*` environment variables
- JavaScript sent to the browser before verification

**Storage:** Server-only environment variable:

```txt
AVATAR_FORGE_GPT_URL="…"
```

Set manually on the VPS (not committed to git). Read via `src/lib/avatar-forge/config.ts` (server modules only).

**Honest limitation:** Once the link is returned to an approved user after unlock, that user can copy or inspect it. Protection is **pre-reveal gating**, not DRM.

## User Flow

| Step | Route | Action |
|---|---|---|
| 1 | `/profile/avatar/forge` | Approved user clicks **Request Avatar Forge Access** |
| 2 | — | Status: pending Archivist review |
| 3 | `/admin/avatar-forge-access` | Owner approves request |
| 4 | Admin | Owner clicks **Generate Unlock Code** (shown once) |
| 5 | `/profile/avatar/forge` | User enters code → **Unlock Avatar Forge Link** |
| 6 | Server action | Returns URL only after hash verification |
| 7 | Browser | **Open Hades Watch Avatar Forge GPT** (new tab) |

Subsequent visits: **Reveal Avatar Forge Link** if `unlockedAt` is set (no code re-entry).

## Data Model

`AvatarForgeAccessRequest` (Prisma):

- One row per user (`userId` unique)
- Status: `PENDING` | `APPROVED` | `REJECTED` | `REVOKED`
- `unlockCodeHash` — bcrypt hash only, never plaintext in DB
- `codeExpiresAt` — optional expiry (default 30 days on generate)
- `unlockedAt` / `lastRevealedAt` — audit timestamps

## Server Actions

| Action | Who | Purpose |
|---|---|---|
| `requestAvatarForgeAccessAction` | Approved user | Create PENDING request |
| `reviewAvatarForgeAccessAction` | Owner | Approve / reject / revoke |
| `setAvatarForgeUnlockCodeAction` | Owner | Generate hashed unlock code |
| `unlockAvatarForgeLinkAction` | Approved user | Verify code, return URL |

Rate limit: 8 unlock attempts per 10 minutes per user.

## Audit Log Actions

- `avatar.forge.request`
- `avatar.forge.approve` / `reject` / `revoke`
- `avatar.forge.code.generated`
- `avatar.forge.unlock.success` / `unlock.failed`
- `avatar.forge.link.revealed`

Plaintext codes and GPT URLs are not logged.

## VPS Configuration

```bash
cd /opt/hades-watch-next
nano .env
```

Add (Owner provides the real URL):

```txt
AVATAR_FORGE_GPT_URL="https://chatgpt.com/g/…-hades-watch-avatar-forge"
```

Restart after deploy:

```bash
systemctl restart hades-watch-next
```

## Related Docs

- [AVATAR_PROMPT_REFERENCE.md](./AVATAR_PROMPT_REFERENCE.md)
- [avatarPrompts/README.md](./avatarPrompts/README.md)

## Changing the GPT Link

Update `AVATAR_FORGE_GPT_URL` on the server only. No code change required unless the env var name changes.

Revoke affected users from `/admin/avatar-forge-access` if the link must be rotated.
