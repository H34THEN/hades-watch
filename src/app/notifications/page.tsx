import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import { markNotificationsReadFormAction } from "@/lib/actions/forum-identity";
import { requireAuth, isApprovedUser } from "@/lib/auth/session";
import { getUserNotifications } from "@/lib/queries/forum-identity";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/forums/forums.module.css";
import { redirect } from "next/navigation";

export const metadata = { title: "Notifications // Signal Relay" };

export default async function NotificationsPage() {
  const user = await requireAuth();
  if (!isApprovedUser(user)) redirect("/pending-approval");

  const notifications = await getUserNotifications(user.id);

  return (
    <PageShell variant="standard" scanlines contentClassName="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl tracking-widest uppercase text-primary">
            NOTIFICATIONS // SIGNAL RELAY
          </h1>
          <p className="mt-2 text-muted-foreground">
            Quotes, replies, and mentions from the Underwatch thread boards.
          </p>
        </div>
        <form action={markNotificationsReadFormAction}>
          <input type="hidden" name="markAll" value="true" />
          <CommandButton type="submit" size="sm" variant="secondary">
            Mark all read
          </CommandButton>
        </form>
      </div>

      <TerminalPanel title="notifications.inbox">
        {notifications.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No signals in your relay inbox yet.</p>
        ) : (
          <ul className={styles.notificationList}>
            {notifications.map((n) => {
              const actorCallsign =
                n.actor?.character?.callsign ??
                n.actor?.name ??
                n.actor?.email?.split("@")[0] ??
                "System";
              return (
                <li
                  key={n.id}
                  className={`${styles.notificationItem} ${!n.readAt ? styles.notificationUnread : ""}`}
                >
                  <p className={styles.notificationTitle}>{n.title}</p>
                  {n.body && <p className={styles.notificationBody}>{n.body}</p>}
                  <p className={styles.notificationMeta}>
                    {actorCallsign !== "System" && `${actorCallsign} · `}
                    {n.createdAt.toLocaleString()}
                  </p>
                  {n.targetUrl && (
                    <Link href={n.targetUrl} className="mt-2 inline-block font-mono text-xs uppercase text-primary hover:underline">
                      Open thread
                    </Link>
                  )}
                  {!n.readAt && (
                    <form action={markNotificationsReadFormAction} className="mt-2">
                      <input type="hidden" name="notificationId" value={n.id} />
                      <button type="submit" className="font-mono text-[10px] uppercase text-muted-foreground hover:text-primary">
                        Mark read
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </TerminalPanel>
    </PageShell>
  );
}
