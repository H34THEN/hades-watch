"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { RoleName, UserAccountStatus } from "@/generated/prisma/client";
import { CommandButton } from "@/components/terminal/CommandButton";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { GlitchText } from "@/components/terminal/GlitchText";
import { NavGroup } from "@/components/navigation/NavGroup";
import { useBodyScrollLock } from "@/components/navigation/useBodyScrollLock";
import {
  getVisibleNavGroups,
  type NavContext,
} from "@/lib/navigation/config";
import { getHighestRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  roles: RoleName[];
  accountStatus: UserAccountStatus;
}

export function MobileNavDrawer({
  open,
  onClose,
  roles,
  accountStatus,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(open);

  const ctx: NavContext = {
    isAuthenticated: true,
    accountStatus,
    roles,
  };
  const groups = getVisibleNavGroups(ctx);
  const highestRole = getHighestRole(roles);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
      <button
        type="button"
        aria-label="Close menu backdrop"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Underwatch Navigation"
        className={cn(
          "absolute top-0 right-0 flex h-full w-[min(100vw-2.5rem,20rem)] flex-col border-l border-primary/30 bg-background/95 shadow-2xl shadow-primary/20 backdrop-blur-md",
        )}
      >
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div>
            <GlitchText
              as="p"
              className="font-mono text-xs font-semibold tracking-widest text-primary uppercase"
            >
              Underwatch Navigation
            </GlitchText>
            <p className="font-mono text-[10px] text-muted-foreground">{highestRole}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Menu"
            className="rounded border border-border/50 px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Close Menu
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4" aria-label="Mobile navigation">
          {groups.map((group) => (
            <NavGroup
              key={group.id}
              group={group}
              ctx={ctx}
              pathname={pathname}
              onNavigate={onClose}
            />
          ))}
        </nav>

        <div className="space-y-3 border-t border-border/50 px-4 py-4">
          <p className="font-mono text-[10px] tracking-[0.2em] text-primary/80 uppercase">
            Account
          </p>
          <ThemeSwitcher className="w-full" />
          <CommandButton
            size="sm"
            className="w-full"
            onClick={() => {
              onClose();
              signOut({ callbackUrl: "/" });
            }}
          >
            Logout
          </CommandButton>
        </div>
      </aside>
    </div>
  );
}
