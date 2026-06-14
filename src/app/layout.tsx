import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/layout/Providers";
import { auth } from "@/lib/auth";
import { getUserThemeId } from "@/lib/users";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Hades Watch",
    template: "%s | Hades Watch",
  },
  description:
    "A cyberpunk/gothic/ops-themed community platform. Forbidden terminal. Hidden network.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAuthenticated = !!session?.user?.id;
  const userThemeId = isAuthenticated
    ? await getUserThemeId(session.user.id)
    : null;

  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers
          userThemeId={userThemeId}
          isAuthenticated={isAuthenticated}
        >
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
