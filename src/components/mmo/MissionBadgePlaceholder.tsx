import { cn } from "@/lib/utils";

interface MissionBadgePlaceholderProps {
  label: string;
  color?: string | null;
  completion?: boolean;
  status?: "Pending" | "Verified" | "Rejected" | null;
  factionName?: string | null;
  missionTitle?: string | null;
  className?: string;
}

export function MissionBadgePlaceholder({
  label,
  color,
  completion = false,
  status,
  factionName,
  missionTitle,
  className,
}: MissionBadgePlaceholderProps) {
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
    <div
      className={cn(
        "flex w-28 flex-col items-center gap-1 text-center",
        className,
      )}
      title={[factionName, missionTitle, statusLabel].filter(Boolean).join(" · ")}
    >
      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center border-2 bg-background/60 p-2 font-mono text-[9px] leading-tight font-semibold tracking-wider uppercase",
          completion && "ring-1 ring-primary/40",
        )}
        style={{ borderColor: `${borderColor}99`, color: borderColor }}
      >
        {label}
      </div>
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
