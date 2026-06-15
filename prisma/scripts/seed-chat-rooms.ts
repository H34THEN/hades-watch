import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { DEFAULT_CHAT_ROOMS } from "../../src/lib/chat/constants";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding chat rooms...");
  for (const room of DEFAULT_CHAT_ROOMS) {
    await prisma.chatRoom.upsert({
      where: { slug: room.slug },
      create: {
        slug: room.slug,
        name: room.name,
        description: room.description,
        sortOrder: room.sortOrder,
        isActive: true,
      },
      update: {
        name: room.name,
        description: room.description,
        sortOrder: room.sortOrder,
        isActive: true,
      },
    });
    console.log(`  ✓ ${room.slug}`);
  }
  console.log("\nChat room seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
