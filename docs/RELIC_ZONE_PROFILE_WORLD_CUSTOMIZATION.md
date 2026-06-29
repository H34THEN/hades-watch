# Relic Zone & Profile World Customization

## Naming

| Concept | Name |
|---|---|
| System | Relic Zone |
| Public page | Profile World |
| Editor | Relic Zone Editor |
| Saved designs | Relic Builds |
| Published theme | Active Relic |
| Custom blocks | Relic Modules |
| Preset layouts | Relic Frames |

## Purpose

Relic Zone is the player-facing customization workbench. Profile World is the public-facing result visitors see after publishing an Active Relic.

Goals: safe MySpace-style expression without raw HTML/JS, scoped styling, accessibility, moderation.

## Relic Frames (layouts)

1. **Standard Dossier** (`standard_dossier`) — Clean official Hades Watch profile layout.
2. **Terminal Shrine** (`terminal_shrine`) — Underground resistance terminal with command-line panels.
3. **Faction Banner** (`faction_banner`) — Faction-forward shrine/recruitment style.
4. **Relic Gallery** (`relic_gallery`) — Visual collection for badges, relics, lore fragments.
5. **Profile World Custom** (`profile_world_custom`) — Freeform modular canvas within safe limits.

## Safe customization (MVP)

Config/token-based only. No raw HTML, JavaScript, iframes, external scripts, or global CSS.

Allowed: background/panel/text/accent colors, approved fonts, border style, glow, scanlines/glitch toggles, module visibility/order/titles.

## Routes

- `/profile/relic-zone` — Relic Zone Editor (owner)
- `/profile/world` — Owner preview of active Profile World
- `/profile/world/[callsign]` — Public Profile World

## Safety

- Scoped styles inside `[data-profile-world="true"]`
- External links: `rel="noopener noreferrer nofollow ugc"`
- Cannot hide report/moderation controls
- Signal Stability Check warns on contrast/effects issues

## Deferred

- ProfileRevision history table
- Moderator reset UI (documented; use admin patterns)
- Module drag-and-drop reorder
- Safe uploaded background images in editor
