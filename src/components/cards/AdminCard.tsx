import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  status?: "online" | "offline" | "degraded" | "locked";
}

export function AdminCard({
  title,
  description,
  children,
  className,
  status = "locked",
}: AdminCardProps) {
  return (
    <Card
      className={cn(
        "border-destructive/20 bg-card/80",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="font-mono text-sm tracking-wider uppercase">
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
