import { notFound } from "next/navigation";
import { ProfileWorldRenderer } from "@/components/profile/ProfileWorldRenderer";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getPublicProfileByHandle } from "@/lib/queries/profile-world";
import { getActiveRelicConfigForUser } from "@/lib/queries/relic-zone";
import { RESERVED_CALLSIGNS } from "@/lib/profile/callsign";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Profile World" };

export default async function PublicProfileWorldPage({
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

  const character = await prisma.character.findFirst({
    where: { callsign: { equals: normalized, mode: "insensitive" } },
    select: { userId: true },
  });
  const relicConfig = character
    ? await getActiveRelicConfigForUser(character.userId)
    : null;

  return (
    <ProfileWorldRenderer
      world={world}
      relicConfig={relicConfig}
      showEditLinks={world.isOwner}
      isPublicView={!world.isOwner}
    />
  );
}
