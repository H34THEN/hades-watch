export const CHAT_MESSAGE_RETENTION_HOURS = 24;
export const CHAT_MESSAGE_MAX_LENGTH = 500;
export const CHAT_ALIAS_MAX_LENGTH = 32;
export const CHAT_POLL_INTERVAL_MS = 4000;

export const CHAT_PRIVACY_SHORT =
  "HTTPS-protected temporary chat. No secrets. No archives.";

export const CHAT_PRIVACY_WARNING =
  "This is HTTPS-protected temporary chat. Messages are not meant for long-term storage, but do not post secrets, passwords, private addresses, medical records, private keys, recovery codes, or anything you need preserved.";

export const DEFAULT_CHAT_ROOMS = [
  {
    slug: "underwatch-lobby",
    name: "Underwatch Lobby",
    description: "General underworld chatter. Low clearance, high noise.",
    sortOrder: 1,
  },
  {
    slug: "dead-index",
    name: "Dead Index",
    description: "Archive talk, evidence threads, and memory routes.",
    sortOrder: 2,
  },
  {
    slug: "signal-noise",
    name: "Signal Noise",
    description: "Cipher gossip, signal hygiene, and oracle skepticism.",
    sortOrder: 3,
  },
  {
    slug: "faction-floor",
    name: "Faction Floor",
    description: "Cell coordination without pretending it is a war room.",
    sortOrder: 4,
  },
  {
    slug: "afterhours",
    name: "Afterhours",
    description: "Late-shift banter. Morale, not manifestos.",
    sortOrder: 5,
  },
] as const;

export const CHAT_ALIAS_PREFIXES = [
  "StaticGhost",
  "PomegranateSignal",
  "UnderwatchMoth",
  "NeonCerberus",
  "ArchiveRat",
  "VeilCantor",
  "SignalMoth",
  "DeadIndexWisp",
  "StyxRat",
  "CipherMoth",
  "BlackClinic",
  "OracularWisp",
] as const;
