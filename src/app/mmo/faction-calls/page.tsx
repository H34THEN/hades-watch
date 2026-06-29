import { PageShell } from "@/components/layout/PageShell";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Weekly Faction Calls // Cell Signals",
  description:
    "Faction-specific prompts for safe contribution, accessibility, lore, repair, puzzles, and community care.",
};

export default async function FactionCallsPage() {
  await requireAuth();
  const user = await getSessionUser();
  const calls = await getPromptsByFunction("weekly-faction-calls", { userId: user?.id });

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>WEEKLY FACTION CALLS // CELL SIGNALS</h1>
      <p className={styles.heroSubtitle}>
        Faction-specific prompts for safe contribution, accessibility, lore, repair, puzzles, and
        community care.
      </p>
      <MmoTextNav active="/mmo/play" />

      {(!user || !isApprovedUser(user)) && (
        <TerminalPanel title="clearance.pending" className="mb-6" status="warning">
          <p className="font-mono text-sm text-muted-foreground">
            Faction call submissions require operative approval.
          </p>
        </TerminalPanel>
      )}

      <div className={styles.grid}>
        {calls.map((call) => (
          <PlayPromptCard key={call.id} prompt={call} showForm />
        ))}
      </div>

      <p className={styles.safetyNote}>
        Chthonic Uprising calls require Owner/Admin publishing or recognition. Faction leaders may
        draft calls but cannot bypass admin safety review.
      </p>
    </PageShell>
  );
}
