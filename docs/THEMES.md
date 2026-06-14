# Hades Watch Theme System

Eight themes ship with the foundation. Each theme defines CSS variables, optional visual overlays, and future asset slots.

## Themes

| ID | Name |
|----|------|
| `ghost-in-the-machine` | Ghost in the Machine |
| `terminal-kiddie` | Terminal Kiddie |
| `fallout-crt` | Fallout CRT |
| `neon-oracle` | Neon Oracle |
| `corporate-dystopia` | Corporate Dystopia |
| `underworld-ops` | Underworld Ops |
| `null-signal` | Null Signal |
| `arcade-necropolis` | Arcade Necropolis |

## How It Works

1. Theme definitions live in `src/lib/themes/registry.ts`.
2. `ThemeProvider` applies CSS variables to `document.documentElement` via `data-theme`.
3. **Anonymous users**: selection persists in `localStorage` under key `hades-watch-theme`.
4. **Authenticated users**: theme also persists to `ThemePreference` in PostgreSQL via profile settings or theme switcher.
5. `ThemeOverlays` renders scanlines, noise, vignette, and glow based on theme flags.

## CSS Variables

Each theme sets:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--border`, `--ring`
- `--hw-glow` (theme-specific glow color)

## Asset Slots (Placeholders)

Per theme, reserved paths under `public/assets/`:

- logo, favicon, background image, background video
- texture overlay, cursor image, loading animation
- alert sound, login ambience, dashboard ambience

See `docs/ASSETS.md` for naming conventions.

## Adding a Theme

1. Add entry to `src/lib/themes/registry.ts`
2. Optionally add placeholder assets under `public/assets/`
3. Theme appears automatically in `/themes` and the header switcher
