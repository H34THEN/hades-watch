import { ArchiveCategoryList } from "@/components/archive/ArchiveCategoryList";

export const metadata = { title: "Character Lore" };

export default function CharacterLorePage() {
  return <ArchiveCategoryList categorySlug="characters" />;
}
