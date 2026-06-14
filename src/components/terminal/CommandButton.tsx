import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommandButtonProps
  extends React.ComponentProps<typeof Button> {
  prefix?: string;
}

export function CommandButton({
  prefix = ">",
  className,
  children,
  ...props
}: CommandButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "font-mono tracking-wider uppercase",
        "border-primary/40 hover:border-primary hover:shadow-[0_0_12px_var(--hw-glow)]",
        className,
      )}
      {...props}
    >
      <span className="mr-2 text-primary">{prefix}</span>
      {children}
    </Button>
  );
}
