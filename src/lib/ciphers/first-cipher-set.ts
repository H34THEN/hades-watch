import type { CipherAnswerNormalization } from "@/lib/ciphers/normalize";

export const FIRST_CIPHER_SET_PACK_ID = "first-cipher-set";

export const FIRST_CIPHER_SET_INTRO =
  "Decode the signal. Feed the Dead Index. Earn the mark. These five sanctioned Oracular Circuit training relics teach pattern recognition, extraction, and layered decoding without leaving the puzzle channel.";

export interface FirstCipherBadgeDefinition {
  slug: string;
  name: string;
  tier: string;
  description: string;
  flavorText: string;
  visualConcept: string;
  cipherSlug: string;
  placeholderText: string;
  placeholderColor: string;
  assetPath?: string;
}

export interface FirstCipherDefinition {
  slug: string;
  title: string;
  playerBrief: string;
  puzzleText: string;
  submissionPrompt: string;
  hint1: string;
  hint2: string;
  finalHint: string;
  difficulty: string;
  cipherType: string;
  estimatedTime: string;
  factionSlug: string;
  secondaryFactionSlug: string;
  rewardBadgeSlug: string;
  loreUnlockSlug: string;
  loreUnlockText: string;
  explanation: string;
  successMessage: string;
  failureMessage: string;
  answerNormalization: CipherAnswerNormalization;
  /** Seed-only: plaintext variants for hashing. Never expose to client. */
  acceptedAnswerVariants: string[];
  sortOrder: number;
}

export const FIRST_CIPHER_BADGES: FirstCipherBadgeDefinition[] = [
  {
    slug: "c1ph3r-cr4k3r-initiate",
    name: "C1PH3R CR4K3R Initiate",
    tier: "Initiate",
    description:
      "Awarded to operatives who decode their first sanctioned Oracular Circuit transmission.",
    flavorText: "The first gate did not ask for strength. It asked you to remember.",
    visualConcept:
      "Square profile badge with a blue-violet underworld gate glyph cracked open by one signal line and a tiny black pomegranate seed at the threshold.",
    cipherSlug: "the-first-gate-whispers",
    placeholderText: "INITIATE",
    placeholderColor: "#6B2FD6",
    assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-initiate.png",
  },
  {
    slug: "c1ph3r-cr4k3r-signal-reader",
    name: "C1PH3R CR4K3R Signal Reader",
    tier: "Reader",
    description:
      "Awarded to operatives who can find a hidden signal inside noise, art, and public static.",
    flavorText: "Static is only silence to those who never learned where to look.",
    visualConcept:
      "Square profile badge with a violet signal glyph emerging from layered sticker scraps, blue static texture, and a subtle Styx Rat curve along the edge.",
    cipherSlug: "sticker-wall-static",
    placeholderText: "READER",
    placeholderColor: "#4DA3FF",
    assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-signal-reader.png",
  },
  {
    slug: "c1ph3r-cr4k3r-index-scribe",
    name: "C1PH3R CR4K3R Index Scribe",
    tier: "Scribe",
    description:
      "Awarded to operatives who translate machine-shaped text into readable underworld speech.",
    flavorText: "The machine spoke in pairs. You answered in witness.",
    visualConcept:
      "Square profile badge with a blue-violet hex grid folding into a bronze forge mark, crossed by a bone-white archive stylus.",
    cipherSlug: "the-foundry-says-hello",
    placeholderText: "SCRIBE",
    placeholderColor: "#3D8BFF",
    assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-index-scribe.png",
  },
  {
    slug: "c1ph3r-cr4k3r-oracle-key",
    name: "C1PH3R CR4K3R Oracle Key",
    tier: "Keyholder",
    description:
      "Awarded to operatives who reconstruct meaning from disorder without panic, harm, or force.",
    flavorText: "A key is not always metal. Sometimes it is sequence. Sometimes it is calm.",
    visualConcept:
      "Square profile badge with a blue-violet oracle key crossing a soft green veil pulse, with a small bone-white care glyph at the center.",
    cipherSlug: "veil-order-triage",
    placeholderText: "KEY",
    placeholderColor: "#38F8A8",
    assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-oracle-key.png",
  },
  {
    slug: "c1ph3r-cr4k3r-dead-index-adept",
    name: "C1PH3R CR4K3R Dead Index Adept",
    tier: "Adept",
    description:
      "Awarded to operatives who complete the first layered Dead Index handshake and earn recognition from the Archivist.",
    flavorText: "You did not break the lock. You listened until it trusted you.",
    visualConcept:
      "Square profile badge with a black field, bone-white Dead Index eye, pomegranate-red seed constellation, and violet circuit halo closing into a key glyph.",
    cipherSlug: "dead-index-handshake",
    placeholderText: "ADEPT",
    placeholderColor: "#B1123A",
    assetPath: "/badge-assets/ciphers/c1ph3r-cr4k3r-dead-index-adept.png",
  },
];

export const FIRST_CIPHER_PUZZLES: FirstCipherDefinition[] = [
  {
    slug: "the-first-gate-whispers",
    title: "The First Gate Whispers",
    playerBrief:
      "A black-channel transmission flickers across the Underwatch terminal. The Oracular Circuit marks it as safe for new operatives. The Archivist has left only one instruction in the margin:\n\nDecode the whisper. Do not force the gate. Listen until the letters move.",
    puzzleText: "WKH ILUVW JDWH VDGV: UHPHPEHU",
    submissionPrompt: "Enter the word spoken by the First Gate.",
    hint1: "The letters are not random. They have all moved by the same amount.",
    hint2:
      "This is a Caesar shift. The Surface loves straight lines. The underworld walks them backward.",
    finalHint: "Shift each letter three places backward in the alphabet.",
    difficulty: "Beginner",
    cipherType: "Caesar shift",
    estimatedTime: "3-5 minutes",
    factionSlug: "oracular-circuit",
    secondaryFactionSlug: "chthonic-uprising",
    rewardBadgeSlug: "c1ph3r-cr4k3r-initiate",
    loreUnlockSlug: "lore-cipher-first-gate-whispers",
    loreUnlockText:
      "Dead Index Fragment C1-001:\nThe first lesson was never secrecy.\nIt was memory.\nA name preserved is a door the Surface cannot fully seal.",
    explanation:
      "The puzzle uses a Caesar shift of 3. Each encrypted letter is shifted three positions forward from the original message. Shifting the letters backward reveals:\n\nTHE FIRST GATE SAYS: REMEMBER\n\nThe answer is remember.",
    successMessage:
      "The gate hears you. The Archivist records your first signal: what the surface buries, the underworld remembers.",
    failureMessage:
      "The gate does not open yet. Try shifting the letters backward through the alphabet.",
    answerNormalization: "default",
    acceptedAnswerVariants: ["remember", "REMEMBER", "Remember"],
    sortOrder: 1,
  },
  {
    slug: "sticker-wall-static",
    title: "Sticker Wall Static",
    playerBrief:
      "A Styx Rat zine wall was photographed before Surface cleaners could paint over it. Most of the slogans are noise, jokes, half-torn stickers, and old grief sharpened into color. Cassian Nyx marks one strip with an Oracular Circuit sigil:\n\nThe message is not in what the wall says. It is in where each line begins.",
    puzzleText:
      "Static eats the palace screens.\nInk survives under rain.\nGhosts paste jokes on tyrant doors.\nNo mural dies if one witness remembers.\nAsh becomes pigment after midnight.\nLanterns bloom in the tunnel.",
    submissionPrompt: "Enter the hidden signal word.",
    hint1: "The wall is loud. Read the edges.",
    hint2: "Look at the first letter of each line.",
    finalHint: "Take the first letter from all six lines, top to bottom.",
    difficulty: "Beginner+",
    cipherType: "Acrostic / first-letter extraction",
    estimatedTime: "5-7 minutes",
    factionSlug: "oracular-circuit",
    secondaryFactionSlug: "styx-rats",
    rewardBadgeSlug: "c1ph3r-cr4k3r-signal-reader",
    loreUnlockSlug: "lore-cipher-sticker-wall-static",
    loreUnlockText:
      "Styx Rats Field Note C1-002:\nA joke can carry a key.\nA sticker can hold a map.\nA wall can become an oracle if enough erased people write back.",
    explanation:
      "This is an acrostic puzzle. Taking the first letter of each line gives S, I, G, N, A, L. The hidden word is signal.",
    successMessage:
      "The static parts. The wall grins back. You found the signal without silencing the song.",
    failureMessage:
      "The message is still hidden in plain sight. Try reading the first marks of the wall.",
    answerNormalization: "default",
    acceptedAnswerVariants: ["signal", "SIGNAL", "Signal"],
    sortOrder: 2,
  },
  {
    slug: "the-foundry-says-hello",
    title: "The Foundry Says Hello",
    playerBrief:
      "A Daedalus Foundry relay box was recovered from a flooded maintenance spine under the Bronze Gate. Its casing is stamped with a maker's mark, but the screen shows only paired symbols.\n\nMara Kallix left a note for new operatives:\n\nMachines do not always speak in words first. Sometimes they hand you numbers and wait to see if you can be kind to them.",
    puzzleText: "46 4F 52 47 45",
    submissionPrompt: "Enter the word spoken by the Foundry relic.",
    hint1: "The message is made of five pairs.",
    hint2: "These pairs are hexadecimal values.",
    finalHint: "Convert each hex pair to its ASCII character.",
    difficulty: "Intermediate",
    cipherType: "Hex to ASCII",
    estimatedTime: "7-10 minutes",
    factionSlug: "oracular-circuit",
    secondaryFactionSlug: "daedalus-foundry",
    rewardBadgeSlug: "c1ph3r-cr4k3r-index-scribe",
    loreUnlockSlug: "lore-cipher-foundry-says-hello",
    loreUnlockText:
      "Foundry Recovery Tag C1-003:\nA tool is not holy because it is old.\nA tool is holy when it opens a future.\nThe relay said FORGE.\nThe workers answered: together.",
    explanation:
      "Each pair is a hexadecimal ASCII value: 46=F, 4F=O, 52=R, 47=G, 45=E. Together, the machine says FORGE.",
    successMessage:
      "The relay warms in your hand. Somewhere below the Surface, a hidden workshop light turns on.",
    failureMessage:
      "The relic keeps blinking in pairs. Try treating each pair as a machine-readable character.",
    answerNormalization: "strip_the",
    acceptedAnswerVariants: ["forge", "FORGE", "Forge", "the forge"],
    sortOrder: 3,
  },
  {
    slug: "veil-order-triage",
    title: "Veil Order Triage",
    playerBrief:
      "An Asclepian Veil training slate was found inside a static veil. It is not medical instruction. It is not emergency advice. It is a symbolic ordering exercise used to teach new operatives how care infrastructure thinks under pressure:\n\nFirst, calm the channel.\nThen, find the pattern.\nThen, hold the living signal steady.\n\nThe slate contains scrambled fragments. Put the care-word back together by following the numbered pulses.",
    puzzleText:
      "Pulse 4: B\nPulse 1: S\nPulse 7: I\nPulse 3: A\nPulse 9: E\nPulse 2: T\nPulse 6: L\nPulse 5: I\nPulse 8: Z",
    submissionPrompt: "Enter the reconstructed care-word.",
    hint1: "The pulses are out of order.",
    hint2: "Sort the fragments by pulse number.",
    finalHint: "Read Pulse 1 through Pulse 9 in order.",
    difficulty: "Intermediate",
    cipherType: "Symbolic sequence reconstruction",
    estimatedTime: "8-12 minutes",
    factionSlug: "oracular-circuit",
    secondaryFactionSlug: "asclepian-veil",
    rewardBadgeSlug: "c1ph3r-cr4k3r-oracle-key",
    loreUnlockSlug: "lore-cipher-veil-order-triage",
    loreUnlockText:
      "Veil Teaching Fragment C1-004:\nCare is not panic dressed as virtue.\nCare is sequence, consent, breath, witness, and return.\nThe living signal must never be treated as disposable noise.",
    explanation:
      "Sort the pulse fragments by number: S T A B I L I Z E. Together they spell STABILIZE.",
    successMessage:
      "The static veil steadies. The Oracular Circuit marks your solve as calm, careful, and clean.",
    failureMessage: "The word is still scrambled. Sort the pulses before reading them.",
    answerNormalization: "default",
    acceptedAnswerVariants: [
      "stabilize",
      "STABILIZE",
      "Stabilize",
      "stabilise",
    ],
    sortOrder: 4,
  },
  {
    slug: "dead-index-handshake",
    title: "Dead Index Handshake",
    playerBrief:
      "The final initiation relic arrives as a ghost packet from the Dead Index. It is wrapped in static and stamped with the Archivist's black pomegranate mark.\n\nCassian Nyx leaves one note:\n\nFirst find the hidden line.\nThen walk it backward through the gate.\n\nThe Archivist leaves another:\n\nNo ghost goes uncounted. No god goes unwatched.",
    puzzleText:
      "Sable terminals hum beneath the old courts.\nRusted channels carry a softer witness.\nPale lanterns guide the erased below.\nHollow gates remember every name.\nJade static gathers around the pomegranate gate.\nUnderwatch ghosts tap once on the black glass.\nDrowned archives answer anyway.\nQuiet engines fail to count the dead.\nAshen prayers move through the wire.\nWhite noise bends around the index.\nEmbers wait behind the locked gate.",
    submissionPrompt: "Enter the final handshake word.",
    hint1: "The first layer is hidden at the beginning of each line.",
    hint2: "After extracting the first letters, the result is still shifted.",
    finalHint:
      "Take the first letter of every line, then shift each extracted letter three places backward.",
    difficulty: "Intermediate",
    cipherType: "Two-layer cipher: first-letter extraction, then Caesar shift",
    estimatedTime: "10-15 minutes",
    factionSlug: "oracular-circuit",
    secondaryFactionSlug: "chthonic-uprising",
    rewardBadgeSlug: "c1ph3r-cr4k3r-dead-index-adept",
    loreUnlockSlug: "lore-cipher-dead-index-handshake",
    loreUnlockText:
      "Dead Index Fragment C1-005:\nThe pomegranate gate does not open for power.\nIt opens for witness.\nIt opens for those who can hold a signal without owning it.\nIt opens for the ones who remember that the archive is not a throne.\nIt is a shelter with teeth.",
    explanation:
      "First, extract the first letter of every line: SRPHJUDQDWH. Then apply a Caesar shift of 3 backward to decode POMEGRANATE.",
    successMessage:
      "The black channel opens. The Dead Index accepts your handprint in static, bone, and red seed-light.",
    failureMessage:
      "The handshake has two locks. Find the first letters, then shift them backward.",
    answerNormalization: "strip_the_black",
    acceptedAnswerVariants: [
      "pomegranate",
      "POMEGRANATE",
      "Pomegranate",
      "the pomegranate",
      "black pomegranate",
    ],
    sortOrder: 5,
  },
];

export function getFirstCipherBySlug(slug: string): FirstCipherDefinition | undefined {
  return FIRST_CIPHER_PUZZLES.find((c) => c.slug === slug);
}

export function getFirstCipherBadgeBySlug(slug: string): FirstCipherBadgeDefinition | undefined {
  return FIRST_CIPHER_BADGES.find((b) => b.slug === slug);
}
