import { ArchiveLoreDetail } from "@/components/archive/ArchiveLoreDetail";

export const dynamic = "force-dynamic";
export const metadata = { title: "World Lore Entry" };

export default async function WorldLoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).trim();
  return <ArchiveLoreDetail categorySlug="world" slug={slug} />;
}
