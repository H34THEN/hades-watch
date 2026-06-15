import { notFound } from "next/navigation";
import { ProfileWorldView } from "@/components/profile/ProfileWorldView";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getPublicProfileByHandle } from "@/lib/queries/profile-world";
import { RESERVED_CALLSIGNS } from "@/lib/profile/callsign";

export const metadata = { title: "Operative Profile" };

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ callsign: string }>;
}) {
  const { callsign } = await params;
  const normalized = callsign.toLowerCase().trim();

  if (RESERVED_CALLSIGNS.has(normalized)) {
    notFound();
  }

  const viewer = await getSessionUser();
  if (!viewer || !isApprovedUser(viewer)) {
    return (
      <AccessDenied
        title="Approval Required"
        message="Viewing operative profile worlds requires approved clearance."
      />
    );
  }

  const world = await getPublicProfileByHandle(callsign, viewer.id);
  if (!world) notFound();

  return <ProfileWorldView world={world} showEditLinks={world.isOwner} />;
}
