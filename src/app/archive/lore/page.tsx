import Link from "next/link";
import { LockedCard } from "@/components/archive/LockedCard";
import { UnlockLoreButton } from "@/components/archive/UnlockLoreButton";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getArchiveEntryPath } from "@/lib/archive/categories";
import { getLoreForUser } from "@/lib/lore/queries";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Lore Archive" };

export default async function LoreArchivePage() {
  const user = await requireAuth();
  const entries = await getLoreForUser(user.id, user.roles);
  const unlocked = entries.filter((e) => e.canRead).length;

  return (
    <PageShell variant="dashboard" scanlines>
      <ArchiveNav active="lore" />
      <header className="mb-8">
        <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">Lore Archive</h1>
        <p className="hw-readable-wide text-sm text-muted-foreground">
          Full index of recovered transmissions across all archive sections. {unlocked} of{" "}
          {entries.length} entries accessible.
        </p>
      </header>

      <div className="hw-library-grid">
        {entries.map((entry) =>
          entry.canRead ? (
            <Link key={entry.id} href={getArchiveEntryPath(entry.slug, entry.category)} className="min-w-0">
              <TerminalPanel title={`lore.${entry.slug}`}>
                <h3 className="font-mono text-sm font-semibold uppercase text-primary">{entry.title}</h3>
                {entry.deadIndexId && (
                  <p className="mt-1 font-mono text-xs text-emerald-500/70">{entry.deadIndexId}</p>
                )}
                {entry.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{entry.excerpt}</p>
                )}
              </TerminalPanel>
            </Link>
          ) : (
            <div key={entry.id} className="min-w-0">
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
          ),
        )}
      </div>
    </PageShell>
  );
}
