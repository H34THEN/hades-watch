import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const status = dbOk ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      app: "hades-watch",
      version: process.env.npm_package_version ?? "0.1.0",
      timestamp: new Date().toISOString(),
      database: dbOk ? "connected" : "unavailable",
    },
    { status: dbOk ? 200 : 503 },
  );
}
