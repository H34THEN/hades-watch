# Beta Access Model — Hades Watch

Hades Watch does **not** require email for beta access. SMTP is optional and not part of the core access model.

---

## Primary Access Model

1. **Invite-only registration** — valid invite code required
2. **Admin approval queue** — new accounts default to `Pending` unless auto-approved
3. **Optional out-of-band verification** — safety number / fingerprint match can auto-approve

---

## Account States

| Status | Meaning |
|--------|---------|
| `Pending` | Registered, awaiting clearance (limited access) |
| `Approved` | Full network access |
| `Rejected` | Denied; cannot log in |

Pending users may access `/pending-approval` and `/profile` only. Middleware redirects other protected routes.

---

## Out-of-Band Verification

Trusted inviters (Owner/Admin) can bind an invite to an expected verification value exchanged via Signal, SimpleX, Matrix, Session, PGP, SSH, or other channels.

**This is manual verification — not Signal/SimpleX API integration.**

### Flow

```txt
Admin creates invite + optional verification method + expected value
→ Recipient receives invite code out-of-band (Signal, etc.)
→ Recipient registers with invite + codename + optional verification value
→ Match + autoApproveOnMatch → Approved immediately
→ Missing/mismatch → Pending (manual admin review)
→ No verification on invite → Pending (unless autoApproveOnRegister)
```

### Supported Methods

- Signal Safety Number
- SimpleX Contact / Safety Code
- Matrix Device Fingerprint
- Session ID / Fingerprint
- PGP Public Key Fingerprint
- SSH Public Key Fingerprint
- Other

---

## Storage & Privacy

- Raw safety numbers/fingerprints are **never stored**
- Values are normalized (uppercase, separators removed) then **HMAC-SHA256 hashed**
- Only **preview suffixes** (last 4 chars) stored for admin UI
- Raw values are **never logged** in audit events
- Pepper: `VERIFICATION_PEPPER` env (falls back to `AUTH_SECRET`)

---

## Security Notes

A fingerprint match only proves both parties copied the same value. It is **not** cryptographic challenge-response unless a future signed-challenge system is added.

Mismatch does **not** auto-reject — account stays `Pending` for admin review.

---

## Invite Flags

| Flag | Effect |
|------|--------|
| `verificationRequirement` | Optional bound fingerprint with method |
| `autoApproveOnMatch` | Approve on verification match (default true) |
| `autoApproveOnRegister` | Approve without verification (bootstrap/trusted only) |

---

## Future Enhancement: Challenge Signing

```txt
Admin sends challenge phrase
→ User signs with PGP/SSH/WebAuthn key
→ App verifies signature
→ Auto-approval
```

Stronger than copied safety number matching. Not implemented in this phase.

---

## Related

- `docs/ADMIN_BOOTSTRAP.md`
- `docs/PROFILE_DOSSIER.md`
- `src/lib/verification.ts`
