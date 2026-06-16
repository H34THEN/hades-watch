"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BadgeRecordDisplayProps {
  name: string;
  label: string;
  color?: string | null;
  assetPath?: string | null;
  completion?: boolean;
  capstone?: boolean;
  status?: "Pending" | "Verified" | "Rejected" | null;
  className?: string;
}

export function BadgeRecordDisplay({
  name,
  label,
  color,
  assetPath,
  completion = false,
  capstone = false,
  status,
  className,
}: BadgeRecordDisplayProps) {
  const borderColor = color ?? "var(--primary)";
  const statusLabel =
    status === "Pending"
      ? "Pending Review"
      : status === "Rejected"
        ? "Rejected"
        : status === "Verified"
          ? "Verified"
          : null;

  return (
    <div className={cn("flex w-28 flex-col items-center gap-1 text-center", className)}>
      <div
        className={cn(
          "relative flex aspect-square w-full items-center justify-center overflow-hidden border-2 bg-background/60 p-1 font-mono text-[9px] leading-tight font-semibold tracking-wider uppercase",
          (completion || capstone) && "ring-1 ring-primary/40",
          capstone && "ring-2 ring-primary/60",
        )}
        style={{ borderColor: `${borderColor}99`, color: borderColor }}
        title={name}
      >
        {assetPath ? (
          <Image
            src={assetPath}
            alt={name}
            fill
            className="object-contain p-1"
            sizes="112px"
            unoptimized
          />
        ) : (
          <span className="p-2">{label}</span>
        )}
      </div>
      <p className="max-w-28 text-center font-mono text-[8px] text-muted-foreground">
        {name}
      </p>
      {statusLabel && (
        <span
          className={cn(
            "font-mono text-[8px] tracking-wider uppercase",
            status === "Verified" && "text-emerald-500/80",
            status === "Pending" && "text-amber-400/80",
            status === "Rejected" && "text-destructive/80",
          )}
        >
          {statusLabel}
        </span>
      )}
    </div>
  );
}
