# Hades Watch Secret Messages

**Fictional** in-world messaging for roleplay flavor. Phase 4 UI is live.

## Required Disclaimer

> This is an in-world roleplay/game system. It is not secure private messaging and should not be used for real secrets.

Displayed on `/dead-drops`, `/dead-drops/[slug]`, `/ciphers`, and admin dead-drop management.

## Current Scope (Phase 4)

### Dead Drops

- Model: `DeadDrop` (codename, title, slug, message, status, clearanceRole, expiresAt)
- Routes: `/dead-drops`, `/dead-drops/[slug]`
- Locked/expired drops show locked cards
- Admin: `/admin/dead-drops`
- Seeded: BLACKBOX-7, ORPHEUS STATIC, THE LOCK THAT SINGS

### Ciphers

- Model: `CipherPuzzle` (title, prompt, hint, difficulty, solutionHash optional)
- Route: `/ciphers`
- Seeded: Veil Count puzzle

### Secret Transmissions

- Model: `SecretTransmission` (database only in Phase 4; no dedicated reader route yet)
- Seeded stub for Moderator clearance

## Security Stance

### Fictional Layer

- Visual terminal aesthetics
- Role-based clearance gates
- Puzzle mechanics
- **No real cryptographic guarantees**

### Do Not

- Store real secrets in dead drops
- Claim homemade messaging is secure
- Use for sensitive personal communication

### If Real Messaging Is Ever Needed

- Integrate established protocols/tools
- Never roll custom crypto
- Security review required
- Separate from roleplay layer

## Integration

- Text MMO factions and missions
- Lore archive unlocks
- Moderation workflow (separate from dead drops)
- Audit logging for dead-drop create/view (admin create only)

## Phase 5

- Cipher solution submission
- Secret transmission reader route
- Timed expiry automation
- Admin cipher management
