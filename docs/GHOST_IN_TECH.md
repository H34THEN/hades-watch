# Ghost in Tech

Route: `/archive/ghost-in-tech`

## Purpose

Full-width repo reliquary — a browsable card library of GitHub and Codeberg tools, open-source projects, privacy tools, self-hosting resources, and useful code.

## Layout

- Full viewport width (max inner width ~1680px)
- Header + safety notice + stats
- Toolbar: search, forge filter, sort, tag filter, submit CTA
- Responsive repo card grid (`minmax(340px, 1fr)`)

## Components

| Component | Role |
|---|---|
| `GhostInTechLibrary` | Server page shell, data fetch, grid |
| `GhostInTechToolbar` | Search, forge/sort/tag filters |
| `GhostInTechStats` | Indexed counts |
| `ArchiveRepoCard` | Technopunk repo artifact card |

State of Affairs continues using `ArchiveSignalFeed` (narrow feed layout).

## Data model

Uses existing `ArchiveItem` with `type: CODE_REPO`:

- `forge`: `GITHUB` | `CODEBERG` | null (Other)
- `repoOwner`, `repoName`, `summary`, `tags`, `sourceUrl`
- Discussion via `ArchiveComment` on `/archive/ghost-in-tech/[slug]`

No schema changes required for MVP.

## Summary priority

1. Stored `summary`
2. Fallback: "Repo relic recovered from the surface web."

No GitHub/Codeberg API fetch in MVP.

## Filters & sort

Query params on `/archive/ghost-in-tech`:

| Param | Values |
|---|---|
| `sort` | `newest`, `discussed`, `az`, `updated` |
| `forge` | `all`, `github`, `codeberg`, `other` |
| `q` | text search (title, summary, owner, name) |
| `tag` | exact tag match |

## Submission

`/archive/ghost-in-tech/submit` — approved users only.

- GitHub or Codeberg URLs only (validated server-side)
- http/https only
- Moderation via `/admin/archive` if status changed from `PUBLISHED`

## Safety policy

Acceptable: open-source tools, privacy, self-hosting, accessibility, civic-tech, defensive security education, repair/docs, Hades Watch repos.

Not acceptable: malware, credential theft, doxxing, spyware, exploit walkthroughs, harmful evasion guides.

Outbound links: `rel="noopener noreferrer nofollow ugc"`.

## Moderation

Existing `/admin/archive` panel — approve/hide/remove items. No new admin UI in this pass.

## Deferred

- GitHub/Codeberg metadata API fetch (stars, license, language, last commit)
- Featured repo row
- Repo health indicators
- Mirror support
- Topic graph / related repos
- User collections / guild repo libraries
