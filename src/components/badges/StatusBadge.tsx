import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "online" | "offline" | "degraded" | "locked";

const statusConfig: Record<
  Status,
  { label: string; className: string }
> = {
  online: {
    label: "ONLINE",
    className: "border-primary/50 text-primary bg-primary/10",
  },
  offline: {
    label: "OFFLINE",
    className: "border-muted-foreground/50 text-muted-foreground",
  },
  degraded: {
    label: "DEGRADED",
    className: "border-destructive/50 text-destructive bg-destructive/10",
  },
  locked: {
    label: "LOCKED",
    className: "border-destructive text-destructive",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-[10px] tracking-widest", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
