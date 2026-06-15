import { notFound } from "next/navigation";
import { LoreDetailView } from "@/components/archive/LoreDetailView";
import { getCategoryByRouteSlug } from "@/lib/archive/categories";
import { getLoreBySlug } from "@/lib/lore/queries";
import { requireAuth } from "@/lib/auth/session";
import { SURFACE_BREAKS_WORLD_LORE_SLUGS } from "@/lib/lore/world-lore-pack";

interface ArchiveLoreDetailProps {
  categorySlug: string;
  slug: string;
}

export async function ArchiveLoreDetail({ categorySlug, slug }: ArchiveLoreDetailProps) {
  const user = await requireAuth();
  const meta = getCategoryByRouteSlug(categorySlug);
  if (!meta) notFound();

  const result = await getLoreBySlug(slug, user.id, user.roles);
  if (!result) notFound();

  const { entry, accessible, unlocked, canRead } = result;

  if (
    entry.category &&
    entry.category !== meta.loreCategory &&
    !(
      categorySlug === "world" &&
      meta.loreCategory === "WORLD_LORE" &&
      SURFACE_BREAKS_WORLD_LORE_SLUGS.includes(slug)
    )
  ) {
    notFound();
  }

  if (!canRead && accessible && unlocked) notFound();

  return (
    <LoreDetailView
      entry={entry}
      accessible={accessible}
      unlocked={unlocked}
      canRead={canRead}
      backHref={`/archive/${categorySlug}`}
      backLabel={meta.title}
    />
  );
}
