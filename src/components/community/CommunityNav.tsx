import Link from "next/link";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

const links = [
  { href: "/community", label: "Hub" },
  { href: "/community/builder", label: "Builder" },
  { href: "/community/forums", label: "Forums" },
  { href: "/community/volunteer", label: "Volunteer" },
  { href: "/community/guilds", label: "Guilds" },
  { href: "/community/recognition", label: "Recognition" },
  { href: "/community/lore", label: "Lore" },
] as const;

export function CommunityNav({ active }: { active?: string }) {
  return (
    <nav className={styles.nav} aria-label="Community signals">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            styles.navLink,
            active === link.href ? styles.navLinkActive : styles.navLinkIdle,
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
