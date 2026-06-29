import type { MmoHubContext } from "@/lib/mmo/hub-types";
import styles from "@/components/mmo/mmo-hub.module.css";

interface MmoHubStatusStripProps {
  context: MmoHubContext;
}

export function MmoHubStatusStrip({ context }: MmoHubStatusStripProps) {
  const clearance = context.isApproved ? "Approved Operative" : "Pending Clearance";
  const faction = context.character?.factionName ?? "Unaffiliated";

  const stats = [
    { label: "Clearance", value: clearance },
    { label: "Faction Signal", value: faction },
    { label: "Marks", value: String(context.badgeCount) },
    { label: "Active Orders", value: String(context.activeMissionCount) },
    { label: "Ciphers", value: `${context.cipherSolved}/${context.cipherTotal}` },
    { label: "Events", value: String(context.upcomingEventCount) },
  ];

  return (
    <div className={styles.statusStrip} role="region" aria-label="Operative status">
      {stats.map((stat) => (
        <div key={stat.label} className={styles.statItem}>
          <span className={styles.statLabel}>{stat.label}</span>
          <span className={styles.statValue}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
