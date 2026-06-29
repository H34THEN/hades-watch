import Link from "next/link";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { PageShell } from "@/components/layout/PageShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { ARCHIVE_CATEGORIES } from "@/lib/archive/categories";
import { ARCHIVE_LEADER_INDEX } from "@/lib/archive/character-lore-slugs";
import {
  GHOST_IN_TECH_SECTION,
  STATE_OF_AFFAIRS_SECTION,
} from "@/lib/archive/signal-sections";
import { getLoreForUser } from "@/lib/lore/queries";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Archive" };

export default async function ArchivePage() {
  const user = await requireAuth();
  const entries = await getLoreForUser(user.id, user.roles);
  const unlocked = entries.filter((e) => e.canRead).length;
  const characterEntries = entries.filter((e) => e.category === "CHARACTER_LORE");
  const readableCharacters = characterEntries.filter((e) => e.canRead).length;

  return (
    <PageShell variant="dashboard" scanlines>
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Archive</h1>
      <ArchiveNav active="hub" />
      <TerminalPanel title="archive.status" className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">
          {unlocked} of {entries.length} recovered lore files accessible across classified sections
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground/80">
          The Archive is the underworld index for signals, tools, lore, and records the Surface Order
          would rather bury.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/archive/characters">
            <CommandButton size="sm">Character Lore ({readableCharacters})</CommandButton>
          </Link>
          <Link href="/archive/lore">
            <CommandButton size="sm" variant="outline">
              Full Lore Index
            </CommandButton>
          </Link>
        </div>
      </TerminalPanel>

      <h2 className="mb-3 font-mono text-sm tracking-widest text-primary uppercase">Signal Feeds</h2>
      <div className="mb-8 hw-dashboard-grid">
        <DashboardCard
          title={STATE_OF_AFFAIRS_SECTION.title}
          description={STATE_OF_AFFAIRS_SECTION.description}
          icon={<span>◎</span>}
        >
          <Link href={`/archive/${STATE_OF_AFFAIRS_SECTION.slug}`}>
            <CommandButton size="sm">Surface Signals</CommandButton>
          </Link>
        </DashboardCard>
        <DashboardCard
          title={GHOST_IN_TECH_SECTION.title}
          description={GHOST_IN_TECH_SECTION.description}
          icon={<span>⌁</span>}
        >
          <Link href={`/archive/${GHOST_IN_TECH_SECTION.slug}`}>
            <CommandButton size="sm">Repo Reliquary</CommandButton>
          </Link>
        </DashboardCard>
      </div>

      <h2 className="mb-3 font-mono text-sm tracking-widest text-primary uppercase">Classified Lore</h2>
      <div className="mb-8 hw-dashboard-grid">
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
        <div className="hw-dashboard-grid">
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
    </PageShell>
  );
}
