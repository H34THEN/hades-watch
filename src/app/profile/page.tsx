import { ProfileWorldView } from "@/components/profile/ProfileWorldView";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { requireAuth } from "@/lib/auth/session";
import { getProfileWorldForUser } from "@/lib/queries/profile-world";

export const metadata = { title: "Profile World" };

export default async function ProfilePage() {
  const user = await requireAuth();
  const world = await getProfileWorldForUser(user.id, { viewerId: user.id });

  if (!world) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <SystemAlert title="Profile Unavailable" message="Unable to load profile world." variant="error" />
      </div>
    );
  }

  return <ProfileWorldView world={world} showEditLinks={user.accountStatus === "Approved"} />;
}
