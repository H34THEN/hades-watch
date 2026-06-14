import Link from "next/link";
import { notFound } from "next/navigation";
import { MmoNav } from "@/components/mmo/MmoNav";
import { MissionParticipationPanel } from "@/components/mmo/MissionParticipationPanel";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getMissionParticipation, getQuestBySlug } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Mission" };

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAuth();
  const { slug } = await params;
  const quest = await getQuestBySlug(slug);
  if (!quest || quest.status !== "Available") notFound();

  const participation = await getMissionParticipation(user.id, quest.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <MmoNav active="/mmo/missions" />
      <TerminalPanel title={`mission.${quest.slug}`}>
        <h1 className="font-mono text-xl tracking-widest uppercase text-primary">{quest.title}</h1>
        {quest.faction && (
          <Link href={`/mmo/factions/${quest.faction.slug}`} className="mt-2 inline-block font-mono text-xs text-muted-foreground hover:text-primary">
            {quest.faction.name}
          </Link>
        )}
        <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
          {quest.description}
        </p>
        <MissionParticipationPanel questId={quest.id} participation={participation} />
      </TerminalPanel>
    </div>
  );
}
