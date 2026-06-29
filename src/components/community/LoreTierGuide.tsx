import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { CANON_TIER_LABELS } from "@/lib/community/constants";
import type { CanonTier } from "@/generated/prisma/client";

const TIER_DESCRIPTIONS: Record<CanonTier, string> = {
  PRIVATE_DRAFT: "Personal notes only. Not indexed in public lore systems.",
  CHARACTER: "Canon for your operative dossier and profile world.",
  GUILD: "Shared story for an approved guild crew.",
  LOCAL_COMMUNITY: "Underwatch-local customs, places, and community signals.",
  FACTION_ECHO: "Faction-aligned lore that echoes official dossiers without overriding them.",
  WORLD: "Rare, archivist-reviewed world canon. Highest bar for approval.",
};

const tierOrder: CanonTier[] = [
  "PRIVATE_DRAFT",
  "CHARACTER",
  "GUILD",
  "LOCAL_COMMUNITY",
  "FACTION_ECHO",
  "WORLD",
];

export function LoreTierGuide() {
  return (
    <TerminalPanel title="lore.tiers">
      <p className="mb-4 font-mono text-xs text-muted-foreground">
        Choose the lowest tier that fits your lore. Archivists may approve a lower tier than
        requested.
      </p>
      <div className={styles.tierGuide}>
        {tierOrder.map((tier) => (
          <div key={tier} className={styles.tierItem}>
            <p className={styles.tierLabel}>{CANON_TIER_LABELS[tier]}</p>
            <p className={styles.tierDesc}>{TIER_DESCRIPTIONS[tier]}</p>
          </div>
        ))}
      </div>
    </TerminalPanel>
  );
}
