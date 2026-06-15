"use client";

import type { NavGroupConfig } from "@/lib/navigation/config";
import { filterNavGroup, type NavContext } from "@/lib/navigation/config";
import { NavLink } from "@/components/navigation/NavLink";
import { cn } from "@/lib/utils";

interface NavGroupProps {
  group: NavGroupConfig;
  ctx: NavContext;
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}

export function NavGroup({ group, ctx, pathname, onNavigate, className }: NavGroupProps) {
  const links = filterNavGroup(group, ctx);
  if (links.length === 0) return null;

  return (
    <section className={cn("space-y-1", className)}>
      <h3 className="px-3 font-mono text-[10px] tracking-[0.2em] text-primary/80 uppercase">
        {group.terminalLabel}
      </h3>
      <div className="space-y-0.5">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            pathname={pathname}
            description={link.description}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}
