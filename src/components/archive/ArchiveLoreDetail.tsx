import { notFound } from "next/navigation";
import { LoreDetailView } from "@/components/archive/LoreDetailView";
import { getCategoryByRouteSlug } from "@/lib/archive/categories";
import { getLoreBySlug } from "@/lib/actions/lore";
import { requireAuth } from "@/lib/auth/session";

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

  if (entry.category && entry.category !== meta.loreCategory) {
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
