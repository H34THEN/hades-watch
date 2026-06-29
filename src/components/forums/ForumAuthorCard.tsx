import Link from "next/link";
import styles from "@/components/forums/forums.module.css";
import {
  forumGeneratedGlyph,
  forumGeneratedTheme,
  forumProfileImageUrl,
} from "@/lib/forums/identity-display";
import { resolveForumCallsign } from "@/lib/forums/callsign";
import { cn } from "@/lib/utils";
import { ForumSignatureButton, type ForumSignatureAssetView } from "@/components/forums/ForumSignatureButton";

export type ForumAuthorView = {
  id: string;
  name: string | null;
  email: string;
  activeTitle?: string | null;
  character?: {
    callsign: string | null;
    avatarUrl?: string | null;
    faction?: { slug: string; name: string } | null;
  } | null;
  forumProfile?: {
    displayName: string | null;
    forumImageSource: string;
    forumImagePath: string | null;
    forumImageAlt: string | null;
    generatedImageConfig: unknown;
    statusLine: string | null;
    selectedTitleSlug: string | null;
    factionSlug: string | null;
    signatureText: string | null;
    signatureMode?: string;
    showBadges?: boolean;
    showReputation?: boolean;
    showProfileWorldLink?: boolean;
    stylePreset?: string | null;
    hoverEffect?: string | null;
    moderationStatus?: string;
    activeButton?: ForumSignatureAssetView | null;
    activeBanner?: ForumSignatureAssetView | null;
  } | null;
};

interface ForumAuthorCardProps {
  author: ForumAuthorView;
  createdAt?: Date;
  isOp?: boolean;
  compact?: boolean;
  showSignatureButton?: boolean;
}

export function ForumAuthorCard({
  author,
  createdAt,
  isOp,
  compact = false,
  showSignatureButton = false,
}: ForumAuthorCardProps) {
  const callsign = resolveForumCallsign(author);
  const profile = author.forumProfile;
  const hidden = profile?.moderationStatus === "HIDDEN";
  const imageUrl = !hidden
    ? forumProfileImageUrl(
        author.id,
        (profile?.forumImageSource as "UPLOADED" | "AVATAR" | "FACTION_ICON" | "GENERATED") ??
          "GENERATED",
        profile?.forumImagePath,
        author.character?.avatarUrl,
      )
    : null;
  const glyph = forumGeneratedGlyph(
    callsign,
    profile?.generatedImageConfig as { glyph?: string },
  );
  const theme = forumGeneratedTheme(profile?.generatedImageConfig as { theme?: string });
  const faction = profile?.factionSlug ?? author.character?.faction?.slug ?? null;
  const title = author.activeTitle ?? profile?.selectedTitleSlug ?? null;
  const hover = profile?.hoverEffect ?? "soft-glow";

  return (
    <div className={cn(styles.authorCard, compact && styles.authorCardCompact)}>
      <div
        className={cn(
          styles.forumAvatar,
          styles[`avatarTheme_${theme}`],
          styles[`hover_${hover}`],
          faction && styles[`factionRing_${faction}`],
        )}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={profile?.forumImageAlt ?? `${callsign} forum profile`}
            className={styles.forumAvatarImg}
          />
        ) : (
          <span className={styles.forumAvatarGlyph} aria-hidden="true">
            {glyph}
          </span>
        )}
      </div>

      <div className={styles.authorMeta}>
        <div className={styles.authorLine}>
          <Link href={`/profile/${encodeURIComponent(callsign)}`} className={styles.authorCallsign}>
            {callsign}
          </Link>
          {isOp && <span className={styles.opBadge}>OP</span>}
          {title && <span className={styles.titleChip}>{title}</span>}
          {faction && (
            <span className={cn(styles.factionChip, styles[`faction_${faction}`])}>
              {author.character?.faction?.name ?? faction}
            </span>
          )}
        </div>
        {profile?.statusLine && !compact && (
          <p className={styles.statusLine}>{profile.statusLine}</p>
        )}
        {createdAt && <p className={styles.authorTimestamp}>{createdAt.toLocaleString()}</p>}
        {showSignatureButton && profile?.activeButton && profile.moderationStatus !== "HIDDEN" && (
          <ForumSignatureButton asset={profile.activeButton} compact />
        )}
      </div>
    </div>
  );
}

export function ForumSignatureBlock({
  author,
  mode = "COMPACT",
}: {
  author: ForumAuthorView;
  mode?: "COMPACT" | "FULL" | "HIDDEN";
}) {
  if (mode === "HIDDEN") return null;

  const profile = author.forumProfile;
  if (!profile || profile.moderationStatus === "HIDDEN") return null;

  const callsign = resolveForumCallsign(author);

  return (
    <div className={cn(styles.signatureBlock, mode === "COMPACT" && styles.signatureCompact)}>
      {profile.activeButton && <ForumSignatureButton asset={profile.activeButton} compact={mode === "COMPACT"} />}
      {profile.activeBanner && mode === "FULL" && (
        <ForumSignatureButton asset={profile.activeBanner} />
      )}
      <p className={styles.signatureText}>
        {profile.signatureText ?? (
          <>
            {callsign}
            {author.activeTitle ? ` · ${author.activeTitle}` : ""}
            {profile.factionSlug ? ` · ${profile.factionSlug}` : ""}
          </>
        )}
      </p>
    </div>
  );
}
