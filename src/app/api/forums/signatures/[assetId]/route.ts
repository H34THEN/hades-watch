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
  { params }: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await params;
  const asset = await prisma.forumSignatureAsset.findUnique({
    where: { id: assetId },
    select: { imagePath: true, userId: true, moderationStatus: true, sourceType: true },
  });

  if (!asset?.imagePath || asset.sourceType !== "UPLOADED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getSessionUser();
  const isOwner = user?.id === asset.userId;
  const canModerate = !!user && isModerator(user.roles);

  if (asset.moderationStatus === "HIDDEN" && !isOwner && !canModerate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const absolutePath = absoluteStoredPath(asset.imagePath);
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
      "Cache-Control": asset.moderationStatus === "APPROVED" ? "public, max-age=3600" : "private, max-age=300",
    },
  });
}
