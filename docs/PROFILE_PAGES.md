# Profile Pages

Dedicated profile systems split from the generic `/profile` hub.

## Routes

| Route | Purpose |
|---|---|
| `/profile/dossier` | Private operative Character Dossier (owner) |
| `/profile/badges` | Badge Case hex grid collection |
| `/profile/relic-zone` | Relic Zone Editor (config-based) |
| `/profile/world` | Owner preview of published Profile World |
| `/profile/world/[callsign]` | Public Profile World by callsign |
| `/profile` | Redirects to `/profile/world` |
| `/profile/[callsign]` | Redirects to `/profile/world/[callsign]` |
| `/profile/edit` | Legacy HTML/CSS relic sandbox (unchanged) |
| `/profile/avatar` | Avatar Builder |

## Components

- `CharacterDossierPage` — structured identity, progression, edit links
- `BadgeCasePage` / `BadgeHexGrid` — technopunk hex grid with detail panel
- `RelicZoneEditorPage` — frames, theme tokens, modules, preview, save/publish
- `ProfileWorldRenderer` — themed public renderer with safety controls

## Data

- `UserProfileCustomization` — `activeLayout`, `relicThemeConfig`, `relicModuleConfig`, `relicDraftConfig`
- `ProfileWorld` / `RelicBuild` — published Active Relic builds

See also: `RELIC_ZONE_PROFILE_WORLD_CUSTOMIZATION.md`, `BADGE_CASE.md`, `CHARACTER_DOSSIER.md`.
