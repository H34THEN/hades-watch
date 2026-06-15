import Link from "next/link";
import { AvatarBuilderClient } from "@/components/avatar/AvatarBuilderClient";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { getDefaultAvatarSelection } from "@/lib/avatar/avatar-assets";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Avatar Builder" };

export default async function ProfileAvatarPage() {
  const user = await getSessionUser();
  if (!user || !isApprovedUser(user)) {
    return (
      <AccessDenied
        title="Approval Required"
        message="Avatar builder requires approved operative clearance."
      />
    );
  }

  const avatar = await prisma.userAvatar.findUnique({ where: { userId: user.id } });
  const defaults = getDefaultAvatarSelection();

  const initial = {
    displayName: avatar?.displayName ?? "",
    tagline: avatar?.tagline ?? "",
    bio: avatar?.bio ?? "",
    pronouns: avatar?.pronouns ?? "",
    motto: avatar?.motto ?? "",
    favoriteSignal: avatar?.favoriteSignal ?? "",
    speciesSlug: avatar?.speciesSlug ?? defaults.speciesSlug,
    bodySlug: avatar?.bodySlug ?? defaults.bodySlug,
    skinColor: avatar?.skinColor ?? defaults.skinColor ?? "",
    eyeSlug: avatar?.eyeSlug ?? defaults.eyeSlug ?? "",
    eyeColor: avatar?.eyeColor ?? defaults.eyeColor ?? "",
    hairSlug: avatar?.hairSlug ?? defaults.hairSlug ?? "",
    hairColor: avatar?.hairColor ?? defaults.hairColor ?? "",
    outfitSlug: avatar?.outfitSlug ?? defaults.outfitSlug ?? "",
    accessorySlugs: Array.isArray(avatar?.accessorySlugs)
      ? (avatar.accessorySlugs as string[])
      : [],
    backgroundSlug: avatar?.backgroundSlug ?? defaults.backgroundSlug ?? "",
    customBackgroundAssetId: avatar?.customBackgroundAssetId ?? "",
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Avatar Builder</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gaia-style layered identity for the Underwatch mirror chamber.
          </p>
        </div>
        <Link href="/profile">
          <CommandButton size="sm" variant="outline">← Profile World</CommandButton>
        </Link>
      </div>
      <AvatarBuilderClient initial={initial} />
    </div>
  );
}
