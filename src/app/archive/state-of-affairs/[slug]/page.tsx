import { ArchiveSignalItemDetail } from "@/components/archive/ArchiveSignalItemDetail";
import { STATE_OF_AFFAIRS_SECTION } from "@/lib/archive/signal-sections";

export const metadata = { title: "Signal Thread" };

export default async function StateOfAffairsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArchiveSignalItemDetail section={STATE_OF_AFFAIRS_SECTION} slug={slug} />;
}
