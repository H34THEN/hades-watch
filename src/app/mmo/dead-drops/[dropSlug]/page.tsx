import Link from "next/link";
import { notFound } from "next/navigation";
import { MmoDeadDropForm } from "@/components/mmo/MmoDeadDropForm";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/mmo/text-mmo.module.css";
import {
  factionSlugToName,
  formatDropType,
  formatRepeatability,
} from "@/lib/mmo/text-mmo-labels";
import { getMmoDeadDropBySlug } from "@/lib/queries/text-mmo";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ dropSlug: string }>;
}

function parseOptions(raw: unknown): Array<{ id: string; label: string }> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const data = raw as { options?: unknown };
  if (!Array.isArray(data.options)) return undefined;
  return data.options as Array<{ id: string; label: string }>;
}

export default async function MmoDeadDropDetailPage({ params }: PageProps) {
  await requireAuth();
  const user = await getSessionUser();
  const { dropSlug } = await params;
  const data = await getMmoDeadDropBySlug(dropSlug, user?.id);
  if (!data) notFound();

  const { drop, userSubmission } = data;
  const completed = userSubmission
    ? ["AUTO_COMPLETED", "APPROVED"].includes(userSubmission.status)
    : false;
  const pending = userSubmission?.status === "PENDING";
  const showLore = completed || drop.submissionType === "no_submission_read_only";
  const options = parseOptions(drop.optionsJson);

  return (
    <div className={`mx-auto max-w-4xl px-4 py-16 ${styles.shell}`}>
      <div className={styles.inner}>
        <Link href="/mmo/dead-drops" className="font-mono text-xs text-muted-foreground hover:text-primary">
          ← Dead Drops
        </Link>
        <h1 className={`${styles.heroTitle} mt-4`}>{drop.title}</h1>
        <MmoTextNav active="/mmo/dead-drops" />

        <TerminalPanel title={`drop.${drop.slug}`}>
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

          <div className={styles.entryText}>{drop.playerPrompt}</div>

          {(drop.rewardBadgeSlug || drop.rewardLootSlug || drop.loreUnlockSlug) && (
            <div className="mb-4 font-mono text-[10px] text-muted-foreground">
              Rewards:{" "}
              {[
                drop.rewardReputationPoints > 0 && `+${drop.rewardReputationPoints} rep`,
                drop.rewardBadgeSlug && `badge ${drop.rewardBadgeSlug}`,
                drop.rewardLootSlug && `loot ${drop.rewardLootSlug}`,
                drop.loreUnlockSlug && `lore ${drop.loreUnlockSlug}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </div>
          )}

          {showLore && drop.loreNote && (
            <p className="mb-4 text-sm text-primary/90">{drop.loreNote}</p>
          )}

          {drop.safetyNote && <p className={styles.safetyNote}>{drop.safetyNote}</p>}

          <MmoDeadDropForm
            dropSlug={drop.slug}
            submissionType={drop.submissionType}
            options={options}
            isApproved={!!user && isApprovedUser(user)}
            completed={completed}
            pending={pending}
          />

          {userSubmission && userSubmission.status === "NEEDS_REVISION" && (
            <p className="mt-4 font-mono text-xs text-amber-500">
              Revision requested. Resubmit when ready.
            </p>
          )}
          {userSubmission && userSubmission.status === "REJECTED" && (
            <p className="mt-4 font-mono text-xs text-destructive">
              Submission rejected. {drop.failureText}
            </p>
          )}
        </TerminalPanel>

        {drop.roomSlug && (
          <Link href={`/mmo/rooms/${drop.roomSlug}`} className="mt-4 inline-block font-mono text-xs text-primary">
            Return to room →
          </Link>
        )}
      </div>
    </div>
  );
}
