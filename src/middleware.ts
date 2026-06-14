import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export default NextAuth(authConfig);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/moderation/:path*",
    "/events/:path*",
    "/mmo/:path*",
    "/archive/:path*",
    "/dead-drops/:path*",
    "/ciphers/:path*",
  ],
};
