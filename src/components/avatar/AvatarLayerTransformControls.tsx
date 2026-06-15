"use client";

import type { AvatarTransform } from "@/lib/avatar/avatar-registry";
import { DEFAULT_AVATAR_TRANSFORM } from "@/lib/avatar/avatar-registry";
import { Label } from "@/components/ui/label";
import { CommandButton } from "@/components/terminal/CommandButton";

interface AvatarLayerTransformControlsProps {
  label: string;
  transform: AvatarTransform;
  onChange: (transform: AvatarTransform) => void;
  onRemove?: () => void;
}

export function AvatarLayerTransformControls({
  label,
  transform,
  onChange,
  onRemove,
}: AvatarLayerTransformControlsProps) {
  return (
    <div className="space-y-2 border border-border/40 bg-black/20 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-primary">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label className="text-[9px] uppercase">X Position</Label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(transform.x * 100)}
            onChange={(e) => onChange({ ...transform, x: Number(e.target.value) / 100 })}
            className="w-full"
          />
        </div>
        <div>
          <Label className="text-[9px] uppercase">Y Position</Label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(transform.y * 100)}
            onChange={(e) => onChange({ ...transform, y: Number(e.target.value) / 100 })}
            className="w-full"
          />
        </div>
        <div>
          <Label className="text-[9px] uppercase">Scale</Label>
          <input
            type="range"
            min={50}
            max={150}
            value={Math.round(transform.scale * 100)}
            onChange={(e) => onChange({ ...transform, scale: Number(e.target.value) / 100 })}
            className="w-full"
          />
        </div>
        <div>
          <Label className="text-[9px] uppercase">Rotation</Label>
          <input
            type="range"
            min={-45}
            max={45}
            value={transform.rotation}
            onChange={(e) => onChange({ ...transform, rotation: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <CommandButton
          size="sm"
          variant="outline"
          onClick={() => onChange(DEFAULT_AVATAR_TRANSFORM)}
        >
          Reset Position
        </CommandButton>
        {onRemove && (
          <CommandButton size="sm" variant="outline" onClick={onRemove}>
            Remove Item
          </CommandButton>
        )}
      </div>
    </div>
  );
}
