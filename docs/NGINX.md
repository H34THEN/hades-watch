# Nginx Configuration — hadeswatch.com

Nginx reverse-proxies HTTPS traffic to the Next.js standalone server at `http://127.0.0.1:3000`.

**Do not duplicate security headers in Nginx.** The Next.js app sets CSP and other headers via `next.config.ts`. Duplicate headers (especially CSP) break theme styling.

---

## Install

```bash
sudo apt install -y nginx
```

## Critical: No Duplicate Security Headers

Hades Watch themes apply CSS variables via **inline styles on `<html>`** (client-side `style.setProperty` in `ThemeProvider`). That requires a CSP with `style-src 'unsafe-inline'`.

The app sends:

```txt
content-security-policy: ... style-src 'self' 'unsafe-inline' ...
```

If Nginx also sends an older CSP such as:

```txt
style-src 'self' https://openfpcdn.io;
```

browsers may apply the stricter policy and **block theme colors** while layout/CSS files still load.

**Fix:** Remove or comment out all `add_header` security directives from Nginx. Let Next.js control CSP.

Check for duplicates:

```bash
curl -I https://hadeswatch.com | grep -i "content-security-policy\|x-frame-options\|referrer-policy\|strict-transport-security"
```

You should see **one** value per header (from the app), not two.

## Remove Backup Configs from sites-enabled

Duplicate `server_name` warnings mean multiple configs are active:

```txt
conflicting server name "www.hadeswatch.com" on 0.0.0.0:443, ignored
```

List enabled sites:

```bash
ls -la /etc/nginx/sites-enabled/
```

Remove backup symlinks (keep only the live config):

```bash
sudo rm /etc/nginx/sites-enabled/hadeswatch.bak
sudo rm /etc/nginx/sites-enabled/hadeswatch.com.bak
# remove any *.bak, *~, or duplicate hadeswatch entries
sudo nginx -t
sudo systemctl reload nginx
```

## Site Config

Create or edit `/etc/nginx/sites-available/hadeswatch` (or `hadeswatch.com`):

```nginx
# Rate limit zone (optional)
limit_req_zone $binary_remote_addr zone=hades_limit:10m rate=10r/s;

# HTTP → HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name hadeswatch.com www.hadeswatch.com;

    return 301 https://hadeswatch.com$request_uri;
}

# HTTPS — primary
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hadeswatch.com;

    # --- TLS certificates (choose one approach) ---
    # Option A: Cloudflare Origin Certificate
    # ssl_certificate     /etc/ssl/cloudflare/hadeswatch.com.pem;
    # ssl_certificate_key /etc/ssl/cloudflare/hadeswatch.com.key;

    # Option B: Let's Encrypt (certbot)
    # ssl_certificate     /etc/letsencrypt/live/hadeswatch.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/hadeswatch.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    access_log /var/log/nginx/hadeswatch.access.log;
    error_log  /var/log/nginx/hadeswatch.error.log warn;

    client_max_body_size 10m;

    # -------------------------------------------------------------------------
    # DO NOT add security headers here — Next.js sets them (see next.config.ts).
    # Old configs often had lines like these; COMMENT THEM OUT or DELETE:
    #
    # add_header X-Frame-Options "SAMEORIGIN";
    # add_header X-Content-Type-Options "nosniff";
    # add_header X-XSS-Protection "1; mode=block";
    # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    # add_header Referrer-Policy "no-referrer-when-downgrade";
    # add_header Content-Security-Policy "default-src 'self'; script-src ... style-src 'self' https://openfpcdn.io;";
    #
    # Duplicate CSP blocks inline theme CSS variables on <html>.
    # -------------------------------------------------------------------------

    location / {
        limit_req zone=hades_limit burst=20 nodelay;

        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;

        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }
}

# www → apex redirect (single 443 block avoids server_name conflicts)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.hadeswatch.com;

    # Same ssl_certificate paths as above
    return 301 https://hadeswatch.com$request_uri;
}
```

Enable site (one symlink only):

```bash
sudo ln -sf /etc/nginx/sites-available/hadeswatch /etc/nginx/sites-enabled/hadeswatch
sudo nginx -t
sudo systemctl reload nginx
```

## Cloudflare Origin Certificate

When Cloudflare SSL mode is **Full (strict)**:

1. Cloudflare Dashboard → SSL/TLS → Origin Server → Create Certificate
2. Save cert and key to `/etc/ssl/cloudflare/` (permissions `600`)
3. Reference paths in the `ssl_certificate` directives above

See `docs/CLOUDFLARE.md`.

## Verify

```bash
curl -I https://hadeswatch.com
curl -s https://hadeswatch.com/api/health
```

Confirm CSP includes `style-src 'self' 'unsafe-inline'` and appears only once.

## App Env

```env
TRUSTED_PROXY_HEADERS=true
AUTH_URL=https://hadeswatch.com
NEXT_PUBLIC_APP_URL=https://hadeswatch.com
```

## Related

- `docs/DEPLOYMENT.md` — production troubleshooting
- `docs/CLOUDFLARE.md`
- `docs/SYSTEMD_DEPLOYMENT.md`
