import styles from "@/components/archive/ghost-in-tech.module.css";

interface GhostInTechStatsProps {
  totalCount: number;
  githubCount: number;
  codebergCount: number;
  discussedCount: number;
}

export function GhostInTechStats({
  totalCount,
  githubCount,
  codebergCount,
  discussedCount,
}: GhostInTechStatsProps) {
  return (
    <div className={styles.statsRow} aria-label="Archive statistics">
      <span>
        <span className={styles.statValue}>{totalCount}</span> repo relic
        {totalCount !== 1 ? "s" : ""} indexed
      </span>
      <span>
        <span className={styles.statValue}>{githubCount}</span> GitHub
      </span>
      <span>
        <span className={styles.statValue}>{codebergCount}</span> Codeberg
      </span>
      <span>
        <span className={styles.statValue}>{discussedCount}</span> with discussion
      </span>
    </div>
  );
}
