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

async function canViewPart(
  part: { userId: string; visibility: string },
  viewer: Awaited<ReturnType<typeof getSessionUser>>,
): Promise<boolean> {
  if (!viewer || !isApprovedUser(viewer)) return false;
  if (part.userId === viewer.id) return true;
  if (isModerator(viewer.roles)) return true;
  if (part.visibility !== "SHARED") return false;
  const owner = await prisma.user.findUnique({
    where: { id: part.userId },
    select: { accountStatus: true, disabled: true, banned: true },
  });
  return !!(owner?.accountStatus === "Approved" && !owner.disabled && !owner.banned);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ partId: string }> },
) {
  const { partId } = await params;
  const viewer = await getSessionUser();
  const part = await prisma.avatarUserPart.findUnique({ where: { id: partId } });
  if (!part) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!(await canViewPart(part, viewer))) {
    return NextResponse.json({ error: "Restricted" }, { status: 403 });
  }

  const absolutePath = resolveStoredPath(part.path);
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
      "Content-Type": mimeFromPath(absolutePath, part.mimeType),
      "Content-Length": String(fileStat.size),
      "Cache-Control": part.visibility === "SHARED" ? "public, max-age=3600" : "private, max-age=3600",
    },
  });
}
