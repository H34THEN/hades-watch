import Link from "next/link";
import { AvatarHudFrame } from "@/components/avatar/AvatarHudFrame";
import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import type { DossierData } from "@/lib/queries/dossier";
import type { ProfileWorldData } from "@/lib/queries/profile-world";
import styles from "@/components/profile/profile-pages.module.css";

interface CharacterDossierPageProps {
  dossier: DossierData | null;
  world: ProfileWorldData | null;
  character: {
    callsign: string;
    bio: string | null;
    isPublic: boolean;
    archetype: string | null;
  } | null;
  isApproved: boolean;
  rewardStats?: {
    avatarUnlocks: number;
    titles: number;
    loot: number;
  };
}

export function CharacterDossierPage({
  dossier,
  world,
  character,
  isApproved,
  rewardStats,
}: CharacterDossierPageProps) {
  if (!character || !dossier) {
    return (
      <ProfilePageShell
        title="CHARACTER DOSSIER // OPERATIVE RECORD"
        subtitle="Your stabilized Underwatch identity, field marks, faction alignment, and public callsign record."
      >
        <div className={styles.emptyState}>
          <p>No operative dossier has stabilized yet.</p>
          <Link href="/mmo/character">
            <CommandButton>Stabilize Character</CommandButton>
          </Link>
        </div>
      </ProfilePageShell>
    );
  }

  const badgeCount =
    dossier.badges.length + dossier.dbBadges.length + dossier.missionBadges.length;
  const factionName = dossier.faction?.name ?? dossier.allianceMembership?.name ?? null;
  const avatarLayers = world?.avatar?.layers ?? [];
  const visibilityLabel = character.isPublic ? "Public" : "Private";

  return (
    <ProfilePageShell
      title="CHARACTER DOSSIER // OPERATIVE RECORD"
      subtitle="Your stabilized Underwatch identity, field marks, faction alignment, and public callsign record."
      actions={
        <>
          <Link href="/mmo/character">
            <CommandButton size="sm">Edit Character</CommandButton>
          </Link>
          {isApproved ? (
            <Link href="/profile/avatar">
              <CommandButton size="sm" variant="outline">
                Open Avatar Builder
              </CommandButton>
            </Link>
          ) : null}
        </>
      }
    >
      <div className={styles.dossierGrid}>
        <div className="space-y-4">
          <div className={styles.dossierCard}>
            <p className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase">
              Operative Identity
            </p>
            <h2 className="mt-2 font-mono text-2xl tracking-widest uppercase text-foreground">
              {world?.displayName ?? dossier.codename}
            </h2>
            <p className="mt-1 font-mono text-sm text-primary">{character.callsign}</p>
            {world?.avatar?.tagline || character.bio ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {world?.avatar?.tagline ?? character.bio}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={styles.factionTag}>{dossier.accountStatus}</span>
              {dossier.isAdminViewer ? (
                <span className={styles.factionTag}>Admin Viewer</span>
              ) : null}
              {dossier.allianceMembership ? (
                <span className={styles.factionTag}>{dossier.allianceMembership.name}</span>
              ) : null}
              {dossier.faction ? (
                <span className={styles.factionTag}>{dossier.faction.name}</span>
              ) : null}
              <span className={styles.factionTag}>{visibilityLabel} Profile</span>
            </div>

            <dl className={`${styles.dossierMeta} mt-5`}>
              <div>
                <dt>Callsign</dt>
                <dd>{character.callsign}</dd>
              </div>
              <div>
                <dt>Display Name</dt>
                <dd>{world?.displayName ?? dossier.codename}</dd>
              </div>
              <div>
                <dt>Active Title</dt>
                <dd>{dossier.activeTitle}</dd>
              </div>
              <div>
                <dt>Clearance</dt>
                <dd>{dossier.clearance.label}</dd>
              </div>
              {world?.avatar?.speciesName ? (
                <div>
                  <dt>Species / Presentation</dt>
                  <dd>{world.avatar.speciesName}</dd>
                </div>
              ) : null}
              {character.archetype ? (
                <div>
                  <dt>Archetype</dt>
                  <dd>{character.archetype}</dd>
                </div>
              ) : null}
            </dl>

            <div className={styles.dossierActions}>
              <Link href="/profile/badges">
                <CommandButton size="sm" variant="outline">
                  View Badge Case ({badgeCount})
                </CommandButton>
              </Link>
              <Link href="/profile/relic-zone">
                <CommandButton size="sm" variant="outline">
                  Enter Relic Zone
                </CommandButton>
              </Link>
              <Link href="/profile/world">
                <CommandButton size="sm" variant="outline">
                  View Profile World
                </CommandButton>
              </Link>
            </div>
          </div>

          <TerminalPanel title="progression.summary">
            <dl className={styles.dossierMeta}>
              <div>
                <dt>Missions Completed</dt>
                <dd>{dossier.history.missionsCompleted}</dd>
              </div>
              <div>
                <dt>Active Missions</dt>
                <dd>{dossier.history.activeMissions}</dd>
              </div>
              <div>
                <dt>Ciphers Solved</dt>
                <dd>{dossier.history.ciphersSolved}</dd>
              </div>
              <div>
                <dt>Lore Unlocks</dt>
                <dd>{dossier.history.loreUnlocks}</dd>
              </div>
              {dossier.faction ? (
                <div>
                  <dt>Faction Reputation</dt>
                  <dd>{dossier.faction.reputation}</dd>
                </div>
              ) : null}
              {rewardStats && (
                <>
                  <div>
                    <dt>Avatar Unlocks</dt>
                    <dd>{rewardStats.avatarUnlocks}</dd>
                  </div>
                  <div>
                    <dt>Earned Titles</dt>
                    <dd>{rewardStats.titles}</dd>
                  </div>
                  <div>
                    <dt>Loot / Relics</dt>
                    <dd>{rewardStats.loot}</dd>
                  </div>
                </>
              )}
            </dl>
          </TerminalPanel>
        </div>

        <aside>
          <AvatarHudFrame
            layers={avatarLayers}
            skinColor={world?.avatar?.skinColorHex ?? null}
            hairColor={world?.avatar?.hairColorHex ?? null}
            poseSlug={world?.avatar?.poseSlug ?? "pose-neutral"}
            status={{
              speciesName: world?.avatar?.speciesName,
              poseSlug: world?.avatar?.poseSlug,
              factionName,
              hasBackground: world?.avatar?.hasCustomBackground ?? false,
              loadStatus: avatarLayers.length > 0 ? "stable" : "empty",
            }}
          />
          {!world?.avatar && isApproved ? (
            <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground">
              <Link href="/profile/avatar" className="text-primary hover:underline">
                Open Avatar Builder
              </Link>
            </p>
          ) : null}
        </aside>
      </div>
    </ProfilePageShell>
  );
}
