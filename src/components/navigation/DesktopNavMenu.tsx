"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { RoleName, UserAccountStatus } from "@/generated/prisma/client";
import { CommandButton } from "@/components/terminal/CommandButton";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import {
  getVisibleNavGroups,
  type NavContext,
} from "@/lib/navigation/config";
import { NavDropdown } from "@/components/navigation/NavDropdown";
import { getHighestRole } from "@/lib/auth/roles";

interface DesktopNavMenuProps {
  roles: RoleName[];
  accountStatus: UserAccountStatus;
}

export function DesktopNavMenu({ roles, accountStatus }: DesktopNavMenuProps) {
  const pathname = usePathname();
  const ctx: NavContext = {
    isAuthenticated: true,
    accountStatus,
    roles,
  };
  const groups = getVisibleNavGroups(ctx).filter((g) => g.id !== "account");

  return (
    <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary navigation">
      {groups.map((group) => (
        <NavDropdown key={group.id} group={group} ctx={ctx} pathname={pathname} />
      ))}
    </nav>
  );
}

interface AccountMenuProps {
  roles: RoleName[];
  accountStatus: UserAccountStatus;
}

export function AccountMenu({ roles, accountStatus }: AccountMenuProps) {
  const pathname = usePathname();
  const highestRole = getHighestRole(roles);

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <ThemeSwitcher className="w-36" />
      <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        {highestRole}
      </span>
      <Link
        href="/profile/world"
        className={
          pathname === "/profile"
            ? "font-mono text-[10px] tracking-wider text-primary uppercase"
            : "font-mono text-[10px] tracking-wider text-muted-foreground uppercase hover:text-primary"
        }
      >
        Dossier
      </Link>
      {accountStatus === "Pending" && (
        <Link
          href="/pending-approval"
          className="font-mono text-[10px] tracking-wider text-amber-400/90 uppercase hover:text-amber-300"
        >
          Pending
        </Link>
      )}
      <CommandButton size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
        Logout
      </CommandButton>
    </div>
  );
}
