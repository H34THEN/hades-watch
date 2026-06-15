import Link from "next/link";
import type { LoreEntry, Faction } from "@/generated/prisma/client";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { LockedCard } from "@/components/archive/LockedCard";
import { UnlockLoreButton } from "@/components/archive/UnlockLoreButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getCategoryByLoreCategory } from "@/lib/archive/categories";
import type { CharacterLoreMetadata } from "@/lib/archive/character-lore";
import { WorldLoreMetadataPanel } from "@/components/archive/WorldLoreMetadata";

type LoreEntryWithFaction = LoreEntry & {
  requiredFaction: Pick<Faction, "name" | "slug"> | null;
};

interface LoreDetailViewProps {
  entry: LoreEntryWithFaction;
  accessible: boolean;
  unlocked: boolean;
  canRead: boolean;
  backHref: string;
  backLabel?: string;
}

function parseCharacterMetadata(entry: LoreEntry): CharacterLoreMetadata | null {
  if (entry.category !== "CHARACTER_LORE") return null;
  if (!entry.loreMetadata || typeof entry.loreMetadata !== "object" || Array.isArray(entry.loreMetadata)) {
    return null;
  }
  const raw = entry.loreMetadata as Record<string, unknown>;
  if (!Array.isArray(raw.aliases)) return null;
  return entry.loreMetadata as unknown as CharacterLoreMetadata;
}

export function LoreDetailView({
  entry,
  accessible,
  unlocked,
  canRead,
  backHref,
  backLabel = "Archive",
}: LoreDetailViewProps) {
  const metadata = parseCharacterMetadata(entry);
  const categorySlug = getCategoryByLoreCategory(entry.category)?.slug;

  if (!accessible) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        {categorySlug && <ArchiveNav active={categorySlug} />}
        <Link href={backHref} className="font-mono text-xs text-muted-foreground hover:text-primary">
          ← {backLabel}
        </Link>
        <div className="mt-4">
          <LockedCard title={entry.title} reason="Clearance or faction requirement not met" />
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        {categorySlug && <ArchiveNav active={categorySlug} />}
        <Link href={backHref} className="font-mono text-xs text-muted-foreground hover:text-primary">
          ← {backLabel}
        </Link>
        <TerminalPanel title={`lore.${entry.slug}`} className="mt-4">
          <h1 className="font-mono text-xl tracking-widest uppercase text-primary">{entry.title}</h1>
          {entry.deadIndexId && (
            <p className="mt-2 font-mono text-xs text-emerald-500/80">{entry.deadIndexId}</p>
          )}
          {entry.excerpt && <p className="mt-4 text-sm text-muted-foreground">{entry.excerpt}</p>}
          <p className="mt-4 font-mono text-xs text-amber-400">
            Classified entry. Unlock required to read full testimony.
          </p>
          <div className="mt-4">
            <UnlockLoreButton loreEntryId={entry.id} />
          </div>
        </TerminalPanel>
      </div>
    );
  }

  if (!canRead) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {categorySlug ? <ArchiveNav active={categorySlug} /> : null}
      <Link href={backHref} className="font-mono text-xs text-muted-foreground hover:text-primary">
        ← {backLabel}
      </Link>
      <TerminalPanel title={`lore.${entry.slug}`} className="mt-4">
        <h1 className="font-mono text-xl tracking-widest uppercase text-primary">{entry.title}</h1>
        {entry.deadIndexId && (
          <p className="mt-2 font-mono text-xs text-emerald-500/80">Dead Index: {entry.deadIndexId}</p>
        )}
        {metadata && (
          <div className="mt-4 space-y-1 font-mono text-xs text-muted-foreground">
            {metadata.role && <p>Function: {metadata.role}</p>}
            {metadata.archetype && <p>Archetype: {metadata.archetype}</p>}
            {metadata.aliases.length > 0 ? (
              <p>Aliases: {metadata.aliases.join(" · ")}</p>
            ) : null}
            {entry.requiredFaction && <p>Cell: {entry.requiredFaction.name}</p>}
          </div>
        )}
        {entry.category === "WORLD_LORE" && <WorldLoreMetadataPanel entry={entry} />}
        {entry.excerpt && entry.category !== "CHARACTER_LORE" && (
          <p className="mt-4 text-sm text-muted-foreground">{entry.excerpt}</p>
        )}
        <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
          {entry.body}
        </div>
      </TerminalPanel>
    </div>
  );
}
