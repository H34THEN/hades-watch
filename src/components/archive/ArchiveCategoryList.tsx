import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { LockedCard } from "@/components/archive/LockedCard";
import { UnlockLoreButton } from "@/components/archive/UnlockLoreButton";
import { WorldLoreMetadataInline } from "@/components/archive/WorldLoreMetadata";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  ARCHIVE_CATEGORIES,
  getArchiveEntryPath,
  getCategoryByRouteSlug,
} from "@/lib/archive/categories";
import { getLoreForUser } from "@/lib/actions/lore";
import { requireAuth } from "@/lib/auth/session";

interface ArchiveCategoryListProps {
  categorySlug: string;
}

export async function ArchiveCategoryList({ categorySlug }: ArchiveCategoryListProps) {
  const user = await requireAuth();
  const meta = getCategoryByRouteSlug(categorySlug);
  if (!meta) notFound();

  const entries = await getLoreForUser(user.id, user.roles, meta.loreCategory);
  const readable = entries.filter((e) => e.canRead);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <ArchiveNav active={categorySlug} />
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">{meta.title}</h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{meta.description}</p>
      {categorySlug === "world" && (
        <TerminalPanel title="archive.world.surface_breaks" className="mb-6 border-primary/20">
          <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
            World Lore Pack 001: The Surface Breaks
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Five early fractures in the Surface Order — civic necrosis, manufactured hunger, civic
            exorcism, foreign flame, and annihilation theater. Filed for the Dead Index.
          </p>
        </TerminalPanel>
      )}
      <TerminalPanel title={meta.terminalLabel} className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">
          {readable.length} of {entries.length} dossiers accessible in this section
        </p>
      </TerminalPanel>
      <div className="space-y-4">
        {entries.length === 0 ? (
          <TerminalPanel title="archive.empty">
            <p className="font-mono text-sm text-muted-foreground">
              No recovered files in this section yet. Underwatch is still indexing.
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground/80">
              Run <code className="text-primary">npm run db:seed:lore</code> on the server if this
              section should already have entries.
            </p>
          </TerminalPanel>
        ) : (
          entries.map((entry) =>
            entry.canRead ? (
              <Link key={entry.id} href={getArchiveEntryPath(entry.slug, entry.category)}>
                <TerminalPanel title={`lore.${entry.slug}`}>
                  <h3 className="font-mono text-sm font-semibold uppercase text-primary">
                    {entry.title}
                  </h3>
                  {entry.category === "WORLD_LORE" && <WorldLoreMetadataInline entry={entry} />}
                  {entry.deadIndexId && (
                    <p className="mt-1 font-mono text-xs text-emerald-500/70">{entry.deadIndexId}</p>
                  )}
                  {entry.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{entry.excerpt}</p>
                  )}
                </TerminalPanel>
              </Link>
            ) : (
              <div key={entry.id}>
                <LockedCard
                  title={entry.title}
                  reason={
                    !entry.accessible
                      ? "Clearance or faction requirement not met"
                      : "Entry not yet unlocked"
                  }
                />
                {entry.accessible && !entry.unlocked && (
                  <div className="mt-2">
                    <UnlockLoreButton loreEntryId={entry.id} />
                  </div>
                )}
              </div>
            )
          )
        )}
      </div>
      <div className="mt-10 flex flex-wrap gap-2">
        {ARCHIVE_CATEGORIES.filter((c) => c.slug !== categorySlug).map((c) => (
          <Link
            key={c.slug}
            href={`/archive/${c.slug}`}
            className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {c.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
