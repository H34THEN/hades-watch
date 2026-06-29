import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import { FIELD_CARE_LOOP_SLUG } from "@/lib/dead-drops/field-care-seed-data";
import { formatDropType, formatRepeatability } from "@/lib/mmo/text-mmo-labels";
import { getMmoDeadDrops } from "@/lib/queries/text-mmo";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";
import styles from "@/components/dead-drops/field-care-dead-drops.module.css";

function dropCta(completed: boolean, pending: boolean, submissionType: string): string {
  if (pending) return "Review Pending";
  if (completed) return "Completed";
  if (submissionType === "no_submission_read_only") return "Mark Ready";
  return "Open Drop";
}

function parseCategory(loreNote: string | null): string {
  if (!loreNote) return "readiness";
  const match = loreNote.match(/category:\s*([\w-]+)/);
  return match?.[1] ?? "readiness";
}

interface FieldCareDeadDropsLibraryProps {
  categoryFilter?: string;
}

export async function FieldCareDeadDropsLibrary({ categoryFilter }: FieldCareDeadDropsLibraryProps) {
  await requireAuth();
  const user = await getSessionUser();
  const drops = await getMmoDeadDrops({ loopSlug: FIELD_CARE_LOOP_SLUG, userId: user?.id });

  const filtered = categoryFilter
    ? drops.filter((d) => parseCategory(d.loreNote) === categoryFilter)
    : drops;

  const featured = drops[0];

  return (
    <PageShell variant="dashboard" scanlines>
      <header className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.35em] text-primary/80 uppercase">
          Field Care Cache
        </p>
        <h1 className="mt-2 font-mono text-3xl tracking-widest uppercase md:text-4xl">
          Dead Drops // Field Care Cache
        </h1>
        <p className="mt-3 hw-readable-wide text-sm text-muted-foreground">
          Small safe tasks, lore fragments, readiness checks, and community-care prompts for
          Underwatch operatives.
        </p>
      </header>

      <TerminalPanel title="deaddrop.safety" className={`mb-6 ${styles.safetyPanel}`}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Dead Drops reward lawful preparedness, community care, accessibility, privacy literacy,
          archive work, and safe lore. Do not submit private data, harassment, targeting, evasion
          advice, unsafe tactics, or anything meant to harm people.
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-wider text-emerald-400/90 uppercase">
          ICE WATCH / COMMUNITY CARE · Fictional Props &amp; Tech Gear
        </p>
      </TerminalPanel>

      {(!user || !isApprovedUser(user)) && (
        <TerminalPanel title="clearance.pending" className="mb-6" status="warning">
          <p className="font-mono text-sm text-muted-foreground">
            Submissions open after operative approval. Read-only readiness drops remain available.
          </p>
        </TerminalPanel>
      )}

      {featured && !categoryFilter && (
        <TerminalPanel title="deaddrop.featured" className="mb-8 border-primary/25">
          <p className="font-mono text-[10px] tracking-wider text-primary uppercase">Today&apos;s drop</p>
          <h2 className="mt-2 font-mono text-lg uppercase text-primary">{featured.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{featured.playerPrompt}</p>
          <Link href={`/dead-drops/${featured.slug}`} className="mt-4 inline-block">
            <CommandButton size="sm">Open Featured Drop</CommandButton>
          </Link>
        </TerminalPanel>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/dead-drops">
          <CommandButton size="sm" variant={!categoryFilter ? "default" : "outline"}>
            All
          </CommandButton>
        </Link>
        {["ice-watch", "community-care", "readiness", "accessibility", "first-aid"].map((cat) => (
          <Link key={cat} href={`/dead-drops?category=${cat}`}>
            <CommandButton size="sm" variant={categoryFilter === cat ? "default" : "outline"}>
              {cat.replace(/-/g, " ")}
            </CommandButton>
          </Link>
        ))}
        <Link href="/mmo/dead-drops">
          <CommandButton size="sm" variant="outline">
            MMO Micro-Quest Cache
          </CommandButton>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <TerminalPanel title="deaddrop.empty">
          <p className="font-mono text-sm text-muted-foreground">
            No field care drops indexed yet. Run{" "}
            <code className="text-primary">npm run db:seed:dead-drops:real-world</code> on the server.
          </p>
        </TerminalPanel>
      ) : (
        <div className="hw-library-grid">
          {filtered.map((drop) => (
            <Link key={drop.id} href={`/dead-drops/${drop.slug}`} className="min-w-0">
              <article className={styles.dropCard}>
                <p className={styles.dropEyebrow}>{parseCategory(drop.loreNote).replace(/-/g, " ")}</p>
                <h3 className={styles.dropTitle}>{drop.title}</h3>
                <div className={styles.chipRow}>
                  <span className={styles.chip}>{formatDropType(drop.dropType)}</span>
                  <span className={styles.chip}>{drop.difficulty}</span>
                  <span className={styles.chip}>{formatRepeatability(drop.repeatability)}</span>
                  {drop.reviewRequired && <span className={styles.chipReview}>Review</span>}
                </div>
                <p className={styles.dropPrompt}>{drop.playerPrompt}</p>
                <p className={styles.dropMeta}>
                  {dropCta(drop.userCompleted, drop.userPending, drop.submissionType)}
                  {drop.rewardReputationPoints > 0 && ` · +${drop.rewardReputationPoints} rep`}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
