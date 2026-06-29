import { PageShell } from "@/components/layout/PageShell";
import { ExpandedPlayFunctionCard } from "@/components/mmo/ExpandedPlayFunctionCard";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPlayFunctions } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Expanded Field Ops // Play Functions",
  description:
    "Small safe actions, faction calls, forum quests, archive hunts, public works, and creative challenges that keep the Underwatch alive.",
};

export default async function MmoPlayHubPage() {
  await requireAuth();
  const functions = await getPlayFunctions();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>EXPANDED FIELD OPS // PLAY FUNCTIONS</h1>
      <p className={styles.heroSubtitle}>
        Small safe actions, faction calls, forum quests, archive hunts, public works, and creative
        challenges that keep the Underwatch alive.
      </p>
      <MmoTextNav active="/mmo/play" />

      <div className={styles.grid}>
        {functions.map((fn) => (
          <ExpandedPlayFunctionCard key={fn.slug} fn={fn} />
        ))}
      </div>

      <p className={styles.safetyNote}>
        All expanded gameplay is fictional, legal, nonviolent, and privacy-aware. Rewards use
        Fictional Props &amp; Tech Gear — never weapons. Review-required submissions are not
        auto-published.
      </p>
    </PageShell>
  );
}
