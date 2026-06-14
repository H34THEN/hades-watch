# Nginx Configuration — hadeswatch.com

Nginx reverse-proxies HTTPS traffic to the Next.js app at `127.0.0.1:3000`.

Use with systemd or Docker Compose (app bound to localhost).

---

## Install

```bash
sudo apt install -y nginx
```

## Site Config

Create `/etc/nginx/sites-available/hadeswatch.com`:

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

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hadeswatch.com www.hadeswatch.com;

    # --- TLS certificates (choose one approach) ---
    # Option A: Cloudflare Origin Certificate
    # ssl_certificate     /etc/ssl/cloudflare/hadeswatch.com.pem;
    # ssl_certificate_key /etc/ssl/cloudflare/hadeswatch.com.key;

    # Option B: Let's Encrypt (certbot)
    # ssl_certificate     /etc/letsencrypt/live/hadeswatch.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/hadeswatch.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Logs
    access_log /var/log/nginx/hadeswatch.access.log;
    error_log  /var/log/nginx/hadeswatch.error.log warn;

    # Upload/body size
    client_max_body_size 10m;

    # Security headers (app also sets some via Next.js)
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        limit_req zone=hades_limit burst=20 nodelay;

        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket / HMR not needed in production but harmless
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

# Redirect www → apex (optional separate block if preferred)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.hadeswatch.com;

    # Same ssl_certificate paths as above
    return 301 https://hadeswatch.com$request_uri;
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/hadeswatch.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Cloudflare Origin Certificate

When Cloudflare SSL mode is **Full (strict)**:

1. Cloudflare Dashboard → SSL/TLS → Origin Server → Create Certificate
2. Save cert and key to `/etc/ssl/cloudflare/` (permissions `600`)
3. Reference paths in the `ssl_certificate` directives above

See `docs/CLOUDFLARE.md`.

## Let's Encrypt Alternative

```bash
sudo certbot --nginx -d hadeswatch.com -d www.hadeswatch.com
```

## Verify

```bash
curl -I https://hadeswatch.com
curl -s https://hadeswatch.com/api/health
```

## App Env

Set in production `.env`:

```env
TRUSTED_PROXY_HEADERS=true
AUTH_URL=https://hadeswatch.com
NEXT_PUBLIC_APP_URL=https://hadeswatch.com
```

## Related

- `docs/CLOUDFLARE.md`
- `docs/SYSTEMD_DEPLOYMENT.md`
- `docs/DOCKER_DEPLOYMENT.md`
