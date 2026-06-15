# Profile World

Immersive full-width operative shrine — dossier panels on the left, mirror-chamber avatar HUD on the right (desktop).

See also: [PROFILE_WORLDS.md](./PROFILE_WORLDS.md) for relic zone, uploads, and routing details.

## Routes

| Route | Purpose |
|-------|---------|
| `/profile` | Your profile world |
| `/profile/edit` | Edit dossier, relic, uploads |
| `/profile/avatar` | Avatar builder with HUD preview |
| `/profile/avatar/bases` | Download official base parts |
| `/profile/[callsign]` | Public world (`Character.callsign`, `isPublic: true`) |

Public URLs use the character **callsign** (case-insensitive), not the literal placeholder `your-callsign`.

## Layout (v2)

- **Full width** up to `1600px`
- **Desktop:** left column = identity, dossier, faction, badges, soundtrack, relic; right column = tall sticky **AvatarHudFrame**
- **Mobile:** avatar HUD stacks above dossier panels (avatar first)

Component: `src/components/profile/ProfileWorldView.tsx`

## Mirror Chamber HUD

The avatar is not a plain square card. It renders inside `AvatarHudFrame`:

```txt
src/components/avatar/AvatarHudFrame.tsx
src/components/avatar/avatar-hud.module.css
src/components/avatar/AvatarLayeredPreview.tsx
```

HUD elements (CSS-first, replaceable with image overlays later):

- Angled `clip-path` frame
- Corner brackets, scan rails, reticle circle
- Animated scanline sweep
- Status chips: load state, pose, species, faction, background signal
- Layered avatar preview with pose CSS transform

To swap HUD art later: add image overlays as child layers in `AvatarHudFrame` or extend `avatar-hud.module.css` with `background-image` on `.hudFrame`.

## Replacing HUD Overlays

1. Add optional PNG/SVG overlays under `public/avatar-assets/hud/` (create folder when ready).
2. Reference from `AvatarHudFrame` as absolutely positioned layers above the viewport.
3. Keep text labels in React for localization and dynamic species/pose/faction values.
