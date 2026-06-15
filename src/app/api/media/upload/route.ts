import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isOwner } from "@/lib/auth/roles";
import { formatUploadError } from "@/lib/media/album-resolve";
import { uploadMediaTrackFromForm } from "@/lib/media/upload-track";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required. Sign in and retry the upload." },
        { status: 401 },
      );
    }
    if (!isOwner(user.roles)) {
      return NextResponse.json(
        { success: false, error: "Owner clearance required for Signal Deck uploads." },
        { status: 403 },
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (err) {
      console.error("[api/media/upload] formData parse failed", err);
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not read upload payload. File may be too large for the proxy or server limit.",
        },
        { status: 413 },
      );
    }

    const result = await uploadMediaTrackFromForm(formData, user.id);
    if (!result.success) {
      const status = result.error.includes("too large") ? 413 : 400;
      return NextResponse.json(result, { status });
    }

    revalidatePath("/admin/media");
    revalidatePath("/admin/media/upload");

    return NextResponse.json({
      success: true,
      trackId: result.trackId,
    });
  } catch (err) {
    console.error("[api/media/upload]", err);
    return NextResponse.json(
      { success: false, error: formatUploadError(err) },
      { status: 500 },
    );
  }
}
