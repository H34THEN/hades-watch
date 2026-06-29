# MMO Rewards Implementation Notes

Phase 1 implementation per [MMO_SEED_DATA_AND_REWARD_SYSTEM.md](MMO_SEED_DATA_AND_REWARD_SYSTEM.md).

## Models added

- Extended `Guild` (starter guild fields, nullable `founderId`)
- Extended `VolunteerOpportunity` (seed metadata fields)
- `CommunityBuilderPrompt`, `PlayerRecognitionTemplate`, `ReputationEventDefinition`
- `CanonTierDefinition`, `CanonLorePrompt`
- `PlayerTitle`, `PlayerTitleGrant`
- `AvatarUnlockAsset`, `UserAvatarUnlock`
- `RewardMapping`, `RewardPool`, `RewardPoolItem`
- `AdminRewardGrantAudit`

Reuses existing `Badge`, `UserBadge`, `MmoLoot`, `MmoLootGrant`, `MmoLoreUnlock`, `ReputationEvent`.

## Seed script

- `prisma/scripts/seed-mmo-rewards.ts`
- `npm run db:seed:mmo-rewards`
- Included in `db:seed` / `seed-all.ts`
- Data: `src/lib/rewards/mmo-rewards-seed-data.ts`
- No fake users, grants, or activity

## Routes added

| Route | Purpose |
|-------|---------|
| `/admin/rewards` | Reward console hub + audit stream |
| `/admin/rewards/grant` | Manual grant/revoke form |
| `/admin/users/[userId]/rewards` | Per-user reward summary + grants |
| `/admin/factions/reward-pools` | Faction approved pools (read-only MVP) |
| `/admin/missions/reward-pools` | Mission reward mappings (read-only MVP) |
| `/community/volunteer/[opportunitySlug]` | Volunteer opportunity detail |

## Community updates

- `/community/guilds` — starter guilds seeded (no fake founder)
- `/community/volunteer` — 15 starter opportunities + detail pages
- `/community/builder` — prompt library from seed
- `/community/recognition` — template cards + existing public marks

## Admin grant system

- `src/lib/rewards/grants.ts` — grant/revoke + audit
- `src/lib/actions/admin-rewards.ts` — server actions
- Grant types: badge, loot, avatar_unlock, title, profile_cosmetic, reputation, lore_unlock, recognition
- Owner may grant to self for testing
- All manual grants audit-logged in `AdminRewardGrantAudit` + `writeAuditLog`

## Reward systems fully wired

- Seed definitions (guilds, volunteers, prompts, templates, titles, badges, loot, avatar unlocks, mappings, pools)
- Admin manual grant/revoke
- Character Dossier reward counts (avatar unlocks, titles, loot)

## Partially wired / deferred

- Gameplay auto-grant from reward mappings (mappings seeded only; hooks in existing mission/cipher/dead-drop flows TBD)
- Avatar Builder locked/unlocked filter UI
- Relic Zone / Profile World cosmetic display from loot grants
- Faction leader mission draft UI (pools seeded; admin-only view)
- Volunteer response rewards on approval (response flow exists; reward hook on review TBD)
- Signal Player unlock playback integration
- User opt-out for public recognition display

## Safety

- Non-combat loot only; avatar category label **Fictional Props & Tech Gear**
- No weapon framing; no fake recognition grants in seed
- Faction leaders cannot grant from admin console (Admin/Owner only)
- Chthonic / Dead Index Witness templates Owner-controlled

## Asset directories

Placeholder paths under `public/avatar-assets/`, `public/badge-assets/`, `public/relic-assets/`, `public/guild-assets/`, etc. See canonical MD for filenames.
