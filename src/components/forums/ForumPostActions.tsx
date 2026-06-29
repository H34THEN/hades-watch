"use client";

import { useRouter } from "next/navigation";
import styles from "./forums.module.css";

interface ForumPostActionsProps {
  commentId: string;
  threadSlug: string;
  onQuote?: (commentId: string, excerpt: string, authorCallsign: string) => void;
}

export function ForumPostActions({ commentId, threadSlug, onQuote }: ForumPostActionsProps) {
  const router = useRouter();

  function copyLink() {
    const url = `${window.location.origin}/community/threads/${threadSlug}#comment-${commentId}`;
    void navigator.clipboard.writeText(url);
  }

  return (
    <div className={styles.postActions}>
      {onQuote && (
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => onQuote(commentId, "", "")}
          data-quote-id={commentId}
        >
          Echo Quote
        </button>
      )}
      <button type="button" className={styles.actionButton} onClick={copyLink}>
        Copy Link
      </button>
      <button
        type="button"
        className={styles.actionButton}
        onClick={() => router.refresh()}
      >
        Refresh
      </button>
    </div>
  );
}
