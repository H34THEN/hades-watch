# Rewards System

Canonical source: [MMO_SEED_DATA_AND_REWARD_SYSTEM.md](MMO_SEED_DATA_AND_REWARD_SYSTEM.md)

Implementation: [MMO_REWARDS_IMPLEMENTATION_NOTES.md](MMO_REWARDS_IMPLEMENTATION_NOTES.md)

## Overview

Hades Watch rewards are non-combat and support identity, expression, lore, community, avatar customization, badges, Profile World cosmetics, and safe MMO progression.

Reward types: badges, loot/relics, avatar unlocks (Fictional Props & Tech Gear), player titles, profile cosmetics, lore unlocks, reputation, signal player unlocks, guild banners, forum flair.

## Seeding

```bash
npm run db:seed:mmo-rewards
```

Definitions only — no fake user grants.

## Admin grants

Owner/Admin: `/admin/rewards` — see [ADMIN_REWARD_CONSOLE.md](ADMIN_REWARD_CONSOLE.md)

## Auto-grant

Reward mappings are seeded; gameplay systems grant rewards when safe completion flows fire (missions, ciphers, dead drops, volunteer review, etc.).
