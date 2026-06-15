import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getSignalPlayerTracks } from "@/lib/actions/media";

export async function GET() {
  const user = await getSessionUser();
  const tracks = await getSignalPlayerTracks(user);
  return NextResponse.json({ tracks });
}
