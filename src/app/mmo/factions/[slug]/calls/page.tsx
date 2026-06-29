import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { MmoTextNav } from "@/components/mmo/MmoTextNav";
import { PlayPromptCard } from "@/components/mmo/PlayPromptCard";
import styles from "@/components/mmo/expanded-play.module.css";
import { factionSlugToName } from "@/lib/mmo/text-mmo-labels";
import { getPromptsByFunction } from "@/lib/queries/expanded-play";
import { getSessionUser, requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `${factionSlugToName(slug)} Calls // Weekly Faction Signals`,
  };
}

export default async function FactionFloorCallsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAuth();
  const user = await getSessionUser();
  const { slug } = await params;
  const calls = await getPromptsByFunction("weekly-faction-calls", {
    userId: user?.id,
    factionSlug: slug,
  });

  if (calls.length === 0) notFound();

  return (
    <PageShell variant="dashboard" scanlines className={styles.shell} contentClassName={styles.inner}>
      <h1 className={styles.heroTitle}>
        {factionSlugToName(slug).toUpperCase()} {"//"} WEEKLY CALLS
      </h1>
      <p className={styles.heroSubtitle}>
        Faction floor weekly calls for {factionSlugToName(slug)}.
      </p>
      <MmoTextNav active="/mmo/faction-calls" />
      <Link href="/mmo/faction-calls" className="mb-4 inline-block font-mono text-xs text-primary hover:underline">
        ← All faction calls
      </Link>

      <div className={styles.grid}>
        {calls.map((call) => (
          <PlayPromptCard key={call.id} prompt={call} showForm />
        ))}
      </div>
    </PageShell>
  );
}
