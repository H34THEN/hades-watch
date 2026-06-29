import { HUB_SUBTITLE, HUB_TITLE } from "@/lib/mmo/hub-modules";
import styles from "@/components/mmo/mmo-hub.module.css";

export function MmoHubHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{HUB_TITLE}</h1>
      <p className={styles.subtitle}>{HUB_SUBTITLE}</p>
    </header>
  );
}
