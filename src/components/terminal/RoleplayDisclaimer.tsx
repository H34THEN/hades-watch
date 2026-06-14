import { SystemAlert } from "@/components/terminal/SystemAlert";
import { ROLEPLAY_DISCLAIMER } from "@/lib/clearance";
import { cn } from "@/lib/utils";

export function RoleplayDisclaimer({ className }: { className?: string }) {
  return (
    <SystemAlert
      title="Roleplay System"
      message={ROLEPLAY_DISCLAIMER}
      variant="warning"
      className={cn(className)}
    />
  );
}
