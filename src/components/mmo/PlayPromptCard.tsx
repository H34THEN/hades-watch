import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { PlayPromptCompleteForm } from "@/components/mmo/PlayPromptCompleteForm";
import styles from "@/components/mmo/expanded-play.module.css";
import type { PromptWithStatus } from "@/lib/queries/expanded-play";

interface PlayPromptCardProps {
  prompt: PromptWithStatus;
  href?: string;
  showForm?: boolean;
  highlight?: boolean;
}

export function PlayPromptCard({ prompt, href, showForm = false, highlight = false }: PlayPromptCardProps) {
  const content = (
    <TerminalPanel title={`prompt.${prompt.slug}`} className={highlight ? styles.highlight : undefined}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{prompt.title}</h2>
        {prompt.userCompleted && <span className={`${styles.tag} ${styles.tagState}`}>Completed</span>}
        {prompt.userPending && <span className={styles.tag}>Review Pending</span>}
        {prompt.reviewRequired && !prompt.userCompleted && (
          <span className={styles.tag}>Review required</span>
        )}
      </div>
      <div className={styles.metaRow}>
        {prompt.factionSlug && <span className={styles.tag}>{prompt.factionSlug}</span>}
        {prompt.category && <span className={styles.tag}>{prompt.category}</span>}
        {prompt.repeatability && <span className={styles.tag}>{prompt.repeatability}</span>}
        {prompt.proofStyle && <span className={styles.tag}>{prompt.proofStyle}</span>}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{prompt.prompt}</p>
      {prompt.rewardSummary && (
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">Reward: {prompt.rewardSummary}</p>
      )}
      {(prompt.badgeHook || prompt.avatarUnlockHook) && (
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          {prompt.badgeHook && `Badge: ${prompt.badgeHook}`}
          {prompt.badgeHook && prompt.avatarUnlockHook && " · "}
          {prompt.avatarUnlockHook && `Unlock: ${prompt.avatarUnlockHook}`}
        </p>
      )}
      {prompt.safetyNote && <p className={styles.safetyInline}>{prompt.safetyNote}</p>}
      {prompt.connectedRoute && (
        <Link href={prompt.connectedRoute} className="mt-2 inline-block font-mono text-xs text-primary hover:underline">
          Go to route →
        </Link>
      )}
      {showForm && <PlayPromptCompleteForm prompt={prompt} showBody={!["REST_SIGNAL", "READ_SIGNAL"].includes(prompt.actionType)} />}
    </TerminalPanel>
  );

  if (href && !showForm) {
    return (
      <Link href={href} className={styles.cardLink}>
        {content}
      </Link>
    );
  }
  return content;
}
