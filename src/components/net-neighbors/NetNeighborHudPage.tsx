import Link from "next/link";
import { NetNeighborBannerWall } from "@/components/net-neighbors/NetNeighborBannerWall";
import { NetNeighborSubmitForm } from "@/components/net-neighbors/NetNeighborSubmitForm";
import { CommandButton } from "@/components/terminal/CommandButton";
import type { NetNeighborPublicCard } from "@/lib/queries/net-neighbors";
import styles from "./net-neighbors.module.css";

interface PendingSubmission {
  id: string;
  title: string;
  url: string;
  status: string;
  createdAt: Date;
}

interface NetNeighborHudPageProps {
  neighbors: NetNeighborPublicCard[];
  recent: NetNeighborPublicCard[];
  pendingSubmissions: PendingSubmission[];
  canSubmit: boolean;
  lockedMessage?: string;
  isModerator: boolean;
  pendingCount: number;
}

export function NetNeighborHudPage({
  neighbors,
  recent,
  pendingSubmissions,
  canSubmit,
  lockedMessage,
  isModerator,
  pendingCount,
}: NetNeighborHudPageProps) {
  return (
    <div className={styles.hudPage}>
      <div className="relative w-full px-4 py-10 md:px-8 md:py-14" style={{ maxWidth: "var(--hw-width-dashboard)", marginInline: "auto" }}>
        <header className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] text-primary/80 uppercase">
                Underwatch Link Exchange
              </p>
              <h1 className={`${styles.hudTitle} mt-2 text-3xl md:text-4xl`}>
                Underwatch Net Neighbors
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Small doors in the wall. Strange signals. Kind exits.
              </p>
              <p className="mt-2 max-w-2xl font-mono text-[10px] leading-relaxed text-muted-foreground">
                Net Neighbors are the small doors in the Underwatch wall. Follow at your own risk.
                Bring back anything beautiful, useful, strange, or kind.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={styles.statusChip}>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {neighbors.length} approved
              </span>
              {canSubmit && (
                <Link href="/net-neighbors/submit">
                  <CommandButton size="sm">Submit Neighbor</CommandButton>
                </Link>
              )}
              {isModerator && (
                <Link href="/admin/net-neighbors">
                  <CommandButton size="sm" variant="outline">
                    Review{pendingCount > 0 ? ` (${pendingCount})` : ""}
                  </CommandButton>
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className={styles.hudGrid}>
          <section className={`${styles.hudFrame} p-6`}>
            <h2 className="mb-2 font-mono text-xs tracking-[0.2em] text-primary uppercase">
              Approved Signal Wall
            </h2>
            <p className="mb-4 font-mono text-[10px] text-muted-foreground">
              Outbound links leave Hades Watch · rel=noopener noreferrer
            </p>
            <NetNeighborBannerWall neighbors={neighbors} />
          </section>

          {recent.length > 0 && (
            <section className={`${styles.hudFrame} p-6`}>
              <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-primary uppercase">
                Recently Approved
              </h2>
              <NetNeighborBannerWall neighbors={recent} />
            </section>
          )}

          {pendingSubmissions.length > 0 && (
            <section className={`${styles.hudFrame} p-6`}>
              <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-amber-400/90 uppercase">
                Your Pending Signals
              </h2>
              <ul className="space-y-2 font-mono text-xs">
                {pendingSubmissions.map((s) => (
                  <li key={s.id} className="border border-border/40 px-3 py-2">
                    <span className="text-primary">{s.title}</span>
                    <span className="ml-2 text-muted-foreground">— awaiting review</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className={`${styles.hudFrame} p-6`}>
            <h2 className="mb-3 font-mono text-xs tracking-[0.2em] text-primary uppercase">
              Field Rules
            </h2>
            <ul className="space-y-2 font-mono text-[10px] text-muted-foreground">
              <li>· Only http/https outbound links. No scripts, no raw HTML banners.</li>
              <li>· Upload PNG, GIF, JPG, or WEBP — or forge a HUD signal button.</li>
              <li>· Submissions start as PENDING until moderator review.</li>
              <li>· Approved banners appear on this wall in admin-defined order.</li>
            </ul>
          </section>

          {!canSubmit && (
            <NetNeighborSubmitForm canSubmit={false} lockedMessage={lockedMessage} />
          )}
        </div>
      </div>
    </div>
  );
}
