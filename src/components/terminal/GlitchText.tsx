import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export function GlitchText({
  children,
  className,
  as: Tag = "span",
}: GlitchTextProps) {
  return (
    <Tag
      className={cn(
        "relative inline-block text-foreground",
        "hover:animate-[glitch_0.4s_ease-in-out]",
        className,
      )}
      data-text={typeof children === "string" ? children : undefined}
    >
      {children}
    </Tag>
  );
}
