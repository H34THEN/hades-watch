import Link from "next/link";
import { AvatarBuilderClient } from "@/components/avatar/AvatarBuilderClient";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { getDefaultAvatarSelection } from "@/lib/avatar/avatar-assets";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Avatar Builder" };

function parseCustomPartIds(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string" && v) out[k] = v;
  }
  return out;
}

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

  const [avatar, userParts, sharedParts] = await Promise.all([
    prisma.userAvatar.findUnique({ where: { userId: user.id } }),
    prisma.avatarUserPart.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, category: true, label: true, visibility: true },
    }),
    prisma.avatarUserPart.findMany({
      where: { visibility: "SHARED", userId: { not: user.id } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, category: true, label: true, visibility: true },
    }),
  ]);

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
    poseSlug: avatar?.poseSlug ?? defaults.poseSlug ?? "pose-neutral",
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
    customPartIds: parseCustomPartIds(avatar?.customPartIds),
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Avatar Builder</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Layered identity for the Underwatch mirror chamber · HUD preview · custom parts · poses.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/profile/avatar/bases">
            <CommandButton size="sm" variant="outline">
              Base Downloads
            </CommandButton>
          </Link>
          <Link href="/profile">
            <CommandButton size="sm" variant="outline">
              ← Profile World
            </CommandButton>
          </Link>
        </div>
      </div>
      <AvatarBuilderClient initial={initial} userParts={userParts} sharedParts={sharedParts} />
    </div>
  );
}
