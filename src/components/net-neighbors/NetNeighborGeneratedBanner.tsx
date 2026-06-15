import type { NetNeighborBannerStyle } from "@/lib/net-neighbors/banner-builder";
import { NetNeighborButton } from "@/components/net-neighbors/NetNeighborButton";

interface NetNeighborGeneratedBannerProps {
  style: NetNeighborBannerStyle;
  className?: string;
  zoom?: number;
}

/** @deprecated Use NetNeighborButton — kept for builder preview compatibility */
export function NetNeighborGeneratedBanner({
  style,
  className,
  zoom,
}: NetNeighborGeneratedBannerProps) {
  return (
    <NetNeighborButton
      title={style.text}
      bannerStyle={style}
      className={className}
      zoom={zoom}
    />
  );
}
