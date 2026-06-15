import { ArchiveLoreDetail } from "@/components/archive/ArchiveLoreDetail";

export const metadata = { title: "World Lore Entry" };

export default async function WorldLoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArchiveLoreDetail categorySlug="world" slug={slug} />;
}
