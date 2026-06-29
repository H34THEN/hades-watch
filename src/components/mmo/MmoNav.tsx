import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/mmo", label: "Hub" },
  { href: "/mmo/character", label: "Character" },
  { href: "/mmo/factions", label: "Factions" },
  { href: "/mmo/missions", label: "Missions" },
  { href: "/ciphers", label: "Ciphers" },
];

export function MmoNav({ active }: { active?: string }) {
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
      <Link href="/archive" className="ml-auto rounded px-3 py-1 font-mono text-xs tracking-wider text-muted-foreground uppercase hover:text-primary">
        Archive →
      </Link>
    </nav>
  );
}
