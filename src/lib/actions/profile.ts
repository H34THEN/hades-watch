"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { requireAuth } from "@/lib/auth/session";
import { getThemeById } from "@/lib/themes/registry";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(64, "Display name is too long"),
});

const themeSchema = z.object({
  themeId: z.string().min(1),
});

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireAuth();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid profile data",
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });

  await writeAuditLog({
    action: "profile.update",
    actorId: user.id,
    targetType: "user",
    targetId: user.id,
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateThemePreferenceAction(
  themeId: string,
): Promise<ActionResult> {
  const user = await requireAuth();

  const parsed = themeSchema.safeParse({ themeId });
  if (!parsed.success || !getThemeById(parsed.data.themeId)) {
    return { success: false, error: "Invalid theme selection" };
  }

  await prisma.themePreference.upsert({
    where: { userId: user.id },
    create: { userId: user.id, themeId: parsed.data.themeId },
    update: { themeId: parsed.data.themeId },
  });

  await writeAuditLog({
    action: "theme.update",
    actorId: user.id,
    targetType: "user",
    targetId: user.id,
    metadata: { themeId: parsed.data.themeId },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function logoutAction(): Promise<void> {
  const session = await auth();
  if (session?.user?.id) {
    await writeAuditLog({
      action: "auth.logout",
      actorId: session.user.id,
    });
  }
}
