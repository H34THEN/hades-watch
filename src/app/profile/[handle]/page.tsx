import { notFound } from "next/navigation";
import { ProfileWorldView } from "@/components/profile/ProfileWorldView";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getPublicProfileByHandle } from "@/lib/queries/profile-world";

export const metadata = { title: "Operative Profile" };

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const viewer = await getSessionUser();
  if (!viewer || !isApprovedUser(viewer)) {
    return (
      <AccessDenied
        title="Approval Required"
        message="Viewing operative profile worlds requires approved clearance."
      />
    );
  }
  const world = await getPublicProfileByHandle(handle, viewer.id);

  if (!world) notFound();

  return <ProfileWorldView world={world} showEditLinks={world.isOwner} />;
}
