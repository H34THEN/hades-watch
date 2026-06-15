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
- MIME type and extension validated
- Stored filenames are random — original names are never trusted

## Visibility

| Value | Playback |
|-------|----------|
| `PUBLIC` | Anyone |
| `APPROVED_USERS` | Approved, non-disabled accounts |
| `PRIVATE` | Owner / Admin only |
| `HIDDEN` | Owner / Admin only (hidden from public playlist) |

Email verification is **not** used as a gate.

## Signal Player behavior

- Fixed bottom-right corner
- Default: **collapsed** (`Signal Player` button)
- **No autoplay** — audio `preload="none"`; playback starts only after user opens player and presses **Open Signal**
- Persists open/collapsed, volume, and last track in `localStorage`
- Continues across pages via `SignalPlayerProvider` in root layout

## Testing with one song

1. Log in as Owner
2. Open `/admin/media/upload`
3. Upload one `.mp3` with visibility `APPROVED_USERS` or `PUBLIC`
4. Visit any page — confirm collapsed **Signal Player** button (no audio)
5. Open player → select track → press **Open Signal**
6. Refresh — confirm no autoplay

## Removing tracks

Owner Signal Deck → track row → **Delete** (confirms, removes DB row and file from disk).

## Components

- `src/components/media/SignalPlayer.tsx`
- `src/components/media/SignalPlayerProvider.tsx`
- `src/lib/actions/media.ts`
- `src/lib/media/storage.ts`
