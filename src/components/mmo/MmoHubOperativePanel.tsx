import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import type { MmoHubContext } from "@/lib/mmo/hub-types";
import styles from "@/components/mmo/mmo-hub.module.css";

interface MmoHubOperativePanelProps {
  context: MmoHubContext;
}

export function MmoHubOperativePanel({ context }: MmoHubOperativePanelProps) {
  const { character, allianceMark, badgeCount, hasAvatar } = context;

  if (!character) {
    return (
      <section className={styles.operativePanel} aria-labelledby="operative-heading">
        <div className={styles.operativeGrid}>
          <div>
            <h2 id="operative-heading" className={styles.sectionTitle}>
              Operative Command
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              No operative dossier has stabilized yet.
            </p>
          </div>
          <div className={styles.operativeActions}>
            <Link href="/mmo/character">
              <CommandButton size="sm">Create Character</CommandButton>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const profileHref = `/profile/${encodeURIComponent(character.callsign)}`;

  return (
    <section className={styles.operativePanel} aria-labelledby="operative-heading">
      <div className={styles.operativeGrid}>
        <div>
          <h2 id="operative-heading" className={styles.sectionTitle}>
            Operative Command
          </h2>
          <p className={styles.callsign}>{character.callsign}</p>
          <p className={styles.operativeMeta}>
            {character.archetype ?? "Unclassified"}
            {" · "}
            {character.factionName ?? "Unaffiliated"}
            {allianceMark ? ` · ${allianceMark.name} mark` : ""}
            {" · "}
            {badgeCount} mark{badgeCount !== 1 ? "s" : ""}
            {!hasAvatar ? " · No avatar saved" : ""}
          </p>
        </div>
        <div className={styles.operativeActions}>
          <Link href="/mmo/character">
            <CommandButton size="sm" variant="outline">
              Edit Character
            </CommandButton>
          </Link>
          <Link href={profileHref}>
            <CommandButton size="sm" variant="outline">
              Profile World
            </CommandButton>
          </Link>
          {context.isApproved && (
            <Link href="/profile/avatar">
              <CommandButton size="sm" variant="outline">
                Avatar Builder
              </CommandButton>
            </Link>
          )}
          <Link href="/profile">
            <CommandButton size="sm">Open Dossier</CommandButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
