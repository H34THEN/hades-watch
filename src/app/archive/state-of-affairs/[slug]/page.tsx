import { ArchiveLoreDetail } from "@/components/archive/ArchiveLoreDetail";

export const metadata = { title: "State of Affairs Entry" };

export default async function StateOfAffairsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArchiveLoreDetail categorySlug="state-of-affairs" slug={slug} />;
}
