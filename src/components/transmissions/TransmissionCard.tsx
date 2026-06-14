import { Badge } from "@/components/ui/badge";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { cn } from "@/lib/utils";
import type { TransmissionPriority } from "@/generated/prisma/client";

interface TransmissionCardProps {
  title: string;
  body: string;
  priority: TransmissionPriority;
  pinned: boolean;
  publishedAt: Date | null;
  authorName?: string | null;
  audienceRole?: string | null;
}

const priorityStyles: Record<TransmissionPriority, string> = {
  Low: "border-border text-muted-foreground",
  Normal: "border-primary/30 text-primary",
  High: "border-destructive/40 text-destructive bg-destructive/5",
  Critical: "border-destructive text-destructive bg-destructive/10 shadow-[0_0_16px_var(--hw-glow)]",
};

const priorityLabels: Record<TransmissionPriority, string> = {
  Low: "LOW",
  Normal: "NORMAL",
  High: "HIGH",
  Critical: "CRITICAL",
};

export function TransmissionCard({
  title,
  body,
  priority,
  pinned,
  publishedAt,
  authorName,
  audienceRole,
}: TransmissionCardProps) {
  return (
    <TerminalPanel
      title={pinned ? "transmission.pinned" : "transmission.incoming"}
      status={priority === "Critical" ? "warning" : "online"}
      className={cn(
        priority === "Critical" && "ring-1 ring-destructive/50",
        pinned && "ring-1 ring-primary/30",
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={cn("font-mono text-[10px] tracking-widest", priorityStyles[priority])}
        >
          {priorityLabels[priority]}
        </Badge>
        {pinned && (
          <Badge variant="outline" className="font-mono text-[10px] tracking-widest">
            PINNED
          </Badge>
        )}
        {audienceRole && (
          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
            {audienceRole.toUpperCase()} ONLY
          </Badge>
        )}
      </div>
      <h3 className="mb-2 font-mono text-sm font-semibold tracking-wider uppercase">
        {title}
      </h3>
      <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
        {body}
      </p>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{authorName ?? "Network Command"}</span>
        <span>
          {publishedAt
            ? publishedAt.toLocaleString()
            : "Pending sync"}
        </span>
      </div>
    </TerminalPanel>
  );
}
