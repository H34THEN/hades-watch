import { ArchiveLoreDetail } from "@/components/archive/ArchiveLoreDetail";

export const metadata = { title: "Mythos and Ethos Entry" };

export default async function MythosLoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArchiveLoreDetail categorySlug="mythos-and-ethos" slug={slug} />;
}
