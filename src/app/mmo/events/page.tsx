import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getSeasonalEvents } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Seasonal Underwatch Events",
  description: "Low-pressure seasonal activities without FOMO or pay-to-win.",
};

export default async function MmoEventsPage() {
  await requireAuth();
  const events = await getSeasonalEvents();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>SEASONAL UNDERWATCH EVENTS</h1>
      <p className={styles.heroSubtitle}>
        Event lights bloom without demanding your hours. No guilt-based participation.
      </p>
      <div className={styles.grid}>
        {events.map((e) => (
          <Link key={e.id} href={`/mmo/events/${e.slug}`} className={styles.cardLink}>
            <TerminalPanel title={`event.${e.slug}`}>
              <h2 className={styles.cardTitle}>{e.title}</h2>
              {e.seasonTiming && (
                <span className={`${styles.tag} mt-2 inline-block`}>{e.seasonTiming}</span>
              )}
              <p className="mt-3 text-sm text-muted-foreground">{e.eventRewards}</p>
              {e.safetyNotes && <p className={styles.safetyInline}>{e.safetyNotes}</p>}
            </TerminalPanel>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
