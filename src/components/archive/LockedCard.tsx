import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { cn } from "@/lib/utils";

interface LockedCardProps {
  title: string;
  reason?: string;
  className?: string;
}

export function LockedCard({ title, reason = "Clearance required", className }: LockedCardProps) {
  return (
    <TerminalPanel
      title="access.locked"
      status="warning"
      className={cn("opacity-70", className)}
    >
      <p className="font-mono text-sm tracking-wider uppercase text-muted-foreground">
        {title}
      </p>
      <p className="mt-2 text-xs text-destructive/80">{reason}</p>
    </TerminalPanel>
  );
}
