import { cn } from "@/lib/utils";

interface AssetPlaceholderProps {
  type: string;
  path: string;
  className?: string;
  aspect?: "square" | "video" | "wide";
}

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
};

export function AssetPlaceholder({
  type,
  path,
  className,
  aspect = "square",
}: AssetPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded border border-dashed border-border bg-muted/30 p-4 font-mono text-xs text-muted-foreground",
        aspectClasses[aspect],
        className,
      )}
    >
      <span className="text-2xl text-primary/40">◇</span>
      <span className="tracking-wider uppercase">{type}</span>
      <span className="max-w-full truncate text-[10px] opacity-60">{path}</span>
    </div>
  );
}
