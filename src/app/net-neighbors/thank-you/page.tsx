import Link from "next/link";
import { NetNeighborThankYouRedirect } from "@/components/net-neighbors/NetNeighborThankYouRedirect";
import { CommandButton } from "@/components/terminal/CommandButton";
import styles from "@/components/net-neighbors/net-neighbors.module.css";

export const metadata = { title: "Signal Received" };

export default function NetNeighborsThankYouPage() {
  return (
    <div className={styles.hudPage}>
      <div className="relative mx-auto w-full max-w-2xl px-4 py-10 md:px-8 md:py-16">
        <div className={`${styles.hudFrame} p-8 md:p-10`}>
          <p className="font-mono text-[10px] tracking-[0.35em] text-primary/80 uppercase">
            Transmission Receipt
          </p>
          <h1 className={`${styles.hudTitle} mt-3 text-2xl md:text-3xl`}>Signal Received</h1>

          <div className="mt-6 space-y-3 font-mono text-xs">
            <p className="text-primary/90 uppercase tracking-wider">Underwatch Review Queue</p>
            <p>
              <span className="text-muted-foreground">Signal status:</span>{" "}
              <span className="text-amber-400">PENDING</span>
            </p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Your Net Neighbor submission is pending Underwatch review.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your neighboring signal has entered the review queue. If it clears Underwatch
            moderation, it will appear on the public banner wall.
          </p>

          <NetNeighborThankYouRedirect />

          <div className="mt-6 border-t border-border/40 pt-6">
            <Link href="/net-neighbors/submit">
              <CommandButton size="sm" variant="outline">
                Submit Another Signal
              </CommandButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
