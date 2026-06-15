"use client";

import { cn } from "@/lib/utils";

interface AvatarLayeredPreviewProps {
  layers: { key: string; src: string; zIndex: number }[];
  skinColor?: string | null;
  hairColor?: string | null;
  poseTransform?: string;
  className?: string;
}

export function AvatarLayeredPreview({
  layers,
  skinColor,
  hairColor,
  poseTransform,
  className,
}: AvatarLayeredPreviewProps) {
  return (
    <div className={cn("relative aspect-[3/4] w-full max-w-md", className)}>
      {skinColor && (
        <div
          className="pointer-events-none absolute inset-0 z-[5] mix-blend-multiply opacity-35"
          style={{ backgroundColor: skinColor }}
        />
      )}
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{ transform: poseTransform ?? "none" }}
      >
        {layers.map((layer) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={layer.key}
            src={layer.src}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            style={{ zIndex: layer.zIndex }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/avatar-assets/placeholders/missing-layer.svg";
            }}
          />
        ))}
      </div>
      {hairColor && (
        <div
          className="pointer-events-none absolute inset-x-[18%] top-[6%] z-[20] h-[30%] mix-blend-color opacity-45"
          style={{ backgroundColor: hairColor }}
        />
      )}
    </div>
  );
}
