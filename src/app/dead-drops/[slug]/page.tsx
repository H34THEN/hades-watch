import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { MmoDeadDropForm } from "@/components/mmo/MmoDeadDropForm";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { FIELD_CARE_LOOP_SLUG } from "@/lib/dead-drops/field-care-seed-data";
import { formatDropType, formatRepeatability } from "@/lib/mmo/text-mmo-labels";
import { getMmoDeadDropBySlug } from "@/lib/queries/text-mmo";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";
import styles from "@/components/dead-drops/field-care-dead-drops.module.css";

export const dynamic = "force-dynamic";

function parseOptions(raw: unknown): Array<{ id: string; label: string }> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const data = raw as { options?: unknown };
  if (!Array.isArray(data.options)) return undefined;
  return data.options as Array<{ id: string; label: string }>;
}

export default async function FieldCareDeadDropDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAuth();
  const user = await getSessionUser();
  const { slug } = await params;
  const data = await getMmoDeadDropBySlug(slug, user?.id);
  if (!data || data.drop.loopSlug !== FIELD_CARE_LOOP_SLUG) notFound();

  const { drop, userSubmission } = data;
  const completed = userSubmission
    ? ["AUTO_COMPLETED", "APPROVED"].includes(userSubmission.status)
    : false;
  const pending = userSubmission?.status === "PENDING";
  const showLore = completed || drop.submissionType === "no_submission_read_only";
  const options = parseOptions(drop.optionsJson);

  return (
    <PageShell variant="dashboard" scanlines>
      <Link href="/dead-drops" className="font-mono text-xs text-muted-foreground hover:text-primary">
        ← Field Care Cache
      </Link>

      <header className="mt-4 mb-6">
        <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
          ICE WATCH / COMMUNITY CARE
        </p>
        <h1 className="mt-2 font-mono text-2xl tracking-widest uppercase md:text-3xl">{drop.title}</h1>
      </header>

      <TerminalPanel title={`drop.${drop.slug}`}>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className={styles.chip}>{formatDropType(drop.dropType)}</span>
          <span className={styles.chip}>{formatRepeatability(drop.repeatability)}</span>
          <span className={styles.chip}>{drop.difficulty}</span>
          {drop.reviewRequired && <span className={styles.chipReview}>Review required</span>}
        </div>

        <div className="mb-4 hw-readable-wide whitespace-pre-wrap text-sm leading-relaxed">
          {drop.playerPrompt}
        </div>

        {(drop.rewardBadgeSlug || drop.rewardLootSlug) && (
          <p className="mb-4 font-mono text-[10px] text-muted-foreground">
            Rewards:{" "}
            {[
              drop.rewardReputationPoints > 0 && `+${drop.rewardReputationPoints} rep`,
              drop.rewardBadgeSlug && `badge ${drop.rewardBadgeSlug}`,
              drop.rewardLootSlug && `loot ${drop.rewardLootSlug}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        {showLore && drop.loreNote && (
          <p className="mb-4 text-sm text-primary/90">{drop.loreNote}</p>
        )}

        {drop.safetyNote && (
          <p className={`mb-4 rounded border border-amber-500/25 bg-amber-500/5 p-3 text-xs text-amber-200/90`}>
            {drop.safetyNote}
          </p>
        )}

        <MmoDeadDropForm
          dropSlug={drop.slug}
          submissionType={drop.submissionType}
          options={options}
          isApproved={!!user && isApprovedUser(user)}
          completed={completed}
          pending={pending}
        />
      </TerminalPanel>
    </PageShell>
  );
}
