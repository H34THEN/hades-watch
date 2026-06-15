import { notFound } from "next/navigation";
import { LoreDetailView } from "@/components/archive/LoreDetailView";
import { getArchiveCategoryPath } from "@/lib/archive/categories";
import { getLoreBySlug } from "@/lib/lore/queries";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Lore Entry" };

export default async function LoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAuth();
  const { slug } = await params;
  const result = await getLoreBySlug(slug, user.id, user.roles);

  if (!result) notFound();

  const { entry, accessible, unlocked, canRead } = result;

  if (!canRead && accessible && unlocked) notFound();

  return (
    <LoreDetailView
      entry={entry}
      accessible={accessible}
      unlocked={unlocked}
      canRead={canRead}
      backHref={getArchiveCategoryPath(entry.category)}
      backLabel="Archive"
    />
  );
}
