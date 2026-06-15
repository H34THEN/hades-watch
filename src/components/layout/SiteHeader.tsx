"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { GlitchText } from "@/components/terminal/GlitchText";
import { CommandButton } from "@/components/terminal/CommandButton";
import { getHighestRole } from "@/lib/auth/roles";
import type { RoleName } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/themes", label: "Themes" },
  { href: "/invite", label: "Invite" },
];

const authLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/mmo/factions", label: "Factions" },
  { href: "/events", label: "Events" },
  { href: "/dashboard/transmissions", label: "Transmissions" },
  { href: "/mmo", label: "MMO" },
  { href: "/archive", label: "Archive" },
  { href: "/dead-drops", label: "Dead Drops" },
  { href: "/profile", label: "Profile" },
];

export function SiteHeader({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const roles = (session?.user?.roles ?? []) as RoleName[];
  const highestRole = getHighestRole(roles);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="group flex items-center gap-2 font-mono">
          <span className="text-primary">◈</span>
          <GlitchText
            as="span"
            className="text-sm font-semibold tracking-widest uppercase"
          >
            Hades Watch
          </GlitchText>
        </Link>
        <nav className="hidden items-center gap-3 text-sm lg:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated &&
            authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          {isAuthenticated && (roles.includes("Owner") || roles.includes("Admin")) && (
            <Link href="/admin" className="text-muted-foreground hover:text-primary">
              Admin
            </Link>
          )}
          {isAuthenticated &&
            (roles.includes("Owner") ||
              roles.includes("Admin") ||
              roles.includes("Moderator")) && (
              <Link href="/moderation" className="text-muted-foreground hover:text-primary">
                Mod
              </Link>
            )}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher className="hidden w-40 sm:flex" />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden font-mono text-[10px] tracking-wider text-muted-foreground uppercase lg:inline">
                {highestRole}
              </span>
              <CommandButton
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </CommandButton>
            </div>
          ) : (
            <Link href="/login">
              <CommandButton size="sm">Login</CommandButton>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
