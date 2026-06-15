import { ArchiveCategoryList } from "@/components/archive/ArchiveCategoryList";

export const metadata = { title: "World Lore" };

export default function WorldLorePage() {
  return <ArchiveCategoryList categorySlug="world" />;
}
