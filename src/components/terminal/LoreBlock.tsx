import { cn } from "@/lib/utils";

interface LoreBlockProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  epoch?: string;
}

export function LoreBlock({ title, children, className, epoch }: LoreBlockProps) {
  return (
    <blockquote
      className={cn(
        "border-l-2 border-primary/40 pl-4 font-mono text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <p className="mb-2 text-xs tracking-widest text-primary uppercase">
        {title}
        {epoch && (
          <span className="ml-2 text-muted-foreground">{"// "}{epoch}</span>
        )}
      </p>
      <div className="text-foreground/80">{children}</div>
    </blockquote>
  );
}
