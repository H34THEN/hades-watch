import Link from "next/link";
import { ProfileWorldEmptyState } from "@/components/profile/ProfileWorldEmptyState";
import { ProfileWorldPreviewSection } from "@/components/profile/ProfileWorldPreviewSection";
import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { ProfileWorldErrorPanel } from "@/components/profile/ProfileWorldStatusPanels";
import { CommandButton } from "@/components/terminal/CommandButton";
import { requireAuth, isApprovedUser } from "@/lib/auth/session";
import { getProfileWorldPublishStatus } from "@/lib/profile/profile-world-status";
import { getProfileWorldForUser } from "@/lib/queries/profile-world";
import { getActiveRelicConfigForUser } from "@/lib/queries/relic-zone";

export const metadata = { title: "Profile World" };

export const dynamic = "force-dynamic";

export default async function ProfileWorldOwnerPage() {
  const user = await requireAuth();

  let world;
  let relicConfig;
  let publishStatus;

  try {
    [world, relicConfig, publishStatus] = await Promise.all([
      getProfileWorldForUser(user.id, { viewerId: user.id }),
      getActiveRelicConfigForUser(user.id),
      getProfileWorldPublishStatus(user.id),
    ]);
  } catch {
    return (
      <ProfilePageShell
        title="PROFILE WORLD // PUBLIC RELIC"
        subtitle="This is the active relic visitors see when they enter your public signal chamber."
        fillViewport={false}
      >
        <ProfileWorldErrorPanel />
      </ProfilePageShell>
    );
  }

  if (!world) {
    return (
      <ProfilePageShell
        title="PROFILE WORLD // PUBLIC RELIC"
        subtitle="This is the active relic visitors see when they enter your public signal chamber."
        fillViewport={false}
      >
        <ProfileWorldErrorPanel message="Unable to load your operative dossier for Profile World preview." />
      </ProfilePageShell>
    );
  }

  const publicHref = world.handle ? `/profile/world/${world.handle}` : null;

  return (
    <ProfilePageShell
      title="PROFILE WORLD // PUBLIC RELIC"
      subtitle="This is the active relic visitors see when they enter your public signal chamber."
      fillViewport={false}
      actions={
        <>
          <Link href="/profile/relic-zone">
            <CommandButton size="sm">Enter Relic Zone</CommandButton>
          </Link>
          <Link href="/profile/relic-zone">
            <CommandButton size="sm" variant="outline">
              Open Profile World Editor
            </CommandButton>
          </Link>
          {publicHref ? (
            <Link href={publicHref}>
              <CommandButton size="sm" variant="outline">
                Public URL
              </CommandButton>
            </Link>
          ) : null}
        </>
      }
    >
      {!publishStatus.isPublished ? (
        <ProfileWorldEmptyState />
      ) : (
        <ProfileWorldPreviewSection
          world={world}
          relicConfig={relicConfig}
          showEditLinks={isApprovedUser(user)}
          buildName={publishStatus.buildName}
        />
      )}
    </ProfilePageShell>
  );
}
