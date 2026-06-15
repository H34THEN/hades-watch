import type { NetNeighborPublicCard } from "@/lib/queries/net-neighbors";
import { NetNeighborGeneratedBanner } from "@/components/net-neighbors/NetNeighborGeneratedBanner";
import styles from "./net-neighbors.module.css";

interface NetNeighborBannerWallProps {
  neighbors: NetNeighborPublicCard[];
  emptyMessage?: string;
}

function bannerImageSrc(neighbor: NetNeighborPublicCard): string | null {
  if (neighbor.bannerPath) {
    return `/api/net-neighbors/banners/${neighbor.id}`;
  }
  if (neighbor.bannerUrl) return neighbor.bannerUrl;
  return null;
}

export function NetNeighborBannerWall({
  neighbors,
  emptyMessage = "No neighboring signals have cleared the Underwatch yet.",
}: NetNeighborBannerWallProps) {
  if (neighbors.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <div className={styles.bannerWall}>
      {neighbors.map((neighbor) => {
        const src = bannerImageSrc(neighbor);
        const title = neighbor.title;
        const tip = `${title}${neighbor.description ? ` — ${neighbor.description}` : ""}`;

        return (
          <a
            key={neighbor.id}
            href={neighbor.url}
            target="_blank"
            rel="noopener noreferrer"
            title={tip}
            className={styles.bannerLink}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`${title} banner`}
                width={88}
                height={31}
                className="block object-contain"
                style={{ width: 88, height: 31, imageRendering: "pixelated" }}
              />
            ) : neighbor.bannerStyle ? (
              <NetNeighborGeneratedBanner style={neighbor.bannerStyle} />
            ) : (
              <span
                className="flex items-center justify-center bg-muted font-mono text-[8px] text-center"
                style={{ width: 88, height: 31 }}
              >
                {(neighbor.bannerText ?? title).slice(0, 14)}
              </span>
            )}
            <span className={styles.bannerLabel}>{title}</span>
          </a>
        );
      })}
    </div>
  );
}
