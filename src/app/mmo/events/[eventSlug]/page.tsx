import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getSeasonalEventBySlug } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function MmoEventDetailPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  await requireAuth();
  const { eventSlug } = await params;
  const event = await getSeasonalEventBySlug(eventSlug);
  if (!event) notFound();

  const rooms = event.eventRooms as string[];
  const prompts = event.eventPrompts as string[];
  const badges = event.badges as string[];
  const cosmetics = event.profileCosmetics as string[];
  const unlocks = event.avatarUnlocks as string[];

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <Link href="/mmo/events" className="mb-4 inline-block font-mono text-xs text-primary hover:underline">
        ← Seasonal Events
      </Link>
      <h1 className={styles.heroTitle}>{event.title}</h1>
      {event.seasonTiming && (
        <p className={styles.heroSubtitle}>{event.seasonTiming}</p>
      )}

      <TerminalPanel title={`event.${event.slug}`}>
        <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Event Rooms</h3>
        <p className="mt-2 text-sm">{rooms.join(" · ")}</p>
        <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">Prompts</h3>
        <p className="mt-2 text-sm">{prompts.join(" · ")}</p>
        <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">Rewards</h3>
        <p className="mt-2 text-sm">{event.eventRewards}</p>
        <div className={styles.metaRow}>
          {badges.map((b) => (
            <span key={b} className={styles.tag}>Badge: {b}</span>
          ))}
          {cosmetics.map((c) => (
            <span key={c} className={styles.tag}>{c}</span>
          ))}
          {unlocks.map((u) => (
            <span key={u} className={styles.tag}>Unlock: {u}</span>
          ))}
        </div>
        {event.guildHooks && (
          <>
            <h3 className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">Guild Hooks</h3>
            <p className="mt-2 text-sm">{event.guildHooks}</p>
          </>
        )}
        {event.safetyNotes && <p className={styles.safetyNote}>{event.safetyNotes}</p>}
      </TerminalPanel>
      <p className={styles.relayPending}>Seasonal participation tracking relay pending.</p>
    </PageShell>
  );
}
