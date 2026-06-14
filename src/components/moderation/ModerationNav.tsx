import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/moderation", label: "Overview" },
  { href: "/moderation/reports", label: "Reports" },
  { href: "/moderation/notes", label: "Notes" },
  { href: "/moderation/notes/new", label: "New Note" },
  { href: "/moderation/actions", label: "Actions" },
];

export function ModerationNav({ active }: { active?: string }) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-border/40 pb-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded px-3 py-1 font-mono text-xs tracking-wider uppercase transition-colors",
            active === link.href
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-primary",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
