import styles from "./avatar-hud.module.css";
import { AvatarLayeredPreview } from "@/components/avatar/AvatarLayeredPreview";
import { getPoseBySlug } from "@/lib/avatar/avatar-assets";

export interface AvatarHudStatus {
  speciesName?: string | null;
  poseSlug?: string | null;
  factionName?: string | null;
  hasBackground?: boolean;
  loadStatus?: "stable" | "placeholder" | "empty";
}

interface AvatarHudFrameProps {
  layers: { key: string; src: string; zIndex: number }[];
  skinColor?: string | null;
  hairColor?: string | null;
  poseSlug?: string | null;
  status?: AvatarHudStatus;
  className?: string;
}

export function AvatarHudFrame({
  layers,
  skinColor,
  hairColor,
  poseSlug = "pose-neutral",
  status = {},
  className,
}: AvatarHudFrameProps) {
  const pose = getPoseBySlug(poseSlug ?? "pose-neutral");
  const isEmpty = layers.length === 0 || status.loadStatus === "empty";
  const loadLabel =
    status.loadStatus === "placeholder"
      ? "PLACEHOLDER SIGNAL ACTIVE"
      : isEmpty
        ? "NO BODY ASSEMBLED"
        : "STABLE";

  return (
    <div className={`${styles.avatarHud} ${className ?? ""}`}>
      <div className={styles.hudFrame}>
        <div className={styles.hudTopPlate}>Mirror Chamber // Online</div>
        <div className={`${styles.hudCornerTL}`} />
        <div className={`${styles.hudCornerBR}`} />
        <div className={styles.hudRailLeft} />
        <div className={styles.hudRailRight} />
        <div className={styles.hudReticle} />
        <div className={styles.hudScanline} />
        <span className={`${styles.hudSideLabel} ${styles.hudSideLabelLeft}`}>Body Scan</span>
        <span className={`${styles.hudSideLabel} ${styles.hudSideLabelRight}`}>Relic</span>

        <div className={styles.hudViewport}>
          {isEmpty ? (
            <p className={styles.hudEmpty}>
              NO AVATAR BODY HAS BEEN ASSEMBLED IN THE MIRROR CHAMBER.
            </p>
          ) : (
            <AvatarLayeredPreview
              layers={layers}
              skinColor={skinColor}
              hairColor={hairColor}
              poseTransform={pose?.cssTransform}
              className="h-full w-full max-h-full"
            />
          )}
        </div>

        <div className={styles.hudBottomStrip}>
          <span className={styles.hudChip}>Avatar Load: {loadLabel}</span>
          <span className={styles.hudChip}>Pose: {pose?.label ?? "Neutral"}</span>
          {status.speciesName && (
            <span className={`${styles.hudChip} ${styles.hudChipAccent}`}>
              Species: {status.speciesName}
            </span>
          )}
          {status.factionName && <span className={styles.hudChip}>Cell: {status.factionName}</span>}
          <span className={styles.hudChip}>
            Bg: {status.hasBackground ? "User Signal" : "Default"}
          </span>
        </div>
      </div>
    </div>
  );
}
