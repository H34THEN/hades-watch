import { ArchiveCategoryList } from "@/components/archive/ArchiveCategoryList";

export const metadata = { title: "Faction Lore" };

export default function FactionLorePage() {
  return <ArchiveCategoryList categorySlug="factions" />;
}
