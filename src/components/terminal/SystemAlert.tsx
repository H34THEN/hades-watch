import { cn } from "@/lib/utils";

interface SystemAlertProps {
  title: string;
  message: string;
  variant?: "info" | "warning" | "error" | "success";
  className?: string;
}

const variants = {
  info: "border-primary/50 text-primary",
  warning: "border-destructive/50 text-destructive",
  error: "border-destructive text-destructive bg-destructive/10",
  success: "border-primary/50 text-primary bg-primary/5",
};

export function SystemAlert({
  title,
  message,
  variant = "info",
  className,
}: SystemAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded border-l-4 bg-card/60 p-4 font-mono text-sm backdrop-blur-sm",
        variants[variant],
        className,
      )}
    >
      <p className="mb-1 text-xs tracking-widest uppercase">{title}</p>
      <p className="text-foreground/80">{message}</p>
    </div>
  );
}
