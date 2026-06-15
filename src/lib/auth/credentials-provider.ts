import Credentials from "next-auth/providers/credentials";
import { writeAuditLog } from "@/lib/audit";
import { verifyPassword } from "@/lib/auth/password";
import { getUserRoles } from "@/lib/users";
import { checkRateLimit } from "@/lib/rate-limit";
import { isRateLimitEnabled } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export const credentialsProvider = Credentials({
  id: "credentials",
  name: "Email",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const parsed = loginSchema.safeParse(credentials);
    if (!parsed.success) {
      await writeAuditLog({
        action: "auth.login.failed",
        metadata: { reason: "validation_failed" },
      });
      return null;
    }

    const { email, password } = parsed.data;

    if (isRateLimitEnabled()) {
      const rl = await checkRateLimit({
        key: `login:${email.toLowerCase()}`,
        limit: 10,
        windowSec: 900,
      });
      if (!rl.allowed) {
        await writeAuditLog({
          action: "auth.login.failed",
          metadata: { reason: "rate_limited", email: email.toLowerCase() },
        });
        return null;
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { name: { equals: email, mode: "insensitive" } },
        ],
      },
      include: { themePreference: true },
    });

    if (!user?.passwordHash) {
      await writeAuditLog({
        action: "auth.login.failed",
        metadata: { reason: "user_not_found" },
      });
      return null;
    }

    if (user.disabled || user.banned) {
      await writeAuditLog({
        action: "auth.login.failed",
        actorId: user.id,
        metadata: { reason: "account_disabled" },
      });
      return null;
    }

    if (user.accountStatus === "Rejected") {
      await writeAuditLog({
        action: "auth.login.failed",
        actorId: user.id,
        metadata: { reason: "account_rejected" },
      });
      return null;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      await writeAuditLog({
        action: "auth.login.failed",
        actorId: user.id,
        metadata: { reason: "invalid_password" },
      });
      return null;
    }

    const roles = await getUserRoles(user.id);

    await writeAuditLog({
      action: "auth.login",
      actorId: user.id,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
      themeId: user.themePreference?.themeId ?? null,
      accountStatus: user.accountStatus,
    };
  },
});
