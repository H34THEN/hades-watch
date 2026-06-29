import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import styles from "@/components/mmo/text-mmo.module.css";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const faction = await prisma.faction.findUnique({ where: { slug }, select: { name: true } });
  return { title: faction ? `${faction.name} Floor // Phase 2` : "Faction Floor" };
}

export default async function FactionFloorPlaceholderPage({ params }: PageProps) {
  await requireAuth();
  const { slug } = await params;
  const faction = await prisma.faction.findUnique({ where: { slug } });
  if (!faction) notFound();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
        <Link href="/mmo/rooms/faction-floors" className="font-mono text-xs text-muted-foreground hover:text-primary">
          ← Faction Floors
        </Link>
        <h1 className={`${styles.heroTitle} mt-4`}>{faction.name} Floor</h1>
        <MmoTextNav active="/mmo/factions" />

        <TerminalPanel title="faction.floor.phase2">
          <p className="text-sm text-muted-foreground">
            Dedicated faction floor gameplay is scheduled for phase 2. For now, align through the
            faction dossier, missions, and Dead Drops tagged to this cell.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/mmo/factions/${slug}`}>
              <CommandButton size="sm">Faction Dossier</CommandButton>
            </Link>
            <Link href="/mmo/dead-drops">
              <CommandButton size="sm" variant="outline">
                Dead Drops
              </CommandButton>
            </Link>
            <Link href="/mmo/missions">
              <CommandButton size="sm" variant="outline">
                Missions
              </CommandButton>
            </Link>
          </div>
        </TerminalPanel>
    </PageShell>
  );
}
