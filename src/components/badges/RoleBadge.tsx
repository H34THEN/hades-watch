import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RoleName =
  | "Owner"
  | "Admin"
  | "Moderator"
  | "Expert"
  | "Gamer"
  | "Member"
  | "Guest";

const roleStyles: Record<RoleName, string> = {
  Owner: "border-destructive text-destructive bg-destructive/10",
  Admin: "border-primary text-primary bg-primary/10",
  Moderator: "border-accent-foreground/50 text-accent-foreground",
  Expert: "border-secondary-foreground/50 text-secondary-foreground",
  Gamer: "border-primary/40 text-primary/80",
  Member: "border-border text-muted-foreground",
  Guest: "border-muted text-muted-foreground/60",
};

export function RoleBadge({
  role,
  className,
}: {
  role: RoleName;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-[10px] tracking-wider", roleStyles[role], className)}
    >
      {role.toUpperCase()}
    </Badge>
  );
}
