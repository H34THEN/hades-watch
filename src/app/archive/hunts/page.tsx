import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { getSessionUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Archive Hunts // Trace Paths",
  description:
    "Curated reading paths through lore, Ghost in Tech, State of Affairs, and Net Neighbor signals.",
};

export default async function ArchiveHuntsPage() {
  await requireAuth();
  const user = await getSessionUser();
  const hunts = await getPromptsByFunction("archive-hunts", { userId: user?.id });

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>ARCHIVE HUNTS // TRACE PATHS</h1>
      <p className={styles.heroSubtitle}>
        Curated reading paths through lore, Ghost in Tech, State of Affairs, and Net Neighbor signals.
      </p>
      <Link href="/archive" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        ← Archive
      </Link>

      <div className={styles.grid}>
        {hunts.map((hunt) => (
          <PlayPromptCard key={hunt.id} prompt={hunt} showForm />
        ))}
      </div>

      <p className={styles.safetyNote}>
        Curated internal links only: /archive, /archive/lore, /archive/state-of-affairs,
        /archive/ghost-in-tech, /net-neighbors. No live-target research or harmful OSINT.
      </p>
    </PageShell>
  );
}
