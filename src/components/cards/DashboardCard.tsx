import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function DashboardCard({
  title,
  description,
  children,
  className,
  icon,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "border-border/60 bg-card/70 backdrop-blur-sm transition-shadow hover:shadow-[0_0_16px_var(--hw-glow)]",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <CardTitle className="font-mono text-sm tracking-wider uppercase">
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
