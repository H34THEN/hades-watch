"use client";

import type { ProfileWorldData } from "@/lib/queries/profile-world";
import { SandboxedProfileFrame } from "@/components/profile/SandboxedProfileFrame";
import { DossierBadgeList } from "@/components/profile/DossierBadgeList";
import { ProfileMissionBadgeGrid } from "@/components/profile/ProfileMissionBadgeGrid";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { AvatarPreview } from "@/components/avatar/AvatarPreview";

interface ProfileWorldViewProps {
  world: ProfileWorldData;
  showEditLinks?: boolean;
}

export function ProfileWorldView({ world, showEditLinks = false }: ProfileWorldViewProps) {
  const { dossier } = world;
  const bgStyle = world.backgroundImageUrl
    ? { backgroundImage: `url(${world.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : world.backgroundColor
      ? { backgroundColor: world.backgroundColor }
      : undefined;

  return (
    <div className="min-h-screen w-full" style={bgStyle}>
      <div className="min-h-screen w-full bg-gradient-to-b from-black/70 via-black/80 to-black/95">
        {world.bannerUrl && (
          <div
            className="h-40 w-full border-b border-primary/20 bg-cover bg-center md:h-56"
            style={{ backgroundImage: `url(${world.bannerUrl})` }}
          />
        )}

        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
          {showEditLinks && (
            <div className="mb-6 flex flex-wrap gap-2">
              <Link href="/profile/edit">
                <CommandButton size="sm">Edit Profile</CommandButton>
              </Link>
              <Link href="/profile/avatar">
                <CommandButton size="sm" variant="outline">Avatar Builder</CommandButton>
              </Link>
            </div>
          )}

          <header className="mb-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              {world.portraitUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={world.portraitUrl}
                  alt={`${world.displayName} portrait`}
                  className="aspect-square w-full max-w-[280px] border-2 border-primary/40 object-cover shadow-[0_0_24px_rgba(56,248,168,0.15)]"
                />
              ) : world.avatar ? (
                <AvatarPreview
                  layers={world.avatar.layers}
                  skinColor={world.avatar.skinColorHex}
                  hairColor={world.avatar.hairColorHex}
                  className="max-w-[280px]"
                />
              ) : (
                <div className="flex aspect-square max-w-[280px] items-center justify-center border border-dashed border-border/60 bg-black/40 p-4 text-center font-mono text-xs text-muted-foreground">
                  No avatar body has been assembled in the mirror chamber.
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Profile World</p>
              <h1 className="font-mono text-4xl tracking-widest uppercase text-foreground md:text-5xl">
                {world.displayName}
              </h1>
              {world.tagline && <p className="text-lg text-muted-foreground">{world.tagline}</p>}
              {world.avatar?.pronouns && (
                <p className="font-mono text-xs text-muted-foreground">{world.avatar.pronouns}</p>
              )}
              {world.motto && (
                <blockquote className="border-l-2 border-primary/50 pl-4 text-sm italic text-foreground/80">
                  {world.motto}
                </blockquote>
              )}
              {world.avatar?.bio && <p className="max-w-2xl text-sm text-foreground/90">{world.avatar.bio}</p>}
              {world.favoriteSignal && (
                <p className="font-mono text-xs text-primary">Signal: {world.favoriteSignal}</p>
              )}
              {world.handle && (
                <p className="font-mono text-[10px] text-muted-foreground">/{world.handle}</p>
              )}
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            <TerminalPanel title="identity.dossier" className="lg:col-span-1">
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

            <TerminalPanel title="faction.standing" className="lg:col-span-1">
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

            <TerminalPanel title="badges" className="lg:col-span-1">
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
          </div>

          {dossier.missionBadges.length > 0 && (
            <TerminalPanel title="mission.records" className="mt-6">
              <ProfileMissionBadgeGrid badges={dossier.missionBadges} />
            </TerminalPanel>
          )}

          {(world.links.length > 0 || world.profileButtons.length > 0) && (
            <TerminalPanel title="net.neighbor.buttons" className="mt-6">
              <div className="flex flex-wrap gap-3">
                {world.profileButtons.map((btn) => (
                  <a
                    key={`${btn.label}-${btn.url}`}
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </TerminalPanel>
          )}

          {world.spotifyEmbedUrl && (
            <TerminalPanel title="signal.soundtrack" className="mt-6">
              <iframe
                title="Spotify playlist"
                src={world.spotifyEmbedUrl}
                className="h-80 w-full max-w-xl border border-border/40"
                loading="lazy"
                allow="encrypted-media"
              />
            </TerminalPanel>
          )}

          {world.showRelicZone && (
            <div className="mt-6">
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
      </div>
    </div>
  );
}
