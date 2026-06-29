import { GhostInTechLibrary } from "@/components/archive/GhostInTechLibrary";
import type { ArchiveForgeFilter, ArchiveSort } from "@/lib/actions/archive-items";

export const metadata = { title: "Ghost in Tech" };

function parseSort(raw: string | undefined): ArchiveSort {
  if (raw === "discussed" || raw === "az" || raw === "updated") return raw;
  return "newest";
}

function parseForge(raw: string | undefined): ArchiveForgeFilter {
  if (raw === "github" || raw === "codeberg" || raw === "other") return raw;
  return "all";
}

export default async function GhostInTechPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; forge?: string; q?: string; tag?: string }>;
}) {
  const params = await searchParams;
  return (
    <GhostInTechLibrary
      sort={parseSort(params.sort)}
      forge={parseForge(params.forge)}
      query={params.q?.trim() ?? ""}
      tag={params.tag?.trim() ?? ""}
    />
  );
}
