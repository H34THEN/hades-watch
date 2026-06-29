# MMO Hub Implementation Notes

## Source Document

Implementation follows **`docs/MMO_HUB_EXPANSION_LORE.md`** as the canonical lore, module structure, copy, access levels, and Phase 1 MVP scope.

## Phase Implemented

**Phase 1: Hub Expansion MVP**

- Expanded `/mmo` Field Ops page into the Underwatch Command Hub
- Full-width command dashboard layout with operative status strip
- Sectioned module grids for Identity, Field Work, Community, Archive, Forge, and Signals
- Live links to existing routes
- Polished locked / coming-soon states for unreleased systems
- Badge hook metadata on cards (display-only, not full badge engine)
- Safety and nonviolence notice
- Support footer link

## New Files

| Path | Purpose |
|---|---|
| `src/lib/mmo/hub-types.ts` | Hub module and context types |
| `src/lib/mmo/hub-modules.ts` | Module definitions, sections, copy from lore MD |
| `src/lib/mmo/hub-access.ts` | Access-level resolution and status labels |
| `src/lib/mmo/hub-queries.ts` | Server context queries (character, badges, ciphers, etc.) |
| `src/components/mmo/MmoHubShell.tsx` | Full-width hub shell |
| `src/components/mmo/MmoHubHeader.tsx` | Title and subtitle |
| `src/components/mmo/MmoHubStatusStrip.tsx` | Operative status rail |
| `src/components/mmo/MmoHubOperativePanel.tsx` | Character / identity command row |
| `src/components/mmo/MmoHubModuleCard.tsx` | Reusable module card |
| `src/components/mmo/MmoHubSection.tsx` | Section grid wrapper |
| `src/components/mmo/MmoHubSignalPlayerCard.tsx` | Client card for global Signal Player |
| `src/components/mmo/MmoHubSafetyNotice.tsx` | Safety policy + support footer |
| `src/components/mmo/mmo-hub.module.css` | Hub-specific terminal HUD styling |

## Updated Files

| Path | Change |
|---|---|
| `src/app/mmo/page.tsx` | Replaced compact hub with expanded command dashboard |
| `src/components/mmo/MmoNav.tsx` | Added Ciphers nav link |

## Modules — Live (linked)

| Module | Route |
|---|---|
| Character Dossier | `/profile` |
| Avatar Builder | `/profile/avatar` |
| Profile World | `/profile` |
| Relic Zone | `/profile/edit` |
| Badge Case | `/profile` |
| Faction Dossiers | `/mmo/factions` |
| Mission Board | `/mmo/missions` |
| Active Missions | `/mmo/missions` |
| Ciphers | `/ciphers` |
| Chat Rooms | `/chat` |
| Net Neighbors | `/net-neighbors` |
| Archive | `/archive` |
| State of Affairs | `/archive/state-of-affairs` |
| Ghost in Tech | `/archive/ghost-in-tech` |
| Lore Index / Unlocks | `/archive/lore` |
| Avatar Forge | `/profile/avatar/forge` |
| Net Neighbor Banner Builder | `/net-neighbors/submit` |
| Events / Transmissions | `/events` |
| Support the Underwatch | `/support` |
| Signal Player | Global footer player (card opens player, no route) |

## Modules — Stubbed / Coming Soon

| Module | Status | Notes |
|---|---|---|
| Community Builder | Coming soon | No `/community` or `/mmo/community-builder` route yet |
| Forums / Conversation Threads | Coming soon | No `/forums` route yet |
| Volunteer / Contributor Board | Coming soon | No `/volunteer` or `/mmo/contribute` route yet |
| Avatar Prompt Reference | Coming soon | Docs exist in repo (`docs/AVATAR_PROMPT_REFERENCE.md`) but no public route |

## Missing Routes (future work)

- `/forums`, `/threads`, or `/community/forums`
- `/community` or `/mmo/community-builder`
- `/volunteer`, `/community/contribute`, or `/mmo/contribute`
- `/mmo/badges` (badges currently shown on `/profile`)
- `/mmo/missions/active` (active missions surfaced on hub + `/mmo/missions`)
- `/profile/world` (profile world uses `/profile` and `/profile/[callsign]`)
- `/signals/player` (Signal Player is global, not a standalone page)
- Public docs route for Avatar Prompt Reference / Badge Art Guide / Asset Directory

## Access Handling

- Hub page requires login (`requireAuth`)
- Modules with `approved-user` access show **Locked** with copy: *This relay opens after operative approval.*
- Pending users see a clearance panel linking to `/pending-approval`
- Avatar Forge GPT private link is **not** exposed; card links only to `/profile/avatar/forge` request flow
- Chat card uses accurate copy: *HTTPS-protected temporary chat. No secrets. No archives.*

## Safety Copy

- Full safety notice from lore MD rendered via `MmoHubSafetyNotice`
- Mission cards include: *Missions are safe, legal, nonviolent, and privacy-aware.*
- Chat module includes HTTPS temporary-chat warning (not E2EE)

## Badge Hooks

Cards display badge hook slugs as metadata for future seed scripts. No schema changes in Phase 1. Existing badge display remains on profile/dossier pages.

Suggested categories prepared in lore MD: Character, Factions, Missions, Ciphers, Community, Archive, Forge, Events, Moderation.

## Deviations from Lore MD

1. **Forge section** omits duplicate Avatar Builder card (already in Identity section); Avatar Builder appears once under Identity.
2. **Badge Case** links to `/profile` instead of non-existent `/mmo/badges`.
3. **Events** links to existing `/events` rather than `/signals/transmissions` (dashboard transmissions remain at `/dashboard/transmissions`).
4. **Signal Player** uses global footer player; hub card opens player UI rather than navigating to a route.
5. **Faction Dossiers** accessible to logged-in users (matches existing `/mmo/factions` behavior using `getSessionUser`, not strict approved-only).

## Future Phases (not in this pass)

- **Phase 2:** Forums, Community Builder submissions, contributor board, deeper Net Neighbor hub integration
- **Phase 3:** Badge milestones, faction reputation rail, lore unlock previews, activity feed
- **Phase 4:** Encrypted-at-rest chat, seasonal transmissions, advanced archive curation

## Verification

```bash
npm run lint
npm run build
```

Test URL: `https://hadeswatch.com/mmo`
