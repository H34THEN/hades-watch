import { notFound } from "next/navigation";
import { MmoNav } from "@/components/mmo/MmoNav";
import { MissionDetailView } from "@/components/mmo/MissionDetailView";
import { getMissionDetailForUser } from "@/lib/missions/queries";
import { requireApprovedAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mission" };

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireApprovedAuth();
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).trim();
  const mission = await getMissionDetailForUser(slug, user.id);
  if (!mission) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <MmoNav active="/mmo/missions" />
      <MissionDetailView mission={mission} />
    </div>
  );
}
