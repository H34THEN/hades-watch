# Email / SMTP Configuration

Hades Watch uses SMTP for email verification and password reset in production.

Without SMTP, dev mode logs links to the console. **Production must not rely on console links.**

---

## Required Environment Variables

```env
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="noreply@hadeswatch.com"
```

Also set:

```env
NEXT_PUBLIC_APP_URL="https://hadeswatch.com"
REQUIRE_EMAIL_VERIFICATION="true"
```

See `.env.example`.

## Recommended Sender

Use `noreply@hadeswatch.com` or a transactional subdomain (`mail.hadeswatch.com`).

Ensure your SMTP provider allows sending from this address.

## Provider Options

Any SMTP-compatible provider works:

- Hostinger email / SMTP
- SendGrid, Mailgun, Postmark, Amazon SES, Resend, etc.

Configure credentials in `.env` only — never commit.

## DNS Records (hadeswatch.com)

| Record | Purpose |
|--------|---------|
| SPF (TXT) | Authorize SMTP server to send for your domain |
| DKIM (TXT/CNAME) | Provider signing key |
| DMARC (TXT) | Policy for failed auth (`v=DMARC1; p=none` to start) |

Verify with your provider's DNS wizard.

## Testing Verification Email

1. Configure SMTP in production `.env`
2. Register a test account with a real inbox you control
3. Confirm email arrives with link to `/verify-email?token=...`
4. Complete verification; confirm login works
5. With `REQUIRE_EMAIL_VERIFICATION=true`, unverified users cannot log in

## Testing Password Reset

1. Visit `/forgot-password`
2. Submit registered email
3. Confirm generic response (no email enumeration)
4. Receive reset link to `/reset-password?token=...`
5. Set new password and log in

## Security Behavior

- **Generic responses** — forgot-password does not reveal whether email exists
- **No raw tokens in production logs** — `sendEmail()` never logs token URLs when `NODE_ENV=production`
- **Dev only** — local dev may print `[email:dev] Link` when SMTP is unset
- **Token expiry** — verification and reset tokens expire per application logic

## SMTP Integration Status

The email abstraction exists (`src/lib/email/email.ts`). When `SMTP_HOST` and `SMTP_FROM` are set, the transport layer must be wired (nodemailer or provider SDK) before launch.

Until transport is wired, emails log intent but are not sent. **Do not launch publicly without working SMTP if `REQUIRE_EMAIL_VERIFICATION=true`.**

## Launch Checklist

- [ ] SMTP credentials in server `.env` (mode 600)
- [ ] SPF/DKIM/DMARC configured
- [ ] Verification email tested end-to-end
- [ ] Password reset email tested end-to-end
- [ ] `REQUIRE_EMAIL_VERIFICATION=true` when enforcing
- [ ] No dev email links in production logs

## Related

- `docs/SECURITY.md`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/SMOKE_TESTS.md`
