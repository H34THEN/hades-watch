import { RelicZoneEditorPage } from "@/components/profile/RelicZoneEditorPage";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getProfileWorldForUser } from "@/lib/queries/profile-world";
import { getRelicZoneForUser } from "@/lib/queries/relic-zone";

export const metadata = { title: "Relic Zone" };

export default async function RelicZoneRoutePage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <AccessDenied
        title="Authentication Required"
        message="Sign in to enter the Relic Zone editor."
      />
    );
  }
  if (!isApprovedUser(user)) {
    return (
      <AccessDenied
        title="Approval Required"
        message="Relic Zone editing requires approved operative clearance."
      />
    );
  }

  const [world, editorData] = await Promise.all([
    getProfileWorldForUser(user.id, { viewerId: user.id }),
    getRelicZoneForUser(user.id),
  ]);

  if (!world) {
    return (
      <AccessDenied title="Profile Unavailable" message="Unable to load Relic Zone preview." />
    );
  }

  return <RelicZoneEditorPage world={world} editorData={editorData} />;
}
