import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import { resolveStoredPath } from "@/lib/media/storage";
import { parseBannerStyleJson } from "@/lib/net-neighbors/banner-builder";
import { getNetNeighborById } from "@/lib/queries/net-neighbors";

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
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const slot = request.nextUrl.searchParams.get("slot");

  const neighbor = await getNetNeighborById(id);
  if (!neighbor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const style = parseBannerStyleJson(neighbor.bannerStyle);
  const filePath =
    slot === "icon" && style?.iconPath ? style.iconPath : neighbor.bannerPath;

  if (!filePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getSessionUser();
  const canModerate = !!user && isModerator(user.roles);
  const isOwnerPending =
    neighbor.status === "PENDING" &&
    !!user &&
    isApprovedUser(user) &&
    neighbor.submittedById === user.id;

  if (neighbor.status === "APPROVED" || (slot === "icon" && style?.iconPath)) {
    // Public approved banners and their builder icons — no auth required when approved
  } else if (!canModerate && !isOwnerPending) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const absolutePath = resolveStoredPath(filePath);
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
      "Cache-Control":
        neighbor.status === "APPROVED" ? "public, max-age=3600" : "private, max-age=300",
    },
  });
}
