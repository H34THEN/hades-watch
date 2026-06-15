import "dotenv/config";
import { createHash } from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RoleName } from "../src/generated/prisma/client";
import { buildJitsiUrl, generateJitsiRoomName } from "../src/lib/jitsi";
import { isDevInviteSeedingAllowed } from "../src/lib/env";
import {
  CANONICAL_LORE_ENTRIES,
  DEV_LORE_ENTRIES,
  seedLoreEntries,
} from "../src/lib/lore/canonical-lore-seed";
import { getCharacterLoreSeedEntries } from "../src/lib/archive/character-lore";
import { getWorldLorePackSeedEntries } from "../src/lib/lore/world-lore-seed";

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
  { name: "Owner", description: "Full platform authority — The Archivist" },
  { name: "Admin", description: "Administrative operations" },
  { name: "Moderator", description: "Community moderation" },
  { name: "Expert", description: "Subject matter specialist" },
  { name: "Operative", description: "Approved standard operative" },
  { name: "Gamer", description: "Game-layer participant" },
  { name: "Member", description: "Standard community member" },
  { name: "Recruit", description: "Pending or limited recruit access" },
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

  // Canonical factions are seeded via: npm run db:seed:factions
  const factionSlugs = [
    "asclepian-veil",
    "oracular-circuit",
    "myrmidon-grinders",
    "daedalus-foundry",
    "styx-rats",
  ];

  const factionRecords: Record<string, string> = {};
  for (const slug of factionSlugs) {
    const record = await prisma.faction.findUnique({ where: { slug } });
    if (record) factionRecords[slug] = record.id;
  }

  if (Object.keys(factionRecords).length === 0) {
    console.log("  ⚠ No Chthonic factions found — run npm run db:seed:factions first");
  } else {
    console.log(`  ✓ ${Object.keys(factionRecords).length} factions linked`);
  }

  const missions = [
    {
      slug: "veil-triage-protocol",
      title: "Veil Triage Protocol",
      description:
        "Route emergency care resources to a dissent cluster flagged for predictive denial. Stabilize without triggering municipal watchdogs.",
      factionSlug: "asclepian-veil",
    },
    {
      slug: "oracle-static-decode",
      title: "Oracle Static Decode",
      description:
        "A black-box prophecy engine is broadcasting probability spikes. Decode the static and poison the training feed.",
      factionSlug: "oracular-circuit",
    },
    {
      slug: "cerberus-gate-hold",
      title: "Cerberus Gate Hold",
      description:
        "A protest corridor is about to be sealed. Hold the line, marshal evacuation routes, and keep the vulnerable moving.",
      factionSlug: "myrmidon-grinders",
    },
  ];

  for (const m of missions) {
    if (!factionRecords[m.factionSlug]) continue;
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

  await seedLoreEntries(prisma, CANONICAL_LORE_ENTRIES, factionRecords);
  await seedLoreEntries(prisma, getCharacterLoreSeedEntries(), factionRecords);
  await seedLoreEntries(prisma, getWorldLorePackSeedEntries(), factionRecords);
  await seedLoreEntries(prisma, DEV_LORE_ENTRIES, factionRecords);
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
