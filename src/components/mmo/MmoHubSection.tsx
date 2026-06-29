import { MmoHubModuleCard } from "@/components/mmo/MmoHubModuleCard";
import { MmoHubSignalPlayerCard } from "@/components/mmo/MmoHubSignalPlayerCard";
import type { MmoHubContext, ResolvedHubModule } from "@/lib/mmo/hub-types";
import styles from "@/components/mmo/mmo-hub.module.css";
import { cn } from "@/lib/utils";

interface MmoHubSectionProps {
  title: string;
  subtitle?: string;
  modules: ResolvedHubModule[];
  context: MmoHubContext;
  wide?: boolean;
}

function statHintForModule(
  module: ResolvedHubModule,
  context: MmoHubContext,
): string | undefined {
  switch (module.slug) {
    case "faction-dossiers":
      return `${context.factionCount} Chthonic cells indexed. ${module.description}`;
    case "mission-board":
      return context.isApproved
        ? `${context.availableMissionCount} field orders available. ${module.description}`
        : module.description;
    case "active-missions":
      return context.activeMissionCount > 0
        ? `${context.activeMissionCount} open field order${context.activeMissionCount !== 1 ? "s" : ""}.`
        : module.emptyState;
    case "ciphers":
      return context.isApproved
        ? context.cipherTotal > 0
          ? `${context.cipherSolved}/${context.cipherTotal} signals cracked.`
          : module.emptyState
        : module.description;
    case "badge-case":
      return context.badgeCount > 0
        ? `${context.badgeCount} mark${context.badgeCount !== 1 ? "s" : ""} earned.`
        : module.emptyState;
    case "avatar-builder":
      return context.hasAvatar
        ? "Avatar saved in the mirror chamber."
        : module.emptyState;
    case "events-transmissions":
      return context.upcomingEventCount > 0
        ? `${context.upcomingEventCount} upcoming transmission${context.upcomingEventCount !== 1 ? "s" : ""}.`
        : module.emptyState;
    default:
      return undefined;
  }
}

export function MmoHubSection({
  title,
  subtitle,
  modules,
  context,
  wide,
}: MmoHubSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={`hub-section-${title}`}>
      <div className={styles.sectionHeader}>
        <h2 id={`hub-section-${title}`} className={styles.sectionTitle}>
          {title}
        </h2>
        {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      </div>
      <div className={cn(styles.grid, wide && styles.gridWide)}>
        {modules.map((mod) =>
          mod.slug === "signal-player" ? (
            <MmoHubSignalPlayerCard key={mod.slug} />
          ) : (
            <MmoHubModuleCard
              key={mod.slug}
              module={mod}
              statHint={statHintForModule(mod, context)}
            />
          ),
        )}
      </div>
    </section>
  );
}
