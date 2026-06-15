import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import { resolveStoredPath } from "@/lib/media/storage";
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

function mimeFromPath(path: string, fallback?: string | null): string {
  if (fallback) return fallback;
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

async function canViewAsset(
  asset: { userId: string },
  viewer: Awaited<ReturnType<typeof getSessionUser>>,
): Promise<boolean> {
  if (!viewer || !isApprovedUser(viewer)) return false;
  if (asset.userId === viewer.id) return true;
  if (isModerator(viewer.roles)) return true;
  const character = await prisma.character.findUnique({
    where: { userId: asset.userId },
    select: { isPublic: true, user: { select: { accountStatus: true, disabled: true, banned: true } } },
  });
  return !!(
    character?.isPublic &&
    character.user.accountStatus === "Approved" &&
    !character.user.disabled &&
    !character.user.banned
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await params;
  const viewer = await getSessionUser();
  const asset = await prisma.userProfileAsset.findUnique({ where: { id: assetId } });
  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!(await canViewAsset(asset, viewer))) {
    return NextResponse.json({ error: "Restricted" }, { status: 403 });
  }

  const absolutePath = resolveStoredPath(asset.path);
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
      "Content-Type": mimeFromPath(absolutePath, asset.mimeType),
      "Content-Length": String(fileStat.size),
      "Cache-Control": "private, max-age=3600",
    },
  });
}
