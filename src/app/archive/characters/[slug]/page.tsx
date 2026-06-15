import { ArchiveLoreDetail } from "@/components/archive/ArchiveLoreDetail";

export const metadata = { title: "Character Dossier" };

export default async function CharacterLoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArchiveLoreDetail categorySlug="characters" slug={slug} />;
}
