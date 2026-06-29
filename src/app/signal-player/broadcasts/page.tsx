import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Signal Player Broadcasts",
  description: "Themed broadcast moods and skins — metadata-only until media support is ready.",
};

export default async function SignalPlayerBroadcastsPage() {
  await requireAuth();
  const broadcasts = await getPromptsByFunction("signal-player-broadcasts");

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>SIGNAL PLAYER BROADCASTS</h1>
      <p className={styles.heroSubtitle}>
        Themed moods and skins. No autoplay — user-controlled playback only.
      </p>
      <Link href="/signal-player" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        ← Signal Player
      </Link>
      <div className={styles.grid}>
        {broadcasts.map((b) => (
          <PlayPromptCard key={b.id} prompt={b} />
        ))}
      </div>
      <p className={styles.safetyNote}>
        Metadata-only until Signal Player media support is ready. No pirated uploads or surprise sound.
      </p>
    </PageShell>
  );
}
