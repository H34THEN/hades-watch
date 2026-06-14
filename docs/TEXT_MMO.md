# Hades Watch Text MMO Layer

Lightweight text-based game layer for Hades Watch. **Phase 4 implemented — not a full MMO engine.**

## Current Scope (Phase 4)

### Characters

- One active character per user
- Fields: callsign, pronouns, bio, archetype, faction, public visibility
- Route: `/mmo/character`
- Audit: character create/update

### Factions

- Browse factions with member counts
- Faction detail with linked missions
- Membership request scaffolding (`FactionMembership`: Pending/Approved/Rejected/Left)
- Routes: `/mmo/factions`, `/mmo/factions/[slug]`
- Seeded factions: Ember Cell, Null Choir, Archive Wraiths

### Missions / Quests

- Browse available missions (`QuestStatus.Available`)
- Mission detail with faction link
- Routes: `/mmo/missions`, `/mmo/missions/[slug]`
- Seeded missions: Signal Beneath the Ash, Dead Channel Recon, The Oracle Node Flickers
- **Mission participation tracking — Phase 5 TODO**

### Hub

- `/mmo` — overview with character card and links

## Data Models

- `Character` — user-linked operative identity
- `Faction` — player organizations (slug, name, description)
- `FactionMembership` — join request workflow
- `Quest` — missions with slug, status, faction link

## Not Implemented Yet

- Combat, stats, inventory
- Text encounters
- Reputation system
- Campaign editor
- Admin faction membership approval UI (requests are stored; approval action exists server-side)

## Phase 5 Plans

- Mission participation and completion tracking
- Faction membership approval UI
- Reputation and clearance progression
- Campaign editor (admin)
- Cross-feature integration (events, dead drops, lore)

## Integration Points

- **Roles** — lore and dead-drop clearance
- **Audit logs** — character, faction, mission actions
- **Announcements** — in-world broadcasts
- **Archive** — lore unlocks tied to roles/factions
- **Dead Drops** — fictional intel (roleplay only)

## Design Principles

- Text-first, low asset overhead
- Roleplay-friendly, not competitive MMO
- Admin-driven narrative
- No overbuilt game engine in Phase 4
