import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  createDefaultRelicBuild,
  parseRelicBuildConfig,
  type RelicBuildConfig,
} from "@/lib/profile/relic-config";

export interface RelicZoneEditorData {
  activeConfig: RelicBuildConfig;
  draftConfig: RelicBuildConfig;
  hasDraft: boolean;
  activeBuildName: string | null;
}

async function ensureProfileWorld(userId: string) {
  return prisma.profileWorld.upsert({
    where: { userId },
    create: { userId, updatedAt: new Date() },
    update: {},
  });
}

export async function getRelicZoneForUser(userId: string): Promise<RelicZoneEditorData> {
  const [customization, profileWorld] = await Promise.all([
    prisma.userProfileCustomization.findUnique({ where: { userId } }),
    prisma.profileWorld.findUnique({
      where: { userId },
      include: { activeRelicBuild: true },
    }),
  ]);

  const activeFromBuild = profileWorld?.activeRelicBuild
    ? parseRelicBuildConfig({
        layout: profileWorld.activeRelicBuild.layoutKey,
        theme: profileWorld.activeRelicBuild.themeConfig,
        modules: profileWorld.activeRelicBuild.moduleConfig,
      })
    : null;

  const activeFromCustomization =
    customization?.relicThemeConfig || customization?.relicModuleConfig
      ? parseRelicBuildConfig({
          layout: customization.activeLayout ?? "standard_dossier",
          theme: customization.relicThemeConfig,
          modules: customization.relicModuleConfig,
        })
      : profileWorld?.globalThemeConfig || profileWorld?.moduleConfig
        ? parseRelicBuildConfig({
            layout: profileWorld.activeLayout,
            theme: profileWorld.globalThemeConfig,
            modules: profileWorld.moduleConfig,
          })
        : null;

  const activeConfig = activeFromBuild ?? activeFromCustomization ?? createDefaultRelicBuild();

  const draftConfig = customization?.relicDraftConfig
    ? parseRelicBuildConfig(customization.relicDraftConfig)
    : activeConfig;

  return {
    activeConfig,
    draftConfig,
    hasDraft: !!customization?.relicDraftConfig,
    activeBuildName: profileWorld?.activeRelicBuild?.name ?? null,
  };
}

export async function getActiveRelicConfigForUser(userId: string): Promise<RelicBuildConfig> {
  const data = await getRelicZoneForUser(userId);
  return data.activeConfig;
}

export async function saveRelicDraft(
  userId: string,
  config: RelicBuildConfig,
): Promise<void> {
  await prisma.userProfileCustomization.upsert({
    where: { userId },
    create: {
      userId,
      activeLayout: config.layout,
      relicDraftConfig: config as unknown as Prisma.InputJsonValue,
    },
    update: {
      activeLayout: config.layout,
      relicDraftConfig: config as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function publishRelicBuild(
  userId: string,
  config: RelicBuildConfig,
  buildName = "Active Relic",
): Promise<void> {
  const profileWorld = await ensureProfileWorld(userId);

  const build = await prisma.relicBuild.create({
    data: {
      profileWorldId: profileWorld.id,
      userId,
      name: buildName,
      layoutKey: config.layout,
      themeConfig: config.theme as unknown as Prisma.InputJsonValue,
      moduleConfig: config.modules as unknown as Prisma.InputJsonValue,
      isActive: true,
      isDraft: false,
      updatedAt: new Date(),
    },
  });

  await prisma.relicBuild.updateMany({
    where: { profileWorldId: profileWorld.id, id: { not: build.id } },
    data: { isActive: false },
  });

  await prisma.profileWorld.update({
    where: { id: profileWorld.id },
    data: {
      activeLayout: config.layout,
      globalThemeConfig: config.theme as unknown as Prisma.InputJsonValue,
      moduleConfig: config.modules as unknown as Prisma.InputJsonValue,
      activeRelicBuildId: build.id,
      updatedAt: new Date(),
    },
  });

  await prisma.userProfileCustomization.upsert({
    where: { userId },
    create: {
      userId,
      activeLayout: config.layout,
      relicThemeConfig: config.theme as unknown as Prisma.InputJsonValue,
      relicModuleConfig: config.modules as unknown as Prisma.InputJsonValue,
      relicDraftConfig: Prisma.JsonNull,
    },
    update: {
      activeLayout: config.layout,
      relicThemeConfig: config.theme as unknown as Prisma.InputJsonValue,
      relicModuleConfig: config.modules as unknown as Prisma.InputJsonValue,
      relicDraftConfig: Prisma.JsonNull,
    },
  });
}

export async function resetRelicToDefault(userId: string): Promise<void> {
  const defaultConfig = createDefaultRelicBuild();
  const profileWorld = await prisma.profileWorld.findUnique({ where: { userId } });

  if (profileWorld) {
    await prisma.relicBuild.updateMany({
      where: { profileWorldId: profileWorld.id },
      data: { isActive: false },
    });
    await prisma.profileWorld.update({
      where: { id: profileWorld.id },
      data: {
        activeLayout: defaultConfig.layout,
        globalThemeConfig: defaultConfig.theme as unknown as Prisma.InputJsonValue,
        moduleConfig: defaultConfig.modules as unknown as Prisma.InputJsonValue,
        activeRelicBuildId: null,
        updatedAt: new Date(),
      },
    });
  }

  await prisma.userProfileCustomization.upsert({
    where: { userId },
    create: {
      userId,
      activeLayout: defaultConfig.layout,
      relicThemeConfig: defaultConfig.theme as unknown as Prisma.InputJsonValue,
      relicModuleConfig: defaultConfig.modules as unknown as Prisma.InputJsonValue,
      relicDraftConfig: Prisma.JsonNull,
    },
    update: {
      activeLayout: defaultConfig.layout,
      relicThemeConfig: defaultConfig.theme as unknown as Prisma.InputJsonValue,
      relicModuleConfig: defaultConfig.modules as unknown as Prisma.InputJsonValue,
      relicDraftConfig: Prisma.JsonNull,
    },
  });
}
