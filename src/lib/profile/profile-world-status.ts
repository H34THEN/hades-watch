import { prisma } from "@/lib/prisma";

export interface ProfileWorldPublishStatus {
  isPublished: boolean;
  buildName: string | null;
  layoutKey: string | null;
}

export async function getProfileWorldPublishStatus(
  userId: string,
): Promise<ProfileWorldPublishStatus> {
  const [profileWorld, customization] = await Promise.all([
    prisma.profileWorld.findUnique({
      where: { userId },
      include: {
        activeRelicBuild: {
          select: { name: true, isDraft: true, layoutKey: true },
        },
      },
    }),
    prisma.userProfileCustomization.findUnique({
      where: { userId },
      select: {
        relicThemeConfig: true,
        relicModuleConfig: true,
        activeLayout: true,
      },
    }),
  ]);

  const hasActiveBuild = Boolean(
    profileWorld?.activeRelicBuildId &&
      profileWorld.activeRelicBuild &&
      !profileWorld.activeRelicBuild.isDraft,
  );

  const hasLegacyPublish = Boolean(
    customization?.relicThemeConfig || customization?.relicModuleConfig,
  );

  const hasProfileWorldConfig = Boolean(
    profileWorld?.globalThemeConfig || profileWorld?.moduleConfig,
  );

  return {
    isPublished: hasActiveBuild || hasLegacyPublish || hasProfileWorldConfig,
    buildName: profileWorld?.activeRelicBuild?.name ?? null,
    layoutKey:
      profileWorld?.activeRelicBuild?.layoutKey ??
      customization?.activeLayout ??
      profileWorld?.activeLayout ??
      null,
  };
}
