"use server";

import { revalidatePath } from "next/cache";
import type {
  GuildMembershipStatus,
  GuildStatus,
  GuildVisibility,
} from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { getApprovedUserForAction, getModeratorUserForAction } from "@/lib/auth/session";
import { stripCommunityText } from "@/lib/community/sanitize";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { z } from "zod";

export type ActionResult =
  | { success: true; slug?: string }
  | { success: false; error: string };

const guildRequestSchema = z.object({
  name: z.string().min(3).max(80),
  description: z.string().min(20).max(5000),
  purpose: z.string().min(20).max(5000),
  conductAgreement: z.string().min(20).max(5000),
  factionAffinity: z.string().max(64).optional(),
  visibility: z.enum(["PUBLIC", "APPROVED_USERS", "INVITE_ONLY"]).default("APPROVED_USERS"),
  bannerGlyph: z.string().max(8).optional(),
  rules: z.string().max(5000).optional(),
});

const joinSchema = z.object({
  guildId: z.string().min(1),
  message: z.string().max(2000).optional(),
});

export async function requestGuildAction(formData: FormData): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = guildRequestSchema.safeParse({
    name: stripCommunityText(String(formData.get("name") ?? ""), 80),
    description: stripCommunityText(String(formData.get("description") ?? ""), 5000),
    purpose: stripCommunityText(String(formData.get("purpose") ?? ""), 5000),
    conductAgreement: stripCommunityText(
      String(formData.get("conductAgreement") ?? ""),
      5000,
    ),
    factionAffinity: formData.get("factionAffinity") || undefined,
    visibility: formData.get("visibility") || "APPROVED_USERS",
    bannerGlyph: formData.get("bannerGlyph") || undefined,
    rules: formData.get("rules") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid guild request.",
    };
  }

  const baseSlug = slugify(parsed.data.name) || "guild";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const guild = await prisma.guild.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      purpose: parsed.data.purpose,
      conductAgreement: parsed.data.conductAgreement,
      factionAffinity: parsed.data.factionAffinity?.trim() || null,
      visibility: parsed.data.visibility as GuildVisibility,
      bannerGlyph: parsed.data.bannerGlyph?.trim() || null,
      rules: parsed.data.rules
        ? stripCommunityText(parsed.data.rules, 5000)
        : null,
      status: "PENDING_REVIEW",
      founderId: auth.id,
    },
  });

  await prisma.guildMembership.create({
    data: {
      guildId: guild.id,
      userId: auth.id,
      role: "FOUNDER",
      status: "APPROVED",
    },
  });

  await writeAuditLog({
    action: "guild.request",
    actorId: auth.id,
    targetType: "Guild",
    targetId: guild.id,
    metadata: { slug, name: parsed.data.name },
  });

  revalidatePath("/guilds");
  revalidatePath("/mmo/community");
  revalidatePath("/admin/community");
  return { success: true, slug };
}

export async function joinGuildAction(formData: FormData): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = joinSchema.safeParse({
    guildId: formData.get("guildId"),
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid join request.",
    };
  }

  const guild = await prisma.guild.findFirst({
    where: {
      id: parsed.data.guildId,
      status: "APPROVED",
      visibility: { in: ["PUBLIC", "APPROVED_USERS"] },
    },
    select: { id: true, slug: true, founderId: true },
  });

  if (!guild) {
    return { success: false, error: "Guild not found or not accepting members." };
  }

  if (guild.founderId === auth.id) {
    return { success: false, error: "You already founded this guild." };
  }

  await prisma.guildMembership.upsert({
    where: {
      guildId_userId: {
        guildId: guild.id,
        userId: auth.id,
      },
    },
    create: {
      guildId: guild.id,
      userId: auth.id,
      role: "APPLICANT",
      status: "PENDING",
      message: parsed.data.message
        ? stripCommunityText(parsed.data.message, 2000)
        : null,
    },
    update: {
      status: "PENDING",
      message: parsed.data.message
        ? stripCommunityText(parsed.data.message, 2000)
        : null,
    },
  });

  await writeAuditLog({
    action: "guild.join",
    actorId: auth.id,
    targetType: "Guild",
    targetId: guild.id,
  });

  revalidatePath("/guilds");
  revalidatePath(`/guilds/${guild.slug}`);
  return { success: true };
}

export async function reviewGuildAction(
  guildId: string,
  status: GuildStatus,
  reviewNote?: string,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    select: { id: true, slug: true },
  });

  if (!guild) {
    return { success: false, error: "Guild not found." };
  }

  await prisma.guild.update({
    where: { id: guildId },
    data: {
      status,
      reviewNote: reviewNote?.trim() || null,
      reviewedById: auth.id,
      reviewedAt: new Date(),
    },
  });

  await writeAuditLog({
    action: "guild.review",
    actorId: auth.id,
    targetType: "Guild",
    targetId: guildId,
    metadata: { status },
  });

  revalidatePath("/guilds");
  revalidatePath(`/guilds/${guild.slug}`);
  revalidatePath("/admin/community");
  return { success: true };
}

export async function reviewGuildMembershipAction(
  membershipId: string,
  status: GuildMembershipStatus,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const membership = await prisma.guildMembership.findUnique({
    where: { id: membershipId },
    include: { guild: { select: { slug: true } } },
  });

  if (!membership) {
    return { success: false, error: "Membership not found." };
  }

  await prisma.guildMembership.update({
    where: { id: membershipId },
    data: {
      status,
      ...(status === "APPROVED" ? { role: "MEMBER" } : {}),
    },
  });

  await writeAuditLog({
    action: "guild.membership.review",
    actorId: auth.id,
    targetType: "GuildMembership",
    targetId: membershipId,
    metadata: { status, guildId: membership.guildId },
  });

  revalidatePath("/guilds");
  revalidatePath(`/guilds/${membership.guild.slug}`);
  revalidatePath("/admin/community");
  return { success: true };
}
