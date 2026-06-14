#!/usr/bin/env bash
# Copy Next.js static output into the standalone bundle (required for CSS/JS/fonts).
# Safe to run after every production build. Does nothing if standalone was not built.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STANDALONE="$ROOT/.next/standalone"

if [ ! -d "$STANDALONE" ]; then
  echo "[copy-standalone-assets] No .next/standalone — skipping (build without standalone output?)"
  exit 0
fi

if [ ! -d "$ROOT/.next/static" ]; then
  echo "[copy-standalone-assets] No .next/static — run npm run build first"
  exit 1
fi

mkdir -p "$STANDALONE/.next"
rm -rf "$STANDALONE/.next/static"
cp -r "$ROOT/.next/static" "$STANDALONE/.next/static"

if [ -d "$ROOT/public" ]; then
  rm -rf "$STANDALONE/public"
  cp -r "$ROOT/public" "$STANDALONE/public"
fi

echo "[copy-standalone-assets] Copied .next/static and public into .next/standalone"
