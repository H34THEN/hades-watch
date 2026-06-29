import Link from "next/link";
import styles from "./forums.module.css";
import { resolveForumCallsign, type ForumCallsignAuthor } from "@/lib/forums/callsign";

interface ForumQuoteBlockProps {
  quotedAuthor?: (ForumCallsignAuthor & { id?: string }) | null;
  quoteExcerpt: string | null;
  quotedCommentId?: string | null;
  removed?: boolean;
}

export function ForumQuoteBlock({
  quotedAuthor,
  quoteExcerpt,
  quotedCommentId,
  removed = false,
}: ForumQuoteBlockProps) {
  if (!quotedCommentId && !quoteExcerpt) return null;

  if (removed || !quoteExcerpt) {
    return (
      <blockquote className={styles.quoteBlock}>
        <p className={styles.quoteLabel}>Quoted signal removed.</p>
      </blockquote>
    );
  }

  const callsign = quotedAuthor ? resolveForumCallsign(quotedAuthor) : "unknown operative";

  return (
    <blockquote className={styles.quoteBlock}>
      <p className={styles.quoteLabel}>
        SIGNAL ECHO FROM{" "}
        {quotedAuthor ? (
          <Link href={`/profile/${encodeURIComponent(callsign)}`} className={styles.quoteAuthor}>
            {callsign.toUpperCase()}
          </Link>
        ) : (
          callsign.toUpperCase()
        )}
      </p>
      {quotedCommentId && (
        <a href={`#comment-${quotedCommentId}`} className={styles.quoteJump}>
          Jump to quoted signal
        </a>
      )}
      <p className={styles.quoteExcerpt}>{quoteExcerpt}</p>
    </blockquote>
  );
}
