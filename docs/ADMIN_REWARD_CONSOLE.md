# Admin Reward Console

## Routes

- `/admin/rewards` — hub, recent audit stream
- `/admin/rewards/grant` — manual grant/revoke form
- `/admin/users/[userId]/rewards` — per-user summary + grants
- `/admin/factions/reward-pools` — approved faction pools (read-only MVP)
- `/admin/missions/reward-pools` — mission mapping viewer

## Access

Owner and Admin only. Server-side permission checks on all grant actions.

## Grant types

badge, loot, avatar_unlock, title, profile_cosmetic, reputation, lore_unlock, recognition (via loot slug)

## Required fields

- Recipient user
- Grant type + reward slug
- Reason (from predefined list)
- Optional admin note

## Owner notes

Owner may grant any reward to any user including self for testing. Chthonic Uprising marks and Dead Index Witness remain Owner-controlled templates — not in faction leader pools.

## Audit

All grants/revokes write to `AdminRewardGrantAudit` and platform audit log (`admin.reward.grant`, `admin.reward.revoke`).

## Warning copy

Manual grants affect player progression and public recognition. Record a clear reason before assigning rewards.
