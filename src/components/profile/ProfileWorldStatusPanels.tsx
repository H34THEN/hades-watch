import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import styles from "@/components/profile/profile-pages.module.css";

export function ProfileWorldLoadingPanel() {
  return (
    <div className={styles.worldLoadingPanel}>
      <TerminalPanel title="relic.sync">
        <p className={styles.worldLoadingLine}>{"> Loading Profile World relay"}</p>
        <p className={styles.worldLoadingLine}>{"> Decrypting public relic configuration"}</p>
        <p className={styles.worldLoadingLine}>{"> Stand by."}</p>
        <div className={styles.worldLoadingBar} aria-hidden />
      </TerminalPanel>
    </div>
  );
}

export function ProfileWorldErrorPanel({
  title = "Profile World Unavailable",
  message = "Unable to load your Profile World preview. Try again or return to the Relic Zone.",
  showRetry = true,
}: {
  title?: string;
  message?: string;
  showRetry?: boolean;
}) {
  return (
    <div className={styles.worldErrorPanel}>
      <SystemAlert title={title} message={message} variant="error" />
      <div className={styles.worldEmptyActions}>
        {showRetry ? (
          <Link href="/profile/world">
            <CommandButton size="sm">Retry</CommandButton>
          </Link>
        ) : null}
        <Link href="/profile/relic-zone">
          <CommandButton size="sm" variant="outline">
            Enter Relic Zone
          </CommandButton>
        </Link>
        <Link href="/profile/dossier">
          <CommandButton size="sm" variant="outline">
            View Dossier
          </CommandButton>
        </Link>
      </div>
    </div>
  );
}
