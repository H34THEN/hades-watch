import Link from "next/link";
import { ProfileEditClient } from "@/components/profile/ProfileEditClient";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { parseRssFeedsInput } from "@/lib/profile-customization/sanitize";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Edit Profile" };

export default async function ProfileEditPage() {
  const user = await getSessionUser();
  if (!user || !isApprovedUser(user)) {
    return (
      <AccessDenied
        title="Approval Required"
        message="Profile world editing requires approved operative clearance."
      />
    );
  }

  const customization = await prisma.userProfileCustomization.findUnique({
    where: { userId: user.id },
  });

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl justify-end px-4 pt-6 md:px-8">
        <Link href="/profile">
          <CommandButton size="sm" variant="outline">← Profile World</CommandButton>
        </Link>
      </div>
      <ProfileEditClient
        user={user}
        initial={{
          html: customization?.html ?? "",
          css: customization?.css ?? "",
          rssFeeds: parseRssFeedsInput(customization?.rssFeeds),
          tagline: customization?.tagline ?? "",
          motto: customization?.motto ?? "",
          favoriteSignal: customization?.favoriteSignal ?? "",
          backgroundColor: customization?.backgroundColor ?? "",
          isEnabled: customization?.isEnabled ?? true,
          showRelicZone: customization?.showRelicZone ?? true,
          showRssZone: customization?.showRssZone ?? true,
        }}
      />
    </>
  );
}
