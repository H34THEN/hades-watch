# Badge Case

Route: `/profile/badges`

## Purpose

Dedicated visual collection of earned and locked badges in a technopunk hex grid.

## UI

- Hex cells via `clip-path: polygon(...)`
- Hover/focus highlight and label
- Category filters: All, Character, Factions, Missions, Ciphers, Community, Archive, Forge, Events, Moderation, Recognition
- Detail panel: name, category, tier, faction, description, unlock condition, earned date, source
- Locked badges appear dimmed; earned badges glow subtly
- Capstone badges render larger when `isCapstone`

## CSS classes

`badgeCaseShell`, `badgeHexGrid`, `badgeHex`, `badgeHexEarned`, `badgeHexLocked`, `badgeHexSelected`, `badgeDetailPanel`

## Integration

Relic Zone badge module shows a subset on Profile World. Full collection lives in Badge Case.
