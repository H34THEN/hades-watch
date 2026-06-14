import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DossierBadge } from "@/lib/dossier";

interface DossierBadgeListProps {
  badges: DossierBadge[];
  className?: string;
}

export function DossierBadgeList({ badges, className }: DossierBadgeListProps) {
  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => (
        <Badge
          key={badge.id}
          variant="outline"
          title={badge.description}
          className="border-primary/40 bg-primary/5 font-mono text-[10px] tracking-wider text-primary"
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  );
}
