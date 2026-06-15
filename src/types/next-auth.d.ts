import type { RoleName } from "@/generated/prisma/client";
import type { DefaultSession } from "next-auth";
import type { UserAccountStatus } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: RoleName[];
      themeId?: string | null;
      accountStatus: UserAccountStatus;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    roles?: RoleName[];
    themeId?: string | null;
    accountStatus?: UserAccountStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: RoleName[];
    themeId?: string | null;
    accountStatus?: UserAccountStatus;
  }
}
