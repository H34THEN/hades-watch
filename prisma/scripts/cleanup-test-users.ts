import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

const TEST_EMAIL_DOMAIN = "@operative.hadeswatch.local";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: TEST_EMAIL_DOMAIN } },
        { name: { startsWith: "Test " } },
        { isTestAccount: true },
      ],
    },
    select: { id: true, email: true, name: true },
  });

  if (testUsers.length === 0) {
    console.log("No test users found. Nothing to delete.");
    return;
  }

  console.log(`Found ${testUsers.length} test user(s) to remove:`);
  for (const u of testUsers) {
    console.log(`  - ${u.email} (${u.name ?? "no name"})`);
  }

  const ids = testUsers.map((u) => u.id);
  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  console.log(`\nDeleted ${testUsers.length} test user(s).`);
  console.log("Real production users were not targeted by this script.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
