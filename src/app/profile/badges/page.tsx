import { BadgeCasePage } from "@/components/profile/BadgeCasePage";
import { requireAuth } from "@/lib/auth/session";
import { getBadgeCaseForUser } from "@/lib/queries/badge-case";

export const metadata = { title: "Badge Case" };

export default async function BadgesRoutePage() {
  const user = await requireAuth();
  const badgeCase = await getBadgeCaseForUser(user.id);

  return (
    <BadgeCasePage
      items={badgeCase.items}
      earnedCount={badgeCase.earnedCount}
      totalCount={badgeCase.totalCount}
    />
  );
}
