export interface NetNeighborCard {
  id: string;
  title: string;
  slug: string;
  url: string;
  description: string | null;
  bannerPath: string | null;
  bannerUrl: string | null;
  tags: string[];
}

interface NetNeighborsWallProps {
  neighbors: NetNeighborCard[];
}

function bannerSrc(neighbor: NetNeighborCard): string | null {
  if (neighbor.bannerPath) {
    return `/api/net-neighbors/banners/${neighbor.id}`;
  }
  if (neighbor.bannerUrl) return neighbor.bannerUrl;
  return null;
}

export function NetNeighborsWall({ neighbors }: NetNeighborsWallProps) {
  if (neighbors.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">
        No approved banners yet. The wall is waiting for small doors.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {neighbors.map((neighbor) => {
        const src = bannerSrc(neighbor);
        return (
          <a
            key={neighbor.id}
            href={neighbor.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${neighbor.title}${neighbor.description ? ` — ${neighbor.description}` : ""}`}
            className="group inline-block border border-border/60 bg-black/30 p-1 transition hover:border-primary/60 hover:shadow-[0_0_12px_rgba(56,248,168,0.25)]"
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`${neighbor.title} banner`}
                width={88}
                height={31}
                className="block h-[31px] w-[88px] object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <span className="flex h-[31px] w-[88px] items-center justify-center bg-muted font-mono text-[8px] text-center">
                {neighbor.title.slice(0, 12)}
              </span>
            )}
            <span className="mt-1 block max-w-[88px] truncate font-mono text-[9px] text-muted-foreground group-hover:text-primary">
              {neighbor.title}
            </span>
          </a>
        );
      })}
    </div>
  );
}
