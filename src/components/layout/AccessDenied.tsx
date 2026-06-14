import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { SystemAlert } from "@/components/terminal/SystemAlert";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  requiredRole?: string;
}

export function AccessDenied({
  title = "Access Denied",
  message = "You do not have clearance for this sector.",
  requiredRole,
}: AccessDeniedProps) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <TerminalPanel title="security.clearance" status="warning">
        <SystemAlert title={title} message={message} variant="error" />
        {requiredRole && (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Required clearance:{" "}
            <span className="text-destructive">{requiredRole}</span>
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login">
            <CommandButton>Authenticate</CommandButton>
          </Link>
          <Link href="/dashboard">
            <CommandButton prefix="$" variant="outline">
              Return to Dashboard
            </CommandButton>
          </Link>
        </div>
      </TerminalPanel>
    </div>
  );
}
