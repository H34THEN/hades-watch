import type { UserProfileAssetKind } from "@/generated/prisma/client";
import { getDossierForUser, type DossierData } from "@/lib/queries/dossier";
import {
  parseProfileButtonsInput,
  parseProfileLinksInput,
  parseRssFeedsInput,
} from "@/lib/profile-customization/sanitize";
import { buildRssEmbedHtml } from "@/lib/profile-customization/rss";
import { buildProfileIframeDocument } from "@/lib/profile-customization/sanitize";
import {
  AVATAR_SPECIES,
  AVATAR_SKIN_COLORS,
  AVATAR_HAIR_COLORS,
  getDefaultAvatarSelection,
  resolveAvatarLayers,
  type AvatarSelection,
} from "@/lib/avatar/avatar-assets";
import { prisma } from "@/lib/prisma";

export interface ProfileWorldAssetRef {
  id: string;
  url: string;
  kind: UserProfileAssetKind;
}

export interface ProfileWorldRssFeed {
  url: string;
  title?: string;
  itemsHtml?: string;
}

export interface ProfileWorldData {
  dossier: DossierData;
  handle: string | null;
  isOwner: boolean;
  isPublicView: boolean;
  displayName: string;
  tagline: string | null;
  motto: string | null;
  favoriteSignal: string | null;
  backgroundColor: string | null;
  portraitUrl: string | null;
  bannerUrl: string | null;
  backgroundImageUrl: string | null;
  links: { label: string; url: string }[];
  profileButtons: { label: string; url: string; imageUrl?: string }[];
  relicSrcDoc: string | null;
  rssFeeds: ProfileWorldRssFeed[];
  showRelicZone: boolean;
  showRssZone: boolean;
  avatar: {
    displayName: string | null;
    tagline: string | null;
    bio: string | null;
    pronouns: string | null;
    motto: string | null;
    favoriteSignal: string | null;
    speciesName: string;
    poseSlug: string;
    layers: { key: string; src: string; zIndex: number }[];
    skinColor: string | null;
    hairColor: string | null;
    skinColorHex: string | null;
    hairColorHex: string | null;
    hasCustomBackground: boolean;
  } | null;
  spotifyEmbedUrl: string | null;
}

function assetUrl(assetId: string | null | undefined): string | null {
  if (!assetId) return null;
  return `/api/profile-assets/${assetId}`;
}

function avatarPartUrl(partId: string): string {
  return `/api/avatar-parts/${partId}`;
}

async function resolveCustomPartUrls(
  customPartIds: unknown,
  userId: string,
): Promise<Partial<Record<string, string>>> {
  if (!customPartIds || typeof customPartIds !== "object") return {};
  const entries = Object.entries(customPartIds as Record<string, string>).filter(([, id]) => id);
  if (entries.length === 0) return {};
  const ids = entries.map(([, id]) => id);
  const parts = await prisma.avatarUserPart.findMany({
    where: { id: { in: ids }, userId },
    select: { id: true, category: true },
  });
  const byId = new Map(parts.map((p) => [p.id, p]));
  const urls: Partial<Record<string, string>> = {};
  for (const [cat, id] of entries) {
    if (byId.has(id)) urls[cat] = avatarPartUrl(id);
  }
  return urls;
}

async function avatarFromRecord(
  record: {
    displayName: string | null;
    tagline: string | null;
    bio: string | null;
    pronouns: string | null;
    motto: string | null;
    favoriteSignal: string | null;
    speciesSlug: string;
    bodySlug: string;
    poseSlug?: string | null;
    skinColor: string | null;
    eyeSlug: string | null;
    eyeColor: string | null;
    hairSlug: string | null;
    hairColor: string | null;
    outfitSlug: string | null;
    accessorySlugs: unknown;
    backgroundSlug: string | null;
    customBackgroundAssetId: string | null;
    customPartIds?: unknown;
    userId?: string;
  } | null,
): Promise<ProfileWorldData["avatar"]> {
  if (!record) return null;
  const customPartUrls = record.userId
    ? await resolveCustomPartUrls(record.customPartIds, record.userId)
    : {};
  const selection: AvatarSelection = {
    speciesSlug: record.speciesSlug,
    bodySlug: record.bodySlug,
    poseSlug: record.poseSlug ?? "pose-neutral",
    skinColor: record.skinColor,
    eyeSlug: record.eyeSlug,
    eyeColor: record.eyeColor,
    hairSlug: record.hairSlug,
    hairColor: record.hairColor,
    outfitSlug: record.outfitSlug,
    accessorySlugs: Array.isArray(record.accessorySlugs)
      ? (record.accessorySlugs as string[])
      : [],
    backgroundSlug: record.backgroundSlug,
    customBackgroundUrl: assetUrl(record.customBackgroundAssetId),
    customPartUrls,
  };
  const species = AVATAR_SPECIES.find((s) => s.slug === record.speciesSlug);
  return {
    displayName: record.displayName,
    tagline: record.tagline,
    bio: record.bio,
    pronouns: record.pronouns,
    motto: record.motto,
    favoriteSignal: record.favoriteSignal,
    speciesName: species?.name ?? record.speciesSlug,
    poseSlug: record.poseSlug ?? "pose-neutral",
    layers: resolveAvatarLayers(selection),
    skinColor: record.skinColor,
    hairColor: record.hairColor,
    skinColorHex: AVATAR_SKIN_COLORS.find((c) => c.slug === record.skinColor)?.color ?? null,
    hairColorHex: AVATAR_HAIR_COLORS.find((c) => c.slug === record.hairColor)?.color ?? null,
    hasCustomBackground: !!record.customBackgroundAssetId,
  };
}

export async function getProfileWorldForUser(
  userId: string,
  options: { viewerId?: string; isPublicView?: boolean } = {},
): Promise<ProfileWorldData | null> {
  const dossier = await getDossierForUser(userId);
  if (!dossier) return null;

  const [user, character, customization, avatar] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { spotifyEmbedUrl: true },
    }),
    prisma.character.findUnique({ where: { userId }, select: { callsign: true, isPublic: true } }),
    prisma.userProfileCustomization.findUnique({ where: { userId } }),
    prisma.userAvatar.findUnique({ where: { userId } }),
  ]);

  const isOwner = options.viewerId === userId;
  const links = parseProfileLinksInput(customization?.links);
  const profileButtons = parseProfileButtonsInput(customization?.profileButtons);
  const feeds = parseRssFeedsInput(customization?.rssFeeds);

  let rssFeeds: ProfileWorldRssFeed[] = feeds;
  let rssHtml = "";
  if (customization?.showRssZone !== false && feeds.length > 0 && (isOwner || options.isPublicView)) {
    rssHtml = await buildRssEmbedHtml(feeds);
    rssFeeds = feeds;
  }

  let relicSrcDoc: string | null = null;
  if (
    customization?.isEnabled &&
    customization.sanitizedHtml &&
    customization.showRelicZone !== false
  ) {
    relicSrcDoc = buildProfileIframeDocument({
      sanitizedHtml: customization.sanitizedHtml,
      css: customization.css ?? "",
      rssHtml: customization.showRssZone === false ? "" : rssHtml,
    });
  }

  const displayName =
    avatar?.displayName ?? dossier.codename ?? dossier.activeTitle;

  return {
    dossier,
    handle: character?.callsign?.toLowerCase() ?? null,
    isOwner,
    isPublicView: !!options.isPublicView,
    displayName,
    tagline: customization?.tagline ?? avatar?.tagline ?? null,
    motto: customization?.motto ?? avatar?.motto ?? null,
    favoriteSignal: customization?.favoriteSignal ?? avatar?.favoriteSignal ?? null,
    backgroundColor: customization?.backgroundColor ?? null,
    portraitUrl: assetUrl(customization?.portraitAssetId),
    bannerUrl: assetUrl(customization?.bannerAssetId),
    backgroundImageUrl: assetUrl(customization?.backgroundAssetId),
    links,
    profileButtons,
    relicSrcDoc,
    rssFeeds,
    showRelicZone: customization?.showRelicZone !== false,
    showRssZone: customization?.showRssZone !== false,
    avatar: avatar
      ? await avatarFromRecord({ ...avatar, userId })
      : null,
    spotifyEmbedUrl: user?.spotifyEmbedUrl ?? null,
  };
}

export async function getPublicProfileByHandle(handle: string, viewerId?: string) {
  const normalized = handle.toLowerCase().trim();
  const RESERVED = new Set(["edit", "avatar", "bases", "your-callsign"]);
  if (RESERVED.has(normalized)) return null;
  const character = await prisma.character.findFirst({
    where: {
      callsign: { equals: normalized, mode: "insensitive" },
      isPublic: true,
      user: { accountStatus: "Approved", disabled: false, banned: false },
    },
    select: { userId: true },
  });
  if (!character) return null;
  return getProfileWorldForUser(character.userId, {
    viewerId,
    isPublicView: true,
  });
}

export function getDefaultAvatarRecord(userId: string) {
  const defaults = getDefaultAvatarSelection();
  return {
    userId,
    ...defaults,
    accessorySlugs: defaults.accessorySlugs ?? [],
    displayName: null,
    tagline: null,
    bio: null,
    pronouns: null,
    motto: null,
    favoriteSignal: null,
    customBackgroundAssetId: null,
    layerConfig: null,
  };
}
