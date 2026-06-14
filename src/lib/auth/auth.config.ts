import type { NextAuthConfig } from "next-auth";
import type { RoleName } from "@/generated/prisma/client";

/**
 * Edge-compatible auth config (middleware).
 * Providers are added in index.ts for Node.js runtime only.
 */
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.roles = (user.roles as RoleName[]) ?? ["Member"];
        token.themeId = user.themeId ?? null;
      }

      if (trigger === "update" && session?.themeId !== undefined) {
        token.themeId = session.themeId;
      }

      if (trigger === "update" && session?.name !== undefined) {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as RoleName[]) ?? ["Member"];
        session.user.themeId = (token.themeId as string | null) ?? null;
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;

      const protectedRoutes = [
        "/dashboard",
        "/profile",
        "/admin",
        "/moderation",
        "/events",
        "/mmo",
        "/archive",
        "/dead-drops",
        "/ciphers",
      ];

      if (protectedRoutes.some((r) => path.startsWith(r))) {
        return isLoggedIn;
      }

      return true;
    },
  },
};
