import Link from "next/link";
import { ProfileEditClient } from "@/components/profile/ProfileEditClient";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { parseRssFeedsInput } from "@/lib/profile-customization/sanitize";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { ensureUserCallsign, deriveCallsignSeed } from "@/lib/profile/callsign-service";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Edit Profile" };

export default async function ProfileEditPage() {
  const user = await getSessionUser();
  console.log("[profile/edit] auth user id present:", !!user?.id);

  if (!user) {
    console.log("[profile/edit] user found: false");
    return (
      <AccessDenied
        title="Authentication Required"
        message="Sign in to edit your profile world."
      />
    );
  }

  console.log("[profile/edit] user found: true");

  if (!isApprovedUser(user)) {
    return (
      <AccessDenied
        title="Approval Required"
        message="Profile world editing requires approved operative clearance."
      />
    );
  }

  const [customization, callsignResult, dbUser] = await Promise.all([
    prisma.userProfileCustomization.findUnique({ where: { userId: user.id } }),
    ensureUserCallsign(prisma, user.id),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true },
    }),
  ]);

  console.log("[profile/edit] character found or created:", !!callsignResult?.callsign);

  const callsign = callsignResult?.callsign ?? "";
  const isPublic = callsignResult?.isPublic ?? true;
  const suggestedCallsign = dbUser ? deriveCallsignSeed(dbUser) : "";
  const rssFeeds = parseRssFeedsInput(customization?.rssFeeds);

  const initial = {
    callsign,
    suggestedCallsign,
    isPublic,
    html: customization?.html ?? "",
    css: customization?.css ?? "",
    rssFeeds,
    tagline: customization?.tagline ?? "",
    motto: customization?.motto ?? "",
    favoriteSignal: customization?.favoriteSignal ?? "",
    backgroundColor: customization?.backgroundColor ?? "",
    isEnabled: customization?.isEnabled ?? true,
    showRelicZone: customization?.showRelicZone ?? true,
    showRssZone: customization?.showRssZone ?? true,
  };

  console.log("[profile/edit] rendering ProfileEditClient");

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-end gap-2 px-4 pt-6 md:px-8">
        <Link href="/profile/world">
          <CommandButton size="sm" variant="outline">
            ← Profile World
          </CommandButton>
        </Link>
        <Link href="/profile/avatar">
          <CommandButton size="sm" variant="outline">
            Avatar Builder
          </CommandButton>
        </Link>
        {callsign ? (
          <Link href={`/profile/world/${callsign}`}>
            <CommandButton size="sm" variant="outline">
              View Public Profile
            </CommandButton>
          </Link>
        ) : null}
      </div>
      <ProfileEditClient user={user} initial={initial} />
    </>
  );
}
