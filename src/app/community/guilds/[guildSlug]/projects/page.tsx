import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import styles from "@/components/mmo/expanded-play.module.css";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { getSessionUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function GuildProjectsPage({
  params,
}: {
  params: Promise<{ guildSlug: string }>;
}) {
  await requireAuth();
  const user = await getSessionUser();
  const { guildSlug } = await params;
  const projects = await getPromptsByFunction("guild-projects", { userId: user?.id });

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <Link href={`/community/guilds/${guildSlug}`} className="mb-4 inline-block font-mono text-xs text-primary hover:underline">
        ← Guild
      </Link>
      <h1 className={styles.heroTitle}>GUILD PROJECTS // {guildSlug.toUpperCase()}</h1>
      <p className={styles.heroSubtitle}>
        Cooperative guild objectives — templates seeded; contribution relay pending full guild workflow.
      </p>
      <div className={styles.grid}>
        {projects.map((p) => (
          <PlayPromptCard key={p.id} prompt={p} />
        ))}
      </div>
      <p className={styles.relayPending}>
        Guild project submission and progress tracking relay pending. Templates are visible for
        planning safe cooperative work.
      </p>
    </PageShell>
  );
}
