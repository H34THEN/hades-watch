# Owner Signal Deck & Signal Player

Hades Watch stores Chthonic broadcasts (Suno albums, underworld audio) on disk and serves them through a global **Signal Player**. Upload and management is **Owner-only** via the **Owner Signal Deck**.

## Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/admin/media` | Admin+ (read), Owner (write) | Album/track registry |
| `/admin/media/upload` | Owner only | Direct browser upload |
| `/api/media/tracks` | Session-aware | Playlist for Signal Player |
| `/api/media/audio/[trackId]` | Visibility-gated | Stream audio (range requests supported) |

## Storage

Files are **not** stored in Postgres or Git.

```txt
storage/uploads/audio/tracks   # audio files
storage/uploads/audio/covers   # optional album art
```

On VPS:

```txt
/opt/hades-watch-next/storage/uploads/audio/tracks
/opt/hades-watch-next/storage/uploads/audio/covers
```

**Back up this directory separately.** Deploys do not include uploaded audio.

Create directories on first upload, or manually:

```bash
mkdir -p storage/uploads/audio/tracks storage/uploads/audio/covers
```

## Upload rules

- **Owner only** (`Upload Signal` button)
- Formats: `.mp3`, `.m4a`, `.wav`, `.ogg`
- Max size: **50 MB** per track
- MIME type and extension validated (`.mp3` allowed even if browser reports `application/octet-stream`)
- Stored filenames use safe random prefixes — original names are never trusted
- Next.js server action body limit is configured to **50mb** in `next.config.ts` (`experimental.serverActions.bodySizeLimit`)

### Album during upload

On `/admin/media/upload` you can:

1. **Select an existing album** from the dropdown, OR
2. **Type a new album name** in the text field, OR
3. Leave both empty for a standalone/unassigned track

Do not fill both the dropdown and the new album field — the form will reject that combination.

New albums are created automatically (or matched case-insensitively by title if one already exists).

Optional new-album fields:

- `newAlbumArtistName`
- `newAlbumDescription`
- `trackNumber`

## CLI import (fallback / recovery)

Import a local file without the browser:

```bash
npm run media:import-track -- "/path/to/song.mp3" \
  --title "Salt on the Tongue Fixed" \
  --album "Album One" \
  --artist "Heathen" \
  --track 1 \
  --visibility APPROVED_USERS
```

The script copies the file into `storage/uploads/audio/tracks`, creates/upserts the album if `--album` is set, writes `MediaTrack` metadata, and prints the track ID. It does **not** delete the source file.

Requires `DATABASE_URL` and an Owner user in the database.

## Testing with one song

1. Log in as Owner
2. Open `/admin/media/upload`
3. Upload one `.mp3` with visibility `APPROVED_USERS` or `PUBLIC`
4. Type a new album name or select an existing album
5. Visit any page — confirm collapsed **Signal Player** button (no audio)
6. Open player → select track → press **Open Signal**
7. Refresh — confirm no autoplay

## Visibility

| Value | Playback |
|-------|----------|
| `PUBLIC` | Anyone |
| `APPROVED_USERS` | Approved, non-disabled accounts |
| `PRIVATE` | Owner / Admin only |
| `HIDDEN` | Owner / Admin only (hidden from public playlist) |

Email verification is **not** used as a gate.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| Generic “Page couldn't load” after upload | Server action body exceeded 1 MB default | Deploy with `bodySizeLimit: '50mb'` in `next.config.ts`; on VPS also raise Nginx `client_max_body_size` if proxied |
| Inline “Upload Failed” with body size message | File > 50 MB or proxy limit | Use smaller file or raise limits consistently |
| `tsx: not found` on VPS | Dev dependency missing | Run `npm ci --include=dev` before `media:import-track` |
| Permission denied on upload | `storage/uploads/audio/` not writable | `mkdir -p` dirs and chown to service user |
| Track in admin but player won't stream | Missing file on disk or wrong path | Confirm file under `storage/uploads/audio/tracks/`; check `/api/media/audio/[id]` |
| Unsupported MIME type | Browser sent uncommon type | Rename to `.mp3` and retry; extension is authoritative |
| Album not created | Only dropdown used with empty selection | Type a name in **Or type new album name** |

Upload errors are shown inline on `/admin/media/upload` — they should not crash to a generic error page after these fixes.

## Signal Player behavior

- Fixed bottom-right corner
- Default: **collapsed** (`Signal Player` button)
- **No autoplay** — audio `preload="none"`; playback starts only after user opens player and presses **Open Signal**
- Persists open/collapsed, volume, and last track in `localStorage`
- Continues across pages via `SignalPlayerProvider` in root layout

## Removing tracks

Owner Signal Deck → track row → **Delete** (confirms, removes DB row and file from disk).

## Components

- `src/components/media/SignalPlayer.tsx`
- `src/components/media/SignalPlayerProvider.tsx`
- `src/lib/actions/media.ts`
- `src/lib/media/storage.ts`
