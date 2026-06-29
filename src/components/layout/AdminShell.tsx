import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";

interface AdminShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AdminShell({ children, className, contentClassName }: AdminShellProps) {
  return (
    <PageShell variant="dashboard" scanlines className={className} contentClassName={contentClassName}>
      {children}
    </PageShell>
  );
}
