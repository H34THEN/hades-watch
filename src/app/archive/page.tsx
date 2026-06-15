import Link from "next/link";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { ARCHIVE_CATEGORIES } from "@/lib/archive/categories";
import { ARCHIVE_LEADER_INDEX } from "@/lib/archive/character-lore-slugs";
import { getLoreForUser } from "@/lib/actions/lore";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Archive" };

export default async function ArchivePage() {
  const user = await requireAuth();
  const entries = await getLoreForUser(user.id, user.roles);
  const unlocked = entries.filter((e) => e.canRead).length;
  const characterEntries = entries.filter((e) => e.category === "CHARACTER_LORE");
  const readableCharacters = characterEntries.filter((e) => e.canRead).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Archive</h1>
      <ArchiveNav active="hub" />
      <TerminalPanel title="archive.status" className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">
          {unlocked} of {entries.length} recovered files accessible across all sections
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground/80">
          What the surface buries, the underworld remembers.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/archive/characters">
            <CommandButton size="sm">Character Lore ({readableCharacters})</CommandButton>
          </Link>
          <Link href="/archive/lore">
            <CommandButton size="sm" variant="outline">
              Full Index
            </CommandButton>
          </Link>
        </div>
      </TerminalPanel>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {ARCHIVE_CATEGORIES.map((category) => (
          <DashboardCard
            key={category.slug}
            title={category.title}
            description={category.description}
            icon={<span>◫</span>}
          >
            <Link href={`/archive/${category.slug}`}>
              <CommandButton size="sm">Enter</CommandButton>
            </Link>
          </DashboardCard>
        ))}
      </div>

      <TerminalPanel title="archive.leaders.chthonic" className="border-primary/20">
        <p className="mb-4 text-sm text-muted-foreground">
          Dead Index dossiers for the six founding leaders of the Chthonic Uprising.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {ARCHIVE_LEADER_INDEX.map((leader) => (
            <Link
              key={leader.slug}
              href={`/archive/characters/${leader.slug}`}
              className="rounded border border-border/40 p-3 transition-colors hover:border-primary/40"
            >
              <p className="font-mono text-sm font-semibold uppercase text-primary">{leader.title}</p>
              <p className="font-mono text-[10px] text-emerald-500/70">{leader.deadIndexId}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{leader.faction}</p>
            </Link>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}
