import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/profile/profile-pages.module.css";

export function ProfileWorldEmptyState() {
  return (
    <div className={styles.worldEmptyState}>
      <TerminalPanel title="relic.unconfigured">
        <p className={styles.worldEmptyEyebrow}>NO PUBLIC RELIC CONFIGURED</p>
        <p className={styles.worldEmptyBody}>
          Your Profile World is the public signal chamber visitors see when they enter your relic
          page. Publish a layout from the Relic Zone to bring this page online.
        </p>
        <div className={styles.worldEmptyActions}>
          <Link href="/profile/relic-zone">
            <CommandButton size="sm">Enter Relic Zone</CommandButton>
          </Link>
          <Link href="/profile/relic-zone">
            <CommandButton size="sm" variant="outline">
              Open Profile World Editor
            </CommandButton>
          </Link>
          <Link href="/profile/relic-zone">
            <CommandButton size="sm" variant="outline">
              Choose Starter Layout
            </CommandButton>
          </Link>
          <Link href="/profile/dossier">
            <CommandButton size="sm" variant="outline">
              View Dossier
            </CommandButton>
          </Link>
        </div>
      </TerminalPanel>
    </div>
  );
}
