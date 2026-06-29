import Link from "next/link";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { ArchiveArticleCard, ArchiveRepoCard } from "@/components/archive/ArchiveSignalCards";
import { PageShell } from "@/components/layout/PageShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getArchiveItems, type ArchiveSort } from "@/lib/actions/archive-items";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import type { ArchiveSignalSection } from "@/lib/archive/signal-sections";
import { getSignalSubmitPath } from "@/lib/archive/signal-sections";

interface ArchiveSignalFeedProps {
  section: ArchiveSignalSection;
  sort?: ArchiveSort;
}

export async function ArchiveSignalFeed({ section, sort = "newest" }: ArchiveSignalFeedProps) {
  await requireAuth();
  const user = await getSessionUser();
  const canSubmit = user ? isApprovedUser(user) : false;
  const canModerate = user ? isModerator(user.roles) : false;

  const items = await getArchiveItems(section.itemType, sort, { includeModeration: canModerate });

  return (
    <PageShell variant="dashboard" scanlines>
      <ArchiveNav active={section.slug} />
      <header className="mb-8">
        <h1 className="mb-1 font-mono text-3xl tracking-widest uppercase">{section.title}</h1>
        <p className="mb-2 font-mono text-[10px] tracking-wider text-primary/70 uppercase">
          {section.subtitle}
        </p>
        <p className="hw-readable-wide text-sm text-muted-foreground">{section.description}</p>
      </header>

      <TerminalPanel title={section.terminalLabel} className="mb-6">
        <div className="hw-wide-toolbar">
          <p className="font-mono text-sm text-muted-foreground">
            {items.length} signal{items.length !== 1 ? "s" : ""} indexed
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/archive/${section.slug}?sort=newest`}>
              <CommandButton size="sm" variant={sort === "newest" ? "default" : "outline"}>
                Newest
              </CommandButton>
            </Link>
            <Link href={`/archive/${section.slug}?sort=discussed`}>
              <CommandButton size="sm" variant={sort === "discussed" ? "default" : "outline"}>
                Most Discussed
              </CommandButton>
            </Link>
            {canSubmit && (
              <Link href={getSignalSubmitPath(section.slug)}>
                <CommandButton size="sm">{section.submitLabel}</CommandButton>
              </Link>
            )}
          </div>
        </div>
      </TerminalPanel>

      {items.length === 0 ? (
        <TerminalPanel title="archive.signals.empty">
          <p className="font-mono text-sm text-muted-foreground">{section.emptyMessage}</p>
        </TerminalPanel>
      ) : section.itemType === "ARTICLE" ? (
        <div className="hw-library-grid">
          {items.map((item) => (
            <div key={item.id} className="min-w-0">
              <ArchiveArticleCard item={item} section={section} showModeration={canModerate} />
            </div>
          ))}
        </div>
      ) : (
        <div className="hw-library-grid">
          {items.map((item) => (
            <ArchiveRepoCard key={item.id} item={item} section={section} showModeration={canModerate} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
