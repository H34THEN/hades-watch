import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import styles from "@/components/mmo/text-mmo.module.css";
import {
  factionSlugToName,
  formatMmoAccessLevel,
  formatMmoRoomState,
  formatMmoRoomType,
  roomCtaLabel,
} from "@/lib/mmo/text-mmo-labels";
import { getMmoRooms } from "@/lib/queries/text-mmo";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Rooms // Underwatch Map",
  description:
    "Enter the first playable rooms of the Underwatch. Read the signal, choose a safe action, leave a field log, and recover what the surface buried.",
};

export default async function MmoRoomsPage() {
  await requireAuth();
  const rooms = await getMmoRooms();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
        <h1 className={styles.heroTitle}>Rooms // Underwatch Map</h1>
        <p className={styles.heroSubtitle}>
          Enter the first playable rooms of the Underwatch. Read the signal, choose a safe action,
          leave a field log, and recover what the surface buried.
        </p>
        <MmoTextNav active="/mmo/rooms" />

        <div className={styles.grid}>
          {rooms.map((room) => {
            const locked = room.state === "locked";
            const cta = roomCtaLabel(room.slug, room.state);
            const secondary = Array.isArray(room.secondaryFactionSlugs)
              ? (room.secondaryFactionSlugs as string[])
              : [];

            return (
              <Link
                key={room.id}
                href={locked ? "#" : `/mmo/rooms/${room.slug}`}
                className={`${styles.card} ${!locked ? styles.cardLink : ""}`}
                aria-disabled={locked}
              >
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{room.title}</h2>
                  <span
                    className={`${styles.tag} ${room.state === "locked" ? styles.tagLocked : styles.tagState}`}
                  >
                    {formatMmoRoomState(room.state)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{room.description}</p>
                <div className={styles.metaRow}>
                  <span className={styles.tag}>{formatMmoRoomType(room.roomType)}</span>
                  <span className={styles.tag}>{formatMmoAccessLevel(room.accessLevel)}</span>
                  {room.primaryFactionSlug && (
                    <span className={styles.tag}>{factionSlugToName(room.primaryFactionSlug)}</span>
                  )}
                  {secondary.slice(0, 2).map((f) => (
                    <span key={f} className={styles.tag}>
                      {factionSlugToName(f)}
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-mono text-[10px] text-muted-foreground">
                  {room._count.actions} actions · {room._count.deadDrops} dead drops ·{" "}
                  {room.mvpPriority}
                </p>
                <div className="mt-4">
                  {locked ? (
                    <CommandButton size="sm" disabled>
                      {cta}
                    </CommandButton>
                  ) : (
                    <span className="font-mono text-xs tracking-wider text-primary uppercase">
                      {cta} →
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <TerminalPanel title="underwatch.loop" className="mt-8 border-primary/20">
          <p className="text-sm text-muted-foreground">
            Enter rooms. Follow signals. Complete Dead Drops. Leave safe Field Logs. Recover loot,
            badges, reputation, and lore.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/mmo/dead-drops">
              <CommandButton size="sm" variant="outline">
                Dead Drops
              </CommandButton>
            </Link>
            <Link href="/mmo/field-log">
              <CommandButton size="sm" variant="outline">
                Field Log
              </CommandButton>
            </Link>
          </div>
        </TerminalPanel>
    </PageShell>
  );
}
