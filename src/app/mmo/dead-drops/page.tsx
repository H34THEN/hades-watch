import Link from "next/link";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/text-mmo.module.css";
import {
  factionSlugToName,
  formatDropType,
  formatRepeatability,
} from "@/lib/mmo/text-mmo-labels";
import { getMmoDeadDrops } from "@/lib/queries/text-mmo";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dead Drops // Micro-Quest Cache",
  description:
    "Small prompts, recovered fragments, safe resource calls, mini-ciphers, and underworld tasks left for approved operatives.",
};

function dropCta(completed: boolean, pending: boolean, submissionType: string): string {
  if (pending) return "Review Pending";
  if (completed) return "Completed";
  if (submissionType === "no_submission_read_only") return "Read Fragment";
  if (submissionType === "cipher_answer") return "Solve Signal";
  if (submissionType === "multiple_choice") return "Open Drop";
  return "Submit Response";
}

export default async function MmoDeadDropsPage() {
  await requireAuth();
  const user = await getSessionUser();
  const drops = await getMmoDeadDrops({ userId: user?.id });

  return (
    <div className={`mx-auto max-w-4xl px-4 py-16 ${styles.shell}`}>
      <div className={styles.inner}>
        <h1 className={styles.heroTitle}>Dead Drops // Micro-Quest Cache</h1>
        <p className={styles.heroSubtitle}>
          Small prompts, recovered fragments, safe resource calls, mini-ciphers, and underworld
          tasks left for approved operatives.
        </p>
        <MmoTextNav active="/mmo/dead-drops" />

        {(!user || !isApprovedUser(user)) && (
          <TerminalPanel title="clearance.pending" className="mb-6" status="warning">
            <p className="font-mono text-sm text-muted-foreground">
              Dead Drop submissions open after operative approval. Read-only fragments remain
              available.
            </p>
          </TerminalPanel>
        )}

        <div className="space-y-4">
          {drops.map((drop) => (
            <Link key={drop.id} href={`/mmo/dead-drops/${drop.slug}`}>
              <TerminalPanel title={`drop.${drop.slug}`}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{drop.title}</h2>
                  <span className={`${styles.tag} ${drop.userCompleted ? styles.tagState : ""}`}>
                    {dropCta(drop.userCompleted, drop.userPending, drop.submissionType)}
                  </span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.tag}>{drop.loopSlug.replace(/-/g, " ")}</span>
                  <span className={styles.tag}>{formatDropType(drop.dropType)}</span>
                  <span className={styles.tag}>{formatRepeatability(drop.repeatability)}</span>
                  <span className={styles.tag}>{drop.difficulty}</span>
                  {drop.factionSlug && (
                    <span className={styles.tag}>{factionSlugToName(drop.factionSlug)}</span>
                  )}
                  {drop.reviewRequired && <span className={styles.tag}>Review required</span>}
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{drop.playerPrompt}</p>
                <div className="mt-3 font-mono text-[10px] text-muted-foreground">
                  {drop.rewardReputationPoints > 0 && (
                    <span>Rep +{drop.rewardReputationPoints} · </span>
                  )}
                  {drop.rewardBadgeSlug && <span>Badge: {drop.rewardBadgeSlug} · </span>}
                  {drop.rewardLootSlug && <span>Loot: {drop.rewardLootSlug}</span>}
                </div>
              </TerminalPanel>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
