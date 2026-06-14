# Hades Watch Meetings (Jitsi)

Phase 3 adds Jitsi meeting link scaffolding. **Do not self-host Jitsi yet.**

## Configuration

```env
NEXT_PUBLIC_JITSI_BASE_URL="https://meet.jit.si"
```

## How It Works

1. Admin creates an event with "Generate Jitsi room" checked
2. System generates an opaque room name: `hadeswatch-{prefix}-{random}`
3. `virtualUrl` is stored on the event record
4. Users with clearance see a "Join Meeting" link on event cards

Implementation: `src/lib/jitsi.ts`

## Security Warning

**Jitsi rooms are NOT private by default.**

Anyone with the URL can join a public Jitsi room. Room names are obscured but not access-controlled.

For sensitive meetings:

- Use Jitsi with authentication/lobby features
- Self-host with proper configuration
- Or use a different platform with real access controls

Do not claim Hades Watch Jitsi links are secure.

## Room Name Format

```
hadeswatch-briefing-k7x4q9
hadeswatch-council-2m8v1z
```

Prefixes are slugified. Random suffix prevents trivial guessing.

## Phase 4+

- Event-linked meeting notes
- Role-gated room visibility
- Optional self-hosted Jitsi on subdomain (`meet.hadeswatch.com`)
- Lobby / password integration

## Public vs Self-Hosted

| Approach | Phase 3 | Future |
|----------|---------|--------|
| Public meet.jit.si | ✓ Implemented | Dev/small groups |
| Self-hosted Jitsi | Not implemented | VPS subdomain |
| Access controls | None | Lobby, auth |
