/**
 * One-time production Owner invite bootstrap.
 *
 * Requires: ALLOW_PROD_ADMIN_BOOTSTRAP=true
 * Refuses to run otherwise. Does NOT run during normal seed.
 *
 * Usage (on production server only, after migrate deploy):
 *   ALLOW_PROD_ADMIN_BOOTSTRAP=true npm run db:bootstrap
 *
 * After use: unset ALLOW_PROD_ADMIN_BOOTSTRAP, register with the code, revoke if needed.
 */
import "dotenv/config";
import { randomBytes } from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

const ALLOW_FLAG = process.env.ALLOW_PROD_ADMIN_BOOTSTRAP === "true";

if (!ALLOW_FLAG) {
  console.error(
    "Refused: set ALLOW_PROD_ADMIN_BOOTSTRAP=true to run this one-time bootstrap.",
  );
  console.error("See docs/ADMIN_BOOTSTRAP.md");
  process.exit(1);
}

if (process.env.NODE_ENV !== "production") {
  console.warn(
    "WARNING: NODE_ENV is not production. Only run on production server.",
  );
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function generateInviteCode(): string {
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `OWNER-BOOTSTRAP-${suffix}`;
}

async function main() {
  console.warn("=".repeat(60));
  console.warn("PRODUCTION OWNER BOOTSTRAP — ONE-TIME USE");
  console.warn("Unset ALLOW_PROD_ADMIN_BOOTSTRAP after completing registration.");
  console.warn("=".repeat(60));

  const devInvites = await prisma.inviteCode.count({
    where: { isDevCode: true, revoked: false },
  });
  if (devInvites > 0) {
    console.error(
      `Refused: ${devInvites} active DEV-* invite(s) still exist. Revoke them first.`,
    );
    console.error("See docs/ADMIN_BOOTSTRAP.md");
    process.exit(1);
  }

  const code = generateInviteCode();

  await prisma.inviteCode.create({
    data: {
      code,
      roleGranted: "Owner",
      maxUses: 1,
      isDevCode: false,
    },
  });

  console.log("\nOwner invite created (single use):");
  console.log(`  ${code}`);
  console.log("\nRegister at: /invite → /register?invite=CODE");
  console.log("Revoke this invite after Owner account is created.");
  console.log("\nThis code is shown once. It is not stored in plaintext elsewhere.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
