"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { RoleName, UserAccountStatus } from "@/generated/prisma/client";
import { GlitchText } from "@/components/terminal/GlitchText";
import { NavGroup } from "@/components/navigation/NavGroup";
import { useBodyScrollLock } from "@/components/navigation/useBodyScrollLock";
import {
  getVisibleNavGroups,
  type NavContext,
} from "@/lib/navigation/config";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "hades-watch-sidebar-open";

interface SidebarNavProps {
  open: boolean;
  onClose: () => void;
  roles: RoleName[];
  accountStatus: UserAccountStatus;
}

export function SidebarNav({ open, onClose, roles, accountStatus }: SidebarNavProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(open);

  const ctx: NavContext = {
    isAuthenticated: true,
    accountStatus,
    roles,
  };
  const groups = getVisibleNavGroups(ctx).filter((g) => g.id !== "account");

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[55] hidden lg:block" role="presentation">
      <button
        type="button"
        aria-label="Close sidebar backdrop"
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Underwatch sidebar navigation"
        className={cn(
          "absolute top-0 left-0 flex h-full w-64 flex-col border-r border-primary/25 bg-background/95 shadow-xl shadow-primary/10 backdrop-blur-md",
        )}
      >
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <GlitchText
            as="p"
            className="font-mono text-[10px] font-semibold tracking-[0.2em] text-primary uppercase"
          >
            Underwatch
          </GlitchText>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="font-mono text-[10px] text-muted-foreground uppercase hover:text-primary"
          >
            ×
          </button>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4">
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
      </aside>
    </div>
  );
}

export function readSidebarPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
}

export function writeSidebarPreference(open: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SIDEBAR_STORAGE_KEY, open ? "true" : "false");
}
