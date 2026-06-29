import Link from "next/link";
import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { BadgeHexGrid } from "@/components/profile/BadgeHexGrid";
import { CommandButton } from "@/components/terminal/CommandButton";
import type { BadgeCaseItem } from "@/lib/profile/badge-case-types";

interface BadgeCasePageProps {
  items: BadgeCaseItem[];
  earnedCount: number;
  totalCount: number;
}

export function BadgeCasePage({ items, earnedCount, totalCount }: BadgeCasePageProps) {
  return (
    <ProfilePageShell
      title="BADGE CASE // DEAD INDEX MARKS"
      subtitle="Every earned signal, faction mark, mission trace, cipher crack, and community recognition recovered from the Underwatch."
      actions={
        <Link href="/profile/relic-zone">
          <CommandButton size="sm" variant="outline">
            Configure Profile Display
          </CommandButton>
        </Link>
      }
    >
      <BadgeHexGrid items={items} earnedCount={earnedCount} totalCount={totalCount} />
    </ProfilePageShell>
  );
}
