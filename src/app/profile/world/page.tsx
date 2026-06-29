import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import { ProfileWorldRenderer } from "@/components/profile/ProfileWorldRenderer";
import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { CommandButton } from "@/components/terminal/CommandButton";
import { requireAuth } from "@/lib/auth/session";
import { getActiveRelicConfigForUser } from "@/lib/queries/relic-zone";
import { getProfileWorldForUser } from "@/lib/queries/profile-world";

export const metadata = { title: "Profile World" };

export default async function ProfileWorldOwnerPage() {
  const user = await requireAuth();
  const [world, relicConfig] = await Promise.all([
    getProfileWorldForUser(user.id, { viewerId: user.id }),
    getActiveRelicConfigForUser(user.id),
  ]);

  if (!world) {
    return (
      <PageShell variant="standard" scanlines>
        <SystemAlert title="Profile Unavailable" message="Unable to load profile world." variant="error" />
      </PageShell>
    );
  }

  const publicHref = world.handle ? `/profile/world/${world.handle}` : null;

  return (
    <>
      <ProfilePageShell
        title="PROFILE WORLD // PUBLIC RELIC"
        subtitle="This is the active relic visitors see when they enter your public signal chamber."
        actions={
          <>
            <Link href="/profile/relic-zone">
              <CommandButton size="sm">Enter Relic Zone</CommandButton>
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
        <p className="mb-4 font-mono text-[10px] text-muted-foreground">
          Preview below mirrors your published Active Relic configuration.
        </p>
      </ProfilePageShell>
      <ProfileWorldRenderer
        world={world}
        relicConfig={relicConfig}
        showEditLinks={user.accountStatus === "Approved"}
      />
    </>
  );
}
