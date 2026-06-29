import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/expanded-play.module.css";
import type { MmoPlayFunction } from "@/generated/prisma/client";

interface ExpandedPlayFunctionCardProps {
  fn: MmoPlayFunction & { rewardPreview?: string[] };
}

function resolvePrimaryRoute(route: string): string {
  if (route.includes("[guildSlug]")) return "/community/guilds";
  return route;
}

export function ExpandedPlayFunctionCard({ fn }: ExpandedPlayFunctionCardProps) {
  const href = resolvePrimaryRoute(fn.primaryRoute);
  return (
    <Link href={href} className={styles.cardLink}>
      <TerminalPanel title={`play.${fn.slug}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{fn.title}</h2>
          <span className={styles.tag}>{fn.mvpPriority}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.tag}>{fn.primaryPlayType}</span>
          <span className={styles.tag}>{fn.repeatability}</span>
          <span className={styles.tag}>{fn.reviewRequirement.slice(0, 40)}</span>
        </div>
        {fn.description && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{fn.description}</p>
        )}
        {fn.rewardPreview && fn.rewardPreview.length > 0 && (
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            Rewards: {fn.rewardPreview.join(" · ")}
          </p>
        )}
        {fn.safetyNotes && <p className={styles.safetyInline}>{fn.safetyNotes}</p>}
        <span className="mt-3 inline-block font-mono text-xs text-primary uppercase">
          Open Relay →
        </span>
      </TerminalPanel>
    </Link>
  );
}
