"use client";

import { useSignalPlayer } from "@/components/media/SignalPlayerProvider";
import { CommandButton } from "@/components/terminal/CommandButton";
import { statusLabel } from "@/lib/mmo/hub-labels";
import styles from "@/components/mmo/mmo-hub.module.css";
import { cn } from "@/lib/utils";

export function MmoHubSignalPlayerCard() {
  const { currentTrack, isPlaying, empty, setOpen } = useSignalPlayer();

  const statusText = empty
    ? "No signal loaded."
    : currentTrack
      ? isPlaying
        ? `Now playing: ${currentTrack.title}`
        : `Loaded: ${currentTrack.title}`
      : "No signal loaded.";

  return (
    <article className={cn(styles.card)}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.eyebrow}>Signals</p>
          <h3 className={styles.cardTitle}>Signal Player</h3>
        </div>
        <span className={cn(styles.statusChip, styles.statusLive)}>
          {statusLabel("live")}
        </span>
      </div>
      <div className={styles.cardBody}>
        <p>Tune the underworld frequency.</p>
        <p className="mt-2 font-mono text-xs">{statusText}</p>
        <div className={styles.factionTags}>
          {["Styx Rats", "Chthonic Uprising"].map((f) => (
            <span key={f} className={styles.factionTag}>
              {f}
            </span>
          ))}
        </div>
        <p className={cn(styles.badgeHint, "mt-2")}>
          Badge hooks: signal-listener, underwatch-frequency
        </p>
      </div>
      <div className={styles.cardFooter}>
        <CommandButton
          size="sm"
          type="button"
          onClick={() => setOpen(true)}
        >
          Open Player
        </CommandButton>
      </div>
    </article>
  );
}
