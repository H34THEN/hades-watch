# Avatar Unlocks

Canonical definitions: [MMO_SEED_DATA_AND_REWARD_SYSTEM.md](MMO_SEED_DATA_AND_REWARD_SYSTEM.md) (Avatar Unlock Asset Rewards)

## UI label

**Fictional Props & Tech Gear** — not weapons.

## Categories

- accessories
- fictional_props
- tech_gear
- faction_flair
- outerwear
- back_items
- effects
- backgrounds

## Asset paths

```txt
public/avatar-assets/accessories/
public/avatar-assets/fictional-props/
public/avatar-assets/tech-gear/
public/avatar-assets/faction-flair/
public/avatar-assets/outerwear/
public/avatar-assets/back-items/
public/avatar-assets/effects/
public/avatar-assets/backgrounds/
public/avatar-assets/placeholders/
```

## Model

`AvatarUnlockAsset` + `UserAvatarUnlock` — grants via gameplay or `/admin/rewards/grant`.

## Deferred

Avatar Builder locked/unlocked filter UI — unlock definitions and admin grants are in place; full builder integration is phase 2.
