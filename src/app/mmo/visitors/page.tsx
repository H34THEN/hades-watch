import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getVisitors } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Traveling Visitors // Underwatch Guests",
  description: "Authored room visitors — not live AI chatbots.",
};

export default async function MmoVisitorsPage() {
  await requireAuth();
  const visitors = await getVisitors();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>TRAVELING VISITORS</h1>
      <p className={styles.heroSubtitle}>
        Authored event prompts from Underwatch visitors. No AI chatbot behavior in this pass.
      </p>
      <Link href="/mmo/rooms" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        ← Rooms
      </Link>
      <div className={styles.grid}>
        {visitors.map((v) => (
          <TerminalPanel key={v.id} title={`visitor.${v.slug}`}>
            <h2 className={styles.cardTitle}>{v.name}</h2>
            <p className="mt-2 text-sm italic text-muted-foreground">{v.appearanceText}</p>
            <div className={styles.metaRow}>
              <span className={styles.tag}>Room: {v.roomSlug}</span>
            </div>
            <p className="mt-3 text-sm">{v.prompt}</p>
            {v.rewardSummary && (
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">Reward: {v.rewardSummary}</p>
            )}
            {v.safetyNote && <p className={styles.safetyInline}>{v.safetyNote}</p>}
          </TerminalPanel>
        ))}
      </div>
      <p className={styles.relayPending}>Visitor interaction relay pending — prompts are seeded for preview.</p>
    </PageShell>
  );
}
