import Link from "next/link";
import { DashboardCard } from "@/components/cards/DashboardCard";
import styles from "@/components/community/community.module.css";

interface CommunityModule {
  title: string;
  description: string;
  href: string;
  statHint?: string;
}

const modules: CommunityModule[] = [
  {
    title: "Commons Builder",
    description:
      "Plant a signal. Suggest a thread, resource, mission, banner, accessibility note, or lore fragment for Underwatch review.",
    href: "/community/builder",
  },
  {
    title: "Forums",
    description:
      "Threaded old-web rooms for lore, mission debriefs, ciphers, tools, and community signals.",
    href: "/community/forums",
  },
  {
    title: "Volunteer Board",
    description:
      "Help build the underworld: docs, assets, accessibility, lore, tools, and strange useful systems.",
    href: "/community/volunteer",
  },
  {
    title: "Guilds",
    description:
      "Small crews under the Underwatch. Form a guild, set conduct, and coordinate lore or field work.",
    href: "/community/guilds",
  },
  {
    title: "Recognition",
    description:
      "Public marks granted for community care, lore craft, archive work, and Underwatch service.",
    href: "/community/recognition",
  },
  {
    title: "Lore Submissions",
    description:
      "File character, guild, or community lore at the appropriate canon tier for archivist review.",
    href: "/community/lore",
  },
];

interface CommunityModuleGridProps {
  stats?: {
    activeThreads?: number;
    openVolunteerOps?: number;
    approvedGuilds?: number;
    pendingSubmissions?: number;
  };
}

function statHintForModule(
  module: CommunityModule,
  stats?: CommunityModuleGridProps["stats"],
): string | undefined {
  if (!stats) return undefined;

  switch (module.href) {
    case "/community/forums":
      return stats.activeThreads != null
        ? `${stats.activeThreads} active thread${stats.activeThreads !== 1 ? "s" : ""}. ${module.description}`
        : undefined;
    case "/community/volunteer":
      return stats.openVolunteerOps != null
        ? `${stats.openVolunteerOps} open call${stats.openVolunteerOps !== 1 ? "s" : ""}. ${module.description}`
        : undefined;
    case "/community/guilds":
      return stats.approvedGuilds != null
        ? `${stats.approvedGuilds} approved guild${stats.approvedGuilds !== 1 ? "s" : ""}. ${module.description}`
        : undefined;
    case "/community/builder":
      return stats.pendingSubmissions != null
        ? `${stats.pendingSubmissions} signal${stats.pendingSubmissions !== 1 ? "s" : ""} awaiting review. ${module.description}`
        : undefined;
    default:
      return undefined;
  }
}

export function CommunityModuleGrid({ stats }: CommunityModuleGridProps) {
  return (
    <div className={styles.grid}>
      {modules.map((module) => (
        <Link key={module.href} href={module.href} className="block h-full">
          <DashboardCard
            title={module.title}
            description={statHintForModule(module, stats) ?? module.description}
            className="h-full transition-shadow hover:shadow-[0_0_16px_var(--hw-glow)]"
          />
        </Link>
      ))}
    </div>
  );
}
