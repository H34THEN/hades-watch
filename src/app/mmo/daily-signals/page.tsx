import { PageShell } from "@/components/layout/PageShell";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import {
  getPromptsByFunction,
  getTodayHighlightedDailySignal,
} from "@/lib/queries/expanded-play";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Daily Signals // No-Guilt Check-Ins",
  description:
    "Tiny Underwatch prompts for days when you can do a little, read a little, rest a little, or leave one safe trace.",
};

export default async function DailySignalsPage() {
  await requireAuth();
  const user = await getSessionUser();
  const [highlighted, signals] = await Promise.all([
    getTodayHighlightedDailySignal(user?.id),
    getPromptsByFunction("daily-signals", { userId: user?.id }),
  ]);

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>DAILY SIGNALS // NO-GUILT CHECK-INS</h1>
      <p className={styles.heroSubtitle}>
        Tiny Underwatch prompts for days when you can do a little, read a little, rest a little, or
        leave one safe trace.
      </p>
      <MmoTextNav active="/mmo/play" />

      {(!user || !isApprovedUser(user)) && (
        <TerminalPanel title="clearance.pending" className="mb-6" status="warning">
          <p className="font-mono text-sm text-muted-foreground">
            Some submissions open after operative approval. Read-only signals remain available.
          </p>
        </TerminalPanel>
      )}

      {highlighted && (
        <section className="mb-8">
          <h2 className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Today&apos;s Highlighted Signal
          </h2>
          <PlayPromptCard prompt={highlighted} showForm highlight />
        </section>
      )}

      <div className={styles.grid}>
        {signals.map((signal) => (
          <PlayPromptCard key={signal.id} prompt={signal} showForm />
        ))}
      </div>

      <p className={styles.safetyNote}>
        Rest Signal never penalizes you and does not farm reputation. If streaks are not tracked,
        rest still counts.
      </p>
    </PageShell>
  );
}
