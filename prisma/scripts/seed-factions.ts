import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import {
  ALLIANCE_DATA,
  CHTHONIC_FACTIONS,
} from "../../src/lib/factions/chthonic-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedAlliance() {
  const alliance = await prisma.faction.upsert({
    where: { slug: ALLIANCE_DATA.slug },
    update: {
      name: ALLIANCE_DATA.name,
      description: ALLIANCE_DATA.description,
      tagline: ALLIANCE_DATA.tagline,
      archetype: ALLIANCE_DATA.archetype,
      leaderName: ALLIANCE_DATA.leaderName,
      leaderTitle: ALLIANCE_DATA.leaderTitle,
      leaderLore: ALLIANCE_DATA.leaderLore,
      motto: ALLIANCE_DATA.motto,
      symbol: ALLIANCE_DATA.symbol,
      coreValues: ALLIANCE_DATA.coreValues,
      isAlliance: true,
    },
    create: {
      slug: ALLIANCE_DATA.slug,
      name: ALLIANCE_DATA.name,
      description: ALLIANCE_DATA.description,
      tagline: ALLIANCE_DATA.tagline,
      archetype: ALLIANCE_DATA.archetype,
      leaderName: ALLIANCE_DATA.leaderName,
      leaderTitle: ALLIANCE_DATA.leaderTitle,
      leaderLore: ALLIANCE_DATA.leaderLore,
      motto: ALLIANCE_DATA.motto,
      symbol: ALLIANCE_DATA.symbol,
      coreValues: ALLIANCE_DATA.coreValues,
      isAlliance: true,
    },
  });
  return alliance.id;
}

async function seedFactions(allianceId: string) {
  for (const f of CHTHONIC_FACTIONS) {
    const faction = await prisma.faction.upsert({
      where: { slug: f.slug },
      update: {
        name: f.name,
        description: f.description,
        tagline: f.tagline,
        archetype: f.archetype,
        leaderName: f.leaderName,
        leaderTitle: f.leaderTitle,
        leaderLore: f.leaderLore,
        coreValues: f.coreValues,
        palette: f.palette,
        symbol: f.symbol,
        rivalrySlug: f.rivalrySlug,
        synergySlug: f.synergySlug,
        themeUnlock: f.themeUnlock,
        typicalMissions: f.typicalMissions,
        reputationFlavor: f.reputationFlavor,
        badges: f.badges,
        titles: f.titles,
        isAlliance: false,
        allianceId,
      },
      create: {
        slug: f.slug,
        name: f.name,
        description: f.description,
        tagline: f.tagline,
        archetype: f.archetype,
        leaderName: f.leaderName,
        leaderTitle: f.leaderTitle,
        leaderLore: f.leaderLore,
        coreValues: f.coreValues,
        palette: f.palette,
        symbol: f.symbol,
        rivalrySlug: f.rivalrySlug,
        synergySlug: f.synergySlug,
        themeUnlock: f.themeUnlock,
        typicalMissions: f.typicalMissions,
        reputationFlavor: f.reputationFlavor,
        badges: f.badges,
        titles: f.titles,
        isAlliance: false,
        allianceId,
      },
    });

    for (const badgeName of f.badges) {
      const slug = `${f.slug}-${badgeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      await prisma.badge.upsert({
        where: { slug },
        update: {
          name: badgeName,
          factionId: faction.id,
          color: Object.values(f.palette)[0] ?? null,
        },
        create: {
          slug,
          name: badgeName,
          factionId: faction.id,
          color: Object.values(f.palette)[0] ?? null,
        },
      });
    }

    console.log(`  ✓ ${f.name}`);
  }
}

async function main() {
  console.log("Seeding Chthonic Uprising factions...");
  const allianceId = await seedAlliance();
  console.log(`  ✓ ${ALLIANCE_DATA.name}`);
  await seedFactions(allianceId);
  await seedOwnerAllianceMemberships();
  console.log("\nFaction seed complete.");
}

async function seedOwnerAllianceMemberships() {
  const alliance = await prisma.faction.findUnique({ where: { slug: ALLIANCE_DATA.slug } });
  if (!alliance) return;

  const owners = await prisma.user.findMany({
    where: { userRoles: { some: { role: { name: "Owner" } } } },
    include: {
      factionMemberships: {
        where: { status: "Approved", faction: { isAlliance: false } },
      },
    },
  });

  for (const owner of owners) {
    const hasPrimaryCell = owner.factionMemberships.some((m) => m.isPrimary);
    await prisma.factionMembership.upsert({
      where: { userId_factionId: { userId: owner.id, factionId: alliance.id } },
      create: {
        userId: owner.id,
        factionId: alliance.id,
        status: "Approved",
        position: "LEADER",
        displayTitle: "The Archivist",
        reputation: 9999,
        isPrimary: !hasPrimaryCell,
      },
      update: {
        status: "Approved",
        position: "LEADER",
        displayTitle: "The Archivist",
        reputation: 9999,
      },
    });
    console.log(`  ✓ Owner alliance mark: ${owner.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
