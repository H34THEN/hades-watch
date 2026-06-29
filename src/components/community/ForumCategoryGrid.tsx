import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

interface ForumCategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconGlyph?: string | null;
  _count?: { threads: number };
}

interface ForumCategoryGridProps {
  categories: ForumCategoryRow[];
}

export function ForumCategoryGrid({ categories }: ForumCategoryGridProps) {
  if (categories.length === 0) {
    return (
      <TerminalPanel title="forums.categories">
        <p className="font-mono text-sm text-muted-foreground">
          No forum channels indexed yet.
        </p>
      </TerminalPanel>
    );
  }

  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/community/forums/${category.slug}`}
          className="block h-full rounded-lg border border-border/60 bg-card/70 p-4 backdrop-blur-sm transition-shadow hover:shadow-[0_0_16px_var(--hw-glow)]"
        >
          <div className="flex items-start gap-3">
            {category.iconGlyph && (
              <span className="font-mono text-lg text-primary" aria-hidden>
                {category.iconGlyph}
              </span>
            )}
            <div>
              <h3 className="font-mono text-sm tracking-wider text-primary uppercase">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
              {category._count && (
                <p className={cn(styles.metaRow, "mt-3")}>
                  {category._count.threads} thread
                  {category._count.threads !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
