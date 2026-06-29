import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { getSessionUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Profile World Challenges",
  description: "Profile customization objectives for readable, accessible operative displays.",
};

export default async function ProfileWorldChallengesPage() {
  await requireAuth();
  const user = await getSessionUser();
  const challenges = await getPromptsByFunction("profile-world-challenges", { userId: user?.id });

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>PROFILE WORLD CHALLENGES</h1>
      <p className={styles.heroSubtitle}>
        Customize your Profile World with readable contrast, relic displays, and safe old-web design.
      </p>
      <Link href="/profile/world" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        Open Profile World Editor →
      </Link>
      <div className={styles.grid}>
        {challenges.map((c) => (
          <PlayPromptCard key={c.id} prompt={c} />
        ))}
      </div>
      <p className={styles.relayPending}>
        Showcase submission relay pending. Edit your profile world, then return when showcase flow
        is wired.
      </p>
    </PageShell>
  );
}
