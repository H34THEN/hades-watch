import type { NetNeighborBannerStyle } from "@/lib/net-neighbors/banner-builder";
import styles from "./net-neighbors.module.css";

const PRESET_CLASS: Record<string, string> = {
  "dead-index-violet": styles.presetDeadIndexViolet,
  "styx-neon-rat": styles.presetStyxNeonRat,
  "asclepian-green": styles.presetAsclepianGreen,
  "oracular-blue": styles.presetOracularBlue,
  "daedalus-brass": styles.presetDaedalusBrass,
  "myrmidon-amber": styles.presetMyrmidonAmber,
  "underworld-red": styles.presetUnderworldRed,
  "bone-terminal": styles.presetBoneTerminal,
};

interface NetNeighborGeneratedBannerProps {
  style: NetNeighborBannerStyle;
  className?: string;
}

export function NetNeighborGeneratedBanner({
  style,
  className,
}: NetNeighborGeneratedBannerProps) {
  const presetClass = PRESET_CLASS[style.preset] ?? styles.presetDeadIndexViolet;
  const classes = [
    styles.genBanner,
    presetClass,
    style.scanlines ? styles.genBannerScanlines : "",
    style.flicker ? styles.genBannerFlicker : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{ width: style.width, height: style.height }}
      role="img"
      aria-label={style.text}
    >
      {style.glyph ? (
        <span aria-hidden="true" className="text-[7px] opacity-80">
          {style.glyph}
        </span>
      ) : null}
      <span className="flex flex-col items-center justify-center leading-none">
        <span>{style.text}</span>
        {style.subtext ? (
          <span className="mt-px text-[6px] font-normal opacity-75">{style.subtext}</span>
        ) : null}
      </span>
    </div>
  );
}
