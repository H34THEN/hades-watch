# Forum Quotes and Notifications

## Quoting

- Button label: **Echo Quote**
- Quote block label: **SIGNAL ECHO FROM [CALLSIGN]**
- Stores `quotedCommentId`, `quotedAuthorId`, `quoteExcerpt` (max 300 chars)
- Removed/hidden quoted content shows: `Quoted signal removed.`

## Notification types

| Type | Trigger |
|------|---------|
| `FORUM_QUOTE` | Another user quotes your comment |
| `FORUM_REPLY` | Direct reply to your comment (parent) |
| `FORUM_MENTION` | `@callsign` in post body (max 5) |

Self-quotes do not notify. Preferences in `ForumUserPreference` can disable each type.

## Example copy

`Slewfoot echoed your signal in "Dead Drop Terminal Ideas."`

## Inbox

`/notifications` — mark read individually or all at once.

Email notifications are not sent (not implemented).
