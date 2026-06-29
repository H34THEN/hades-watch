import { COMMUNITY_SAFETY_NOTICE } from "@/lib/community/constants";
import styles from "@/components/community/community.module.css";

export function CommunitySafetyNotice() {
  return (
    <aside className={styles.safetyNotice} aria-labelledby="community-safety-title">
      <h2 id="community-safety-title" className={styles.safetyTitle}>
        Signal Safety Notice
      </h2>
      <p className={styles.safetyBody}>{COMMUNITY_SAFETY_NOTICE}</p>
    </aside>
  );
}
