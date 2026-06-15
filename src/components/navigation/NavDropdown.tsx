"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { NavGroupConfig } from "@/lib/navigation/config";
import {
  filterNavGroup,
  getActiveNavSection,
  type NavContext,
} from "@/lib/navigation/config";
import { NavLink } from "@/components/navigation/NavLink";
import { cn } from "@/lib/utils";

interface NavDropdownProps {
  group: NavGroupConfig;
  ctx: NavContext;
  pathname: string;
}

export function NavDropdown({ group, ctx, pathname }: NavDropdownProps) {
  const links = filterNavGroup(group, ctx);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const activeSection = getActiveNavSection(pathname);
  const isActive = activeSection === group.id;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (links.length === 0) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "rounded border px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors",
          "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          (open || isActive) && "border-primary/50 bg-primary/10 text-primary shadow-[0_0_8px_var(--hw-glow)]",
        )}
      >
        {group.terminalLabel}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute top-full left-0 z-50 mt-2 min-w-[12rem] rounded border border-primary/25 bg-background/95 p-2 shadow-lg shadow-primary/10 backdrop-blur-md",
            "before:pointer-events-none before:absolute before:inset-0 before:rounded before:bg-[linear-gradient(180deg,rgba(177,18,58,0.06),transparent)]",
          )}
        >
          <div className="relative space-y-0.5">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
