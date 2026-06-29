import type { ReactNode } from "react";
import styles from "@/components/mmo/mmo-hub.module.css";
import { cn } from "@/lib/utils";

export function MmoHubShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

export function MmoHubShellInner({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(styles.inner, className)}>{children}</div>;
}
