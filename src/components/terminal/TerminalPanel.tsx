import { cn } from "@/lib/utils";

interface TerminalPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  status?: "online" | "offline" | "warning";
}

const statusColors = {
  online: "bg-primary",
  offline: "bg-muted-foreground",
  warning: "bg-destructive",
};

export function TerminalPanel({
  children,
  title,
  className,
  status = "online",
}: TerminalPanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card/80 font-mono shadow-[0_0_24px_var(--hw-glow)] backdrop-blur-sm",
        className,
      )}
    >
      {title && (
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs tracking-wider text-muted-foreground uppercase">
          <span
            className={cn("h-2 w-2 rounded-full", statusColors[status])}
          />
          <span>{title}</span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
