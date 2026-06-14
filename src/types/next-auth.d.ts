import type { RoleName } from "@/generated/prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: RoleName[];
      themeId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    roles?: RoleName[];
    themeId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: RoleName[];
    themeId?: string | null;
  }
}
