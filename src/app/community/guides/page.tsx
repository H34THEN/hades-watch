import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Community Guides // Public Lantern Posts",
  description: "Public guide posts and mentor templates — no private DM pressure.",
};

export default async function CommunityGuidesPage() {
  await requireAuth();
  const guides = await getPromptsByFunction("mentor-guide-system");

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>COMMUNITY GUIDES</h1>
      <p className={styles.heroSubtitle}>
        Public guide templates for newcomers. No off-platform pressure or private contact requirements.
      </p>
      <Link href="/community/forums" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        Forums →
      </Link>
      <div className={styles.grid}>
        {guides.map((g) => (
          <PlayPromptCard key={g.id} prompt={g} />
        ))}
      </div>
      <p className={styles.relayPending}>
        Guide authoring and mentor recognition relay pending. Prefer public forum guide threads.
      </p>
    </PageShell>
  );
}
