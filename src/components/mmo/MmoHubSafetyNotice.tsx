import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SAFETY_NOTICE } from "@/lib/mmo/hub-modules";
import styles from "@/components/mmo/mmo-hub.module.css";

export function MmoHubSafetyNotice() {
  return (
    <aside className={styles.safetyNotice} aria-labelledby="safety-notice-title">
      <h2 id="safety-notice-title" className={styles.safetyTitle}>
        Safety &amp; Nonviolence Policy
      </h2>
      <p className={styles.safetyBody}>{SAFETY_NOTICE}</p>
    </aside>
  );
}

export function MmoHubSupportFooter() {
  return (
    <footer className={styles.supportFooter}>
      <p className="mb-3 text-sm text-muted-foreground">
        The future supply relay for keeping the Underwatch alive.
      </p>
      <Link href="/support">
        <CommandButton size="sm" variant="outline">
          Support the Underwatch
        </CommandButton>
      </Link>
    </footer>
  );
}
