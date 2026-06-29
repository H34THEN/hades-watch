import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Micro-Missions // Player-Created Prompts",
  description: "Reviewed micro-mission templates and player submission relay.",
};

export default async function MicroMissionsPage() {
  await requireAuth();
  const templates = await getPromptsByFunction("player-created-micro-missions");

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>PLAYER-CREATED MICRO-MISSIONS</h1>
      <p className={styles.heroSubtitle}>
        Safe micro-mission templates. All player-created missions require review before going public.
      </p>
      <Link href="/community/builder?type=micro-mission" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        Community Builder (micro-mission) →
      </Link>
      <div className={styles.grid}>
        {templates.map((t) => (
          <PlayPromptCard key={t.id} prompt={t} />
        ))}
      </div>
      <TerminalPanel title="relay.pending" className="mt-6">
        <p className="font-mono text-sm text-muted-foreground">
          Player micro-mission creation and approval workflow relay pending. Templates show allowed
          types and review requirements.
        </p>
      </TerminalPanel>
    </PageShell>
  );
}
