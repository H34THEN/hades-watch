import Link from "next/link";
import { notFound } from "next/navigation";
import { MmoRoomActionPanel } from "@/components/mmo/MmoRoomActionPanel";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import styles from "@/components/mmo/text-mmo.module.css";
import {
  factionSlugToName,
  formatMmoAccessLevel,
  formatMmoRoomState,
  formatMmoRoomType,
} from "@/lib/mmo/text-mmo-labels";
import { playerDisplayName } from "@/lib/mmo/text-mmo-validation";
import { getMmoRoomBySlug } from "@/lib/queries/text-mmo";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ roomSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { roomSlug } = await params;
  const room = await prisma.mmoRoom.findUnique({ where: { slug: roomSlug }, select: { title: true } });
  return { title: room ? `${room.title} // Underwatch` : "Room Not Found" };
}

export default async function MmoRoomDetailPage({ params }: PageProps) {
  await requireAuth();
  const { roomSlug } = await params;
  const room = await getMmoRoomBySlug(roomSlug);
  if (!room) notFound();

  const secondary = Array.isArray(room.secondaryFactionSlugs)
    ? (room.secondaryFactionSlugs as string[])
    : [];

  const archiveLinks =
    roomSlug === "archive-terminal"
      ? [
          { href: "/archive", label: "Archive Index" },
          { href: "/archive/state-of-affairs", label: "State of Affairs" },
          { href: "/archive/ghost-in-tech", label: "Ghost in Tech" },
        ]
      : [];

  const factionFloorLinks =
    roomSlug === "faction-floors"
      ? await prisma.faction.findMany({
          select: { name: true, slug: true },
          orderBy: { name: "asc" },
        })
      : [];

  return (
    <div className={`mx-auto max-w-4xl px-4 py-16 ${styles.shell}`}>
      <div className={styles.inner}>
        <Link href="/mmo/rooms" className="font-mono text-xs text-muted-foreground hover:text-primary">
          ← Rooms Map
        </Link>
        <h1 className={`${styles.heroTitle} mt-4`}>{room.title}</h1>
        <MmoTextNav active="/mmo/rooms" />

        <TerminalPanel title={`room.${room.slug}`}>
          <div className={styles.metaRow}>
            <span className={styles.tag}>{formatMmoRoomType(room.roomType)}</span>
            <span className={`${styles.tag} ${styles.tagState}`}>{formatMmoRoomState(room.state)}</span>
            <span className={styles.tag}>{formatMmoAccessLevel(room.accessLevel)}</span>
            {room.primaryFactionSlug && (
              <span className={styles.tag}>{factionSlugToName(room.primaryFactionSlug)}</span>
            )}
            {secondary.map((f) => (
              <span key={f} className={styles.tag}>
                {factionSlugToName(f)}
              </span>
            ))}
          </div>

          <div className={styles.entryText}>{room.entryText}</div>
          <p className="text-sm text-muted-foreground">{room.description}</p>
        </TerminalPanel>

        <TerminalPanel title="room.actions" className="mt-6">
          <MmoRoomActionPanel roomSlug={room.slug} actions={room.actions} />
        </TerminalPanel>

        {room.deadDrops.length > 0 && (
          <TerminalPanel title="room.dead_drops" className="mt-6">
            <div className="space-y-3">
              {room.deadDrops.map((drop) => (
                <Link
                  key={drop.id}
                  href={`/mmo/dead-drops/${drop.slug}`}
                  className="block border-b border-border/30 py-2 last:border-0 hover:text-primary"
                >
                  <p className="font-mono text-sm uppercase">{drop.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {drop.dropType.replace(/_/g, " ")} · {drop.repeatability.replace(/_/g, " ")}
                    {drop.reviewRequired ? " · review required" : ""}
                  </p>
                </Link>
              ))}
            </div>
            <Link href="/mmo/dead-drops" className="mt-4 inline-block">
              <CommandButton size="sm" variant="outline">
                All Dead Drops
              </CommandButton>
            </Link>
          </TerminalPanel>
        )}

        {archiveLinks.length > 0 && (
          <TerminalPanel title="room.archive_links" className="mt-6">
            <div className="flex flex-wrap gap-2">
              {archiveLinks.map((l) => (
                <Link key={l.href} href={l.href}>
                  <CommandButton size="sm" variant="outline">
                    {l.label}
                  </CommandButton>
                </Link>
              ))}
            </div>
          </TerminalPanel>
        )}

        {roomSlug === "oracular-relay" && (
          <TerminalPanel title="room.cipher_relay" className="mt-6 border-violet-500/20">
            <p className="text-sm text-muted-foreground">
              Full cipher board available at the Oracular Relay terminal.
            </p>
            <Link href="/ciphers" className="mt-4 inline-block">
              <CommandButton size="sm">Open Ciphers</CommandButton>
            </Link>
          </TerminalPanel>
        )}

        {factionFloorLinks.length > 0 && (
          <TerminalPanel title="room.faction_floors" className="mt-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Faction floor detail pages are phase-2. Select a cell dossier to begin alignment work.
            </p>
            <div className={styles.grid}>
              {factionFloorLinks.map((f) => (
                <Link key={f.slug} href={`/mmo/factions/${f.slug}`} className={`${styles.card} ${styles.cardLink}`}>
                  <p className={styles.cardTitle}>{f.name}</p>
                  <span className="font-mono text-xs text-primary uppercase">View Dossier →</span>
                </Link>
              ))}
            </div>
            <Link href="/mmo/factions" className="mt-4 inline-block">
              <CommandButton size="sm" variant="outline">
                All Faction Dossiers
              </CommandButton>
            </Link>
          </TerminalPanel>
        )}

        {room.fieldLogs.length > 0 && (
          <TerminalPanel title="room.field_logs" className="mt-6">
            {room.fieldLogs.map((log) => (
              <div key={log.id} className={styles.fieldLogItem}>
                <p>{log.message}</p>
                <p className={styles.fieldLogMeta}>
                  {playerDisplayName(log.user.character, log.user)} ·{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            <Link href="/mmo/field-log" className="mt-4 inline-block">
              <CommandButton size="sm" variant="outline">
                Full Field Log
              </CommandButton>
            </Link>
          </TerminalPanel>
        )}

        {room.safetyNote && <p className={styles.safetyNote}>{room.safetyNote}</p>}
      </div>
    </div>
  );
}
