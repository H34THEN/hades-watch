import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/pending-approval",
    "/admin/:path*",
    "/moderation/:path*",
    "/events/:path*",
    "/mmo/:path*",
    "/archive/:path*",
    "/dead-drops/:path*",
    "/ciphers/:path*",
  ],
};
