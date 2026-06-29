# Hades Watch MMO Seed Data and Reward System

## Purpose

This file defines the starter seed data, missing content, reward structures, loot definitions, avatar unlock needs, recognition templates, and admin assignment rules for the current Hades Watch MMO systems.

It is intended as the canonical content source for future seeding and wiring of admin reward assignment pages, faction-leader mission creation options, avatar asset rewards, badge rewards, relic rewards, profile cosmetics, public recognition systems, starter guilds, volunteer opportunities, community prompts, and reputation events.

This document distinguishes between website seed data, development placeholder data, reward definitions, future image asset needs, admin-only assignment tools, and Owner-specific grant tools.

```txt
Progression in Hades Watch should feel like becoming more trusted, more rooted, more expressive, and more useful to the Underwatch — never more violent.
```

## Content Safety Policy

All seed data and rewards must follow Hades Watch rules.

Do not create content that rewards violence, weapons, combat, harassment, doxxing, stalking, intimidation, sabotage, illegal hacking, malware, exploit instructions, credential theft, evasion, real-world targeting, unsafe protest tactics, unsafe medical or legal advice, or private data exposure.

Do create content that rewards community support, creative work, safe lore, forum participation, community questions, privacy literacy, safe fictional ciphers, accessibility notes, documentation, archiving, public-interest learning, repair culture, self-hosting education, mutual aid imagination, nonviolent civic readiness, avatar and badge asset contribution, old-web culture building, guild stewardship, and player recognition.

All loot must be non-combat. Loot should be cosmetic, narrative, social, archival, profile-based, avatar-builder based, reputation-based, or lore-based.

Use the UI label:

```txt
Fictional Props & Tech Gear
```

Do not use `weapons` as a category for avatar rewards. If an asset is handheld, call it a fictional prop, relic, tool, tech gear, accessory, charm, patch, token, satchel, card, or keepsake.

Oracular Circuit language may sound like signal analysis, broken prophecy, and cryptic systems, but gameplay must remain safe puzzle solving and privacy literacy. No real-world hacking tasks, no target selection, no exploit instructions, no credential handling, and no evasion guidance.

## Current Missing Data Overview

| System | Missing Data Needed | Priority | Notes |
| --- | --- | --- | --- |
| Guilds | Starter guild concepts, guild roles, banner hooks, badge hooks | phase-1 | Guilds are community cells, not official factions. |
| Volunteer Board | Starter opportunities, lanes, acceptance criteria, reward hooks | phase-1 | Safe contribution without code access. |
| Public Recognition | Recognition templates, grant rules, opt-out rules | phase-1 | Real recognitions should be manually granted or review-based. |
| Reputation Events | Trigger definitions, caps, review rules, abuse prevention | phase-1 | No infinite posting loops. |
| Canon Tier Lore | Tier definitions, prompts, review rules, ownership rules | phase-1 | Keeps player lore organized and safe. |
| Player Titles | Earnable titles across rooms, factions, archive, guilds, recognition | phase-1 | Titles display on Character Dossier and Profile World. |
| Badges | Starter badge definitions and placeholder asset paths | phase-1 | Badge definitions are safe to seed. |
| Loot / Relics | Non-combat relics, cosmetics, forum flair, room access marks | phase-1 | Actual grants come from actions or admin tools. |
| Avatar Unlock Assets | Unlock definitions and placeholder asset paths | phase-1 | Assets map to public/avatar-assets/. |
| Mission Rewards | Reward bundles for starter missions | phase-1 | Includes First Descent Protocols. |
| Dead Drop Rewards | Reward mapping for starter Dead Drops | phase-1 | Review required for many submissions. |
| Cipher Rewards | C1PH3R CR4K3R chain, Oracular Relay loot, lore unlocks | phase-1 | Game puzzles only. |
| Faction Mission Rewards | Approved faction reward pools | phase-2 | Faction leaders may select from approved pools later. |
| Archive Rewards | Reading, submitting, discussing, approving archive items | phase-1 | Public-interest resources only. |
| Ghost in Tech Rewards | Repo relic submissions, safe summaries, discussion rewards | phase-1 | No harmful repos or exploit guides. |
| Relic Zone Unlocks | Display modules, relic shelves, badge case styles | phase-2 | Supports Profile World customization. |
| Profile World Cosmetics | Frames, backgrounds, terminal prompts, gallery modules | phase-2 | Old-web expression layer. |
| Signal Player Unlocks | Skins, tones, broadcast flavor, playlist themes | phase-2 | No autoplay. |
| Admin Assignment Tools | Manual grant, revoke, notes, source reason, audit log | phase-1 | Critical for testing and recognition. |
| Faction Leader Mission Tools | Draft missions, select approved rewards, review submissions | phase-3 | Admin/Owner approval required. |
## Seed Data Design Rules

- All seed records must be idempotent.
- Use stable slugs.
- Do not seed fake users as real users.
- Do not create misleading player activity.
- Starter guilds can be system-created example guilds or canonical NPC/community guilds.
- Starter volunteer opportunities can be open system opportunities.
- Recognition entries should be templates or categories unless a real user is manually recognized by Owner/Admin.
- Badge definitions are safe to seed.
- Loot definitions are safe to seed.
- Reward mappings are safe to seed.
- Actual user reward grants should not be seeded except for explicit Owner/Admin assignment flows.
- Image asset paths may be placeholders until assets are created.
- Removed or rejected submissions should not grant reputation.
- Repeatable rewards must define cooldowns and caps.
- Admin and Owner grants must create audit records.
- Faction leader reward tools must only use approved reward pools.
- Owner-only Chthonic Uprising marks must never be grantable by faction leaders.

## Starter Guilds

## The Lantern Thread

**Slug:** `the-lantern-thread`  
**Status:** approved-starter  
**Visibility:** public  
**Primary Faction Affinity:** Chthonic Uprising  
**Secondary Affinities:** Asclepian Veil, Community  
**Guild Type:** forum salon  
**Purpose:** Welcome, orientation, and first-field-note support  
**Description:** The Lantern Thread is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.  
**Public Motto:** `Leave a light where the lost can find it.`  
**Founding Hook:** A forgotten terminal room lit itself when the first member left a helpful note instead of a command.  
**Suggested Activities:** field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas.  
**Starter Roles:** Thread Tender, Signal Greeter, Welcome Scribe, Commons Host  
**Join Policy:** open-request  
**Safety Notes:** No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.  
**Badge Hooks:** guild-founder, guild-steward, underwatch-host  
**Image Asset Needed:** `/guild-assets/icons/the-lantern-thread.png`  
**Banner Asset Needed:** `/guild-assets/banners/the-lantern-thread.png`  
**Implementation Metadata:** `starterGuild: true`, `status: approved-starter`, `slug: the-lantern-thread`

## Static Gardeners

**Slug:** `static-gardeners`  
**Status:** approved-starter  
**Visibility:** approved-users  
**Primary Faction Affinity:** Daedalus Foundry  
**Secondary Affinities:** Oracular Circuit, Archive  
**Guild Type:** maker crew  
**Purpose:** Safe self-hosting, repair, open-web, and public-interest resource gardening  
**Description:** Static Gardeners is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.  
**Public Motto:** `Grow the commons under the noise.`  
**Founding Hook:** A forgotten terminal room lit itself when the first member left a helpful note instead of a command.  
**Suggested Activities:** field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas.  
**Starter Roles:** Signal Planter, Repo Tiller, Mesh Dreamer, Tool Note Keeper  
**Join Policy:** application  
**Safety Notes:** No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.  
**Badge Hooks:** guild-founder, guild-steward, underwatch-host  
**Image Asset Needed:** `/guild-assets/icons/static-gardeners.png`  
**Banner Asset Needed:** `/guild-assets/banners/static-gardeners.png`  
**Implementation Metadata:** `starterGuild: true`, `status: approved-starter`, `slug: static-gardeners`

## The Bone Index Society

**Slug:** `bone-index-society`  
**Status:** approved-starter  
**Visibility:** public  
**Primary Faction Affinity:** Archive  
**Secondary Affinities:** Chthonic Uprising, Oracular Circuit  
**Guild Type:** archive circle  
**Purpose:** Lore indexing, archive traces, and civic memory preservation  
**Description:** The Bone Index Society is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.  
**Public Motto:** `Memory has teeth.`  
**Founding Hook:** A forgotten terminal room lit itself when the first member left a helpful note instead of a command.  
**Suggested Activities:** field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas.  
**Starter Roles:** Index Scribe, Archive Witness, Lore Tender, Trace Keeper  
**Join Policy:** open-request  
**Safety Notes:** No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.  
**Badge Hooks:** guild-founder, guild-steward, underwatch-host  
**Image Asset Needed:** `/guild-assets/icons/bone-index-society.png`  
**Banner Asset Needed:** `/guild-assets/banners/bone-index-society.png`  
**Implementation Metadata:** `starterGuild: true`, `status: approved-starter`, `slug: bone-index-society`

## Rat Nest Print Club

**Slug:** `rat-nest-print-club`  
**Status:** approved-starter  
**Visibility:** public  
**Primary Faction Affinity:** Styx Rats  
**Secondary Affinities:** Community Builder, Signal Player  
**Guild Type:** zine cell  
**Purpose:** Safe zine lines, banners, forum flair, and old-web graphics  
**Description:** Rat Nest Print Club is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.  
**Public Motto:** `Make the dark laugh first.`  
**Founding Hook:** A forgotten terminal room lit itself when the first member left a helpful note instead of a command.  
**Suggested Activities:** field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas.  
**Starter Roles:** Zine Rat, Sticker Ghost, Banner Gremlin, Morale Printer  
**Join Policy:** open-request  
**Safety Notes:** No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.  
**Badge Hooks:** guild-founder, guild-steward, underwatch-host  
**Image Asset Needed:** `/guild-assets/icons/rat-nest-print-club.png`  
**Banner Asset Needed:** `/guild-assets/banners/rat-nest-print-club.png`  
**Implementation Metadata:** `starterGuild: true`, `status: approved-starter`, `slug: rat-nest-print-club`

## The Repair Choir

**Slug:** `the-repair-choir`  
**Status:** approved-starter  
**Visibility:** approved-users  
**Primary Faction Affinity:** Daedalus Foundry  
**Secondary Affinities:** Asclepian Veil, Accessibility  
**Guild Type:** maker crew  
**Purpose:** Bug reports, accessibility improvements, and documentation rituals  
**Description:** The Repair Choir is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.  
**Public Motto:** `Fix gently. Document fiercely.`  
**Founding Hook:** A forgotten terminal room lit itself when the first member left a helpful note instead of a command.  
**Suggested Activities:** field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas.  
**Starter Roles:** Patch Singer, Bench Hand, Access Harmonist, Doc Keeper  
**Join Policy:** application  
**Safety Notes:** No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.  
**Badge Hooks:** guild-founder, guild-steward, underwatch-host  
**Image Asset Needed:** `/guild-assets/icons/the-repair-choir.png`  
**Banner Asset Needed:** `/guild-assets/banners/the-repair-choir.png`  
**Implementation Metadata:** `starterGuild: true`, `status: approved-starter`, `slug: the-repair-choir`

## Veil Commons Crew

**Slug:** `veil-commons-crew`  
**Status:** approved-starter  
**Visibility:** approved-users  
**Primary Faction Affinity:** Asclepian Veil  
**Secondary Affinities:** Myrmidon Grinders, Community  
**Guild Type:** care circle  
**Purpose:** Safe care prompts, disclaimers, accessibility notes, and support rituals  
**Description:** Veil Commons Crew is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.  
**Public Motto:** `Care is infrastructure.`  
**Founding Hook:** A forgotten terminal room lit itself when the first member left a helpful note instead of a command.  
**Suggested Activities:** field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas.  
**Starter Roles:** Care Scribe, Commons Medic, Signal Steward, Rest Witness  
**Join Policy:** application  
**Safety Notes:** No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.  
**Badge Hooks:** guild-founder, guild-steward, underwatch-host  
**Image Asset Needed:** `/guild-assets/icons/veil-commons-crew.png`  
**Banner Asset Needed:** `/guild-assets/banners/veil-commons-crew.png`  
**Implementation Metadata:** `starterGuild: true`, `status: approved-starter`, `slug: veil-commons-crew`

## Delphi After Dark

**Slug:** `delphi-after-dark`  
**Status:** approved-starter  
**Visibility:** approved-users  
**Primary Faction Affinity:** Oracular Circuit  
**Secondary Affinities:** Ciphers, Signal Player  
**Guild Type:** cipher circle  
**Purpose:** Safe fictional cipher practice, puzzle prompts, and hint-writing  
**Description:** Delphi After Dark is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.  
**Public Motto:** `No oracle is divine after midnight.`  
**Founding Hook:** A forgotten terminal room lit itself when the first member left a helpful note instead of a command.  
**Suggested Activities:** field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas.  
**Starter Roles:** Hint Keeper, Static Listener, Puzzle Scribe, Relay Caller  
**Join Policy:** application  
**Safety Notes:** No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.  
**Badge Hooks:** guild-founder, guild-steward, underwatch-host  
**Image Asset Needed:** `/guild-assets/icons/delphi-after-dark.png`  
**Banner Asset Needed:** `/guild-assets/banners/delphi-after-dark.png`  
**Implementation Metadata:** `starterGuild: true`, `status: approved-starter`, `slug: delphi-after-dark`

## The Gatewatch Mapmakers

**Slug:** `gatewatch-mapmakers`  
**Status:** approved-starter  
**Visibility:** approved-users  
**Primary Faction Affinity:** Myrmidon Grinders  
**Secondary Affinities:** Accessibility, Archive  
**Guild Type:** accessibility crew  
**Purpose:** Safe accessibility-route, room-flow, and event-readiness map concepts  
**Description:** The Gatewatch Mapmakers is a safe community cell in the Underwatch. Its members build old-web warmth, low-pressure participation, lore-friendly contribution, and practical commons infrastructure without combat-first gameplay.  
**Public Motto:** `A gate is only good if everyone can pass.`  
**Founding Hook:** A forgotten terminal room lit itself when the first member left a helpful note instead of a command.  
**Suggested Activities:** field notes, review prompts, safe forum threads, resource summaries, guild rituals, lore fragments, profile-world ideas.  
**Starter Roles:** Gate Scribe, Route Witness, Map Steward, Commons Scout  
**Join Policy:** open-request  
**Safety Notes:** No private data, harassment, unsafe tactics, medical/legal advice, exploit content, or real-world targeting.  
**Badge Hooks:** guild-founder, guild-steward, underwatch-host  
**Image Asset Needed:** `/guild-assets/icons/gatewatch-mapmakers.png`  
**Banner Asset Needed:** `/guild-assets/banners/gatewatch-mapmakers.png`  
**Implementation Metadata:** `starterGuild: true`, `status: approved-starter`, `slug: gatewatch-mapmakers`

## Volunteer Opportunities

## Write an Accessibility Note for One Page

**Slug:** `write-accessibility-note-one-page`  
**Lane:** Accessibility Review  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 15-30 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Asclepian Veil  
**Purpose:** Improve usability and inclusion across the Underwatch.  
**Task Description:** Pick one page and submit a respectful access note with a practical suggestion.  
**Acceptance Criteria:** Specific page, clear issue, practical suggestion, no private data.  
**What Not To Submit:** Harsh callouts, vague complaints, private screenshots, medical claims.  
**Reward Suggestions:** Accessibility Scribe progress, Commons Builder reputation  
**Reputation Reward:** +10 Accessibility  
**Badge Hook:** `accessibility-scribe`  
**Avatar Unlock Hook:** `accessibility-scribe-ribbon`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/write-accessibility-note-one-page.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Test the Avatar Builder on Mobile

**Slug:** `test-avatar-builder-mobile`  
**Lane:** QA Testing  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 20-40 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Daedalus Foundry  
**Purpose:** Find mobile layout issues in the Avatar Forge.  
**Task Description:** Use the Avatar Builder on mobile and report layout/touch/loading clarity.  
**Acceptance Criteria:** Device/browser, steps tried, issues described.  
**What Not To Submit:** Private screenshots, unrelated bug dumps, duplicate spam.  
**Reward Suggestions:** Forge Hand progress, Foundry Spark Charm  
**Reputation Reward:** +8 Forge  
**Badge Hook:** `avatar-forge-tester`  
**Avatar Unlock Hook:** `foundry-spark-charm`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/test-avatar-builder-mobile.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Submit One Safe Ghost in Tech Repo Summary

**Slug:** `submit-safe-ghost-in-tech-repo-summary`  
**Lane:** Research / Archive Resources  
**Status:** open  
**Difficulty:** intermediate  
**Estimated Time:** 20-45 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Daedalus Foundry  
**Purpose:** Build Ghost in Tech with public-interest learning resources.  
**Task Description:** Submit a public repo link with safe educational summary.  
**Acceptance Criteria:** Public link, non-harmful purpose, safety note.  
**What Not To Submit:** Malware, exploit tooling, credential tools, evasion tools.  
**Reward Suggestions:** Ghost in Tech Runner progress, Repo Relic Patch  
**Reputation Reward:** +15 Archive  
**Badge Hook:** `ghost-in-tech-runner`  
**Avatar Unlock Hook:** `ghost-in-tech-repo-chip`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/submit-safe-ghost-in-tech-repo-summary.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Create a Faction Badge Concept

**Slug:** `create-faction-badge-concept`  
**Lane:** Badge Art  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 15-30 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Chthonic Uprising  
**Purpose:** Expand faction progression visuals.  
**Task Description:** Submit badge name, faction, visual concept, flavor text.  
**Acceptance Criteria:** Hades Watch tone, safe symbolism, no copied art.  
**What Not To Submit:** Hate symbols, copied logos, weapon focus.  
**Reward Suggestions:** Badge Smith progress, Forge Credit  
**Reputation Reward:** +8 Forge  
**Badge Hook:** `badge-smith`  
**Avatar Unlock Hook:** `black-cache-sticker`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/create-faction-badge-concept.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Draft a Lore Fragment for Character Canon

**Slug:** `draft-character-canon-lore-fragment`  
**Lane:** Lore Writing  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 15-40 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Archive  
**Purpose:** Help players define operative identity safely.  
**Task Description:** Write Tier 1 character canon fragment.  
**Acceptance Criteria:** 100-400 words, fictional, no real private data.  
**What Not To Submit:** Real allegations, threats, harassment, direct real-person portrayals.  
**Reward Suggestions:** Lore Keeper progress, Bone Index Tab  
**Reputation Reward:** +10 Lore  
**Badge Hook:** `character-canon-scribe`  
**Avatar Unlock Hook:** `bone-index-earring`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/draft-character-canon-lore-fragment.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Suggest a Community Builder Prompt

**Slug:** `suggest-community-builder-prompt`  
**Lane:** Community Events  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 10-20 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Community  
**Purpose:** Seed safer player creativity.  
**Task Description:** Submit prompt title, category, prompt, safety note.  
**Acceptance Criteria:** Clear, inclusive, safe, actionable.  
**What Not To Submit:** Harassment prompts, unsafe tactics, advice prompts.  
**Reward Suggestions:** Commons Builder progress, Forum Flair  
**Reputation Reward:** +6 Community  
**Badge Hook:** `community-builder`  
**Avatar Unlock Hook:** `commons-builder-patch`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/suggest-community-builder-prompt.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Submit a Net Neighbor Banner Idea

**Slug:** `submit-net-neighbor-banner-idea`  
**Lane:** Net Neighbor Scouting  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 10-25 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Styx Rats  
**Purpose:** Build Net Neighbor visual identity.  
**Task Description:** Propose a safe old-web banner concept.  
**Acceptance Criteria:** Banner title, visual description, consent-aware note.  
**What Not To Submit:** Doxxing, private URLs, impersonation, copied art.  
**Reward Suggestions:** Net Neighbor Scout progress  
**Reputation Reward:** +8 Community  
**Badge Hook:** `net-neighbor-scout`  
**Avatar Unlock Hook:** `net-neighbor-lantern-pin`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/submit-net-neighbor-banner-idea.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## QA the Dead Drop Flow

**Slug:** `qa-dead-drop-flow`  
**Lane:** QA Testing  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 20-35 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Chthonic Uprising  
**Purpose:** Ensure Dead Drops are clear and rewarding.  
**Task Description:** Complete or preview a Dead Drop and report issues.  
**Acceptance Criteria:** Drop slug, steps, expected/actual behavior.  
**What Not To Submit:** Spam, private data, technical attack testing.  
**Reward Suggestions:** Static Courier progress, Dead Drop Receipt  
**Reputation Reward:** +8 Missions  
**Badge Hook:** `dead-drop-qa-runner`  
**Avatar Unlock Hook:** `dead-drop-receipt`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/qa-dead-drop-flow.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Write a Beginner Cipher Idea

**Slug:** `write-beginner-cipher-idea`  
**Lane:** Cipher Writing  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 15-30 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Oracular Circuit  
**Purpose:** Expand Oracular Relay puzzle content safely.  
**Task Description:** Submit fictional cipher with answer, hint, solution.  
**Acceptance Criteria:** Puzzle-only, solvable, no real targets.  
**What Not To Submit:** Real hacking, exploit clues, live systems.  
**Reward Suggestions:** Cipher Lantern progress  
**Reputation Reward:** +10 Ciphers  
**Badge Hook:** `cipher-lantern`  
**Avatar Unlock Hook:** `cipher-glyph-ring`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/write-beginner-cipher-idea.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Create a Profile World Theme Concept

**Slug:** `create-profile-world-theme-concept`  
**Lane:** Design / UI  
**Status:** open  
**Difficulty:** intermediate  
**Estimated Time:** 30-60 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Chthonic Uprising  
**Purpose:** Expand old-web profile customization.  
**Task Description:** Propose background, frame, prompt, access considerations.  
**Acceptance Criteria:** Readable contrast, no stolen art, safety note.  
**What Not To Submit:** Flashing effects, low contrast, copyrighted assets.  
**Reward Suggestions:** Profile World Dreamer progress  
**Reputation Reward:** +12 Forge  
**Badge Hook:** `profile-world-dreamer`  
**Avatar Unlock Hook:** `town-square-terminal-frame`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/create-profile-world-theme-concept.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Document a Bug with Screenshots

**Slug:** `document-bug-with-screenshots`  
**Lane:** QA Testing  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 10-25 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Daedalus Foundry  
**Purpose:** Repair the Underwatch without code access.  
**Task Description:** Submit safe screenshots, repro steps, expected and actual behavior.  
**Acceptance Criteria:** Clear steps, redacted screenshots.  
**What Not To Submit:** Sensitive account data, other users private content.  
**Reward Suggestions:** Documentation Lantern progress  
**Reputation Reward:** +8 Forge  
**Badge Hook:** `documentation-lantern`  
**Avatar Unlock Hook:** `forge-toolkit`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/document-bug-with-screenshots.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Suggest a Signal Player Playlist Theme

**Slug:** `suggest-signal-player-playlist-theme`  
**Lane:** Music / Signal Player Contributions  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 10-20 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Community  
**Purpose:** Build room and faction atmosphere.  
**Task Description:** Suggest playlist mood/theme and destination.  
**Acceptance Criteria:** No uploads required, no autoplay request.  
**What Not To Submit:** Pirated audio, autoplay demands, hateful content.  
**Reward Suggestions:** Signal Player unlock progress  
**Reputation Reward:** +6 Community  
**Badge Hook:** `signal-player-curator`  
**Avatar Unlock Hook:** `signal-board-patch`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/suggest-signal-player-playlist-theme.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Draft a Forum Category Description

**Slug:** `draft-forum-category-description`  
**Lane:** Documentation  
**Status:** open  
**Difficulty:** beginner  
**Estimated Time:** 10-25 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Community  
**Purpose:** Make forum spaces clear and safe.  
**Task Description:** Write category description, allowed topics, safety note.  
**Acceptance Criteria:** Clear scope, welcoming tone, rules.  
**What Not To Submit:** Callout spaces, doxxing, unsafe advice.  
**Reward Suggestions:** Thread Tender progress  
**Reputation Reward:** +6 Community  
**Badge Hook:** `thread-tender`  
**Avatar Unlock Hook:** `lantern-thread-pin`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/draft-forum-category-description.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Help Write Mission Flavor Copy

**Slug:** `help-write-mission-flavor-copy`  
**Lane:** Mission Writing  
**Status:** open  
**Difficulty:** intermediate  
**Estimated Time:** 20-45 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Chthonic Uprising  
**Purpose:** Add safe atmosphere to missions.  
**Task Description:** Draft entry, success, and field log text.  
**Acceptance Criteria:** Nonviolent action, clear completion, safety note.  
**What Not To Submit:** Combat framing, real targets, sabotage instructions.  
**Reward Suggestions:** Mission Scribe progress  
**Reputation Reward:** +10 Missions  
**Badge Hook:** `mission-scribe`  
**Avatar Unlock Hook:** `field-log-tab`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/help-write-mission-flavor-copy.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Review Public Safety Copy for Clarity

**Slug:** `review-public-safety-copy-clarity`  
**Lane:** Moderation Support  
**Status:** open  
**Difficulty:** intermediate  
**Estimated Time:** 20-45 minutes  
**Access Level:** approved-user  
**Faction Affinity:** Asclepian Veil  
**Purpose:** Make safety language easier to understand.  
**Task Description:** Review one safety note or moderation copy block.  
**Acceptance Criteria:** Plain-language clarity preserving safety meaning.  
**What Not To Submit:** Weakening policy, hostile edits, legal claims.  
**Reward Suggestions:** Safety Lantern progress  
**Reputation Reward:** +10 Community  
**Badge Hook:** `safety-lantern`  
**Avatar Unlock Hook:** `veil-clinic-patch`  
**Image Asset Needed:** `/community-assets/volunteer-lanes/review-public-safety-copy-clarity.png`  
**Implementation Metadata:** `status: open`, `reviewRequired: true`, `accessLevel: approved-user`

## Community Builder Prompts

| Prompt Title | Slug | Category | Suggested Route/System | Player-Facing Prompt | Review Requirements | Reward Suggestions | Badge Hooks | Safety Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| First Lantern Thread | first-lantern-thread | forum-topic | Forums | Write a welcoming thread prompt for new operatives entering the Underwatch. | Moderator review | Thread Tender reputation, forum flair | thread-tender | No pressure for personal disclosure. |
| Mission Without Teeth | mission-without-teeth | mission-idea | Missions | Design a nonviolent field task that still feels tense and useful. | Admin review | Mission Scribe progress | mission-scribe | No combat, sabotage, targeting, or unsafe tactics. |
| Beginner Oracle Puzzle | beginner-oracle-puzzle | cipher-idea | Ciphers | Propose a beginner cipher based on fictional static or archive fragments. | Cipher steward review | Cipher Lantern progress | cipher-lantern | Puzzle only; no hacking. |
| Carried Relic | carried-relic | lore-fragment | Profile Dossier | Describe a small relic your operative carries and what memory it protects. | Public display review | Lore reputation, relic unlock | character-canon-scribe | No real private data. |
| Avatar Pin Idea | avatar-pin-idea | avatar-asset-idea | Avatar Builder | Invent a small non-combat pin, patch, charm, or sticker. | Asset review | Avatar Forge Spark progress | avatar-forge-spark | No weapons, hate symbols, copied logos. |
| Badge for Kindness | badge-for-kindness | badge-idea | Badge Case | Design a badge for someone who makes the community easier to enter. | Admin review | Badge Smith progress | badge-smith | Recognition must not become popularity pressure. |
| One Button Easier | one-button-easier | accessibility-note | Accessibility Review | Pick one interface action and explain how it could be easier. | Accessibility review | Accessibility reputation | accessibility-scribe | Respectful specific feedback only. |
| Repo Relic Lantern | repo-relic-lantern | archive-resource | Ghost in Tech | Submit a safe public-interest repo and explain why it belongs. | Archive safety review | Repo Relic Patch | ghost-in-tech-runner | No harmful repos. |
| Neighbor Signal | neighbor-signal | net-neighbor | Net Neighbors | Suggest a safe Net Neighbor concept, banner, or profile blurb. | Moderator review | Net Neighbor reputation | net-neighbor-scout | No private sites without consent. |
| Quiet Event | quiet-event | event-idea | Events | Design a low-pressure community event for exhausted operatives. | Moderator review | Commons Builder reputation | commons-builder | No mandatory attendance or disclosure. |
| Profile World Window | profile-world-window | profile-world-theme | Profile World | Describe a Profile World background that feels like a room in the Underwatch. | Design review | Profile World unlock progress | profile-world-dreamer | Avoid flashing effects and low contrast. |
| Signal Player Mood | signal-player-mood | signal-player-idea | Signal Player | Suggest a Signal Player skin, tone, or playlist mood for one faction floor. | Admin review | Signal Player unlock | signal-player-curator | No autoplay. |
| Field Log Flavor | field-log-flavor | mission-idea | Field Logs | Write a safe field log sentence for a completed community action. | Moderator review | Field Debrief Scribe progress | field-debrief-scribe | Do not expose submission content. |
| Guild Ritual | guild-ritual | event-idea | Guilds | Propose a weekly guild ritual that is creative, safe, and easy to join. | Admin/guild review | Guild Steward progress | guild-steward | No dares, pressure, or unsafe tasks. |
| Archive Question | archive-question | archive-resource | Archive | Write one discussion question for a public-interest archive item. | Archive review | Archive Witness progress | archive-reader | Source-aware, no harassment. |
| Dead Drop Revision | dead-drop-revision | mission-idea | Dead Drops | Rewrite a Dead Drop prompt to make it clearer and safer. | Admin review | Static Courier progress | dead-drop-runner | Preserve safety limits. |
| Faction Floor Memory | faction-floor-memory | lore-fragment | Faction Floors | Write a short memory from a faction floor your operative visited. | Faction steward review | Faction Echo progress | faction-floor-witness | No canon-breaking claims without review. |
| Net Neighbor Button | net-neighbor-button | avatar-asset-idea | Net Neighbors | Propose an 88x31 old-web button concept for a safe neighbor node. | Asset/moderator review | Net Neighbor banner part | net-neighbor-scout | No impersonation. |
| Moderator Lantern | moderator-lantern | accessibility-note | Moderation Support | Suggest a clearer way to explain a community safety rule. | Moderator review | Safety Lantern progress | safety-lantern | Do not weaken policy. |
| Sunlight After Collapse | sunlight-after-collapse | lore-fragment | Archive / Profile World | Write a hopeful solarpunk micro-fragment about what the Underwatch builds toward. | Canon tier review | Lore reputation | commons-spark | Hopeful, nonviolent, practical. |
## Public Recognition Entries

Public recognition honors safe, helpful, creative, and lore-building contributions. Users must be able to opt out of public display where appropriate. Public recognition should not expose private submission content. Owner / Archivist Marks are Owner-only.

## Thread Tender

**Slug:** `thread-tender`  
**Recognition Type:** Title  
**Category:** Community  
**Granted By:** moderator  
**Visibility:** public  
**Description:** Recognizes welcoming, clarifying, de-escalating forum participation.  
**Flavor Text:** `They kept a chair open beside the static.`  
**Unlock or Grant Condition:** Moderator-approved pattern of healthy forum support.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Thread Tender title; Lantern Thread Mark  
**Image Asset Needed:** `/community-assets/recognition/thread-tender.png`

## Cipher Lantern

**Slug:** `cipher-lantern`  
**Recognition Type:** Badge  
**Category:** Ciphers  
**Granted By:** automatic  
**Visibility:** public  
**Description:** Recognizes safe cipher solving or approved puzzle contribution.  
**Flavor Text:** `A small light for those who read the dark carefully.`  
**Unlock or Grant Condition:** Solve three approved puzzles or contribute one approved beginner cipher.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Cipher Lantern badge; Cipher Glyph Ring  
**Image Asset Needed:** `/community-assets/recognition/cipher-lantern.png`

## Forge Hand

**Slug:** `forge-hand`  
**Recognition Type:** Title  
**Category:** Forge  
**Granted By:** admin  
**Visibility:** public  
**Description:** Recognizes documentation, design, QA, or asset work.  
**Flavor Text:** `The hand that fixes the hinge owns part of the door.`  
**Unlock or Grant Condition:** Approved Forge-lane contribution.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Forge Hand title; Foundry Spark Charm  
**Image Asset Needed:** `/community-assets/recognition/forge-hand.png`

## Archive Witness

**Slug:** `archive-witness`  
**Recognition Type:** Badge  
**Category:** Archive  
**Granted By:** automatic  
**Visibility:** public  
**Description:** Recognizes archive reading or safe archive contribution.  
**Flavor Text:** `The archive blinked. Someone was still reading.`  
**Unlock or Grant Condition:** Read five archive items or submit approved archive resource.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Archive Witness badge; Archive Witness Tab  
**Image Asset Needed:** `/community-assets/recognition/archive-witness.png`

## Commons Builder

**Slug:** `commons-builder`  
**Recognition Type:** Title  
**Category:** Community  
**Granted By:** admin  
**Visibility:** public  
**Description:** Recognizes contributions that make Hades Watch more usable and resilient.  
**Flavor Text:** `They built a bench in the underworld and called it infrastructure.`  
**Unlock or Grant Condition:** Approved prompt, safety copy, guild template, or access contribution.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Commons Builder title; Commons Builder Patch  
**Image Asset Needed:** `/community-assets/recognition/commons-builder.png`

## Net Neighbor Scout

**Slug:** `net-neighbor-scout`  
**Recognition Type:** Badge  
**Category:** Net Neighbors  
**Granted By:** moderator  
**Visibility:** public  
**Description:** Recognizes safe contributions to the Net Neighbors ring.  
**Flavor Text:** `They found a door that did not demand obedience.`  
**Unlock or Grant Condition:** Approved Net Neighbor lead, banner, or profile suggestion.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Net Neighbor Scout badge; Lantern Pin  
**Image Asset Needed:** `/community-assets/recognition/net-neighbor-scout.png`

## Accessibility Scribe

**Slug:** `accessibility-scribe`  
**Recognition Type:** Badge  
**Category:** Accessibility  
**Granted By:** admin  
**Visibility:** public  
**Description:** Recognizes clear accessibility feedback and inclusive design suggestions.  
**Flavor Text:** `A gate is only good if everyone can pass.`  
**Unlock or Grant Condition:** Approved accessibility note or review.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Accessibility Scribe badge; Ribbon  
**Image Asset Needed:** `/community-assets/recognition/accessibility-scribe.png`

## Lore Keeper

**Slug:** `lore-keeper`  
**Recognition Type:** Title  
**Category:** Lore  
**Granted By:** admin  
**Visibility:** public  
**Description:** Recognizes safe lore contributions across canon layers.  
**Flavor Text:** `They kept the ghost from becoming trivia.`  
**Unlock or Grant Condition:** Approved Tier 1-3 lore contribution.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Lore Keeper title; Bone Index Tab  
**Image Asset Needed:** `/community-assets/recognition/lore-keeper.png`

## Field Debrief Scribe

**Slug:** `field-debrief-scribe`  
**Recognition Type:** Badge  
**Category:** Missions  
**Granted By:** automatic  
**Visibility:** profile-only  
**Description:** Recognizes useful logs or mission flavor summaries.  
**Flavor Text:** `No action is complete until the commons can learn from it.`  
**Unlock or Grant Condition:** Three approved field logs or one approved mission flavor contribution.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Field Debrief badge; Field Log Tab  
**Image Asset Needed:** `/community-assets/recognition/field-debrief-scribe.png`

## Chthonic Signal

**Slug:** `chthonic-signal`  
**Recognition Type:** Community Spotlight  
**Category:** Recognition  
**Granted By:** owner  
**Visibility:** public  
**Description:** Owner-granted spotlight for work that strengthens the Underwatch.  
**Flavor Text:** `The signal crossed five floors and came back carrying sunlight.`  
**Unlock or Grant Condition:** Manual Owner recognition.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Recognition mark; featured profile hook  
**Image Asset Needed:** `/community-assets/recognition/chthonic-signal.png`

## Dead Index Witness

**Slug:** `dead-index-witness`  
**Recognition Type:** Owner / Archivist Mark  
**Category:** Recognition  
**Granted By:** owner  
**Visibility:** public  
**Description:** Rare Archivist mark for lasting lore/archive/community work.  
**Flavor Text:** `The Dead Index opened one eye and wrote the name down.`  
**Unlock or Grant Condition:** Owner-only manual grant.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Dead Index Witness badge; Dead Index Badge Chain  
**Image Asset Needed:** `/community-assets/recognition/dead-index-witness.png`

## Underwatch Host

**Slug:** `underwatch-host`  
**Recognition Type:** Featured Guild  
**Category:** Guilds  
**Granted By:** admin  
**Visibility:** public  
**Description:** Recognizes a guild or steward hosting safe recurring community activity.  
**Flavor Text:** `They kept the room warm without locking the door.`  
**Unlock or Grant Condition:** Approved recurring guild activity with good standing.  
**Can Be Revoked:** true  
**Opt-Out Supported:** true  
**Badge / Title / Loot Hook:** Guild banner upgrade; host title  
**Image Asset Needed:** `/community-assets/recognition/underwatch-host.png`

## Reputation Event Definitions

| Event Name | Slug | Category | Points | Trigger | Cooldown / Cap | Review Required | Abuse Prevention Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| First Field Log | first-field-log | Community | 10 | Player creates first safe field log | Once per account | false | No grant for deleted account activity. |
| Daily Field Note | daily-field-note | Community | 3 | Approved field note posted | 1/day, 15/week | false | No deleted notes, duplicates, or spam. |
| Helpful Forum Reply | helpful-forum-reply | Community | 4 | Reply marked useful | 3/day, 20/week | true | Prevent reciprocal farming; moderator reversal allowed. |
| Thread Started | thread-started | Community | 3 | Safe discussion thread created | 2/day, 10/week | false | No locked, deleted, or spam threads. |
| Community Builder Prompt Approved | community-builder-prompt-approved | Community | 8 | Prompt accepted | 3/week | true | No duplicate prompts. |
| Guild Joined | guild-joined | Guilds | 5 | User joins approved guild | 5 total | false | No leave/rejoin farming. |
| Guild Activity Completed | guild-activity-completed | Guilds | 8 | Approved guild activity logged | 2/week | true | Guild steward review; admin reversal allowed. |
| Guild Steward Action | guild-steward-action | Guilds | 10 | Steward completes approved hosting task | 1/week | true | Must be logged; no self-awarded loops. |
| Volunteer Task Submitted | volunteer-task-submitted | Forge | 5 | Volunteer task submitted | 3/week | true | Pending points not public until approved. |
| Volunteer Task Approved | volunteer-task-approved | Forge | 12 | Submission approved | 3/week | true | No rejected, unsafe, or plagiarized work. |
| Bug Report Approved | bug-report-approved | Forge | 8 | Useful bug report accepted | 3/week | true | Screenshots must be redacted. |
| Accessibility Note Approved | accessibility-note-approved | Accessibility | 10 | Accessibility note accepted | 2/week | true | No vague or duplicate notes. |
| Documentation Improvement Approved | documentation-improvement-approved | Forge | 10 | Documentation suggestion accepted | 2/week | true | Review required; no spam. |
| Avatar Asset Idea Approved | avatar-asset-idea-approved | Forge | 8 | Non-combat avatar concept approved | 2/week | true | No copied art, unsafe symbols, or weapons. |
| Badge Concept Approved | badge-concept-approved | Forge | 8 | Badge concept accepted | 2/week | true | Owner/Admin approval for canonical use. |
| Mission Completed | mission-completed | Missions | 12 | Mission marked complete | Per mission | false | No duplicate unless repeatable. |
| Mission Reflection Approved | mission-reflection-approved | Missions | 8 | Reflection approved | 2/week | true | No unsafe tactics or real target info. |
| Dead Drop Completed | dead-drop-completed | Missions | 8 | Dead Drop completion logged | Per drop cooldown | varies | Drop-specific cap; review submissions. |
| Dead Drop Resource Approved | dead-drop-resource-approved | Archive | 12 | Resource drop accepted | 2/week | true | Public-interest safety review required. |
| Mini Cipher Solved | mini-cipher-solved | Ciphers | 6 | Cipher answer accepted | Per cipher | false | Rate limit attempts; no brute-force reward. |
| Cipher Hint Used | cipher-hint-used | Ciphers | 1 | Player reads hint | 3/day | false | Tiny learning reward; no loops. |
| Cipher Idea Approved | cipher-idea-approved | Ciphers | 10 | Player cipher approved | 2/month | true | Puzzle safety review required. |
| Archive Item Read | archive-item-read | Archive | 2 | Archive item read | 5/day | false | Anti-refresh tracking. |
| Archive Discussion Approved | archive-discussion-approved | Archive | 6 | Discussion question/comment approved | 3/week | true | Source-aware, no harassment. |
| Archive Resource Approved | archive-resource-approved | Archive | 12 | Public-interest resource accepted | 2/week | true | Harmful resources rejected. |
| Ghost in Tech Repo Approved | ghost-in-tech-repo-approved | Archive | 15 | Safe repo summary approved | 2/month | true | Repo safety review. |
| Lore Fragment Submitted | lore-fragment-submitted | Lore | 4 | Private Tier 1 draft saved | 2/week | false | No public points until approved. |
| Lore Fragment Approved | lore-fragment-approved | Lore | 12 | Lore approved for canon tier | 2/month | true | Review for canon and originality. |
| Faction Floor Visit | faction-floor-visit | Faction | 3 | First faction floor visit | Once per floor | false | No refresh farming. |
| Faction Mission Completed | faction-mission-completed | Faction | 12 | Approved faction mission complete | Per mission | varies | Faction leader recommendation; admin final when needed. |
| Faction Resource Approved | faction-resource-approved | Faction | 10 | Faction-safe resource accepted | 2/week | true | Safety rules by lane. |
| Recognition Granted | recognition-granted | Recognition | 15 | Manual recognition granted | Manual only | true | Audit required. |
| Public Spotlight Accepted | public-spotlight-accepted | Recognition | 20 | User opts into public spotlight | 1/month | true | Opt-out supported; no private content. |
| Net Neighbor Approved | net-neighbor-approved | Community | 12 | Net Neighbor approved | 2/month | true | Consent and listing review required. |
| Signal Player Idea Approved | signal-player-idea-approved | Community | 6 | Playlist/theme suggestion accepted | 2/month | true | No autoplay; no pirated content. |
| Event Participation Logged | event-participation-logged | Community | 8 | User attends/contributes to safe event | 1/week | true | No attendance pressure; host verification. |
## Canon Tier Lore Seeds

| Canon Tier | What Users Can Create | Example Prompt | Review Requirement | Ownership Rules | Safety Rules | Reward Hooks | Badge Hooks | Lore Unlock Hooks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tier 0: Private Draft | Personal drafts and unfinished character fragments | What did your operative almost say into the relay? | No review unless shared | User owns draft; not canon | No private data, harassment, or unsafe claims | Draft-only field log | private-draft-keeper | None by default |
| Tier 1: Character Canon | Operative memories, carried relics, profile flavor | Describe your operative’s first signal. | Required for public display | User owns character canon | Fictional, non-defamatory, no real targeting | Lore reputation, title progress | character-canon-scribe | Character dossier fragments |
| Tier 2: Guild Canon | Guild founding rumors, rituals, room memories | What rumor explains your guild’s founding? | Guild steward + moderator review | Guild owns shared canon; contributor credited | No exclusionary or unsafe rituals | Guild reputation, banner progress | guild-lore-keeper | Guild page lore snippets |
| Tier 3: Local / Community Canon | Underwatch places, old-web rooms, community legends | Name a place in the Underwatch and what it protects. | Moderator/Admin review | Contributor credited; Hades Watch may display | No direct real-world claims or private locations | Community lore reputation | underwatch-cartographer | Room descriptions, local lore cards |
| Tier 4: Faction Echo | Faction floor memories, leader-adjacent myths, internal sayings | What did your faction floor teach your operative? | Faction steward + Admin review | Contributor credited; faction canon controlled | Must fit faction lore and safety rules | Faction reputation, faction flair | faction-echo-scribe | Faction lore echoes |
| Tier 5: World Canon | Major lore, Dead Index entries, canonical events, alliance myths | What truth did the Surface Order fail to erase? | Owner / Archivist review only | Canon belongs to Hades Watch; contributor credited | Highest safety and continuity review | Rare recognition, relic rewards | dead-index-witness | World Canon unlocks |

Starter lore prompt seeds:

| Prompt Title | Slug | Canon Tier | Player Prompt | Reward Hook |
| --- | --- | --- | --- | --- |
| Your Operative’s First Signal | your-operatives-first-signal | 1 | Write the first strange signal your operative answered. | Character Canon Scribe progress |
| A Relic Your Character Carries | a-relic-your-character-carries | 1 | Describe a harmless relic, charm, or keepsake your operative carries. | Relic Zone starter module |
| Your Guild’s Founding Rumor | your-guilds-founding-rumor | 2 | Write the rumor that explains how your guild cell began. | Guild Lore Keeper progress |
| A Faction Floor Memory | a-faction-floor-memory | 4 | Describe a small memory from a faction floor. | Faction Echo Scribe progress |
| A Dead Drop You Almost Missed | a-dead-drop-you-almost-missed | 1 | Write about a fictional Dead Drop your operative nearly ignored. | Static Courier progress |
| A Place in the Underwatch | a-place-in-the-underwatch | 3 | Invent a safe room, corridor, or old-web node beneath the surface. | Underwatch Cartographer progress |
| A Rumor About the Surface Order | a-rumor-about-the-surface-order | 3 | Write a fictional rumor about the Surface Order without real-world names or claims. | Lore reputation |
| A Net Neighbor You Trust | a-net-neighbor-you-trust | 2 | Invent or describe a safe community node your guild respects. | Net Neighbor Scout progress |
| A Tool That Saved a Signal | a-tool-that-saved-a-signal | 1 | Describe a non-combat tool, repair, or tech charm that helped your operative. | Forge Hand progress |
| A Song From the Signal Player | a-song-from-the-signal-player | 1 | Describe the mood of a song or broadcast your operative keeps returning to. | Signal Player Curator progress |
## Player Titles

| Title | Slug | Category | Unlock Condition | Faction Affinity | Display Location | Flavor Text |
| --- | --- | --- | --- | --- | --- | --- |
| Static Courier | static-courier | Dead Drops | Complete first reviewed Dead Drop | Chthonic Uprising | Character Dossier | They carried a message through dead air. |
| Signal Reader | signal-reader | Ciphers | Solve first Oracular Relay cipher | Oracular Circuit | Character Dossier | They learned the machine could stutter. |
| Archive Witness | archive-witness | Archive | Read five archive entries | Archive | Character Dossier | They saw what the surface buried. |
| Commons Builder | commons-builder | Community | Approved Community Builder contribution | Chthonic Uprising | Character Dossier | A bench in the dark is still infrastructure. |
| Thread Tender | thread-tender | Community | Moderator recognition for welcoming posts | Community | Forums / Dossier | They kept the thread warm. |
| Forge Hand | forge-hand | Forge | Approved Forge or QA contribution | Daedalus Foundry | Character Dossier | The hinge remembers the hand. |
| Gatehouse Runner | gatehouse-runner | Factions | Complete Gatehouse action | Myrmidon Grinders | Character Dossier | They knew which gate would hold. |
| Black Clinic Visitor | black-clinic-visitor | Factions | Visit Black Clinic and submit safe note | Asclepian Veil | Character Dossier | They learned care has doors. |
| Rat Nest Regular | rat-nest-regular | Factions | Complete Rat Nest morale prompt | Styx Rats | Character Dossier | The wall saved them a seat. |
| Dead Index Carrier | dead-index-carrier | Dead Drops | Complete five Dead Drops | Chthonic Uprising | Character Dossier | A dead ledger page folded into their pocket. |
| Cipher Lantern | cipher-lantern | Ciphers | Solve three beginner ciphers | Oracular Circuit | Character Dossier | They lit the clue without burning the room. |
| Net Neighbor Scout | net-neighbor-scout | Community | Approved Net Neighbor submission | Community | Character Dossier | They found a signal worth visiting. |
| Repo Relic Reader | repo-relic-reader | Archive | Read or submit Ghost in Tech repo summary | Daedalus Foundry | Character Dossier | They read code as civic memory. |
| Field Debrief Scribe | field-debrief-scribe | Missions | Submit three approved field logs | Chthonic Uprising | Field Log / Dossier | They made action legible. |
| Lore Keeper | lore-keeper | Lore | Approved Tier 1-3 lore | Archive | Profile World | They kept a ghost from becoming trivia. |
| Guild Steward | guild-steward | Guilds | Host approved guild activity | Guilds | Guild Page / Dossier | They kept the room open. |
| Signal Player Curator | signal-player-curator | Community | Approved Signal Player theme | Community | Signal Player / Dossier | They tuned the static toward home. |
| Avatar Forge Spark | avatar-forge-spark | Forge | Approved avatar concept | Daedalus Foundry | Avatar Builder | They gave the ghost something to wear. |
| Safety Lantern | safety-lantern | Moderation | Approved safety copy improvement | Asclepian Veil | Dossier | Their warning did not become a wall. |
| Documentation Lantern | documentation-lantern | Forge | Approved documentation or bug report | Daedalus Foundry | Dossier | They wrote the map after finding the hole. |
| Underwatch Host | underwatch-host | Guilds | Recognized safe community host | Guilds | Guild Page / Dossier | They kept the room warm. |
| Static Gardener | static-gardener | Guilds | Join Static Gardeners and complete first activity | Daedalus Foundry | Dossier | They grew a signal under the noise. |
| Bone Index Scribe | bone-index-scribe | Archive | Approved lore or archive index contribution | Archive | Dossier | The bone card accepted their handwriting. |
| Zine Rat | zine-rat | Community | Approved zine line or banner | Styx Rats | Forums / Dossier | Ink under the nails, sunlight in the margins. |
| Care Signal | care-signal | Factions | Complete Veil care prompt | Asclepian Veil | Dossier | They checked the pulse of a room. |
| Relay Caller | relay-caller | Ciphers | Submit approved cipher idea | Oracular Circuit | Dossier | They taught static a new question. |
| Map Steward | map-steward | Accessibility | Approved route or navigation note | Myrmidon Grinders | Dossier | They marked the path without owning it. |
| Pomegranate Witness | pomegranate-witness | Rooms | Visit five core MMO rooms | Chthonic Uprising | Dossier | Five seeds. Five doors. One dark root. |
| Ghost in Tech Runner | ghost-in-tech-runner | Archive | Submit approved repo relic | Daedalus Foundry | Dossier | They found a machine with a conscience-shaped dent. |
| Dead Index Witness | dead-index-witness-title | Recognition | Owner grant | Chthonic Uprising | Public Recognition / Dossier | The Dead Index opened one eye. |
| Chthonic Signal | chthonic-signal-title | Recognition | Owner spotlight | Chthonic Uprising | Public Recognition / Dossier | The signal returned carrying sunlight. |
| Pythian Rootlet | pythian-rootlet | Factions | Oracular Circuit faction progress | Oracular Circuit | Dossier | A small root in the broken oracle. |
| Veilbearer | veilbearer-title | Factions | Asclepian Veil faction progress | Asclepian Veil | Dossier | They carried privacy like medicine. |
| Foundry Apprentice | foundry-apprentice-title | Factions | Daedalus Foundry faction progress | Daedalus Foundry | Dossier | They learned which doors wanted hinges. |
| Styx Stray | styx-stray-title | Factions | Styx Rats faction progress | Styx Rats | Dossier | The river let them sleep under the bridge. |
| Line Holder | line-holder-title | Factions | Myrmidon Grinders faction progress | Myrmidon Grinders | Dossier | They held the gate without becoming it. |
## Badge Seed Data

| Badge Name | Slug | Category | Tier | Faction | Unlock Condition | Visual Concept | Suggested Asset Path | Flavor Text |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| First Descent | first-descent | Missions | initiate | Chthonic Uprising | Complete any First Descent Protocol | Pomegranate gate opening | /badge-assets/missions/first-descent.png | The first door remembered your name. |
| Black Clinic Readiness | black-clinic-readiness | Missions | initiate | Asclepian Veil | Complete Black Clinic Readiness | Green pulse behind veil | /badge-assets/missions/black-clinic-readiness.png | Care became operational. |
| Oracle Hygiene Check | oracle-hygiene-check | Missions | initiate | Oracular Circuit | Complete Oracle Hygiene Check | Violet eye with shielded cursor | /badge-assets/missions/oracle-hygiene-check.png | The prophecy lost a little metadata. |
| Gatewatch Readiness Map | gatewatch-readiness-map | Missions | initiate | Myrmidon Grinders | Complete Gatewatch Readiness Map | Bronze gate map pin | /badge-assets/missions/gatewatch-readiness-map.png | A route is a promise. |
| Labyrinth Repair Log | labyrinth-repair-log | Missions | initiate | Daedalus Foundry | Complete Labyrinth Repair Log | Orange wrench over labyrinth | /badge-assets/missions/labyrinth-repair-log.png | The broken thing became a teacher. |
| Morale Signal Drop | morale-signal-drop | Missions | initiate | Styx Rats | Complete Morale Signal Drop | Pink sticker burst | /badge-assets/missions/morale-signal-drop.png | Joy left a mark. |
| C1PH3R CR4K3R Initiate | c1ph3r-cr4k3r-initiate | Ciphers | initiate | Oracular Circuit | Solve first cipher | Glitch key, one notch lit | /badge-assets/ciphers/c1ph3r-cr4k3r-initiate.png | The first lock was mostly theater. |
| C1PH3R CR4K3R Signal Reader | c1ph3r-cr4k3r-signal-reader | Ciphers | regular | Oracular Circuit | Solve three ciphers | Static scroll and eye | /badge-assets/ciphers/c1ph3r-cr4k3r-signal-reader.png | They read what the relay tried to bury. |
| C1PH3R CR4K3R Index Scribe | c1ph3r-cr4k3r-index-scribe | Ciphers | adept | Oracular Circuit | Solve seven ciphers | Cipher glyph on index card | /badge-assets/ciphers/c1ph3r-cr4k3r-index-scribe.png | The answer entered the ledger. |
| C1PH3R CR4K3R Oracle Key | c1ph3r-cr4k3r-oracle-key | Ciphers | steward | Oracular Circuit | Solve twelve ciphers | Bent oracle key | /badge-assets/ciphers/c1ph3r-cr4k3r-oracle-key.png | The oracle learned humility. |
| C1PH3R CR4K3R Dead Index Adept | c1ph3r-cr4k3r-dead-index-adept | Ciphers | relic | Oracular Circuit | Complete C1PH3R chain | Dead Index lock halo | /badge-assets/ciphers/c1ph3r-cr4k3r-dead-index-adept.png | The static signed back. |
| Oracular Relay Initiate | oracular-relay-initiate | Rooms | initiate | Oracular Circuit | Enter Oracular Relay | Violet relay tower | /badge-assets/rooms/oracular-relay-initiate.png | They heard the machine cough. |
| Hint Reader | hint-reader | Ciphers | initiate | Oracular Circuit | Request first hint | Candle beside question mark | /badge-assets/ciphers/hint-reader.png | Learning is not failure. |
| Static Decoder | static-decoder | Ciphers | regular | Oracular Circuit | Solve Relay cipher | Static split into glyph | /badge-assets/ciphers/static-decoder.png | The noise had grammar. |
| False Omen Corrected | false-omen-corrected | Ciphers | adept | Oracular Circuit | Solve advanced fictional prophecy puzzle | Broken prophecy wheel | /badge-assets/ciphers/false-omen-corrected.png | The future blinked first. |
| Dead Drop Initiate | dead-drop-initiate | Dead Drops | initiate | Chthonic Uprising | Complete first Dead Drop | Black cache icon | /badge-assets/dead-drops/dead-drop-initiate.png | They found the cache under the ordinary world. |
| Signal Cache Recovered | signal-cache-recovered | Dead Drops | regular | Chthonic Uprising | Complete three Dead Drops | Cache with signal sparks | /badge-assets/dead-drops/signal-cache-recovered.png | Static became supplies. |
| Drop Runner | drop-runner | Dead Drops | regular | Chthonic Uprising | Complete five Dead Drops | Courier satchel | /badge-assets/dead-drops/drop-runner.png | They never ran alone. |
| Dead Index Carrier | dead-index-carrier | Dead Drops | adept | Chthonic Uprising | Complete ten Dead Drops | Ledger page in chain | /badge-assets/dead-drops/dead-index-carrier.png | A name survived the trip. |
| Static Courier | static-courier-badge | Dead Drops | steward | Chthonic Uprising | Complete rotating drops for four weeks | Signal courier mask | /badge-assets/dead-drops/static-courier-badge.png | The route trusted them back. |
| Town Square Arrival | town-square-arrival | Rooms | initiate | Chthonic Uprising | Enter Town Square | Terminal plaza cursor | /badge-assets/rooms/town-square-arrival.png | The plaza was never a place. |
| First Field Note | first-field-note | Rooms | initiate | Chthonic Uprising | Post first safe field note | Note pinned to old BBS | /badge-assets/rooms/first-field-note.png | The field heard you. |
| Signal Board Reader | signal-board-reader | Rooms | initiate | Chthonic Uprising | Read Signal Board | Flickering signal board | /badge-assets/rooms/signal-board-reader.png | The board blinked. So did you. |
| Underwatch Regular | underwatch-regular | Rooms | regular | Chthonic Uprising | Visit Town Square on five days | Terminal cup and pomegranate | /badge-assets/rooms/underwatch-regular.png | Their cursor had a usual seat. |
| Commons Spark | commons-spark | Community | regular | Chthonic Uprising | Complete first community contribution | Small spark under bench | /badge-assets/community/commons-spark.png | A tiny useful fire. |
| Archive Terminal Reader | archive-terminal-reader | Archive | initiate | Archive | Read first archive item | Green terminal page | /badge-assets/archive/archive-terminal-reader.png | Memory booted. |
| State of Affairs Scout | state-of-affairs-scout | Archive | regular | Archive | Read State of Affairs item | Scout eye over newspaper ghost | /badge-assets/archive/state-of-affairs-scout.png | They watched the surface safely. |
| Repo Relic Reader | repo-relic-reader | Archive | regular | Daedalus Foundry | Read Ghost in Tech repo | Repo chip in bone tab | /badge-assets/archive/repo-relic-reader.png | The code had fingerprints. |
| Ghost in Tech Runner | ghost-in-tech-runner | Archive | adept | Daedalus Foundry | Submit approved safe repo summary | Ghost in circuit shell | /badge-assets/archive/ghost-in-tech-runner.png | Some machines still wanted to help. |
| Dead Index Trace | dead-index-trace | Archive | relic | Chthonic Uprising | Recover archive lore trace | Pomegranate seed in ledger | /badge-assets/archive/dead-index-trace.png | The trace refused deletion. |
| Black Clinic Visitor | black-clinic-visitor | Factions | initiate | Asclepian Veil | Visit Black Clinic floor | Veil curtain and pulse | /badge-assets/factions/black-clinic-visitor.png | Care had a door. |
| Signal Chapel Listener | signal-chapel-listener | Factions | initiate | Oracular Circuit | Visit Signal Chapel floor | Chapel window of static | /badge-assets/factions/signal-chapel-listener.png | The relay hummed like prayer. |
| Gatehouse Runner | gatehouse-runner | Factions | initiate | Myrmidon Grinders | Visit Gatehouse floor | Bronze gate runner mark | /badge-assets/factions/gatehouse-runner.png | They learned the safe route. |
| Foundry Bench Spark | foundry-bench-spark | Factions | initiate | Daedalus Foundry | Visit Foundry Bench floor | Orange spark on workbench | /badge-assets/factions/foundry-bench-spark.png | The bench saved the first screw. |
| Rat Nest Regular | rat-nest-regular | Factions | initiate | Styx Rats | Visit Rat Nest floor | Rat sticker halo | /badge-assets/factions/rat-nest-regular.png | The wall recognized them. |
| Chthonic Mark Witness | chthonic-mark-witness | Factions | relic | Chthonic Uprising | Owner-controlled recognition | Split pomegranate over five seeds | /badge-assets/factions/chthonic-mark-witness.png | The five cells looked back. |
| Community Builder | community-builder | Community | regular | Community | Approved prompt contribution | Hammer and speech bubble | /badge-assets/community/community-builder.png | They gave the commons a question. |
| Thread Tender | thread-tender-badge | Community | regular | Community | Moderator recognition | Lantern over thread line | /badge-assets/community/thread-tender-badge.png | They tended the little lights. |
| Net Neighbor Scout | net-neighbor-scout | Community | regular | Community | Approved Net Neighbor submission | Lantern pin on web ring | /badge-assets/community/net-neighbor-scout.png | A neighbor signal found the ring. |
| Accessibility Scribe | accessibility-scribe | Community | steward | Asclepian Veil | Approved accessibility note | Ramp-shaped quill and gate | /badge-assets/community/accessibility-scribe.png | They widened the passage. |
| Safety Lantern | safety-lantern | Moderation | steward | Asclepian Veil | Approved safety copy improvement | Lantern inside soft shield | /badge-assets/moderation/safety-lantern.png | A warning can be kind. |
| Documentation Lantern | documentation-lantern | Forge | regular | Daedalus Foundry | Approved documentation or bug report | Manual page with lantern | /badge-assets/forge/documentation-lantern.png | The map survived the hole. |
| Badge Smith | badge-smith | Forge | regular | Daedalus Foundry | Approved badge concept | Badge mold and sparks | /badge-assets/forge/badge-smith.png | They forged recognition without vanity. |
| Avatar Forge Spark | avatar-forge-spark | Forge | regular | Daedalus Foundry | Approved avatar concept | Avatar silhouette with spark | /badge-assets/forge/avatar-forge-spark.png | A ghost got dressed for rebellion. |
| Mission Scribe | mission-scribe | Missions | regular | Chthonic Uprising | Approved mission flavor copy | Field log card and pomegranate | /badge-assets/missions/mission-scribe.png | They wrote the work into memory. |
| Field Debrief Scribe | field-debrief-scribe | Missions | regular | Chthonic Uprising | Approved field log set | Debrief paperclip | /badge-assets/missions/field-debrief-scribe.png | No lesson died in the field. |
| Guild Founder | guild-founder | Guilds | initiate | Guilds | Found approved guild | Guild banner seed | /badge-assets/guilds/guild-founder.png | A room became a cell. |
| Guild Steward | guild-steward | Guilds | steward | Guilds | Host approved guild activity | Steward key and banner | /badge-assets/guilds/guild-steward.png | They held the room open. |
| Guild Lore Keeper | guild-lore-keeper | Guilds | regular | Guilds | Approved Tier 2 guild lore | Guild book with pomegranate tab | /badge-assets/guilds/guild-lore-keeper.png | The rumor grew roots. |
| Underwatch Host | underwatch-host-badge | Guilds | steward | Guilds | Recognized safe host | Warm terminal room | /badge-assets/guilds/underwatch-host-badge.png | A room can be a rescue. |
| Event Lantern | event-lantern | Events | regular | Community | Contribute to approved event | Calendar lantern | /badge-assets/events/event-lantern.png | They gave the date a doorway. |
| Archive Credit | archive-credit | Recognition | regular | Archive | Credited archive contribution | Citation card and bone tab | /badge-assets/recognition/archive-credit.png | The source remembered them back. |
| Forge Credit | forge-credit | Recognition | regular | Daedalus Foundry | Credited design/asset/QA contribution | Hammer stamp on ticket | /badge-assets/recognition/forge-credit.png | The commons stamped the work. |
| Lore Credit | lore-credit | Recognition | regular | Archive | Credited lore contribution | Quill over underworld map | /badge-assets/recognition/lore-credit.png | The myth kept their initials. |
| Moderator Commendation | moderator-commendation | Recognition | steward | Community | Moderator grant | Soft shield and lantern | /badge-assets/recognition/moderator-commendation.png | They lowered the temperature of the room. |
| Dead Index Witness | dead-index-witness | Recognition | relic | Chthonic Uprising | Owner grant | Dead Index eye in pomegranate | /badge-assets/recognition/dead-index-witness.png | The ledger opened one eye. |
| Chthonic Signal | chthonic-signal | Recognition | mythic | Chthonic Uprising | Owner spotlight | Five-cell signal flare | /badge-assets/recognition/chthonic-signal.png | The underworld heard it together. |
## Loot and Relic Seed Data

| Loot Name | Slug | Type | Rarity | Category | Unlock Condition | Display Location | Suggested Asset Path | Flavor Text |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Static Courier | static-courier-title-loot | title | common | Dead Drops | Complete first Dead Drop | Character Dossier | /relic-assets/dead-drops/static-courier-title-loot.png | A name for those who cross the static. |
| Cracked Cache Key | cracked-cache-key | relic | uncommon | Dead Drops | Complete three Dead Drops | Relic Zone | /relic-assets/dead-drops/cracked-cache-key.png | It opens nothing. That is why it works. |
| Dead Drop Terminal Frame | dead-drop-terminal-frame | profile-cosmetic | uncommon | Dead Drops | Complete Dead Drop intro | Profile World | /relic-assets/dead-drops/dead-drop-terminal-frame.png | A frame of black cache glass. |
| Cache Mark | cache-mark | badge | common | Dead Drops | Read recovered drop | Badge Case | /relic-assets/dead-drops/cache-mark.png | A scratch only couriers notice. |
| The First Dead Index | the-first-dead-index | lore-fragment | rare | Lore | Complete Dead Index starter drop | Archive | /relic-assets/lore/the-first-dead-index.png | The first page was a missing person. |
| Bent Oracle Key | bent-oracle-key | relic | uncommon | Ciphers | Solve first relay cipher | Relic Zone | /relic-assets/ciphers/bent-oracle-key.png | The oracle bent before the lock did. |
| Violet Relay Border | violet-relay-border | profile-cosmetic | uncommon | Ciphers | Solve three relay ciphers | Profile World | /relic-assets/ciphers/violet-relay-border.png | A little static around the edges. |
| Oracular Static | oracular-static-lore | lore-fragment | rare | Ciphers | Complete Oracular Relay intro chain | Archive | /relic-assets/ciphers/oracular-static-lore.png | The machine said maybe. The underworld said no. |
| Signal Reader | signal-reader-title-loot | title | common | Ciphers | Solve first cipher | Character Dossier | /relic-assets/ciphers/signal-reader-title-loot.png | They did not mistake noise for fate. |
| Cipher Glyph Ring | cipher-glyph-ring | avatar-item | uncommon | Ciphers | Earn Cipher Lantern | Avatar Builder | /relic-assets/ciphers/cipher-glyph-ring.png | A tiny ring of harmless impossible letters. |
| Archive Witness Tab | archive-witness-tab | avatar-item | common | Archive | Read first archive item | Avatar Builder | /relic-assets/archive/archive-witness-tab.png | A tab for the page that would not stay buried. |
| Bone Index Tab | bone-index-tab | relic | uncommon | Archive | Approved lore or archive contribution | Relic Zone | /relic-assets/archive/bone-index-tab.png | The index card feels warmer than bone should. |
| Archive Terminal Background | archive-terminal-background | profile-cosmetic | uncommon | Archive | Read five archive items | Profile World | /relic-assets/archive/archive-terminal-background.png | Shelves, cursor glow, and a memory that bites. |
| Repo Relic Mark | repo-relic-mark | badge | common | Ghost in Tech | Read Ghost in Tech item | Badge Case | /relic-assets/ghost-in-tech/repo-relic-mark.png | Some code is a public lantern. |
| Memory Has Teeth | memory-has-teeth | lore-fragment | rare | Archive | Recover Dead Index trace | Archive | /relic-assets/archive/memory-has-teeth.png | The archive did not forgive deletion. |
| Ghost in Tech Repo Chip | ghost-in-tech-repo-chip | avatar-item | uncommon | Ghost in Tech | Submit approved repo summary | Avatar Builder | /relic-assets/ghost-in-tech/ghost-in-tech-repo-chip.png | A chip with a ghost-shaped checksum. |
| Town Square Terminal Frame | town-square-terminal-frame | profile-cosmetic | common | Rooms | Visit Town Square | Profile World | /relic-assets/rooms/town-square-terminal-frame.png | The square was never square, but it had corners for you. |
| Signal Board Patch | signal-board-patch | avatar-item | common | Rooms | Read Signal Board | Avatar Builder | /relic-assets/rooms/signal-board-patch.png | A patch for those who checked the board. |
| Commons Spark | commons-spark-loot | relic | uncommon | Community | Complete first community contribution | Relic Zone | /relic-assets/community/commons-spark-loot.png | A small fire under the floorboards. |
| Pomegranate Gate Pass | pomegranate-gate-pass | room-access | common | Rooms | Complete first field log | Field Log | /relic-assets/rooms/pomegranate-gate-pass.png | The gate printed your name in disappearing ink. |
| Black Clinic Curtain | black-clinic-curtain | profile-cosmetic | uncommon | Factions | Complete Veil intro | Profile World | /relic-assets/factions/black-clinic-curtain.png | Privacy hangs softer than armor. |
| Veil Clinic Patch | veil-clinic-patch | avatar-item | common | Factions | Complete Asclepian mission | Avatar Builder | /relic-assets/factions/veil-clinic-patch.png | Care, stitched in green. |
| Care Signal Card | care-signal-card | relic | uncommon | Factions | Approved care prompt | Relic Zone | /relic-assets/factions/care-signal-card.png | Not advice. A reminder that nobody heals alone. |
| Signal Chapel Terminal Prompt | signal-chapel-terminal-prompt | profile-cosmetic | uncommon | Factions | Complete Oracular floor intro | Profile World | /relic-assets/factions/signal-chapel-terminal-prompt.png | The cursor blinks like an omen. |
| Oracle Headset | oracle-headset | avatar-item | uncommon | Factions | Complete Oracle Hygiene Check | Avatar Builder | /relic-assets/factions/oracle-headset.png | It only hears fictional prophecy. Mostly. |
| Broken Delphi Sticker | broken-delphi-sticker | avatar-item | common | Ciphers | Read Oracular Static | Avatar Builder | /relic-assets/ciphers/broken-delphi-sticker.png | No oracle is divine when the sticker peels. |
| Cerberus Gate Stamp | cerberus-gate-stamp | avatar-item | common | Factions | Complete Gatewatch mission | Avatar Builder | /relic-assets/factions/cerberus-gate-stamp.png | Three heads. One accessible entrance. |
| Gatehouse Runner Pass | gatehouse-runner-pass | room-access | common | Factions | Visit Gatehouse floor | Field Log | /relic-assets/factions/gatehouse-runner-pass.png | Hold the door without owning it. |
| Route Witness Map | route-witness-map | relic | uncommon | Accessibility | Approved route note | Relic Zone | /relic-assets/accessibility/route-witness-map.png | The path became real when someone named the barrier. |
| Foundry Spark Charm | foundry-spark-charm | avatar-item | common | Forge | Complete Foundry mission or QA task | Avatar Builder | /relic-assets/forge/foundry-spark-charm.png | A small orange spark that refuses to become a cage. |
| Forge Toolkit | forge-toolkit | avatar-item | uncommon | Forge | Approved bug or docs report | Avatar Builder | /relic-assets/forge/forge-toolkit.png | Fictional props and tech gear for repair rituals. |
| Foundry Bench Glow | foundry-bench-glow | profile-cosmetic | uncommon | Forge | Complete repair log | Profile World | /relic-assets/forge/foundry-bench-glow.png | The bench is warm because someone documented the fix. |
| Labyrinth Note | labyrinth-note | lore-fragment | rare | Forge | Complete Labyrinth Repair Log | Archive | /relic-assets/forge/labyrinth-note.png | Every maze has a maintenance closet. |
| Rat Sticker Pack | rat-sticker-pack | avatar-item | common | Styx Rats | Complete Rat Nest prompt | Avatar Builder | /relic-assets/styx-rats/rat-sticker-pack.png | Small insults to large gods. |
| Zine Packet | zine-packet | avatar-item | uncommon | Styx Rats | Approved zine line | Avatar Builder | /relic-assets/styx-rats/zine-packet.png | Folded paper. Unfolded morale. |
| Rat Nest Wall | rat-nest-wall | profile-cosmetic | uncommon | Styx Rats | Complete Morale Signal Drop | Profile World | /relic-assets/styx-rats/rat-nest-wall.png | A wall that never learned obedience. |
| Zine Spark Button | zine-spark-button | avatar-item | common | Community | Submit zine/banner line | Avatar Builder | /relic-assets/community/zine-spark-button.png | The button says the quiet part in glitter. |
| Underwatch Pass Lanyard | underwatch-pass-lanyard | avatar-item | common | Rooms | Complete room intro chain | Avatar Builder | /relic-assets/rooms/underwatch-pass-lanyard.png | Nobody checked it. Everyone respected it. |
| Dead Index Badge Chain | dead-index-badge-chain | avatar-item | relic | Recognition | Owner grant | Avatar Builder | /relic-assets/recognition/dead-index-badge-chain.png | A chain of names that refused deletion. |
| Black Cache Sticker | black-cache-sticker | avatar-item | common | Dead Drops | Complete beginner Dead Drop | Avatar Builder | /relic-assets/dead-drops/black-cache-sticker.png | Stick it somewhere the algorithm hates looking. |
| Pomegranate Terminal Pin | pomegranate-terminal-pin | avatar-item | common | Rooms | Visit Town Square | Avatar Builder | /relic-assets/rooms/pomegranate-terminal-pin.png | A seed with a cursor blinking inside. |
| Net Neighbor Lantern Pin | net-neighbor-lantern-pin | avatar-item | uncommon | Net Neighbors | Approved Net Neighbor | Avatar Builder | /relic-assets/net-neighbors/net-neighbor-lantern-pin.png | A porch light for the old web. |
| Accessibility Scribe Ribbon | accessibility-scribe-ribbon | avatar-item | uncommon | Accessibility | Approved accessibility note | Avatar Builder | /relic-assets/accessibility/accessibility-scribe-ribbon.png | A ribbon for widening the door. |
| Privacy Relay Token | privacy-relay-token | avatar-item | uncommon | Oracular Circuit | Privacy literacy prompt | Avatar Builder | /relic-assets/oracular-circuit/privacy-relay-token.png | Less data is often more safety. |
| Mini Archive Shelf | mini-archive-shelf | avatar-item | uncommon | Archive | Earn Archive Witness | Avatar Builder | /relic-assets/archive/mini-archive-shelf.png | A shelf small enough to carry, large enough to matter. |
| Relic Tablet | relic-tablet | avatar-item | rare | Lore | Approved Tier 3 lore | Avatar Builder | /relic-assets/lore/relic-tablet.png | The tablet records only fictional ghosts. |
| Archive Terminal Card | archive-terminal-card | avatar-item | common | Archive | Read Archive Terminal | Avatar Builder | /relic-assets/archive/archive-terminal-card.png | Access to memory, not authority. |
| Signal Scanner Charm | signal-scanner-charm | avatar-item | uncommon | Ciphers | Solve five ciphers | Avatar Builder | /relic-assets/ciphers/signal-scanner-charm.png | It detects vibes, static, and poetic UI text. |
| Dead Drop Receipt | dead-drop-receipt | avatar-item | common | Dead Drops | QA or complete Dead Drop | Avatar Builder | /relic-assets/dead-drops/dead-drop-receipt.png | The receipt says: paid in attention. |
| Forum Lantern Flair | forum-lantern-flair | forum-flair | common | Community | Helpful forum participation | Forum Flair | /relic-assets/community/forum-lantern-flair.png | A little light beside the username. |
| Guild Thread Banner | guild-thread-banner | guild-banner | uncommon | Guilds | Create approved guild activity | Guild Page | /relic-assets/guilds/guild-thread-banner.png | A banner woven from posts that stayed kind. |
| Static Garden Banner | static-garden-banner | guild-banner | uncommon | Guilds | Static Gardeners milestone | Guild Page | /relic-assets/guilds/static-garden-banner.png | Leaves under monitor glow. |
| Rat Nest Print Banner | rat-nest-print-banner | guild-banner | uncommon | Guilds | Rat Nest Print Club milestone | Guild Page | /relic-assets/guilds/rat-nest-print-banner.png | Sticker weather in the undercity. |
| Lantern Thread Banner | lantern-thread-banner | guild-banner | uncommon | Guilds | Lantern Thread milestone | Guild Page | /relic-assets/guilds/lantern-thread-banner.png | The welcome thread never went dark. |
| Static Player Skin | static-player-skin | signal-player-unlock | uncommon | Signal Player | Approved Signal Player theme | Signal Player | /relic-assets/signal-player/static-player-skin.png | Music from behind the wall. |
| Archive Whisper Tone | archive-whisper-tone | signal-player-unlock | uncommon | Signal Player | Archive reading milestone | Signal Player | /relic-assets/signal-player/archive-whisper-tone.png | A page turn, distant and warm. |
| Rat Nest Radio Skin | rat-nest-radio-skin | signal-player-unlock | uncommon | Signal Player | Styx Rats morale contribution | Signal Player | /relic-assets/signal-player/rat-nest-radio-skin.png | Broadcasting from a stickered sewer pipe. |
| Black Clinic Soft Signal | black-clinic-soft-signal | signal-player-unlock | uncommon | Signal Player | Veil care prompt completed | Signal Player | /relic-assets/signal-player/black-clinic-soft-signal.png | A tone that does not demand an answer. |
| Relic Shelf Starter | relic-shelf-starter | relic-zone-module | common | Relic Zone | Earn first relic | Relic Zone | /relic-assets/relic-zone/relic-shelf-starter.png | One shelf. One proof you were here. |
| Bone Glass Display | bone-glass-display | relic-zone-module | rare | Relic Zone | Earn five relics | Relic Zone | /relic-assets/relic-zone/bone-glass-display.png | Not a trophy case. A memory ward. |
| Badge Case Hex Grid | badge-case-hex-grid | profile-cosmetic | common | Badge Case | Earn three badges | Badge Case | /relic-assets/badge-case/badge-case-hex-grid.png | Every mark gets a little cell of its own. |
| Net Neighbor Banner Part: Left Lantern | net-neighbor-left-lantern | net-neighbor-banner-part | common | Net Neighbors | Approved Net Neighbor idea | Profile World | /relic-assets/net-neighbors/net-neighbor-left-lantern.png | A left-side light for the neighbor ring. |
| Net Neighbor Banner Part: Static Border | net-neighbor-static-border | net-neighbor-banner-part | uncommon | Net Neighbors | Net Neighbor milestone | Profile World | /relic-assets/net-neighbors/net-neighbor-static-border.png | A border that hums politely. |
| Faction Floor Backdrop | faction-floor-backdrop | profile-cosmetic | uncommon | Factions | Visit all faction floors | Profile World | /relic-assets/factions/faction-floor-backdrop.png | Five doors in one long underworld hallway. |
## Avatar Unlock Asset Rewards

Avatar assets should eventually map to files under:

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

Use the category label `Fictional Props & Tech Gear` for props and carried tech. Do not use weapon framing.

| Asset Name | Slug | Avatar Category | Rarity | Faction Affinity | Unlock Source | Suggested File Path | Layer Order | Visual Description |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pomegranate Terminal Pin | pomegranate-terminal-pin | accessories | common | Chthonic Uprising | Town Square arrival | public/avatar-assets/accessories/pomegranate-terminal-pin.png | 60 | Small pomegranate seed pin with terminal cursor glow. |
| Black Cache Sticker | black-cache-sticker | accessories | common | Chthonic Uprising | Beginner Dead Drop | public/avatar-assets/accessories/black-cache-sticker.png | 62 | Matte black sticker with cache slash mark. |
| Oracle Headset | oracle-headset | tech-gear | uncommon | Oracular Circuit | Oracle Hygiene Check | public/avatar-assets/tech-gear/oracle-headset.png | 70 | Violet/cyan headset with harmless relay glyphs. |
| Broken Delphi Sticker | broken-delphi-sticker | accessories | common | Oracular Circuit | Oracular Static read | public/avatar-assets/accessories/broken-delphi-sticker.png | 61 | Cracked tripod sticker with static halo. |
| Rat Sticker Pack | rat-sticker-pack | accessories | common | Styx Rats | Rat Nest prompt | public/avatar-assets/accessories/rat-sticker-pack.png | 63 | Layered punk stickers and tiny rat skulls. |
| Veil Clinic Patch | veil-clinic-patch | faction-flair | common | Asclepian Veil | Black Clinic Readiness | public/avatar-assets/faction-flair/veil-clinic-patch.png | 64 | Green clinic patch with privacy veil. |
| Cerberus Gate Stamp | cerberus-gate-stamp | faction-flair | common | Myrmidon Grinders | Gatewatch Readiness Map | public/avatar-assets/faction-flair/cerberus-gate-stamp.png | 64 | Bronze stamp with three-headed gate icon. |
| Foundry Spark Charm | foundry-spark-charm | accessories | common | Daedalus Foundry | Labyrinth Repair Log | public/avatar-assets/accessories/foundry-spark-charm.png | 65 | Tiny orange spark charm on brass loop. |
| Archive Witness Tab | archive-witness-tab | accessories | common | Archive | Read Archive Terminal | public/avatar-assets/accessories/archive-witness-tab.png | 60 | Paper index tab clipped to avatar layer. |
| Ghost in Tech Repo Chip | ghost-in-tech-repo-chip | tech-gear | uncommon | Daedalus Foundry | Approved repo relic | public/avatar-assets/tech-gear/ghost-in-tech-repo-chip.png | 66 | Circuit chip with ghost-shaped trace. |
| Net Neighbor Lantern Pin | net-neighbor-lantern-pin | accessories | uncommon | Community | Approved Net Neighbor | public/avatar-assets/accessories/net-neighbor-lantern-pin.png | 62 | Little porch lantern icon in old-web colors. |
| Accessibility Scribe Ribbon | accessibility-scribe-ribbon | accessories | uncommon | Asclepian Veil | Approved accessibility note | public/avatar-assets/accessories/accessibility-scribe-ribbon.png | 61 | Soft ribbon with gate and quill motif. |
| Cipher Glyph Ring | cipher-glyph-ring | accessories | uncommon | Oracular Circuit | Cipher Lantern | public/avatar-assets/accessories/cipher-glyph-ring.png | 58 | Ring of fictional glyphs, small and non-harmful. |
| Static Courier Satchel | static-courier-satchel | back-items | rare | Chthonic Uprising | Complete five Dead Drops | public/avatar-assets/back-items/static-courier-satchel.png | 40 | Crossbody satchel with dead-drop receipts. |
| Dead Index Badge Chain | dead-index-badge-chain | accessories | relic | Chthonic Uprising | Owner grant | public/avatar-assets/accessories/dead-index-badge-chain.png | 67 | Chain of small index tags and pomegranate seed. |
| Signal Board Patch | signal-board-patch | faction-flair | common | Chthonic Uprising | Read Signal Board | public/avatar-assets/faction-flair/signal-board-patch.png | 64 | Patch showing blinking signal board. |
| Bone Index Earring | bone-index-earring | accessories | uncommon | Archive | Character Canon contribution | public/avatar-assets/accessories/bone-index-earring.png | 59 | Tiny bone-white index card earring. |
| Underwatch Pass Lanyard | underwatch-pass-lanyard | accessories | common | Chthonic Uprising | Room intro chain | public/avatar-assets/accessories/underwatch-pass-lanyard.png | 68 | Lanyard with disappearing underworld pass. |
| Zine Spark Button | zine-spark-button | accessories | common | Styx Rats | Approved zine line | public/avatar-assets/accessories/zine-spark-button.png | 62 | Punk button with spark burst text. |
| Commons Builder Patch | commons-builder-patch | faction-flair | uncommon | Community | Community Builder approved | public/avatar-assets/faction-flair/commons-builder-patch.png | 64 | Patch of bench, spark, and terminal cursor. |
| Cracked Cache Key | cracked-cache-key-avatar | fictional-props | uncommon | Chthonic Uprising | Signal Cache Recovered | public/avatar-assets/fictional-props/cracked-cache-key.png | 80 | Decorative cracked key, not functional. |
| Bent Oracle Key | bent-oracle-key-avatar | fictional-props | uncommon | Oracular Circuit | Solve relay cipher | public/avatar-assets/fictional-props/bent-oracle-key.png | 80 | Bent key with violet signal thread. |
| Mini Archive Shelf | mini-archive-shelf | fictional-props | uncommon | Archive | Archive Witness | public/avatar-assets/fictional-props/mini-archive-shelf.png | 82 | Tiny floating shelf with safe relic tabs. |
| Signal Scanner Charm | signal-scanner-charm | tech-gear | uncommon | Oracular Circuit | Solve five ciphers | public/avatar-assets/tech-gear/signal-scanner-charm.png | 72 | Decorative scanner charm for fictional signals. |
| Relic Tablet | relic-tablet | fictional-props | rare | Archive | Tier 3 lore approved | public/avatar-assets/fictional-props/relic-tablet.png | 81 | Small tablet etched with harmless lore glyphs. |
| Dead Drop Receipt | dead-drop-receipt | fictional-props | common | Chthonic Uprising | Dead Drop QA or completion | public/avatar-assets/fictional-props/dead-drop-receipt.png | 83 | Long receipt reading paid in attention. |
| Forge Toolkit | forge-toolkit | fictional-props | uncommon | Daedalus Foundry | Approved bug/documentation report | public/avatar-assets/fictional-props/forge-toolkit.png | 84 | Soft-sided fictional toolkit with orange tags. |
| Zine Packet | zine-packet | fictional-props | uncommon | Styx Rats | Approved zine contribution | public/avatar-assets/fictional-props/zine-packet.png | 83 | Folded zine packet with neon staples. |
| Privacy Relay Token | privacy-relay-token | tech-gear | uncommon | Oracular Circuit | Privacy literacy prompt | public/avatar-assets/tech-gear/privacy-relay-token.png | 72 | Small token with shielded signal mark. |
| Archive Terminal Card | archive-terminal-card | tech-gear | common | Archive | Archive Terminal intro | public/avatar-assets/tech-gear/archive-terminal-card.png | 71 | Plastic terminal card with bone-white stripe. |
| Archive Terminal Background | archive-terminal-background | backgrounds | uncommon | Archive | Read five archive items | public/avatar-assets/backgrounds/archive-terminal-background.png | 10 | Archive shelves and green terminal glow. |
| Dead Drop Terminal Frame | dead-drop-terminal-frame-avatar | backgrounds | uncommon | Chthonic Uprising | Complete Dead Drop intro | public/avatar-assets/backgrounds/dead-drop-terminal-frame.png | 12 | Terminal border with black cache corners. |
| Violet Relay Border | violet-relay-border-avatar | effects | uncommon | Oracular Circuit | Solve three ciphers | public/avatar-assets/effects/violet-relay-border.png | 95 | Subtle violet static border. |
| Faction Floor Backdrop | faction-floor-backdrop-avatar | backgrounds | uncommon | Chthonic Uprising | Visit all faction floors | public/avatar-assets/backgrounds/faction-floor-backdrop.png | 10 | Five faction doors in an underworld hall. |
| Rat Nest Wall | rat-nest-wall-avatar | backgrounds | uncommon | Styx Rats | Complete Morale Signal Drop | public/avatar-assets/backgrounds/rat-nest-wall.png | 10 | Sticker-bombed wall with safe graffiti. |
| Black Clinic Curtain | black-clinic-curtain-avatar | backgrounds | uncommon | Asclepian Veil | Complete Veil care prompt | public/avatar-assets/backgrounds/black-clinic-curtain.png | 10 | Soft black clinic curtain with green glow. |
| Foundry Bench Glow | foundry-bench-glow-avatar | backgrounds | uncommon | Daedalus Foundry | Complete repair log | public/avatar-assets/backgrounds/foundry-bench-glow.png | 10 | Warm workbench glow and schematic shadows. |
| Town Square Terminal Frame | town-square-terminal-frame-avatar | backgrounds | common | Chthonic Uprising | Enter Town Square | public/avatar-assets/backgrounds/town-square-terminal-frame.png | 11 | Old BBS plaza frame. |
| Lantern Thread Pin | lantern-thread-pin | accessories | common | Community | Welcome thread contribution | public/avatar-assets/accessories/lantern-thread-pin.png | 62 | Small lantern with thread line. |
| Guild Thread Charm | guild-thread-charm | accessories | uncommon | Guilds | Guild activity template approved | public/avatar-assets/accessories/guild-thread-charm.png | 63 | Charm made of tiny banner thread. |
| Field Log Tab | field-log-tab | accessories | common | Missions | Approved field log | public/avatar-assets/accessories/field-log-tab.png | 60 | Filed tab labeled LOG in pomegranate ink. |
| Route Witness Compass | route-witness-compass | tech-gear | uncommon | Myrmidon Grinders | Approved route/accessibility note | public/avatar-assets/tech-gear/route-witness-compass.png | 72 | Nonfunctional compass showing accessible paths. |
| Signal Player Earbud | signal-player-earbud | tech-gear | uncommon | Signal Player | Approved playlist theme | public/avatar-assets/tech-gear/signal-player-earbud.png | 70 | Single decorative earbud with static seed. |
## Mission Reward Mapping

## Black Clinic Readiness

**Mission Slug:** `black-clinic-readiness`  
**Faction:** Asclepian Veil  
**Completion Badge:** `black-clinic-readiness`  
**Reputation Reward:** +12 Faction, +5 Accessibility if reviewed  
**Loot Rewards:** Black Clinic Visitor title; Care Signal Card; Veil Commons Field Note  
**Avatar Unlocks:** Veil Clinic Patch; Black Clinic Curtain; Accessibility Scribe Ribbon  
**Relic Unlocks:** Care Signal Card  
**Profile Cosmetic Unlocks:** Black Clinic Curtain  
**Lore Unlocks:** `privacy-is-medicine`  
**Admin Assignment Notes:** Manual grant allowed if verified outside normal flow.  
**Faction Leader Notes:** Veil leaders may recommend care-prompt rewards; no medical authority grants.

## Oracle Hygiene Check

**Mission Slug:** `oracle-hygiene-check`  
**Faction:** Oracular Circuit  
**Completion Badge:** `oracle-hygiene-check`  
**Reputation Reward:** +12 Ciphers/Faction  
**Loot Rewards:** Signal Reader title; Privacy Relay Token; Oracular Static fragment  
**Avatar Unlocks:** Oracle Headset; Privacy Relay Token; Broken Delphi Sticker  
**Relic Unlocks:** Bent Oracle Key  
**Profile Cosmetic Unlocks:** Violet Relay Border  
**Lore Unlocks:** `oracular-static`  
**Admin Assignment Notes:** Ensure privacy literacy, not real hacking.  
**Faction Leader Notes:** Circuit leaders may submit safe cipher missions for approval.

## Gatewatch Readiness Map

**Mission Slug:** `gatewatch-readiness-map`  
**Faction:** Myrmidon Grinders  
**Completion Badge:** `gatewatch-readiness-map`  
**Reputation Reward:** +12 Faction, +5 Accessibility if reviewed  
**Loot Rewards:** Gatehouse Runner title; Route Witness Map; Gatehouse Runner Pass  
**Avatar Unlocks:** Cerberus Gate Stamp; Route Witness Compass; Underwatch Pass Lanyard  
**Relic Unlocks:** Route Witness Map  
**Profile Cosmetic Unlocks:** Gatehouse Terminal Frame  
**Lore Unlocks:** `a-gate-is-only-good-if-everyone-can-pass`  
**Admin Assignment Notes:** Reject sensitive locations or unsafe tactical claims.  
**Faction Leader Notes:** Grinder leaders may recommend logistics/readiness rewards only.

## Labyrinth Repair Log

**Mission Slug:** `labyrinth-repair-log`  
**Faction:** Daedalus Foundry  
**Completion Badge:** `labyrinth-repair-log`  
**Reputation Reward:** +12 Forge/Faction  
**Loot Rewards:** Forge Hand title; Labyrinth Note; Documentation Lantern progress  
**Avatar Unlocks:** Foundry Spark Charm; Forge Toolkit; Foundry Bench Glow  
**Relic Unlocks:** Labyrinth Note  
**Profile Cosmetic Unlocks:** Foundry Bench Glow  
**Lore Unlocks:** `every-labyrinth-needs-maintenance`  
**Admin Assignment Notes:** Useful bug reports may receive Forge Credit.  
**Faction Leader Notes:** Foundry leaders may select repair/docs rewards from approved pool.

## Morale Signal Drop

**Mission Slug:** `morale-signal-drop`  
**Faction:** Styx Rats  
**Completion Badge:** `morale-signal-drop`  
**Reputation Reward:** +12 Community/Faction  
**Loot Rewards:** Rat Nest Regular title; Zine Spark Button; safe forum flair  
**Avatar Unlocks:** Rat Sticker Pack; Zine Packet; Rat Nest Wall  
**Relic Unlocks:** Morale Receipt  
**Profile Cosmetic Unlocks:** Rat Nest Wall  
**Lore Unlocks:** `joy-is-sabotage-but-care-is-the-wire`  
**Admin Assignment Notes:** Review public zine/graffiti lines before display.  
**Faction Leader Notes:** Rat leaders may recommend art/morale rewards but not harassment.

## Dead Drop Reward Mapping

| Dead Drop Title | Slug | Loop | Badge Reward | Reputation Reward | Loot Reward | Avatar Unlock | Lore Unlock | Review Requirement |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| First Signal Board | first-signal-board | Underwatch Town Square | signal-board-reader | 3 | Signal Board Patch | Signal Board Patch | the-board-blinks-back | none |
| Leave a Safe Field Note | leave-safe-field-note | Underwatch Town Square | first-field-note | 10 | Pomegranate Gate Pass | Pomegranate Terminal Pin | field-log-heartbeat | auto/moderated |
| Commons Spark Prompt | commons-spark-prompt | Underwatch Town Square | commons-spark | 8 | Commons Spark | Commons Builder Patch | commons-under-static | required |
| Static Cache 001 | static-cache-001 | Dead Drop Terminal | dead-drop-initiate | 8 | Black Cache Sticker | Black Cache Sticker | cache-under-ordinary-world | none |
| Cracked Cache Key | cracked-cache-key-drop | Dead Drop Terminal | signal-cache-recovered | 10 | Cracked Cache Key | Cracked Cache Key | the-first-dead-index | required |
| Zine Line: Laugh at the Gods | zine-line-laugh-at-gods | Dead Drop Terminal | drop-runner | 8 | Zine Spark Button | Zine Spark Button | rat-laughter-fragment | required |
| Resource Drop: Public Lantern | resource-drop-public-lantern | Dead Drop Terminal | archive-credit | 12 | Archive Terminal Card | Archive Terminal Card | public-interest-lantern | required |
| Care Idea: Quiet Bench | care-idea-quiet-bench | Dead Drop Terminal | black-clinic-visitor | 10 | Care Signal Card | Veil Clinic Patch | care-is-infrastructure | required |
| Mini Cipher: Static Seed | mini-cipher-static-seed | Dead Drop Terminal | c1ph3r-cr4k3r-initiate | 6 | Cipher Glyph Ring | Cipher Glyph Ring | static-seed-answer | answer validation |
| Archive Artifact: Bone Tab | archive-artifact-bone-tab | Dead Drop Terminal | archive-terminal-reader | 6 | Bone Index Tab | Bone Index Earring | bone-tab-memory | none |
| Relay Whisper One | relay-whisper-one | Oracular Relay | oracular-relay-initiate | 5 | Signal Reader title | Oracle Headset | oracular-static | answer validation |
| Hint Ladder Test | hint-ladder-test | Oracular Relay | hint-reader | 1 | Hint Candle Flair | Broken Delphi Sticker | none | none |
| False Omen Exercise | false-omen-exercise | Oracular Relay | false-omen-corrected | 10 | Bent Oracle Key | Bent Oracle Key | false-omen-corrected | answer validation |
| Black Clinic Comfort Note | black-clinic-comfort-note | Faction Floors | black-clinic-visitor | 10 | Black Clinic Curtain | Accessibility Scribe Ribbon | privacy-is-medicine | required |
| Signal Chapel Hygiene Note | signal-chapel-hygiene-note | Faction Floors | signal-chapel-listener | 10 | Privacy Relay Token | Privacy Relay Token | no-algorithm-is-divine | required |
| Gatehouse Route Note | gatehouse-route-note | Faction Floors | gatehouse-runner | 10 | Route Witness Map | Route Witness Compass | a-gate-is-only-good | required |
| Foundry Bench Repair Note | foundry-bench-repair-note | Faction Floors | foundry-bench-spark | 10 | Forge Toolkit | Forge Toolkit | maintenance-tunnel | required |
| Rat Nest Morale Line | rat-nest-morale-line | Faction Floors | rat-nest-regular | 10 | Rat Sticker Pack | Rat Sticker Pack | joy-left-a-mark | required |
| Archive Reading Question | archive-reading-question | Archive Terminal | archive-terminal-reader | 6 | Archive Witness Tab | Archive Witness Tab | memory-has-teeth | required |
| Ghost in Tech Repo Relic | ghost-in-tech-repo-relic | Archive Terminal | ghost-in-tech-runner | 15 | Ghost in Tech Repo Chip | Ghost in Tech Repo Chip | some-machines-help | required |
| State of Affairs Reflection | state-of-affairs-reflection | Archive Terminal | state-of-affairs-scout | 8 | Archive Whisper Tone | Archive Terminal Card | surface-watched-safely | required |
| Dead Index Trace | dead-index-trace-drop | Archive Terminal | dead-index-trace | 12 | Dead Index Badge Chain | Dead Index Badge Chain | memory-has-teeth | Owner/Admin review |
## Cipher Reward Mapping

| Chain Stage | Cipher Badge Slug | Unlock Requirement | Reputation | Avatar Unlock | Profile Cosmetic | Lore Unlock | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Initiate | c1ph3r-cr4k3r-initiate | Solve first safe cipher | 6 | Cipher Glyph Ring | none | first-static-key | Puzzle only. |
| Signal Reader | c1ph3r-cr4k3r-signal-reader | Solve three ciphers | 10 | Signal Scanner Charm | Violet Relay Border | oracular-static | Rate-limit attempts. |
| Index Scribe | c1ph3r-cr4k3r-index-scribe | Solve seven ciphers | 15 | Archive Terminal Card | Cipher Glyph Badge Case Style | index-scribe-note | Add solved-signal history. |
| Oracle Key | c1ph3r-cr4k3r-oracle-key | Solve twelve ciphers | 20 | Bent Oracle Key | Oracle Static Profile Frame | oracle-key-fragment | Higher tier puzzle, still safe. |
| Dead Index Adept | c1ph3r-cr4k3r-dead-index-adept | Complete C1PH3R chain | 30 | Dead Index Badge Chain | Dead Index Relay Background | dead-index-adept-fragment | Relic-tier, no real hacking. |
Additional cipher-related rewards:

| Reward Name | Slug | Type | Unlock Source | Notes |
| --- | --- | --- | --- | --- |
| Hint Reader | hint-reader-title | title | Request three hints | Encourages learning without shame. |
| Static Decoder | static-decoder-title | title | Solve Oracular Relay challenge | Display on dossier. |
| Broken Delphi Sticker | broken-delphi-sticker | avatar-item | Read Oracular Static | Cosmetic only. |
| Relay Tone | relay-tone | signal-player-unlock | Solve five ciphers | No autoplay. |
| False Omen Corrected | false-omen-corrected-lore | lore-fragment | Solve false omen puzzle | Fictional prophecy only. |
## Faction Mission Reward Mapping

### Asclepian Veil Reward Bundles

| Bundle Name | Faction | Mission Style | Badge | Reputation | Avatar Asset | Profile Cosmetic | Lore Unlock | Notes for Faction Leaders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Asclepian Veil Intro Reflection | Asclepian Veil | reflection | asclepian-veil-visitor | 10 | Veil Clinic Patch | faction frame | first-floor-memory | Faction leaders may recommend; Admin approves. |
| Asclepian Veil Resource Lantern | Asclepian Veil | resource-summary | resource badge | 12 | resource token | terminal prompt | safe-resource-fragment | Review required. |
| Asclepian Veil Accessibility / Clarity Note | Asclepian Veil | accessibility-note | accessibility-scribe | 12 | access ribbon | accessible frame | gate-wide-fragment | No private data. |
| Asclepian Veil Lore Echo | Asclepian Veil | lore-prompt | faction-echo-scribe | 10 | relic tab | lore display module | faction-echo | Canon tier review. |
| Asclepian Veil Steward Credit | Asclepian Veil | volunteer contribution | forge-credit | 15 | faction charm | badge case accent | steward-memory | Admin approval required. |

### Oracular Circuit Reward Bundles

| Bundle Name | Faction | Mission Style | Badge | Reputation | Avatar Asset | Profile Cosmetic | Lore Unlock | Notes for Faction Leaders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Oracular Circuit Intro Reflection | Oracular Circuit | reflection | oracular-circuit-visitor | 10 | Oracle Headset | faction frame | first-floor-memory | Faction leaders may recommend; Admin approves. |
| Oracular Circuit Resource Lantern | Oracular Circuit | resource-summary | resource badge | 12 | resource token | terminal prompt | safe-resource-fragment | Review required. |
| Oracular Circuit Accessibility / Clarity Note | Oracular Circuit | accessibility-note | accessibility-scribe | 12 | access ribbon | accessible frame | gate-wide-fragment | No private data. |
| Oracular Circuit Lore Echo | Oracular Circuit | lore-prompt | faction-echo-scribe | 10 | relic tab | lore display module | faction-echo | Canon tier review. |
| Oracular Circuit Steward Credit | Oracular Circuit | volunteer contribution | forge-credit | 15 | faction charm | badge case accent | steward-memory | Admin approval required. |

### Myrmidon Grinders Reward Bundles

| Bundle Name | Faction | Mission Style | Badge | Reputation | Avatar Asset | Profile Cosmetic | Lore Unlock | Notes for Faction Leaders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Myrmidon Grinders Intro Reflection | Myrmidon Grinders | reflection | myrmidon-grinders-visitor | 10 | Cerberus Gate Stamp | faction frame | first-floor-memory | Faction leaders may recommend; Admin approves. |
| Myrmidon Grinders Resource Lantern | Myrmidon Grinders | resource-summary | resource badge | 12 | resource token | terminal prompt | safe-resource-fragment | Review required. |
| Myrmidon Grinders Accessibility / Clarity Note | Myrmidon Grinders | accessibility-note | accessibility-scribe | 12 | access ribbon | accessible frame | gate-wide-fragment | No private data. |
| Myrmidon Grinders Lore Echo | Myrmidon Grinders | lore-prompt | faction-echo-scribe | 10 | relic tab | lore display module | faction-echo | Canon tier review. |
| Myrmidon Grinders Steward Credit | Myrmidon Grinders | volunteer contribution | forge-credit | 15 | faction charm | badge case accent | steward-memory | Admin approval required. |

### Daedalus Foundry Reward Bundles

| Bundle Name | Faction | Mission Style | Badge | Reputation | Avatar Asset | Profile Cosmetic | Lore Unlock | Notes for Faction Leaders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Daedalus Foundry Intro Reflection | Daedalus Foundry | reflection | daedalus-foundry-visitor | 10 | Foundry Spark Charm | faction frame | first-floor-memory | Faction leaders may recommend; Admin approves. |
| Daedalus Foundry Resource Lantern | Daedalus Foundry | resource-summary | resource badge | 12 | resource token | terminal prompt | safe-resource-fragment | Review required. |
| Daedalus Foundry Accessibility / Clarity Note | Daedalus Foundry | accessibility-note | accessibility-scribe | 12 | access ribbon | accessible frame | gate-wide-fragment | No private data. |
| Daedalus Foundry Lore Echo | Daedalus Foundry | lore-prompt | faction-echo-scribe | 10 | relic tab | lore display module | faction-echo | Canon tier review. |
| Daedalus Foundry Steward Credit | Daedalus Foundry | volunteer contribution | forge-credit | 15 | faction charm | badge case accent | steward-memory | Admin approval required. |

### Styx Rats Reward Bundles

| Bundle Name | Faction | Mission Style | Badge | Reputation | Avatar Asset | Profile Cosmetic | Lore Unlock | Notes for Faction Leaders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Styx Rats Intro Reflection | Styx Rats | reflection | styx-rats-visitor | 10 | Rat Sticker Pack | faction frame | first-floor-memory | Faction leaders may recommend; Admin approves. |
| Styx Rats Resource Lantern | Styx Rats | resource-summary | resource badge | 12 | resource token | terminal prompt | safe-resource-fragment | Review required. |
| Styx Rats Accessibility / Clarity Note | Styx Rats | accessibility-note | accessibility-scribe | 12 | access ribbon | accessible frame | gate-wide-fragment | No private data. |
| Styx Rats Lore Echo | Styx Rats | lore-prompt | faction-echo-scribe | 10 | relic tab | lore display module | faction-echo | Canon tier review. |
| Styx Rats Steward Credit | Styx Rats | volunteer contribution | forge-credit | 15 | faction charm | badge case accent | steward-memory | Admin approval required. |

### Chthonic Uprising Reward Bundles

| Bundle Name | Faction | Mission Style | Badge | Reputation | Avatar Asset | Profile Cosmetic | Lore Unlock | Notes for Faction Leaders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chthonic Uprising Intro Reflection | Chthonic Uprising | reflection | chthonic-uprising-visitor | 10 | Pomegranate Terminal Pin | faction frame | first-floor-memory | Faction leaders may recommend; Admin approves. |
| Chthonic Uprising Resource Lantern | Chthonic Uprising | resource-summary | resource badge | 12 | resource token | terminal prompt | safe-resource-fragment | Review required. |
| Chthonic Uprising Accessibility / Clarity Note | Chthonic Uprising | accessibility-note | accessibility-scribe | 12 | access ribbon | accessible frame | gate-wide-fragment | No private data. |
| Chthonic Uprising Lore Echo | Chthonic Uprising | lore-prompt | faction-echo-scribe | 10 | relic tab | lore display module | faction-echo | Canon tier review. |
| Chthonic Uprising Steward Credit | Chthonic Uprising | volunteer contribution | forge-credit | 15 | faction charm | badge case accent | steward-memory | Admin approval required. |

Faction leaders should be able to create faction missions later, but they should only be able to assign reward assets from approved faction reward pools unless Owner/Admin expands them.

## Guild Reward Mapping

| Reward Context | Badge | Title | Reputation | Loot / Avatar Unlock | Guild Page Unlock | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Guild founded and approved | guild-founder | Guild Founder | 15 | Guild Thread Charm | Starter guild banner slot | Not for spam guilds. |
| Guild reaches 5 members | guild-steward progress | Underwatch Host progress | 10 | Guild Banner Thread | Member list module | Must be active and safe. |
| Guild hosts approved activity | underwatch-host-badge | Underwatch Host | 15 | Lantern Thread Pin | Activity archive module | Moderator/Admin review. |
| Guild completes archive project | archive-credit | Bone Index Scribe | 15 | Mini Archive Shelf | Archive credit panel | Public-interest only. |
| Guild completes accessibility project | accessibility-scribe | Map Steward | 15 | Accessibility Scribe Ribbon | Access notes module | Review required. |
| Guild submits banner asset concept | community-builder | Banner Gremlin | 8 | Rat Sticker Pack | Banner preview slot | Asset review required. |
| Guild lore approved as Tier 2 | guild-lore-keeper | Lore Keeper | 12 | Bone Index Earring | Guild lore block | Guild steward approval required. |
| Guild steward recognized | moderator-commendation | Guild Steward | 20 | Guild Thread Charm | Steward mark | Manual recognition. |

Starter guild suggested banner assets and badge concepts:

| Guild | Suggested Banner Asset | Badge Concept |
| --- | --- | --- |
| The Lantern Thread | /guild-assets/banners/the-lantern-thread.png | The Lantern Thread Mark |
| Static Gardeners | /guild-assets/banners/static-gardeners.png | Static Gardeners Mark |
| The Bone Index Society | /guild-assets/banners/bone-index-society.png | The Bone Index Society Mark |
| Rat Nest Print Club | /guild-assets/banners/rat-nest-print-club.png | Rat Nest Print Club Mark |
| The Repair Choir | /guild-assets/banners/the-repair-choir.png | The Repair Choir Mark |
| Veil Commons Crew | /guild-assets/banners/veil-commons-crew.png | Veil Commons Crew Mark |
| Delphi After Dark | /guild-assets/banners/delphi-after-dark.png | Delphi After Dark Mark |
| The Gatewatch Mapmakers | /guild-assets/banners/gatewatch-mapmakers.png | The Gatewatch Mapmakers Mark |
## Archive and Ghost in Tech Reward Mapping

| Activity | Badge Reward | Title Reward | Reputation | Avatar Unlock | Relic / Loot | Safety Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Read first archive item | archive-terminal-reader | Archive Witness progress | 2 | Archive Witness Tab | Archive Terminal Card | Anti-refresh cap. |
| Read five archive items | archive-witness | Archive Witness | 10 | Mini Archive Shelf | Archive Terminal Background | No infinite read loops. |
| Read State of Affairs | state-of-affairs-scout | State Scout | 5 | Archive Terminal Card | Archive Whisper Tone | Keep discussion civil and source-aware. |
| Browse Ghost in Tech | repo-relic-reader | Repo Relic Reader | 5 | Ghost in Tech Repo Chip preview | Repo Relic Mark | No harmful repos. |
| Submit approved archive item | archive-credit | Archive Witness | 12 | Archive Witness Tab | Bone Index Tab | Review required. |
| Submit approved Ghost in Tech repo | ghost-in-tech-runner | Ghost in Tech Runner | 15 | Ghost in Tech Repo Chip | Repo Relic Patch | Repo safety review required. |
| Discuss archive item | archive-reader progress | Thread Tender progress | 6 | Bone Index Earring | Forum Lantern Flair | Moderator review. |
| Earn Archive Witness recognition | archive-witness | Archive Witness | 15 | Archive Witness Tab | Bone Index Tab | Opt-out supported. |
| Submit accessibility resource | accessibility-scribe | Accessibility Scribe | 12 | Accessibility Scribe Ribbon | Route Witness Map | No medical/legal advice. |
| Recover Dead Index trace | dead-index-trace | Dead Index Carrier | 20 | Dead Index Badge Chain | Memory Has Teeth | Owner/Admin review for canon. |
## Relic Zone and Profile World Unlocks

| Unlock Name | Slug | Type | Source | Suggested Asset Path | Visual Description |
| --- | --- | --- | --- | --- | --- |
| Town Square Terminal Frame | town-square-terminal-frame | profile-frame | Enter Underwatch Town Square | /profile-world-assets/frames/town-square-terminal-frame.png | Old BBS border with pomegranate cursor. |
| Dead Drop Terminal Frame | dead-drop-terminal-frame | profile-frame | Complete Dead Drop intro | /profile-world-assets/frames/dead-drop-terminal-frame.png | Black cache corners and static linework. |
| Violet Relay Border | violet-relay-border | profile-frame | Solve three ciphers | /profile-world-assets/frames/violet-relay-border.png | Violet/cyan relay static border. |
| Archive Terminal Background | archive-terminal-background | profile-background | Read five archive entries | /profile-world-assets/backgrounds/archive-terminal-background.png | Gothic archive shelves with terminal glow. |
| Black Clinic Curtain | black-clinic-curtain | profile-background | Complete Veil prompt | /profile-world-assets/backgrounds/black-clinic-curtain.png | Soft curtain, green diagnostic light. |
| Rat Nest Wall | rat-nest-wall | profile-background | Complete morale signal | /profile-world-assets/backgrounds/rat-nest-wall.png | Sticker-bombed undercity wall. |
| Foundry Bench Glow | foundry-bench-glow | profile-background | Complete repair log | /profile-world-assets/backgrounds/foundry-bench-glow.png | Warm schematic bench light. |
| Faction Floor Backdrop | faction-floor-backdrop | profile-background | Visit all faction floors | /profile-world-assets/backgrounds/faction-floor-backdrop.png | Five underworld faction doors. |
| Badge Case Hex Grid | badge-case-hex-grid | badge-case-style | Earn three badges | /profile-world-assets/badge-case/badge-case-hex-grid.png | Hexagonal badge sockets. |
| Bone Glass Display | bone-glass-display | relic-zone-module | Earn five relics | /profile-world-assets/modules/bone-glass-display.png | Glass case with bone-white tabs. |
| Relic Shelf Starter | relic-shelf-starter | relic-zone-module | Earn first relic | /profile-world-assets/modules/relic-shelf-starter.png | Single shelf for first relic. |
| Terminal Prompt: Oracle Static | terminal-prompt-oracle-static | terminal-prompt | Oracular Relay progress | /profile-world-assets/prompts/oracle-static.png | Cursor prompt styled as broken prophecy. |
| Terminal Prompt: Veil Clinic | terminal-prompt-veil-clinic | terminal-prompt | Veil mission progress | /profile-world-assets/prompts/veil-clinic.png | Soft green care terminal prompt. |
| Terminal Prompt: Rat Nest | terminal-prompt-rat-nest | terminal-prompt | Styx Rats mission progress | /profile-world-assets/prompts/rat-nest.png | Punk sticker prompt with safe glitch. |
| Signal Player Static Skin | signal-player-static-skin | signal-player-skin | Signal Player idea approved | /signal-player-assets/skins/static-player-skin.png | Old-web audio widget with static trim. |
| Signal Player Rat Radio | signal-player-rat-radio | signal-player-skin | Styx Rats contribution | /signal-player-assets/skins/rat-nest-radio-skin.png | Stickered radio terminal. |
| Gallery Frame: Bone Index | gallery-frame-bone-index | gallery-frame | Lore Keeper recognition | /profile-world-assets/gallery/bone-index-frame.png | Bone-tabbed gallery slot. |
| Gallery Frame: Forge Plate | gallery-frame-forge-plate | gallery-frame | Forge contribution | /profile-world-assets/gallery/forge-plate-frame.png | Brass schematic gallery plate. |
| Net Neighbor Left Lantern | net-neighbor-left-lantern | net-neighbor-banner-part | Net Neighbor approved | /profile-world-assets/net-neighbor/left-lantern.png | Left-side lantern for old-web banner. |
| Net Neighbor Static Border | net-neighbor-static-border | net-neighbor-banner-part | Net Neighbor milestone | /profile-world-assets/net-neighbor/static-border.png | Static edge for banner. |
| Net Neighbor Pomegranate Seal | net-neighbor-pomegranate-seal | net-neighbor-banner-part | Featured neighbor | /profile-world-assets/net-neighbor/pomegranate-seal.png | Small seal for approved neighbor nodes. |
## Signal Player Unlocks

| Unlock Name | Slug | Unlock Source | Faction Affinity | Visual / Audio Concept | Safety Note |
| --- | --- | --- | --- | --- | --- |
| Static Player Skin | static-player-skin | Approved Signal Player idea | Community | Old-web audio player covered in terminal static. | No autoplay. |
| Archive Whisper Tone | archive-whisper-tone | Read five archive entries | Archive | Soft page turn, distant terminal hum. | No autoplay; user-controlled playback. |
| Relay Tone | relay-tone | Solve five ciphers | Oracular Circuit | Violet relay ping and harmless static chirp. | No startling volume. |
| Rat Nest Radio Skin | rat-nest-radio-skin | Styx Rats morale contribution | Styx Rats | Stickered undercity radio with punk trim. | No autoplay; no explicit harassment audio. |
| Black Clinic Soft Signal | black-clinic-soft-signal | Veil care prompt | Asclepian Veil | Gentle diagnostic pulse and soft green meter. | No medical alert implication. |
| Foundry Bench Hum | foundry-bench-hum | Foundry repair log | Daedalus Foundry | Low workbench hum and schematic glow. | No harsh loops. |
| Dead Drop Receipt Click | dead-drop-receipt-click | Complete Dead Drop Terminal intro | Chthonic Uprising | Receipt printer click and cache chirp. | No repeated autoplay. |
| Pomegranate Gate Theme | pomegranate-gate-theme | Visit all five loops | Chthonic Uprising | Dark terminal skin with five glowing seeds. | User-controlled only. |
| Ghost in Tech Boot Tone | ghost-in-tech-boot-tone | Approved Ghost in Tech repo | Daedalus Foundry | Soft boot tone with ghostly checksum ping. | No deceptive system sounds. |
| Underwatch Night Broadcast | underwatch-night-broadcast | Owner/Admin recognition or community event | Chthonic Uprising | Late-night radio skin, warm static, city hum. | No autoplay and opt-out for profile display. |
## Image Asset Requirements

Naming conventions:

- lowercase
- kebab-case
- category prefix when useful
- stable slug matching data
- PNG/WEBP preferred
- no SVG user uploads unless explicitly trusted and sanitized
- image paths should not include raw user-provided filenames
- placeholder assets should be visually distinct from final artwork

| Asset Need | Suggested Path | Used By | Priority | Notes |
| --- | --- | --- | --- | --- |
| Guild icons | public/guild-assets/icons/[guild-slug].png | Guild cards, guild pages | phase-1 | One icon per starter guild. |
| Guild banners | public/guild-assets/banners/[guild-slug].png | Guild pages, Profile World | phase-1 | Wide old-web banner style. |
| Volunteer lane icons | public/community-assets/volunteer-lanes/[lane-slug].png | Volunteer board | phase-1 | Reusable category icons. |
| Recognition badges | public/community-assets/recognition/[recognition-slug].png | Public Recognition board | phase-1 | Supports opt-in display. |
| Reputation category icons | public/community-assets/reputation/[category-slug].png | Reputation history | phase-2 | Community, Lore, Missions, Ciphers, Archive, Forge, Guilds, Accessibility, Faction, Recognition. |
| Canon tier icons | public/community-assets/canon-tiers/tier-[0-5].png | Lore submission UI | phase-2 | Clear visual difference by tier. |
| Player title plaques | public/community-assets/titles/[title-slug].png | Title selector if visualized | phase-3 | Optional. |
| Badge images | public/badge-assets/[category]/[badge-slug].png | Badge Case | phase-1 | 50+ placeholder badges needed. |
| Avatar unlock items | public/avatar-assets/[category]/[asset-slug].png | Avatar Builder | phase-1 | Accessories, fictional props, tech gear, faction flair. |
| Profile cosmetics | public/profile-world-assets/[type]/[unlock-slug].png | Profile World | phase-2 | Frames, backgrounds, prompts, modules. |
| Relic items | public/relic-assets/[category]/[relic-slug].png | Relic Zone | phase-1 | Non-combat objects only. |
| Dead drop icons | public/mmo-room-assets/dead-drops/[drop-slug].png | Dead Drop cards | phase-1 | Cache, receipt, signal motifs. |
| Room icons | public/mmo-room-assets/rooms/[room-slug].png | Room cards | phase-1 | Town Square, Relay, Archive, Faction Floors. |
| Faction mission reward icons | public/mmo-room-assets/faction-missions/[mission-slug].png | Faction mission cards | phase-2 | One icon per reward bundle. |
| Signal player skins | public/signal-player-assets/skins/[skin-slug].png | Signal Player | phase-2 | No autoplay; visual only. |
| Archive/repo reward icons | public/relic-assets/archive/[reward-slug].png | Archive, Ghost in Tech, Relic Zone | phase-1 | Bone tabs, repo chips, bookmarks. |
## Admin Assignment Requirements

Admin reward tools should support manual assignment of rewards to a specific user for completed objectives, testing, manual recognition, faction leader reward setup, migration cleanup, and Owner/Archivist recognition.

Admin page concepts:

```txt
/admin/rewards
/admin/rewards/grant
/admin/users/[userId]/rewards
/admin/factions/reward-pools
/admin/missions/reward-pools
```

Admin should be able to:

- search/select user
- view existing badges, loot, titles, avatar unlocks, relics, profile cosmetics
- manually grant badge
- manually grant loot/relic
- manually grant avatar asset unlock
- manually grant player title
- manually grant profile cosmetic
- manually grant reputation event
- manually revoke grant if needed
- add admin note
- record source reason
- audit who granted it and when

Grant reasons:

- mission completion
- cipher completion
- dead drop completion
- volunteer contribution
- guild milestone
- manual Owner recognition
- migration/test grant
- faction leader approved mission
- event participation

Manual assignment must:

- be Admin/Owner only
- be audit logged
- avoid duplicate grants unless repeatable
- allow Owner to grant rewards to self for testing
- not expose admin tools to normal users
- allow revocation with clear reason
- record source system and source slug when available
- distinguish public recognition from private inventory unlocks
- respect user opt-out for public display
- show warnings for mythic, relic, Owner-only, or Chthonic Uprising marks

Suggested admin copy:

```txt
REWARD GRANT // UNDERWATCH LEDGER
```

Warning copy:

```txt
Manual grants affect player progression and public recognition. Record a clear reason before assigning rewards.
```

| Field | Required | Notes |
| --- | --- | --- |
| Target user | yes | Search by id, callsign, email if available to Admin. |
| Grant type | yes | badge, title, loot, relic, avatar unlock, profile cosmetic, reputation event, recognition. |
| Grant slug | yes | Must match approved reward definition. |
| Source reason | yes | Mission, cipher, Dead Drop, volunteer, guild, recognition, migration/test, manual. |
| Source slug | no | Mission/drop/cipher/guild slug when available. |
| Visibility | yes | public, profile-only, private. |
| Admin note | yes | Required for manual grants. |
| Repeatable override | no | Owner only. |
| Notify user | no | Default true for normal rewards, false for migration/test grants. |
| Public recognition opt-in | conditional | Required for public spotlights. |
## Faction Leader Mission Tools

Future faction leader tools should let approved faction leaders and stewards help create faction missions without unrestricted reward or admin power.

Faction leader permissions:

- create draft faction mission
- choose faction they steward
- write mission title/description
- choose safe mission type
- choose proof/review style
- select rewards from approved faction reward pool
- submit mission for Admin/Owner approval
- review submissions only if assigned as faction steward
- recommend badge/reward grants
- not create arbitrary new rewards without approval
- not assign Chthonic Uprising marks
- not grant Owner-only recognition
- not approve World Canon
- not bypass moderation rules

| Mission Type | Example | Review Style |
| --- | --- | --- |
| reflection | Write a safe field reflection | Faction steward or moderator |
| resource-summary | Submit a public-interest resource summary | Admin/moderator review |
| accessibility-note | Submit usability or access feedback | Accessibility review |
| lore-prompt | Submit Tier 1-4 lore | Canon tier review |
| cipher-puzzle | Solve or propose safe puzzle | Cipher steward/Admin |
| design-concept | Submit badge/avatar/profile concept | Asset review |
| guild-support | Host or support guild activity | Guild steward/Admin |
| archive-reading | Read/discuss archive item | Archive review |

Sample faction reward pools:

| Faction Slug | Reward Pool Slug | Allowed Reward Categories | Requires Admin Approval | Owner-Only Excluded |
| --- | --- | --- | --- | --- |
| asclepian-veil | asclepian-veil-approved-pool | faction badges, faction reputation, care titles, Veil avatar assets, Veil cosmetics, Veil lore | true | true |
| oracular-circuit | oracular-circuit-approved-pool | cipher badges, relay titles, Oracular avatar assets, relay cosmetics, safe puzzle lore | true | true |
| myrmidon-grinders | myrmidon-grinders-approved-pool | readiness badges, accessibility/logistics titles, Grinder avatar assets, gatehouse cosmetics | true | true |
| daedalus-foundry | daedalus-foundry-approved-pool | forge badges, repo relics, avatar assets, Foundry cosmetics, documentation titles | true | true |
| styx-rats | styx-rats-approved-pool | morale badges, zine titles, Rat avatar assets, banner cosmetics, safe satire lore | true | true |
| chthonic-uprising | chthonic-uprising-owner-pool | alliance marks, Owner recognitions, World Canon, mythic cosmetics | Owner only | false |
## Owner-Specific Assignment Requirements

Owner/Heathen should be able to:

- grant any badge/loot/avatar unlock/title/relic/profile cosmetic to any user
- grant rewards to their own user for testing and canon recognition
- assign Chthonic Uprising alliance marks
- assign faction leaders
- assign public recognition
- approve World Canon
- approve guilds
- approve faction mission reward pools
- override or revoke unsafe rewards
- view all reward audit logs
- approve or deny mythic/relic-tier reward definitions
- approve generated image assets before they become usable
- mark deprecated rewards as hidden or legacy-only
- grant migration/test rewards without public notification
- force visibility to private when safety requires it
- remove public recognition while preserving private audit history

Owner-specific grant page label:

```txt
OWNER REWARD CONSOLE // DEAD INDEX GRANTS
```

Warning copy:

```txt
Manual grants affect player progression and public recognition. Record a clear reason before assigning rewards.
```

Owner grant safety rules:

- Owner can grant to self for testing, but the source reason should say `testing`, `migration`, or `canon recognition`.
- Owner grants that appear publicly should support user opt-out unless the target is Owner’s own account.
- Owner-only marks should be rare and visually distinct.
- Revoked Owner grants should preserve audit history.
- Unsafe rewards can be disabled globally by Owner.

| Reward | Slug | Type | Use Case |
| --- | --- | --- | --- |
| Dead Index Witness | dead-index-witness | badge / recognition | Rare canon or archive recognition |
| Chthonic Signal | chthonic-signal | public spotlight | Major community contribution |
| Chthonic Mark Witness | chthonic-mark-witness | badge | Alliance-level milestone |
| Archivist Review Mark | archivist-review-mark | recognition | Approved World Canon or major lore |
| Dead Index Badge Chain | dead-index-badge-chain | avatar-item | Owner-granted relic avatar reward |
| Pomegranate Gate Theme | pomegranate-gate-theme | signal-player-unlock | Owner-recognized milestone or event |
## Implementation Metadata Tables

### Guild seed metadata

| Slug | Name | Status | Visibility | Guild Type | Primary Faction Affinity | Join Policy | Starter |
| --- | --- | --- | --- | --- | --- | --- | --- |
| the-lantern-thread | The Lantern Thread | approved-starter | public | forum salon | Chthonic Uprising | open-request | true |
| static-gardeners | Static Gardeners | approved-starter | approved-users | maker crew | Daedalus Foundry | application | true |
| bone-index-society | The Bone Index Society | approved-starter | public | archive circle | Archive | open-request | true |
| rat-nest-print-club | Rat Nest Print Club | approved-starter | public | zine cell | Styx Rats | open-request | true |
| the-repair-choir | The Repair Choir | approved-starter | approved-users | maker crew | Daedalus Foundry | application | true |
| veil-commons-crew | Veil Commons Crew | approved-starter | approved-users | care circle | Asclepian Veil | application | true |
| delphi-after-dark | Delphi After Dark | approved-starter | approved-users | cipher circle | Oracular Circuit | application | true |
| gatewatch-mapmakers | The Gatewatch Mapmakers | approved-starter | approved-users | accessibility crew | Myrmidon Grinders | open-request | true |

### Volunteer opportunity seed metadata

| Slug | Lane | Difficulty | Access Level | Faction Affinity | Review Required | Repeatability |
| --- | --- | --- | --- | --- | --- | --- |
| write-accessibility-note-one-page | Accessibility Review | beginner | approved-user | Asclepian Veil | true | weekly or monthly |
| test-avatar-builder-mobile | QA Testing | beginner | approved-user | Daedalus Foundry | true | weekly or monthly |
| submit-safe-ghost-in-tech-repo-summary | Research / Archive Resources | intermediate | approved-user | Daedalus Foundry | true | weekly or monthly |
| create-faction-badge-concept | Badge Art | beginner | approved-user | Chthonic Uprising | true | weekly or monthly |
| draft-character-canon-lore-fragment | Lore Writing | beginner | approved-user | Archive | true | weekly or monthly |
| suggest-community-builder-prompt | Community Events | beginner | approved-user | Community | true | weekly or monthly |
| submit-net-neighbor-banner-idea | Net Neighbor Scouting | beginner | approved-user | Styx Rats | true | weekly or monthly |
| qa-dead-drop-flow | QA Testing | beginner | approved-user | Chthonic Uprising | true | weekly or monthly |
| write-beginner-cipher-idea | Cipher Writing | beginner | approved-user | Oracular Circuit | true | weekly or monthly |
| create-profile-world-theme-concept | Design / UI | intermediate | approved-user | Chthonic Uprising | true | weekly or monthly |
| document-bug-with-screenshots | QA Testing | beginner | approved-user | Daedalus Foundry | true | weekly or monthly |
| suggest-signal-player-playlist-theme | Music / Signal Player Contributions | beginner | approved-user | Community | true | weekly or monthly |
| draft-forum-category-description | Documentation | beginner | approved-user | Community | true | weekly or monthly |
| help-write-mission-flavor-copy | Mission Writing | intermediate | approved-user | Chthonic Uprising | true | weekly or monthly |
| review-public-safety-copy-clarity | Moderation Support | intermediate | approved-user | Asclepian Veil | true | weekly or monthly |

### Recognition seed metadata

| Slug | Recognition Type | Category | Granted By | Default Visibility | Revocable | Opt-Out |
| --- | --- | --- | --- | --- | --- | --- |
| thread-tender | Title | Community | moderator | public | true | true |
| cipher-lantern | Badge | Ciphers | automatic | public | true | true |
| forge-hand | Title | Forge | admin | public | true | true |
| archive-witness | Badge | Archive | automatic | public | true | true |
| commons-builder | Title | Community | admin | public | true | true |
| net-neighbor-scout | Badge | Net Neighbors | moderator | public | true | true |
| accessibility-scribe | Badge | Accessibility | admin | public | true | true |
| lore-keeper | Title | Lore | admin | public | true | true |
| field-debrief-scribe | Badge | Missions | automatic | profile-only | true | true |
| chthonic-signal | Community Spotlight | Recognition | owner | public | true | true |
| dead-index-witness | Owner / Archivist Mark | Recognition | owner | public | true | true |
| underwatch-host | Featured Guild | Guilds | admin | public | true | true |
### Reputation event seed metadata

Use the slugs in `## Reputation Event Definitions`. Every event should include `slug`, `category`, `points`, `trigger`, `cooldown`, `reviewRequired`, `cap`, `reversible`, and `abuseNotes`.

### Badge seed metadata

Badge records should include `name`, `slug`, `category`, `tier`, `factionSlug`, `unlockCondition`, `visualConcept`, `assetPath`, and `flavorText`.

### Loot seed metadata

Loot records should include `name`, `slug`, `type`, `rarity`, `category`, `unlockCondition`, `displayLocation`, `assetPath`, and `flavorText`.

### Avatar unlock metadata

Avatar unlock records should include `assetName`, `slug`, `avatarCategory`, `rarity`, `factionAffinity`, `unlockSource`, `filePath`, `layerOrder`, `visualDescription`, and `safeLabel`.

### Mission reward mapping metadata

Mission reward records should include `missionSlug`, `factionSlug`, `completionBadgeSlug`, `reputationEvents`, `lootSlugs`, `avatarUnlockSlugs`, `relicSlugs`, `profileCosmeticSlugs`, `loreUnlockSlugs`, `adminNotes`, and `factionLeaderNotes`.

### Admin grant tool requirements

| Requirement | Required | Notes |
| --- | --- | --- |
| User search | yes | Find target user. |
| Existing reward inventory view | yes | Show badges, loot, relics, avatar assets, titles, profile cosmetics. |
| Manual grant | yes | Badge, loot, avatar asset, title, relic, profile cosmetic, reputation event. |
| Manual revoke | yes | Requires reason. |
| Source reason | yes | Mission, cipher, Dead Drop, volunteer, guild, recognition, migration/test, faction leader approved mission, event. |
| Admin note | yes | Required for manual grant/revoke. |
| Audit log | yes | Who, what, when, target, reason. |
| Duplicate prevention | yes | Unless reward is repeatable. |
| Owner self-grant | yes | For testing and canon recognition. |
| Public visibility control | yes | Respect opt-out and safety. |
| Owner-only warning | yes | For Chthonic marks, mythic rewards, World Canon. |
### Faction leader reward pool metadata

| Faction Slug | Reward Pool Slug | Allowed Reward Categories | Requires Admin Approval | Owner-Only Excluded |
| --- | --- | --- | --- | --- |
| asclepian-veil | asclepian-veil-approved-pool | faction badges, faction reputation, care titles, Veil avatar assets, Veil cosmetics, Veil lore | true | true |
| oracular-circuit | oracular-circuit-approved-pool | cipher badges, relay titles, Oracular avatar assets, relay cosmetics, safe puzzle lore | true | true |
| myrmidon-grinders | myrmidon-grinders-approved-pool | readiness badges, accessibility/logistics titles, Grinder avatar assets, gatehouse cosmetics | true | true |
| daedalus-foundry | daedalus-foundry-approved-pool | forge badges, repo relics, avatar assets, Foundry cosmetics, documentation titles | true | true |
| styx-rats | styx-rats-approved-pool | morale badges, zine titles, Rat avatar assets, banner cosmetics, safe satire lore | true | true |
| chthonic-uprising | chthonic-uprising-owner-pool | alliance marks, Owner recognitions, World Canon, mythic cosmetics | Owner only | false |
### Image asset requirements

| Asset Category | Base Path | Preferred Format | User Upload Allowed | Review Required |
| --- | --- | --- | --- | --- |
| Avatar accessories | public/avatar-assets/accessories/ | PNG/WEBP | yes | true |
| Avatar fictional props | public/avatar-assets/fictional-props/ | PNG/WEBP | yes | true |
| Avatar tech gear | public/avatar-assets/tech-gear/ | PNG/WEBP | yes | true |
| Avatar backgrounds | public/avatar-assets/backgrounds/ | PNG/WEBP | yes | true |
| Badge assets | public/badge-assets/ | PNG/WEBP | yes | true |
| Relic assets | public/relic-assets/ | PNG/WEBP | yes | true |
| Guild assets | public/guild-assets/ | PNG/WEBP | yes | true |
| Community assets | public/community-assets/ | PNG/WEBP | yes | true |
| MMO room assets | public/mmo-room-assets/ | PNG/WEBP | admin only | true |
| Profile world assets | public/profile-world-assets/ | PNG/WEBP | yes | true |
| Signal player skins | public/signal-player-assets/skins/ | PNG/WEBP | yes | true |
| Signal player tones | public/signal-player-assets/tones/ | audio format TBD | limited | true |
## Future Expansion Notes

Future systems may include:

- seasonal rewards
- event-limited cosmetics
- faction campaigns
- guild-created missions
- community marketplace/library for safe avatar assets
- player-submitted badge art
- generated image asset review workflow
- reward preview in mission cards
- public reward history on profile
- private admin reward notes
- automated duplicate detection for grants
- batch import for image assets
- asset-generation prompts for each missing asset
- avatar item equip/unequip rules
- inventory pages
- trading or gifting only if heavily moderated and non-monetized
- creator credits for contributed assets
- reward retirement and legacy badge display
- faction campaign leaderboards based on contribution, not combat
- shared guild Relic Zone displays
- opt-in creator portfolios for approved contributors
- public recognition filters by type and visibility
- archive citation credits
- accessibility-first asset preview checks
- non-flashing animation review for effects
- Signal Player playlist mood cards
- asset provenance records for community-submitted art

Expansion should preserve the core doctrine:

```txt
No ghost goes uncounted. No god goes unwatched.
```

And the game rule beneath it:

```txt
Progression is trust, memory, care, craft, and signal — never harm.
```
