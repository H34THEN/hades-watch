import { ArchiveSignalFeed } from "@/components/archive/ArchiveSignalFeed";
import { GHOST_IN_TECH_SECTION } from "@/lib/archive/signal-sections";
import type { ArchiveSort } from "@/lib/actions/archive-items";

export const metadata = { title: "Ghost in Tech" };

export default async function GhostInTechPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const resolvedSort: ArchiveSort = sort === "discussed" ? "discussed" : "newest";
  return <ArchiveSignalFeed section={GHOST_IN_TECH_SECTION} sort={resolvedSort} />;
}
