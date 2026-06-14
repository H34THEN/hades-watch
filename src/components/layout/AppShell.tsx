import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeOverlays } from "@/components/theme/ThemeOverlays";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export function AppShell({
  children,
  className,
  hideHeader,
  hideFooter,
}: AppShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <ThemeOverlays />
      {!hideHeader && <SiteHeader />}
      <main className={cn("relative z-10 flex-1", className)}>{children}</main>
      {!hideFooter && <SiteFooter />}
    </div>
  );
}
