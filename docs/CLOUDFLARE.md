# Cloudflare + Domain — hadeswatch.com

DNS and TLS configuration for **Hades Watch** on Hostinger VPS.

Do not invent VPS IP addresses — use your actual Hostinger server IP.

---

## DNS Records

In Cloudflare DNS for `hadeswatch.com`:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `<YOUR_VPS_IP>` | Proxied (orange cloud) |
| CNAME | `www` | `hadeswatch.com` | Proxied (optional) |

TTL: Auto when proxied.

## SSL/TLS Mode

Recommended progression:

1. **Flexible** — only during initial HTTP testing (not for launch)
2. **Full** — origin serves HTTPS with any cert
3. **Full (strict)** — origin serves valid cert (recommended for launch)

For **Full (strict)** with Cloudflare Origin Certificate:

1. Cloudflare → SSL/TLS → Origin Server → Create Certificate
2. Install on VPS at `/etc/ssl/cloudflare/` (see `docs/NGINX.md`)
3. Set mode to **Full (strict)**

## HTTPS Redirect

- Cloudflare: SSL/TLS → Edge Certificates → **Always Use HTTPS** = On
- Nginx: HTTP → HTTPS redirect (see `docs/NGINX.md`)

## HSTS Caution

Next.js sets `Strict-Transport-Security` in production (`next.config.ts`). Cloudflare can also enable HSTS.

**Warning:** HSTS is difficult to undo. Enable only after HTTPS is stable on all paths.

## Firewall (VPS)

Expose only:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

**Do not** expose:

- PostgreSQL (5432)
- Node app port (3000) — Nginx proxies locally
- Docker ports except via localhost binding

## Cloudflare Security (Pre-Launch)

- Bot Fight Mode or Super Bot Fight Mode
- WAF managed rules (if plan allows)
- Rate limiting rules on `/login`, `/register`, `/api/auth/*` (supplement app rate limits)
- Challenge suspicious traffic

## Trusted Proxy Headers

When behind Cloudflare + Nginx, set in production `.env`:

```env
TRUSTED_PROXY_HEADERS=true
AUTH_URL=https://hadeswatch.com
NEXT_PUBLIC_APP_URL=https://hadeswatch.com
```

## Email DNS (see `docs/EMAIL.md`)

For `noreply@hadeswatch.com`:

- **SPF** — authorize your SMTP provider
- **DKIM** — provider signing key
- **DMARC** — `p=none` initially, tighten after monitoring

## Verification

```bash
dig hadeswatch.com +short
curl -I https://hadeswatch.com
curl -s https://hadeswatch.com/api/health
```

## Related

- `docs/NGINX.md`
- `docs/DEPLOYMENT.md`
- `docs/LAUNCH_CHECKLIST.md`
