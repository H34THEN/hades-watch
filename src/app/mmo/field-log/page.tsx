import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/text-mmo.module.css";
import { playerDisplayName } from "@/lib/mmo/text-mmo-validation";
import { getRecentPublicFieldLogs } from "@/lib/queries/text-mmo";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Field Log // Underwatch Activity",
  description:
    "Safe traces of room actions, Dead Drops, cipher cracks, archive work, and community signals.",
};

export default async function MmoFieldLogPage() {
  const user = await requireAuth();
  const logs = await getRecentPublicFieldLogs(50);

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
        <h1 className={styles.heroTitle}>Field Log // Underwatch Activity</h1>
        <p className={styles.heroSubtitle}>
          Safe traces of room actions, Dead Drops, cipher cracks, archive work, and community
          signals.
        </p>
        <MmoTextNav active="/mmo/field-log" />

        <TerminalPanel title="field_log.stream">
          {logs.length === 0 ? (
            <p className="font-mono text-sm text-muted-foreground">
              No field signals yet. Enter a room or complete a Dead Drop to leave the first trace.
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className={styles.fieldLogItem}>
                <p>{log.message}</p>
                <p className={styles.fieldLogMeta}>
                  {playerDisplayName(log.user.character, log.user)}
                  {log.room && (
                    <>
                      {" "}
                      ·{" "}
                      <Link href={`/mmo/rooms/${log.room.slug}`} className="hover:text-primary">
                        {log.room.title}
                      </Link>
                    </>
                  )}
                  {log.actionType && <> · {log.actionType.replace(/_/g, " ")}</>}
                  {" · "}
                  {log.visibility.replace(/_/g, " ")}
                  {" · "}
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </TerminalPanel>

        <p className="mt-4 font-mono text-[10px] text-muted-foreground">
          Logged in as {user.email}. Sensitive submission bodies are never published here.
        </p>
    </PageShell>
  );
}
