import Link from "next/link";
import type { ReactNode } from "react";
import styles from "@/components/profile/profile-pages.module.css";

interface ProfilePageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function ProfilePageShell({ title, subtitle, children, actions }: ProfilePageShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Underwatch · Operative Systems</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {actions ? <div className={styles.headerActions}>{actions}</div> : null}
        </header>
        <nav className={styles.subNav} aria-label="Profile systems">
          <Link href="/profile/dossier" className={styles.subNavLink}>
            Dossier
          </Link>
          <Link href="/profile/badges" className={styles.subNavLink}>
            Badge Case
          </Link>
          <Link href="/profile/relic-zone" className={styles.subNavLink}>
            Relic Zone
          </Link>
          <Link href="/profile/world" className={styles.subNavLink}>
            Profile World
          </Link>
          <Link href="/profile/avatar" className={styles.subNavLink}>
            Avatar Builder
          </Link>
        </nav>
        {children}
      </div>
    </div>
  );
}
