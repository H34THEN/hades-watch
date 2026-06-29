import { FieldCareDeadDropsLibrary } from "@/components/dead-drops/FieldCareDeadDropsLibrary";

export const metadata = { title: "Dead Drops // Field Care Cache" };

export default async function DeadDropsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <FieldCareDeadDropsLibrary categoryFilter={category?.trim() || undefined} />;
}
