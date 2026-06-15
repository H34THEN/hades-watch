"use client";

import { cn } from "@/lib/utils";
import type { AvatarTransform } from "@/lib/avatar/avatar-registry";
import { DEFAULT_AVATAR_TRANSFORM } from "@/lib/avatar/avatar-registry";

export interface AvatarPreviewLayer {
  key: string;
  src: string;
  zIndex: number;
  transform?: AvatarTransform;
}

interface AvatarLayeredPreviewProps {
  layers: AvatarPreviewLayer[];
  skinColor?: string | null;
  hairColor?: string | null;
  poseTransform?: string;
  className?: string;
}

function layerStyle(transform?: AvatarTransform): React.CSSProperties {
  const t = transform ?? DEFAULT_AVATAR_TRANSFORM;
  const isDefault =
    t.x === 0.5 && t.y === 0.5 && t.scale === 1 && t.rotation === 0;
  if (isDefault) {
    return { zIndex: 1 };
  }
  return {
    left: `${t.x * 100}%`,
    top: `${t.y * 100}%`,
    width: `${t.scale * 100}%`,
    height: `${t.scale * 100}%`,
    transform: `translate(-50%, -50%) rotate(${t.rotation}deg)`,
    zIndex: 1,
  };
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
        {layers.map((layer) => {
          const t = layer.transform;
          const isDefault =
            !t || (t.x === 0.5 && t.y === 0.5 && t.scale === 1 && t.rotation === 0);
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={layer.key}
              src={layer.src}
              alt=""
              className={
                isDefault
                  ? "pointer-events-none absolute inset-0 h-full w-full object-contain"
                  : "pointer-events-none absolute object-contain"
              }
              style={{ ...layerStyle(layer.transform), zIndex: layer.zIndex }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/avatar-assets/placeholders/missing-layer.svg";
              }}
            />
          );
        })}
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
