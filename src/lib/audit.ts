import { createHash } from "crypto";
import { headers } from "next/headers";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "invite.validate"
  | "invite.validate.failed"
  | "auth.register"
  | "auth.register.failed"
  | "auth.login"
  | "auth.login.failed"
  | "auth.logout"
  | "auth.email.verify.request"
  | "auth.email.verified"
  | "auth.password.reset.request"
  | "auth.password.reset.complete"
  | "access.denied.admin"
  | "access.denied.moderation"
  | "profile.update"
  | "profile.spotify.update"
  | "profile.spotify.clear"
  | "profile.title.update"
  | "theme.update"
  | "invite.create"
  | "invite.create.with_verification"
  | "invite.revoke"
  | "invite.verification.match"
  | "invite.verification.mismatch"
  | "invite.verification.missing"
  | "user.auto_approve.verification"
  | "user.approve"
  | "user.approve.override_mismatch"
  | "user.reject"
  | "announcement.create"
  | "announcement.update"
  | "announcement.publish"
  | "announcement.archive"
  | "event.create"
  | "event.update"
  | "event.publish"
  | "event.cancel"
  | "moderation.report.create"
  | "moderation.report.status"
  | "moderation.report.assign"
  | "moderation.note.create"
  | "moderation.action"
  | "character.create"
  | "character.update"
  | "faction.join.request"
  | "faction.join.approve"
  | "faction.join.reject"
  | "faction.create"
  | "lore.create"
  | "lore.publish"
  | "lore.unlock"
  | "deaddrop.create"
  | "deaddrop.view"
  | "mission.create"
  | "mission.update"
  | "mission.join"
  | "mission.leave"
  | "mission.complete"
  | "cipher.solved"
  | "user.disable"
  | "user.enable"
  | "user.role.assign"
  | "user.status.assign"
  | "user.faction.assign"
  | "user.faction.remove";

interface AuditEntry {
  action: AuditAction;
  actorId?: string | null;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET ?? "dev-salt";
  return createHash("sha256")
    .update(`${ip}:${salt}`)
    .digest("hex")
    .slice(0, 32);
}

async function getRequestMeta(): Promise<{
  ipHash: string | null;
  userAgent: string | null;
}> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? h.get("x-real-ip");
  const userAgent = h.get("user-agent");
  return {
    ipHash: ip ? hashIp(ip) : null,
    userAgent: userAgent ? userAgent.slice(0, 512) : null,
  };
}

export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  try {
    const { ipHash, userAgent } = await getRequestMeta();
    await prisma.auditLog.create({
      data: {
        action: entry.action,
        actorId: entry.actorId ?? null,
        targetType: entry.targetType,
        targetId: entry.targetId,
        metadata: (entry.metadata as Prisma.InputJsonValue) ?? undefined,
        ipHash,
        userAgent,
      },
    });
  } catch (error) {
    console.error("[audit] Failed to write log:", entry.action, error);
  }
}
