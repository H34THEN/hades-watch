import { CHTHONIC_FACTIONS } from "@/lib/factions/chthonic-data";
import type { FirstDescentMissionDefinition } from "@/lib/missions/types";

const veilPalette = CHTHONIC_FACTIONS.find((f) => f.slug === "asclepian-veil")!
  .palette;
const circuitPalette = CHTHONIC_FACTIONS.find(
  (f) => f.slug === "oracular-circuit",
)!.palette;
const grindersPalette = CHTHONIC_FACTIONS.find(
  (f) => f.slug === "myrmidon-grinders",
)!.palette;
const foundryPalette = CHTHONIC_FACTIONS.find(
  (f) => f.slug === "daedalus-foundry",
)!.palette;
const ratsPalette = CHTHONIC_FACTIONS.find((f) => f.slug === "styx-rats")!
  .palette;

export const FIRST_DESCENT_PACK_ID = "first-descent-protocols";

export const FIRST_DESCENT_PACK_INTRO =
  "This is the first real-world readiness mission pack for Hades Watch. It teaches operatives that resistance is not only fiction, signal, myth, and style. It is also care skills, emergency planning, privacy literacy, repair culture, accessibility, documentation, creative morale, and the ability to keep one another difficult to erase.";

export const FIRST_DESCENT_MISSION_SLUGS = [
  "black-clinic-readiness",
  "oracle-hygiene-check",
  "gatewatch-readiness-map",
  "labyrinth-repair-log",
  "morale-signal-drop",
] as const;

export const FIRST_DESCENT_MISSIONS: FirstDescentMissionDefinition[] = [
  {
    slug: "black-clinic-readiness",
    title: "Black Clinic Readiness",
    description:
      "Complete basic emergency care certifications and earn Asclepian Veil support standing.",
    factionSlug: "asclepian-veil",
    difficulty: "FIELD",
    missionType: "REAL_WORLD_READINESS",
    estimatedTime: "4 to 12 hours, depending on certification access",
    repeatable: false,
    reputationReward: 25,
    completionBadgeSlug: "veil-field-stabilizer",
    requiredBadgeSlugs: [
      "cpr-certified",
      "first-aid-certified",
      "stop-the-bleed-certified",
    ],
    submissionType: "CERTIFICATION_PROOF",
    reviewMode: "MANUAL",
    nonviolenceClassification:
      "Nonviolent, care/preparation/education only",
    loreUnlockSlug: "dead-index-entry-black-clinic-oath",
    optionalTitle: "Field Stabilizer",
    badges: [
      {
        slug: "cpr-certified",
        name: "CPR Certified",
        requirement:
          "Complete a CPR certification from a recognized provider.",
        proofType:
          "Certificate name, completion date, certifying organization, optional private image upload if later supported.",
        placeholderText: "CPR",
        placeholderColor: veilPalette.veilGreen,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "first-aid-certified",
        name: "First Aid Certified",
        requirement:
          "Complete a First Aid certification from a recognized provider.",
        proofType:
          "Certificate name, completion date, certifying organization, optional private image upload if later supported.",
        placeholderText: "FIRST AID",
        placeholderColor: veilPalette.boneWhite,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "stop-the-bleed-certified",
        name: "Stop the Bleed Certified",
        requirement:
          "Complete Stop the Bleed or an equivalent bleeding control course from a recognized provider.",
        proofType:
          "Course name, completion date, certifying organization, optional private image upload if later supported.",
        placeholderText: "BLEED CTRL",
        placeholderColor: veilPalette.emergencyPomegranate,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "veil-field-stabilizer",
        name: "Veil Field Stabilizer",
        requirement:
          "Complete all required Black Clinic Readiness badges.",
        proofType:
          "System or moderator verification of required badge records.",
        placeholderText: "STABILIZER",
        placeholderColor: veilPalette.surgicalSilver,
        requiredForMissionCompletion: false,
        isMissionCompletionBadge: true,
      },
    ],
    sections: {
      missionBrief: `The Veil does not ask operatives to play doctor in the dark.

The Veil asks operatives to get trained, document readiness, respect privacy, and understand the limits of their own hands. A field stabilizer is not a hero with a miracle. A field stabilizer is someone who knows when to call emergency services, when to follow certified training, when to protect consent, and when to stop making the moment about themselves.

Under the Surface Order, care was turned into a privilege, a score, a denial notice, a locked door. The Asclepian Veil answers with preparation.

No body is disposable. No proof packet should expose what it was meant to protect.`,
      realWorldPurpose: `This mission encourages operatives to complete basic emergency response certifications through qualified organizations. It supports real-world care literacy while making clear that users should only provide care within their training, certification, consent boundaries, and local laws.

The mission rewards preparation, not performance. The objective is to become more useful, calmer, and safer in moments where panic usually gets the microphone.`,
      inUniverseContext: `Circe Runic founded the Asclepian Veil after discovering that mortality engines were denying care to whole populations marked as inefficient. The Veil built underclinics, med routes, privacy screens, and quiet systems of survival beneath the All-Seeing Census.

A Black Clinic Readiness record marks an operative as someone who has taken the first real step toward care discipline. Not a savior. Not a surgeon. A trained witness with steadier hands than yesterday.`,
      objective: `Complete and document the required care-readiness badges:

1. CPR certification.
2. First Aid certification.
3. Stop the Bleed certification or an equivalent bleeding control course from a recognized organization.

When all required badges are verified, the operative earns the full mission completion badge: Veil Field Stabilizer.`,
      operativeTasks: [
        "Find qualified CPR, First Aid, and bleeding control courses available in your area or through recognized providers.",
        "Complete the trainings according to the provider's instructions.",
        "Record the certificate name, completion date, and certifying organization for each course.",
        "Submit a proof packet through the mission page.",
        "Review the mission safety note and affirm that you will only provide care within your training, consent boundaries, and local laws.",
      ],
      submissionRequirements: [
        "CPR certificate name, date completed, and certifying organization.",
        "First Aid certificate name, date completed, and certifying organization.",
        "Stop the Bleed or equivalent bleeding control course name, date completed, and certifying organization.",
        "Optional notes about what the operative learned.",
        "Optional private image proof if the site later supports secure uploads.",
      ],
      proofPrivacyNotes: `Proof should not require public exposure of personal documents. The mission page should ask for minimal verification details. If image uploads are added later, uploads should be private to moderators or admins and should not display on public profiles.

Users should be encouraged to redact sensitive details before uploading any image proof. The badge record should display only the badge name, faction association, and verification status.`,
      safetyNotes: `This mission does not authorize unsafe medical practice. Operatives should follow their training, local laws, emergency guidance, and consent requirements. In emergencies, users should contact local emergency services when appropriate.

This mission contains no violence, weapons, confrontation, unsafe protest tactics, or vigilante behavior. It rewards education, certification, and care readiness only.`,
      successCriteria: [
        "All three required certification badges are verified.",
        "Proof packets include certificate names, dates, and organizations.",
        "The operative has affirmed the safety and scope-of-training note.",
      ],
      factionLeaderTransmission: {
        speaker: "Circe Runic, Veil-Cantor / Wound Archivist",
        body: `You are not being asked to become a miracle.

You are being asked to become less helpless when fear enters the room. Learn the rhythm. Learn the limits. Learn how to steady your breath before you touch another person's crisis.

Care without consent becomes control. Care without training becomes danger. Care without privacy becomes another census.

Do better than the Surface Order. Start there.`,
      },
      archivistNote: `I have seen people saved by someone who knew one simple thing and did it correctly.

I have also seen people harmed by someone who wanted to be important.

Let the Veil teach you the difference.`,
      rewards: [
        "Faction reputation: +25 Asclepian Veil standing",
        "Badges: CPR Certified, First Aid Certified, Stop the Bleed Certified",
        "Mission completion badge: Veil Field Stabilizer",
        "Optional title: Field Stabilizer",
        "Lore unlock: dead-index-entry-black-clinic-oath",
      ],
      profileBadgePlaceholderNotes:
        "Badge placeholders should use square cards with the Asclepian Veil palette. Use Veil Green, Bone White, Surgical Silver, and Emergency Pomegranate. The completion badge should include a simple serpent-staff symbol or text-only placeholder reading VEIL FIELD STABILIZER.",
    },
    submissionFields: [
      {
        id: "cpr-certificate",
        label: "CPR certificate name, date completed, and certifying organization",
        type: "textarea",
        required: true,
        placeholder:
          "Certificate name, completion date, certifying organization",
        helpText:
          "Provide minimal verification details only. Do not upload sensitive documents unless secure upload is available.",
      },
      {
        id: "first-aid-certificate",
        label:
          "First Aid certificate name, date completed, and certifying organization",
        type: "textarea",
        required: true,
        placeholder:
          "Certificate name, completion date, certifying organization",
      },
      {
        id: "bleed-control-certificate",
        label:
          "Stop the Bleed or equivalent course name, date completed, and certifying organization",
        type: "textarea",
        required: true,
        placeholder: "Course name, completion date, certifying organization",
      },
      {
        id: "optional-notes",
        label: "Optional notes about what you learned",
        type: "textarea",
        required: false,
      },
      {
        id: "safety-affirmation",
        label:
          "I affirm that I will only provide care within my training, consent boundaries, and local laws, and that I will contact local emergency services when appropriate.",
        type: "checkbox",
        required: true,
      },
    ],
  },
  {
    slug: "oracle-hygiene-check",
    title: "Oracle Hygiene Check",
    description:
      "Complete a defensive digital hygiene checklist and earn Oracular Circuit support standing.",
    factionSlug: "oracular-circuit",
    difficulty: "INITIATE",
    missionType: "PRIVACY_LITERACY",
    estimatedTime: "1 to 3 hours",
    repeatable: true,
    reputationReward: 20,
    completionBadgeSlug: "oracle-signal-listener",
    requiredBadgeSlugs: [
      "password-vault-initiate",
      "mfa-activated",
      "metadata-aware",
      "signal-hygiene-checked",
    ],
    submissionType: "CHECKLIST_AND_REFLECTION",
    reviewMode: "MANUAL_OR_AUTOMATED",
    nonviolenceClassification:
      "Nonviolent, defensive privacy education only",
    loreUnlockSlug: "dead-index-entry-prophecy-loop",
    optionalTitle: "Signal Listener",
    badges: [
      {
        slug: "password-vault-initiate",
        name: "Password Vault Initiate",
        requirement:
          "Set up a password manager or audit an existing one.",
        proofType: "Short checklist confirmation, no passwords submitted.",
        placeholderText: "VAULT",
        placeholderColor: circuitPalette.oracleViolet,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "mfa-activated",
        name: "MFA Activated",
        requirement:
          "Enable multi-factor authentication on at least three important accounts where available.",
        proofType: "Account category checklist only, no account names required.",
        placeholderText: "MFA",
        placeholderColor: circuitPalette.signalCyan,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "metadata-aware",
        name: "Metadata Aware",
        requirement:
          "Complete a basic metadata and privacy hygiene checklist.",
        proofType: "Checklist confirmation and short reflection.",
        placeholderText: "META",
        placeholderColor: circuitPalette.staticWhite,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "signal-hygiene-checked",
        name: "Signal Hygiene Checked",
        requirement:
          "Create a personal device and app update checklist.",
        proofType:
          "Checklist summary, no device serials or sensitive details.",
        placeholderText: "HYGIENE",
        placeholderColor: circuitPalette.prophecyBlue,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "oracle-signal-listener",
        name: "Oracle Signal Listener",
        requirement: "Complete all required Oracle Hygiene Check badges.",
        proofType:
          "System or moderator verification of required badge records.",
        placeholderText: "LISTENER",
        placeholderColor: circuitPalette.blackGlass,
        requiredForMissionCompletion: false,
        isMissionCompletionBadge: true,
      },
    ],
    sections: {
      missionBrief: `The machine does not need to know your whole life to hurt you.

The Oracular Circuit teaches operatives to reduce the easy harvest. This mission does not ask anyone to hack, intrude, bypass, exploit, or disappear. It asks for basic digital hygiene: password safety, multi-factor authentication, metadata awareness, device updates, and a little media literacy before the oracle turns your habits into prophecy.

No algorithm is divine. No hostile prediction engine deserves a free meal.`,
      realWorldPurpose: `This mission helps users improve everyday digital safety and privacy literacy. It supports defensive practices such as password manager setup, multi-factor authentication, metadata awareness, software update planning, and reading a digital rights or privacy education article.

It avoids illegal hacking, evasion, intrusion, credential theft, malware, or exploitation.`,
      inUniverseContext: `Cassian Nyx broke the first prophecy loop by proving that the oracle did not see the future. It manufactured conditions, then called the result fate.

The Oracular Circuit now trains operatives to starve hostile systems of easy signal, question automated authority, and protect the people in their social graph. Signal hygiene is not paranoia. It is care with better locks.`,
      objective: `Complete the required defensive digital hygiene badges:

1. Set up or audit a password manager.
2. Enable multi-factor authentication on key accounts.
3. Complete a metadata and privacy checklist.
4. Create a device update checklist.
5. Read and summarize a digital rights, privacy, or media literacy article.

When all required badges are verified, the operative earns the full mission completion badge: Oracle Signal Listener.`,
      operativeTasks: [
        "Set up a password manager or review your existing vault for weak, reused, or outdated entries.",
        "Enable multi-factor authentication on at least three key accounts where available.",
        "Complete a basic metadata awareness checklist, such as reviewing photo location data, document sharing settings, and public profile exposure.",
        "Create a device update checklist for operating systems, browsers, password manager, messaging apps, and critical software.",
        "Read one article or guide from a reputable digital rights, privacy, or media literacy organization and write a short summary of what you learned.",
      ],
      submissionRequirements: [
        "Confirmation that a password manager was set up or reviewed.",
        "General account categories where MFA was enabled, such as email, banking, social, cloud storage, work, or school. Do not require exact account names.",
        "Completed metadata checklist summary.",
        "Device update checklist summary.",
        "One short article summary, 100 to 250 words.",
      ],
      proofPrivacyNotes: `Users must never submit passwords, recovery codes, private keys, account screenshots, full account names, phone numbers, or sensitive security details. The proof packet should verify completion without collecting dangerous information.

The badge record should say what was completed, not expose how the operative secures their life.`,
      safetyNotes: `This mission is defensive and educational. It does not include illegal hacking, unauthorized access, evasion, malware, intrusion, credential theft, doxxing, harassment, or surveillance of others.

The mission rewards personal privacy literacy and safer digital habits.`,
      successCriteria: [
        "All required checklist items are submitted.",
        "No sensitive credentials or private security materials are included.",
        "The article summary demonstrates basic understanding.",
        "All required badges are verified.",
      ],
      factionLeaderTransmission: {
        speaker: "Cassian Nyx, Pythian Root / Oracle-Breaker",
        body: `The oracle feeds on carelessness first.

Not genius. Not prophecy. Not divine sight. Carelessness.

Give it less. Lock what should be locked. Update what should not be rotting. Stop handing the machine your life and calling it convenience.

You do not need to vanish.

You need to become harder to summarize.`,
      },
      archivistNote: `The Dead Index protects records.

It cannot protect the passwords you tape to the altar.

Do the boring work. The boring work has saved more ghosts than any dramatic breach.`,
      rewards: [
        "Faction reputation: +20 Oracular Circuit standing",
        "Badges: Password Vault Initiate, MFA Activated, Metadata Aware, Signal Hygiene Checked",
        "Mission completion badge: Oracle Signal Listener",
        "Optional title: Signal Listener",
        "Lore unlock: dead-index-entry-prophecy-loop",
      ],
      profileBadgePlaceholderNotes:
        "Badge placeholders should use the Oracular Circuit palette. Use Oracle Violet, Signal Cyan, Black Glass, Static White, and Prophecy Blue. The completion badge should include a cracked eye or Delphi tripod placeholder with text reading ORACLE SIGNAL LISTENER.",
    },
    submissionFields: [
      {
        id: "password-manager-confirmation",
        label: "Password manager setup or audit confirmation",
        type: "textarea",
        required: true,
        helpText:
          "Confirm completion only. Never submit passwords, recovery codes, or private keys.",
      },
      {
        id: "mfa-categories",
        label:
          "Account categories where MFA was enabled (email, banking, social, cloud, work, school, etc.)",
        type: "textarea",
        required: true,
        helpText: "List categories only. Do not include exact account names.",
      },
      {
        id: "metadata-checklist",
        label: "Metadata and privacy checklist summary",
        type: "textarea",
        required: true,
      },
      {
        id: "device-update-checklist",
        label: "Device and app update checklist summary",
        type: "textarea",
        required: true,
        helpText:
          "No device serials or sensitive identifying details required.",
      },
      {
        id: "article-summary",
        label:
          "Article summary (100 to 250 words) from a digital rights, privacy, or media literacy source",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    slug: "gatewatch-readiness-map",
    title: "Gatewatch Readiness Map",
    description:
      "Create emergency logistics, contact, resource, accessibility, and nonviolent de-escalation readiness records.",
    factionSlug: "myrmidon-grinders",
    difficulty: "FIELD",
    missionType: "PREPAREDNESS",
    estimatedTime: "2 to 6 hours",
    repeatable: true,
    reputationReward: 25,
    completionBadgeSlug: "myrmidon-gatewatch-steward",
    requiredBadgeSlugs: [
      "go-bag-assembled",
      "contact-tree-built",
      "safe-route-mapper",
      "accessibility-support-logged",
      "de-escalation-trained",
    ],
    submissionType: "CHECKLIST_AND_REFLECTION",
    reviewMode: "MANUAL",
    nonviolenceClassification:
      "Nonviolent, care/preparation/education only",
    loreUnlockSlug: "dead-index-entry-dock-nine-gate",
    optionalTitle: "Gatewatch Steward",
    badges: [
      {
        slug: "go-bag-assembled",
        name: "Go-Bag Assembled",
        requirement:
          "Create or update a go-bag or emergency supplies checklist.",
        proofType: "Checklist summary, no home address required.",
        placeholderText: "GO-BAG",
        placeholderColor: grindersPalette.hazardGold,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "contact-tree-built",
        name: "Contact Tree Built",
        requirement:
          "Create a household, friend, or chosen-family emergency contact plan.",
        proofType:
          "Summary of plan structure, no private numbers required.",
        placeholderText: "TREE",
        placeholderColor: grindersPalette.furnaceBronze,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "safe-route-mapper",
        name: "Safe Route Mapper",
        requirement:
          "Map local public resources such as libraries, cooling centers, clinics, shelters, transit hubs, or other safe public spaces.",
        proofType:
          "List of resource categories and general area, no sensitive location disclosure required.",
        placeholderText: "ROUTES",
        placeholderColor: grindersPalette.concreteAsh,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "accessibility-support-logged",
        name: "Accessibility Support Logged",
        requirement:
          "Create an accessibility support checklist for events, gatherings, or household emergencies.",
        proofType: "Checklist summary.",
        placeholderText: "ACCESS",
        placeholderColor: grindersPalette.carbonBlack,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "de-escalation-trained",
        name: "De-Escalation Trained",
        requirement:
          "Complete a nonviolent de-escalation or bystander intervention training if available, or review a reputable guide.",
        proofType: "Training name/date or guide summary.",
        placeholderText: "CALM",
        placeholderColor: grindersPalette.bloodSignal,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "myrmidon-gatewatch-steward",
        name: "Myrmidon Gatewatch Steward",
        requirement: "Complete all required Gatewatch Readiness Map badges.",
        proofType:
          "System or moderator verification of required badge records.",
        placeholderText: "GATEWATCH",
        placeholderColor: grindersPalette.furnaceBronze,
        requiredForMissionCompletion: false,
        isMissionCompletionBadge: true,
      },
    ],
    sections: {
      missionBrief: `The Grinders do not measure strength by who can frighten a room.

They measure it by who remembers the water, the chair, the exit, the phone tree, the person who cannot stand in line, the elder who needs a ride, the child who needs quiet, the neighbor who will not ask for help until the lights are already out.

Gatewatch Readiness is the first logistics record. It turns panic into a list. It turns a crowd into a buddy system. It turns "someone should" into "I checked."

No weapons. No combat. No confrontation. Just care under pressure.`,
      realWorldPurpose: `This mission helps users build practical emergency readiness and community support habits. It encourages go-bag planning, household contact trees, safe public resource mapping, accessibility checklists, supply inventory, and nonviolent de-escalation or bystander intervention education where available.

It centers preparedness, accessibility, communication, and calm support.`,
      inUniverseContext: `Brontes Vale founded the Myrmidon Grinders after watching workers erased from the feed while still bleeding on the dock. The Grinders learned that defense begins long before danger arrives. It begins with logistics. It begins with exits. It begins with knowing who needs help and who has the keys.

The gate is not a wall. The gate is a promise that no one gets left because they were inconvenient to carry.`,
      objective: `Complete the required readiness badges:

1. Create a personal or household go-bag checklist.
2. Build an emergency contact tree.
3. Map safe public resources.
4. Create an accessibility support checklist.
5. Complete a nonviolent de-escalation or bystander intervention training if available, or review a reputable nonviolent community safety guide.

When all required badges are verified, the operative earns the full mission completion badge: Myrmidon Gatewatch Steward.`,
      operativeTasks: [
        "Create or update a go-bag checklist appropriate to your household and local risks.",
        "Build a contact tree with trusted people. Keep private contact details off public submissions.",
        "Identify local public resources such as libraries, cooling centers, clinics, shelters, transit hubs, community centers, and other lawful support spaces.",
        "Create an accessibility support checklist for events, gatherings, or emergency planning.",
        "Complete a nonviolent de-escalation or bystander intervention training if available. If none is available, read a reputable guide and summarize the core principles.",
        "Submit a proof packet with summaries only, not sensitive addresses or private contact data.",
      ],
      submissionRequirements: [
        "Go-bag checklist summary.",
        "Contact tree structure summary without phone numbers, addresses, or private details.",
        "Safe resource map summary by category and general area.",
        "Accessibility support checklist.",
        "De-escalation training name and date, or a short summary of a reputable nonviolent guide.",
      ],
      proofPrivacyNotes: `Do not submit private addresses, full contact lists, phone numbers, medical details, disability details of other people, shelter locations that should remain private, or sensitive route information.

The site should provide text fields that encourage summaries rather than raw private planning documents.`,
      safetyNotes: `This mission does not include weapons, combat, confrontation, force, security patrols, law enforcement evasion, protest tactics, or interference with emergency services.

The Myrmidon Grinders support emergency logistics, accessibility, de-escalation, communication, and mutual aid distribution. Strength without cruelty means preparation without threat.`,
      successCriteria: [
        "All required readiness summaries are submitted.",
        "The submission avoids sensitive private information.",
        "The de-escalation or guide summary reflects nonviolent principles.",
        "All required badges are verified.",
      ],
      factionLeaderTransmission: {
        speaker: "Brontes Vale, Gatebreaker / Cerberus Marshal",
        body: `Do not confuse readiness with wanting disaster.

A good plan is a quiet kindness. Water before thirst. Contact before panic. A chair before collapse. A route before sirens. A buddy before someone disappears into the crowd alone.

Hold the line by making fewer people reach the line broken.`,
      },
      archivistNote: `The bravest person in the room is sometimes the one labeling supplies while everyone else argues about symbols.

The Uprising survives because someone knows where the batteries are.`,
      rewards: [
        "Faction reputation: +25 Myrmidon Grinders standing",
        "Badges: Go-Bag Assembled, Contact Tree Built, Safe Route Mapper, Accessibility Support Logged, De-Escalation Trained",
        "Mission completion badge: Myrmidon Gatewatch Steward",
        "Optional title: Gatewatch Steward",
        "Lore unlock: dead-index-entry-dock-nine-gate",
      ],
      profileBadgePlaceholderNotes:
        "Badge placeholders should use the Myrmidon Grinders palette. Use Furnace Bronze, Hazard Gold, Carbon Black, Blood Signal, and Concrete Ash. The completion badge should include a simple Cerberus gate or shield-like placeholder with text reading MYRMIDON GATEWATCH STEWARD.",
    },
    submissionFields: [
      {
        id: "go-bag-summary",
        label: "Go-bag or emergency supplies checklist summary",
        type: "textarea",
        required: true,
        helpText: "Summary only. No home address required.",
      },
      {
        id: "contact-tree-summary",
        label: "Emergency contact tree structure summary",
        type: "textarea",
        required: true,
        helpText:
          "Describe plan structure only. No phone numbers, addresses, or private contact details.",
      },
      {
        id: "safe-resources-summary",
        label:
          "Safe public resource map summary by category and general area",
        type: "textarea",
        required: true,
        helpText:
          "Libraries, cooling centers, clinics, shelters, transit hubs, community centers, etc.",
      },
      {
        id: "accessibility-checklist",
        label: "Accessibility support checklist",
        type: "textarea",
        required: true,
      },
      {
        id: "de-escalation-summary",
        label:
          "De-escalation training name and date, or nonviolent guide summary",
        type: "textarea",
        required: true,
      },
      {
        id: "nonviolence-affirmation",
        label:
          "I affirm this submission contains no weapons, combat tactics, confrontation plans, or sensitive private information about others.",
        type: "checkbox",
        required: true,
      },
    ],
  },
  {
    slug: "labyrinth-repair-log",
    title: "Labyrinth Repair Log",
    description:
      "Document safe repair, open-source resources, accessibility checks, and offline resource readiness.",
    factionSlug: "daedalus-foundry",
    difficulty: "INITIATE",
    missionType: "REPAIR_AND_OPEN_SOURCE",
    estimatedTime: "2 to 5 hours",
    repeatable: true,
    reputationReward: 20,
    completionBadgeSlug: "daedalus-forge-spark",
    requiredBadgeSlugs: [
      "repo-relic-filed",
      "tool-note-written",
      "repair-log-submitted",
      "accessibility-audit-started",
      "offline-kit-built",
    ],
    submissionType: "LINK_AND_CHECKLIST",
    reviewMode: "MANUAL",
    nonviolenceClassification:
      "Nonviolent, repair/education/accessibility only",
    loreUnlockSlug: "dead-index-entry-hidden-maintenance-tunnel",
    optionalTitle: "Toolsmith Spark",
    badges: [
      {
        slug: "repo-relic-filed",
        name: "Repo Relic Filed",
        requirement:
          "Submit a useful open-source repo, Codeberg project, GitHub project, guide, or public tool resource.",
        proofType: "Link and short description.",
        placeholderText: "REPO",
        placeholderColor: foundryPalette.blueprintBlue,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "tool-note-written",
        name: "Tool Note Written",
        requirement:
          "Explain what the tool or resource does and who it helps.",
        proofType: "100 to 250 word summary.",
        placeholderText: "NOTE",
        placeholderColor: foundryPalette.brassLine,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "repair-log-submitted",
        name: "Repair Log Submitted",
        requirement:
          "Repair, maintain, clean, update, or improve one safe household, digital, or accessibility-related item.",
        proofType: "Short repair log, optional photo if later supported.",
        placeholderText: "REPAIR",
        placeholderColor: foundryPalette.forgeOrange,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "accessibility-audit-started",
        name: "Accessibility Audit Started",
        requirement:
          "Create a basic accessibility checklist for a website, event, room, document, or tool.",
        proofType: "Checklist summary.",
        placeholderText: "ACCESS",
        placeholderColor: foundryPalette.labyrinthGray,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "offline-kit-built",
        name: "Offline Kit Built",
        requirement:
          "Create a small offline resource kit, such as downloaded manuals, maps, emergency docs, or local resource notes.",
        proofType: "Kit contents summary, no sensitive details.",
        placeholderText: "OFFLINE",
        placeholderColor: foundryPalette.blackIron,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "daedalus-forge-spark",
        name: "Daedalus Forge Spark",
        requirement: "Complete all required Labyrinth Repair Log badges.",
        proofType:
          "System or moderator verification of required badge records.",
        placeholderText: "FORGE SPARK",
        placeholderColor: foundryPalette.forgeOrange,
        requiredForMissionCompletion: false,
        isMissionCompletionBadge: true,
      },
    ],
    sections: {
      missionBrief: `The Surface Order teaches people to replace what breaks, rent what they once owned, and accept every locked device as a private little tyrant.

The Daedalus Foundry disagrees.

A repair log is a small rebellion against disposable life. A documented tool is a lantern. An accessibility checklist is a door where a wall used to be. An offline resource kit is memory that does not need permission from the cloud.

No traps. No weapons. No sabotage. Build the exit by making useful things easier to understand.`,
      realWorldPurpose: `This mission encourages practical repair, open-source literacy, documentation, accessibility awareness, and offline resource readiness. It is beginner-friendly and safe. Users can complete it by documenting a useful tool, submitting a repository or resource, maintaining a household item, starting an accessibility checklist, and building a small offline resource kit.`,
      inUniverseContext: `Mara Kallix once built smart-city compliance hardware before realizing every sensor became another brick in the labyrinth. The Foundry now turns maintenance into escape craft. It builds tools that protect care, signal, access, and survival.

A Labyrinth Repair Log is the first mark of a toolsmith. Not because the work is grand. Because it is useful.`,
      objective: `Complete the required Foundry badges:

1. Submit a useful open-source repo, guide, or tool resource.
2. Document who the tool helps and why.
3. Repair, maintain, or improve one household, digital, or accessibility-related item.
4. Start an accessibility checklist.
5. Build a small offline resource kit.

When all required badges are verified, the operative earns the full mission completion badge: Daedalus Forge Spark.`,
      operativeTasks: [
        "Find one useful open-source tool, public guide, repository, or resource.",
        "Submit the link and explain who it helps in plain language.",
        "Complete one safe repair, maintenance, update, cleanup, or improvement task.",
        "Create a simple accessibility checklist for a physical space, document, website, event, or tool.",
        "Build a small offline resource kit with non-sensitive materials that could be useful during outages or service disruptions.",
        "Submit a proof packet with summaries and optional non-sensitive images if later supported.",
      ],
      submissionRequirements: [
        "Link to the repo, guide, or tool resource.",
        "Short summary of what it does and who it helps.",
        "Repair or maintenance log.",
        "Accessibility checklist summary.",
        "Offline kit contents summary.",
      ],
      proofPrivacyNotes: `Do not submit private documents, addresses, passwords, personal IDs, private medical details, copyrighted manuals that cannot be redistributed, or sensitive infrastructure information.

Repair photos, if supported later, should avoid showing private addresses, serial numbers, account data, or identifying information.`,
      safetyNotes: `This mission does not include weapons, traps, destructive devices, sabotage tools, illegal circumvention, unsafe electrical work, or instructions that could harm people or infrastructure.

Users should stay within their skill level. When a task requires a licensed professional, the mission should encourage hiring or consulting one rather than improvising.`,
      successCriteria: [
        "The submitted resource is safe, legal, and useful.",
        "The tool note explains practical benefit.",
        "The repair log describes safe maintenance or improvement.",
        "The accessibility checklist is specific enough to be useful.",
        "The offline kit summary contains non-sensitive materials.",
        "All required badges are verified.",
      ],
      factionLeaderTransmission: {
        speaker: "Mara Kallix, Labyrinth Architect / Forge-Mother",
        body: `A locked door is not always opened by force.

Sometimes it opens because someone documented the hinge. Sometimes because someone fixed the chair. Sometimes because someone kept the manual when the cloud went dark.

Do not worship the tool. Make it useful. Then write down how the next person can use it without begging you.`,
      },
      archivistNote: `The Dead Index loves a good repair log.

Not because it is dramatic.

Because the person who writes the plain instructions is usually the reason someone else gets out.`,
      rewards: [
        "Faction reputation: +20 Daedalus Foundry standing",
        "Badges: Repo Relic Filed, Tool Note Written, Repair Log Submitted, Accessibility Audit Started, Offline Kit Built",
        "Mission completion badge: Daedalus Forge Spark",
        "Optional title: Toolsmith Spark",
        "Lore unlock: dead-index-entry-hidden-maintenance-tunnel",
      ],
      profileBadgePlaceholderNotes:
        "Badge placeholders should use the Daedalus Foundry palette. Use Forge Orange, Blueprint Blue, Black Iron, Brass Line, and Labyrinth Gray. The completion badge should include a simple mechanical wing, key, or labyrinth placeholder with text reading DAEDALUS FORGE SPARK.",
    },
    submissionFields: [
      {
        id: "repo-link",
        label: "Link to open-source repo, guide, or tool resource",
        type: "text",
        required: true,
        placeholder: "https://",
      },
      {
        id: "tool-note",
        label: "Tool note: what it does and who it helps (100 to 250 words)",
        type: "textarea",
        required: true,
      },
      {
        id: "repair-log",
        label: "Repair or maintenance log",
        type: "textarea",
        required: true,
        helpText:
          "Describe one safe repair, maintenance, update, cleanup, or improvement task.",
      },
      {
        id: "accessibility-checklist",
        label: "Accessibility checklist summary",
        type: "textarea",
        required: true,
      },
      {
        id: "offline-kit-summary",
        label: "Offline resource kit contents summary",
        type: "textarea",
        required: true,
        helpText:
          "Non-sensitive materials only: manuals, maps, emergency docs, local resource notes.",
      },
      {
        id: "safe-repair-affirmation",
        label:
          "I affirm this repair work stayed within my skill level, involved no weapons, traps, sabotage, or unsafe electrical work, and that I consulted a licensed professional where required.",
        type: "checkbox",
        required: true,
      },
    ],
  },
  {
    slug: "morale-signal-drop",
    title: "Morale Signal Drop",
    description:
      "Create nonviolent morale art, faction storytelling, and harmless Hades Watch culture signals.",
    factionSlug: "styx-rats",
    difficulty: "INITIATE",
    missionType: "CREATIVE_MORALE",
    estimatedTime: "1 to 4 hours",
    repeatable: true,
    reputationReward: 20,
    completionBadgeSlug: "styx-graffiti-ghost",
    requiredBadgeSlugs: [
      "morale-signal-sent",
      "zine-spark",
      "dead-index-graffiti-line",
      "faction-art-submitted",
      "riot-muse-initiate",
    ],
    submissionType: "TEXT_LINK_OR_UPLOAD",
    reviewMode: "MANUAL",
    nonviolenceClassification:
      "Nonviolent, creative morale/community storytelling only",
    loreUnlockSlug: "dead-index-entry-funeral-carnival",
    optionalTitle: "Graffiti Ghost",
    badges: [
      {
        slug: "morale-signal-sent",
        name: "Morale Signal Sent",
        requirement:
          "Create an original morale signal such as a poster, short transmission, playlist, patch slogan, zine page, or meme.",
        proofType: "Text, link, or upload if later supported.",
        placeholderText: "SIGNAL",
        placeholderColor: ratsPalette.spitePink,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "zine-spark",
        name: "Zine Spark",
        requirement:
          "Write or design one short public-interest explainer in Hades Watch style.",
        proofType: "150 to 400 word text or image upload if later supported.",
        placeholderText: "ZINE",
        placeholderColor: ratsPalette.acidGreen,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "dead-index-graffiti-line",
        name: "Dead Index Graffiti Line",
        requirement:
          "Create a fictional graffiti line or slogan suitable for lore use.",
        proofType: "Text submission.",
        placeholderText: "GRAFFITI",
        placeholderColor: ratsPalette.sewerBlack,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "faction-art-submitted",
        name: "Faction Art Submitted",
        requirement:
          "Submit a harmless creative piece or concept aligned with any Hades Watch faction.",
        proofType: "Text, link, or upload if later supported.",
        placeholderText: "ART",
        placeholderColor: ratsPalette.bruisePurple,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "riot-muse-initiate",
        name: "Riot Muse Initiate",
        requirement:
          "Confirm the submission is legal, non-harassing, non-threatening, and non-destructive.",
        proofType: "Safety affirmation checkbox and short note.",
        placeholderText: "MUSE",
        placeholderColor: ratsPalette.chromeScratch,
        requiredForMissionCompletion: true,
        isMissionCompletionBadge: false,
      },
      {
        slug: "styx-graffiti-ghost",
        name: "Styx Graffiti Ghost",
        requirement: "Complete all required Morale Signal Drop badges.",
        proofType:
          "System or moderator verification of required badge records.",
        placeholderText: "GHOST",
        placeholderColor: ratsPalette.spitePink,
        requiredForMissionCompletion: false,
        isMissionCompletionBadge: true,
      },
    ],
    sections: {
      missionBrief: `The Surface Order wants fear to be the only sound in the city.

The Styx Rats disagree loudly, but not carelessly.

A morale signal can be a poster, a patch slogan, a zine page, a playlist, a meme, a short field transmission, a fictional graffiti line, or a piece of faction art. It can be funny. It can be grieving. It can be ugly in the honest way. It must not harass, threaten, vandalize, dox, intimidate, or endanger anyone.

Joy is sabotage when despair was the assigned interface.`,
      realWorldPurpose: `This mission encourages creative morale, community storytelling, media literacy, art, satire, and public-interest explanation in a safe and ethical format. It gives users a way to participate without requiring technical skill, money, confrontation, or risk.

The goal is to build morale and shared language, not to target real people or damage property.`,
      inUniverseContext: `Rhea Spite founded the Styx Rats by turning grief into public signal. Names of the dead appeared over luxury ads. Strike songs infected sponsored plazas. False gods glitched into jokes the city could breathe through.

The Rats know that morale is infrastructure. A community that can still laugh, mourn, sing, explain, and make things together is harder to bury.`,
      objective: `Complete the required creative morale badges:

1. Create one original morale signal.
2. Write one short Hades Watch style public-interest explainer.
3. Create one fictional Dead Index graffiti line or slogan.
4. Submit one faction-aligned art, audio, writing, playlist, zine, meme, or poster concept.
5. Confirm the work is non-harassing, non-threatening, non-destructive, and legal to share.

When all required badges are verified, the operative earns the full mission completion badge: Styx Graffiti Ghost.`,
      operativeTasks: [
        "Create one original morale signal for the Hades Watch community.",
        "Write a short public-interest explainer in Hades Watch voice. It can explain care, privacy, preparedness, repair, accessibility, media literacy, or mutual aid.",
        "Write one fictional Dead Index graffiti line or slogan.",
        "Submit a creative piece or concept aligned with one faction or the Chthonic Uprising as a whole.",
        "Confirm that the work does not harass, threaten, expose private information, encourage harm, vandalize property, or target real people.",
      ],
      submissionRequirements: [
        "Morale signal text, image, link, or description.",
        "Public-interest explainer.",
        "Fictional graffiti line.",
        "Faction art, audio, playlist, zine, meme, poster concept, or written description.",
        "Safety affirmation.",
      ],
      proofPrivacyNotes: `Users should not submit private information about themselves or others. Submissions should avoid real names, private addresses, personal accusations, identifying images without consent, or copyrighted materials they do not have permission to use.

If uploads are supported later, the site should provide moderation review before public display.`,
      safetyNotes: `This mission is creative and nonviolent. It does not reward vandalism, harassment, threats, intimidation, doxxing, stalking, public shaming, unsafe confrontation, or illegal action.

The Styx Rats use fiction, satire, morale, and art to keep the community breathing. They do not turn people into targets.`,
      successCriteria: [
        "All required creative components are submitted.",
        "The work is original or properly attributed where appropriate.",
        "The submission follows safety and nonviolence rules.",
        "The safety affirmation is completed.",
        "All required badges are verified.",
      ],
      factionLeaderTransmission: {
        speaker: "Rhea Spite, Riot Muse / Ferryman of Bad Ideas",
        body: `Listen.

The gods hate being laughed at because laughter proves they are not weather.

Make something that helps someone breathe. A poster. A song list. A little joke with teeth. A zine page that tells the truth without turning a person into prey.

Paint the bars on paper first. We are not here to get people hurt. We are here to remind them the prison is not the whole world.`,
      },
      archivistNote: `The first time the Rats sent me a morale drop, I thought it was unserious.

Then I watched three exhausted medics laugh for the first time in a week.

I have tried to be less wrong since.`,
      rewards: [
        "Faction reputation: +20 Styx Rats standing",
        "Badges: Morale Signal Sent, Zine Spark, Dead Index Graffiti Line, Faction Art Submitted, Riot Muse Initiate",
        "Mission completion badge: Styx Graffiti Ghost",
        "Optional title: Graffiti Ghost",
        "Lore unlock: dead-index-entry-funeral-carnival",
      ],
      profileBadgePlaceholderNotes:
        "Badge placeholders should use the Styx Rats palette. Use Spite Pink, Acid Green, Sewer Black, Chrome Scratch, and Bruise Purple. The completion badge should include a simple rat skull, ferryman coin, broken halo, or text-only placeholder reading STYX GRAFFITI GHOST.",
    },
    submissionFields: [
      {
        id: "morale-signal",
        label: "Original morale signal (poster, transmission, playlist, patch slogan, zine page, meme, etc.)",
        type: "textarea",
        required: true,
      },
      {
        id: "zine-explainer",
        label:
          "Public-interest explainer in Hades Watch style (150 to 400 words)",
        type: "textarea",
        required: true,
      },
      {
        id: "graffiti-line",
        label: "Fictional Dead Index graffiti line or slogan",
        type: "textarea",
        required: true,
      },
      {
        id: "faction-art",
        label:
          "Faction-aligned art, audio, playlist, zine, meme, poster concept, or written description",
        type: "textarea",
        required: true,
        helpText: "Text or link. Upload support may be added later.",
      },
      {
        id: "safety-affirmation",
        label:
          "I affirm this work is legal, non-harassing, non-threatening, non-destructive, and does not target real people, expose private information, or encourage harm or vandalism.",
        type: "checkbox",
        required: true,
      },
      {
        id: "safety-note",
        label: "Optional safety note or attribution",
        type: "textarea",
        required: false,
      },
    ],
  },
];
