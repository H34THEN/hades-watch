import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-border/60 bg-card/50 py-8",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs tracking-wider uppercase">
          Hades Watch // Unauthorized access is logged
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/themes" className="hover:text-primary">
            Themes
          </Link>
          <Link href="/invite" className="hover:text-primary">
            Invite
          </Link>
        </div>
      </div>
    </footer>
  );
}
