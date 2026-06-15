#!/usr/bin/env bash
# Quick checks after deploy — run from repo root on the VPS.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Hades Watch production deploy verification ==="
echo "Repo: $ROOT"
echo "HEAD: $(git log -1 --oneline 2>/dev/null || echo 'unknown')"
echo

WORLD_ROUTE="$ROOT/.next/standalone/.next/server/app/archive/world/[slug]/page.js"
WORLD_INDEX="$ROOT/.next/standalone/.next/server/app/archive/world/page.js"
SERVER_JS="$ROOT/.next/standalone/server.js"

if [ ! -f "$SERVER_JS" ]; then
  echo "✗ Missing $SERVER_JS — run: npm run build"
  exit 1
fi
echo "✓ standalone server.js present ($(stat -c %y "$SERVER_JS" 2>/dev/null || stat -f %Sm "$SERVER_JS"))"

if [ ! -f "$WORLD_ROUTE" ]; then
  echo "✗ Missing world lore detail route in standalone build"
  echo "  Expected: $WORLD_ROUTE"
  echo "  Fix: npm run build && systemctl restart hades-watch-next"
  exit 1
fi
echo "✓ /archive/world/[slug] route built"

if [ ! -f "$WORLD_INDEX" ]; then
  echo "✗ Missing /archive/world index route"
  exit 1
fi
echo "✓ /archive/world index route built"

if command -v npm >/dev/null 2>&1; then
  npm run db:verify:world-lore 2>/dev/null || {
    echo "! World lore DB check skipped or failed — run: npm run db:verify:world-lore"
  }
fi

if [ -f "$ROOT/.next/standalone/server.js" ]; then
  WD_OK=$(systemctl show hades-watch-next -p WorkingDirectory --value 2>/dev/null || true)
  if [ -n "$WD_OK" ] && [ "$WD_OK" != "$ROOT/.next/standalone" ]; then
    echo "! systemd WorkingDirectory is $WD_OK (recommended: $ROOT/.next/standalone)"
  fi
fi
echo "  1. Purge Cloudflare cache for /archive/world/*"
echo "  2. Confirm systemd uses this path: systemctl cat hades-watch-next | grep -E 'WorkingDirectory|ExecStart'"
echo "  3. Try legacy URL while logged in: /archive/lore/the-jackal-ledger"
