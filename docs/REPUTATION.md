# Reputation // Signal Weight

Event-sourced reputation via `ReputationEvent` model.

## Categories

Community, Lore, Missions, Ciphers, Archive, Forge, Guilds, Moderation, Accessibility

## Safeguards

- Daily cap (50 pts) for community thread/reply events
- Revocation when content removed for safety violations
- Levels defined in `REPUTATION_LEVELS` constant

## Display

- `/community` hub shows `ReputationPanel` for approved users
- Future: profile dossier integration
