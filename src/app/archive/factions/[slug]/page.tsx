import { ArchiveLoreDetail } from "@/components/archive/ArchiveLoreDetail";

export const metadata = { title: "Faction Lore Entry" };

export default async function FactionLoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArchiveLoreDetail categorySlug="factions" slug={slug} />;
}
