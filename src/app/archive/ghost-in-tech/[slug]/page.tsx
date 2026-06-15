import { ArchiveSignalItemDetail } from "@/components/archive/ArchiveSignalItemDetail";
import { GHOST_IN_TECH_SECTION } from "@/lib/archive/signal-sections";

export const metadata = { title: "Repo Discussion" };

export default async function GhostInTechDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArchiveSignalItemDetail section={GHOST_IN_TECH_SECTION} slug={slug} />;
}
