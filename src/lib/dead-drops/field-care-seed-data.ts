import type {
  MmoDropType,
  MmoRepeatability,
  MmoSubmissionType,
  ReputationCategory,
} from "@/generated/prisma/client";

export const FIELD_CARE_LOOP_SLUG = "field-care-cache";

export interface FieldCareLootSeed {
  slug: string;
  name: string;
  flavorText: string;
  displayLocation: string;
}

export interface FieldCareBadgeSeed {
  slug: string;
  name: string;
  description: string;
}

export interface FieldCareDeadDropSeed {
  title: string;
  slug: string;
  category: string;
  dropType: MmoDropType;
  difficulty: string;
  repeatability: MmoRepeatability;
  reviewRequired: boolean;
  submissionType: MmoSubmissionType;
  playerPrompt: string;
  successText: string;
  failureText: string;
  loreNote?: string;
  safetyNote?: string;
  rewardBadgeSlug?: string;
  rewardReputationCategory?: ReputationCategory;
  rewardReputationPoints?: number;
  rewardLootSlug?: string;
  sortOrder: number;
}

export const FIELD_CARE_LOOT: FieldCareLootSeed[] = [
  { slug: "whistle-signal-charm", name: "Whistle Signal Charm", flavorText: "Fictional Props & Tech Gear — safety signal charm.", displayLocation: "accessory" },
  { slug: "veil-first-aid-patch", name: "Veil First Aid Patch", flavorText: "Fictional Props & Tech Gear — readiness patch.", displayLocation: "clothing" },
  { slug: "hydration-cache-sticker", name: "Hydration Cache Sticker", flavorText: "Field care sticker for water readiness.", displayLocation: "accessory" },
  { slug: "pocket-contact-card", name: "Pocket Contact Card", flavorText: "Private emergency card — do not upload.", displayLocation: "accessory" },
  { slug: "quiet-signal-earplugs", name: "Quiet Signal Earplugs", flavorText: "Sensory comfort readiness item.", displayLocation: "accessory" },
  { slug: "reflective-gate-mark", name: "Reflective Gate Mark", flavorText: "Visibility readiness mark.", displayLocation: "clothing" },
  { slug: "relay-battery-charm", name: "Relay Battery Charm", flavorText: "Power bank readiness charm.", displayLocation: "accessory" },
  { slug: "field-note-notebook", name: "Field Note Notebook", flavorText: "Notebook and pen readiness item.", displayLocation: "accessory" },
  { slug: "public-resource-pin", name: "Public Resource Pin", flavorText: "Archive pin for public community resources.", displayLocation: "accessory" },
  { slug: "care-kit-tag", name: "Care Kit Tag", flavorText: "Community-care kit inventory tag.", displayLocation: "accessory" },
  { slug: "route-witness-thread", name: "Route Witness Thread", flavorText: "Accessibility route witness thread.", displayLocation: "clothing" },
  { slug: "comfort-kit-satchel", name: "Comfort Kit Satchel", flavorText: "Event comfort kit satchel charm.", displayLocation: "clothing" },
];

export const FIELD_CARE_BADGES: FieldCareBadgeSeed[] = [
  { slug: "ice-watch-signal", name: "Ice Watch Signal", description: "Carried a lawful personal safety signal item." },
  { slug: "black-clinic-readiness", name: "Black Clinic Readiness", description: "Identified basic first aid preparedness." },
];

export const FIELD_CARE_DEAD_DROPS: FieldCareDeadDropSeed[] = [
  {
    title: "Ice Watch Whistle Signal",
    slug: "ice-watch-whistle-signal",
    category: "ice-watch",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Add a small whistle or safety signal item to your community-care kit. It is for calling attention if you are lost, separated, injured, or need help — never for harassment, confrontation, or evasion.",
    successText: "Signal item logged. The Underwatch marks your readiness without asking you to prove harm.",
    failureText: "Revise for safety. This drop is for lawful personal signaling only.",
    loreNote: "ICE WATCH / COMMUNITY CARE · Fictional Props & Tech Gear",
    safetyNote:
      "Use only for lawful personal safety signaling. Do not use to intimidate, disrupt, harass, evade, or target anyone.",
    rewardBadgeSlug: "ice-watch-signal",
    rewardLootSlug: "whistle-signal-charm",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 5,
    sortOrder: 1,
  },
  {
    title: "Black Clinic Pocket First Aid",
    slug: "black-clinic-pocket-first-aid",
    category: "first-aid",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Put together or locate a basic first aid kit with simple supplies such as bandages, antiseptic wipes, gauze, and gloves. This is a readiness check, not medical training.",
    successText: "First aid readiness noted. Care before crisis.",
    failureText: "Keep this to basic preparedness — not medical advice.",
    loreNote: "ICE WATCH / COMMUNITY CARE · readiness item",
    safetyNote: "This does not replace medical care or training. Do not give medical advice beyond basic preparedness.",
    rewardBadgeSlug: "black-clinic-readiness",
    rewardLootSlug: "veil-first-aid-patch",
    rewardReputationCategory: "ACCESSIBILITY",
    rewardReputationPoints: 5,
    sortOrder: 2,
  },
  {
    title: "Hydration Cache",
    slug: "hydration-cache",
    category: "readiness",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Add a water bottle or hydration plan to your go-bag, event bag, car kit, or daily carry. The Underwatch runs better when nobody forgets water.",
    successText: "Hydration cache marked. Stay fed, stay steady.",
    failureText: "Simple readiness only.",
    loreNote: "community-care · field care item",
    rewardLootSlug: "hydration-cache-sticker",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 3,
    sortOrder: 3,
  },
  {
    title: "Emergency Contact Card",
    slug: "emergency-contact-card",
    category: "readiness",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Create a small private emergency contact card for yourself. Keep it offline and do not upload personal information to Hades Watch.",
    successText: "Private card readiness logged. Your data stays yours.",
    failureText: "Do not submit contact details to the relay.",
    loreNote: "readiness · public safety supply",
    safetyNote: "Do not submit your contact details. Mark complete without sharing private information.",
    rewardLootSlug: "pocket-contact-card",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 4,
    sortOrder: 4,
  },
  {
    title: "Earplug Packet",
    slug: "earplug-packet",
    category: "accessibility",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Add earplugs or a sensory comfort item to your care kit for loud rooms, events, transit, or overload days.",
    successText: "Sensory comfort item noted. Quiet is a valid signal.",
    failureText: "Comfort and care only.",
    loreNote: "accessibility · field care item",
    rewardLootSlug: "quiet-signal-earplugs",
    rewardReputationCategory: "ACCESSIBILITY",
    rewardReputationPoints: 4,
    sortOrder: 5,
  },
  {
    title: "Reflective Visibility Mark",
    slug: "reflective-visibility-mark",
    category: "readiness",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Add a reflective strip, clip, bright band, or visibility marker to a bag or jacket for safer walking, biking, events, or night travel.",
    successText: "Visibility mark logged. Be seen, be safe.",
    failureText: "Public safety supply only.",
    loreNote: "readiness · preparedness gear",
    rewardLootSlug: "reflective-gate-mark",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 4,
    sortOrder: 6,
  },
  {
    title: "Power Bank Check",
    slug: "power-bank-check",
    category: "readiness",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Charge or identify a small power bank or charging cable for your daily kit. The relay dies when the battery does.",
    successText: "Power readiness confirmed. Keep the signal alive.",
    failureText: "Simple gear check only.",
    loreNote: "readiness · Fictional Props & Tech Gear",
    rewardLootSlug: "relay-battery-charm",
    rewardReputationCategory: "FORGE",
    rewardReputationPoints: 4,
    sortOrder: 7,
  },
  {
    title: "Notebook and Pen",
    slug: "notebook-and-pen",
    category: "archive",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Add a small notebook and pen to your field kit for notes, directions, sketches, or thoughts when your phone is not ideal.",
    successText: "Analog field kit noted. Ink survives dead zones.",
    failureText: "Keep notes private unless sharing through safe channels.",
    loreNote: "archive · field care item",
    rewardLootSlug: "field-note-notebook",
    rewardReputationCategory: "LORE",
    rewardReputationPoints: 3,
    sortOrder: 8,
  },
  {
    title: "Public Resource Pin",
    slug: "public-resource-pin",
    category: "public-works",
    dropType: "resource_link",
    difficulty: "operative",
    repeatability: "one_time",
    reviewRequired: true,
    submissionType: "url_plus_summary",
    playerPrompt:
      "Find one public community resource you might want to remember later: a library, cooling center, food pantry, public clinic, transit help page, maker space, accessibility resource, or mutual aid education page.",
    successText: "Public resource filed for Archivist review.",
    failureText: "Only public, consent-safe resources. No private addresses or sensitive locations.",
    loreNote: "archive · community-care",
    safetyNote:
      "Only submit public, consent-safe resources. Do not submit private people, private addresses, or sensitive locations.",
    rewardLootSlug: "public-resource-pin",
    rewardReputationCategory: "ARCHIVE",
    rewardReputationPoints: 6,
    sortOrder: 9,
  },
  {
    title: "Care Kit Inventory",
    slug: "care-kit-inventory",
    category: "community-care",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "short_text",
    playerPrompt:
      "Make a short private checklist of what you already have and what you might want in a small community-care kit. Submit a generic summary only — no private details.",
    successText: "Care kit inventory logged. Mutual aid starts with knowing what you carry.",
    failureText: "Do not upload private inventories, addresses, medication details, or sensitive personal information.",
    loreNote: "community-care · readiness item",
    safetyNote:
      "Do not upload private inventories, addresses, medication details, or sensitive personal information.",
    rewardLootSlug: "care-kit-tag",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 4,
    sortOrder: 10,
  },
  {
    title: "Accessibility Route Check",
    slug: "accessibility-route-check",
    category: "accessibility",
    dropType: "accessibility_note",
    difficulty: "operative",
    repeatability: "one_time",
    reviewRequired: true,
    submissionType: "short_text",
    playerPrompt:
      "Think of one public place you visit and note one accessibility feature or barrier: seating, ramps, lighting, sound, restrooms, signage, transit, or quiet space.",
    successText: "Route witness filed for review.",
    failureText: "Keep notes general and respectful. No private homes or vulnerable people.",
    loreNote: "accessibility · field care item",
    safetyNote: "Do not name private homes or expose vulnerable people. Keep notes general and respectful.",
    rewardLootSlug: "route-witness-thread",
    rewardReputationCategory: "ACCESSIBILITY",
    rewardReputationPoints: 6,
    sortOrder: 11,
  },
  {
    title: "Event Comfort Kit",
    slug: "event-comfort-kit",
    category: "community-care",
    dropType: "safe_care_action_idea",
    difficulty: "initiate",
    repeatability: "one_time",
    reviewRequired: false,
    submissionType: "no_submission_read_only",
    playerPrompt:
      "Plan a small comfort kit for a lawful public event, meetup, convention, workday, or long errand: water, snacks, earplugs, backup charger, transit card, mask, notebook, and any personal comfort item.",
    successText: "Comfort kit planned. Care over confrontation.",
    failureText: "Comfort and care only — not tactics.",
    loreNote: "ICE WATCH / COMMUNITY CARE · community care kit",
    safetyNote: "This is for comfort and care, not confrontation, evasion, or unsafe tactics.",
    rewardLootSlug: "comfort-kit-satchel",
    rewardReputationCategory: "COMMUNITY",
    rewardReputationPoints: 5,
    sortOrder: 12,
  },
];
