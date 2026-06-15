import { CHTHONIC_FACTIONS } from "@/lib/factions/chthonic-data";
import type { MissionPackMissionDefinition } from "@/lib/missions/types";

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

const deadIndexPalette = {
  obsidian: "#0B0A10",
  ultraviolet: "#6B2FD6",
  parchmentBone: "#E8DFC8",
  pomegranateBlack: "#1A0A12",
};

const hearthAmber = "#FFB347";

export const UNDERWATCH_CIVIC_ACTION_PACK_ID =
  "underwatch-civic-action-protocols";

export const UNDERWATCH_CIVIC_ACTION_PACK_INTRO =
  "This mission pack expands Hades Watch from first-readiness work into safe, legal, nonviolent civic action loops. It covers everyday activism, civic participation, campaign strategy, writing and media literacy, visual activism, data literacy, community service, movement archiving, and nonviolent field preparation. Any approved operative from any faction can complete these support missions. Cross-faction work builds faction standing and alliance trust.";

export const UNDERWATCH_CIVIC_ACTION_MISSION_SLUGS = [
  "signal-hearth",
  "council-pulse",
  "campaign-spine",
  "quiet-megaphone",
  "street-canvas",
  "pulse-survey",
  "hands-to-ground",
  "mirror-archive",
  "affinity-thread",
] as const;

export const UNDERWATCH_CIVIC_ACTION_MISSIONS: MissionPackMissionDefinition[] =
  [
    {
      slug: "signal-hearth",
      title: "Signal Hearth",
      description:
        "Turn concern into one small civic action and one local connection.",
      factionSlug: "styx-rats",
      difficulty: "INITIATE",
      missionType: "EVERYDAY_ACTIVISM",
      estimatedTime: "30 to 60 minutes",
      repeatable: true,
      reputationReward: 15,
      completionBadgeSlug: "neighborhood-lantern",
      requiredBadgeSlugs: ["hearth-ember"],
      submissionType: "REDACTED_REFLECTION",
      reviewMode: "MANUAL_OR_AUTOMATED",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, community connection and reflection only",
      loreUnlockSlug: "dead-index-entry-hearth-signals",
      optionalTitle: "Hearth Runner",
      badges: [
        {
          slug: "hearth-ember",
          name: "Hearth Ember",
          requirement:
            "Complete one private cause reflection and list three concrete next actions.",
          proofType: "Redacted reflection summary.",
          placeholderText: "HEARTH",
          placeholderColor: hearthAmber,
          requiredForMissionCompletion: true,
          isMissionCompletionBadge: false,
        },
        {
          slug: "neighborhood-lantern",
          name: "Neighborhood Lantern",
          requirement:
            "Log one local group connection and one follow-up action.",
          proofType: "Group type and redacted follow-up note.",
          placeholderText: "LANTERN",
          placeholderColor: ratsPalette.spitePink,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `The Surface Order wants every concern to feel lonely.

The Styx Rats know loneliness is a containment field. Signal Hearth breaks it gently. One cause. One small action. One local connection. One follow-up that does not need applause to matter.

This is not a spectacle mission. It is a hearth mission.

Warm signal. Low flame. Hard to extinguish.`,
        realWorldPurpose: `This mission helps operatives convert vague concern into small, repeatable civic habits. It rewards reflection, local connection, and follow-through rather than performative posting.`,
        inUniverseContext: `The Rats are not only billboard ghosts and neon mockery. They are connective tissue. Rumor runners. Morale workers. The ones who know which kitchen needs help, which meeting was missed, which neighbor has been screaming into the void, and which small signal could keep someone from quitting.`,
        objective: `Choose one cause or community issue, identify three small next actions, connect with one local or mission-aligned group, and log one follow-up.`,
        operativeTasks: [
          "Pick one cause, issue, or community need that matters to you.",
          "Write a private reflection on why it matters and what would help.",
          "Choose three small next actions that are legal, safe, and realistic.",
          "Identify one local organization, mutual aid group, public institution, campaign, or community space connected to the issue.",
          "Take one low-risk follow-up action, such as subscribing to updates, attending a public info session, sharing a public resource, volunteering through official channels, or making a respectful inquiry.",
          "Submit a redacted proof packet.",
        ],
        submissionRequirements: [
          "Short cause summary.",
          "Three concrete next actions.",
          "Type of group or institution contacted.",
          "One redacted follow-up note.",
          "Confirmation that no private personal data about others is included.",
        ],
        proofPrivacyNotes: `Journaling can remain private. The site should only collect a short redacted summary. Do not require screenshots of private messages, mailing list emails, group chats, or contact details.`,
        safetyNotes: `This mission rewards low-risk connection and civic follow-through. It does not involve confrontation, harassment, intimidation, illegal activity, property damage, or public targeting.`,
        successCriteria: [
          "Cause summary is provided.",
          "Three concrete next actions are listed.",
          "One connection or resource is identified.",
          "One follow-up action is documented.",
          "No sensitive information is included.",
        ],
        factionLeaderTransmission: {
          speaker: "Rhea Spite, Riot Muse / Ferryman of Bad Ideas",
          body: `Not every signal has to scream.

Some signals keep a room warm. Some signals say, "I am still here, and I found one more person who cares."

The gods hate that too.`,
        },
        archivistNote: `Start small enough to repeat.

The Surface Order trained us to confuse scale with worth. A lantern is not useless because it is not the sun.`,
        rewards: [
          "Faction reputation: +15 Styx Rats standing",
          "Badges: Hearth Ember",
          "Mission completion badge: Neighborhood Lantern",
          "Optional title: Hearth Runner",
          "Lore unlock: dead-index-entry-hearth-signals",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use Styx Rats colors softened for warmth: Spite Pink, Acid Green, Sewer Black, Chrome Scratch, and a warm amber hearth accent. The completion badge should read NEIGHBORHOOD LANTERN.",
      },
      submissionFields: [
        {
          id: "cause-summary",
          label: "Short cause or community issue summary",
          type: "textarea",
          required: true,
          helpText: "Redacted summary only. Keep private journaling off the submission.",
        },
        {
          id: "next-actions",
          label: "Three concrete next actions (legal, safe, and realistic)",
          type: "textarea",
          required: true,
        },
        {
          id: "group-connection",
          label: "Type of local group, institution, or resource identified",
          type: "textarea",
          required: true,
        },
        {
          id: "follow-up-note",
          label: "Redacted follow-up action note",
          type: "textarea",
          required: true,
          helpText:
            "Do not include private messages, contact details, or personal data about others.",
        },
        {
          id: "privacy-affirmation",
          label:
            "I affirm this submission includes no private personal data about others, no screenshots of private messages, and no contact details.",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      slug: "council-pulse",
      title: "Council Pulse",
      description:
        "Complete one lawful civic contact or public meeting review with a redacted follow-up.",
      factionSlug: "myrmidon-grinders",
      difficulty: "FIELD",
      missionType: "CIVIC_PARTICIPATION",
      estimatedTime: "60 to 120 minutes",
      repeatable: true,
      reputationReward: 30,
      completionBadgeSlug: "quorum-ghost",
      requiredBadgeSlugs: ["switchboard-ember"],
      submissionType: "REDACTED_CIVIC_LOG",
      reviewMode: "MANUAL",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, lawful civic participation only",
      loreUnlockSlug: "dead-index-entry-quorum-ghosts",
      optionalTitle: "Civic Line Holder",
      badges: [
        {
          slug: "switchboard-ember",
          name: "Switchboard Ember",
          requirement:
            "Submit one redacted office-contact log and one issue summary.",
          proofType:
            "Contact type, date, issue summary, no private constituent data.",
          placeholderText: "CALL",
          placeholderColor: grindersPalette.hazardGold,
          requiredForMissionCompletion: true,
          isMissionCompletionBadge: false,
        },
        {
          slug: "quorum-ghost",
          name: "Quorum Ghost",
          requirement:
            "Attend, watch, or review one public meeting or public agenda and submit a redacted summary or comment.",
          proofType: "Redacted meeting note or public agenda summary.",
          placeholderText: "QUORUM",
          placeholderColor: grindersPalette.furnaceBronze,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `The Grinders do not only hold doors in emergencies.

Sometimes the gate is a public agenda. Sometimes the gate is a meeting room with bad lighting. Sometimes the gate is a phone line, a comment portal, a committee calendar, or a deadline nobody advertised because silence benefits the machine.

Council Pulse trains operatives to document civic pressure without exposing private life.`,
        realWorldPurpose: `This mission helps operatives practice lawful civic participation. It can include checking relevant civic status, reviewing a public agenda, contacting an office, attending or watching a public meeting, and writing a redacted follow-up summary.`,
        inUniverseContext: `The Surface Order hollowed public accountability by making civic process exhausting, opaque, and humiliating. The Grinders answer with attendance discipline. Not force. Presence. Notes. Follow-up. Clear asks. No one left alone in the room.`,
        objective: `Turn one issue concern into one documented civic contact, meeting review, or public comment record.`,
        operativeTasks: [
          "Pick one local, state, school, workplace, or public issue that matters to you.",
          "Identify one relevant public office, committee, meeting, agenda, or public comment channel.",
          "Make one lawful civic contact or review one public meeting or agenda.",
          "Write a concise redacted summary of what happened.",
          "Record one next step.",
        ],
        submissionRequirements: [
          "Issue focus.",
          "Public office or meeting type.",
          "Date of contact or review.",
          "Redacted summary.",
          "One next step.",
        ],
        proofPrivacyNotes: `Do not submit personal addresses, phone numbers, full names of private people, constituent identifiers, screenshots that reveal private data, or private correspondence.

Summaries are enough. The proof packet should verify that civic participation happened without turning the operative into a dossier target.`,
        safetyNotes: `This mission is limited to lawful civic participation, meeting literacy, and respectful contact. It does not reward disruption, harassment, threats, intimidation, confrontation, or evasion of public rules.`,
        successCriteria: [
          "Issue focus is clear.",
          "One civic contact or meeting review is documented.",
          "Summary is redacted.",
          "A next step is listed.",
          "Submission follows nonviolence and privacy rules.",
        ],
        factionLeaderTransmission: {
          speaker: "Brontes Vale, Cerberus Marshal",
          body: `Showing up is not glamorous.

Good. Glamour makes people sloppy.

Bring notes. Bring patience. Bring one clear ask. Leave with one next step. That is how a gate starts remembering it has hinges.`,
        },
        archivistNote: `The public record is only public if people can survive long enough to use it.

Write things down. Redact what needs redacting. Follow the thread.`,
        rewards: [
          "Faction reputation: +30 Myrmidon Grinders standing",
          "Badges: Switchboard Ember",
          "Mission completion badge: Quorum Ghost",
          "Optional title: Civic Line Holder",
          "Lore unlock: dead-index-entry-quorum-ghosts",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use the Myrmidon Grinders palette: Furnace Bronze, Hazard Gold, Carbon Black, Blood Signal, and Concrete Ash. The completion badge should read QUORUM GHOST.",
      },
      submissionFields: [
        {
          id: "issue-focus",
          label: "Issue focus",
          type: "textarea",
          required: true,
        },
        {
          id: "civic-contact-type",
          label: "Public office, meeting type, or comment channel",
          type: "textarea",
          required: true,
        },
        {
          id: "contact-date",
          label: "Date of contact or review",
          type: "text",
          required: true,
        },
        {
          id: "redacted-summary",
          label: "Redacted summary of contact or meeting review",
          type: "textarea",
          required: true,
          helpText:
            "No personal addresses, phone numbers, constituent identifiers, or private correspondence.",
        },
        {
          id: "next-step",
          label: "One next step",
          type: "textarea",
          required: true,
        },
        {
          id: "nonviolence-affirmation",
          label:
            "I affirm this submission reflects lawful civic participation only, with no harassment, threats, intimidation, or disruption.",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      slug: "campaign-spine",
      title: "Campaign Spine",
      description:
        "Build a redaction-safe campaign plan with objectives, tactics, risk notes, and evaluation.",
      factionSlug: "oracular-circuit",
      difficulty: "SPECIALIST",
      missionType: "CAMPAIGN_STRATEGY",
      estimatedTime: "2 to 4 hours",
      repeatable: true,
      reputationReward: 40,
      completionBadgeSlug: "theory-spline",
      requiredBadgeSlugs: ["objective-smith"],
      submissionType: "REDACTED_PLANNING_SHEET",
      reviewMode: "MANUAL",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, strategic planning and education only",
      loreUnlockSlug: "dead-index-entry-theory-spline",
      optionalTitle: "Objective Smith",
      badges: [
        {
          slug: "objective-smith",
          name: "Objective Smith",
          requirement:
            "Define vision, stakeholders, one goal, and at least three measurable objectives.",
          proofType: "Redacted planning sheet.",
          placeholderText: "OBJECTIVE",
          placeholderColor: circuitPalette.oracleViolet,
          requiredForMissionCompletion: true,
          isMissionCompletionBadge: false,
        },
        {
          slug: "theory-spline",
          name: "Theory Spline",
          requirement:
            "Complete tactics, risk notes, and evaluation fields for one campaign plan.",
          proofType: "Redacted strategy summary.",
          placeholderText: "SPLINE",
          placeholderColor: circuitPalette.prophecyBlue,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `An oracle loves vague outrage.

Vague outrage is easy to price, easy to redirect, easy to exhaust.

Campaign Spine teaches operatives to give a cause bones: vision, stakeholders, goals, measurable objectives, tactics, risks, and evaluation. No secret command fantasy. No unsafe escalation. Just a disciplined plan that can be reviewed without feeding the Census more than it needs.`,
        realWorldPurpose: `This mission teaches safe campaign planning basics. It helps operatives turn issue energy into structured thinking that can guide lawful, ethical, nonviolent civic work.`,
        inUniverseContext: `Cassian Nyx does not trust prophecy. They trust models only after they can see the assumptions, the data, the failure points, and the exit paths.

A campaign without a spine becomes content. A campaign with a spine can learn.`,
        objective: `Complete a redaction-safe campaign planning sheet with vision, stakeholders, one goal, three measurable objectives, tactics, risk notes, and evaluation criteria.`,
        operativeTasks: [
          "Write a one-paragraph vision.",
          "Identify affected communities, allies, decision-makers, institutions, obstacles, and audiences.",
          "Convert the vision into one goal.",
          "Write three measurable objectives.",
          "Match one safe, lawful, nonviolent tactic to each objective.",
          "Add one risk or local-context note.",
          "Define how progress will be evaluated.",
        ],
        submissionRequirements: [
          "Vision paragraph.",
          "Stakeholder map summary.",
          "One goal.",
          "Three objectives.",
          "Tactic-to-objective mapping.",
          "Risk or local-context note.",
          "Evaluation plan.",
        ],
        proofPrivacyNotes: `Do not submit private participant directories, sensitive strategy chats, illegal plans, private personal data, or details that could endanger a group.

Active campaign strategy should default to private or team-only visibility. Public summaries should be redacted.`,
        safetyNotes: `This mission is for lawful nonviolent planning only. It does not reward unlawful tactics, evasion, sabotage, harassment, threats, or confrontation.`,
        successCriteria: [
          "Campaign plan contains all required fields.",
          "Objectives are specific enough to evaluate.",
          "Tactics are safe and nonviolent.",
          "Sensitive information is redacted.",
          "Evaluation criteria are included.",
        ],
        factionLeaderTransmission: {
          speaker: "Cassian Nyx, Oracle-Breaker",
          body: `The machine loves when you cannot name what you want.

Name it.

Then measure it.

Then test whether the tactic serves the objective or merely feeds the feed.`,
        },
        archivistNote: `A plan is not a prophecy.

It is a promise to check whether you are still walking toward the thing you meant to build.`,
        rewards: [
          "Faction reputation: +40 Oracular Circuit standing",
          "Badges: Objective Smith",
          "Mission completion badge: Theory Spline",
          "Optional title: Objective Smith",
          "Lore unlock: dead-index-entry-theory-spline",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use the Oracular Circuit palette: Oracle Violet, Signal Cyan, Black Glass, Static White, and Prophecy Blue. The completion badge should read THEORY SPLINE.",
      },
      submissionFields: [
        {
          id: "vision",
          label: "One-paragraph vision",
          type: "textarea",
          required: true,
        },
        {
          id: "stakeholders",
          label: "Stakeholder map summary",
          type: "textarea",
          required: true,
          helpText:
            "Affected communities, allies, decision-makers, institutions, obstacles, and audiences.",
        },
        {
          id: "goal",
          label: "One campaign goal",
          type: "textarea",
          required: true,
        },
        {
          id: "objectives",
          label: "Three measurable objectives",
          type: "textarea",
          required: true,
        },
        {
          id: "tactics",
          label: "Safe, lawful, nonviolent tactic for each objective",
          type: "textarea",
          required: true,
        },
        {
          id: "risk-note",
          label: "Risk or local-context note",
          type: "textarea",
          required: true,
        },
        {
          id: "evaluation",
          label: "Evaluation plan",
          type: "textarea",
          required: true,
        },
        {
          id: "nonviolence-affirmation",
          label:
            "I affirm this plan contains only lawful, nonviolent tactics with no illegal plans, evasion, sabotage, harassment, or confrontation.",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      slug: "quiet-megaphone",
      title: "Quiet Megaphone",
      description:
        "Create one ethical public-interest explainer or media relay with source and redaction notes.",
      factionSlug: "oracular-circuit",
      difficulty: "FIELD",
      missionType: "WRITING_AND_MEDIA_LITERACY",
      estimatedTime: "2 to 6 hours",
      repeatable: true,
      reputationReward: 25,
      completionBadgeSlug: "relay-editor",
      requiredBadgeSlugs: ["byline-spark"],
      submissionType: "TEXT_LINK_AND_SOURCE_NOTES",
      reviewMode: "MANUAL",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, writing and media education only",
      loreUnlockSlug: "dead-index-entry-quiet-megaphone",
      optionalTitle: "Relay Editor",
      badges: [
        {
          slug: "byline-spark",
          name: "Byline Spark",
          requirement:
            "Write one issue explainer, letter, op-ed style draft, or public-interest artifact.",
          proofType: "Text submission or public link.",
          placeholderText: "BYLINE",
          placeholderColor: circuitPalette.staticWhite,
          requiredForMissionCompletion: true,
          isMissionCompletionBadge: false,
        },
        {
          slug: "relay-editor",
          name: "Relay Editor",
          requirement:
            "Add source notes, redaction check, and share-ready summary.",
          proofType: "Source list and redacted summary.",
          placeholderText: "RELAY",
          placeholderColor: circuitPalette.signalCyan,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `Not every megaphone has to be loud.

Some of the strongest signals are clear, sourced, humane, and boring enough to survive scrutiny.

Quiet Megaphone trains operatives to write one useful public-interest explainer, letter, brief, or narrative relay that helps people understand an issue without exposing private people to the machine.`,
        realWorldPurpose: `This mission builds writing, media literacy, source discipline, and public-interest communication. It rewards clarity, attribution, consent awareness, and redaction.`,
        inUniverseContext: `The Oracular Circuit does not only break hostile prediction. It also breaks confusion. Propaganda thrives where people cannot tell what happened, who benefits, what is known, and what remains uncertain.

A quiet megaphone is a signal with enough discipline to avoid becoming noise.`,
        objective: `Create one public-interest explainer, letter, op-ed style draft, media brief, or resource relay with sources, consent-aware language, and a redacted sharing version.`,
        operativeTasks: [
          "Pick one issue or public-interest topic.",
          "Write a clear explainer or advocacy artifact.",
          "Include a short list of sources, references, or public documents used.",
          "Add a redaction and consent check.",
          "Create a short share-ready summary.",
        ],
        submissionRequirements: [
          "Draft or public link.",
          "Topic and intended audience.",
          "Source list.",
          "Redaction and consent note.",
          "Share-ready summary.",
        ],
        proofPrivacyNotes: `Do not include personal data, exposed faces, private messages, private names, sensitive identities, or traumatic details without consent. Attribute sources. Avoid presenting rumor as confirmed fact.`,
        safetyNotes: `This mission does not reward harassment, targeted abuse, doxxing, threats, intimidation, or misinformation. It is for public-interest education and ethical communication only.`,
        successCriteria: [
          "Piece is coherent and public-interest oriented.",
          "Sources or references are named.",
          "Redaction and consent notes are included.",
          "Content avoids harassment and private data exposure.",
        ],
        factionLeaderTransmission: {
          speaker: "Cassian Nyx, Oracle-Breaker",
          body: `A bad signal does not become good because it hates the right enemy.

Write clean. Mark uncertainty. Cite what you can. Protect who you must.

Then let the signal travel.`,
        },
        archivistNote: `The Dead Index has enough screams.

Give it something useful too.`,
        rewards: [
          "Faction reputation: +25 Oracular Circuit standing",
          "Badges: Byline Spark",
          "Mission completion badge: Relay Editor",
          "Optional title: Relay Editor",
          "Lore unlock: dead-index-entry-quiet-megaphone",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use the Oracular Circuit palette with extra Static White for readable text. The completion badge should read RELAY EDITOR.",
      },
      submissionFields: [
        {
          id: "draft-or-link",
          label: "Draft text or public link",
          type: "textarea",
          required: true,
        },
        {
          id: "topic-audience",
          label: "Topic and intended audience",
          type: "textarea",
          required: true,
        },
        {
          id: "source-list",
          label: "Source list or references",
          type: "textarea",
          required: true,
        },
        {
          id: "redaction-consent",
          label: "Redaction and consent check note",
          type: "textarea",
          required: true,
          helpText:
            "Note what was redacted and how consent was considered for any personal details.",
        },
        {
          id: "share-summary",
          label: "Share-ready summary",
          type: "textarea",
          required: true,
        },
        {
          id: "ethics-affirmation",
          label:
            "I affirm this work avoids harassment, doxxing, threats, misinformation, and exposure of private data without consent.",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      slug: "street-canvas",
      title: "Street Canvas",
      description:
        "Create one lawful accessible visual asset or concept with alt text and display notes.",
      factionSlug: "daedalus-foundry",
      difficulty: "FIELD",
      missionType: "VISUAL_ACTIVISM",
      estimatedTime: "3 to 8 hours",
      repeatable: true,
      reputationReward: 25,
      completionBadgeSlug: "wall-bloom",
      requiredBadgeSlugs: [],
      submissionType: "TEXT_LINK_OR_UPLOAD",
      reviewMode: "MANUAL",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, lawful creative design only",
      loreUnlockSlug: "dead-index-entry-wall-bloom",
      optionalTitle: "Visual Toolsmith",
      badges: [
        {
          slug: "wall-bloom",
          name: "Wall Bloom",
          requirement:
            "Submit one visual asset or visual asset concept with alt text and accessibility notes.",
          proofType:
            "Image upload, link, or detailed description if uploads are not supported.",
          placeholderText: "BLOOM",
          placeholderColor: foundryPalette.forgeOrange,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `A poster can be a tool.

A zine can be a door.

A banner can be a map of feeling, a way for someone to find the room where they are not alone.

Street Canvas asks operatives to build a lawful visual asset with accessibility notes and a plan that does not depend on vandalism, harassment, or spectacle that puts people at risk.`,
        realWorldPurpose: `This mission develops visual communication, accessibility, alt text, permission-aware display planning, and reusable creative asset production.`,
        inUniverseContext: `The Foundry builds tools. Not all tools are metal. Some are printable. Some are readable at a distance. Some help people understand where to go, who to call, or why the god on the billboard is lying.`,
        objective: `Create one poster, banner concept, zine page, stencil-style digital asset, share graphic, or visual resource pack with alt text, accessibility notes, and a lawful display or sharing plan.`,
        operativeTasks: [
          "Choose a civic, care, privacy, morale, or community issue.",
          "Create one visual asset or visual concept.",
          "Add alt text.",
          "Add a plain-language accessibility note, such as font readability, contrast, language clarity, or screen-reader considerations.",
          "Add a lawful sharing or display plan.",
          "Submit the asset or concept.",
        ],
        submissionRequirements: [
          "Visual asset, link, or description.",
          "Issue or purpose.",
          "Alt text.",
          "Accessibility note.",
          "Lawful sharing or display plan.",
        ],
        proofPrivacyNotes: `Do not include private faces, names, addresses, license plates, medical details, or copyrighted material without permission. Do not submit illegal display plans.`,
        safetyNotes: `This mission does not reward vandalism, property damage, threats, harassment, intimidation, or targeting people. Public display must be lawful and consent-aware.`,
        successCriteria: [
          "Visual asset or clear concept is submitted.",
          "Alt text is included.",
          "Accessibility notes are included.",
          "Sharing or display plan is lawful and non-harmful.",
        ],
        factionLeaderTransmission: {
          speaker: "Mara Kallix, Labyrinth Architect",
          body: `If someone cannot read it, use it, print it, hear it, translate it, or survive being associated with it, then it is not finished.

Make the tool beautiful after it becomes useful.`,
        },
        archivistNote: `A good poster is a small machine.

It should carry meaning without making the viewer bleed for it.`,
        rewards: [
          "Faction reputation: +25 Daedalus Foundry standing",
          "Mission completion badge: Wall Bloom",
          "Optional title: Visual Toolsmith",
          "Lore unlock: dead-index-entry-wall-bloom",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use the Daedalus Foundry palette: Forge Orange, Blueprint Blue, Black Iron, Brass Line, and Labyrinth Gray. The completion badge should read WALL BLOOM.",
      },
      submissionFields: [
        {
          id: "visual-asset",
          label: "Visual asset, link, or detailed concept description",
          type: "textarea",
          required: true,
        },
        {
          id: "issue-purpose",
          label: "Issue or purpose",
          type: "textarea",
          required: true,
        },
        {
          id: "alt-text",
          label: "Alt text",
          type: "textarea",
          required: true,
        },
        {
          id: "accessibility-note",
          label: "Accessibility note (contrast, font readability, language clarity, screen-reader considerations)",
          type: "textarea",
          required: true,
        },
        {
          id: "display-plan",
          label: "Lawful sharing or display plan",
          type: "textarea",
          required: true,
        },
        {
          id: "lawful-display-affirmation",
          label:
            "I affirm this asset and display plan are lawful, consent-aware, and involve no vandalism, property damage, harassment, or targeting of people.",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      slug: "pulse-survey",
      title: "Pulse Survey",
      description:
        "Create a consent-based low-risk survey and submit anonymized findings with one recommendation.",
      factionSlug: "oracular-circuit",
      difficulty: "SPECIALIST",
      missionType: "DATA_LITERACY",
      estimatedTime: "3 to 5 hours",
      repeatable: true,
      reputationReward: 35,
      completionBadgeSlug: "pattern-reader",
      requiredBadgeSlugs: ["consent-toggle"],
      submissionType: "ANONYMIZED_SUMMARY",
      reviewMode: "MANUAL",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, consent-based data literacy only",
      loreUnlockSlug: "dead-index-entry-consent-toggle",
      optionalTitle: "Pattern Reader",
      badges: [
        {
          slug: "consent-toggle",
          name: "Consent Toggle",
          requirement:
            "Write a short consent statement and data minimization note.",
          proofType: "Consent text and minimization note.",
          placeholderText: "CONSENT",
          placeholderColor: circuitPalette.signalCyan,
          requiredForMissionCompletion: true,
          isMissionCompletionBadge: false,
        },
        {
          slug: "pattern-reader",
          name: "Pattern Reader",
          requirement:
            "Submit anonymized findings and one recommendation.",
          proofType: "Summary only, no raw sensitive data.",
          placeholderText: "PATTERN",
          placeholderColor: circuitPalette.oracleViolet,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `The Surface Order collects everything and understands nothing.

Pulse Survey teaches the opposite: collect little, ask clearly, protect people, summarize humbly, and turn findings into one useful recommendation.

Data can be care when consent is real and the archive knows when to forget.`,
        realWorldPurpose: `This mission teaches basic consent-based data literacy. Operatives create a small voluntary survey, collect non-sensitive responses, anonymize findings, and write one recommendation.`,
        inUniverseContext: `The Circuit studies hostile prediction engines, but it also teaches better habits. Not every dataset needs to become a cage. Some can become a mirror, used briefly and handled carefully.`,
        objective: `Design and complete a small consent-based survey or feedback collection with anonymized findings and one recommendation.`,
        operativeTasks: [
          "Pick a low-risk question related to community needs, accessibility, media habits, resource awareness, or support preferences.",
          "Write a short consent statement.",
          "Collect only minimal, non-sensitive data.",
          "Summarize findings without identifying participants.",
          "Write one recommendation based on the findings.",
          "Delete or secure raw data according to the consent statement.",
        ],
        submissionRequirements: [
          "Survey question or feedback prompt.",
          "Consent statement.",
          "Data minimization note.",
          "Anonymized findings.",
          "One recommendation.",
          "Note on raw data deletion or secure retention.",
        ],
        proofPrivacyNotes: `Do not collect or submit names, addresses, phone numbers, medical details, immigration status, passwords, private identities, or sensitive political affiliations. Keep raw responses private and avoid uploading them.`,
        safetyNotes: `This mission does not reward surveillance, scraping, coercive research, doxxing, targeting, or exposure. Participation must be voluntary and low-risk.`,
        successCriteria: [
          "Consent language is included.",
          "Data collection is minimal and low-risk.",
          "Findings are anonymized.",
          "One recommendation is included.",
          "No sensitive raw data is submitted.",
        ],
        factionLeaderTransmission: {
          speaker: "Cassian Nyx, Oracle-Breaker",
          body: `The question is part of the machine.

Write it like you know that.

Ask less. Protect more. Learn only what you need to help.`,
        },
        archivistNote: `The Dead Index remembers with intent.

It also refuses to hoard what should never have been taken.`,
        rewards: [
          "Faction reputation: +35 Oracular Circuit standing",
          "Badges: Consent Toggle",
          "Mission completion badge: Pattern Reader",
          "Optional title: Pattern Reader",
          "Lore unlock: dead-index-entry-consent-toggle",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use the Oracular Circuit palette with a mint safety accent. The completion badge should read PATTERN READER.",
      },
      submissionFields: [
        {
          id: "survey-question",
          label: "Survey question or feedback prompt",
          type: "textarea",
          required: true,
        },
        {
          id: "consent-statement",
          label: "Consent statement",
          type: "textarea",
          required: true,
        },
        {
          id: "minimization-note",
          label: "Data minimization note",
          type: "textarea",
          required: true,
        },
        {
          id: "anonymized-findings",
          label: "Anonymized findings summary",
          type: "textarea",
          required: true,
          helpText: "No names, addresses, or identifying details.",
        },
        {
          id: "recommendation",
          label: "One recommendation based on findings",
          type: "textarea",
          required: true,
        },
        {
          id: "data-retention",
          label: "Note on raw data deletion or secure retention",
          type: "textarea",
          required: true,
        },
        {
          id: "consent-affirmation",
          label:
            "I affirm participation was voluntary, data collection was minimal and low-risk, and no sensitive raw data is included in this submission.",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      slug: "hands-to-ground",
      title: "Hands to Ground",
      description:
        "Complete one safe, redacted community support action.",
      factionSlug: "asclepian-veil",
      difficulty: "INITIATE",
      missionType: "COMMUNITY_SERVICE",
      estimatedTime: "1 to 3 hours",
      repeatable: true,
      reputationReward: 25,
      completionBadgeSlug: "mutual-aid-hand",
      requiredBadgeSlugs: [],
      submissionType: "REDACTED_SERVICE_LOG",
      reviewMode: "MANUAL",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, care and community service only",
      loreUnlockSlug: "dead-index-entry-hands-to-ground",
      optionalTitle: "Care Runner",
      badges: [
        {
          slug: "mutual-aid-hand",
          name: "Mutual Aid Hand",
          requirement:
            "Complete one documented service or support action.",
          proofType: "Redacted service summary.",
          placeholderText: "AID",
          placeholderColor: veilPalette.veilGreen,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `Care is not a mood.

Care is a calendar entry, a ride, a meal, a shelf restocked, a form explained, a chair moved, a message answered, a person remembered without being turned into content.

Hands to Ground asks operatives to complete one grounded support action through safe, lawful, consent-aware channels.`,
        realWorldPurpose: `This mission encourages community service, mutual aid support, volunteer follow-through, and privacy-respecting care. It can be completed through recognized organizations, community groups, public service efforts, or safe informal support with consent.`,
        inUniverseContext: `The Asclepian Veil knows that survival is built from boring miracles. The Surface Order treats care as a billable event. The Veil treats care as infrastructure.`,
        objective: `Complete one safe support action and document it without exposing recipients.`,
        operativeTasks: [
          "Identify one safe support action, such as volunteering, resource sorting, community food work, supply delivery through official channels, public resource sharing, accessibility support, or helping someone with consent.",
          "Verify the organization or support channel if applicable.",
          "Complete the action.",
          "Write a redacted summary.",
          "Note one thing that would make the support easier next time.",
        ],
        submissionRequirements: [
          "Type of support action.",
          "Date or time range.",
          "Organization type or context.",
          "Redacted summary.",
          "One improvement note.",
        ],
        proofPrivacyNotes: `Do not submit names, faces, addresses, medical details, immigration details, financial details, or private stories of aid recipients. Public gratitude should never become beneficiary exposure.`,
        safetyNotes: `This mission does not reward unsafe medical practice, confrontation, illegal activity, or unsanctioned intervention. Users should follow local rules and organizational guidance.`,
        successCriteria: [
          "Safe support action is documented.",
          "Summary is redacted.",
          "Recipient privacy is protected.",
          "Action is legal, ethical, and nonviolent.",
        ],
        factionLeaderTransmission: {
          speaker: "Circe Runic, Veil-Cantor",
          body: `Do not make a spectacle of someone else's need.

Bring the water. Carry the box. Learn the form. Wash your hands. Ask before helping. Leave no one more exposed than you found them.

That is medicine too.`,
        },
        archivistNote: `The archive remembers the grand gestures because they are loud.

The living survive because someone did the small work without demanding a hymn.`,
        rewards: [
          "Faction reputation: +25 Asclepian Veil standing",
          "Mission completion badge: Mutual Aid Hand",
          "Optional title: Care Runner",
          "Lore unlock: dead-index-entry-hands-to-ground",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use Asclepian Veil colors: Veil Green, Bone White, Surgical Silver, Emergency Pomegranate, and Underclinic Black. The completion badge should read MUTUAL AID HAND.",
      },
      submissionFields: [
        {
          id: "support-type",
          label: "Type of support action",
          type: "textarea",
          required: true,
        },
        {
          id: "action-date",
          label: "Date or time range",
          type: "text",
          required: true,
        },
        {
          id: "organization-context",
          label: "Organization type or context",
          type: "textarea",
          required: true,
        },
        {
          id: "redacted-summary",
          label: "Redacted service summary",
          type: "textarea",
          required: true,
          helpText:
            "No names, faces, addresses, medical details, or private stories of aid recipients.",
        },
        {
          id: "improvement-note",
          label: "One thing that would make the support easier next time",
          type: "textarea",
          required: true,
        },
        {
          id: "privacy-affirmation",
          label:
            "I affirm this submission protects recipient privacy and describes a safe, lawful, consent-aware support action only.",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      slug: "mirror-archive",
      title: "Mirror Archive",
      description:
        "Preserve low-risk movement memory with metadata, consent notes, and debrief practice.",
      factionSlug: "chthonic-uprising",
      difficulty: "SPECIALIST",
      missionType: "ARCHIVING_AND_DOCUMENTATION_ETHICS",
      estimatedTime: "2 to 6 hours",
      repeatable: true,
      reputationReward: 35,
      completionBadgeSlug: "underwatch-archivist",
      requiredBadgeSlugs: ["sign-keeper"],
      submissionType: "REDACTED_ARCHIVE_PACKET",
      reviewMode: "MANUAL",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, consent-based documentation only",
      loreUnlockSlug: "dead-index-entry-mirror-archive",
      optionalTitle: "Sign Keeper",
      badges: [
        {
          slug: "sign-keeper",
          name: "Sign Keeper",
          requirement:
            "Collect or document three low-risk artifacts with basic context.",
          proofType: "Artifact list and metadata summary.",
          placeholderText: "SIGN",
          placeholderColor: deadIndexPalette.ultraviolet,
          requiredForMissionCompletion: true,
          isMissionCompletionBadge: false,
        },
        {
          slug: "underwatch-archivist",
          name: "Underwatch Archivist",
          requirement:
            "Complete consent/anonymity notes, storage note, and debrief summary.",
          proofType: "Redacted archive packet summary.",
          placeholderText: "ARCHIVE",
          placeholderColor: deadIndexPalette.parchmentBone,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `A record can save someone.

A record can expose someone.

The Dead Index does not confuse collecting with care. Mirror Archive trains operatives to preserve memory with consent, context, redaction, and restraint.

Not every face belongs in the archive. Not every name is yours to keep. Not every proof packet should become public.`,
        realWorldPurpose: `This mission teaches ethical archiving, metadata basics, consent notes, redaction, and after-action documentation. It is especially useful for preserving flyers, public statements, meeting notes, zines, public photos with consent, and other movement artifacts.`,
        inUniverseContext: `Heathen built the Dead Index after too many people were turned into missing data. The first lesson was memory. The second was consent.

Mirror Archive is for operatives who understand both.`,
        objective: `Collect or document at least three low-risk artifacts, label them with basic context, add consent or anonymity notes, and write a short debrief.`,
        operativeTasks: [
          "Define what kind of low-risk materials matter for the archive.",
          "Collect or document three artifacts, such as flyers, public statements, zine pages, posters with permission, public meeting notes, or other safe materials.",
          "Label each item with date, general context, source type, and consent status.",
          "Add an anonymity or delayed-release note where needed.",
          "Store the materials safely or submit only a summary if direct upload is not appropriate.",
          "Write a short debrief.",
        ],
        submissionRequirements: [
          "Artifact list.",
          "Metadata summary for each artifact.",
          "Consent or anonymity notes.",
          "Storage or upload note.",
          "Debrief summary.",
        ],
        proofPrivacyNotes: `Do not record or publish faces, names, private messages, license plates, addresses, medical details, immigration details, or private identifying information without consent. Allow anonymous contribution. Delay public release if materials could expose people.`,
        safetyNotes: `This mission is documentation ethics only. It does not reward surveillance, stalking, doxxing, infiltration, harassment, or exposing people.`,
        successCriteria: [
          "At least three artifacts are listed.",
          "Metadata context is included.",
          "Consent or anonymity notes are included.",
          "Storage or release logic is described.",
          "No sensitive private data is exposed.",
        ],
        factionLeaderTransmission: {
          speaker: "Heathen, The Archivist",
          body: `Do not mistake possession for stewardship.

If someone trusts you with memory, you are carrying a living thing. Hold it like it can bruise.`,
        },
        archivistNote: `Some records need a lantern.

Some records need a locked door.

Wisdom is knowing which one you are holding.`,
        rewards: [
          "Faction reputation: +35 Chthonic Uprising standing",
          "Badges: Sign Keeper",
          "Mission completion badge: Underwatch Archivist",
          "Optional title: Sign Keeper",
          "Lore unlock: dead-index-entry-mirror-archive",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use Dead Index colors: Obsidian, Ultraviolet, Parchment Bone, and Pomegranate Black. The completion badge should read UNDERWATCH ARCHIVIST.",
      },
      submissionFields: [
        {
          id: "artifact-list",
          label: "Artifact list (at least three low-risk items)",
          type: "textarea",
          required: true,
        },
        {
          id: "metadata-summary",
          label: "Metadata summary for each artifact (date, context, source type, consent status)",
          type: "textarea",
          required: true,
        },
        {
          id: "consent-anonymity",
          label: "Consent or anonymity notes",
          type: "textarea",
          required: true,
        },
        {
          id: "storage-note",
          label: "Storage or upload note",
          type: "textarea",
          required: true,
        },
        {
          id: "debrief",
          label: "Debrief summary",
          type: "textarea",
          required: true,
        },
        {
          id: "ethics-affirmation",
          label:
            "I affirm this archive packet involves no surveillance, doxxing, exposure of private identifying information without consent, or publication of sensitive private data.",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      slug: "affinity-thread",
      title: "Affinity Thread",
      description:
        "Create a lawful nonviolent support plan with roles, buddy system, accessibility notes, and after-action care.",
      factionSlug: "asclepian-veil",
      difficulty: "FIELD",
      missionType: "NONVIOLENT_FIELD_PREPARATION",
      estimatedTime: "2 to 4 hours",
      repeatable: true,
      reputationReward: 30,
      completionBadgeSlug: "observer-veil",
      requiredBadgeSlugs: ["calm-link"],
      submissionType: "REDACTED_SUPPORT_PLAN",
      reviewMode: "MANUAL",
      sourceConfidence: "adjacent",
      nonviolenceClassification:
        "Nonviolent, lawful support-role preparation only",
      loreUnlockSlug: "dead-index-entry-affinity-thread",
      optionalTitle: "Calm Link",
      badges: [
        {
          slug: "calm-link",
          name: "Calm Link",
          requirement:
            "Assign safe support roles and complete a nonviolent de-escalation or team prep briefing.",
          proofType: "Role summary and briefing note.",
          placeholderText: "CALM",
          placeholderColor: veilPalette.surgicalSilver,
          requiredForMissionCompletion: true,
          isMissionCompletionBadge: false,
        },
        {
          slug: "observer-veil",
          name: "Observer Veil",
          requirement:
            "Complete a redacted after-action support note or event support plan review.",
          proofType: "Redacted support note.",
          placeholderText: "OBSERVER",
          placeholderColor: veilPalette.boneWhite,
          requiredForMissionCompletion: false,
          isMissionCompletionBadge: true,
        },
      ],
      sections: {
        missionBrief: `The Veil does not prepare people to seek danger.

The Veil prepares people to reduce harm when public life gets crowded, frightening, confusing, or loud.

Affinity Thread is a support-role mission. Water. Chargers. Buddy plans. Accessibility needs. De-escalation principles. Legal context awareness. After-action care. No weapons. No confrontation. No evasion. No fantasy of being the main character.

A thread holds because every strand knows its limits.`,
        realWorldPurpose: `This mission teaches nonviolent support planning for public events, community gatherings, meetings, volunteer days, or lawful civic actions. It focuses on buddy systems, support roles, accessibility, basic supplies, de-escalation education, and after-action check-ins.`,
        inUniverseContext: `The Asclepian Veil learned early that panic spreads faster when nobody knows their role. A support plan is not dramatic. It is how fewer people get lost, dehydrated, overwhelmed, or abandoned.`,
        objective: `Create a lawful nonviolent support plan with roles, buddy system, accessibility notes, basic support supplies, de-escalation learning, and after-action check-in.`,
        operativeTasks: [
          "Choose a lawful public event, volunteer action, meeting, community gathering, or hypothetical training scenario.",
          "Define support roles, such as buddy lead, accessibility support, water and supplies, note-taker, check-in contact, or calm space coordinator.",
          "Create a simple buddy system.",
          "Add accessibility and basic supply notes.",
          "Review nonviolent de-escalation or bystander support principles from a reputable source.",
          "Write a redacted support plan or after-action note.",
        ],
        submissionRequirements: [
          "Event type or hypothetical scenario.",
          "Support roles.",
          "Buddy system summary.",
          "Accessibility and supply notes.",
          "De-escalation or support briefing summary.",
          "Redacted after-action note or plan review.",
        ],
        proofPrivacyNotes: `Do not submit private contact lists, addresses, medical details, disability details of others, legal names, private event details, or sensitive route information. Use summaries.`,
        safetyNotes: `This mission must remain strictly nonviolent and lawful. It does not include weapons, combat training, confrontation, police evasion, unsafe protest tactics, interference with emergency services, or instructions for illegal activity.

Support roles exist to reduce harm, not escalate risk.`,
        successCriteria: [
          "Support roles are listed.",
          "Buddy system is summarized.",
          "Accessibility and supplies are considered.",
          "De-escalation or support learning is documented.",
          "Private details are redacted.",
        ],
        factionLeaderTransmission: {
          speaker: "Circe Runic, Veil-Cantor",
          body: `A crowd is not a monster.

A crowd is a body with too many pulses to hear at once.

Bring water. Bring patience. Bring exits. Bring someone who notices when the loudest person is not the one most in danger.`,
        },
        archivistNote: `The strongest field plan I ever saw fit on one folded page.

Everyone knew who they were checking on.

That was the magic.`,
        rewards: [
          "Faction reputation: +30 Asclepian Veil standing",
          "Badges: Calm Link",
          "Mission completion badge: Observer Veil",
          "Optional title: Calm Link",
          "Lore unlock: dead-index-entry-affinity-thread",
        ],
        profileBadgePlaceholderNotes:
          "Badge placeholders should use Asclepian Veil colors with soft jade and smoke gray. The completion badge should read OBSERVER VEIL.",
      },
      submissionFields: [
        {
          id: "event-scenario",
          label: "Event type or hypothetical training scenario",
          type: "textarea",
          required: true,
        },
        {
          id: "support-roles",
          label: "Support roles (buddy lead, accessibility, supplies, note-taker, check-in, calm space, etc.)",
          type: "textarea",
          required: true,
        },
        {
          id: "buddy-system",
          label: "Buddy system summary",
          type: "textarea",
          required: true,
        },
        {
          id: "accessibility-supplies",
          label: "Accessibility and basic supply notes",
          type: "textarea",
          required: true,
        },
        {
          id: "de-escalation-briefing",
          label: "De-escalation or support briefing summary",
          type: "textarea",
          required: true,
        },
        {
          id: "after-action-note",
          label: "Redacted after-action note or plan review",
          type: "textarea",
          required: true,
          helpText:
            "No private contact lists, addresses, medical details, or sensitive route information.",
        },
        {
          id: "nonviolence-affirmation",
          label:
            "I affirm this plan is strictly nonviolent and lawful, with no weapons, confrontation, police evasion, unsafe protest tactics, or interference with emergency services.",
          type: "checkbox",
          required: true,
        },
      ],
    },
  ];
