"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { isNavLinkActive } from "@/lib/navigation/config";

interface NavLinkProps {
  href: string;
  label: string;
  pathname: string;
  description?: string;
  onNavigate?: () => void;
  className?: string;
}

export function NavLink({
  href,
  label,
  pathname,
  description,
  onNavigate,
  className,
}: NavLinkProps) {
  const active = isNavLinkActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "block rounded border border-transparent px-3 py-2 font-mono text-xs tracking-wider uppercase transition-colors",
        "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        active && "border-primary/40 bg-primary/10 text-primary shadow-[0_0_8px_var(--hw-glow)]",
        className,
      )}
      aria-current={active ? "page" : undefined}
    >
      <span>{label}</span>
      {description && (
        <span className="mt-0.5 block text-[10px] tracking-normal text-muted-foreground normal-case">
          {description}
        </span>
      )}
    </Link>
  );
}
