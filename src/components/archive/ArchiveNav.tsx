import Link from "next/link";
import { ARCHIVE_CATEGORIES } from "@/lib/archive/categories";

interface ArchiveNavProps {
  active?: string;
}

export function ArchiveNav({ active }: ArchiveNavProps) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-border/40 pb-4">
      <Link
        href="/archive"
        className={`rounded px-2 py-1 font-mono text-[10px] tracking-wider uppercase ${
          active === "hub" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"
        }`}
      >
        Archive Hub
      </Link>
      {ARCHIVE_CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`/archive/${category.slug}`}
          className={`rounded px-2 py-1 font-mono text-[10px] tracking-wider uppercase ${
            active === category.slug
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {category.title}
        </Link>
      ))}
      <Link
        href="/archive/lore"
        className={`rounded px-2 py-1 font-mono text-[10px] tracking-wider uppercase ${
          active === "lore"
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        Full Index
      </Link>
    </nav>
  );
}
