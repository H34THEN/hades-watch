# Hades Watch Text MMO: First Playable Loops

## Purpose

This document defines the first five playable text-based MMO loops for Hades Watch.

It is a canonical lore/gameplay reference for future implementation work. It defines room pages, room descriptions, room actions, Dead Drops, player Field Logs, non-combat loot, reputation events, badges, lore unlocks, and expansion hooks.

The first playable MMO experience should feel like an old-web MUD, a forum-powered quest board, a cyberpunk underworld command terminal, a gothic myth-tech archive, and a community-centered field-ops simulator. It is not combat-first. Progression comes from reading, decoding, helping, archiving, repairing, reflecting, contributing, and safely participating in the Underwatch.

Core loop:

```txt
Enter a room → read the room state → choose a safe action → submit or resolve a field task → create a field log → earn loot/reputation/badges/lore → unlock more rooms/actions
```

## Gameplay Design Pillars

### 1. Rooms Before Worlds

Start with discrete text-based rooms instead of a giant map. A room is a focused playable hub with a description, active signals, available actions, Field Logs, rewards, and connected unlocks.

### 2. Actions Before Combat

Players progress by taking safe actions: reading, submitting, decoding, helping, logging, archiving, building, reflecting, and discussing. Combat power is not a progression axis.

### 3. Community as Gameplay

Forum posts, field notes, resource submissions, guild participation, Net Neighbor leads, accessibility suggestions, and community builder contributions are valid MMO actions.

### 4. Loot as Meaning

Loot is cosmetic, narrative, social, archival, or profile-based. It represents memory, trust, identity, faction belonging, old-web customization, and lore progression. It does not grant combat power.

### 5. Reputation as Trust

Reputation rewards helpfulness, creativity, safe participation, lore contribution, accessibility work, archiving, ciphers, guild stewardship, and faction missions.

### 6. Dead Drops as Micro-Quests

Dead Drops are small, focused, replayable or rotating tasks that can unlock lore, badges, reputation, and profile rewards.

### 7. Safety Is Canon

Hades Watch is fictional, nonviolent, privacy-aware, moderated, and anti-harm by design. Safety is not a policy layer stapled onto the world. Safety is the doctrine of the Underwatch.

## Safety and Nonviolence Policy

All loops must be:

* fictional
* legal
* nonviolent
* privacy-aware
* inclusive
* moderated
* safe for community play

Do not reward:

* violence
* weapons
* combat
* harassment
* doxxing
* stalking
* intimidation
* sabotage
* illegal hacking
* malware
* exploit instructions
* credential theft
* evasion
* real-world targeting
* unsafe protest tactics
* unsafe medical or legal advice
* private data exposure

Do reward:

* field notes
* creative writing
* safe lore
* puzzle solving
* ciphers
* community suggestions
* accessibility notes
* archive contributions
* forum participation
* volunteer tasks
* avatar/badge assets
* guild building
* nonviolent civic imagination
* digital privacy literacy
* self-hosting and repair culture
* public-interest learning

Oracular Circuit language may sound like signal analysis, prophecy-breaking, and cryptic system work, but gameplay must remain safe puzzle solving and fictional lore decoding. No room, Dead Drop, badge, or reward should teach or incentivize real-world hacking, evasion, targeting, harassment, or unauthorized access.

## Core Gameplay Model

```txt
1. Player enters a room.
2. Room displays lore description, active signals, available actions, and recent safe field logs.
3. Player chooses an action.
4. Player completes a small task, submission, puzzle, or interaction.
5. System creates a Field Log.
6. Player receives loot, reputation, badge progress, or lore unlock.
7. Room state updates or points player to the next room.
```

Possible action types:

```txt
READ_SIGNAL
POST_FIELD_NOTE
SUBMIT_DEAD_DROP
SOLVE_CIPHER
SUBMIT_RESOURCE
VISIT_ARCHIVE
JOIN_DISCUSSION
OFFER_HELP
CREATE_LORE_FRAGMENT
SUBMIT_ACCESSIBILITY_NOTE
SUBMIT_NET_NEIGHBOR
REQUEST_GUILD
```

## Shared Terms and Systems

### Room

A text-based location or hub within the MMO. Rooms contain lore framing, room state, active signals, actions, connected Dead Drops, recent safe Field Logs, reward previews, and unlocks.

### Field Action

A safe action a player can take inside a room. Examples include reading a signal, posting a field note, submitting a resource, solving a fictional cipher, or offering a community suggestion.

### Field Log

A record of a player's completed action, visible privately, to friends/guild, to approved users, or publicly depending on privacy settings. Field Logs record activity, not sensitive submission content.

### Dead Drop

A small prompt, task, cipher, lore fragment, resource request, or field contribution that players can complete.

### Loot

Non-combat rewards such as badges, profile cosmetics, relics, titles, lore fragments, avatar items, banner parts, faction flair, and room unlocks.

### Relic

A collectible narrative or cosmetic object. Relics can be displayed in the Badge Case, Relic Zone, or Profile World.

### Signal

A prompt, notification, thread, active objective, room event, or faction request. Signals are what the Underwatch surfaces when the dead wires start speaking.

### Reputation

A trust/progression score earned through constructive actions. Reputation measures contribution, consistency, care, creativity, and safe participation.

### Lore Unlock

A small canonical or semi-canonical fragment revealed after completing certain loops. Lore unlocks may be public, private, faction-specific, or tied to the Dead Index.

## Room System Overview

Rooms are the first playable geography of Hades Watch. Each room should be readable as lore, playable as a quest hub, and useful as a community action surface.

A room should display:

* room title
* slug
* access level
* room type
* faction alignment
* entry text
* current room state
* active signals
* available actions
* connected Dead Drops
* recent safe Field Logs
* reward previews
* badge progress
* lore unlock hints
* safety reminder where needed

Recommended room types:

* `social-hub`
* `dead-drop-hub`
* `cipher-hub`
* `faction-floor`
* `archive-hub`
* `command-layer`
* `event-room`
* `guild-room`

Room state examples:

* quiet
* active
* crowded
* locked
* rotating-drop-live
* cipher-open
* faction-call-active
* archive-trace-detected
* moderation-review-required

## Dead Drop System Overview

Dead Drops are micro-quests. They should be short enough to complete in one sitting and safe enough for community play.

Dead Drops can be:

* lore prompts
* resource submissions
* mini-ciphers
* community questions
* safe care action ideas
* archive artifacts
* zine or graffiti lines
* Net Neighbor leads
* repo relic suggestions
* mission hooks

Dead Drop review modes:

* automatic read-only completion
* automatic cipher answer check
* moderator review
* faction steward review
* owner/admin recognition

Dead Drops should support:

* one-time completion
* daily rotation
* weekly prompts
* repeatable submissions with cooldown
* faction-specific unlocks
* lore fragments
* badge progress
* reputation events

## Loot and Reward System Overview

Loot must not grant combat power.

### Profile Titles

Purpose: let players display earned identity.  
Examples: Static Courier, Signal Reader, Archive Witness, Black Clinic Visitor.  
Displays: dossier header, forum posts, Field Logs.  
Mode: cosmetic and social.  
Sharing/trading: not tradable.

### Badge Case Hexes

Purpose: small visual tiles for the badge case.  
Examples: Cache Mark, Repo Relic Mark, Commons Spark Hex.  
Displays: profile Badge Case.  
Mode: cosmetic and recognition-based.  
Sharing/trading: not tradable.

### Relics

Purpose: collectible narrative objects.  
Examples: Cracked Cache Key, Bent Oracle Key, Bone Index Tab.  
Displays: Relic Zone, profile, lore inventory.  
Mode: narrative and cosmetic.  
Sharing/trading: optionally displayable, not transferable in MVP.

### Profile World Cosmetics

Purpose: old-web customization.  
Examples: Dead Drop Terminal Frame, Violet Relay Border, Archive Terminal Background.  
Displays: Profile World, dossier panels.  
Mode: cosmetic.  
Sharing/trading: not tradable.

### Relic Zone Modules

Purpose: modular display widgets for collectibles.  
Examples: Mini Archive Shelf, Static Cache Niche, Faction Shrine Slot.  
Displays: Profile World / Relic Zone.  
Mode: cosmetic/social.  
Sharing/trading: not tradable.

### Avatar Items

Purpose: avatar customization without combat stats.  
Examples: Oracle Headset, Pomegranate Pin, Rat Sticker Pack.  
Displays: avatar/dossier/forum identity.  
Mode: cosmetic.  
Sharing/trading: not tradable in MVP.

### Faction Flair

Purpose: show faction belonging.  
Examples: Veil Clinic Trim, Cerberus Gate Stamp, Styx Riot Tag.  
Displays: profile, faction pages, Field Logs.  
Mode: social/cosmetic.  
Sharing/trading: not tradable.

### Room Access Marks

Purpose: unlock room visibility or deeper room actions.  
Examples: Underwatch Pass, Relay Visitor Mark, Archive Trace Clearance.  
Displays: room gates, dossier access ledger.  
Mode: progression.  
Sharing/trading: not tradable.

### Lore Fragments

Purpose: reveal narrative.  
Examples: The First Dead Index, Oracular Static, Memory Has Teeth.  
Displays: Archive, lore unlock panel, dossier operational history.  
Mode: narrative/progression.  
Sharing/trading: readable if public; unlock remains personal.

### Forum Flair

Purpose: recognize constructive community presence.  
Examples: Field Note Ribbon, Signal Board Stamp.  
Displays: posts, replies, profile.  
Mode: social/cosmetic.  
Sharing/trading: not tradable.

### Guild Banners

Purpose: support future guild/cell identity.  
Examples: Commons Banner Strip, Net Neighbor Pennant.  
Displays: guild pages, profiles, forum signatures.  
Mode: social/cosmetic.  
Sharing/trading: guild-controlled later.

### Signal Player Unlocks

Purpose: unlock audio/visual signal-style profile widgets.  
Examples: Static Player, Archive Whisper, Relay Tone.  
Displays: Profile World or room ambient widgets.  
Mode: cosmetic/narrative.  
Sharing/trading: not tradable.

### Net Neighbor Banner Parts

Purpose: reward safe community network contributions.  
Examples: Local Light Pin, Mutual Aid Thread, Neighbor Signal Stripe.  
Displays: Net Neighbor board, profile banners.  
Mode: social/cosmetic.  
Sharing/trading: not tradable in MVP.

## Reputation System Overview

Reputation is trust, not dominance.

Reputation should reward:

* safe participation
* helpful field notes
* lore submissions
* accessibility contributions
* cipher puzzle completion
* archive reading and discussion
* resource summaries
* faction stewardship
* moderation-approved contributions

Reputation should include abuse prevention:

* daily caps
* no points for deleted content
* moderator reversal
* no infinite posting loops
* review-required rewards for submissions
* no points for spam, copied content, or unsafe links
* cooldowns on repeatable actions
* separate tracking for automatic and reviewed rewards

## Field Log System Overview

The Field Log is the public or semi-public heartbeat of the MMO.

It should show safe activity such as:

* player entered a room
* player completed a Dead Drop
* player solved a cipher
* player submitted a Net Neighbor
* player joined a guild
* player published a Profile World
* player earned a badge
* player contributed to Archive

Field Log visibility:

* public
* approved-users
* guild-only
* private

Field Log examples:

* `Slewfoot recovered a static fragment from the Dead Drop Terminal.`
* `terminal-kiddie cracked an Oracular Relay cipher.`
* `StaticGhost742 submitted a Net Neighbor for review.`
* `A repo relic surfaced in Ghost in Tech.`
* `A new lore fragment entered the Dead Index.`
* `A Veil operative submitted an accessibility note.`
* `A Rat Nest regular painted a morale signal into the commons.`

Privacy rules:

* Users should be able to keep some logs private where appropriate.
* Do not log sensitive submission content.
* Do not expose private resource URLs, personal details, medical/legal claims, or moderation notes.
* Public logs should be flavorful but minimal.
* Reviewed submissions should log only after approval unless the action itself is safe to log.

## Badge Progression Overview

Badges are visual recognition for safe, constructive progression. They can be tied to rooms, Dead Drops, ciphers, factions, archive activity, community action, forge contribution, guild participation, or special recognition.

Badge tiers:

* initiate
* regular
* adept
* steward
* relic

Badge categories:

* Rooms
* Dead Drops
* Ciphers
* Factions
* Archive
* Community
* Forge
* Guilds
* Recognition

Badge progression should be readable and fair. Players should understand what kind of action earns progress without being pushed into spam or unsafe behavior.

## Lore Unlock System Overview

Lore unlocks are canonical or semi-canonical fragments revealed by safe actions. They can appear after reading a room signal, solving a fictional cipher, completing a Dead Drop, earning faction standing, or contributing to the Archive.

Lore unlock types:

* room fragment
* faction fragment
* Dead Index trace
* recovered transmission
* relic inscription
* archive page
* profile-only whisper
* public lore entry

Lore unlock examples:

* The First Dead Index
* Oracular Static
* Memory Has Teeth
* The Square That Was Never Square
* The Five Seeds Beneath the Gate
* Care Before Command

## The First 5 Playable Loops

1. Underwatch Town Square
2. Dead Drop Terminal
3. Oracular Relay
4. Faction Floors
5. Archive Terminal

Each loop is designed as a room/action/reward system that can stand alone in MVP and connect into a broader MMO later.

## Loop 1: Underwatch Town Square

**Slug:** `underwatch-town-square`  
**Primary Route Suggestion:** `/mmo/rooms/underwatch-town-square`  
**Room Type:** `social-hub`  
**Primary Faction:** The Chthonic Uprising  
**Secondary Factions:** Asclepian Veil, Oracular Circuit, Myrmidon Grinders, Daedalus Foundry, Styx Rats  
**Access Level:** logged-in  
**MVP Priority:** phase-1  
**Replayability:** always available  
**Estimated Session Time:** 3-10 minutes  

### Gameplay Purpose

The Underwatch Town Square orients the player, surfaces active signals, points toward Dead Drops, ciphers, factions, forums, archive entries, and missions, and creates the player's first Field Log.

### Lore Framing

The Town Square is not physically a square. It is a shifting terminal plaza built from dead forums, old BBS rooms, broken public terminals, mesh bulletin boards, and encrypted civic infrastructure. It exists wherever erased people still remember how to gather.

### Player Fantasy

You are a new operative stepping into the Underwatch commons for the first time. The room speaks in signals, notices, half-buried posts, and warnings from people who survived long enough to leave instructions.

### Entry Text

```txt
The square loads in layers: a cracked BBS header, a civic terminal with the seal burned out, a forum thread that refuses deletion, and a black pomegranate pulsing at the center of the screen.

WELCOME TO UNDERWATCH.
NO GHOST GOES UNCOUNTED.
NO GOD GOES UNWATCHED.
```

### Room State Elements

* active signal board
* featured Dead Drop
* featured cipher
* recent safe Field Logs
* faction floor shortcuts
* archive trace hint
* community signal carousel
* mission summary
* first-action prompt for new players

### Available Actions

| Action | Action Type | Access | Outcome |
|---|---|---|---|
| Read the Signal Board | `READ_SIGNAL` | logged-in | Field Log, small reputation, badge progress |
| Post a Field Note | `POST_FIELD_NOTE` | logged-in | Field Log, community reputation after safeguards |
| Visit Dead Drop Terminal | `VISIT_ARCHIVE` | logged-in | route to Dead Drop loop |
| Enter Oracular Relay | `SOLVE_CIPHER` | logged-in | route to cipher room |
| Visit Faction Floors | `JOIN_DISCUSSION` | logged-in | route to faction rooms |
| Browse Community Signals | `JOIN_DISCUSSION` | logged-in | forum/community route |
| Open Archive Terminal | `VISIT_ARCHIVE` | logged-in | route to archive loop |
| Check Active Missions | `READ_SIGNAL` | logged-in | route to mission board |

### Dead Drops Connected

* The First Field Note
* Commons Signal Check
* The Square That Was Never Square
* Net Neighbor Lantern

### Loot Rewards

* Underwatch Pass
* Signal Board Stamp
* Commons Spark Hex
* Pomegranate Terminal Pin
* Old BBS Banner Strip
* Town Square Terminal Frame
* Field Note Ribbon
* The Square That Was Never Square

### Badge Rewards

* `town-square-arrival`
* `first-field-note`
* `signal-board-reader`
* `underwatch-regular`
* `commons-spark`

### Reputation Rewards

* +1 Community reputation for reading the Signal Board, once daily
* +2 Community reputation for a valid Field Note, capped daily
* +5 Community reputation for a moderator-approved community suggestion
* +3 Lore reputation for completing a connected lore prompt
* +1 Faction reputation for visiting a faction floor introduction, once per faction

### Lore Unlocks

* The Square That Was Never Square
* The Five Seeds Beneath the Gate
* Commons Before Command

### Field Log Examples

* `Slewfoot entered the Underwatch Town Square.`
* `terminal-kiddie read the Signal Board.`
* `StaticGhost742 posted a field note in the commons.`
* `A new operative followed the black pomegranate into the Underwatch.`

### Failure / Empty States

If no active signals exist:

```txt
The Signal Board is quiet, but not dead. Old posts glow in the dust. The Underwatch remembers even when no one is speaking.
```

If a Field Note is rejected:

```txt
The note returns wrapped in black static. Revise for safety, privacy, and usefulness. The commons does not amplify harm.
```

### Safety Notes

Field Notes must not include private personal data, real-world targeting, harassment, unsafe advice, or calls for violence. Public logs should show that a note was posted, not the sensitive contents of the note.

### Implementation Metadata

```yaml
loop_slug: underwatch-town-square
primary_route: /mmo/rooms/underwatch-town-square
room_type: social-hub
access_level: logged-in
mvp_priority: phase-1
field_log_default_visibility: approved-users
review_required_for:
  - resource-like submissions
  - public-facing field notes
  - net-neighbor leads
safe_action_types:
  - READ_SIGNAL
  - POST_FIELD_NOTE
  - VISIT_ARCHIVE
  - JOIN_DISCUSSION
  - SUBMIT_NET_NEIGHBOR
```

## Loop 2: Dead Drop Terminal

**Slug:** `dead-drop-terminal`  
**Primary Route Suggestion:** `/mmo/dead-drops`, `/mmo/dead-drops/[dropSlug]`  
**Room Type:** `dead-drop-hub`  
**Primary Faction:** The Chthonic Uprising  
**Secondary Factions:** Oracular Circuit, Styx Rats, Daedalus Foundry, Asclepian Veil  
**Access Level:** approved-user  
**MVP Priority:** phase-1  
**Replayability:** daily, weekly, rotating, repeatable with cooldown  
**Estimated Session Time:** 5-15 minutes  

### Gameplay Purpose

The Dead Drop Terminal provides small micro-quests, rotating prompts, community submissions, lore fragments, safe resource calls, mini-ciphers, and player creativity prompts.

### Lore Framing

The Dead Drop Terminal is where the Underwatch leaves prompts, fragments, resource calls, and strange useful tasks for approved operatives. It looks like a vending machine built by ghosts and maintained by punks: stickers, burn marks, command-line menus, and a coin slot that accepts only memory.

### Player Fantasy

You are checking the underworld's task cache. Something has been left for whoever arrives next. You open the drop, complete the prompt, and leave a trace for the Dead Index.

### Entry Text

```txt
The terminal wakes when your shadow crosses the scanner.

DEAD DROP CACHE OPEN.
DO NOT FEED THE MACHINE PRIVATE BLOOD.
LEAVE ONLY WHAT CAN SAFELY BE REMEMBERED.
```

### Room State Elements

* today's highlighted drop
* weekly rotating drop list
* recovered drops archive
* reviewed community drops
* drop type filters
* difficulty tags
* reward previews
* review status for submissions

### Available Actions

| Action | Action Type | Access | Outcome |
|---|---|---|---|
| Open Today's Drop | `READ_SIGNAL` | approved-user | reveal active prompt |
| Submit a Dead Drop Response | `SUBMIT_DEAD_DROP` | approved-user | Field Log, review/reward |
| Browse Recovered Drops | `VISIT_ARCHIVE` | approved-user | lore and old prompts |
| Mark Drop Useful | `OFFER_HELP` | approved-user | low reputation, feedback signal |
| Decode Hidden Signal | `SOLVE_CIPHER` | approved-user | cipher reward |
| Submit Resource Drop | `SUBMIT_RESOURCE` | approved-user | review-required archive contribution |
| Submit Lore Drop | `CREATE_LORE_FRAGMENT` | approved-user | review-required lore contribution |

### Dead Drops Connected

* Static Under the Coin Slot
* Cracked Cache Key
* Useful Signal, Safely Named
* One Sentence for the Wall
* Care Package Without Coordinates
* The First Dead Index
* Zine Line for a Tired Ghost

### Loot Rewards

* Static Courier
* Cracked Cache Key
* Dead Drop Terminal Frame
* Cache Mark
* The First Dead Index
* Static Cache Niche
* Drop Runner Ribbon
* Black Cache Sticker

### Badge Rewards

* `dead-drop-initiate`
* `signal-cache-recovered`
* `drop-runner`
* `dead-index-carrier`
* `static-courier`

### Reputation Rewards

* +2 Missions reputation for completing a normal Dead Drop
* +3 Lore reputation for a lore prompt
* +3 Archive reputation for an approved resource drop
* +2 Community reputation for marking drops useful, capped daily
* +5 Recognition reputation for an approved player-submitted Dead Drop

### Lore Unlocks

* The First Dead Index
* Static Under the Coin Slot
* The Cache That Learned Your Name

### Field Log Examples

* `Slewfoot recovered a static fragment from the Dead Drop Terminal.`
* `terminal-kiddie completed a rotating Dead Drop.`
* `StaticGhost742 submitted a resource drop for review.`
* `A cracked cache key changed hands in the Underwatch.`

### Failure / Empty States

If no active drop exists:

```txt
The terminal spits out a blank receipt. Someone has cleaned the cache, or something is waiting for the right hour.
```

If review is pending:

```txt
Your drop has been sealed in black wax and routed to a steward. The Underwatch rewards useful signals after they are made safe.
```

### Safety Notes

Resource drops must be public-interest, educational, legal, defensive, privacy-aware, and non-harmful. No doxxing, targeting, exploit instructions, credential exposure, or unsafe advice.

### Implementation Metadata

```yaml
loop_slug: dead-drop-terminal
primary_routes:
  - /mmo/dead-drops
  - /mmo/dead-drops/[dropSlug]
room_type: dead-drop-hub
access_level: approved-user
mvp_priority: phase-1
default_repeatability: rotating
review_required_for:
  - resource-link
  - lore-fragment
  - net-neighbor-lead
  - mission-hook
automatic_completion_allowed_for:
  - no-submission-read-only
  - multiple-choice
  - cipher-answer
```

## Loop 3: Oracular Relay

**Slug:** `oracular-relay`  
**Primary Route Suggestion:** `/mmo/rooms/oracular-relay`, `/ciphers`  
**Room Type:** `cipher-hub`  
**Primary Faction:** The Oracular Circuit  
**Secondary Factions:** Daedalus Foundry, Styx Rats, Chthonic Uprising  
**Access Level:** logged-in  
**MVP Priority:** phase-1  
**Replayability:** repeatable with cooldown, rotating  
**Estimated Session Time:** 5-20 minutes  

### Gameplay Purpose

The Oracular Relay connects text MMO rooms to the cipher system. It makes ciphers feel like playable room content, supports C1PH3R CR4K3R progression, and unlocks Oracular Circuit lore.

### Lore Framing

The Oracular Relay receives broken machine prophecy, dead packets, false omens, and signal riddles. Players train by safely decoding fictional puzzle transmissions.

### Player Fantasy

You sit before a violet terminal that claims to know the future. The Circuit teaches you to read its false prophecy, request hints without shame, and correct the omen before it hardens into fate.

### Entry Text

```txt
The Relay hums in violet and cyan.

A machine god whispers probability.
Cassian Nyx has scratched a warning across the bezel:

NO ALGORITHM IS DIVINE.
SOLVE ONLY THE FICTIONAL SIGNAL.
LEAVE REAL DOORS CLOSED.
```

### Room State Elements

* active cipher puzzle
* hint panel
* solved signals
* C1PH3R CR4K3R progress
* Oracular Static lore excerpts
* safe cipher submission rules
* community cipher ideas, if Community Builder exists

### Available Actions

| Action | Action Type | Access | Outcome |
|---|---|---|---|
| Attempt Cipher | `SOLVE_CIPHER` | logged-in | cipher answer check, badge progress |
| Request Hint | `READ_SIGNAL` | logged-in | hint viewed, optional badge progress |
| Review Solved Signals | `VISIT_ARCHIVE` | logged-in | archive/lore reading |
| View C1PH3R CR4K3R Progress | `READ_SIGNAL` | logged-in | progress view |
| Read Oracular Static | `READ_SIGNAL` | logged-in | lore fragment |
| Submit Cipher Idea | `CREATE_LORE_FRAGMENT` | approved-user/community-builder | review-required contribution |
| Decode Hidden Drop | `SUBMIT_DEAD_DROP` | approved-user | connected Dead Drop completion |

### Dead Drops Connected

* Violet Static Primer
* False Omen Corrected
* Three Keys Beneath Delphi
* Hint Without Shame

### Loot Rewards

* Signal Reader
* Bent Oracle Key
* Violet Relay Border
* Oracular Static
* Broken Delphi Sticker
* Cipher Glyph Avatar Ring
* Static Prophet Forum Flair
* Relay Tone Signal Player

### Badge Rewards

* existing C1PH3R CR4K3R badge chain
* `oracular-relay-initiate`
* `hint-reader`
* `static-decoder`
* `false-omen-corrected`

### Reputation Rewards

* +3 Ciphers reputation for first solve of a cipher
* +1 Ciphers reputation for reading a hint, once per cipher family
* +2 Lore reputation for reading solved-signal notes
* +5 Ciphers reputation for approved safe cipher idea
* +1 Faction reputation with Oracular Circuit for relay participation, capped daily

### Lore Unlocks

* Oracular Static
* The Machine Prophecy Lied First
* Cassian's Rule of Closed Doors

### Field Log Examples

* `terminal-kiddie cracked an Oracular Relay cipher.`
* `Slewfoot requested a hint from the violet static.`
* `A false omen was corrected before it could name a future.`
* `An Oracular Circuit signal entered the solved archive.`

### Failure / Empty States

Wrong answer:

```txt
The Relay rejects the answer without punishment. The omen remains unstable. Try another pattern, or ask for a hint.
```

No active cipher:

```txt
The Relay sleeps behind a curtain of violet snow. Solved signals remain available for study.
```

### Safety Notes

No real hacking. No real-world targets. No credential collection. No exploit instructions. Ciphers are game puzzles only. The Relay can teach pattern recognition, privacy literacy, and fictional decoding without enabling harm.

### Implementation Metadata

```yaml
loop_slug: oracular-relay
primary_routes:
  - /mmo/rooms/oracular-relay
  - /ciphers
room_type: cipher-hub
access_level: logged-in
mvp_priority: phase-1
safe_action_types:
  - SOLVE_CIPHER
  - READ_SIGNAL
  - VISIT_ARCHIVE
  - CREATE_LORE_FRAGMENT
review_required_for:
  - submitted_cipher_idea
  - public_cipher_hint
  - player_written_oracular_lore
```

## Loop 4: Faction Floors

**Slug:** `faction-floors`  
**Primary Route Suggestion:** `/mmo/factions`, `/mmo/factions/[factionSlug]/floor`  
**Room Type:** `faction-floor`  
**Primary Faction:** The Chthonic Uprising  
**Secondary Factions:** Asclepian Veil, Oracular Circuit, Myrmidon Grinders, Daedalus Foundry, Styx Rats  
**Access Level:** logged-in; deeper actions approved-user  
**MVP Priority:** phase-2  
**Replayability:** always available, weekly faction calls  
**Estimated Session Time:** 5-20 minutes  

### Gameplay Purpose

Faction Floors create playable text-room hubs for each cell. They connect faction lore, missions, reputation, guilds, community actions, badges, profile identity, and future faction standing.

### Lore Framing

Each faction floor is a room in the Underwatch that refuses to stay in one place. Black clinics, signal chapels, gatehouses, maker benches, rat nests, and command layers rotate beneath the surface order like organs in a living resistance.

### Player Fantasy

You are choosing where your skills and care belong. You walk the faction floors, read their oaths, complete safe contributions, and earn trust without confusing faction identity for combat class.

### Entry Text

```txt
Five doors blink beneath the black pomegranate.

SURVIVAL.
SIGNAL.
FORCE.
INVENTION.
RUPTURE.

The sixth door is not a door. It is the Command Layer watching the map remember itself.
```

### Room State Elements

* faction floor list
* faction entry text
* current faction calls
* membership/standing summary
* reputation progress
* faction Dead Drops
* faction badges and titles
* faction lore unlocks
* Chthonic Uprising alliance overview

### Available Actions

| Action | Action Type | Access | Outcome |
|---|---|---|---|
| Read Faction Dossier | `READ_SIGNAL` | logged-in | faction lore read |
| Visit Faction Floor | `READ_SIGNAL` | logged-in | Field Log, badge progress |
| Submit Faction Note | `POST_FIELD_NOTE` | approved-user | review/cooldown |
| Complete Faction Dead Drop | `SUBMIT_DEAD_DROP` | approved-user | faction rep/reward |
| Request Guild / Cell | `REQUEST_GUILD` | approved-user | future workflow |
| Offer Help | `OFFER_HELP` | approved-user | reviewed contribution |
| Submit Accessibility Note | `SUBMIT_ACCESSIBILITY_NOTE` | approved-user | accessibility rep |
| Submit Net Neighbor | `SUBMIT_NET_NEIGHBOR` | approved-user | review-required community lead |

### Dead Drops Connected

* Black Clinic Intake Card
* Signal Chapel Listening Test
* Gatehouse Readiness Check
* Foundry Repair Spark
* Rat Nest Wall Line
* Command Layer Witness Mark

### Loot Rewards

* faction profile frames
* faction terminal prompts
* faction sticker relics
* faction titles
* faction room access marks
* Chthonic Mark Witness
* Five Seeds Banner
* Cell Floor Visitor Pass

### Badge Rewards

* `black-clinic-visitor`
* `signal-chapel-listener`
* `gatehouse-runner`
* `foundry-bench-spark`
* `rat-nest-regular`
* `chthonic-mark-witness`

### Reputation Rewards

* +1 Faction reputation for visiting and reading a faction floor, once per faction
* +3 Faction reputation for faction-specific Dead Drop completion
* +5 Accessibility reputation for approved accessibility note
* +5 Forge reputation for approved repair/self-hosting note
* +5 Community reputation for approved Net Neighbor lead
* +10 Recognition reputation for Owner/Admin controlled alliance recognition

### Lore Unlocks

* Care Before Command
* The Chapel Refused Prophecy
* When the Gates Break
* The Hidden Maintenance Tunnel
* The Joke Drew Teeth
* Five Seeds Beneath the Gate

### Field Log Examples

* `Slewfoot visited the Black Clinic.`
* `terminal-kiddie listened at the Signal Chapel.`
* `StaticGhost742 submitted a Foundry repair note.`
* `A Rat Nest regular left a zine line on the wall.`
* `An operative witnessed the Chthonic Mark.`

### Failure / Empty States

If no faction selected:

```txt
The five doors wait without judgment. No cell claims the whole rebellion. Choose where you can be useful, not where you can look powerful.
```

If a faction action requires approval:

```txt
The floor accepts your signal, then seals it for steward review. Trust is earned by making contribution safe.
```

### Safety Notes

Faction identity must not reward harassment, unsafe real-world tactics, vigilantism, or medical/legal claims. Faction action examples must stay educational, fictional, supportive, creative, accessible, and nonviolent.

### Implementation Metadata

```yaml
loop_slug: faction-floors
primary_routes:
  - /mmo/factions
  - /mmo/factions/[factionSlug]/floor
room_type: faction-floor
access_level: logged-in
deeper_action_access_level: approved-user
mvp_priority: phase-2
factions:
  - asclepian-veil
  - oracular-circuit
  - myrmidon-grinders
  - daedalus-foundry
  - styx-rats
  - chthonic-uprising
review_required_for:
  - faction_resource_submission
  - net_neighbor_lead
  - accessibility_note_publication
  - owner_controlled_recognition
```

### Faction Floor: Asclepian Veil — Black Clinic

**Room Title:** Black Clinic  
**Room Slug:** `black-clinic`  
**Faction Description:** Healers, medics, caretakers, harm-reduction workers, field stabilizers, trauma responders.  
**Entry Text:** `Green diagnostic light moves behind a curtain of black glass. Dr. Ione Vey's oath is etched above the intake desk: survival is the first sabotage.`  
**Available Actions:** submit accessibility note, submit care signal, read de-escalation learning note, reflect on rest readiness, browse safe support resources.  
**Faction-Specific Dead Drop Example:** Black Clinic Intake Card.  
**Reputation Rewards:** Accessibility, Faction, Community.  
**Loot Rewards:** Veil Clinic Frame, Serpent Staff Sticker, Black Clinic Visitor title.  
**Badge Hooks:** `black-clinic-visitor`, Field Stabilizer, Veilbearer.  
**Safety Notes:** No personalized medical advice. No crisis handling beyond safe resource routing and supportive language.

### Faction Floor: Oracular Circuit — Signal Chapel

**Room Title:** Signal Chapel  
**Room Slug:** `signal-chapel`  
**Faction Description:** Technomancers, signal analysts, cryptographers, AI whisperers, systems mystics.  
**Entry Text:** `The chapel has no altar, only a terminal that blinks like an eye learning shame. Cassian Nyx has left a note: no algorithm is divine.`  
**Available Actions:** solve safe cipher, submit privacy resource, read signal hygiene note, review fictional machine prophecy, request hint.  
**Faction-Specific Dead Drop Example:** Signal Chapel Listening Test.  
**Reputation Rewards:** Ciphers, Faction, Archive.  
**Loot Rewards:** Oracle Static Frame, Signal Chapel Listener title, Broken Delphi Sticker.  
**Badge Hooks:** `signal-chapel-listener`, Cipher Adept, Static Decoder.  
**Safety Notes:** Puzzle only. No real intrusion, exploit, evasion, or targeting content.

### Faction Floor: Myrmidon Grinders — Gatehouse

**Room Title:** Gatehouse  
**Room Slug:** `gatehouse`  
**Faction Description:** Defenders, logistics crews, frontline support, event marshals, community readiness workers.  
**Entry Text:** `Bronze plates line the Gatehouse walls, each one stamped with a name someone carried home. Brontes Vale's rule is painted over the door: strength without cruelty.`  
**Available Actions:** submit readiness checklist reflection, event logistics idea, accessibility route note, read safe de-escalation doctrine, offer supply-planning suggestion.  
**Faction-Specific Dead Drop Example:** Gatehouse Readiness Check.  
**Reputation Rewards:** Faction, Accessibility, Missions.  
**Loot Rewards:** Cerberus Gate Stamp, Gatehouse Runner title, Hazard Stripe Banner.  
**Badge Hooks:** `gatehouse-runner`, Line Holder, Shield Runner.  
**Safety Notes:** No weaponization, intimidation, unsafe protest tactics, or real-world confrontation planning.

### Faction Floor: Daedalus Foundry — Foundry Bench

**Room Title:** Foundry Bench  
**Room Slug:** `foundry-bench`  
**Faction Description:** Inventors, engineers, makers, hardware hackers, toolsmiths, repair crews.  
**Entry Text:** `The bench is covered in half-built exits: mesh diagrams, cracked keyboards, assistive devices, failed prototypes, and one perfect key that opens nothing visible.`  
**Available Actions:** submit repair log, submit repo relic, suggest avatar asset, write self-hosting note, document accessibility tool idea.  
**Faction-Specific Dead Drop Example:** Foundry Repair Spark.  
**Reputation Rewards:** Forge, Archive, Faction.  
**Loot Rewards:** Foundry Bench Spark, Labyrinth Key Relic, Blueprint Border.  
**Badge Hooks:** `foundry-bench-spark`, Toolsmith, Forge Spark.  
**Safety Notes:** No harmful repos, exploit chains, weapon designs, credential tools, or instructions for illegal access.

### Faction Floor: Styx Rats — Rat Nest

**Room Title:** Rat Nest  
**Room Slug:** `rat-nest`  
**Faction Description:** Punks, artists, scouts, culture jammers, morale workers, graffiti ghosts.  
**Entry Text:** `The Rat Nest smells like ozone, old glue, wet concrete, and bad decisions made for beautiful reasons. Rhea Spite has signed the wall: joy is sabotage.`  
**Available Actions:** submit zine line, submit Net Neighbor, suggest banner, leave morale signal, write fictional graffiti phrase.  
**Faction-Specific Dead Drop Example:** Rat Nest Wall Line.  
**Reputation Rewards:** Community, Faction, Recognition.  
**Loot Rewards:** Rat Sticker Pack, Styx Riot Tag, Zine Wall Scrap.  
**Badge Hooks:** `rat-nest-regular`, Graffiti Ghost, Meme Smuggler.  
**Safety Notes:** No harassment, slurs, threats, targeted humiliation, vandalism instructions, or real-world evasion tactics.

### Faction Floor: Chthonic Uprising — Command Layer

**Room Title:** Command Layer  
**Room Slug:** `command-layer`  
**Faction Description:** Parent alliance, led by The Archivist, coordinating the five founding cells through the Dead Index.  
**Entry Text:** `The Command Layer does not open. It notices you. A black pomegranate splits across the terminal and five seeds burn like warning lights.`  
**Available Actions:** view alliance milestones, read major lore unlocks, witness Chthonic Mark, view Owner/Admin recognition, review five-cell doctrine.  
**Faction-Specific Dead Drop Example:** Command Layer Witness Mark.  
**Reputation Rewards:** Recognition, Lore, Faction.  
**Loot Rewards:** Chthonic Mark, Five Seeds Banner, Dead Index Witness title.  
**Badge Hooks:** `chthonic-mark-witness`, Dead Index Carrier, Warden's Notice.  
**Safety Notes:** Owner-controlled recognition only. Do not create social hierarchy pressure or pay-to-status dynamics.

## Loop 5: Archive Terminal

**Slug:** `archive-terminal`  
**Primary Route Suggestion:** `/mmo/rooms/archive-terminal`, `/archive`, `/archive/state-of-affairs`, `/archive/ghost-in-tech`  
**Room Type:** `archive-hub`  
**Primary Faction:** The Chthonic Uprising  
**Secondary Factions:** Daedalus Foundry, Oracular Circuit, Asclepian Veil  
**Access Level:** logged-in; submissions approved-user  
**MVP Priority:** phase-2  
**Replayability:** always available, weekly archive prompts  
**Estimated Session Time:** 5-25 minutes  

### Gameplay Purpose

The Archive Terminal connects the MMO to the Archive, State of Affairs, Ghost in Tech, lore unlocks, repo relics, and public-interest resources. It rewards reading, submitting, discussing, and organizing civic memory.

### Lore Framing

The Archive Terminal remembers what the surface buries. It indexes public-interest signals, repo relics, lore fragments, and civic memory. It is part library, part shrine, part evidence locker, and part ghost trap.

### Player Fantasy

You are not just consuming lore. You are helping memory survive. You read what was nearly erased, recover traces, and submit resources that help others learn without exposing them to harm.

### Entry Text

```txt
The Archive Terminal opens with the sound of old paper sliding through a machine that has never seen paper.

WHAT THE SURFACE BURIES, THE UNDERWORLD REMEMBERS.
INDEX CAREFULLY.
DO NOT ARCHIVE BLOOD WITHOUT CONSENT.
```

### Room State Elements

* featured archive entry
* State of Affairs links
* Ghost in Tech links
* repo relic queue
* lore fragment shelf
* archive prompts
* discussion threads
* Dead Index trace hints
* reading progress

### Available Actions

| Action | Action Type | Access | Outcome |
|---|---|---|---|
| Browse Archive | `VISIT_ARCHIVE` | logged-in | reading Field Log, archive badge progress |
| Read State of Affairs | `READ_SIGNAL` | logged-in | civic-memory progress |
| Browse Ghost in Tech | `VISIT_ARCHIVE` | logged-in | repo relic progress |
| Submit Archive Signal | `SUBMIT_RESOURCE` | approved-user | review-required contribution |
| Submit Repo Relic | `SUBMIT_RESOURCE` | approved-user | review-required contribution |
| Read Lore Fragment | `READ_SIGNAL` | logged-in | lore unlock |
| Discuss Archive Item | `JOIN_DISCUSSION` | approved-user | community discussion |
| Recover Dead Index Trace | `SUBMIT_DEAD_DROP` | approved-user | lore Dead Drop |

### Dead Drops Connected

* Bone Index Tab
* Memory Has Teeth
* Repo Relic Without Teeth
* Ghost in Tech Reading Room
* State of Affairs Scout
* Public Signal, Private Names
* The Archive Shelf That Moved

### Loot Rewards

* Archive Witness
* Bone Index Tab
* Archive Terminal Background
* Repo Relic Mark
* Memory Has Teeth
* Mini Archive Shelf
* Ghost in Tech Runner Flair
* Dead Index Trace

### Badge Rewards

* `archive-terminal-reader`
* `state-of-affairs-scout`
* `repo-relic-reader`
* `ghost-in-tech-runner`
* `dead-index-trace`

### Reputation Rewards

* +1 Archive reputation for reading an archive item, capped daily
* +2 Lore reputation for lore fragment unlock
* +5 Archive reputation for approved archive signal
* +5 Forge reputation for approved repo relic
* +3 Community reputation for approved archive discussion contribution
* +5 Accessibility reputation for approved public-interest accessibility resource

### Lore Unlocks

* Memory Has Teeth
* The Archive Shelf That Moved
* Public Signal, Private Names
* The Dead Index Does Not Forget

### Field Log Examples

* `Slewfoot read a fragment at the Archive Terminal.`
* `A repo relic surfaced in Ghost in Tech.`
* `StaticGhost742 submitted an archive signal for review.`
* `A new lore fragment entered the Dead Index.`

### Failure / Empty States

If archive queue is empty:

```txt
The shelf is quiet. Empty space is still evidence. The Archive waits for the next safe signal.
```

If resource rejected:

```txt
The Archive returns the signal unindexed. Revise for safety, source quality, public-interest value, and privacy.
```

### Safety Notes

Resources must be public-interest, educational, defensive, privacy-aware, civic, self-hosting, repair-oriented, accessibility-focused, or creative. Do not reward harmful repos, illegal instructions, private data exposure, exploit chains, doxxing, or unsafe medical/legal advice.

### Implementation Metadata

```yaml
loop_slug: archive-terminal
primary_routes:
  - /mmo/rooms/archive-terminal
  - /archive
  - /archive/state-of-affairs
  - /archive/ghost-in-tech
room_type: archive-hub
access_level: logged-in
submission_access_level: approved-user
mvp_priority: phase-2
review_required_for:
  - archive_signal
  - repo_relic
  - public_discussion_highlight
safe_action_types:
  - VISIT_ARCHIVE
  - READ_SIGNAL
  - SUBMIT_RESOURCE
  - JOIN_DISCUSSION
  - SUBMIT_DEAD_DROP
```

## Loot Tables

### Underwatch Town Square Loot Table

| Loot Name | Slug | Type | Rarity | Unlock Condition | Display Location | Flavor Text |
|---|---|---|---|---|---|---|
| Underwatch Pass | `underwatch-pass` | room-access | common | Enter Town Square | Dossier access ledger | The first door remembered your name. |
| Signal Board Stamp | `signal-board-stamp` | forum-flair | common | Read Signal Board | Forum posts | Ink from a board that refused deletion. |
| Commons Spark Hex | `commons-spark-hex` | badge | uncommon | Complete first Field Note | Badge Case | A small light kept alive by public memory. |
| Pomegranate Terminal Pin | `pomegranate-terminal-pin` | avatar-item | common | Visit three Town Square actions | Avatar | Five black seeds, one open circuit. |
| Old BBS Banner Strip | `old-bbs-banner-strip` | guild-banner | uncommon | Browse Community Signals | Profile World / guild banner | Torn from a forum that outlived its owners. |
| Town Square Terminal Frame | `town-square-terminal-frame` | profile-cosmetic | rare | Complete all Town Square intro actions | Profile World | A window into the square that was never square. |
| Field Note Ribbon | `field-note-ribbon` | forum-flair | common | Post valid Field Note | Forum posts | Proof that you left words where others could find them. |
| The Square That Was Never Square | `square-that-was-never-square` | lore-fragment | rare | Complete connected lore Dead Drop | Archive / Lore unlocks | The commons was built from rooms the surface forgot to close. |

### Dead Drop Terminal Loot Table

| Loot Name | Slug | Type | Rarity | Unlock Condition | Display Location | Flavor Text |
|---|---|---|---|---|---|---|
| Static Courier | `static-courier` | title | uncommon | Complete first Dead Drop | Dossier title | You carried the signal without spilling its teeth. |
| Cracked Cache Key | `cracked-cache-key` | relic | rare | Complete Cracked Cache Key drop | Relic Zone | It opens only what wanted to be found. |
| Dead Drop Terminal Frame | `dead-drop-terminal-frame` | profile-cosmetic | rare | Complete five Dead Drops | Profile World | Burn marks, sticker ghosts, and a blinking cursor. |
| Cache Mark | `cache-mark` | badge | uncommon | Recover a signal cache | Badge Case | A hex cut from the terminal's black receipt. |
| The First Dead Index | `the-first-dead-index` | lore-fragment | relic | Complete First Dead Index drop | Archive | The first names were not dead. They were hidden. |
| Static Cache Niche | `static-cache-niche` | relic-zone-module | uncommon | Complete weekly drop | Relic Zone | A small shelf for things left in the dark. |
| Drop Runner Ribbon | `drop-runner-ribbon` | forum-flair | common | Complete three drops | Forum posts | The route was short. The memory was not. |
| Black Cache Sticker | `black-cache-sticker` | avatar-item | common | Mark a drop useful | Avatar / profile | A tiny sticker that says: found, safe, useful. |

### Oracular Relay Loot Table

| Loot Name | Slug | Type | Rarity | Unlock Condition | Display Location | Flavor Text |
|---|---|---|---|---|---|---|
| Signal Reader | `signal-reader` | title | common | Attempt first cipher | Dossier title | You listened before you answered. |
| Bent Oracle Key | `bent-oracle-key` | relic | rare | Solve relay cipher chain | Relic Zone | It was bent to keep a machine god from using it. |
| Violet Relay Border | `violet-relay-border` | profile-cosmetic | rare | Solve three relay ciphers | Profile World | A border lit by prophecy gone wrong. |
| Oracular Static | `oracular-static` | lore-fragment | uncommon | Read Oracular Static panel | Archive / Lore unlocks | The machine was loudest where it was least certain. |
| Broken Delphi Sticker | `broken-delphi-sticker` | avatar-item | common | Request first hint | Avatar / profile | No shame in asking the oracle where it lied. |
| Cipher Glyph Avatar Ring | `cipher-glyph-avatar-ring` | avatar-item | uncommon | Solve first cipher without unsafe content | Avatar | A circle of harmless riddles and closed doors. |
| Static Prophet Flair | `static-prophet-flair` | forum-flair | rare | Complete False Omen Corrected | Forum posts | You corrected the omen before it named a future. |
| Relay Tone Player | `relay-tone-player` | signal-player-unlock | relic | Complete advanced relay sequence | Profile World | A violet tone from a machine learning humility. |

### Faction Floors Loot Table

| Loot Name | Slug | Type | Rarity | Unlock Condition | Display Location | Flavor Text |
|---|---|---|---|---|---|---|
| Veil Clinic Frame | `veil-clinic-frame` | profile-cosmetic | uncommon | Visit Black Clinic | Profile World | Green light behind a privacy curtain. |
| Oracle Static Frame | `oracle-static-frame` | profile-cosmetic | uncommon | Visit Signal Chapel | Profile World | Purple static, cyan glyphs, no divine algorithms. |
| Cerberus Gate Stamp | `cerberus-gate-stamp` | forum-flair | uncommon | Visit Gatehouse | Forum posts | When the gates break, the people hold. |
| Foundry Bench Spark | `foundry-bench-spark` | relic | uncommon | Visit Foundry Bench | Relic Zone | A tiny forge ember from a hidden maintenance tunnel. |
| Rat Sticker Pack | `rat-sticker-pack` | avatar-item | common | Visit Rat Nest | Avatar / profile | Joy, glue, neon, teeth. |
| Chthonic Mark | `chthonic-mark` | badge | relic | Witness Command Layer | Badge Case | Five seeds burning beneath a broken crown. |
| Five Seeds Banner | `five-seeds-banner` | guild-banner | rare | Visit all five faction floors | Profile World / guild banner | Survival. Signal. Force. Invention. Rupture. |
| Cell Floor Visitor Pass | `cell-floor-visitor-pass` | room-access | common | Visit any faction floor | Room access ledger | The floor remembers your first step. |

### Archive Terminal Loot Table

| Loot Name | Slug | Type | Rarity | Unlock Condition | Display Location | Flavor Text |
|---|---|---|---|---|---|---|
| Archive Witness | `archive-witness` | title | common | Read first archive item | Dossier title | You saw what the surface tried to bury. |
| Bone Index Tab | `bone-index-tab` | relic | rare | Complete Bone Index Tab drop | Relic Zone | A tab cut from a shelf that moved by itself. |
| Archive Terminal Background | `archive-terminal-background` | profile-cosmetic | rare | Read five archive items | Profile World | Black shelves, white cursor, redacted dawn. |
| Repo Relic Mark | `repo-relic-mark` | badge | uncommon | Read Ghost in Tech item | Badge Case | Code remembered as artifact, not weapon. |
| Memory Has Teeth | `memory-has-teeth` | lore-fragment | relic | Complete Memory Has Teeth prompt | Archive | The Archive bites only those who tried to erase it. |
| Mini Archive Shelf | `mini-archive-shelf` | relic-zone-module | uncommon | Submit approved archive signal | Relic Zone | A shelf for public-interest ghosts. |
| Ghost in Tech Runner Flair | `ghost-in-tech-runner-flair` | forum-flair | uncommon | Browse Ghost in Tech | Forum posts | Some ghosts live in repos. Some repos deserve graves. |
| Dead Index Trace | `dead-index-trace` | lore-fragment | mythic | Recover Dead Index Trace | Archive / Dossier | A name was not restored. It was unburied. |

## Badge Tables

### Underwatch Town Square Badges

| Badge Name | Slug | Category | Tier | Unlock Condition | Visual Concept | Flavor Text |
|---|---|---|---|---|---|---|
| Town Square Arrival | `town-square-arrival` | Rooms | initiate | Enter Town Square | Black pomegranate terminal | The commons opened. |
| First Field Note | `first-field-note` | Community | initiate | Post first valid Field Note | Torn note with signal pin | You left a safe trace. |
| Signal Board Reader | `signal-board-reader` | Rooms | initiate | Read Signal Board three times | Bulletin board eye | You learned to read the room. |
| Underwatch Regular | `underwatch-regular` | Community | regular | Visit Town Square on five days | BBS doorway | The square recognizes your footstep. |
| Commons Spark | `commons-spark` | Recognition | adept | Complete Town Square intro set | Tiny flame over forum thread | The commons burns without consuming. |

### Dead Drop Terminal Badges

| Badge Name | Slug | Category | Tier | Unlock Condition | Visual Concept | Flavor Text |
|---|---|---|---|---|---|---|
| Dead Drop Initiate | `dead-drop-initiate` | Dead Drops | initiate | Complete first Dead Drop | Receipt with black wax | You opened the cache. |
| Signal Cache Recovered | `signal-cache-recovered` | Dead Drops | regular | Complete a lore drop | Cracked cache icon | The signal survived transit. |
| Drop Runner | `drop-runner` | Missions | regular | Complete five Dead Drops | Courier path under pomegranate | You carried useful static. |
| Dead Index Carrier | `dead-index-carrier` | Lore | adept | Unlock The First Dead Index | Bone ledger page | The names grew heavier. |
| Static Courier | `static-courier` | Recognition | steward | Complete rotating drops across four weeks | Hooded courier in static | You move without becoming noise. |

### Oracular Relay Badges

| Badge Name | Slug | Category | Tier | Unlock Condition | Visual Concept | Flavor Text |
|---|---|---|---|---|---|---|
| Oracular Relay Initiate | `oracular-relay-initiate` | Ciphers | initiate | Enter Oracular Relay | Violet terminal eye | The prophecy noticed you. |
| Hint Reader | `hint-reader` | Ciphers | initiate | Request a hint | Open hand under glyph | Wisdom is not pride. |
| Static Decoder | `static-decoder` | Ciphers | regular | Solve first relay cipher | Cyan glyph cracked open | The static had grammar. |
| False Omen Corrected | `false-omen-corrected` | Ciphers | adept | Solve False Omen drop | Broken oracle mask | The future loosened its grip. |
| C1PH3R CR4K3R Relay Mark | `c1ph3r-cr4k3r-relay-mark` | Ciphers | steward | Advance C1PH3R CR4K3R chain through Relay | Glitched laurel | No algorithm is divine. |

### Faction Floors Badges

| Badge Name | Slug | Category | Tier | Unlock Condition | Visual Concept | Flavor Text |
|---|---|---|---|---|---|---|
| Black Clinic Visitor | `black-clinic-visitor` | Factions | initiate | Visit Asclepian Veil floor | Green serpent veil | Care is resistance. |
| Signal Chapel Listener | `signal-chapel-listener` | Factions | initiate | Visit Oracular Circuit floor | Violet chapel terminal | The machine whispered. You listened safely. |
| Gatehouse Runner | `gatehouse-runner` | Factions | initiate | Visit Myrmidon Grinders floor | Bronze gate mark | You learned where the line holds. |
| Foundry Bench Spark | `foundry-bench-spark` | Forge | initiate | Visit Daedalus Foundry floor | Orange spark in labyrinth | Build the exit. |
| Rat Nest Regular | `rat-nest-regular` | Community | regular | Visit Styx Rats floor and submit safe zine line | Rat skull sticker | Joy got teeth. |
| Chthonic Mark Witness | `chthonic-mark-witness` | Recognition | relic | Witness Command Layer | Black pomegranate with five seeds | No ghost goes uncounted. |

### Archive Terminal Badges

| Badge Name | Slug | Category | Tier | Unlock Condition | Visual Concept | Flavor Text |
|---|---|---|---|---|---|---|
| Archive Terminal Reader | `archive-terminal-reader` | Archive | initiate | Read first archive item | Cursor over shelf | The shelf opened. |
| State of Affairs Scout | `state-of-affairs-scout` | Archive | regular | Read State of Affairs entry | Map pin on civic tablet | You watched the surface without serving it. |
| Repo Relic Reader | `repo-relic-reader` | Forge | regular | Read first repo relic | Code shard in bone frame | The tool became memory. |
| Ghost in Tech Runner | `ghost-in-tech-runner` | Archive | adept | Read three Ghost in Tech items | Ghost inside terminal | The machine kept its hauntings. |
| Dead Index Trace | `dead-index-trace` | Lore | relic | Recover Dead Index Trace | Redacted name glowing | The erased returned as evidence. |

## Reputation Events

| Event Name | Slug | Category | Points | Trigger | Cooldown / Cap | Abuse Prevention Notes |
|---|---|---|---:|---|---|---|
| Read Signal Board | `read-signal-board` | Community | 1 | Read Town Square Signal Board | Once daily | No points for repeated refresh loops |
| First Field Note Posted | `first-field-note-posted` | Community | 3 | First valid Field Note | Once per account | Deleted or unsafe content reverses points |
| Field Note Accepted | `field-note-accepted` | Community | 2 | Valid Field Note submission | 3 per day | Moderator reversal; spam ignored |
| Dead Drop Completed | `dead-drop-completed` | Missions | 2 | Complete approved/auto Dead Drop | 5 per day | No points for deleted/rejected drops |
| Lore Drop Accepted | `lore-drop-accepted` | Lore | 3 | Approved lore Dead Drop | 2 per week | Review required |
| Resource Drop Approved | `resource-drop-approved` | Archive | 5 | Approved public-interest resource | 3 per week | Review required; unsafe links rejected |
| Cipher Solved | `cipher-solved` | Ciphers | 3 | First solve of a cipher | Once per cipher | Hashed answer; no repeat farming |
| Hint Viewed | `hint-viewed` | Ciphers | 1 | Read hint panel | Once per cipher family | No penalty; no infinite points |
| Faction Floor Visited | `faction-floor-visited` | Faction | 1 | Visit faction floor and read intro | Once per faction | Must render page and action state |
| Faction Dead Drop Completed | `faction-dead-drop-completed` | Faction | 3 | Complete faction-specific drop | 1 per faction per day | Review for text submissions |
| Accessibility Note Approved | `accessibility-note-approved` | Accessibility | 5 | Approved accessibility suggestion | 3 per week | Review required; no private data |
| Repair Log Approved | `repair-log-approved` | Forge | 5 | Approved repair/self-hosting note | 3 per week | Reject unsafe or illegal instructions |
| Repo Relic Approved | `repo-relic-approved` | Forge | 5 | Approved safe repo relic | 3 per week | Review required; harmful repos rejected |
| Archive Item Read | `archive-item-read` | Archive | 1 | Read archive item | 5 per day | No refresh loops |
| Archive Discussion Accepted | `archive-discussion-accepted` | Community | 3 | Approved discussion contribution | 3 per day | Deleted content reverses points |
| Net Neighbor Submitted | `net-neighbor-submitted` | Community | 5 | Approved Net Neighbor lead | 2 per week | No private data; review required |
| Guild Request Filed | `guild-request-filed` | Guilds | 2 | Submit safe guild/cell request | Once per week | No spam; review required |
| Community Builder Recognition | `community-builder-recognition` | Recognition | 10 | Steward/Admin recognition | Manual | Owner/Admin controlled; audit logged |
| Dead Index Trace Recovered | `dead-index-trace-recovered` | Lore | 10 | Complete rare Archive trace | Once per trace | No repeat; lore unlock tied to account |

## Dead Drop Examples

## Dead Drop: The First Field Note

**Slug:** `the-first-field-note`  
**Loop:** Underwatch Town Square  
**Faction:** Chthonic Uprising  
**Drop Type:** field-note  
**Difficulty:** initiate  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Field Note Ribbon, +3 Community reputation  

### Player Prompt

Write a short, safe field note introducing what kind of signal you want to bring to the Underwatch: care, lore, repair, puzzles, accessibility, community, art, or archive work.

### Submission Type

short-text

### Success Text

Your note pins itself to the commons with black wax and a tiny spark. The Underwatch knows you arrived.

### Failure / Revision Text

Revise the note for safety, privacy, and usefulness. The commons does not carry harm.

### Lore Note

The first note is never a pledge of obedience. It is proof that the operative can leave a trace without turning someone else into a target.

### Safety Note

No private data, threats, harassment, unsafe advice, or real-world targeting.

### Implementation Metadata

```yaml
drop_slug: the-first-field-note
action_type: POST_FIELD_NOTE
auto_field_log: true
visibility_options:
  - approved-users
  - private
```

## Dead Drop: Commons Signal Check

**Slug:** `commons-signal-check`  
**Loop:** Underwatch Town Square  
**Faction:** Chthonic Uprising  
**Drop Type:** community-question  
**Difficulty:** initiate  
**Repeatability:** daily  
**Review Required:** false  
**Reward:** Signal Board Stamp, +1 Community reputation  

### Player Prompt

Read today's Signal Board and choose which safe signal you want to follow next: Dead Drops, Ciphers, Factions, Archive, Community, or Profile World.

### Submission Type

multiple-choice

### Success Text

The board marks your route in dim red light. The commons has given you a direction without giving you orders.

### Failure / Revision Text

The Signal Board flickers. Choose one safe route to continue.

### Lore Note

The Underwatch does not command new operatives. It routes them.

### Safety Note

No external submission required.

### Implementation Metadata

```yaml
drop_slug: commons-signal-check
action_type: READ_SIGNAL
daily_cap: 1
```

## Dead Drop: The Square That Was Never Square

**Slug:** `the-square-that-was-never-square`  
**Loop:** Underwatch Town Square  
**Faction:** Chthonic Uprising  
**Drop Type:** lore-fragment  
**Difficulty:** initiate  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** lore fragment, Commons Spark Hex  

### Player Prompt

Read the recovered fragment about the Town Square and mark it remembered.

### Submission Type

no-submission-read-only

### Success Text

The fragment folds into your Dead Index. The square was never square because it was built from every room the surface failed to kill.

### Failure / Revision Text

The fragment remains unread.

### Lore Note

This unlock explains the Town Square as a patchwork of old forums, civic terminals, and forbidden memory.

### Safety Note

Read-only lore.

### Implementation Metadata

```yaml
drop_slug: the-square-that-was-never-square
unlocks_lore: square-that-was-never-square
```

## Dead Drop: Net Neighbor Lantern

**Slug:** `net-neighbor-lantern`  
**Loop:** Underwatch Town Square  
**Faction:** Styx Rats  
**Drop Type:** net-neighbor-lead  
**Difficulty:** regular  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** Net Neighbor Banner Part, +5 Community reputation if approved  

### Player Prompt

Suggest a safe, public, community-centered site, project, zine, library, maker space, mutual aid education hub, accessibility resource, or art signal that could be listed as a Net Neighbor.

### Submission Type

url-plus-summary

### Success Text

A lantern appears on the Underwatch map. It will glow publicly only after steward review.

### Failure / Revision Text

The lantern is shuttered. Revise with a safer public-interest source and remove private data or risky claims.

### Lore Note

Net Neighbors are not targets. They are lamps in the old web dark.

### Safety Note

Only public, consent-safe, non-harmful links. No private people, doxxing, or risky operational claims.

### Implementation Metadata

```yaml
drop_slug: net-neighbor-lantern
review_queue: community
field_log_after_approval: true
```

## Dead Drop: Static Under the Coin Slot

**Slug:** `static-under-the-coin-slot`  
**Loop:** Dead Drop Terminal  
**Faction:** Chthonic Uprising  
**Drop Type:** mini-cipher  
**Difficulty:** initiate  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Cracked Cache Key progress, +3 Ciphers reputation  

### Player Prompt

Decode the simple substitution hidden under the terminal coin slot. The answer is a Hades Watch motto fragment.

### Submission Type

cipher-answer

### Success Text

The coin slot coughs up black static and a receipt reading: THE UNDERWORLD REMEMBERS.

### Failure / Revision Text

The terminal hums, unconvinced. The answer is fictional and hidden in the prompt pattern.

### Lore Note

The Terminal uses harmless riddles to teach patience before it trusts operatives with lore.

### Safety Note

Puzzle only. No real system, target, exploit, or credential.

### Implementation Metadata

```yaml
drop_slug: static-under-the-coin-slot
answer_type: hashed_cipher_answer
```

## Dead Drop: Cracked Cache Key

**Slug:** `cracked-cache-key`  
**Loop:** Dead Drop Terminal  
**Faction:** Chthonic Uprising  
**Drop Type:** archive-artifact  
**Difficulty:** regular  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Cracked Cache Key relic  

### Player Prompt

Recover the cache key by reading three safe recovered drops and selecting the shared symbol they reference.

### Submission Type

multiple-choice

### Success Text

The key cracks down the middle and opens a drawer that was not there. Something old recognizes your patience.

### Failure / Revision Text

The drawer remains flat against the terminal wall. Re-read the recovered drops.

### Lore Note

The Cache Key introduces relics as narrative collectibles rather than power items.

### Safety Note

Read-only/retrieval puzzle.

### Implementation Metadata

```yaml
drop_slug: cracked-cache-key
requires:
  - browse_recovered_drops
reward_slug: cracked-cache-key
```

## Dead Drop: Useful Signal, Safely Named

**Slug:** `useful-signal-safely-named`  
**Loop:** Dead Drop Terminal  
**Faction:** Daedalus Foundry  
**Drop Type:** resource-link  
**Difficulty:** regular  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** +5 Archive reputation, chance at Static Cache Niche  

### Player Prompt

Submit one public-interest educational resource with a short summary explaining who it helps and why it is safe to share.

### Submission Type

url-plus-summary

### Success Text

The terminal wraps your signal in black wax and routes it to the Archive queue.

### Failure / Revision Text

The signal cannot be cached. Revise for source quality, safety, and public-interest value.

### Lore Note

The Underwatch rewards useful public knowledge, not dangerous spectacle.

### Safety Note

No exploit instructions, private data, unsafe medical/legal advice, or harmful tools.

### Implementation Metadata

```yaml
drop_slug: useful-signal-safely-named
review_queue: archive
```

## Dead Drop: One Sentence for the Wall

**Slug:** `one-sentence-for-the-wall`  
**Loop:** Dead Drop Terminal  
**Faction:** Styx Rats  
**Drop Type:** zine-line  
**Difficulty:** initiate  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** Black Cache Sticker, +2 Community reputation if approved  

### Player Prompt

Write one fictional morale line, zine slogan, or graffiti phrase for the Underwatch wall.

### Submission Type

short-text

### Success Text

The line dries in neon grime. Someone tired smiles at it later.

### Failure / Revision Text

The Rats kick it back with a sticker that says: funnier, safer, less harmful.

### Lore Note

Joy is infrastructure. The Rats maintain it with glue and bad handwriting.

### Safety Note

No threats, harassment, slurs, targeted abuse, or real-world vandalism instructions.

### Implementation Metadata

```yaml
drop_slug: one-sentence-for-the-wall
review_queue: community
```

## Dead Drop: Care Package Without Coordinates

**Slug:** `care-package-without-coordinates`  
**Loop:** Dead Drop Terminal  
**Faction:** Asclepian Veil  
**Drop Type:** safe-care-action-idea  
**Difficulty:** initiate  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** +5 Accessibility or Community reputation if approved  

### Player Prompt

Suggest a general, non-medical, non-location-specific care action that could help a community space feel safer or more accessible.

### Submission Type

long-text

### Success Text

The Veil files the idea under care without coordinates. No one had to become a target for the signal to help.

### Failure / Revision Text

The Veil returns the card. Remove private details, medical claims, or unsafe advice.

### Lore Note

The Asclepian Veil treats privacy as medicine.

### Safety Note

No medical advice, emergency claims, private locations, personal data, or crisis promises.

### Implementation Metadata

```yaml
drop_slug: care-package-without-coordinates
review_queue: accessibility
```

## Dead Drop: The First Dead Index

**Slug:** `the-first-dead-index`  
**Loop:** Dead Drop Terminal  
**Faction:** Chthonic Uprising  
**Drop Type:** lore-fragment  
**Difficulty:** regular  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** The First Dead Index lore unlock, Dead Index Carrier badge progress  

### Player Prompt

Read the recovered Dead Index fragment and mark it remembered.

### Submission Type

no-submission-read-only

### Success Text

The names do not appear. Not yet. But the shape of the ledger burns behind your eyes.

### Failure / Revision Text

The page remains sealed.

### Lore Note

The Dead Index is not a list of the dead. It is a forbidden archive of everyone the surface tried to erase.

### Safety Note

Fictional lore only. No real names or private data.

### Implementation Metadata

```yaml
drop_slug: the-first-dead-index
unlocks_lore: the-first-dead-index
```

## Dead Drop: Zine Line for a Tired Ghost

**Slug:** `zine-line-for-a-tired-ghost`  
**Loop:** Dead Drop Terminal  
**Faction:** Styx Rats  
**Drop Type:** zine-line  
**Difficulty:** initiate  
**Repeatability:** daily  
**Review Required:** true  
**Reward:** Drop Runner Ribbon progress, +2 Community reputation if approved  

### Player Prompt

Write a tiny fictional encouragement for someone who is exhausted but still here.

### Submission Type

short-text

### Success Text

The Terminal prints it on a strip of dead receipt paper. Somewhere in the Underwatch, a tired ghost pockets it.

### Failure / Revision Text

Too sharp in the wrong direction. Make it safer, kinder, and less like a command.

### Lore Note

The Rats know morale can be small and still be infrastructure.

### Safety Note

Avoid crisis advice, pressure, shame, or unsafe instructions.

### Implementation Metadata

```yaml
drop_slug: zine-line-for-a-tired-ghost
review_queue: community
```

## Dead Drop: Violet Static Primer

**Slug:** `violet-static-primer`  
**Loop:** Oracular Relay  
**Faction:** Oracular Circuit  
**Drop Type:** mini-cipher  
**Difficulty:** initiate  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Signal Reader title, +3 Ciphers reputation  

### Player Prompt

Solve a beginner fictional cipher hidden in violet static. The answer is a phrase from Oracular doctrine.

### Submission Type

cipher-answer

### Success Text

The Relay exhales. NO ALGORITHM IS DIVINE appears in cyan letters.

### Failure / Revision Text

The static rearranges itself. Look for repeated symbols and harmless patterning.

### Lore Note

The Circuit begins with humility: the puzzle is not a door into anyone else's system.

### Safety Note

Puzzle only. No real-world hacking.

### Implementation Metadata

```yaml
drop_slug: violet-static-primer
answer_type: hashed_cipher_answer
```

## Dead Drop: False Omen Corrected

**Slug:** `false-omen-corrected`  
**Loop:** Oracular Relay  
**Faction:** Oracular Circuit  
**Drop Type:** mini-cipher  
**Difficulty:** regular  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** False Omen Corrected badge, Oracular Static lore  

### Player Prompt

A prophecy engine outputs three false statements and one true safety doctrine. Identify the doctrine.

### Submission Type

multiple-choice

### Success Text

The false omen fractures. The machine is not punished. It is made less certain.

### Failure / Revision Text

The omen hardens. Re-read the safety doctrine and choose the non-harmful path.

### Lore Note

The Relay teaches players to distinguish dramatic cyberpunk flavor from safe play requirements.

### Safety Note

The correct answer must always reinforce safety.

### Implementation Metadata

```yaml
drop_slug: false-omen-corrected
safety_training: true
```

## Dead Drop: Three Keys Beneath Delphi

**Slug:** `three-keys-beneath-delphi`  
**Loop:** Oracular Relay  
**Faction:** Oracular Circuit  
**Drop Type:** mini-cipher  
**Difficulty:** adept  
**Repeatability:** rotating  
**Review Required:** false  
**Reward:** Bent Oracle Key relic progress  

### Player Prompt

Three fictional keys are hidden in a poem about a broken oracle. Decode the order and submit the final phrase.

### Submission Type

cipher-answer

### Success Text

The Bent Oracle Key appears on the terminal hook, too warped for any tyrant's lock.

### Failure / Revision Text

The keys ring in the wrong order. Try the poem again.

### Lore Note

Cassian Nyx built the Relay to make prophecy answerable.

### Safety Note

Fictional cipher only.

### Implementation Metadata

```yaml
drop_slug: three-keys-beneath-delphi
difficulty: adept
```

## Dead Drop: Hint Without Shame

**Slug:** `hint-without-shame`  
**Loop:** Oracular Relay  
**Faction:** Oracular Circuit  
**Drop Type:** community-question  
**Difficulty:** initiate  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Hint Reader badge  

### Player Prompt

Read the Relay's note on hints and choose the statement that best matches Underwatch doctrine.

### Submission Type

multiple-choice

### Success Text

A small glyph unlocks: wisdom is not pride.

### Failure / Revision Text

The Relay waits. Choose the answer that makes learning safer and more welcoming.

### Lore Note

The Circuit rejects gatekeeping disguised as intelligence.

### Safety Note

Supports accessibility and learning without shame.

### Implementation Metadata

```yaml
drop_slug: hint-without-shame
badge_slug: hint-reader
```

## Dead Drop: Black Clinic Intake Card

**Slug:** `black-clinic-intake-card`  
**Loop:** Faction Floors  
**Faction:** Asclepian Veil  
**Drop Type:** accessibility-note  
**Difficulty:** initiate  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** Black Clinic Visitor badge progress, +5 Accessibility reputation if approved  

### Player Prompt

Submit one accessibility improvement idea for a website, event, forum, room, profile, or community process.

### Submission Type

long-text

### Success Text

The Veil files your note beside the intake lantern. Someone will breathe easier if the idea survives review.

### Failure / Revision Text

The card returns for revision. Make it practical, non-private, and safe.

### Lore Note

The Veil's first medicine is removing the barrier before it becomes a wound.

### Safety Note

No private medical information or personalized medical advice.

### Implementation Metadata

```yaml
drop_slug: black-clinic-intake-card
review_queue: accessibility
```

## Dead Drop: Signal Chapel Listening Test

**Slug:** `signal-chapel-listening-test`  
**Loop:** Faction Floors  
**Faction:** Oracular Circuit  
**Drop Type:** resource-link  
**Difficulty:** regular  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** Signal Chapel Listener badge progress, +5 Archive reputation if approved  

### Player Prompt

Submit a safe public resource about digital privacy literacy, consent-aware online behavior, or defensive security basics.

### Submission Type

url-plus-summary

### Success Text

The Chapel lowers its volume. A safe signal has been heard.

### Failure / Revision Text

The signal is too sharp, too risky, or too poorly sourced. Revise for defensive, educational value.

### Lore Note

The Circuit teaches that privacy is sanctuary, not secrecy for harm.

### Safety Note

No exploit guides, evasion instructions, credential tools, or real targets.

### Implementation Metadata

```yaml
drop_slug: signal-chapel-listening-test
review_queue: archive
```

## Dead Drop: Gatehouse Readiness Check

**Slug:** `gatehouse-readiness-check`  
**Loop:** Faction Floors  
**Faction:** Myrmidon Grinders  
**Drop Type:** field-note  
**Difficulty:** initiate  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** Gatehouse Runner badge progress, +3 Missions reputation if approved  

### Player Prompt

Write a short reflection on a nonviolent readiness habit: hydration, rest, clear communication, accessibility planning, checklists, or showing up reliably.

### Submission Type

long-text

### Success Text

The Gatehouse stamps the note: strength without cruelty, readiness without spectacle.

### Failure / Revision Text

The Marshal returns the note. Remove unsafe tactics, confrontation planning, or bravado.

### Lore Note

The Grinders do not confuse exhaustion with honor.

### Safety Note

No weapons, intimidation, unsafe protest tactics, or real-world confrontation plans.

### Implementation Metadata

```yaml
drop_slug: gatehouse-readiness-check
review_queue: faction
```

## Dead Drop: Foundry Repair Spark

**Slug:** `foundry-repair-spark`  
**Loop:** Faction Floors  
**Faction:** Daedalus Foundry  
**Drop Type:** repo-relic  
**Difficulty:** regular  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** Foundry Bench Spark relic, +5 Forge reputation if approved  

### Player Prompt

Submit a safe repair, self-hosting, accessibility, documentation, or public-interest tool/resource with a summary of why it helps.

### Submission Type

url-plus-summary

### Success Text

Mara Kallix files it under tools that open exits instead of cages.

### Failure / Revision Text

The Foundry shutters the spark. Revise for safety, legality, and usefulness.

### Lore Note

Documentation is divine because tools must survive contact with reality.

### Safety Note

No harmful repos, weapon designs, exploit chains, illegal access, credential theft, or malware.

### Implementation Metadata

```yaml
drop_slug: foundry-repair-spark
review_queue: forge
```

## Dead Drop: Rat Nest Wall Line

**Slug:** `rat-nest-wall-line`  
**Loop:** Faction Floors  
**Faction:** Styx Rats  
**Drop Type:** zine-line  
**Difficulty:** initiate  
**Repeatability:** daily  
**Review Required:** true  
**Reward:** Rat Nest Regular badge progress, +2 Community reputation if approved  

### Player Prompt

Leave one fictional wall line for the Rat Nest. Make it sharp, strange, joyful, and safe.

### Submission Type

short-text

### Success Text

Rhea Spite would probably pretend not to like it. The wall keeps it anyway.

### Failure / Revision Text

The Rats slap a revision sticker over it: punch up, not at the vulnerable.

### Lore Note

The Rats weaponize morale, not harassment.

### Safety Note

No slurs, threats, targeted abuse, or real-world vandalism instructions.

### Implementation Metadata

```yaml
drop_slug: rat-nest-wall-line
review_queue: community
```

## Dead Drop: Command Layer Witness Mark

**Slug:** `command-layer-witness-mark`  
**Loop:** Faction Floors  
**Faction:** Chthonic Uprising  
**Drop Type:** lore-fragment  
**Difficulty:** relic  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Chthonic Mark Witness badge, Five Seeds Beneath the Gate lore  

### Player Prompt

Read the Command Layer fragment and mark the five-cell doctrine remembered.

### Submission Type

no-submission-read-only

### Success Text

The black pomegranate splits. Five seeds glow: survival, signal, force, invention, rupture.

### Failure / Revision Text

The Command Layer remains closed.

### Lore Note

The Archivist coordinates, preserves, routes, and remembers. The Uprising is collective.

### Safety Note

Fictional lore and recognition only.

### Implementation Metadata

```yaml
drop_slug: command-layer-witness-mark
owner_controlled_lore: true
```

## Dead Drop: Bone Index Tab

**Slug:** `bone-index-tab`  
**Loop:** Archive Terminal  
**Faction:** Chthonic Uprising  
**Drop Type:** archive-artifact  
**Difficulty:** regular  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Bone Index Tab relic  

### Player Prompt

Read three Archive Terminal fragments and identify which one references the Dead Index.

### Submission Type

multiple-choice

### Success Text

A bone-white tab slides from the shelf. It is warm, which is worse than cold.

### Failure / Revision Text

The shelf remains sealed. Re-read the fragments.

### Lore Note

The Archive reveals itself through careful reading, not extraction.

### Safety Note

Read-only archive puzzle.

### Implementation Metadata

```yaml
drop_slug: bone-index-tab
requires_archive_reads: 3
```

## Dead Drop: Memory Has Teeth

**Slug:** `memory-has-teeth`  
**Loop:** Archive Terminal  
**Faction:** Chthonic Uprising  
**Drop Type:** lore-fragment  
**Difficulty:** regular  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Memory Has Teeth lore fragment  

### Player Prompt

Read the recovered fragment and mark it remembered.

### Submission Type

no-submission-read-only

### Success Text

The Archive bites the dark, not you. Memory has teeth because forgetting was the weapon.

### Failure / Revision Text

The fragment waits.

### Lore Note

The Archive is not passive storage. It is protective memory.

### Safety Note

Fictional lore only.

### Implementation Metadata

```yaml
drop_slug: memory-has-teeth
unlocks_lore: memory-has-teeth
```

## Dead Drop: Repo Relic Without Teeth

**Slug:** `repo-relic-without-teeth`  
**Loop:** Archive Terminal  
**Faction:** Daedalus Foundry  
**Drop Type:** repo-relic  
**Difficulty:** regular  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** Repo Relic Mark, +5 Forge reputation if approved  

### Player Prompt

Submit or summarize a safe public repository, guide, or tool related to repair, accessibility, open knowledge, self-hosting, documentation, or community infrastructure.

### Submission Type

url-plus-summary

### Success Text

The Archive receives the relic and checks it for teeth.

### Failure / Revision Text

The relic bites wrong. Remove unsafe content or choose a safer source.

### Lore Note

A repo relic is remembered for usefulness, not danger.

### Safety Note

No malware, exploit tools, credential theft, surveillance tools, or illegal instructions.

### Implementation Metadata

```yaml
drop_slug: repo-relic-without-teeth
review_queue: forge
```

## Dead Drop: Ghost in Tech Reading Room

**Slug:** `ghost-in-tech-reading-room`  
**Loop:** Archive Terminal  
**Faction:** Oracular Circuit  
**Drop Type:** community-question  
**Difficulty:** initiate  
**Repeatability:** weekly  
**Review Required:** false  
**Reward:** Ghost in Tech Runner badge progress  

### Player Prompt

Read a Ghost in Tech entry and choose which safe theme it best represents: repair, privacy, accessibility, open knowledge, archive memory, or creative infrastructure.

### Submission Type

multiple-choice

### Success Text

The ghost in the machine stops rattling long enough to be indexed.

### Failure / Revision Text

The Archive asks you to read again.

### Lore Note

Categorizing memory is a form of care.

### Safety Note

No external submission required.

### Implementation Metadata

```yaml
drop_slug: ghost-in-tech-reading-room
action_type: VISIT_ARCHIVE
```

## Dead Drop: State of Affairs Scout

**Slug:** `state-of-affairs-scout`  
**Loop:** Archive Terminal  
**Faction:** Chthonic Uprising  
**Drop Type:** field-note  
**Difficulty:** regular  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** State of Affairs Scout badge progress, +3 Archive reputation if approved  

### Player Prompt

Write a brief, fictionalized civic-memory reflection inspired by a public-interest issue, without naming real living political figures or making real-world allegations.

### Submission Type

long-text

### Success Text

The Archive stores the reflection as myth-tech civic memory.

### Failure / Revision Text

Revise to fictionalize, remove direct real-world targeting, and keep the focus on systems.

### Lore Note

The Archive transforms civic anxiety into mythic infrastructure without creating direct one-to-one targets.

### Safety Note

No real living political figure portrayals, defamation-like claims, targeting, or calls for harm.

### Implementation Metadata

```yaml
drop_slug: state-of-affairs-scout
review_queue: lore
```

## Dead Drop: Public Signal, Private Names

**Slug:** `public-signal-private-names`  
**Loop:** Archive Terminal  
**Faction:** Asclepian Veil  
**Drop Type:** resource-link  
**Difficulty:** regular  
**Repeatability:** weekly  
**Review Required:** true  
**Reward:** +5 Archive or Accessibility reputation if approved  

### Player Prompt

Submit a public-interest educational resource and summarize it without exposing private people, private locations, or sensitive personal details.

### Submission Type

url-plus-summary

### Success Text

The Archive indexes the signal and seals the names that never needed to be public.

### Failure / Revision Text

The Archive refuses the signal until privacy is restored.

### Lore Note

Privacy is not the enemy of memory. It is how memory avoids becoming a weapon.

### Safety Note

No private data, doxxing, crisis details, or sensitive personal claims.

### Implementation Metadata

```yaml
drop_slug: public-signal-private-names
review_queue: archive
```

## Dead Drop: The Archive Shelf That Moved

**Slug:** `the-archive-shelf-that-moved`  
**Loop:** Archive Terminal  
**Faction:** Chthonic Uprising  
**Drop Type:** lore-fragment  
**Difficulty:** adept  
**Repeatability:** one-time  
**Review Required:** false  
**Reward:** Dead Index Trace progress  

### Player Prompt

Read the moving shelf fragment and answer what the Archive protects first: spectacle, memory, hierarchy, or privacy.

### Submission Type

multiple-choice

### Success Text

The shelf slides aside. Behind it, a redacted dawn is waiting.

### Failure / Revision Text

The shelf returns to its old position. Choose the doctrine that protects people.

### Lore Note

The Archive protects memory and privacy together.

### Safety Note

Lore/safety doctrine check.

### Implementation Metadata

```yaml
drop_slug: the-archive-shelf-that-moved
unlocks_progress: dead-index-trace
```

## Room Action Metadata

| Action Type | Player-Facing Label | Common Rooms | Submission Type | Review Required | Field Log Behavior | Reward Behavior |
|---|---|---|---|---|---|---|
| `READ_SIGNAL` | Read Signal | All rooms | no-submission-read-only / multiple-choice | Usually no | Log safe read action | Small rep, badge progress, lore unlock |
| `POST_FIELD_NOTE` | Post Field Note | Town Square, Gatehouse | short-text / long-text | Sometimes | Log after submission or approval | Community rep, badge progress |
| `SUBMIT_DEAD_DROP` | Submit Dead Drop | Dead Drop Terminal, rooms | varies | Depends on drop type | Log after completion/approval | Loot, rep, lore |
| `SOLVE_CIPHER` | Solve Cipher | Oracular Relay | cipher-answer | No, if answer-checkable | Log solved cipher | Cipher rep, badge progress |
| `SUBMIT_RESOURCE` | Submit Resource | Archive, Dead Drops, Faction Floors | url-plus-summary | Yes | Log after approval | Archive/Forge rep, loot |
| `VISIT_ARCHIVE` | Visit Archive | Town Square, Archive, Relay | no-submission-read-only | No | Log read/browse action | Archive rep, lore progress |
| `JOIN_DISCUSSION` | Join Discussion | Town Square, Archive, Factions | long-text | Sometimes | Log after safe post/approval | Community rep |
| `OFFER_HELP` | Offer Help | Dead Drops, Factions | short-text / long-text | Yes | Log after approval | Community/Faction rep |
| `CREATE_LORE_FRAGMENT` | Create Lore Fragment | Dead Drops, Relay, Archive | long-text | Yes | Log after approval | Lore rep, recognition |
| `SUBMIT_ACCESSIBILITY_NOTE` | Submit Accessibility Note | Black Clinic, Gatehouse, Archive | long-text | Yes | Log after approval | Accessibility rep, badges |
| `SUBMIT_NET_NEIGHBOR` | Submit Net Neighbor | Town Square, Rat Nest | url-plus-summary | Yes | Log after approval | Community rep, banner parts |
| `REQUEST_GUILD` | Request Guild | Faction Floors | long-text | Yes | Private/guild-only until approved | Guild progression |

## Implementation Metadata Reference

```yaml
underwatch-town-square:
  slug: underwatch-town-square
  route: /mmo/rooms/underwatch-town-square
  room_type: social-hub
  primary_faction: chthonic-uprising
  access_level: logged-in
  mvp_priority: phase-1
  replayability: always-available
  estimated_session_time: 3-10-minutes
  connected_dead_drops:
    - the-first-field-note
    - commons-signal-check
    - the-square-that-was-never-square
    - net-neighbor-lantern
  primary_rewards:
    - underwatch-pass
    - signal-board-stamp
    - commons-spark-hex
  field_log_templates:
    - "{player} entered the Underwatch Town Square."
    - "{player} read the Signal Board."

dead-drop-terminal:
  slug: dead-drop-terminal
  routes:
    - /mmo/dead-drops
    - /mmo/dead-drops/[dropSlug]
  room_type: dead-drop-hub
  primary_faction: chthonic-uprising
  access_level: approved-user
  mvp_priority: phase-1
  replayability:
    - daily
    - weekly
    - rotating
    - repeatable-with-cooldown
  estimated_session_time: 5-15-minutes
  connected_dead_drops:
    - static-under-the-coin-slot
    - cracked-cache-key
    - useful-signal-safely-named
    - one-sentence-for-the-wall
    - care-package-without-coordinates
    - the-first-dead-index
    - zine-line-for-a-tired-ghost
  primary_rewards:
    - static-courier
    - cracked-cache-key
    - dead-drop-terminal-frame

oracular-relay:
  slug: oracular-relay
  routes:
    - /mmo/rooms/oracular-relay
    - /ciphers
  room_type: cipher-hub
  primary_faction: oracular-circuit
  access_level: logged-in
  mvp_priority: phase-1
  replayability:
    - rotating
    - repeatable-with-cooldown
  estimated_session_time: 5-20-minutes
  connected_dead_drops:
    - violet-static-primer
    - false-omen-corrected
    - three-keys-beneath-delphi
    - hint-without-shame
  primary_rewards:
    - signal-reader
    - bent-oracle-key
    - violet-relay-border
    - oracular-static

faction-floors:
  slug: faction-floors
  routes:
    - /mmo/factions
    - /mmo/factions/[factionSlug]/floor
  room_type: faction-floor
  primary_faction: chthonic-uprising
  access_level: logged-in
  deeper_action_access_level: approved-user
  mvp_priority: phase-2
  replayability:
    - always-available
    - weekly-faction-calls
  estimated_session_time: 5-20-minutes
  floors:
    asclepian-veil: black-clinic
    oracular-circuit: signal-chapel
    myrmidon-grinders: gatehouse
    daedalus-foundry: foundry-bench
    styx-rats: rat-nest
    chthonic-uprising: command-layer
  connected_dead_drops:
    - black-clinic-intake-card
    - signal-chapel-listening-test
    - gatehouse-readiness-check
    - foundry-repair-spark
    - rat-nest-wall-line
    - command-layer-witness-mark

archive-terminal:
  slug: archive-terminal
  routes:
    - /mmo/rooms/archive-terminal
    - /archive
    - /archive/state-of-affairs
    - /archive/ghost-in-tech
  room_type: archive-hub
  primary_faction: chthonic-uprising
  access_level: logged-in
  submission_access_level: approved-user
  mvp_priority: phase-2
  replayability:
    - always-available
    - weekly-archive-prompts
  estimated_session_time: 5-25-minutes
  connected_dead_drops:
    - bone-index-tab
    - memory-has-teeth
    - repo-relic-without-teeth
    - ghost-in-tech-reading-room
    - state-of-affairs-scout
    - public-signal-private-names
    - the-archive-shelf-that-moved
  primary_rewards:
    - archive-witness
    - bone-index-tab
    - archive-terminal-background
    - memory-has-teeth
```

## Future Expansion Hooks

### Guilds and Cells

The Faction Floors can expand into guild-like player cells with approved membership, private Field Logs, guild banners, shared projects, room upgrades, and steward roles.

### Profile World Integration

Loot can unlock Profile World modules: Badge Case, Relic Zone, Archive Shelf, Signal Player, faction room backdrop, old-web widgets, and Net Neighbor banner strips.

### Seasonal Signals

Dead Drops can rotate as seasonal signal sets tied to archive themes, faction calls, lore events, or community build weeks.

### Event Rooms

Temporary rooms can appear for zine jams, cipher weeks, archive drives, repair challenges, accessibility audits, and lore sprints.

### Steward Review Roles

Trusted players can eventually review safe categories: archive signals, accessibility notes, zine lines, repo relics, and lore fragments. Moderators and admins retain reversal power.

### Lore Chain Progression

Individual Dead Drops can become lore chains: The First Dead Index, Oracular Static, Memory Has Teeth, Five Seeds Beneath the Gate, and The Child of the Underworld Who Dreams of Sunlight.

### Net Neighbor Webring

Net Neighbor leads can become an old-web webring layer with banners, profile stamps, public-interest summaries, and safety-reviewed outbound links.

### Faction Reputation Standing

Faction reputation can unlock titles, floor cosmetics, faction prompts, room access marks, and steward nominations without creating combat dominance.

### Archive Collections

Archive Terminal entries can group into collections: State of Affairs, Ghost in Tech, Repo Relics, Dead Index Traces, Care Infrastructure, Repair Culture, Cipher Doctrine, and Solarpunk Commons.

### Solarpunk Commons Layer

Later loops should reveal the future the Uprising is fighting toward: public clinics, rooftop gardens, mesh internet, repair culture, libraries, open knowledge, chosen-family safety, disability justice, worker dignity, privacy-respecting tech, playful public art, and cities built for life instead of extraction.
