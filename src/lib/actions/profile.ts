"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { requireAuth } from "@/lib/auth/session";
import { computeEarnedTitles } from "@/lib/dossier";
import { parseSpotifyPlaylistUrl } from "@/lib/spotify";
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

const spotifySchema = z.object({
  playlistUrl: z.string().max(512),
});

const titleSchema = z.object({
  activeTitle: z.string().min(1).max(64),
});

export async function updateSpotifyPlaylistAction(
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireAuth();
  const raw = (formData.get("playlistUrl") as string) ?? "";

  if (!raw.trim()) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        spotifyPlaylistId: null,
        spotifyPlaylistUrl: null,
        spotifyEmbedUrl: null,
      },
    });
    await writeAuditLog({
      action: "profile.spotify.clear",
      actorId: user.id,
      targetType: "user",
      targetId: user.id,
    });
    revalidatePath("/profile");
    return { success: true };
  }

  const parsed = spotifySchema.safeParse({ playlistUrl: raw });
  if (!parsed.success) {
    return { success: false, error: "Invalid playlist URL." };
  }

  const spotify = parseSpotifyPlaylistUrl(parsed.data.playlistUrl);
  if (!spotify) {
    return {
      success: false,
      error:
        "Only public Spotify playlist links are accepted (open.spotify.com/playlist/...).",
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      spotifyPlaylistId: spotify.playlistId,
      spotifyPlaylistUrl: spotify.canonicalUrl,
      spotifyEmbedUrl: spotify.embedUrl,
    },
  });

  await writeAuditLog({
    action: "profile.spotify.update",
    actorId: user.id,
    targetType: "user",
    targetId: user.id,
    metadata: { playlistId: spotify.playlistId },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function updateActiveTitleAction(
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireAuth();
  const parsed = titleSchema.safeParse({
    activeTitle: formData.get("activeTitle"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid title selection." };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      userRoles: { include: { role: true } },
      factionMemberships: { where: { status: "Approved" } },
      cipherSolves: true,
      missionParticipations: true,
      loreUnlocks: true,
    },
  });

  if (!dbUser) return { success: false, error: "User not found." };

  const roles = dbUser.userRoles.map((ur) => ur.role.name);
  const earned = computeEarnedTitles({
    roles,
    cipherSolveCount: dbUser.cipherSolves.length,
    missionsCompleted: dbUser.missionParticipations.filter((m) => m.status === "Completed")
      .length,
    factionApproved: dbUser.factionMemberships.length > 0,
    loreUnlockCount: dbUser.loreUnlocks.length,
  });

  if (!earned.some((t) => t.label === parsed.data.activeTitle)) {
    return { success: false, error: "You have not earned that title yet." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { activeTitle: parsed.data.activeTitle },
  });

  await writeAuditLog({
    action: "profile.title.update",
    actorId: user.id,
    targetType: "user",
    targetId: user.id,
    metadata: { activeTitle: parsed.data.activeTitle },
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
