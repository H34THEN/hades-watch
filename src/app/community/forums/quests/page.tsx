import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { getSessionUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Forum Quests // Commons Objectives",
  description: "Forum participation objectives that welcome newcomers and reward constructive discussion.",
};

export default async function ForumQuestsPage() {
  await requireAuth();
  const user = await getSessionUser();
  const quests = await getPromptsByFunction("forum-quests", { userId: user?.id });

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>FORUM QUESTS // COMMONS OBJECTIVES</h1>
      <p className={styles.heroSubtitle}>
        Forum participation objectives without spam incentives. High-value rewards require review.
      </p>
      <Link href="/community/forums" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        ← Forums
      </Link>

      <div className={styles.grid}>
        {quests.map((quest) => (
          <PlayPromptCard key={quest.id} prompt={quest} />
        ))}
      </div>

      <p className={styles.relayPending}>
        Echo relay pending: quote-reply integration for &quot;Quote a Signal Constructively&quot; will
        connect when the forum quote system is fully wired.
      </p>
    </PageShell>
  );
}
