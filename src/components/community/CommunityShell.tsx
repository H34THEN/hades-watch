import type { ReactNode } from "react";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

interface CommunityShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function CommunityShell({
  children,
  title,
  subtitle,
  className,
}: CommunityShellProps) {
  return (
    <div className={styles.shell}>
      <div className={cn(styles.inner, className)}>
        {(title || subtitle) && (
          <header className={styles.header}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
