import type { NetNeighborBannerStyle } from "@/lib/net-neighbors/banner-builder";
import {
  getGradientCss,
  normalizeBannerStyle,
  parseBannerStyleJson,
} from "@/lib/net-neighbors/banner-builder";
import styles from "./net-neighbors.module.css";

export interface NetNeighborButtonProps {
  title: string;
  bannerPath?: string | null;
  bannerUrl?: string | null;
  bannerText?: string | null;
  bannerStyle?: unknown;
  neighborId?: string;
  href?: string;
  zoom?: number;
  showTitleOnHover?: boolean;
  className?: string;
}

function resolveStyle(raw: unknown): NetNeighborBannerStyle | null {
  if (!raw) return null;
  if (typeof raw === "object") {
    return parseBannerStyleJson(raw) ?? normalizeBannerStyle(raw as Partial<NetNeighborBannerStyle>);
  }
  return null;
}

function imageSrc(props: NetNeighborButtonProps): string | null {
  if (props.bannerPath && props.neighborId) {
    return `/api/net-neighbors/banners/${props.neighborId}`;
  }
  if (props.bannerUrl) return props.bannerUrl;
  return null;
}

function iconSrc(props: NetNeighborButtonProps, style: NetNeighborBannerStyle): string | null {
  if (style.iconPreviewUrl) return style.iconPreviewUrl;
  if (style.iconPath && props.neighborId) {
    return `/api/net-neighbors/banners/${props.neighborId}?slot=icon`;
  }
  return null;
}

function BannerInner({
  props,
  style,
}: {
  props: NetNeighborButtonProps;
  style: NetNeighborBannerStyle | null;
}) {
  const src = imageSrc(props);
  const w = style?.width ?? 88;
  const h = style?.height ?? 31;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${props.title} banner`}
        width={w}
        height={h}
        className={styles.netNeighborButtonImg}
        style={{ width: w, height: h }}
      />
    );
  }

  if (style) {
    const icon = iconSrc(props, style);
    const alignMap = {
      left: "flex-start",
      center: "center",
      right: "flex-end",
      top: "flex-start",
      middle: "center",
      bottom: "flex-end",
    } as const;

    return (
      <div
        className={[
          styles.netNeighborButton,
          style.scanlines ? styles.genBannerScanlines : "",
          style.flicker ? styles.genBannerFlicker : "",
          style.glow ? styles.bannerGlow : "",
          style.cornerBrackets ? styles.cornerBrackets : "",
          style.pixelBorder ? styles.pixelBorder : "",
          style.warningStripe ? styles.warningStripe : "",
          style.terminalGrid ? styles.terminalGrid : "",
          style.blinkingDot ? styles.blinkingDot : "",
          style.underlineRail ? styles.underlineRail : "",
          style.factionAccent ? styles[`faction_${style.factionAccent}`] : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          width: w,
          height: h,
          color: style.textColor,
          background: getGradientCss(style.gradientPreset),
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth,
          borderStyle: style.borderStyle,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          textDecoration: style.textDecoration,
          justifyContent: alignMap[style.textAlign] ?? "center",
          alignItems: alignMap[style.verticalAlign] ?? "center",
          textShadow: style.textShadow ? `0 0 4px ${style.accentColor}` : undefined,
        }}
        role="img"
        aria-label={style.text}
      >
        {icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon}
            alt=""
            className={styles.bannerIcon}
            style={{
              width: style.imageWidth,
              height: style.imageHeight,
              opacity: style.iconOpacity,
              imageRendering: style.pixelArtMode ? "pixelated" : "auto",
              marginLeft: style.iconOffsetX,
              marginTop: style.iconOffsetY,
            }}
          />
        )}
        {!icon && style.glyph ? (
          <span aria-hidden="true" className={styles.bannerGlyph}>
            {style.glyph}
          </span>
        ) : null}
        <span
          className={styles.bannerTextBlock}
          style={{
            transform: `translate(${style.textOffsetX}px, ${style.textOffsetY}px)`,
            textAlign: style.textAlign,
          }}
        >
          <span className={styles.bannerMainText}>{style.text}</span>
          {style.subtext ? (
            <span className={styles.bannerSubText}>{style.subtext}</span>
          ) : null}
        </span>
      </div>
    );
  }

  const fallback = (props.bannerText ?? props.title).slice(0, 12) || "VISIT";
  return (
    <div
      className={styles.netNeighborButton}
      style={{ width: w, height: h }}
      role="img"
      aria-label={fallback}
    >
      <span className={styles.bannerMainText}>{fallback}</span>
    </div>
  );
}

export function NetNeighborButton(props: NetNeighborButtonProps) {
  const style = resolveStyle(props.bannerStyle);
  const w = style?.width ?? 88;
  const h = style?.height ?? 31;
  const zoom = props.zoom ?? 1;
  const tip = props.title;

  const inner = (
    <div
      className={[styles.buttonWrap, props.className ?? ""].filter(Boolean).join(" ")}
      style={zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: "top left" } : undefined}
    >
      <BannerInner props={props} style={style} />
    </div>
  );

  if (props.href) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        title={tip}
        className={styles.bannerLinkCompact}
        style={{ width: w * zoom, height: h * zoom }}
      >
        {inner}
      </a>
    );
  }

  return inner;
}
