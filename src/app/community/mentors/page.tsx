import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mentors // Public Recognition",
  description: "Mentor status and public recognition — no private DM pressure.",
};

export default async function CommunityMentorsPage() {
  await requireAuth();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>MENTORS</h1>
      <p className={styles.heroSubtitle}>
        Public mentor recognition scaffold. Guides are preferred over private mentorship pressure.
      </p>
      <Link href="/community/guides" className="mb-6 inline-block font-mono text-xs text-primary hover:underline">
        Community Guides →
      </Link>
      <TerminalPanel title="mentor.relay.pending">
        <p className="font-mono text-sm text-muted-foreground">
          Mentor roster and recognition grants require admin review. See Community Guides for public
          guide templates. Report/block safety remains available on all public threads.
        </p>
      </TerminalPanel>
    </PageShell>
  );
}
