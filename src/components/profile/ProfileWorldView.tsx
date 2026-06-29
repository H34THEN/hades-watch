"use client";

import type { CSSProperties } from "react";
import type { ProfileWorldData } from "@/lib/queries/profile-world";
import { SandboxedProfileFrame } from "@/components/profile/SandboxedProfileFrame";
import { DossierBadgeList } from "@/components/profile/DossierBadgeList";
import { ProfileMissionBadgeGrid } from "@/components/profile/ProfileMissionBadgeGrid";
import { ProfileCipherBadgeGrid } from "@/components/profile/ProfileCipherBadgeGrid";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { AvatarHudFrame } from "@/components/avatar/AvatarHudFrame";

interface ProfileWorldViewProps {
  world: ProfileWorldData;
  showEditLinks?: boolean;
  hiddenModules?: Set<string>;
  moduleTitles?: Record<string, string>;
  relicAccent?: string;
  compact?: boolean;
}

function isHidden(hidden: Set<string> | undefined, key: string) {
  return hidden?.has(key) ?? false;
}

function showCharacterHeader(hiddenModules: Set<string> | undefined) {
  return (
    !isHidden(hiddenModules, "character_card") || !isHidden(hiddenModules, "bio")
  );
}

export function ProfileWorldView({
  world,
  showEditLinks = false,
  hiddenModules,
  moduleTitles,
  relicAccent,
  compact = false,
}: ProfileWorldViewProps) {
  const { dossier } = world;
  const bgStyle = world.backgroundImageUrl
    ? {
        backgroundImage: `url(${world.backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : world.backgroundColor
      ? { backgroundColor: world.backgroundColor }
      : undefined;

  const factionName = dossier.faction?.name ?? dossier.allianceMembership?.name ?? null;
  const accentStyle = relicAccent ? ({ "--primary": relicAccent } as CSSProperties) : undefined;
  const publicHandlePath = world.handle ? `/profile/world/${world.handle}` : null;

  return (
    <div
      className={`w-full ${compact ? "min-h-[420px]" : "min-h-screen"}`}
      style={{ ...bgStyle, ...accentStyle }}
    >
      <div
        className={`w-full bg-gradient-to-b from-black/60 via-black/85 to-black/95 ${compact ? "min-h-[420px]" : "min-h-screen"}`}
      >
        {world.bannerUrl && (
          <div
            className="h-32 w-full border-b border-primary/20 bg-cover bg-center md:h-44 lg:h-52"
            style={{ backgroundImage: `url(${world.bannerUrl})` }}
          />
        )}

        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-10">
          {showEditLinks && (
            <div className="mb-6 flex flex-wrap gap-2">
              <Link href="/profile/relic-zone">
                <CommandButton size="sm">Relic Zone Editor</CommandButton>
              </Link>
              <Link href="/profile/dossier">
                <CommandButton size="sm" variant="outline">
                  Character Dossier
                </CommandButton>
              </Link>
              <Link href="/profile/avatar">
                <CommandButton size="sm" variant="outline">
                  Avatar Builder
                </CommandButton>
              </Link>
              {publicHandlePath ? (
                <Link href={publicHandlePath}>
                  <CommandButton size="sm" variant="outline">
                    View Public Profile
                  </CommandButton>
                </Link>
              ) : (
                <Link href="/mmo/character">
                  <CommandButton size="sm" variant="outline">
                    Set Callsign
                  </CommandButton>
                </Link>
              )}
            </div>
          )}
          {showEditLinks && !world.handle && (
            <p className="mb-4 font-mono text-xs text-muted-foreground">
              Set your callsign to activate your public profile signal.
            </p>
          )}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,46%)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(420px,44%)]">
            <div className="order-2 space-y-6 lg:order-1">
              {showCharacterHeader(hiddenModules) ? (
              <header className="space-y-3 border-b border-primary/20 pb-6">
                <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
                  Profile World · {moduleTitles?.character_card ?? "Public Relic"}
                </p>
                <div className="flex flex-wrap items-start gap-4">
                  {!isHidden(hiddenModules, "character_card") && world.portraitUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={world.portraitUrl}
                      alt={`${world.displayName} portrait`}
                      className="h-20 w-20 shrink-0 border border-primary/40 object-cover md:h-24 md:w-24"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    {!isHidden(hiddenModules, "character_card") ? (
                      <>
                        <h1 className="font-mono text-3xl tracking-widest uppercase text-foreground md:text-4xl xl:text-5xl">
                          {world.displayName}
                        </h1>
                        {world.tagline && (
                          <p className="mt-2 text-base text-muted-foreground md:text-lg">{world.tagline}</p>
                        )}
                        {world.avatar?.pronouns && (
                          <p className="mt-1 font-mono text-xs text-muted-foreground">{world.avatar.pronouns}</p>
                        )}
                        {world.handle && (
                          <p className="mt-2 font-mono text-[10px] text-primary/80">/profile/world/{world.handle}</p>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
                {!isHidden(hiddenModules, "bio") && world.motto && (
                  <blockquote className="border-l-2 border-primary/50 pl-4 text-sm italic text-foreground/80">
                    {world.motto}
                  </blockquote>
                )}
                {!isHidden(hiddenModules, "bio") && world.avatar?.bio && (
                  <p className="max-w-3xl text-sm leading-relaxed text-foreground/90">{world.avatar.bio}</p>
                )}
                {!isHidden(hiddenModules, "bio") && world.favoriteSignal && (
                  <p className="font-mono text-xs text-primary">Signal: {world.favoriteSignal}</p>
                )}
              </header>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {!isHidden(hiddenModules, "character_card") ? (
                <TerminalPanel title="identity.dossier">
                  <dl className="space-y-2 font-mono text-xs">
                    <div>
                      <dt className="text-muted-foreground">Codename</dt>
                      <dd>{dossier.codename}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Title</dt>
                      <dd>{dossier.activeTitle}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Clearance</dt>
                      <dd>{dossier.clearance.label}</dd>
                    </div>
                    {world.avatar?.speciesName && (
                      <div>
                        <dt className="text-muted-foreground">Species</dt>
                        <dd>{world.avatar.speciesName}</dd>
                      </div>
                    )}
                  </dl>
                </TerminalPanel>
                ) : null}

                {!isHidden(hiddenModules, "faction") ? (
                <TerminalPanel title={moduleTitles?.faction ?? "faction.standing"}>
                  {dossier.allianceMembership ? (
                    <div className="mb-3">
                      <p className="font-mono text-[10px] text-primary uppercase">Alliance</p>
                      <p className="font-mono text-sm">{dossier.allianceMembership.name}</p>
                    </div>
                  ) : null}
                  {dossier.faction ? (
                    <div>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase">Cell</p>
                      <p className="font-mono text-sm text-primary">{dossier.faction.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dossier.faction.displayTitle ?? dossier.faction.position}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No faction clearance on record.</p>
                  )}
                </TerminalPanel>
                ) : null}

                {!isHidden(hiddenModules, "badges") ? (
                <TerminalPanel title={moduleTitles?.badges ?? "badges"} className="sm:col-span-2 xl:col-span-1">
                  {dossier.badges.length === 0 && dossier.dbBadges.length === 0 ? (
                    <p className="font-mono text-sm text-muted-foreground">
                      No badge records have surfaced from the Dead Index yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {dossier.badges.length > 0 && <DossierBadgeList badges={dossier.badges} />}
                      {dossier.dbBadges.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {dossier.dbBadges.map((b) => (
                            <span
                              key={b.slug}
                              className="rounded border border-primary/30 px-2 py-1 font-mono text-[10px] text-primary"
                              style={b.color ? { borderColor: b.color, color: b.color } : undefined}
                            >
                              {b.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </TerminalPanel>
                ) : null}
              </div>

              {!isHidden(hiddenModules, "missions") && dossier.missionBadges.length > 0 && (
                <TerminalPanel title={moduleTitles?.missions ?? "mission.records"}>
                  <ProfileMissionBadgeGrid badges={dossier.missionBadges} />
                </TerminalPanel>
              )}
              {!isHidden(hiddenModules, "ciphers") && dossier.cipherBadges.length > 0 && (
                <TerminalPanel title={moduleTitles?.ciphers ?? "cipher.standing"}>
                  <ProfileCipherBadgeGrid badges={dossier.cipherBadges} />
                </TerminalPanel>
              )}

              {!isHidden(hiddenModules, "links") &&
              (world.links.length > 0 || world.profileButtons.length > 0) && (
                <TerminalPanel title={moduleTitles?.links ?? "net.neighbor.buttons"}>
                  <div className="flex flex-wrap gap-3">
                    {world.profileButtons.map((btn) => (
                      <a
                        key={`${btn.label}-${btn.url}`}
                        href={btn.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow ugc"
                        className="inline-block border border-border/60 bg-black/40 px-3 py-2 font-mono text-xs hover:border-primary/50"
                      >
                        {btn.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={btn.imageUrl} alt="" width={88} height={31} className="mb-1 block" />
                        ) : null}
                        {btn.label}
                      </a>
                    ))}
                    {world.links.map((link) => (
                      <a
                        key={`${link.label}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow ugc"
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                </TerminalPanel>
              )}

              {!isHidden(hiddenModules, "spotify") && world.spotifyEmbedUrl && (
                <TerminalPanel title={moduleTitles?.spotify ?? "signal.soundtrack"}>
                  <iframe
                    title="Spotify playlist"
                    src={world.spotifyEmbedUrl}
                    className="h-80 w-full border border-border/40"
                    loading="lazy"
                    allow="encrypted-media"
                  />
                </TerminalPanel>
              )}

              {!isHidden(hiddenModules, "relic_iframe") && world.showRelicZone && (
                <div>
                  {world.relicSrcDoc ? (
                    <TerminalPanel title="relic.zone">
                      <p className="mb-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                        MySpace Relic Zone · sandboxed iframe · no scripts
                      </p>
                      <SandboxedProfileFrame
                        srcDoc={world.relicSrcDoc}
                        title="Custom profile relic zone"
                        className="min-h-[360px] w-full"
                      />
                    </TerminalPanel>
                  ) : (
                    <TerminalPanel title="relic.zone">
                      <p className="font-mono text-sm text-muted-foreground">
                        This operative has not opened a custom signal window yet.
                      </p>
                    </TerminalPanel>
                  )}
                </div>
              )}
            </div>

            <aside
              className={`order-1 lg:sticky lg:top-6 lg:order-2 lg:self-start ${
                isHidden(hiddenModules, "character_card") ? "hidden lg:hidden" : ""
              }`}
            >
              {world.avatar ? (
                <AvatarHudFrame
                  layers={world.avatar.layers}
                  skinColor={world.avatar.skinColorHex}
                  hairColor={world.avatar.hairColorHex}
                  poseSlug={world.avatar.poseSlug}
                  status={{
                    speciesName: world.avatar.speciesName,
                    poseSlug: world.avatar.poseSlug,
                    factionName,
                    hasBackground: world.avatar.hasCustomBackground,
                    loadStatus: world.avatar.layers.length > 0 ? "stable" : "empty",
                  }}
                />
              ) : (
                <AvatarHudFrame
                  layers={[]}
                  status={{ loadStatus: "empty" }}
                />
              )}
              {showEditLinks && !world.avatar && (
                <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground">
                  <Link href="/profile/avatar" className="text-primary hover:underline">
                    Open Avatar Builder
                  </Link>{" "}
                  to assemble your mirror chamber body.
                </p>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
