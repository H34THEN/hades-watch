import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  FactionPosition,
  PrismaClient,
  RoleName,
  UserAccountStatus,
} from "../../src/generated/prisma/client";
import { hashPassword } from "../../src/lib/auth/password";
import {
  CHTHONIC_FACTIONS,
  FACTION_SHORT_NAMES,
  getDisplayTitleForPosition,
  POSITION_LABELS,
  POSITION_SLUGS,
} from "../../src/lib/factions/chthonic-data";

const TEST_EMAIL_DOMAIN = "@operative.hadeswatch.local";
const TEST_PASSWORD = "password";

const SITE_ROLE_USERS: { role: RoleName; name: string; email: string }[] = [
  { role: "Owner", name: "Test Archivist Owner", email: `test-owner${TEST_EMAIL_DOMAIN}` },
  { role: "Admin", name: "Test Admin", email: `test-admin${TEST_EMAIL_DOMAIN}` },
  { role: "Moderator", name: "Test Moderator", email: `test-moderator${TEST_EMAIL_DOMAIN}` },
  { role: "Expert", name: "Test Expert", email: `test-expert${TEST_EMAIL_DOMAIN}` },
  { role: "Operative", name: "Test Operative", email: `test-operative${TEST_EMAIL_DOMAIN}` },
  { role: "Recruit", name: "Test Recruit", email: `test-recruit${TEST_EMAIL_DOMAIN}` },
];

const POSITIONS: FactionPosition[] = [
  "INITIATE",
  "MEMBER",
  "SPECIALIST",
  "CELL_LEAD",
  "LIEUTENANT",
  "LEADER",
];

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface TestUserRecord {
  email: string;
  name: string;
  siteRole: RoleName;
  faction?: string;
  position?: FactionPosition;
  displayTitle?: string;
}

async function ensureRole(name: RoleName) {
  await prisma.role.upsert({
    where: { name },
    update: {},
    create: { name, description: `${name} role` },
  });
}

async function upsertTestUser(
  record: TestUserRecord,
  passwordHash: string,
  factionIdBySlug: Record<string, string>,
) {
  const user = await prisma.user.upsert({
    where: { email: record.email },
    update: {
      name: record.name,
      isTestAccount: true,
      accountStatus: "Approved" as UserAccountStatus,
      approvedAt: new Date(),
      approvalSource: "TEST_SEED",
      disabled: false,
      banned: false,
    },
    create: {
      email: record.email,
      name: record.name,
      passwordHash,
      isTestAccount: true,
      accountStatus: "Approved",
      approvedAt: new Date(),
      approvalSource: "TEST_SEED",
    },
  });

  const role = await prisma.role.findUniqueOrThrow({ where: { name: record.siteRole } });
  await prisma.userRole.deleteMany({ where: { userId: user.id } });
  await prisma.userRole.create({
    data: { userId: user.id, roleId: role.id },
  });

  if (record.faction && record.position) {
    const factionId = factionIdBySlug[record.faction];
    if (!factionId) throw new Error(`Faction not found: ${record.faction}`);

    await prisma.factionMembership.upsert({
      where: { userId_factionId: { userId: user.id, factionId } },
      update: {
        status: "Approved",
        position: record.position,
        displayTitle: record.displayTitle ?? null,
        isPrimary: true,
      },
      create: {
        userId: user.id,
        factionId,
        status: "Approved",
        position: record.position,
        displayTitle: record.displayTitle ?? null,
        isPrimary: true,
      },
    });

    await prisma.character.upsert({
      where: { userId: user.id },
      update: {
        callsign: record.name.replace(/^Test /, "").replace(/ /g, "-").toUpperCase(),
        factionId,
      },
      create: {
        userId: user.id,
        callsign: record.name.replace(/^Test /, "").replace(/ /g, "-").toUpperCase(),
        factionId,
        isPublic: true,
      },
    });
  }

  return user;
}

function printTestUserList(records: TestUserRecord[]) {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  HADES WATCH TEST USERS — REMOVE BEFORE PRODUCTION/BETA");
  console.log("  Password for all accounts: password");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("── Site-Level Role Test Users ──");
  for (const r of records.filter((u) => !u.faction)) {
    console.log(`  ${r.email}`);
    console.log(`    Name: ${r.name}`);
    console.log(`    Site Role: ${r.siteRole}`);
    console.log("");
  }

  console.log("── Faction Position Test Users ──");
  for (const r of records.filter((u) => u.faction)) {
    console.log(`  ${r.email}`);
    console.log(`    Name: ${r.name}`);
    console.log(`    Site Role: ${r.siteRole}`);
    console.log(`    Faction: ${r.faction}`);
    console.log(`    Position: ${r.position} (${r.displayTitle})`);
    console.log("");
  }

  console.log("Cleanup: npm run db:cleanup-test-users");
}

async function main() {
  console.log("Seeding test users...");

  const factions = await prisma.faction.findMany({
    where: { slug: { in: CHTHONIC_FACTIONS.map((f) => f.slug) } },
  });
  if (factions.length < CHTHONIC_FACTIONS.length) {
    throw new Error(
      "Canonical factions not found. Run: npm run db:seed:factions",
    );
  }

  const factionIdBySlug = Object.fromEntries(factions.map((f) => [f.slug, f.id]));
  const passwordHash = await hashPassword(TEST_PASSWORD);
  const records: TestUserRecord[] = [];

  for (const u of SITE_ROLE_USERS) {
    await ensureRole(u.role);
    records.push({ email: u.email, name: u.name, siteRole: u.role });
    await upsertTestUser({ email: u.email, name: u.name, siteRole: u.role }, passwordHash, factionIdBySlug);
    console.log(`  ✓ ${u.name} (${u.role})`);
  }

  await ensureRole("Operative");
  await ensureRole("Recruit");

  for (const faction of CHTHONIC_FACTIONS) {
    for (const position of POSITIONS) {
      const positionSlug = POSITION_SLUGS[position];
      const email = `test-${faction.slug}-${positionSlug}${TEST_EMAIL_DOMAIN}`;
      const shortName = FACTION_SHORT_NAMES[faction.slug] ?? faction.name;
      const name = `Test ${shortName} ${POSITION_LABELS[position]}`;
      const displayTitle = getDisplayTitleForPosition(faction.slug, position);

      const record: TestUserRecord = {
        email,
        name,
        siteRole: "Operative",
        faction: faction.slug,
        position,
        displayTitle,
      };
      records.push(record);
      await upsertTestUser(record, passwordHash, factionIdBySlug);
      console.log(`  ✓ ${name}`);
    }
  }

  printTestUserList(records);
  console.log("\nTest user seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
