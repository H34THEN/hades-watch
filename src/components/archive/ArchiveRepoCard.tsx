import Link from "next/link";
import type { ArchiveSignalSection } from "@/lib/archive/signal-sections";
import { getSignalItemPath } from "@/lib/archive/signal-sections";
import {
  forgeChipClass,
  forgeLabel,
  repoPath,
  resolveRepoSummary,
  submitterLabel,
  type ArchiveRepoCardItem,
} from "@/lib/archive/repo-card";
import styles from "@/components/archive/archive-repo-card.module.css";

interface ArchiveRepoCardProps {
  item: ArchiveRepoCardItem;
  section: ArchiveSignalSection;
  showModeration?: boolean;
}

export function ArchiveRepoCard({ item, section, showModeration = false }: ArchiveRepoCardProps) {
  const summary = resolveRepoSummary(item);
  const path = repoPath(item);
  const submitter = submitterLabel(item.submittedBy);
  const forgeClass = styles[forgeChipClass(item.forge)] ?? styles.forgeOther;

  return (
    <article className={styles.card} tabIndex={0}>
      <div className={styles.cardInner}>
        <p className={styles.cardHeader}>GHOST_IN_TECH.REPO</p>

        <div className={styles.chipRow}>
          <span className={`${styles.chip} ${forgeClass}`}>{forgeLabel(item.forge)}</span>
          {showModeration && item.status !== "PUBLISHED" ? (
            <span className={`${styles.chip} ${styles.statusChip}`}>{item.status}</span>
          ) : null}
        </div>

        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.repoPath}>{path}</p>

        <p className={styles.summary}>{summary}</p>

        {item.tags.length > 0 ? (
          <div className={styles.tags} aria-label="Tags">
            {item.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <p className={styles.meta}>
          Submitted by {submitter} · {item.createdAt.toLocaleDateString()} · {item.commentCount}{" "}
          comment{item.commentCount !== 1 ? "s" : ""}
        </p>

        <div className={styles.actions}>
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            className={styles.actionLink}
          >
            Open Relic
          </a>
          <Link
            href={getSignalItemPath(section.slug, item.slug)}
            className={`${styles.actionLink} ${styles.actionLinkOutline}`}
          >
            Discuss Tool
          </Link>
        </div>
      </div>
    </article>
  );
}

export type { ArchiveRepoCardItem };
