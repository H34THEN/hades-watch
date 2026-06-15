"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import type { RoleName, UserAccountStatus } from "@/generated/prisma/client";
import { GlitchText } from "@/components/terminal/GlitchText";
import { CommandButton } from "@/components/terminal/CommandButton";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { AccountMenu, DesktopNavMenu } from "@/components/navigation/DesktopNavMenu";
import { MobileNavDrawer } from "@/components/navigation/MobileNavDrawer";
import {
  readSidebarPreference,
  SidebarNav,
  writeSidebarPreference,
} from "@/components/navigation/SidebarNav";
import { NavGroup } from "@/components/navigation/NavGroup";
import { NavLink } from "@/components/navigation/NavLink";
import { useBodyScrollLock } from "@/components/navigation/useBodyScrollLock";
import { getVisibleNavGroups, type NavContext } from "@/lib/navigation/config";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? readSidebarPreference() : false,
  );

  const isAuthenticated = status === "authenticated";
  const roles = (session?.user?.roles ?? []) as RoleName[];
  const accountStatus =
    (session?.user?.accountStatus as UserAccountStatus | undefined) ?? "Approved";

  function toggleSidebar() {
    setSidebarOpen((prev) => {
      const next = !prev;
      writeSidebarPreference(next);
      return next;
    });
  }

  const publicCtx: NavContext = {
    isAuthenticated: false,
    accountStatus: "Approved",
    roles: [],
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md",
          className,
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Toggle Underwatch sidebar"
                className="hidden rounded border border-border/50 px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:inline-flex"
              >
                ◫
              </button>
            )}
            <Link href="/" className="group flex min-w-0 items-center gap-2 font-mono">
              <span className="text-primary">◈</span>
              <GlitchText
                as="span"
                className="truncate text-sm font-semibold tracking-widest uppercase"
              >
                Hades Watch
              </GlitchText>
            </Link>
            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-emerald-500/70 uppercase sm:inline">
              Underwatch Online
            </span>
          </div>

          {isAuthenticated ? (
            <>
              <DesktopNavMenu roles={roles} accountStatus={accountStatus} />
              <AccountMenu roles={roles} accountStatus={accountStatus} />
              <button
                type="button"
                aria-label="Open Underwatch Menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
                className="inline-flex rounded border border-primary/40 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-primary uppercase shadow-[0_0_8px_var(--hw-glow)] hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden"
              >
                Menu
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-2 sm:flex" aria-label="Public navigation">
                {getVisibleNavGroups(publicCtx)[0]?.links.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    pathname={pathname}
                    className="px-2 py-1"
                  />
                ))}
              </nav>
              <ThemeSwitcher className="hidden w-32 sm:flex" />
              <Link href="/login">
                <CommandButton size="sm">Login</CommandButton>
              </Link>
              <button
                type="button"
                aria-label="Open Underwatch Menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
                className="inline-flex rounded border border-primary/40 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-primary uppercase sm:hidden"
              >
                Menu
              </button>
            </div>
          )}
        </div>
      </header>

      {isAuthenticated ? (
        <>
          <MobileNavDrawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            roles={roles}
            accountStatus={accountStatus}
          />
          <SidebarNav
            open={sidebarOpen}
            onClose={() => {
              setSidebarOpen(false);
              writeSidebarPreference(false);
            }}
            roles={roles}
            accountStatus={accountStatus}
          />
        </>
      ) : (
        <PublicMobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
      )}
    </>
  );
}

function PublicMobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const publicCtx: NavContext = {
    isAuthenticated: false,
    accountStatus: "Approved",
    roles: [],
  };
  const groups = getVisibleNavGroups(publicCtx);
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] sm:hidden" role="presentation">
      <button
        type="button"
        aria-label="Close menu backdrop"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Underwatch Navigation"
        className="absolute top-0 right-0 flex h-full w-[min(100vw-2.5rem,20rem)] flex-col border-l border-primary/30 bg-background/95 p-4 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            Underwatch Navigation
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Menu"
            className="font-mono text-[10px] text-muted-foreground uppercase"
          >
            Close Menu
          </button>
        </div>
        <nav className="space-y-4">
          {groups.map((group) => (
            <NavGroup
              key={group.id}
              group={group}
              ctx={publicCtx}
              pathname={pathname}
              onNavigate={onClose}
            />
          ))}
        </nav>
        <div className="mt-auto pt-4">
          <ThemeSwitcher className="w-full" />
        </div>
      </aside>
    </div>
  );
}
