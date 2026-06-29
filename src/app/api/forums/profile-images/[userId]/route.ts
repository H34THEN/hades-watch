import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import { absoluteStoredPath } from "@/lib/forums/paths";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function nodeStreamToWeb(stream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      stream.on("data", (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });
}

function mimeFromPath(path: string): string {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const profile = await prisma.forumProfile.findUnique({
    where: { userId },
    select: { forumImagePath: true, forumImageSource: true, moderationStatus: true },
  });

  if (!profile?.forumImagePath || profile.forumImageSource !== "UPLOADED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getSessionUser();
  const isOwner = user?.id === userId;
  const canModerate = !!user && isModerator(user.roles);

  if (profile.moderationStatus === "HIDDEN" && !isOwner && !canModerate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const absolutePath = absoluteStoredPath(profile.forumImagePath);
  let fileStat;
  try {
    fileStat = statSync(absolutePath);
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const stream = createReadStream(absolutePath);
  return new NextResponse(nodeStreamToWeb(stream), {
    status: 200,
    headers: {
      "Content-Type": mimeFromPath(absolutePath),
      "Content-Length": String(fileStat.size),
      "Cache-Control": profile.moderationStatus === "APPROVED" ? "public, max-age=3600" : "private, max-age=300",
    },
  });
}
