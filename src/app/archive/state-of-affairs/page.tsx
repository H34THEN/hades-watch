import { ArchiveSignalFeed } from "@/components/archive/ArchiveSignalFeed";
import { STATE_OF_AFFAIRS_SECTION } from "@/lib/archive/signal-sections";
import type { ArchiveSort } from "@/lib/actions/archive-items";

export const metadata = { title: "State of Affairs" };

export default async function StateOfAffairsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const resolvedSort: ArchiveSort = sort === "discussed" ? "discussed" : "newest";
  return <ArchiveSignalFeed section={STATE_OF_AFFAIRS_SECTION} sort={resolvedSort} />;
}
