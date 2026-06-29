import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

type GuildFounder = {
  character?: { callsign: string | null } | null;
  name: string | null;
  email: string;
};

interface GuildRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  purpose: string;
  factionAffinity?: string | null;
  publicMotto?: string | null;
  guildType?: string | null;
  isStarterGuild?: boolean;
  bannerGlyph?: string | null;
  visibility: string;
  founder: GuildFounder | null;
  _count?: { memberships: number };
}

interface GuildListProps {
  guilds: GuildRow[];
}

function founderCallsign(founder: GuildFounder | null, isStarter?: boolean): string {
  if (!founder) return isStarter ? "Underwatch Starter Cell" : "—";
  return (
    founder.character?.callsign ??
    founder.name ??
    founder.email.split("@")[0] ??
    "operative"
  );
}

export function GuildList({ guilds }: GuildListProps) {
  if (guilds.length === 0) {
    return (
      <TerminalPanel title="guilds.index">
        <p className="font-mono text-sm text-muted-foreground">
          No approved guilds yet. Found the first crew under the Underwatch.
        </p>
      </TerminalPanel>
    );
  }

  return (
    <div className={styles.grid}>
      {guilds.map((guild) => (
        <Link
          key={guild.id}
          href={`/community/guilds/${guild.slug}`}
          className="block h-full rounded-lg border border-border/60 bg-card/70 p-4 backdrop-blur-sm transition-shadow hover:shadow-[0_0_16px_var(--hw-glow)]"
        >
          <div className="flex items-start gap-3">
            {guild.bannerGlyph && (
              <span className="font-mono text-xl text-primary" aria-hidden>
                {guild.bannerGlyph}
              </span>
            )}
            <div>
              <h3 className="font-mono text-sm tracking-wider text-primary uppercase">
                {guild.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {guild.description}
              </p>
              {guild.publicMotto && (
                <p className="mt-1 font-mono text-[10px] text-primary/80">{guild.publicMotto}</p>
              )}
              <p className={cn(styles.metaRow, "mt-3")}>
                {guild.isStarterGuild ? (
                  <span>Starter guild</span>
                ) : (
                  <span>Founder {founderCallsign(guild.founder, guild.isStarterGuild)}</span>
                )}
                {guild._count && (
                  <span>
                    {guild._count.memberships} member
                    {guild._count.memberships !== 1 ? "s" : ""}
                  </span>
                )}
                {guild.factionAffinity && <span>{guild.factionAffinity}</span>}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
