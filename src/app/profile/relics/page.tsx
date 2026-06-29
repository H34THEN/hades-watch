import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getRelicSets } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Relic Collection // Fictional Props",
  description: "Cosmetic relic fragment collection — not combat crafting.",
};

export default async function ProfileRelicsPage() {
  await requireAuth();
  const sets = await getRelicSets();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>RELIC CRAFTING &amp; COLLECTION</h1>
      <p className={styles.heroSubtitle}>
        Fictional Props &amp; Tech Gear relic sets for Profile World display. No gambling, trading, or
        combat stats.
      </p>
      <Link href="/profile/relic-zone" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        Relic Zone →
      </Link>
      <div className={styles.grid}>
        {sets.map((set) => (
          <TerminalPanel key={set.id} title={`relic.${set.slug}`}>
            <h2 className={styles.cardTitle}>{set.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{set.profileDisplayEffect}</p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              Completed: {set.completedRelicName}
            </p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              Fragments: {(set.fragmentsNeeded as string[]).join(" · ")}
            </p>
            {set.safetyNote && <p className={styles.safetyInline}>{set.safetyNote}</p>}
          </TerminalPanel>
        ))}
      </div>
      <p className={styles.relayPending}>
        Fragment earning and assembly relay pending. Set definitions are seeded for preview.
      </p>
    </PageShell>
  );
}
