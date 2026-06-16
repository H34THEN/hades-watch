# Hades Watch Ciphers

Canonical first set: [ciphers/FIRST_CIPHER_SET.md](ciphers/FIRST_CIPHER_SET.md)

## Routes

- `/ciphers` — cipher wall (approved operatives)
- `/ciphers/[slug]` — puzzle detail, hints, answer submission

## First Cipher Set: C1PH3R CR4K3R

Five fictional decoding missions seeded from the canonical Markdown source:

1. `the-first-gate-whispers` (Caesar shift)
2. `sticker-wall-static` (acrostic)
3. `the-foundry-says-hello` (hex to ASCII)
4. `veil-order-triage` (sequence reconstruction)
5. `dead-index-handshake` (two-layer extraction + Caesar shift)

## Badge Chain

Progressive badges under profile category **Ciphers**:

- `c1ph3r-cr4k3r-initiate`
- `c1ph3r-cr4k3r-signal-reader`
- `c1ph3r-cr4k3r-index-scribe`
- `c1ph3r-cr4k3r-oracle-key`
- `c1ph3r-cr4k3r-dead-index-adept`

Badges award automatically on correct solve. No duplicate badge awards.

## Answer Handling

- Server-side verification only (`submitCipherAnswerAction`)
- Answers normalized per cipher (`default`, `strip_the`, `strip_the_black`)
- Accepted variants stored as SHA-256 hashes in `acceptedAnswerHashes`
- Plaintext answers exist only in seed source and docs, not in client bundles
- Rate limited: 10 attempts per 10 minutes per cipher per user

## Lore Unlocks

Each cipher stores `loreUnlockSlug` and `loreUnlockText`. Lore displays after solve on the detail page.

## Seed

```bash
npm run db:seed:ciphers:first-set
```

Included in `npm run db:seed` via `seed-all.ts`.

## Safety

Fictional puzzle-game decoding only. No real-world hacking, credentials, malware, evasion, or target research.

## Assets

- Cipher badge images: `public/badge-assets/ciphers/` (placeholders used when PNG missing)
- Mission badge images: `public/badge-assets/missions/`
- Avatar PNG imports: `public/avatar-assets/` via `npm run assets:migrate`
