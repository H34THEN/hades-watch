import type { ReactNode } from "react";
import styles from "@/components/layout/page-shell.module.css";
import { cn } from "@/lib/utils";

export type PageShellVariant =
  | "narrow"
  | "standard"
  | "wide"
  | "dashboard"
  | "full"
  | "bleed"
  | "split";

const VARIANT_CLASS: Record<PageShellVariant, string> = {
  narrow: styles.variantNarrow,
  standard: styles.variantStandard,
  wide: styles.variantWide,
  dashboard: styles.variantDashboard,
  full: styles.variantFull,
  bleed: styles.variantBleed,
  split: styles.variantSplit,
};

export interface PageShellProps {
  children: ReactNode;
  variant?: PageShellVariant;
  className?: string;
  contentClassName?: string;
  scanlines?: boolean;
  bleed?: boolean;
  as?: "div" | "main" | "section";
}

export function PageShell({
  children,
  variant = "dashboard",
  className,
  contentClassName,
  scanlines = false,
  bleed = false,
  as: Tag = "div",
}: PageShellProps) {
  return (
    <Tag
      className={cn(
        styles.shell,
        scanlines && styles.shellRelative,
        scanlines && styles.scanlines,
        className,
      )}
    >
      <div
        className={cn(
          styles.inner,
          VARIANT_CLASS[variant],
          scanlines && styles.innerRaised,
          contentClassName,
        )}
      >
        {children}
      </div>
      {bleed ? null : null}
    </Tag>
  );
}

/** Readable prose block inside wide dashboards. */
export function Readable({
  children,
  wide = false,
  className,
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(wide ? "hw-readable-wide" : "hw-readable", className)}>
      {children}
    </div>
  );
}
