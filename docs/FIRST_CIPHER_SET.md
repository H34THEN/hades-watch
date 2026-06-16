# First Cipher Set: C1PH3R CR4K3R Initiation

## Overview

This document is the canonical source for the first five playable Hades Watch Cipher missions for:

```txt
https://hadeswatch.com/ciphers
```

The first cipher set introduces players to the Hades Watch Cipher system through beginner-to-intermediate puzzle missions. These missions are fictional decoding challenges framed as underworld transmissions, Dead Index fragments, Oracular Circuit training puzzles, Archivist initiation signals, technomythic relics, and safe digital literacy exercises.

The umbrella progression title is:

```txt
C1PH3R CR4K3R
```

The first five ciphers are designed to teach players that a cipher may be solved through observation, pattern recognition, simple transformation, extraction, symbolic logic, and layered decoding. The player is not asked to hack, bypass, stalk, gather real-world information, download files, run commands, exploit systems, provide credentials, or interact with third-party sites.

The Oracular Circuit presents these missions as sanctioned training relics. The Archivist records completed solves as proof that the operative can listen through noise without becoming the noise.

---

## Safety and Nonviolence Policy

These ciphers are fictional puzzle-game decoding exercises only.

They must not:

* teach illegal hacking
* involve bypassing systems
* request real credentials
* ask for private information
* involve doxxing or stalking
* include unsafe protest tactics
* include weapons or combat goals
* include medical advice
* include instructions for evasion, sabotage, malware, or harm
* require command-line use
* require third-party websites
* require downloads
* require real-world target research
* require real names, addresses, phone numbers, passwords, tokens, emails, or private records

The Oracular Circuit may sound like hackers in lore, but this cipher set is strictly about fictional puzzle literacy, pattern recognition, and safe decoding play.

The Chthonic Uprising does not ask new operatives to prove loyalty through danger. It asks them to prove they can pay attention.

---

## Gameplay Assumptions

The Cipher area of the website is assumed to allow approved users to:

* view available ciphers
* read puzzle text
* submit an answer
* receive success or failure feedback
* unlock a badge when solved
* progress through a badge chain
* optionally unlock lore snippets

General answer handling assumptions:

* answers should be normalized to lowercase
* leading and trailing spaces should be trimmed
* punctuation may be ignored where noted
* accepted answer variants should be supported where listed
* answers should not require external tools beyond human reasoning
* all puzzle content needed to solve the cipher must appear in the cipher entry itself

Visibility for all five ciphers:

```txt
approved-users
```

Repeatability for all five ciphers:

```txt
false
```

---

## Badge Progression Overview

The first five cipher missions unlock the C1PH3R CR4K3R badge chain.

| Cipher | Badge Slug | Badge Tier | Training Meaning |
|---|---|---:|---|
| Cipher 1 | `c1ph3r-cr4k3r-initiate` | Initiate | The player proves they can decode a simple hidden signal. |
| Cipher 2 | `c1ph3r-cr4k3r-signal-reader` | Reader | The player proves they can find a signal inside noise. |
| Cipher 3 | `c1ph3r-cr4k3r-index-scribe` | Scribe | The player proves they can translate machine-shaped text. |
| Cipher 4 | `c1ph3r-cr4k3r-oracle-key` | Keyholder | The player proves they can reconstruct calm from disorder. |
| Cipher 5 | `c1ph3r-cr4k3r-dead-index-adept` | Adept | The player proves they can solve a layered Dead Index handshake. |

Badge visual style:

* square profile badge
* cyberpunk underworld glyph
* readable at small size
* Oracular Circuit blue and violet for early badges
* Dead Index black, bone, and red for the final badge
* no copyrighted symbols
* no real organization logos
* no real government, police, military, or corporate insignia

---

## Cipher 1: The First Gate Whispers

**Slug:** `the-first-gate-whispers`  
**Faction:** `The Oracular Circuit`  
**Secondary Faction:** `Chthonic Uprising`  
**Difficulty:** `Beginner`  
**Cipher Type:** `Caesar shift`  
**Estimated Time:** `3-5 minutes`  
**Repeatable:** `false`  
**Visibility:** `approved-users`  
**Reward Badge:** `c1ph3r-cr4k3r-initiate`  
**Lore Unlock:** `lore-cipher-first-gate-whispers`

### Player Brief

A black-channel transmission flickers across the Underwatch terminal. The Oracular Circuit marks it as safe for new operatives. The Archivist has left only one instruction in the margin:

Decode the whisper. Do not force the gate. Listen until the letters move.

### Puzzle Text

```txt
WKH ILUVW JDWH VD\V: UHPHPEHU
```

### Submission Prompt

Enter the word spoken by the First Gate.

### Hints

**Hint 1:**  
The letters are not random. They have all moved by the same amount.

**Hint 2:**  
This is a Caesar shift. The Surface loves straight lines. The underworld walks them backward.

**Final Hint:**  
Shift each letter three places backward in the alphabet.

### Correct Answer

```txt
remember
```

### Accepted Answer Variants

```txt
remember
REMEMBER
Remember
```

### Explanation

The puzzle uses a Caesar shift of 3. Each encrypted letter is shifted three positions forward from the original message. Shifting the letters backward reveals:

```txt
THE FIRST GATE SAYS: REMEMBER
```

The answer is:

```txt
remember
```

### Success Message

The gate hears you. The Archivist records your first signal: what the surface buries, the underworld remembers.

### Failure Message

The gate does not open yet. Try shifting the letters backward through the alphabet.

### Badge Awarded

* **Name:** C1PH3R CR4K3R Initiate
* **Slug:** `c1ph3r-cr4k3r-initiate`
* **Tier:** Initiate
* **Visual Concept:** A small blue-violet underworld gate glyph cracked open by a single signal line, with one black pomegranate seed at the threshold.

### Lore Notes

Unlocks a short Dead Index note:

```txt
Dead Index Fragment C1-001:
The first lesson was never secrecy.
It was memory.
A name preserved is a door the Surface cannot fully seal.
```

### Implementation Notes

Normalize answer to lowercase. Trim whitespace. Punctuation is not relevant. The canonical answer is `remember`.

---

## Cipher 2: Sticker Wall Static

**Slug:** `sticker-wall-static`  
**Faction:** `The Oracular Circuit`  
**Secondary Faction:** `Styx Rats`  
**Difficulty:** `Beginner+`  
**Cipher Type:** `Acrostic / first-letter extraction`  
**Estimated Time:** `5-7 minutes`  
**Repeatable:** `false`  
**Visibility:** `approved-users`  
**Reward Badge:** `c1ph3r-cr4k3r-signal-reader`  
**Lore Unlock:** `lore-cipher-sticker-wall-static`

### Player Brief

A Styx Rat zine wall was photographed before Surface cleaners could paint over it. Most of the slogans are noise, jokes, half-torn stickers, and old grief sharpened into color. Cassian Nyx marks one strip with an Oracular Circuit sigil:

The message is not in what the wall says. It is in where each line begins.

### Puzzle Text

```txt
Static eats the palace screens.
Ink survives under rain.
Ghosts paste jokes on tyrant doors.
No mural dies if one witness remembers.
Ash becomes pigment after midnight.
Lanterns bloom in the tunnel.
```

### Submission Prompt

Enter the hidden signal word.

### Hints

**Hint 1:**  
The wall is loud. Read the edges.

**Hint 2:**  
Look at the first letter of each line.

**Final Hint:**  
Take the first letter from all six lines, top to bottom.

### Correct Answer

```txt
signal
```

### Accepted Answer Variants

```txt
signal
SIGNAL
Signal
```

### Explanation

This is an acrostic puzzle. Taking the first letter of each line gives:

```txt
S
I
G
N
A
L
```

The hidden word is:

```txt
signal
```

### Success Message

The static parts. The wall grins back. You found the signal without silencing the song.

### Failure Message

The message is still hidden in plain sight. Try reading the first marks of the wall.

### Badge Awarded

* **Name:** C1PH3R CR4K3R Signal Reader
* **Slug:** `c1ph3r-cr4k3r-signal-reader`
* **Tier:** Reader
* **Visual Concept:** A violet signal glyph emerging from layered sticker scraps, with a blue static halo and a tiny rat-tail curve worked into the border.

### Lore Notes

Unlocks a short Styx Rats transmission:

```txt
Styx Rats Field Note C1-002:
A joke can carry a key.
A sticker can hold a map.
A wall can become an oracle if enough erased people write back.
```

### Implementation Notes

Normalize answer to lowercase. Trim whitespace. Punctuation is not relevant. The canonical answer is `signal`.

---

## Cipher 3: The Foundry Says Hello

**Slug:** `the-foundry-says-hello`  
**Faction:** `The Oracular Circuit`  
**Secondary Faction:** `Daedalus Foundry`  
**Difficulty:** `Intermediate`  
**Cipher Type:** `Hex to ASCII`  
**Estimated Time:** `7-10 minutes`  
**Repeatable:** `false`  
**Visibility:** `approved-users`  
**Reward Badge:** `c1ph3r-cr4k3r-index-scribe`  
**Lore Unlock:** `lore-cipher-foundry-says-hello`

### Player Brief

A Daedalus Foundry relay box was recovered from a flooded maintenance spine under the Bronze Gate. Its casing is stamped with a maker’s mark, but the screen shows only paired symbols.

Mara Kallix left a note for new operatives:

Machines do not always speak in words first. Sometimes they hand you numbers and wait to see if you can be kind to them.

### Puzzle Text

```txt
46 4F 52 47 45
```

### Submission Prompt

Enter the word spoken by the Foundry relic.

### Hints

**Hint 1:**  
The message is made of five pairs.

**Hint 2:**  
These pairs are hexadecimal values.

**Final Hint:**  
Convert each hex pair to its ASCII character.

### Correct Answer

```txt
forge
```

### Accepted Answer Variants

```txt
forge
FORGE
Forge
the forge
```

### Explanation

Each pair is a hexadecimal ASCII value:

```txt
46 = F
4F = O
52 = R
47 = G
45 = E
```

Together, the machine says:

```txt
FORGE
```

The answer is:

```txt
forge
```

### Success Message

The relay warms in your hand. Somewhere below the Surface, a hidden workshop light turns on.

### Failure Message

The relic keeps blinking in pairs. Try treating each pair as a machine-readable character.

### Badge Awarded

* **Name:** C1PH3R CR4K3R Index Scribe
* **Slug:** `c1ph3r-cr4k3r-index-scribe`
* **Tier:** Scribe
* **Visual Concept:** A blue-violet hex grid folding into a small bronze forge mark, with an archive stylus crossing a circuit line.

### Lore Notes

Unlocks a Daedalus Foundry note:

```txt
Foundry Recovery Tag C1-003:
A tool is not holy because it is old.
A tool is holy when it opens a future.
The relay said FORGE.
The workers answered: together.
```

### Implementation Notes

Normalize answer to lowercase. Trim whitespace. Ignore the optional leading word `the` if submitted as `the forge`. The canonical answer is `forge`.

---

## Cipher 4: Veil Order Triage

**Slug:** `veil-order-triage`  
**Faction:** `The Oracular Circuit`  
**Secondary Faction:** `Asclepian Veil`  
**Difficulty:** `Intermediate`  
**Cipher Type:** `Symbolic sequence reconstruction`  
**Estimated Time:** `8-12 minutes`  
**Repeatable:** `false`  
**Visibility:** `approved-users`  
**Reward Badge:** `c1ph3r-cr4k3r-oracle-key`  
**Lore Unlock:** `lore-cipher-veil-order-triage`

### Player Brief

An Asclepian Veil training slate was found inside a static veil. It is not medical instruction. It is not emergency advice. It is a symbolic ordering exercise used to teach new operatives how care infrastructure thinks under pressure:

First, calm the channel.  
Then, find the pattern.  
Then, hold the living signal steady.

The slate contains scrambled fragments. Put the care-word back together by following the numbered pulses.

### Puzzle Text

```txt
Pulse 4: B
Pulse 1: S
Pulse 7: I
Pulse 3: A
Pulse 9: E
Pulse 2: T
Pulse 6: L
Pulse 5: I
Pulse 8: Z
```

### Submission Prompt

Enter the reconstructed care-word.

### Hints

**Hint 1:**  
The pulses are out of order.

**Hint 2:**  
Sort the fragments by pulse number.

**Final Hint:**  
Read Pulse 1 through Pulse 9 in order.

### Correct Answer

```txt
stabilize
```

### Accepted Answer Variants

```txt
stabilize
STABILIZE
Stabilize
stabilise
```

### Explanation

Sort the pulse fragments by number:

```txt
Pulse 1: S
Pulse 2: T
Pulse 3: A
Pulse 4: B
Pulse 5: I
Pulse 6: L
Pulse 7: I
Pulse 8: Z
Pulse 9: E
```

Together they spell:

```txt
STABILIZE
```

The answer is:

```txt
stabilize
```

The accepted variant `stabilise` is included for alternate English spelling.

### Success Message

The static veil steadies. The Oracular Circuit marks your solve as calm, careful, and clean.

### Failure Message

The word is still scrambled. Sort the pulses before reading them.

### Badge Awarded

* **Name:** C1PH3R CR4K3R Oracle Key
* **Slug:** `c1ph3r-cr4k3r-oracle-key`
* **Tier:** Keyholder
* **Visual Concept:** A blue-violet oracle key crossing a soft green veil pulse, with a small bone-white care glyph at the center.

### Lore Notes

Unlocks an Asclepian Veil note:

```txt
Veil Teaching Fragment C1-004:
Care is not panic dressed as virtue.
Care is sequence, consent, breath, witness, and return.
The living signal must never be treated as disposable noise.
```

### Implementation Notes

Normalize answer to lowercase. Trim whitespace. Accept both `stabilize` and `stabilise`. This puzzle is symbolic and educational, not medical advice.

---

## Cipher 5: Dead Index Handshake

**Slug:** `dead-index-handshake`  
**Faction:** `The Oracular Circuit`  
**Secondary Faction:** `Chthonic Uprising / Archivist`  
**Difficulty:** `Intermediate`  
**Cipher Type:** `Two-layer cipher: first-letter extraction, then Caesar shift`  
**Estimated Time:** `10-15 minutes`  
**Repeatable:** `false`  
**Visibility:** `approved-users`  
**Reward Badge:** `c1ph3r-cr4k3r-dead-index-adept`  
**Lore Unlock:** `lore-cipher-dead-index-handshake`

### Player Brief

The final initiation relic arrives as a ghost packet from the Dead Index. It is wrapped in static and stamped with the Archivist’s black pomegranate mark.

Cassian Nyx leaves one note:

First find the hidden line.  
Then walk it backward through the gate.

The Archivist leaves another:

No ghost goes uncounted. No god goes unwatched.

### Puzzle Text

```txt
Sable terminals hum beneath the old courts.
Rusted channels carry a softer witness.
Pale lanterns guide the erased below.
Hollow gates remember every name.
Jade static gathers around the pomegranate gate.
Underwatch ghosts tap once on the black glass.
Drowned archives answer anyway.
Quiet engines fail to count the dead.
Ashen prayers move through the wire.
White noise bends around the index.
Embers wait behind the locked gate.
```

### Submission Prompt

Enter the final handshake word.

### Hints

**Hint 1:**  
The first layer is hidden at the beginning of each line.

**Hint 2:**  
After extracting the first letters, the result is still shifted.

**Final Hint:**  
Take the first letter of every line, then shift each extracted letter three places backward.

### Correct Answer

```txt
pomegranate
```

### Accepted Answer Variants

```txt
pomegranate
POMEGRANATE
Pomegranate
the pomegranate
black pomegranate
```

### Explanation

First, extract the first letter of every line:

```txt
S R P H J U D Q D W H
```

This produces:

```txt
SRPHJUDQDWH
```

Then apply a Caesar shift of 3 backward:

```txt
S -> P
R -> O
P -> M
H -> E
J -> G
U -> R
D -> A
Q -> N
D -> A
W -> T
H -> E
```

Together, these letters decode to:

```txt
POMEGRANATE
```

The answer is:

```txt
pomegranate
```

### Success Message

The black channel opens. The Dead Index accepts your handprint in static, bone, and red seed-light.

### Failure Message

The handshake has two locks. Find the first letters, then shift them backward.

### Badge Awarded

* **Name:** C1PH3R CR4K3R Dead Index Adept
* **Slug:** `c1ph3r-cr4k3r-dead-index-adept`
* **Tier:** Adept
* **Visual Concept:** A black square badge with a bone-white Dead Index eye, pomegranate-red seed constellation, and a violet circuit halo closing into a key glyph.

### Lore Notes

Unlocks a Dead Index fragment:

```txt
Dead Index Fragment C1-005:
The pomegranate gate does not open for power.
It opens for witness.
It opens for those who can hold a signal without owning it.
It opens for the ones who remember that the archive is not a throne.
It is a shelter with teeth.
```

### Implementation Notes

Normalize answer to lowercase. Trim whitespace. Ignore punctuation. Accept optional leading words in listed variants. The canonical answer is `pomegranate`.

---

# C1PH3R CR4K3R Badge Chain

## C1PH3R CR4K3R Initiate

**Slug:** `c1ph3r-cr4k3r-initiate`  
**Tier:** Initiate  
**Faction:** `The Oracular Circuit`  
**Unlocked By:** Solving `the-first-gate-whispers`  
**Profile Display Category:** `Ciphers`  
**Description:** Awarded to operatives who decode their first sanctioned Oracular Circuit transmission.  
**Visual Concept:** Square profile badge with a blue-violet underworld gate glyph cracked open by one signal line and a tiny black pomegranate seed at the threshold.  
**Flavor Text:** The first gate did not ask for strength. It asked you to remember.

## C1PH3R CR4K3R Signal Reader

**Slug:** `c1ph3r-cr4k3r-signal-reader`  
**Tier:** Reader  
**Faction:** `The Oracular Circuit`  
**Unlocked By:** Solving `sticker-wall-static`  
**Profile Display Category:** `Ciphers`  
**Description:** Awarded to operatives who can find a hidden signal inside noise, art, and public static.  
**Visual Concept:** Square profile badge with a violet signal glyph emerging from layered sticker scraps, blue static texture, and a subtle Styx Rat curve along the edge.  
**Flavor Text:** Static is only silence to those who never learned where to look.

## C1PH3R CR4K3R Index Scribe

**Slug:** `c1ph3r-cr4k3r-index-scribe`  
**Tier:** Scribe  
**Faction:** `The Oracular Circuit`  
**Unlocked By:** Solving `the-foundry-says-hello`  
**Profile Display Category:** `Ciphers`  
**Description:** Awarded to operatives who translate machine-shaped text into readable underworld speech.  
**Visual Concept:** Square profile badge with a blue-violet hex grid folding into a bronze forge mark, crossed by a bone-white archive stylus.  
**Flavor Text:** The machine spoke in pairs. You answered in witness.

## C1PH3R CR4K3R Oracle Key

**Slug:** `c1ph3r-cr4k3r-oracle-key`  
**Tier:** Keyholder  
**Faction:** `The Oracular Circuit`  
**Unlocked By:** Solving `veil-order-triage`  
**Profile Display Category:** `Ciphers`  
**Description:** Awarded to operatives who reconstruct meaning from disorder without panic, harm, or force.  
**Visual Concept:** Square profile badge with a blue-violet oracle key crossing a soft green veil pulse, with a small bone-white care glyph at the center.  
**Flavor Text:** A key is not always metal. Sometimes it is sequence. Sometimes it is calm.

## C1PH3R CR4K3R Dead Index Adept

**Slug:** `c1ph3r-cr4k3r-dead-index-adept`  
**Tier:** Adept  
**Faction:** `The Oracular Circuit / Chthonic Uprising`  
**Unlocked By:** Solving `dead-index-handshake`  
**Profile Display Category:** `Ciphers`  
**Description:** Awarded to operatives who complete the first layered Dead Index handshake and earn recognition from the Archivist.  
**Visual Concept:** Square profile badge with a black field, bone-white Dead Index eye, pomegranate-red seed constellation, and violet circuit halo closing into a key glyph.  
**Flavor Text:** You did not break the lock. You listened until it trusted you.

---

# Answer Key

This section is intentionally explicit so answers can be hashed or seeded later.

| Cipher Slug | Canonical Answer | Accepted Variants | Normalization Notes |
|---|---|---|---|
| `the-first-gate-whispers` | `remember` | `remember`, `REMEMBER`, `Remember` | Lowercase, trim spaces. |
| `sticker-wall-static` | `signal` | `signal`, `SIGNAL`, `Signal` | Lowercase, trim spaces. |
| `the-foundry-says-hello` | `forge` | `forge`, `FORGE`, `Forge`, `the forge` | Lowercase, trim spaces, optionally ignore leading `the`. |
| `veil-order-triage` | `stabilize` | `stabilize`, `STABILIZE`, `Stabilize`, `stabilise` | Lowercase, trim spaces, accept US and UK spelling. |
| `dead-index-handshake` | `pomegranate` | `pomegranate`, `POMEGRANATE`, `Pomegranate`, `the pomegranate`, `black pomegranate` | Lowercase, trim spaces, optionally ignore leading `the` or `black` only if exact listed variant. |

---

# Implementation Metadata Table

| Order | Title | Slug | Difficulty | Cipher Type | Primary Faction | Secondary Faction | Badge Slug | Lore Unlock | Visibility | Repeatable |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | The First Gate Whispers | `the-first-gate-whispers` | Beginner | Caesar shift | The Oracular Circuit | Chthonic Uprising | `c1ph3r-cr4k3r-initiate` | `lore-cipher-first-gate-whispers` | `approved-users` | `false` |
| 2 | Sticker Wall Static | `sticker-wall-static` | Beginner+ | Acrostic / first-letter extraction | The Oracular Circuit | Styx Rats | `c1ph3r-cr4k3r-signal-reader` | `lore-cipher-sticker-wall-static` | `approved-users` | `false` |
| 3 | The Foundry Says Hello | `the-foundry-says-hello` | Intermediate | Hex to ASCII | The Oracular Circuit | Daedalus Foundry | `c1ph3r-cr4k3r-index-scribe` | `lore-cipher-foundry-says-hello` | `approved-users` | `false` |
| 4 | Veil Order Triage | `veil-order-triage` | Intermediate | Symbolic sequence reconstruction | The Oracular Circuit | Asclepian Veil | `c1ph3r-cr4k3r-oracle-key` | `lore-cipher-veil-order-triage` | `approved-users` | `false` |
| 5 | Dead Index Handshake | `dead-index-handshake` | Intermediate | First-letter extraction plus Caesar shift | The Oracular Circuit | Chthonic Uprising / Archivist | `c1ph3r-cr4k3r-dead-index-adept` | `lore-cipher-dead-index-handshake` | `approved-users` | `false` |

---

# Profile Badge Display Notes

The C1PH3R CR4K3R badges should display in the profile or dossier under:

```txt
Ciphers
```

Suggested dossier language:

```txt
Cipher Standing
```

Suggested profile module labels:

```txt
Signal Training
Cipher Record
Oracular Circuit Recognition
Dead Index Puzzle Chain
```

Suggested badge display order:

1. C1PH3R CR4K3R Initiate
2. C1PH3R CR4K3R Signal Reader
3. C1PH3R CR4K3R Index Scribe
4. C1PH3R CR4K3R Oracle Key
5. C1PH3R CR4K3R Dead Index Adept

Suggested badge tooltip pattern:

```txt
Unlocked by solving [Cipher Title].
```

Suggested final badge tooltip:

```txt
Recognized by the Archivist for completing the first Dead Index cipher handshake.
```

---

# Lore Unlock Notes

Lore unlocks should be short, readable, and optional. They should reward completion without locking core site comprehension behind puzzles.

Suggested lore unlock slugs:

| Lore Unlock Slug | Unlocked By | Lore Category | Suggested Title |
|---|---|---|---|
| `lore-cipher-first-gate-whispers` | `the-first-gate-whispers` | Dead Index Fragment | First Gate Whisper |
| `lore-cipher-sticker-wall-static` | `sticker-wall-static` | Styx Rats Field Note | Wall Static Carries |
| `lore-cipher-foundry-says-hello` | `the-foundry-says-hello` | Daedalus Foundry Recovery Tag | The Relay Said Forge |
| `lore-cipher-veil-order-triage` | `veil-order-triage` | Asclepian Veil Teaching Fragment | Sequence Is Care |
| `lore-cipher-dead-index-handshake` | `dead-index-handshake` | Dead Index Fragment | The Pomegranate Gate |

Lore unlocks should reinforce:

* memory as resistance
* care as infrastructure
* signal literacy as self-defense
* puzzle-solving as training, not harm
* the Archivist as keeper of records, not a flawless savior
* the Oracular Circuit as teachers of pattern recognition
* the underworld as a practical, hopeful commons beneath dystopia

---

# Admin and Review Notes

These ciphers are intended for approved users only.

Admin review is not required for successful cipher solves if answers are deterministic and automatically checked. Manual review may be useful only for:

* bug reports
* answer variant requests
* accessibility concerns
* typo reports
* puzzle clarity feedback
* reports of unintended ambiguity

Accessibility notes:

* Avoid relying only on color.
* Puzzle text should be selectable text, not image-only.
* Hints should be available in plain text.
* Users should not be penalized for capitalization.
* Users should not be penalized for leading or trailing spaces.
* The final cipher uses the corrected canonical training packet to avoid ambiguity.

Content safety review:

* No cipher requires external sites.
* No cipher requires code execution.
* No cipher requires real hacking knowledge.
* No cipher requests private data.
* No cipher includes medical advice.
* No cipher includes weapons, combat goals, malware, evasion, credential theft, doxxing, stalking, or real-world targeting.

Final Archivist note for admin flavor:

```txt
Do not make the first lock cruel.
A gate that teaches should open by attention, not humiliation.
The point is not to prove who already knows.
The point is to teach more ghosts how to read the dark.
```
