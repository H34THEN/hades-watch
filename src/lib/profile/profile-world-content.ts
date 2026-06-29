import type { ProfileWorldData } from "@/lib/queries/profile-world";
import type { RelicBuildConfig, RelicModuleType } from "@/lib/profile/relic-config";

export function hiddenModuleSet(config: RelicBuildConfig | null | undefined): Set<string> {
  if (!config) return new Set();
  return new Set(config.modules.filter((m) => !m.visible).map((m) => m.type));
}

function moduleVisible(hidden: Set<string>, type: RelicModuleType): boolean {
  return !hidden.has(type);
}

/** True when at least one profile world panel would render meaningful content. */
export function hasVisibleProfileWorldContent(
  world: ProfileWorldData,
  config: RelicBuildConfig | null | undefined,
): boolean {
  const hidden = hiddenModuleSet(config);

  if (moduleVisible(hidden, "character_card")) return true;
  if (moduleVisible(hidden, "bio") && (world.motto || world.avatar?.bio || world.favoriteSignal)) {
    return true;
  }
  if (moduleVisible(hidden, "faction")) return true;
  if (moduleVisible(hidden, "badges") && (world.dossier.badges.length > 0 || world.dossier.dbBadges.length > 0)) {
    return true;
  }
  if (moduleVisible(hidden, "missions") && world.dossier.missionBadges.length > 0) return true;
  if (moduleVisible(hidden, "ciphers") && world.dossier.cipherBadges.length > 0) return true;
  if (
    moduleVisible(hidden, "links") &&
    (world.links.length > 0 || world.profileButtons.length > 0)
  ) {
    return true;
  }
  if (moduleVisible(hidden, "spotify") && world.spotifyEmbedUrl) return true;
  if (moduleVisible(hidden, "relic_iframe") && world.showRelicZone && world.relicSrcDoc) {
    return true;
  }
  if (world.avatar && world.avatar.layers.length > 0 && moduleVisible(hidden, "character_card")) {
    return true;
  }

  return false;
}
