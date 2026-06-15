"use client";

import { cn } from "@/lib/utils";

interface AvatarPreviewProps {
  layers: { key: string; src: string; zIndex: number }[];
  className?: string;
  skinColor?: string | null;
  hairColor?: string | null;
}

export function AvatarPreview({ layers, className, skinColor, hairColor }: AvatarPreviewProps) {
  const skinTint = skinColor ?? undefined;

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden border-2 border-primary/30 bg-[#070b0f] shadow-[0_0_20px_rgba(56,248,168,0.12)]",
        className,
      )}
    >
      {skinColor && (
        <div
          className="pointer-events-none absolute inset-0 z-[5] mix-blend-multiply opacity-35"
          style={{ backgroundColor: skinTint }}
        />
      )}
      {layers.map((layer) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={layer.key}
          src={layer.src}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          style={{ zIndex: layer.zIndex }}
        />
      ))}
      {hairColor && (
        <div
          className="pointer-events-none absolute inset-x-[20%] top-[8%] z-[20] h-[28%] mix-blend-color opacity-50"
          style={{ backgroundColor: hairColor }}
        />
      )}
    </div>
  );
}
