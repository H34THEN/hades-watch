"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { requireApprovedAuth } from "@/lib/auth/session";
import { validateCallsign } from "@/lib/profile/callsign";
import { prisma } from "@/lib/prisma";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProfileCallsignAction(formData: FormData): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  const callsignRaw = String(formData.get("callsign") ?? "");
  const isPublic = formData.get("isPublic") !== "false";

  const validated = validateCallsign(callsignRaw);
  if (!validated.ok) return { success: false, error: validated.error };

  const [existing, current] = await Promise.all([
    prisma.character.findFirst({
      where: {
        callsign: { equals: validated.callsign, mode: "insensitive" },
        NOT: { userId: user.id },
      },
      select: { id: true },
    }),
    prisma.character.findUnique({
      where: { userId: user.id },
      select: { callsign: true },
    }),
  ]);
  if (existing) {
    return { success: false, error: "That callsign is already taken." };
  }

  const oldCallsign = current?.callsign?.toLowerCase();

  await prisma.character.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      callsign: validated.callsign,
      isPublic,
    },
    update: {
      callsign: validated.callsign,
      isPublic,
    },
  });

  await writeAuditLog({
    action: "profile.callsign.update",
    actorId: user.id,
    metadata: { callsign: validated.callsign, isPublic },
  });

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath(`/profile/${validated.callsign}`);
  if (oldCallsign && oldCallsign !== validated.callsign) {
    revalidatePath(`/profile/${oldCallsign}`);
  }
  return { success: true };
}
