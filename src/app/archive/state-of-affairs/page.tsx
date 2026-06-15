import { ArchiveCategoryList } from "@/components/archive/ArchiveCategoryList";

export const metadata = { title: "Current News and State of Affairs" };

export default function StateOfAffairsPage() {
  return <ArchiveCategoryList categorySlug="state-of-affairs" />;
}
