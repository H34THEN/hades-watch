import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import {
  deriveCallsignSeed,
  findAvailableCallsign,
} from "../../src/lib/profile/callsign-service";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Backfilling profile callsigns...\n");

  const users = await prisma.user.findMany({
    where: {
      accountStatus: "Approved",
      disabled: false,
      banned: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      character: { select: { id: true, callsign: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  let created = 0;
  let skipped = 0;

  for (const user of users) {
    if (user.character?.callsign) {
      skipped++;
      continue;
    }

    const seed = deriveCallsignSeed(user);
    const callsign = await findAvailableCallsign(prisma, seed, user.id);

    await prisma.character.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        callsign,
        isPublic: true,
      },
      update: { callsign },
    });

    console.log(`  ✓ ${user.name ?? user.id.slice(0, 8)} → /profile/${callsign}`);
    created++;
  }

  console.log(`\nBackfill complete. Created: ${created}, already had callsign: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
