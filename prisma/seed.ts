import "dotenv/config";
import { createHash } from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RoleName } from "../src/generated/prisma/client";
import { buildJitsiUrl, generateJitsiRoomName } from "../src/lib/jitsi";
import { isDevInviteSeedingAllowed } from "../src/lib/env";

function hashCipherAnswer(answer: string): string {
  return createHash("sha256").update(answer.trim().toLowerCase()).digest("hex");
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ROLES: { name: RoleName; description: string }[] = [
  { name: "Owner", description: "Full platform authority" },
  { name: "Admin", description: "Administrative operations" },
  { name: "Moderator", description: "Community moderation" },
  { name: "Expert", description: "Subject matter specialist" },
  { name: "Gamer", description: "Game-layer participant" },
  { name: "Member", description: "Standard community member" },
  { name: "Guest", description: "Limited access visitor" },
];

const DEV_INVITES: {
  code: string;
  roleGranted: RoleName;
  maxUses: number;
}[] = [
  { code: "DEV-OWNER-ACCESS", roleGranted: "Owner", maxUses: 10 },
  { code: "DEV-MEMBER-ACCESS", roleGranted: "Member", maxUses: 50 },
  { code: "DEV-MOD-ACCESS", roleGranted: "Moderator", maxUses: 20 },
];


async function seedPhase3Content() {
  console.log("Seeding Phase 3 content...");

  const existingTransmission = await prisma.announcement.findFirst({
    where: { title: "Network Status: Phase 3 Online" },
  });

  if (!existingTransmission) {
    await prisma.announcement.createMany({
      data: [
        {
          title: "Network Status: Phase 3 Online",
          body: "Transmissions and event systems are now active. All operatives should review upcoming briefings on the event calendar.",
          status: "Published",
          priority: "High",
          pinned: true,
          publishedAt: new Date(),
        },
        {
          title: "Moderator Channel Advisory",
          body: "Moderators: report queue scaffolding is live. Full review workflow arrives in Phase 4.",
          status: "Published",
          priority: "Normal",
          audienceRole: "Moderator",
          publishedAt: new Date(),
        },
        {
          title: "Draft: Council Session Notes",
          body: "Internal draft — not yet cleared for broadcast.",
          status: "Draft",
          priority: "Low",
        },
      ],
    });
    console.log("  ✓ Sample transmissions");
  }

  const existingEvent = await prisma.event.findFirst({
    where: { title: "Operative Briefing — Week Zero" },
  });

  if (!existingEvent) {
    const roomName = generateJitsiRoomName("briefing");
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + 7);

    await prisma.event.createMany({
      data: [
        {
          title: "Operative Briefing — Week Zero",
          description: "Initial community briefing. All members welcome. Virtual attendance via Jitsi.",
          eventType: "briefing",
          status: "Published",
          startsAt,
          endsAt: new Date(startsAt.getTime() + 2 * 60 * 60 * 1000),
          location: "Virtual — Jitsi",
          jitsiRoomName: roomName,
          virtualUrl: buildJitsiUrl(roomName),
        },
        {
          title: "Moderator Sync",
          description: "Internal moderation alignment session.",
          eventType: "council",
          status: "Published",
          audienceRole: "Moderator",
          startsAt: new Date(startsAt.getTime() + 3 * 24 * 60 * 60 * 1000),
          location: "Virtual",
        },
        {
          title: "Campaign Planning (Draft)",
          description: "Future campaign session — not yet published.",
          eventType: "campaign",
          status: "Draft",
          startsAt: new Date(startsAt.getTime() + 14 * 24 * 60 * 60 * 1000),
        },
      ],
    });
    console.log("  ✓ Sample events");
  }
}

async function seedPhase4Content() {
  console.log("Seeding Phase 4 content...");

  const factions = [
    {
      name: "Ember Cell",
      slug: "ember-cell",
      description:
        "Underground signal runners who trade in heat, rumor, and last-resort extraction routes.",
    },
    {
      name: "Null Choir",
      slug: "null-choir",
      description:
        "Cryptographers and liturgical hackers who treat silence as a weapon and hymns as payloads.",
    },
    {
      name: "Archive Wraiths",
      slug: "archive-wraiths",
      description:
        "Custodians of forbidden records. They do not steal secrets — they remember what others delete.",
    },
  ];

  const factionRecords: Record<string, string> = {};

  for (const f of factions) {
    const record = await prisma.faction.upsert({
      where: { slug: f.slug },
      update: { description: f.description },
      create: f,
    });
    factionRecords[f.slug] = record.id;
  }

  // Migrate legacy Void Runners stub if present
  const voidRunners = await prisma.faction.findUnique({ where: { name: "Void Runners" } });
  if (voidRunners && !voidRunners.slug) {
    await prisma.faction.update({
      where: { id: voidRunners.id },
      data: { slug: "void-runners" },
    });
  }

  console.log("  ✓ Factions");

  const missions = [
    {
      slug: "signal-beneath-the-ash",
      title: "Signal Beneath the Ash",
      description:
        "Intercept a repeating carrier wave buried under municipal noise. Trace its origin without tripping municipal watchdogs.",
      factionSlug: "ember-cell",
    },
    {
      slug: "dead-channel-recon",
      title: "Dead Channel Recon",
      description:
        "A broadcast tower went dark six hours ago. Recon the site and determine whether the silence is sabotage or surrender.",
      factionSlug: "null-choir",
    },
    {
      slug: "the-oracle-node-flickers",
      title: "The Oracle Node Flickers",
      description:
        "Archive indices are desyncing. Stabilize the oracle node before corrupted entries rewrite community history.",
      factionSlug: "archive-wraiths",
    },
  ];

  for (const m of missions) {
    await prisma.quest.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title,
        description: m.description,
        status: "Available",
        factionId: factionRecords[m.factionSlug],
      },
      create: {
        slug: m.slug,
        title: m.title,
        description: m.description,
        status: "Available",
        factionId: factionRecords[m.factionSlug],
      },
    });
  }

  console.log("  ✓ Missions");

  const loreEntries = [
    {
      slug: "the-first-watch",
      title: "The First Watch",
      excerpt: "Before the network had a name, someone stayed awake on purpose.",
      body: "The First Watch was not a ceremony. It was a refusal — a decision to keep the line open when everyone else logged off.\n\nOperatives who inherit that watch inherit its cost: you see the signal before it becomes news, and you answer before anyone asks.",
      requiredRole: null as RoleName | null,
    },
    {
      slug: "terminal-hymns",
      title: "Terminal Hymns",
      excerpt: "Null Choir doctrine encoded in maintenance logs.",
      body: "They sang in comment blocks and checksum failures. Each hymn was a test pattern for the faithful and a trap for the careless.\n\nIf you hear rhythm in static, you are already in their liturgy.",
      requiredRole: "Member" as RoleName | null,
    },
    {
      slug: "the-archive-watches-back",
      title: "The Archive Watches Back",
      excerpt: "Every index has an observer.",
      body: "Archive Wraiths insist the stacks are alive. Not sentient — attentive. Delete a file and something remembers the shape of the absence.\n\nRead carefully. The archive logs readers as faithfully as it logs writers.",
      requiredRole: "Gamer" as RoleName | null,
      factionSlug: "archive-wraiths",
    },
  ];

  for (const l of loreEntries) {
    await prisma.loreEntry.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        excerpt: l.excerpt,
        body: l.body,
        status: "Published",
        publishedAt: new Date(),
        requiredRole: l.requiredRole,
        requiredFactionId: l.factionSlug ? factionRecords[l.factionSlug] : null,
      },
      create: {
        slug: l.slug,
        title: l.title,
        excerpt: l.excerpt,
        body: l.body,
        status: "Published",
        publishedAt: new Date(),
        requiredRole: l.requiredRole,
        requiredFactionId: l.factionSlug ? factionRecords[l.factionSlug] : null,
      },
    });
  }

  console.log("  ✓ Lore entries");

  const deadDrops = [
    {
      slug: "blackbox-7",
      codename: "BLACKBOX-7",
      title: "BLACKBOX-7",
      locationHint: "Relay 7 — maintenance hatch",
      message:
        "ROLEPLAY ONLY — Not secure messaging.\n\nThe box hums at 3.3kHz when the city sleeps. Leave a copper coin on the ledge. Take the folded map. Burn after reading — theatrically, if possible.",
      clearanceRole: "Member" as RoleName,
    },
    {
      slug: "orpheus-static",
      codename: "ORPHEUS STATIC",
      title: "ORPHEUS STATIC",
      locationHint: "Substation C — graffiti layer",
      message:
        "ROLEPLAY ONLY — Fictional dead drop.\n\nOrpheus never looked back, but the static did. Tune to the dead channel and count seven breaths between pulses.",
      clearanceRole: "Gamer" as RoleName,
    },
    {
      slug: "the-lock-that-sings",
      codename: "THE LOCK THAT SINGS",
      title: "THE LOCK THAT SINGS",
      locationHint: "Archive annex — door 13",
      message:
        "ROLEPLAY ONLY — In-world flavor only.\n\nThe lock does not want a key. It wants the right question. Ask: 'What did the first watch hear?'",
      clearanceRole: "Expert" as RoleName,
    },
  ];

  for (const d of deadDrops) {
    await prisma.deadDrop.upsert({
      where: { slug: d.slug },
      update: {
        codename: d.codename,
        title: d.title,
        locationHint: d.locationHint,
        message: d.message,
        clearanceRole: d.clearanceRole,
        status: "Active",
      },
      create: {
        slug: d.slug,
        codename: d.codename,
        title: d.title,
        locationHint: d.locationHint,
        message: d.message,
        clearanceRole: d.clearanceRole,
        status: "Active",
      },
    });
  }

  // Update legacy seed drop if it exists without slug
  const legacyDrop = await prisma.deadDrop.findUnique({ where: { id: "seed-drop-001" } });
  if (legacyDrop && !legacyDrop.slug) {
    await prisma.deadDrop.update({
      where: { id: legacyDrop.id },
      data: {
        slug: "ashgate-7",
        title: "ASHGATE-7",
        status: "Active",
      },
    });
  }

  console.log("  ✓ Dead drops");

  await prisma.cipherPuzzle.upsert({
    where: { slug: "veil-count" },
    update: {
      solutionHash: hashCipherAnswer("phase"),
    },
    create: {
      slug: "veil-count",
      title: "Veil Count",
      prompt: "A three-letter channel key hides in the first transmission title. What is the middle word?",
      hint: "Check pinned broadcasts. Title: Network Status: Phase 3 Online",
      difficulty: "easy",
      solutionHash: hashCipherAnswer("phase"),
      status: "Active",
    },
  });

  await prisma.secretTransmission.upsert({
    where: { slug: "dead-signal-fragment" },
    update: {},
    create: {
      slug: "dead-signal-fragment",
      title: "Dead Signal Fragment",
      body: "ROLEPLAY ONLY — This is not secure messaging. Clearance: Moderator.",
      clearanceRole: "Moderator",
      oneTime: true,
      status: "Active",
    },
  });

  console.log("  ✓ Ciphers and secret transmissions");

  const existingReport = await prisma.moderationReport.findFirst({
    where: { reason: { contains: "Phase 4 sample report" } },
  });

  if (!existingReport) {
    await prisma.moderationReport.create({
      data: {
        targetType: "user",
        targetId: "sample-user-id",
        reason: "Phase 4 sample report — suspicious operative behavior flagged during onboarding.",
        status: "Open",
      },
    });
    console.log("  ✓ Sample moderation report");
  }
}

async function main() {
  console.log("Seeding roles...");
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }
  console.log(`  ✓ ${ROLES.length} roles`);

  if (!isDevInviteSeedingAllowed()) {
    console.log("Skipping dev content (production or DISABLE_DEV_INVITES).");
    return;
  }

  console.log("Seeding development invite codes...");
  for (const invite of DEV_INVITES) {
    await prisma.inviteCode.upsert({
      where: { code: invite.code },
      update: {
        roleGranted: invite.roleGranted,
        maxUses: invite.maxUses,
        revoked: false,
        isDevCode: true,
        autoApproveOnRegister: true,
      },
      create: {
        code: invite.code,
        roleGranted: invite.roleGranted,
        maxUses: invite.maxUses,
        isDevCode: true,
        autoApproveOnRegister: true,
      },
    });
    console.log(`  ✓ ${invite.code} → ${invite.roleGranted}`);
  }

  await seedPhase3Content();
  await seedPhase4Content();

  console.log("\nSeed complete.");
  console.log("\nDev invite codes (local only, never use in production):");
  DEV_INVITES.forEach((i) => console.log(`  - ${i.code}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
