import type { NetNeighborPublicCard } from "@/lib/queries/net-neighbors";
import { NetNeighborButton } from "@/components/net-neighbors/NetNeighborButton";
import styles from "./net-neighbors.module.css";

interface NetNeighborBannerWallProps {
  neighbors: NetNeighborPublicCard[];
  emptyMessage?: string;
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
        const tip = `${neighbor.title}${neighbor.description ? ` — ${neighbor.description}` : ""}`;
        return (
          <NetNeighborButton
            key={neighbor.id}
            neighborId={neighbor.id}
            title={tip}
            href={neighbor.url}
            bannerPath={neighbor.bannerPath}
            bannerUrl={neighbor.bannerUrl}
            bannerText={neighbor.bannerText}
            bannerStyle={neighbor.bannerStyle}
          />
        );
      })}
    </div>
  );
}
